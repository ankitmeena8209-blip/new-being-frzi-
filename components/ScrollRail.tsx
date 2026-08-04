"use client";

import { motion, useScroll, useSpring } from "framer-motion";

const SECTIONS = [
  { id: "hero", label: "01" },
  { id: "stack", label: "02" },
  { id: "about", label: "03" },
  { id: "connect", label: "04" },
];

/**
 * The poster has a vertical grayscale "COLOR" slider on the right edge.
 * Here it becomes an actual scroll-progress rail: the knob travels with
 * page scroll, and each tick is a jump link to a section.
 */
export default function ScrollRail() {
  const { scrollYProgress } = useScroll();
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 24,
    mass: 0.3,
  });

  return (
    <nav
      aria-label="Page sections"
      className="fixed right-3 top-1/2 z-40 hidden -translate-y-1/2 sm:block md:right-6"
    >
      <div className="relative flex h-56 w-9 flex-col items-center justify-between rounded-full border border-hairline bg-paper/70 py-3 backdrop-blur-sm">
        <span className="font-mono text-[9px] tracking-widest2 text-muted">TOP</span>

        <div className="relative h-32 w-[3px] rounded-full bg-hairline">
          <motion.div
            style={{ scaleY: smoothProgress }}
            className="absolute inset-x-0 top-0 h-full origin-top rounded-full bg-ink"
          />
        </div>

        <span className="font-mono text-[9px] tracking-widest2 text-muted">END</span>
      </div>

      <ul className="mt-4 flex flex-col items-center gap-3">
        {SECTIONS.map((s) => (
          <li key={s.id}>
            <a
              href={`#${s.id}`}
              className="font-mono text-[10px] tracking-widest2 text-muted transition-colors hover:text-ink focus-visible:text-ink"
            >
              {s.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
