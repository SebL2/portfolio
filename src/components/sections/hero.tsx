"use client";

import { motion } from "motion/react";
import { IconArrowDown, IconBrandGithub, IconMail } from "@tabler/icons-react";
import { Spotlight } from "@/components/ui/spotlight";
import { TextGenerateEffect } from "@/components/ui/text-generate-effect";
import { MovingBorderButton } from "@/components/ui/moving-border";
import { ClimbingHold } from "@/components/climbing/hold";

export const Hero = () => {
  return (
    <section
      id="start"
      className="relative flex min-h-screen w-full flex-col justify-center overflow-hidden px-6 antialiased lg:px-12"
    >
      <Spotlight
        className="-top-40 left-0 md:-top-20 md:left-60"
        fill="white"
      />

      <div className="relative z-10 mx-auto w-full max-w-xl rounded-3xl border border-white/10 bg-black/55 px-6 py-10 text-center shadow-[0_24px_90px_rgba(0,0,0,0.55)] ring-1 ring-white/5 backdrop-blur-xl sm:px-10 lg:mx-0 lg:mr-auto lg:max-w-2xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="mx-auto mb-6 w-fit"
        >
          <ClimbingHold color="#22c55e" size={36} rotate={14} />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mx-auto mb-6 flex w-fit items-center gap-2 rounded-full border border-white/[0.1] bg-white/[0.03] px-4 py-1.5 text-xs font-medium text-neutral-300 backdrop-blur-sm"
        >
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
          </span>
          Start hold · available for opportunities
        </motion.div>

        <h1 className="bg-gradient-to-b from-white to-neutral-500 bg-clip-text text-center text-4xl font-bold text-transparent sm:text-6xl md:text-7xl">
          Sebastian Liu
        </h1>

        <TextGenerateEffect
          words="Software engineer who builds full-stack products end to end — typed React on the front, Python on the back, shipped and deployed."
          className="mx-auto mt-6 max-w-2xl text-center text-base font-normal text-neutral-300 sm:text-xl"
        />

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
        >
          <MovingBorderButton
            as="a"
            href="#projects"
            borderRadius="0.9rem"
            className="px-6 py-2.5 font-semibold"
            containerClassName="w-full sm:w-auto"
          >
            <span className="flex items-center gap-2">
              View my work <IconArrowDown size={16} />
            </span>
          </MovingBorderButton>

          <div className="flex items-center gap-3">
            <a
              href="https://github.com/SebL2"
              target="_blank"
              rel="noreferrer"
              className="flex h-12 w-12 items-center justify-center rounded-xl border border-white/[0.1] bg-white/[0.02] text-neutral-300 transition-all hover:border-white/30 hover:text-white"
              aria-label="GitHub"
            >
              <IconBrandGithub size={20} />
            </a>
            <a
              href="#contact"
              className="flex h-12 w-12 items-center justify-center rounded-xl border border-white/[0.1] bg-white/[0.02] text-neutral-300 transition-all hover:border-white/30 hover:text-white"
              aria-label="Contact"
            >
              <IconMail size={20} />
            </a>
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 1 }}
        className="absolute bottom-8 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2"
      >
        <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-neutral-500">
          Scroll to climb
        </span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
          className="text-neutral-600"
        >
          <IconArrowDown size={20} />
        </motion.div>
      </motion.div>
    </section>
  );
};
