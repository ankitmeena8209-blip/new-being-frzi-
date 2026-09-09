"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import GhostMarquee from "./GhostMarquee";

const STATS = [
  { value: "3+", label: "Projects shipped" },
  { value: "99+", label: "Cups of coffee" },
  { value: "∞", label: "Sarcasm & energy" },
];

export default function Hero() {
  const heroRef = useRef<HTMLDivElement>(null);

  // Container-relative scroll progress tracking (works bi-directionally on mobile touch & desktop)
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  // Smooth 60fps translation for background text
  const rawTextY = useTransform(scrollYProgress, [0, 1], [0, 100]);
  const textParallax = useSpring(rawTextY, { stiffness: 75, damping: 24, mass: 0.2 });

  return (
    <section
      ref={heroRef}
      id="hero"
      className="relative flex min-h-dvh w-full flex-col justify-between overflow-hidden bg-paper px-4 pb-8 pt-24 sm:px-8 sm:pt-28"
    >
      <GhostMarquee />

      {/* top meta row */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 flex items-start justify-between"
      >
        <div className="flex items-center gap-2 rounded-full border border-hairline bg-paper/80 px-3 py-1.5 backdrop-blur-sm">
          <span className="h-1.5 w-1.5 rounded-full bg-signal" />
          <span className="font-mono text-[10px] uppercase tracking-widest2 text-inkSoft sm:text-xs">
            New gen &middot; Indian dev
          </span>
        </div>
        <div className="rounded-full border border-hairline bg-ink px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest2 text-paper sm:text-xs">
          v2.4 &middot; shipping
        </div>
      </motion.div>

      {/* main content container */}
      <div className="relative z-10 mx-auto flex w-full max-w-2xl flex-1 flex-col items-center justify-center py-12 text-center">
        {/* 3D HTML ANKIT Text */}
        <motion.div
          style={{ y: textParallax, willChange: "transform" }}
          className="relative z-10 flex justify-center text-center select-none"
        >
          <motion.h1
            initial={{ opacity: 0, y: 40, scale: 0.95, filter: "blur(8px)" }}
            animate={{
              opacity: 1,
              y: [0, -4, 0],
              scale: 1,
              filter: "blur(0px)",
            }}
            transition={{
              opacity: { duration: 0.9, ease: [0.16, 1, 0.3, 1] },
              y: { repeat: Infinity, duration: 4.5, ease: "easeInOut" },
              scale: { duration: 0.9, ease: [0.16, 1, 0.3, 1] },
              filter: { duration: 0.9 },
            }}
            className="font-display text-[22vw] sm:text-[140px] md:text-[180px] lg:text-[210px] font-black leading-none tracking-tight text-white"
            style={{
              textShadow: `
                0 1px 0 #f1f5f9,
                0 2px 0 #e2e8f0,
                0 3px 0 #cbd5e1,
                0 4px 6px rgba(0, 0, 0, 0.05),
                0 10px 20px rgba(0, 0, 0, 0.04)
              `,
            }}
          >
            ANKIT
          </motion.h1>
        </motion.div>

        {/* Speech-bubble callout / Status badge */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          whileHover={{ y: -3 }}
          className="mt-6 flex items-center gap-3 rounded-full border border-hairline bg-paper/90 px-4 py-2.5 shadow-sm backdrop-blur-sm"
        >
          <span className="h-2 w-2 rounded-full bg-signal animate-pulse" />
          <span className="font-mono text-xs text-inkSoft sm:text-sm">
            Shh... building in silence. Loud when it ships.
          </span>
        </motion.div>
      </div>

      {/* stat bar */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="relative z-10 mx-auto flex w-full max-w-md items-center justify-between rounded-2xl bg-ink px-5 py-4 text-paper sm:max-w-lg"
      >
        {STATS.map((s, i) => (
          <div
            key={s.label}
            className={`flex flex-1 flex-col items-center text-center ${
              i > 0 ? "border-l border-paper/15" : ""
            }`}
          >
            <span className="font-display text-lg sm:text-xl">{s.value}</span>
            <span className="mt-1 font-mono text-[9px] uppercase tracking-widest2 text-paper/60 sm:text-[10px]">
              {s.label}
            </span>
          </div>
        ))}
      </motion.div>
    </section>
  );
}
