"use client";

import React, { useRef, useState } from "react";
import { motion, useMotionTemplate, useMotionValue } from "motion/react";
import {
  IconBrandGithub,
  IconExternalLink,
  IconMoodSmile,
  IconBrandSpotify,
} from "@tabler/icons-react";
import { Meteors } from "@/components/ui/meteors";
import { ClimbingHold } from "@/components/climbing/hold";
import { Stage } from "@/components/ui/stage";
import { cn } from "@/lib/utils";

type Project = {
  title: string;
  tagline: string;
  description: string;
  highlights: string[];
  tech: string[];
  github: string;
  live?: string;
  icon: React.ReactNode;
  accent: string;
};

const projects: Project[] = [
  {
    title: "Spotify Playlist Generator",
    tagline: "Full-stack · Production",
    description:
      "A full-stack web app integrating the Spotify Web API end to end — OAuth auth, a typed React client, and a FastAPI backend — with an AI layer that turns a plain-English mood into a playlist saved to your account.",
    highlights: [
      "Spotify OAuth flow surfacing top tracks, artists, and live playback control",
      "Containerized with Docker, served by FastAPI, deployed on Vercel",
      "Redis + Supabase for session state and persistence; Gemini powers the chat layer",
    ],
    tech: [
      "React",
      "TypeScript",
      "FastAPI",
      "Google Gemini",
      "Tailwind",
      "Redis",
      "Supabase",
      "Docker",
    ],
    github: "https://github.com/jw7914/Spotify-Playlist-Generator",
    live: "https://spotifyplaylistgen.vercel.app/",
    icon: <IconBrandSpotify size={22} />,
    accent: "#1DB954",
  },
  {
    title: "Emotional Recognition",
    tagline: "Computer vision · Python",
    description:
      "A real-time computer-vision pipeline in Python: it captures a live webcam stream, detects faces with OpenCV, and classifies each one into seven emotions with a convolutional network I built and trained from scratch.",
    highlights: [
      "Real-time capture and face detection via OpenCV on the webcam stream",
      "CNN built and trained from scratch in PyTorch on the FER2013 dataset",
      "Iterated from a dense net to a CNN to cut validation loss and overfitting",
    ],
    tech: ["Python", "PyTorch", "OpenCV", "DeepFace", "NumPy", "FER2013"],
    github: "https://github.com/SebL2/Emotional_Recognition_Application",
    icon: <IconMoodSmile size={22} />,
    accent: "#a855f7",
  },
];

function SpotlightCard({
  children,
  accent,
}: {
  children: React.ReactNode;
  accent: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function onMouseMove({ clientX, clientY }: React.MouseEvent) {
    if (!ref.current) return;
    const { left, top } = ref.current.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  const background = useMotionTemplate`radial-gradient(450px circle at ${mouseX}px ${mouseY}px, ${accent}1f, transparent 80%)`;

  return (
    <div
      ref={ref}
      onMouseMove={onMouseMove}
      className="group relative overflow-hidden rounded-3xl border border-white/[0.08] bg-zinc-950/70 p-8 transition-colors duration-300 hover:border-white/20"
    >
      <motion.div
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{ background }}
      />
      {children}
    </div>
  );
}

export const Projects = () => {
  return (
    <Stage id="projects" side="right">
      <SectionHeading
        eyebrow="Pitch 1 · Selected Work"
        title="Things I've built"
        subtitle="A production full-stack web app and a computer-vision system built from the ground up."
        accent="#3f6fa3"
      />

      <div className="mt-10 grid grid-cols-1 gap-5">
        {projects.map((project, i) => (
          <motion.div
            key={project.title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
          >
            <SpotlightCard accent={project.accent}>
              <div className="relative z-10 flex h-full flex-col">
                <div className="mb-5 flex items-center justify-between">
                  <div
                    className="flex h-12 w-12 items-center justify-center rounded-xl text-white"
                    style={{
                      backgroundColor: `${project.accent}1a`,
                      color: project.accent,
                    }}
                  >
                    {project.icon}
                  </div>
                  <span className="text-xs font-medium uppercase tracking-widest text-neutral-500">
                    {project.tagline}
                  </span>
                </div>

                <h3 className="text-2xl font-bold text-white">{project.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-neutral-400">
                  {project.description}
                </p>

                <ul className="mt-6 space-y-2.5">
                  {project.highlights.map((h) => (
                    <li
                      key={h}
                      className="flex items-start gap-3 text-sm text-neutral-300"
                    >
                      <span
                        className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full"
                        style={{ backgroundColor: project.accent }}
                      />
                      {h}
                    </li>
                  ))}
                </ul>

                <div className="mt-7 flex flex-wrap gap-2">
                  {project.tech.map((t) => (
                    <span
                      key={t}
                      className="rounded-full border border-white/[0.08] bg-white/[0.03] px-3 py-1 text-xs font-medium text-neutral-300"
                    >
                      {t}
                    </span>
                  ))}
                </div>

                <div className="mt-auto flex items-center gap-3 pt-8">
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 rounded-lg border border-white/[0.1] bg-white/[0.03] px-4 py-2 text-sm font-medium text-neutral-200 transition-all hover:border-white/30 hover:text-white"
                  >
                    <IconBrandGithub size={16} /> Code
                  </a>
                  {project.live && (
                    <a
                      href={project.live}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold text-black transition-transform hover:scale-[1.03]"
                      style={{ backgroundColor: project.accent }}
                    >
                      <IconExternalLink size={16} /> Live demo
                    </a>
                  )}
                </div>
              </div>
            </SpotlightCard>
          </motion.div>
        ))}
      </div>
    </Stage>
  );
};

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  accent,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
  accent?: string;
}) {
  return (
    <div className="flex flex-col items-center text-center">
      {accent && (
        <ClimbingHold color={accent} size={28} rotate={18} className="mb-4" />
      )}
      <span className="mb-3 text-xs font-semibold uppercase tracking-[0.25em] text-sky-400">
        {eyebrow}
      </span>
      <h2 className={cn("text-3xl font-bold text-white sm:text-5xl")}>{title}</h2>
      {subtitle && (
        <p className="mt-4 max-w-2xl text-base text-neutral-400">{subtitle}</p>
      )}
    </div>
  );
}

export { Meteors };
