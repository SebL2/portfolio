"use client";

import React from "react";
import { cn } from "@/lib/utils";

// Organic, asymmetric blob silhouettes so no two holds look identical.
const SHAPES = [
  "42% 58% 63% 37% / 45% 38% 62% 55%",
  "63% 37% 47% 53% / 58% 49% 51% 42%",
  "50% 50% 46% 54% / 60% 57% 43% 40%",
  "38% 62% 55% 45% / 52% 45% 55% 48%",
];

/**
 * A single bolt-on climbing hold rendered in CSS — shaded with a radial
 * gradient + inset/drop shadows so it reads as a 3D resin hold on the wall.
 */
export function ClimbingHold({
  color = "#78716c",
  size = 28,
  rotate = 0,
  shape = 0,
  sphere = false,
  dim = false,
  className,
  style,
}: {
  color?: string;
  size?: number;
  rotate?: number;
  shape?: number;
  sphere?: boolean;
  dim?: boolean;
  className?: string;
  style?: React.CSSProperties;
}) {
  const bolt = Math.max(2, size * 0.1);
  return (
    <span
      className={cn("relative block", className)}
      style={{
        width: size,
        height: size,
        transform: `rotate(${rotate}deg)`,
        borderRadius: sphere ? "50%" : SHAPES[shape % SHAPES.length],
        background: `radial-gradient(120% 120% at 33% 26%, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0.25) 14%, ${color} 50%, rgba(0,0,0,0.5) 120%)`,
        boxShadow: `inset 0 ${size * 0.05}px ${size * 0.08}px rgba(255,255,255,0.35), inset 0 -${size * 0.1}px ${size * 0.16}px rgba(0,0,0,0.55), 0 ${size * 0.12}px ${size * 0.22}px rgba(0,0,0,0.55)`,
        opacity: dim ? 0.5 : 1,
        filter: dim ? "saturate(0.45)" : undefined,
        ...style,
      }}
    >
      {/* bolt hole */}
      <span
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-black/45"
        style={{
          width: bolt,
          height: bolt,
          boxShadow: "inset 0 1px 1px rgba(0,0,0,0.85)",
        }}
      />
    </span>
  );
}
