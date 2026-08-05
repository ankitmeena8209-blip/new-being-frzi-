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
    fill="currentColor"
    className="shrink-0"
  >
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.572-.086 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.99c-.002 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.05 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413" />
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
