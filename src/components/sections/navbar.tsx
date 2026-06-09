"use client";

import { useState } from "react";
import { motion, AnimatePresence, useMotionValueEvent, useScroll } from "motion/react";
import { cn } from "@/lib/utils";

const links = [
  { name: "Overview", href: "#overview" },
  { name: "Projects", href: "#projects" },
  { name: "Toolbox", href: "#stack" },
  { name: "About", href: "#about" },
  { name: "Reach me", href: "#reach" },
];

export const Navbar = () => {
  const { scrollYProgress } = useScroll();
  const [visible, setVisible] = useState(true);
  const [lastY, setLastY] = useState(0);

  useMotionValueEvent(scrollYProgress, "change", (current) => {
    if (typeof current === "number") {
      const direction = current - lastY;
      if (current < 0.05) {
        setVisible(true);
      } else {
        setVisible(direction < 0);
      }
      setLastY(current);
    }
  });

  return (
    <AnimatePresence mode="wait">
      <motion.nav
        initial={{ opacity: 1, y: -100 }}
        animate={{ y: visible ? 0 : -100, opacity: visible ? 1 : 0 }}
        transition={{ duration: 0.2 }}
        className={cn(
          "fixed inset-x-0 top-6 z-50 mx-auto flex max-w-fit items-center justify-center gap-2 rounded-full border border-white/[0.1] bg-zinc-950/70 px-3 py-2.5 shadow-[0_8px_32px_rgba(0,0,0,0.4)] backdrop-blur-xl sm:gap-6 sm:px-6",
        )}
      >
        <a href="#start" className="pl-2 pr-1 text-sm font-bold tracking-tight text-white">
          SL<span className="text-sky-400">.</span>
        </a>
        {links.map((link) => (
          <a
            key={link.name}
            href={link.href}
            className="relative text-sm font-medium text-neutral-300 transition-colors hover:text-white"
          >
            {link.name}
          </a>
        ))}
        <a
          href="https://github.com/SebL2"
          target="_blank"
          rel="noreferrer"
          className="rounded-full border border-white/[0.15] bg-white px-4 py-1.5 text-sm font-semibold text-black transition-transform hover:scale-[1.03]"
        >
          GitHub
        </a>
      </motion.nav>
    </AnimatePresence>
  );
};
