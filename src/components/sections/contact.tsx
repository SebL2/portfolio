"use client";

import { motion } from "motion/react";
import {
  IconBrandGithub,
  IconMail,
  IconArrowUpRight,
  IconFlag,
} from "@tabler/icons-react";
import { Meteors } from "@/components/ui/meteors";
import { ClimbingHold } from "@/components/climbing/hold";

export const Contact = () => {
  return (
    <section
      id="reach"
      className="relative flex min-h-screen w-full scroll-mt-24 flex-col items-center justify-center px-6 py-24 lg:px-12"
    >
      {/* big banner glow behind the card */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[34rem] w-[34rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-rose-500/15 blur-[120px]" />

      <motion.div
        initial={{ opacity: 0, y: 48, scale: 0.96 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: false, amount: 0.3 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="relative mx-auto w-full max-w-3xl overflow-hidden rounded-[2rem] border border-rose-400/20 bg-zinc-950/85 px-8 py-16 text-center shadow-[0_40px_140px_rgba(0,0,0,0.65)] ring-1 ring-white/5 backdrop-blur-xl sm:px-16 sm:py-20"
      >
        {/* top accent line */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-rose-400/70 to-transparent" />
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <Meteors number={26} />
        </div>
        <div className="pointer-events-none absolute -top-24 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-rose-500/15 blur-3xl" />

        <div className="relative z-10">
          <ClimbingHold
            color="#d4493f"
            size={48}
            rotate={-12}
            className="mx-auto mb-6"
          />
          <span className="mx-auto mb-6 flex w-fit items-center gap-2 rounded-full border border-rose-400/30 bg-rose-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.25em] text-rose-300">
            <IconFlag size={14} /> Summit · Top out
          </span>
          <h2 className="bg-gradient-to-b from-white to-neutral-400 bg-clip-text text-4xl font-extrabold tracking-tight text-transparent sm:text-6xl">
            You topped out.
            <br className="hidden sm:block" /> Let&apos;s talk.
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-base text-neutral-400 sm:text-lg">
            Thanks for climbing all the way up. I&apos;m open to roles and
            collaborations — the fastest hold to grab is email.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <a
              href="mailto:sebastian.liu0104@gmail.com"
              className="group flex w-full items-center justify-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-semibold text-black transition-transform hover:scale-[1.03] sm:w-auto"
            >
              <IconMail size={18} />
              sebastian.liu0104@gmail.com
              <IconArrowUpRight
                size={16}
                className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </a>
            <a
              href="https://github.com/SebL2"
              target="_blank"
              rel="noreferrer"
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/[0.12] bg-white/[0.02] px-6 py-3 text-sm font-semibold text-white transition-all hover:border-white/30 sm:w-auto"
            >
              <IconBrandGithub size={18} />
              github.com/SebL2
            </a>
          </div>
        </div>
      </motion.div>

      <footer className="mx-auto mt-14 flex w-full max-w-3xl flex-col items-center justify-between gap-3 border-t border-white/[0.06] pt-8 text-sm text-neutral-500 sm:flex-row">
        <p>© {new Date().getFullYear()} Sebastian Liu. All rights reserved.</p>
        <p>
          Built with Next.js, Tailwind &amp; Aceternity UI.
        </p>
      </footer>
    </section>
  );
};
