import { useEffect, useRef, useState, Suspense, lazy } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { motion, useScroll, useTransform, useSpring, useMotionValueEvent } from "framer-motion";
import useIsMobile from "../hooks/useIsMobile";

const HeroVideo = lazy(() => import("./HeroVideo"));

/* ------------------------------------------------------------------ */
/*  Utility hooks                                                     */
/* ------------------------------------------------------------------ */

function useReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const handler = (e) => setReduced(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);
  return reduced;
}

function clamp(v, min, max) {
  return Math.max(min, Math.min(max, v));
}

/* ------------------------------------------------------------------ */
/*  The 3D scene contents (wireframe globe + rings + HeroVideo)       */
/* ------------------------------------------------------------------ */

function Core({ reduced, mobile, progressRef, scrollBoostRef }) {
  const wireRef = useRef();
  const ringRef = useRef();
  const ring2Ref = useRef();
  const mouse = useRef({ x: 0, y: 0 });
  const tilt = useRef({ x: 0, y: 0 });

  useEffect(() => {
    function onMove(e) {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    }
    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  useFrame((state, delta) => {
    tilt.current.x += (mouse.current.y * 0.25 - tilt.current.x) * 0.04;
    tilt.current.y += (mouse.current.x * 0.35 - tilt.current.y) * 0.04;

    if (wireRef.current) {
      wireRef.current.rotation.x = tilt.current.x;
      wireRef.current.rotation.y = tilt.current.y;
      if (!reduced) {
        const boost = scrollBoostRef?.current ?? 0;
        wireRef.current.rotation.z += delta * 0.06 + boost;
      }
    }
    if (ringRef.current && !reduced) {
      ringRef.current.rotation.x += delta * 0.22;
      ringRef.current.rotation.y += delta * 0.12;
    }
    if (ring2Ref.current && !reduced) {
      ring2Ref.current.rotation.y -= delta * 0.16;
      ring2Ref.current.rotation.z += delta * 0.09;
    }
    if (scrollBoostRef) scrollBoostRef.current *= 0.85;
  });

  return (
    <group scale={mobile ? 1.05 : 1.25}>
      {/* Outer wireframe shell */}
      <mesh ref={wireRef}>
        <icosahedronGeometry args={[1.85, 1]} />
        <meshBasicMaterial color="#3ec9ff" wireframe transparent opacity={0.3} />
      </mesh>

      {/* Orbiting rings */}
      <mesh ref={ringRef} rotation={[Math.PI / 3, 0, 0]}>
        <torusGeometry args={[2.35, 0.008, 8, 96]} />
        <meshBasicMaterial color="#9b5bff" transparent opacity={0.4} />
      </mesh>
      <mesh ref={ring2Ref} rotation={[Math.PI / 2.4, Math.PI / 5, 0]}>
        <torusGeometry args={[2.65, 0.006, 8, 96]} />
        <meshBasicMaterial color="#3ec9ff" transparent opacity={0.25} />
      </mesh>

      {/* Hero video floating inside shell */}
      <Suspense fallback={null}>
        <HeroVideo scale={mobile ? 0.82 : 0.88} progressRef={progressRef} />
      </Suspense>

      {/* Lighting */}
      <pointLight color="#3ec9ff" intensity={18} distance={8} position={[2, 1, 3]} />
      <pointLight color="#9b5bff" intensity={14} distance={8} position={[-2, 0, -2]} />
    </group>
  );
}

/* ------------------------------------------------------------------ */
/*  HeroCore — Smooth continuous fixed 3D container                    */
/* ------------------------------------------------------------------ */

export default function HeroCore() {
  const reduced = useReducedMotion();
  const mobile = useIsMobile();
  const progressRef = useRef(0);
  const scrollBoostRef = useRef(0);
  const lastScrollY = useRef(0);
  const containerRef = useRef(null);

  const [docHeight, setDocHeight] = useState(0);
  const [centerDelta, setCenterDelta] = useState({ x: 0, y: 0 });

  useEffect(() => {
    function measure() {
      const dh = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      setDocHeight(dh);

      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const elCenterX = rect.left + rect.width / 2;
        const elCenterY = rect.top + rect.height / 2;
        setCenterDelta({
          x: window.innerWidth / 2 - elCenterX,
          y: window.innerHeight / 2 - elCenterY,
        });
      }
    }

    measure();
    window.addEventListener("resize", measure);
    window.addEventListener("preloader-done", measure);
    const ro = new ResizeObserver(measure);
    ro.observe(document.body);

    // Single safety-net timeout in case preloader was omitted or unmounted early
    const fallbackTimer = setTimeout(measure, 400);

    return () => {
      window.removeEventListener("resize", measure);
      window.removeEventListener("preloader-done", measure);
      ro.disconnect();
      clearTimeout(fallbackTimer);
    };
  }, []);

  const { scrollY } = useScroll();

  // Three-stage scroll timeline, all keyframes sharing the same timing so
  // every property (position / scale / opacity) reaches each stage together:
  //   0%   -> HERO:       original resting position, full size, full opacity
  // Scroll timeline based on full scrollable document height
  const stops = [0, (docHeight || 800) * 0.15, (docHeight || 800) * 0.9];

  const targetX = useTransform(scrollY, stops, [0, centerDelta.x, centerDelta.x]);
  const targetY = useTransform(scrollY, stops, [0, centerDelta.y, centerDelta.y]);
  const targetScale = useTransform(
    scrollY,
    stops,
    [1, mobile ? 0.92 : 0.95, mobile ? 0.82 : 0.85]
  );

  const targetOpacity = useTransform(
    scrollY,
    stops,
    [1, mobile ? 0.12 : 0.16, mobile ? 0.12 : 0.16]
  );

  const springConfig = { stiffness: 90, damping: 22, restDelta: 0.001 };
  const smoothX = useSpring(targetX, springConfig);
  const smoothY = useSpring(targetY, springConfig);
  const smoothScale = useSpring(targetScale, springConfig);
  const smoothOpacity = useSpring(targetOpacity, springConfig);

  // Continuously scrub video currentTime across full page & boost spin speed on scroll
  useMotionValueEvent(scrollY, "change", (latest) => {
    const delta = latest - lastScrollY.current;
    lastScrollY.current = latest;
    scrollBoostRef.current += delta * 0.00025;

    const progress = clamp(latest / (docHeight || 1), 0, 1);
    progressRef.current = progress;
  });

  return (
    <motion.div
      ref={containerRef}
      className="fixed -z-10 right-[2%] top-1/2 -translate-y-1/2 w-[90vw] h-[90vw] max-w-[480px] max-h-[480px] md:right-[6%] md:w-[52vw] md:h-[52vw] md:max-w-[640px] md:max-h-[640px] pointer-events-none select-none"
      style={{
        x: reduced ? 0 : smoothX,
        y: reduced ? 0 : smoothY,
        scale: reduced ? 1 : smoothScale,
        opacity: smoothOpacity,
        pointerEvents: "none",
        willChange: "transform, opacity",
      }}
      aria-hidden="true"
    >
      <Canvas
        dpr={mobile ? [1, 1] : [1, 1.5]}
        camera={{ position: [0, 0, 7.8], fov: 45 }}
        gl={{ antialias: !mobile, alpha: true, powerPreference: "low-power" }}
      >
        <ambientLight intensity={0.25} />
        <Core
          reduced={reduced}
          mobile={mobile}
          progressRef={progressRef}
          scrollBoostRef={scrollBoostRef}
        />
      </Canvas>
    </motion.div>
  );
}
