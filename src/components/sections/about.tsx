"use client";

import { motion } from "motion/react";
import {
  IconBrain,
  IconMountain,
  IconSchool,
  IconUser,
} from "@tabler/icons-react";
import { BentoGrid, BentoGridItem } from "@/components/ui/bento-grid";
import { SectionHeading } from "@/components/sections/projects";
import { Stage } from "@/components/ui/stage";

const SkeletonGradient = ({ from, to }: { from: string; to: string }) => (
  <div className="relative flex h-full min-h-24 w-full flex-1 overflow-hidden rounded-xl border border-white/[0.06]">
    <div
      className="h-full w-full"
      style={{
        background: `radial-gradient(120% 120% at 0% 0%, ${from}, ${to})`,
      }}
    />
    <motion.div
      className="absolute inset-0 opacity-30 [background-size:20px_20px] [background-image:radial-gradient(circle,#ffffff33_1px,transparent_1px)]"
      animate={{ backgroundPosition: ["0px 0px", "20px 20px"] }}
      transition={{ repeat: Infinity, duration: 6, ease: "linear" }}
    />
  </div>
);

const items = [
  {
    title: "Hey, I'm Sebastian",
    description:
      "A Math & Computer Science grad who likes living where the two meet — reasoning carefully about a problem, then building something real that actually runs.",
    header: <SkeletonGradient from="#0ea5e944" to="#0a0a0a" />,
    icon: <IconUser size={18} className="text-sky-400" />,
    className: "md:col-span-2",
  },
  {
    title: "NYU Tandon",
    description:
      "B.S. in Mathematics & Computer Science from NYU's Tandon School of Engineering.",
    header: <SkeletonGradient from="#a855f744" to="#0a0a0a" />,
    icon: <IconSchool size={18} className="text-purple-400" />,
    className: "md:col-span-1",
  },
  {
    title: "Into AI / ML",
    description:
      "Most curious about machine learning — training models and the math that makes them tick.",
    header: <SkeletonGradient from="#22c55e44" to="#0a0a0a" />,
    icon: <IconBrain size={18} className="text-green-400" />,
    className: "md:col-span-1",
  },
  {
    title: "Off the keyboard: rock climbing (badly)",
    description:
      "You'll usually find me on a bouldering wall. Full disclosure — I'm genuinely bad at it. But failing the same V2 fifteen times and finally sticking it feels a lot like debugging, so I keep showing up.",
    header: <SkeletonGradient from="#f59e0b44" to="#0a0a0a" />,
    icon: <IconMountain size={18} className="text-amber-400" />,
    className: "md:col-span-2",
  },
];

export const About = () => {
  return (
    <Stage id="about" side="right">
      <SectionHeading
        eyebrow="Pitch 3 · About"
        title="A bit about me"
        subtitle="Math, code, and the occasional (humbling) climbing wall."
        accent="#e0b13a"
      />
      <BentoGrid className="mt-10 grid-cols-1 gap-3 md:grid-cols-2 md:auto-rows-[13rem]">
        {items.map((item, i) => (
          <BentoGridItem
            key={i}
            title={item.title}
            description={item.description}
            header={item.header}
            icon={item.icon}
            className={item.className}
          />
        ))}
      </BentoGrid>
    </Stage>
  );
};
