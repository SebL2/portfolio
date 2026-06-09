"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { cn } from "@/lib/utils";

export const HoverEffect = ({
  items,
  className,
}: {
  items: {
    title: string;
    description: string;
    icon?: React.ReactNode;
  }[];
  className?: string;
}) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <div
      className={cn(
        "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2",
        className,
      )}
    >
      {items.map((item, idx) => (
        <div
          key={idx}
          className="group relative block h-full w-full p-2"
          onMouseEnter={() => setHoveredIndex(idx)}
          onMouseLeave={() => setHoveredIndex(null)}
        >
          <AnimatePresence>
            {hoveredIndex === idx && (
              <motion.span
                className="absolute inset-0 block h-full w-full rounded-3xl bg-sky-500/10"
                layoutId="hoverBackground"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, transition: { duration: 0.15 } }}
                exit={{ opacity: 0, transition: { duration: 0.15, delay: 0.2 } }}
              />
            )}
          </AnimatePresence>
          <div className="relative z-20 h-full overflow-hidden rounded-2xl border border-white/[0.08] bg-zinc-950 p-6 transition-colors group-hover:border-white/20">
            <div className="relative z-50">
              {item.icon && <div className="mb-4 text-sky-400">{item.icon}</div>}
              <h4 className="text-lg font-semibold tracking-wide text-neutral-100">
                {item.title}
              </h4>
              <p className="mt-3 text-sm leading-relaxed tracking-wide text-neutral-400">
                {item.description}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
