"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import GhostMarquee from "./GhostMarquee";

const STATS = [
  { value: "3+", label: "Projects shipped" },
  { value: "99+", label: "Cups of coffee" },
  { value: "\u221E", label: "Sarcasm & energy" },
];

export default function Hero() {
  const heroRef = useRef<HTMLDivElement>(null);

  // Container-relative scroll progress tracking (works bi-directionally on mobile touch & desktop)
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  // Smooth 60fps translation behind character (0px -> 140px)
  const rawTextY = useTransform(scrollYProgress, [0, 1], [0, 140]);
  const textParallax = useSpring(rawTextY, { stiffness: 75, damping: 24, mass: 0.2 });

  return (
    <section
      ref={heroRef}
      id="hero"
      className="relative flex min-h-dvh w-full flex-col overflow-hidden bg-paper px-4 pb-8 pt-24 sm:px-8 sm:pt-28"
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

      {/* main portrait container */}
      <div className="relative z-10 mx-auto mt-6 w-full max-w-md flex-1 sm:max-w-lg">
        
        {/* Layer 2: 3D HTML ANKIT Text (sitting behind character) */}
        <motion.div
          style={{ y: textParallax, willChange: "transform" }}
          className="absolute top-6 left-0 right-0 z-0 flex justify-center text-center pointer-events-none select-none sm:top-2"
        >
          <motion.h1
            initial={{ opacity: 0, y: 40, scale: 0.95, filter: "blur(8px)" }}
            animate={{
              opacity: 1,
              y: [0, -3.5, 0],
              scale: 1,
              filter: "blur(0px)",
            }}
            transition={{
              opacity: { duration: 0.9, ease: [0.16, 1, 0.3, 1] },
              y: { repeat: Infinity, duration: 4.5, ease: "easeInOut" },
              scale: { duration: 0.9, ease: [0.16, 1, 0.3, 1] },
              filter: { duration: 0.9 },
            }}
            className="font-display text-[22vw] sm:text-[135px] md:text-[170px] lg:text-[195px] font-black leading-none tracking-tight text-white"
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

        {/* Layer 3: Character PNG (Ankit transparent cutout) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 aspect-[4/5] w-full"
        >
          <Image
            src="/images/hero-ankit.png"
            alt="Ankit, hand raised to lips in a shush gesture"
            fill
            priority
            sizes="(max-width: 640px) 100vw, 512px"
            className="object-contain"
          />
        </motion.div>

        {/* Layer 4: Speech-bubble callout */}
        <motion.div
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          whileHover={{ y: -3 }}
          className="absolute left-0 top-[38%] z-20 flex items-center gap-2 rounded-full border border-hairline bg-paper px-3 py-2 shadow-sm sm:-left-6"
        >
          <span className="font-mono text-[10px] leading-tight text-inkSoft sm:text-xs">
            Shh... building in silence.
            <br />
            Loud when it ships.
          </span>
        </motion.div>

        {/* Layer 5: Suited polaroid card */}
        <motion.a
          href="#about"
          initial={{ opacity: 0, y: 20, rotate: 6 }}
          whileInView={{ opacity: 1, y: 0, rotate: 3 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          whileHover={{ rotate: 0, scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className="absolute -bottom-6 -right-2 z-20 w-28 rounded-xl border border-hairline bg-ink p-1.5 shadow-lg sm:-right-8 sm:w-36"
        >
          <div className="relative aspect-[3/4] w-full overflow-hidden rounded-md">
            <Image
              src="/images/face-card.png"
              alt="Ankit in a black suit under red light — tap to read about him"
              fill
              sizes="150px"
              className="object-cover"
            />
          </div>
          <div className="mt-1.5 flex items-center justify-between px-0.5">
            <span className="font-mono text-[9px] tracking-widest2 text-paper">BEING FRZI</span>
            <span className="h-1.5 w-1.5 rounded-full bg-signal" />
          </div>
        </motion.a>
      </div>

      {/* stat bar */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="relative z-10 mx-auto mt-10 flex w-full max-w-md items-center justify-between rounded-2xl bg-ink px-5 py-4 text-paper sm:max-w-lg"
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
