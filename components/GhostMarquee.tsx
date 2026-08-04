"use client";

import { motion } from "framer-motion";

/**
 * Reproduces the poster's ghost-outline repeated wordmark sitting behind the
 * hero headline. Purely decorative, so it's aria-hidden.
 */
export default function GhostMarquee() {
  const rows = ["BEING FRZI", "BEING FRZI", "BEING FRZI"];

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-1 overflow-hidden select-none"
    >
      {rows.map((row, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.15 * i, ease: [0.16, 1, 0.3, 1] }}
          className="text-outline font-display text-[16vw] leading-[0.85] tracking-tight whitespace-nowrap sm:text-[11vw]"
          style={{ opacity: 1 - i * 0.18 }}
        >
          {row}
        </motion.span>
      ))}
    </div>
  );
}
