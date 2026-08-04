"use client";

import type { ComponentType } from "react";
import { motion } from "framer-motion";
import { Send, Mail, Instagram, Github, Ghost, Linkedin } from "lucide-react";
import type { SocialLink } from "@/lib/socials";

const ICONS: Record<SocialLink["icon"], ComponentType<{ size?: number }>> = {
  telegram: Send,
  mail: Mail,
  instagram: Instagram,
  snapchat: Ghost,
  github: Github,
  linkedin: Linkedin,
};

export default function ConnectRail({ links }: { links: SocialLink[] }) {
  return (
    <div
      className="fixed left-3 top-1/2 z-40 hidden -translate-y-1/2 flex-col gap-3 sm:flex md:left-6"
      aria-label="Direct connect"
    >
      {links.map((link, i) => {
        const Icon = ICONS[link.icon];
        return (
          <motion.a
            key={link.id}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={link.label}
            initial={{ opacity: 0, x: -12 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.06, duration: 0.4 }}
            whileHover={{ scale: 1.08, backgroundColor: "#0A0A0A", color: "#F5F5F3" }}
            whileTap={{ scale: 0.92 }}
            className="flex h-11 w-11 items-center justify-center rounded-2xl border border-hairline bg-paper text-ink shadow-sm transition-colors"
          >
            <Icon size={18} />
          </motion.a>
        );
      })}
    </div>
  );
}
