"use client";

import { useEffect, useRef, useState } from "react";
import { useScroll, useSpring, useMotionValueEvent } from "motion/react";

const FRAME_COUNT = 150;
// next/config's basePath doesn't rewrite raw string URLs like these, so prefix it
// ourselves. Matches `basePath` in next.config.ts; empty in local dev.
const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const frameSrc = (i: number) =>
  `${BASE_PATH}/climb/frame_${String(i).padStart(4, "0")}.jpg`;

/**
 * First-person bouldering footage scrubbed by scroll: the page's scroll
 * progress drives an image sequence drawn to a full-viewport canvas, so each
 * section advances the POV up the wall to the next hold. (Image sequence on a
 * canvas — smoother and more reliable than seeking a <video>.)
 */
export const ClimbSequence = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const loadedRef = useRef<boolean[]>([]);
  const currentRef = useRef(0);
  const [ready, setReady] = useState(false);

  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.0005,
  });

  const draw = (idx: number) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    let img = imagesRef.current[idx];
    if (!img || !loadedRef.current[idx]) {
      // fall back to the nearest already-loaded frame
      let found = -1;
      for (let r = 1; r < FRAME_COUNT; r++) {
        if (loadedRef.current[idx - r]) {
          found = idx - r;
          break;
        }
        if (loadedRef.current[idx + r]) {
          found = idx + r;
          break;
        }
      }
      if (found < 0) return;
      img = imagesRef.current[found];
    }

    const cw = canvas.width;
    const ch = canvas.height;
    const iw = img.naturalWidth || 640;
    const ih = img.naturalHeight || 360;
    const scale = Math.max(cw / iw, ch / ih); // cover
    const w = iw * scale;
    const h = ih * scale;
    ctx.drawImage(img, (cw - w) / 2, (ch - h) / 2, w, h);
  };

  // Preload the sequence.
  useEffect(() => {
    const imgs: HTMLImageElement[] = [];
    const loaded: boolean[] = new Array(FRAME_COUNT).fill(false);
    for (let i = 0; i < FRAME_COUNT; i++) {
      const img = new window.Image();
      img.decoding = "async";
      img.src = frameSrc(i);
      img.onload = () => {
        loaded[i] = true;
        if (i === 0) {
          setReady(true);
          draw(0);
        } else if (i === currentRef.current) {
          draw(i);
        }
      };
      imgs[i] = img;
    }
    imagesRef.current = imgs;
    loadedRef.current = loaded;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Size the canvas to the viewport (DPR-aware) and redraw.
  useEffect(() => {
    const resize = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(window.innerWidth * dpr);
      canvas.height = Math.floor(window.innerHeight * dpr);
      draw(currentRef.current);
    };
    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Scrub frames with scroll.
  useMotionValueEvent(progress, "change", (v) => {
    const idx = Math.min(
      FRAME_COUNT - 1,
      Math.max(0, Math.round(v * (FRAME_COUNT - 1))),
    );
    if (idx !== currentRef.current) {
      currentRef.current = idx;
      requestAnimationFrame(() => draw(idx));
    }
  });

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-black"
    >
      <canvas ref={canvasRef} className="h-full w-full" />

      {/* Readability scrim: darkens the central content column, keeps edges open */}
      <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_0%,rgba(6,7,11,0.48)_22%,rgba(6,7,11,0.6)_50%,rgba(6,7,11,0.48)_78%,transparent_100%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(6,7,11,0.55)_0%,transparent_20%,transparent_80%,rgba(6,7,11,0.55)_100%)]" />
      <div className="absolute inset-0 bg-black/15" />

      {!ready && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xs font-medium uppercase tracking-[0.25em] text-neutral-500">
            chalking up…
          </span>
        </div>
      )}
    </div>
  );
};
