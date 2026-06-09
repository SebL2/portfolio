"use client";

import React from "react";
import { cn } from "@/lib/utils";

export const BentoGrid = ({
  className,
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) => {
  return (
    <div
      className={cn(
        "mx-auto grid max-w-6xl grid-cols-1 gap-4 md:auto-rows-[18rem] md:grid-cols-3",
        className,
      )}
    >
      {children}
    </div>
  );
};

export const BentoGridItem = ({
  className,
  title,
  description,
  header,
  icon,
}: {
  className?: string;
  title?: string | React.ReactNode;
  description?: string | React.ReactNode;
  header?: React.ReactNode;
  icon?: React.ReactNode;
}) => {
  return (
    <div
      className={cn(
        "group/bento row-span-1 flex flex-col justify-between space-y-4 overflow-hidden rounded-2xl border border-white/[0.08] bg-zinc-950/60 p-5 transition-all duration-300 hover:border-white/20 hover:shadow-2xl hover:shadow-sky-500/5",
        className,
      )}
    >
      {header}
      <div className="transition-all duration-200 group-hover/bento:translate-x-1">
        <div className="mb-2 flex items-center gap-2">
          {icon}
          <div className="font-sans text-lg font-bold text-neutral-100">
            {title}
          </div>
        </div>
        <div className="font-sans text-sm font-normal text-neutral-400">
          {description}
        </div>
      </div>
    </div>
  );
};
