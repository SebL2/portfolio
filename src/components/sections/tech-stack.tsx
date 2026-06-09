"use client";

import { InfiniteMovingCards } from "@/components/ui/infinite-moving-cards";
import { SectionHeading } from "@/components/sections/projects";
import { Stage } from "@/components/ui/stage";

const row1 = [
  "TypeScript",
  "React",
  "Next.js",
  "Node.js",
  "Python",
  "FastAPI",
  "Tailwind CSS",
  "PostgreSQL",
];

const row2 = [
  "Docker",
  "Git",
  "Redis",
  "Supabase",
  "Vite",
  "PyTorch",
  "OpenCV",
  "Google Gemini",
];

export const TechStack = () => {
  return (
    <Stage id="stack" side="left" className="overflow-hidden">
      <SectionHeading
        eyebrow="Pitch 2 · Toolbox"
        title="Technologies I work with"
        subtitle="Across the stack — from training models in Python to shipping typed React frontends."
        accent="#7c5aa0"
      />

      <div className="mt-12 flex flex-col items-center gap-4">
        <InfiniteMovingCards
          items={row1.map((label) => ({ label }))}
          direction="left"
          speed="slow"
          className="mx-auto w-full max-w-full"
        />
        <InfiniteMovingCards
          items={row2.map((label) => ({ label }))}
          direction="right"
          speed="slow"
          className="mx-auto w-full max-w-full"
        />
      </div>
    </Stage>
  );
};
