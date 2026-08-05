"use client";

import { useEffect, useState, type ComponentType } from "react";
import { motion } from "framer-motion";
import { Send, Mail, Instagram, Github, Ghost, Linkedin } from "lucide-react";
import type { SocialLink } from "@/lib/socials";

const WhatsAppIcon: ComponentType<{ size?: number }> = ({ size = 18 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M3 21l1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z" />
    <path d="M8.5 8.5c.5 1.5 2.5 4.5 4 5s2-.5 2.5-1" />
  </svg>
);

const ICONS: Record<SocialLink["icon"], ComponentType<{ size?: number }>> = {
  telegram: Send,
  whatsapp: WhatsAppIcon,
  mail: Mail,
  instagram: Instagram,
  snapchat: Ghost,
  github: Github,
  linkedin: Linkedin,
};


export default function ConnectRail({ links }: { links: SocialLink[] }) {
  const [isPastStack, setIsPastStack] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const stackElem = document.getElementById("stack");
      if (stackElem) {
        const rect = stackElem.getBoundingClientRect();
        // When bottom of #stack (002) passes above ~180px from viewport top, swing away
        setIsPastStack(rect.bottom <= 180);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.div
      aria-label="Direct connect"
      initial={{ opacity: 0, x: -20, rotate: 0 }}
      animate={
        isPastStack
          ? { x: -110, rotate: -25, opacity: 0, pointerEvents: "none" }
          : { x: 0, rotate: 0, opacity: 1, pointerEvents: "auto" }
      }
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="fixed left-2 top-1/2 z-40 flex -translate-y-1/2 flex-col gap-2.5 sm:left-3 sm:gap-3 md:left-6"
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
            animate={
              isPastStack
                ? { rotate: -15, scale: 0.85 }
                : {
                    rotate: [-3.5, 3.5, -3.5],
                  }
            }
            transition={
              isPastStack
                ? { duration: 0.4 }
                : {
                    rotate: {
                      repeat: Infinity,
                      repeatType: "mirror",
                      duration: 3 + i * 0.4,
                      ease: "easeInOut",
                    },
                    delay: i * 0.06,
                  }
            }
            whileHover={{ scale: 1.12, rotate: 8, backgroundColor: "#0A0A0A", color: "#F5F5F3" }}
            whileTap={{ scale: 0.88, rotate: -10 }}
            className="flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-2xl border border-hairline bg-paper text-ink shadow-sm transition-colors"
          >
            <Icon size={18} />
          </motion.a>
        );
      })}
    </motion.div>
  );
}
