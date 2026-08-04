"use client";

import { motion } from "framer-motion";
import { Terminal, Sparkles, Palette, Database, ArrowRight } from "lucide-react";

const TOOLS = [
  {
    icon: Terminal,
    name: "Next.js 14",
    detail: "React Server Components & App Router",
  },
  {
    icon: Sparkles,
    name: "Framer Motion",
    detail: "60fps spring & layout physics",
  },
  {
    icon: Palette,
    name: "Tailwind CSS",
    detail: "Custom design-token system",
  },
  {
    icon: Database,
    name: "Prisma & SQL",
    detail: "Type-safe ORM, relational schema",
  },
];

export default function Stack() {
  return (
    <section id="stack" className="relative bg-paper px-4 py-20 sm:px-8 sm:py-28">
      <div className="mx-auto max-w-3xl">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="font-mono text-[10px] uppercase tracking-widest2 text-muted"
        >
          002 &middot; Stack
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.05 }}
          className="mt-2 font-display text-3xl leading-[0.95] sm:text-5xl"
        >
          What's under the hood.
        </motion.h2>

        <div className="mt-10 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {TOOLS.map((tool, i) => {
            const Icon = tool.icon;
            return (
              <motion.div
                key={tool.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ delay: i * 0.08, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ y: -4 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-start gap-3 rounded-2xl border border-hairline bg-white/40 p-4 shadow-sm"
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-ink text-paper">
                  <Icon size={16} />
                </div>
                <div>
                  <p className="font-display text-sm">{tool.name}</p>
                  <p className="mt-1 font-body text-xs text-muted">{tool.detail}</p>
                </div>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.35, duration: 0.5 }}
          className="mt-10 flex justify-center"
        >
          <a href="/work">
            <motion.button
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.97 }}
              className="group flex items-center gap-3 rounded-full border border-hairline bg-ink px-6 py-3.5 shadow-md hover:bg-ink/90 transition-colors"
            >
              <span className="font-display text-sm uppercase tracking-wider text-paper">
                Explore Work
              </span>
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-paper/20 text-paper transition-transform duration-300 group-hover:translate-x-1">
                <ArrowRight size={14} />
              </div>
            </motion.button>
          </a>
        </motion.div>
      </div>
    </section>
  );
}
