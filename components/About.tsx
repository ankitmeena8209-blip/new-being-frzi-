"use client";

import { motion } from "framer-motion";
import { Brush, Code2, Wand2, Smile } from "lucide-react";

const TIMELINE = [
  {
    year: "2020",
    tag: "Free Fire > Future",
    title: "Average guy on the internet",
    detail: "Professional time-waste specialist. Worst investment of my life.",
  },
  {
    year: "2022",
    tag: "System overhaul",
    title: "The 'inspect element' era",
    detail: "Lost the only thing that mattered. Aur uske saath khud ko bhi.",
  },
  {
    year: "2024",
    tag: "Bakchodi.exe active",
    title: "Building random stuff",
    detail: "System rebooted. Reality hit. Curiosity returned.",
  },
  {
    year: "2026",
    tag: "Live & cooking",
    title: "What's next?",
    detail: "Still reading? Go explore the rest of the page.",
  },
];

const ABILITIES = [
  { icon: Brush, label: "Design & UX", detail: "Aesthetic & modern" },
  { icon: Code2, label: "Frontend architecture", detail: "Next.js / React / TS" },
  { icon: Wand2, label: "Motion engineering", detail: "Framer Motion" },
  { icon: Smile, label: "Sarcasm & creativity", detail: "Expert level 99+" },
];

const TRAITS = ["OVERTHINKER", "BUILDER", "BAKCHOD", "SHIPPING"];

export default function About() {
  return (
    <section id="about" className="relative bg-paper px-4 py-20 sm:px-8 sm:py-28">
      <div className="mx-auto max-w-3xl">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="font-mono text-[10px] uppercase tracking-widest2 text-muted"
        >
          003 &middot; About
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.05 }}
          className="mt-2 font-display text-3xl leading-[0.95] sm:text-5xl"
        >
          Not an expert.
          <br />
          Just someone who builds random stuff.
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="mt-4 max-w-xl text-sm text-inkSoft sm:text-base"
        >
          I'm Ankit — professional overthinker, part-time developer, full-time
          bakchod. Kabhi code likhta hoon, kabhi code mujhe likh deta hai.
        </motion.p>

        {/* poster-style "About Me" black card with pill traits */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.15, duration: 0.5 }}
          className="mt-6 rounded-2xl bg-ink p-5 text-paper"
        >
          <div className="flex flex-wrap gap-2">
            {TRAITS.map((t) => (
              <motion.span
                key={t}
                whileHover={{ scale: 1.06 }}
                whileTap={{ scale: 0.94 }}
                className="rounded-full border border-paper/20 px-3 py-1 font-mono text-[10px] tracking-widest2"
              >
                {t}
              </motion.span>
            ))}
          </div>
        </motion.div>

        {/* timeline — numbered rows, real sequence so numbering earns its place */}
        <ol className="mt-14 space-y-0">
          {TIMELINE.map((item, i) => (
            <motion.li
              key={item.year}
              initial={{ opacity: 0, x: -16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ delay: i * 0.08, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="flex gap-4 border-t border-hairline py-5 first:border-t-0 sm:gap-6"
            >
              <span className="font-mono text-xs text-muted sm:text-sm">{item.year}</span>
              <div className="flex-1">
                <span className="font-mono text-[10px] uppercase tracking-widest2 text-signal">
                  {item.tag}
                </span>
                <p className="mt-1 font-display text-base sm:text-lg">{item.title}</p>
                <p className="mt-1 text-xs text-muted sm:text-sm">{item.detail}</p>
              </div>
            </motion.li>
          ))}
        </ol>

        {/* abilities grid */}
        <div className="mt-14 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {ABILITIES.map((a, i) => {
            const Icon = a.icon;
            return (
              <motion.div
                key={a.label}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ delay: i * 0.06, duration: 0.4 }}
                whileHover={{ y: -3 }}
                whileTap={{ scale: 0.97 }}
                className="rounded-2xl border border-hairline bg-white/40 p-3 text-center sm:p-4"
              >
                <Icon size={16} className="mx-auto text-ink" />
                <p className="mt-2 font-display text-[11px] leading-tight sm:text-xs">
                  {a.label}
                </p>
                <p className="mt-1 font-mono text-[9px] text-muted">{a.detail}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
