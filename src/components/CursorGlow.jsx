import { useEffect, useRef } from "react";

const INTERACTIVE_SELECTOR = "a, button, [role='button'], input, textarea";

export default function CursorGlow() {
  const glowRef = useRef(null);
  const ringRef = useRef(null);
  const dotRef = useRef(null);

  useEffect(() => {
    const isTouch = window.matchMedia("(pointer: coarse)").matches;
    if (isTouch) return;

    const glow = glowRef.current;
    const ring = ringRef.current;
    const dot = dotRef.current;

    let raf;
    let gx = window.innerWidth / 2,
      gy = window.innerHeight / 2;
    let rx = gx,
      ry = gy;
    let tx = gx,
      ty = gy;
    let hovering = false;

    function onMove(e) {
      tx = e.clientX;
      ty = e.clientY;
      if (dot) dot.style.transform = `translate3d(${tx - 3}px, ${ty - 3}px, 0)`;
    }

    function onOver(e) {
      hovering = !!e.target.closest?.(INTERACTIVE_SELECTOR);
      if (ring) ring.style.width = ring.style.height = hovering ? "56px" : "34px";
      if (ring) ring.style.opacity = hovering ? "0.9" : "0.6";
    }

    function loop() {
      gx += (tx - gx) * 0.1;
      gy += (ty - gy) * 0.1;
      rx += (tx - rx) * 0.18;
      ry += (ty - ry) * 0.18;
      if (glow) glow.style.transform = `translate3d(${gx - 220}px, ${gy - 220}px, 0)`;
      if (ring) {
        const half = hovering ? 28 : 17;
        ring.style.transform = `translate3d(${rx - half}px, ${ry - half}px, 0)`;
      }
      raf = requestAnimationFrame(loop);
    }

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseover", onOver);
    raf = requestAnimationFrame(loop);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseover", onOver);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <>
      <div
        ref={glowRef}
        className="fixed top-0 left-0 w-[440px] h-[440px] rounded-full pointer-events-none -z-10 hidden md:block"
        style={{
          background:
            "radial-gradient(circle, rgba(62,201,255,0.10) 0%, rgba(155,91,255,0.06) 40%, transparent 70%)",
          willChange: "transform",
        }}
        aria-hidden="true"
      />
      <div
        ref={ringRef}
        className="fixed top-0 left-0 w-[34px] h-[34px] rounded-full pointer-events-none z-[90] hidden md:block border border-cyan/70 transition-[width,height,opacity] duration-200 ease-out"
        style={{ willChange: "transform", mixBlendMode: "screen" }}
        aria-hidden="true"
      />
      <div
        ref={dotRef}
        className="fixed top-0 left-0 w-[6px] h-[6px] rounded-full bg-cyan pointer-events-none z-[90] hidden md:block"
        style={{ willChange: "transform", boxShadow: "0 0 8px rgba(62,201,255,0.8)" }}
        aria-hidden="true"
      />
    </>
  );
}
