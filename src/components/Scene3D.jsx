import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import useIsMobile from "../hooks/useIsMobile";

const CYAN = new THREE.Color("#3ec9ff");
const PURPLE = new THREE.Color("#9b5bff");

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

// A field of nodes floating in 3D space, connected by short-range edges —
// reads as a distributed network / threat graph, which fits the security theme.
function NetworkField({ count, radius, reduced }) {
  const groupRef = useRef();
  const rotY = useRef(0);
  const tilt = useRef({ x: 0, y: 0 });
  const mouse = useRef({ x: 0, y: 0 });
  const scrollT = useRef(0);

  // NOTE: The nested loop below computes pair-wise node connections in O(n^2) time.
  // At current node counts (n <= 95), performance impact is negligible (<1ms on mount).
  // Verified: useMemo dependency array [count, radius] ensures this computation only runs
  // on initial mount or when props change, NOT on every frame or scroll re-render.
  // If count is ever increased significantly (e.g., n > 250), pre-calculate or spatial-index edges.
  const { positions, colors, linePositions, lineColors } = useMemo(() => {
    const pts = [];
    for (let i = 0; i < count; i++) {
      const x = (Math.random() - 0.5) * radius * 2;
      const y = (Math.random() - 0.5) * radius * 1.2;
      const z = (Math.random() - 0.5) * radius * 1.4;
      pts.push(new THREE.Vector3(x, y, z));
    }

    const positions = new Float32Array(pts.length * 3);
    const colors = new Float32Array(pts.length * 3);
    pts.forEach((p, i) => {
      positions[i * 3] = p.x;
      positions[i * 3 + 1] = p.y;
      positions[i * 3 + 2] = p.z;
      const c = CYAN.clone().lerp(PURPLE, Math.random());
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;
    });

    const linkDist = radius * 0.34;
    const linePts = [];
    const lineCols = [];
    for (let i = 0; i < pts.length; i++) {
      for (let j = i + 1; j < pts.length; j++) {
        const d = pts[i].distanceTo(pts[j]);
        if (d < linkDist) {
          linePts.push(pts[i].x, pts[i].y, pts[i].z, pts[j].x, pts[j].y, pts[j].z);
          const c = CYAN.clone().lerp(PURPLE, 0.5);
          const a = 1 - d / linkDist;
          lineCols.push(c.r, c.g, c.b, c.r * a, c.g * a, c.b * a);
        }
      }
    }
    return {
      positions,
      colors,
      linePositions: new Float32Array(linePts),
      lineColors: new Float32Array(lineCols),
    };
  }, [count, radius]);

  useEffect(() => {
    function onMove(e) {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    }
    function onScroll() {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      scrollT.current = max > 0 ? window.scrollY / max : 0;
    }
    window.addEventListener("pointermove", onMove);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  useFrame((_, delta) => {
    const g = groupRef.current;
    if (!g) return;
    if (!reduced) rotY.current += delta * 0.035;
    tilt.current.x += ((mouse.current.y * 0.14) - tilt.current.x) * 0.03;
    tilt.current.y += ((mouse.current.x * 0.22) - tilt.current.y) * 0.03;
    g.rotation.x = tilt.current.x + scrollT.current * 0.5;
    g.rotation.y = rotY.current + tilt.current.y;
  });

  return (
    <group ref={groupRef}>
      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
          <bufferAttribute attach="attributes-color" args={[colors, 3]} />
        </bufferGeometry>
        <pointsMaterial
          size={0.05}
          vertexColors
          transparent
          opacity={0.85}
          sizeAttenuation
          depthWrite={false}
        />
      </points>
      <lineSegments>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[linePositions, 3]} />
          <bufferAttribute attach="attributes-color" args={[lineColors, 3]} />
        </bufferGeometry>
        <lineBasicMaterial
          vertexColors
          transparent
          opacity={0.16}
          depthWrite={false}
        />
      </lineSegments>
    </group>
  );
}

function SceneContents({ reduced, mobile }) {
  return (
    <>
      <fog attach="fog" args={["#05070d", 6, 15]} />
      <NetworkField count={mobile ? 42 : 95} radius={mobile ? 4.5 : 6.2} reduced={reduced} />
    </>
  );
}

export default function Scene3D() {
  const reduced = useReducedMotion();
  const mobile = useIsMobile();

  return (
    <div className="fixed inset-0 -z-10 pointer-events-none opacity-70">
      <Canvas
        dpr={mobile ? [1, 1] : [1, 1.5]}
        camera={{ position: [0, 0, 9], fov: 50 }}
        gl={{ antialias: !mobile, alpha: true, powerPreference: "low-power" }}
        frameloop={reduced ? "demand" : "always"}
      >
        <SceneContents reduced={reduced} mobile={mobile} />
      </Canvas>
    </div>
  );
}
