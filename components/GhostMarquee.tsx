"use client";

import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { useRef } from "react";

export default function GhostMarquee() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();

  // Raw scroll transforms
  const rawX1 = useTransform(scrollY, [0, 1000], [0, -160]);
  const rawX2 = useTransform(scrollY, [0, 1000], [0, 160]);
  const rawX3 = useTransform(scrollY, [0, 1000], [0, -120]);

  // Spring physics interpolation for 60fps buttery-smooth motion
  const springConfig = { stiffness: 70, damping: 26, mass: 0.2 };
  const smoothX1 = useSpring(rawX1, springConfig);
  const smoothX2 = useSpring(rawX2, springConfig);
  const smoothX3 = useSpring(rawX3, springConfig);

  const rowTransforms = [smoothX1, smoothX2, smoothX3];
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
          className="text-outline font-display text-[16vw] leading-[0.85] tracking-tight whitespace-nowrap sm:text-[11vw]"
        >
          {row}
        </motion.span>
      ))}
    </div>
  );
}
