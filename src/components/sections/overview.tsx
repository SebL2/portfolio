"use client";

import {
  IconSchool,
  IconStack2,
  IconBrain,
  IconRocket,
} from "@tabler/icons-react";
import { Stage } from "@/components/ui/stage";
import { SectionHeading } from "@/components/sections/projects";

const facts = [
  { icon: IconSchool, label: "Math & CS — NYU Tandon" },
  { icon: IconStack2, label: "Full-stack: React + Python" },
  { icon: IconBrain, label: "AI / ML curious" },
  { icon: IconRocket, label: "Ships to production" },
];

export const Overview = () => {
  return (
    <Stage id="overview" side="left">
      <SectionHeading
        eyebrow="Base camp · Overview"
        title="The quick pitch"
        subtitle="Before the route — here's the shape of what I do."
        accent="#06b6d4"
      />

      <p className="mx-auto mt-8 max-w-xl text-center text-base leading-relaxed text-neutral-300">
        I build full-stack products end to end: typed React on the front, Python
        on the back, and the infrastructure to ship them. I like problems where
        the math and the code meet — and I care about getting things in front of
        real users, not just demos.
      </p>

      <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
        {facts.map((f) => (
          <div
            key={f.label}
            className="flex items-center gap-3 rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-3 text-sm text-neutral-200"
          >
            <f.icon size={18} className="text-cyan-400" />
            {f.label}
          </div>
        ))}
      </div>
    </Stage>
  );
};
