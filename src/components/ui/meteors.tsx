"use client";

import React from "react";
import { cn } from "@/lib/utils";

export const Meteors = ({
  number = 20,
  className,
}: {
  number?: number;
  className?: string;
}) => {
  const meteors = new Array(number).fill(true);
  return (
    <>
      {meteors.map((_, idx) => {
        const position = idx * (800 / number) - 400;
        return (
          <span
            key={"meteor" + idx}
            className={cn(
              "animate-meteor pointer-events-none absolute top-1/2 left-1/2 size-0.5 rotate-[215deg] rounded-full bg-slate-500 shadow-[0_0_0_1px_#ffffff10]",
              "before:absolute before:top-1/2 before:h-px before:w-[50px] before:-translate-y-1/2 before:bg-gradient-to-r before:from-[#64748b] before:to-transparent before:content-['']",
              className,
            )}
            style={{
              top: "-40px",
              left: position + "px",
              animationDelay: (idx % 5) * 0.6 + "s",
              animationDuration: 4 + (idx % 5) + "s",
            }}
          />
        );
      })}
    </>
  );
};
