"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { useScroll, useMotionValueEvent } from "motion/react";

// three.js can't run on the server — load the canvas client-only.
const ClimbScene = dynamic(() => import("@/components/climb3d/scene"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center">
      <span className="text-xs font-medium uppercase tracking-[0.25em] text-neutral-500">
        loading route…
      </span>
    </div>
  ),
});

const MOVES = ["START", "OVERVIEW", "MY PROJECTS", "TOOLBOX", "ABOUT ME", "REACH ME"];

export const ClimbBackground = () => {
  const { scrollYProgress } = useScroll();
  const [pct, setPct] = useState(0);
  useMotionValueEvent(scrollYProgress, "change", (v) =>
    setPct(Math.round(Math.min(1, Math.max(0, v)) * 100)),
  );
  const active = Math.min(
    MOVES.length - 1,
    Math.round((pct / 100) * (MOVES.length - 1)),
  );

  return (
    <>
      {/* 3D scene — the prominent foreground visual */}
      <div aria-hidden className="fixed inset-0 -z-10 bg-[#0c0f15]">
        <ClimbScene scroll={scrollYProgress} />
        {/* only a faint vignette so the HUD stays legible; the scene stays vivid */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_90%_at_50%_45%,transparent_60%,rgba(6,8,12,0.55)_100%)]" />
      </div>

      {/* Game HUD */}
      <div className="pointer-events-none fixed inset-x-0 top-0 z-30 hidden p-4 sm:block">
        <div className="mx-auto flex max-w-6xl items-center justify-between font-mono text-[11px] uppercase tracking-[0.2em] text-neutral-300">
          <span className="rounded border border-white/15 bg-black/40 px-3 py-1 backdrop-blur-sm">
            ◆ Portfolio Simulator
          </span>
          <span className="rounded border border-sky-400/30 bg-black/40 px-3 py-1 text-sky-300 backdrop-blur-sm">
            Move {active + 1}/{MOVES.length} · {MOVES[active]} · {pct}%
          </span>
        </div>
      </div>

      {/* Ascent meter */}
      <div className="pointer-events-none fixed bottom-0 left-0 z-30 hidden h-full w-1.5 sm:block">
        <div className="h-full w-full bg-white/5" />
        <div
          className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-emerald-400 via-sky-400 to-rose-400 transition-[height] duration-150"
          style={{ height: `${pct}%` }}
        />
      </div>
    </>
  );
};
