"use client";

import { useState, type FormEvent, type ComponentType } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Mail, Instagram, Github, Ghost, Linkedin, Loader2, Check } from "lucide-react";
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


type Status = "idle" | "loading" | "success" | "error";

export default function ConnectStrip({ links }: { links: SocialLink[] }) {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");

    const form = e.currentTarget;
    const data = {
      name: (form.elements.namedItem("name") as HTMLInputElement).value,
      email: (form.elements.namedItem("email") as HTMLInputElement).value,
      message: (form.elements.namedItem("message") as HTMLTextAreaElement).value,
    };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Message didn't send. Try a direct link below instead.");
      setStatus("success");
      form.reset();
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Something broke.");
    }
  }

  return (
    <section id="connect" className="relative bg-ink px-4 py-20 text-paper sm:px-8 sm:py-28">
      <div className="mx-auto max-w-3xl">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="font-mono text-[10px] uppercase tracking-widest2 text-paper/50"
        >
          004 &middot; Connect
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.05 }}
          className="mt-2 font-display text-3xl leading-[0.95] sm:text-5xl"
        >
          Let's build something.
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="mt-3 text-sm text-paper/60 sm:text-base"
        >
          Probably online. Probably building something. Or just doing bakchodi
          somewhere on the internet.
        </motion.p>

        {/* message form */}
        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.15 }}
          className="mt-10 space-y-3"
        >
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <input
              name="name"
              required
              placeholder="Your name"
              className="w-full rounded-xl border border-paper/20 bg-transparent px-4 py-3 text-sm placeholder:text-paper/40 focus-visible:outline-paper"
            />
            <input
              name="email"
              type="email"
              placeholder="Your email (optional)"
              className="w-full rounded-xl border border-paper/20 bg-transparent px-4 py-3 text-sm placeholder:text-paper/40 focus-visible:outline-paper"
            />
          </div>
          <textarea
            name="message"
            required
            rows={4}
            placeholder="Your message"
            className="w-full rounded-xl border border-paper/20 bg-transparent px-4 py-3 text-sm placeholder:text-paper/40 focus-visible:outline-paper"
          />

          <motion.button
            type="submit"
            disabled={status === "loading"}
            whileHover={{ scale: status === "loading" ? 1 : 1.02 }}
            whileTap={{ scale: 0.97 }}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-paper px-5 py-3.5 font-mono text-xs uppercase tracking-widest2 text-ink transition-opacity disabled:opacity-60 sm:w-auto"
          >
            <AnimatePresence mode="wait" initial={false}>
              {status === "loading" ? (
                <motion.span
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center gap-2"
                >
                  <Loader2 size={14} className="animate-spin" /> Sending
                </motion.span>
              ) : status === "success" ? (
                <motion.span
                  key="success"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center gap-2"
                >
                  <Check size={14} /> Sent
                </motion.span>
              ) : (
                <motion.span key="idle">Send message</motion.span>
              )}
            </AnimatePresence>
          </motion.button>

          {status === "error" && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="font-mono text-xs text-signal"
              role="alert"
            >
              {errorMsg}
            </motion.p>
          )}
        </motion.form>

        {/* direct connect buttons — primary access point on mobile */}
        <div className="mt-14">
          <p className="font-mono text-[10px] uppercase tracking-widest2 text-paper/50">
            Or connect directly
          </p>
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-6">
            {links.map((link, i) => {
              const Icon = ICONS[link.icon];
              return (
                <motion.a
                  key={link.id}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-20px" }}
                  transition={{ delay: i * 0.06, duration: 0.4 }}
                  whileHover={{ y: -3, borderColor: "rgba(245,245,243,0.6)" }}
                  whileTap={{ scale: 0.96 }}
                  className="flex flex-col items-center gap-2 rounded-xl border border-paper/15 px-3 py-4 text-center"
                >
                  <Icon size={18} />
                  <span className="font-mono text-[10px] tracking-widest2">{link.label}</span>
                </motion.a>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
