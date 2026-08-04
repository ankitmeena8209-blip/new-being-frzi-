"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

export default function GhostMarquee() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();

  // Scroll parallax shifts
  const x1 = useTransform(scrollY, [0, 800], [0, -120]);
  const x2 = useTransform(scrollY, [0, 800], [0, 120]);
  const x3 = useTransform(scrollY, [0, 800], [0, -80]);

  const rowTransforms = [x1, x2, x3];
  const rows = ["BEING FRZI", "BEING FRZI", "BEING FRZI"];

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-1 overflow-hidden select-none"
    >
      {rows.map((row, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.15 * i, ease: [0.16, 1, 0.3, 1] }}
          style={{
            x: rowTransforms[i],
            opacity: 1 - i * 0.18,
            willChange: "transform",
          }}
          className="text-outline font-display text-[16vw] leading-[0.85] tracking-tight whitespace-nowrap sm:text-[11vw] transition-transform duration-75"
        >
          {row}
        </motion.span>
      ))}
    </div>
  );
}
