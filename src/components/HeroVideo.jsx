import { useRef, useEffect, useMemo, useState } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

// ---------------------------------------------------------------------------
// GPU chroma-key shader — replaces the old per-frame CPU getImageData loop.
//
// The fragment shader discards/alpha-fades near-white pixels using the same
// LO=220 HI=245 thresholds (normalised to 0–1 for GLSL).  This runs on the
// GPU so it's essentially free compared to reading back every pixel via
// CanvasRenderingContext2D each frame.
// ---------------------------------------------------------------------------

const CHROMA_VERTEX = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const CHROMA_FRAGMENT = /* glsl */ `
  uniform sampler2D uTexture;
  uniform float uLo;          // lower whiteness threshold
  uniform float uHi;          // upper whiteness threshold
  uniform float uOpacity;
  uniform float uGamma;       // gamma curve for shadow lifting (< 1.0 = brighter shadows)

  varying vec2 vUv;

  void main() {
    vec4 col = texture2D(uTexture, vUv);

    // --- White background removal ---
    float minC = min(col.r, min(col.g, col.b));
    float maxC = max(col.r, max(col.g, col.b));
    float saturation = maxC > 0.001 ? (maxC - minC) / maxC : 0.0;

    // Luminance-weighted whiteness — only truly white, unsaturated pixels
    float luminance = dot(col.rgb, vec3(0.299, 0.587, 0.114));
    float whiteness = luminance * (1.0 - saturation);

    // Gentle fade: only fades pixels that are genuinely white background
    float alpha = 1.0 - smoothstep(uLo, uHi, whiteness);

    // --- Gamma correction to lift shadows ---
    // pow(color, gamma) with gamma < 1.0 lifts dark values dramatically
    // while keeping bright values relatively unchanged.
    // This makes the dark hoodie details visible without washing out highlights.
    vec3 enhanced = pow(col.rgb, vec3(uGamma));

    gl_FragColor = vec4(enhanced, col.a * alpha * uOpacity);
  }
`;

// ---------------------------------------------------------------------------
// Singleton video element — survives React StrictMode double-mount.
//
// The root cause of the original regression was StrictMode calling
//   useEffect mount → cleanup → mount
// which destroyed the first video element and its texture during cleanup,
// then created new ones on the second mount. But the R3F reconciler and
// useFrame closures held stale references to the disposed texture.
//
// By hoisting the video element out of React's lifecycle entirely (as a
// module-level singleton keyed by src), the element is created once and
// reused across mounts. Cleanup only pauses; subsequent mounts find it
// already loaded and ready.
// ---------------------------------------------------------------------------

const videoCache = new Map();

function getOrCreateVideo(src) {
  if (videoCache.has(src)) return videoCache.get(src);

  const video = document.createElement("video");
  video.src = src;
  video.muted = true;
  video.defaultMuted = true;
  video.playsInline = true;
  video.setAttribute("playsinline", "");
  video.setAttribute("webkit-playsinline", "");
  // Don't set crossOrigin for same-origin resources served from Vite.
  video.preload = "auto";

  // Attach to DOM — required by Safari and some Chrome builds for reliable
  // frame decoding when the video is only used as a WebGL/canvas source.
  video.style.cssText =
    "position:fixed;width:1px;height:1px;top:0;left:0;opacity:0;pointer-events:none;z-index:-1";
  document.body.appendChild(video);

  video.load();
  videoCache.set(src, video);
  return video;
}

// ---------------------------------------------------------------------------
// Component
//
// Uses an offscreen <canvas> + CanvasTexture approach for the texture, NOT
// THREE.VideoTexture.  Reason: VideoTexture relies on
// requestVideoFrameCallback, which does NOT fire when you seek a paused
// video. Since this component seeks by setting video.currentTime on a paused
// video (driven by scroll), VideoTexture never updates.  CanvasTexture with
// manual ctx.drawImage() on every frame gives us full control.
//
// The chroma-key is done by the GPU shader — we do NOT read back pixels
// with getImageData(). The canvas just serves as the bridge from the video
// element to a WebGL texture.
// ---------------------------------------------------------------------------

export default function HeroVideo({ scale = 1, progressRef, ...props }) {
  const meshRef = useRef();
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);
  const textureRef = useRef(null);
  const [ready, setReady] = useState(false);

  // Get (or create) the singleton video element
  const video = useMemo(() => getOrCreateVideo("/videos/head-turn.mp4"), []);

  // Create the offscreen canvas + CanvasTexture once.
  // useMemo keeps them stable across StrictMode double-mount.
  const { canvas, ctx, texture } = useMemo(() => {
    const c = document.createElement("canvas");
    c.width = 512;
    c.height = 512;
    const cx = c.getContext("2d", { willReadFrequently: false });
    const tex = new THREE.CanvasTexture(c);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.minFilter = THREE.LinearFilter;
    tex.magFilter = THREE.LinearFilter;

    canvasRef.current = c;
    ctxRef.current = cx;
    textureRef.current = tex;

    return { canvas: c, ctx: cx, texture: tex };
  }, []);

  // Create the shader uniforms once (stable reference)
  const uniforms = useMemo(
    () => ({
      uTexture: { value: texture },
      uLo: { value: 200 / 255 },    // only target truly white pixels
      uHi: { value: 240 / 255 },    // gentle fade to transparent
      uOpacity: { value: 1.0 },
      uGamma: { value: 0.4 },        // strong shadow lift (lower = brighter darks)
    }),
    [texture]
  );

  // Unlock the video for scrubbing: play → pause → seek to 0.
  // Required on iOS Safari which won't decode frames from a paused video
  // until it has played at least once.
  useEffect(() => {
    if (!video) return;
    let cancelled = false;

    async function unlock() {
      // Wait for enough data to be buffered
      if (video.readyState < 2) {
        await new Promise((resolve) => {
          const handler = () => {
            video.removeEventListener("canplay", handler);
            video.removeEventListener("loadeddata", handler);
            resolve();
          };
          video.addEventListener("canplay", handler, { once: true });
          video.addEventListener("loadeddata", handler, { once: true });
          // Safety: also resolve on a timeout so we don't hang forever
          setTimeout(resolve, 5000);
        });
      }
      if (cancelled) return;

      // Resize canvas to match video's native resolution
      if (video.videoWidth && video.videoHeight) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
      }

      // Play briefly to unlock the decoder, then pause
      try {
        await video.play();
      } catch {
        // Autoplay blocked — add user-interaction fallback listeners.
        const retry = () => {
          video
            .play()
            .then(() => {
              video.pause();
              video.currentTime = 0;
            })
            .catch(() => { });
        };
        window.addEventListener("pointerdown", retry, { once: true });
        window.addEventListener("touchstart", retry, { once: true });
        window.addEventListener("scroll", retry, { once: true, passive: true });
      }
      if (cancelled) return;

      // Pause and rewind so scroll-scrubbing starts at frame 0
      video.pause();
      video.currentTime = 0;

      // Paint the first frame into the canvas texture immediately
      if (ctx && video.videoWidth) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        texture.needsUpdate = true;
      }

      if (!cancelled) setReady(true);
    }

    unlock();
    return () => { cancelled = true; };
  }, [video, canvas, ctx, texture]);

  // Cleanup: dispose texture on unmount (video stays in singleton cache)
  useEffect(() => {
    return () => {
      texture.dispose();
    };
  }, [texture]);

  // Every frame: scrub video to scroll position + paint frame to canvas
  const lastProgress = useRef(-1);

  useFrame(() => {
    if (!ready) return;
    if (!video || !video.duration || !Number.isFinite(video.duration)) return;
    if (!ctx) return;

    const target = progressRef?.current ?? 0;

    // Only seek when progress actually changes
    if (Math.abs(target - lastProgress.current) > 1 / 240) {
      video.currentTime = target * video.duration;
      lastProgress.current = target;
    }

    // Paint the current video frame into the canvas on every rAF.
    // This is the key difference from VideoTexture: drawImage() works
    // reliably on paused+seeked videos, whereas rVFC does not fire.
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    texture.needsUpdate = true;
  });

  if (!ready) return null;

  return (
    <group scale={scale} {...props}>
      <mesh ref={meshRef}>
        <planeGeometry args={[2.5, 2.5]} />
        <shaderMaterial
          vertexShader={CHROMA_VERTEX}
          fragmentShader={CHROMA_FRAGMENT}
          uniforms={uniforms}
          transparent
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>
    </group>
  );
}
