"use client";

import { motion } from "motion/react";
import { cn } from "@/lib/utils";

/**
 * A full-viewport "scene step": an info panel pinned to one side of the screen
 * (so the 3D climbing scene stays visible beside it) that slides + fades in
 * when scrolled into view, and out when you leave.
 */
export function Stage({
  id,
  side = "left",
  children,
  className,
}: {
  id?: string;
  side?: "left" | "right";
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      id={id}
      className="relative flex min-h-screen scroll-mt-24 items-center px-6 py-24 lg:px-12"
    >
      <motion.div
        initial={{ opacity: 0, x: side === "right" ? 64 : -64 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: false, amount: 0.35 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className={cn(
          "relative mx-auto w-full max-w-xl rounded-3xl border border-white/10 bg-black/55 p-6 shadow-[0_24px_90px_rgba(0,0,0,0.55)] ring-1 ring-white/5 backdrop-blur-xl sm:p-8 lg:mx-0 lg:max-w-2xl",
          side === "right" ? "lg:ml-auto" : "lg:mr-auto",
          className,
        )}
      >
        {children}
      </motion.div>
    </section>
  );
}
