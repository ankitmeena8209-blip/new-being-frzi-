"use client";

import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";

export default function Header() {
  return (
    <motion.header
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed inset-x-0 top-0 z-50 flex items-center justify-between px-4 pt-[max(0.75rem,env(safe-area-inset-top))] sm:px-8"
    >
      <div className="flex items-center gap-2">
        <a
          href="/"
          className="rounded-full border border-hairline bg-paper/80 px-3 py-1.5 font-mono text-[11px] tracking-widest2 backdrop-blur-sm sm:text-xs"
        >
          BEING FRZI
        </a>

        <a
          href="/work"
          className="rounded-full border border-hairline bg-paper/80 px-3 py-1.5 font-mono text-[11px] tracking-widest2 text-inkSoft hover:text-ink hover:bg-white backdrop-blur-sm sm:text-xs transition-colors"
        >
          WORK
        </a>
      </div>

      <motion.a
        href="#connect"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.94 }}
        className="flex items-center gap-1.5 rounded-full bg-ink px-3.5 py-1.5 font-mono text-[11px] tracking-widest2 text-paper sm:text-xs"
      >
        <MessageCircle size={13} />
        Message
      </motion.a>
    </motion.header>
  );
}
