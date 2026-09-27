import { useEffect, useRef } from "react";

/** A small cricket ball that follows the cursor, with a lagging ring that grows over clickable things. */
const BallCursor = () => {
  const ball = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(hover: none), (pointer: coarse)").matches) return;
    let x = -100, y = -100, rx = -100, ry = -100, spin = 0, raf = 0;
    const onMove = (e: PointerEvent) => {
      spin += Math.hypot(e.clientX - x, e.clientY - y) * 2;
      x = e.clientX; y = e.clientY;
      const t = e.target as HTMLElement | null;
      const hot = !!t?.closest("a, button, [role='button'], canvas, .tilt-card, input, textarea, label");
      ring.current?.classList.toggle("is-hover", hot);
    };
    const loop = () => {
      rx += (x - rx) * 0.16; ry += (y - ry) * 0.16;
      if (ball.current) ball.current.style.transform = `translate3d(${x}px, ${y}px, 0) rotate(${spin}deg)`;
      if (ring.current) ring.current.style.transform = `translate3d(${rx}px, ${ry}px, 0)`;
      raf = requestAnimationFrame(loop);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    loop();
    return () => { cancelAnimationFrame(raf); window.removeEventListener("pointermove", onMove); };
  }, []);

  return (
    <>
      <div ref={ring} className="ball-cursor-ring" aria-hidden />
      <div ref={ball} className="ball-cursor" aria-hidden />
    </>
  );
};

export default BallCursor;
