"use client";

import { useEffect, useId, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useInView, useReducedMotion } from "framer-motion";
import { ArrowLeft, ExternalLink, Github, Lock, Sparkles } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { fetchProjects, Project } from "@/lib/supabase";

/* ------------------------------------------------------------------ */
/* Config — pastel tints + pin colors (move into tailwind tokens later) */
/* ------------------------------------------------------------------ */
const TILTS: readonly number[] = [-5, 4, -4, 5, -3, 4]; // deterministic: no Math.random (hydration safe)
const EASE = [0.16, 1, 0.3, 1] as const;

type Tint = { from: string; to: string };
const TINTS: readonly Tint[] = [
  { from: "#FDE6D3", to: "#FCF2E9" }, // peach
  { from: "#D9E2FF", to: "#EBF0FF" }, // periwinkle
  { from: "#E9D8FB", to: "#F5EEFD" }, // lilac
];
const PINS: readonly { a: string; b: string }[] = [
  { a: "#FF9A6B", b: "#E4442B" }, // orange (matches signal)
  { a: "#8FA8FF", b: "#3E5BE0" }, // blue
  { a: "#B79BFF", b: "#6A45E0" }, // violet
];

const hasRealImage = (url?: string | null) =>
  !!url && url.trim() !== "" && !url.includes("face-card");

const hash = (s: string) => {
  let h = 7;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h;
};

const initials = (title: string) =>
  title
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("") || "•";

/* ------------------------------------------------------------------ */
/* Generated project mark (replaces the face photo)                    */
/* ------------------------------------------------------------------ */
function ProjectMark({ title, category }: { title: string; category: string }) {
  const h = hash(`${title}|${category}`);
  const c = (category || "").toLowerCase();
  const rot = (h % 24) - 12;
  const j = (n: number) => ((h >> n) % 9) - 4; // small jitter

  let motif: JSX.Element;
  if (c.includes("full")) {
    motif = (
      <>
        {[0, 1, 2].map((i) => (
          <rect key={i} x={58 + j(i)} y={26 + i * 20} width={84} height={52} rx={12}
            fill="rgba(255,255,255,0.55)" stroke="currentColor" strokeWidth={1.5}
            opacity={1 - i * 0.28} />
        ))}
      </>
    );
  } else if (c.includes("mob")) {
    motif = (
      <>
        <rect x={72} y={16} width={56} height={118} rx={14} fill="rgba(255,255,255,0.55)"
          stroke="currentColor" strokeWidth={1.5} />
        <rect x={90} y={25} width={20} height={4} rx={2} fill="currentColor" opacity={0.5} />
        <circle cx={100} cy={118} r={4} fill="currentColor" opacity={0.5} />
      </>
    );
  } else if (c.includes("ai")) {
    const base: [number, number][] = [[48, 46], [100, 28], [152, 50], [68, 104], [134, 108]];
    const pts: [number, number][] = base.map(([x, y], i) => [x + j(i), y + j(i + 3)]);
    const edges: [number, number][] = [[0, 1], [1, 2], [0, 3], [1, 3], [1, 4], [2, 4], [3, 4]];
    motif = (
      <>
        {edges.map(([a, b], i) => (
          <line key={i} x1={pts[a]![0]} y1={pts[a]![1]} x2={pts[b]![0]} y2={pts[b]![1]}
            stroke="currentColor" strokeWidth={1.2} opacity={0.5} />
        ))}
        {pts.map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r={7} fill="rgba(255,255,255,0.8)" stroke="currentColor" strokeWidth={1.5} />
        ))}
      </>
    );
  } else {
    motif = (
      <>
        {[22, 40, 58].map((r, i) => (
          <circle key={r} cx={100} cy={75} r={r} fill="none" stroke="currentColor"
            strokeWidth={1.5} opacity={1 - i * 0.28} />
        ))}
      </>
    );
  }

  return (
    <span aria-hidden="true" className="relative block h-full w-full text-ink/30">
      <svg viewBox="0 0 200 150" className="absolute inset-0 h-full w-full"
        preserveAspectRatio="xMidYMid meet">
        <g transform={`rotate(${rot} 100 75)`}>{motif}</g>
      </svg>
      <span className="absolute inset-0 grid place-items-center font-display text-3xl text-ink/80 sm:text-5xl">
        {initials(title)}
      </span>
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* Pin                                                                 */
/* ------------------------------------------------------------------ */
function Pin({ i, rm }: { i: number; rm: boolean }) {
  const { a, b } = PINS[i % PINS.length]!;
  return (
    <motion.span
      aria-hidden="true"
      initial={rm ? false : { y: -16, scale: 1.35, opacity: 0 }}
      whileInView={{ y: 0, scale: 1, opacity: 1 }}
      viewport={{ once: true, amount: 0.5 }}
      transition={{ delay: 0.3, duration: 0.45, ease: EASE }}
      className="absolute left-1/2 top-2.5 z-10 h-5 w-5 -translate-x-1/2 rounded-full sm:h-6 sm:w-6"
      style={{
        background: `radial-gradient(circle at 35% 30%, ${a}, ${b} 72%)`,
        boxShadow: `0 7px 8px -3px ${b}77, inset 0 -2px 3px rgba(0,0,0,.2), inset 0 2px 2px rgba(255,255,255,.6)`,
      }}
    />
  );
}

/* ------------------------------------------------------------------ */
/* Dashed connector — draws on when it enters the viewport             */
/* ------------------------------------------------------------------ */
function Connector({ flip, rm }: { flip: boolean; rm: boolean }) {
  const id = useId().replace(/:/g, "");
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.4 });
  const d = flip ? "M74 0 C 74 55, 26 45, 26 100" : "M26 0 C 26 55, 74 45, 74 100";

  return (
    <div ref={ref} aria-hidden="true" className="pointer-events-none relative z-0 -my-3 h-24 w-full sm:h-32">
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="h-full w-full overflow-visible">
        <defs>
          <mask id={id} maskUnits="userSpaceOnUse" x="-10" y="0" width="120" height="100">
            <motion.path
              d={d} fill="none" stroke="#fff" strokeWidth={8} vectorEffect="non-scaling-stroke"
              initial={{ pathLength: rm ? 1 : 0 }}
              animate={{ pathLength: inView || rm ? 1 : 0 }}
              transition={{ duration: 1, ease: EASE, delay: 0.15 }}
            />
          </mask>
        </defs>
        {/* dashes stay dashed because the *mask* is what animates */}
        <path d={d} fill="none" stroke="currentColor" className="text-inkSoft/50"
          strokeWidth={1.5} strokeDasharray="5 6" vectorEffect="non-scaling-stroke"
          mask={`url(#${id})`} />
      </svg>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Note card                                                           */
/* ------------------------------------------------------------------ */
function Note({
  project, index, rm, onOpen,
}: { project: Project; index: number; rm: boolean; onOpen: () => void }) {
  const tilt = TILTS[index % TILTS.length]!;
  const tint = TINTS[index % TINTS.length]!;
  const right = index % 2 === 1;

  return (
    <li className={`relative z-10 flex w-full ${right ? "justify-end" : "justify-start"}`}>
      <motion.div
        initial={rm ? false : { opacity: 0, y: 48, scale: 0.94, rotate: tilt * 1.8 }}
        whileInView={{ opacity: 1, y: 0, scale: 1, rotate: tilt }}
        viewport={{ once: true, amount: 0.3, margin: "0px 0px -8% 0px" }}
        transition={{ type: "spring", stiffness: 120, damping: 18, mass: 0.8 }}
        whileHover={{ rotate: 0, y: -6, scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        className="w-[60%] sm:w-[min(340px,42%)]"
      >
        <motion.div
          animate={rm ? undefined : { y: [0, -3, 0] }}
          transition={{ duration: 5 + (index % 3), repeat: Infinity, ease: "easeInOut", delay: index * 0.4 }}
          className="relative"
        >
          <Pin i={index} rm={rm} />
          <button
            type="button"
            onClick={onOpen}
            aria-label={`Open details: ${project.title}`}
            className="block min-h-[44px] w-full rounded-[28px] bg-white p-2.5 pt-9 text-left sm:rounded-[32px] sm:p-3 sm:pt-10"
            style={{
              boxShadow:
                "inset 0 1px 0 rgba(255,255,255,.9), 0 2px 6px rgba(10,10,10,.06), 0 22px 40px -14px rgba(10,10,10,.18)",
            }}
          >
            <span
              className="relative block aspect-[5/4] w-full overflow-hidden rounded-2xl"
              style={{
                background: `linear-gradient(160deg, ${tint.from}, ${tint.to})`,
                boxShadow: "inset 0 0 0 1px rgba(255,255,255,.7), inset 0 -8px 16px -10px rgba(10,10,10,.08)",
              }}
            >
              {hasRealImage(project.image_url) ? (
                <Image src={project.image_url} alt="" fill sizes="(max-width: 640px) 60vw, 340px"
                  className="object-cover" />
              ) : (
                <ProjectMark title={project.title} category={project.category} />
              )}
            </span>
            <span className="mt-2.5 block px-1 pb-1">
              <span className="line-clamp-2 block font-display text-sm leading-tight sm:text-lg">
                {project.title}
              </span>
              <span className="mt-1 block font-mono text-[10px] uppercase tracking-widest2 text-muted">
                {project.category}
              </span>
            </span>
          </button>
        </motion.div>
      </motion.div>
    </li>
  );
}

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */
export default function WorkPage() {
  const rm = !!useReducedMotion();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  useEffect(() => {
    (async () => {
      setLoading(true);
      setProjects(await fetchProjects());
      setLoading(false);
    })();
  }, []);

  useEffect(() => {
    if (!selectedProject) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setSelectedProject(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selectedProject]);

  const modalTint = TINTS[hash(selectedProject?.title ?? "") % TINTS.length]!;
  const headline = "Selected Works & Experiments.".split(" ");

  return (
    <main className="relative flex min-h-screen w-full flex-col overflow-x-hidden bg-paper text-ink">
      <Header />

      {/* Heading */}
      <section className="relative z-10 px-4 pt-32 pb-8 sm:px-8 sm:pt-36">
        <div className="mx-auto max-w-4xl">
          <div className="flex items-center justify-between">
            <a href="/"
              className="inline-flex min-h-[44px] items-center gap-2 rounded-full border border-hairline bg-paper/80 px-4 font-mono text-xs uppercase tracking-widest text-inkSoft transition-colors hover:bg-ink hover:text-paper">
              <ArrowLeft size={14} /> Back to Home
            </a>
            <a href="/admin"
              className="inline-flex min-h-[44px] items-center gap-2 rounded-full border border-hairline bg-ink px-4 font-mono text-xs uppercase tracking-widest text-paper shadow-sm transition-colors hover:bg-ink/80">
              <Lock size={12} /> Admin Portal
            </a>
          </div>

          <div className="mt-8 border-b border-hairline pb-8">
            <p className="font-mono text-xs uppercase tracking-widest2 text-muted">003 &middot; Portfolio Showcase</p>
            <h1 className="mt-2 font-display text-4xl leading-none sm:text-6xl lg:text-7xl" aria-label="Selected Works & Experiments.">
              {headline.map((w, i) => (
                <motion.span key={i} aria-hidden="true"
                  initial={rm ? false : { opacity: 0, y: 20, filter: "blur(8px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  transition={{ duration: 0.7, delay: 0.08 * i, ease: EASE }}
                  className="mr-[0.25em] inline-block">
                  {w}
                </motion.span>
              ))}
            </h1>
            <p className="mt-4 max-w-xl font-body text-base text-inkSoft">
              Pinned in the order they shipped. Tap a note for the full story.
            </p>
          </div>
        </div>
      </section>

      {/* Pinboard */}
      <section className="relative z-10 px-4 pb-28 sm:px-8">
        <div
          className="relative mx-auto max-w-4xl px-1 py-10 sm:px-6"
          style={{
            backgroundImage:
              "repeating-linear-gradient(to bottom, transparent 0 35px, rgba(10,10,10,0.06) 35px 36px)",
            WebkitMaskImage: "linear-gradient(to bottom, transparent, #000 6%, #000 94%, transparent)",
            maskImage: "linear-gradient(to bottom, transparent, #000 6%, #000 94%, transparent)",
          }}
        >
          {loading ? (
            <div className="flex min-h-[300px] items-center justify-center font-mono text-sm text-muted">
              <Sparkles className="mr-2 animate-spin" size={16} /> Pinning things up...
            </div>
          ) : projects.length === 0 ? (
            <div className="mx-auto flex min-h-[250px] max-w-sm flex-col items-center justify-center rounded-[28px] border border-hairline bg-white/70 p-8 text-center">
              <p className="font-display text-lg">Nothing pinned here yet.</p>
            </div>
          ) : (
            <ol className="relative flex flex-col items-stretch">
              {projects.map((p, i) => (
                <div key={p.id} className="contents">
                  {i > 0 && <Connector flip={i % 2 === 0} rm={rm} />}
                  <Note project={p} index={i} rm={rm} onOpen={() => setSelectedProject(p)} />
                </div>
              ))}
            </ol>
          )}
        </div>
      </section>

      {/* Details modal */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setSelectedProject(null)}
            className="fixed inset-0 z-[60] flex items-center justify-center bg-ink/60 p-4 backdrop-blur-md"
            role="dialog" aria-modal="true" aria-label={selectedProject.title}
          >
            <motion.div
              initial={{ scale: 0.95, y: 12 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 12 }}
              transition={{ duration: 0.35, ease: EASE }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-[32px] border border-hairline bg-paper p-6 shadow-2xl sm:p-8"
            >
              <button onClick={() => setSelectedProject(null)} aria-label="Close"
                className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full bg-ink font-mono text-sm text-paper">
                &times;
              </button>

              <span className="font-mono text-xs uppercase tracking-widest text-muted">{selectedProject.category}</span>
              <h2 className="mt-1 pr-12 font-display text-3xl sm:text-4xl">{selectedProject.title}</h2>

              <div className="relative mt-4 aspect-[16/9] w-full overflow-hidden rounded-2xl border border-hairline"
                style={{ background: `linear-gradient(160deg, ${modalTint.from}, ${modalTint.to})` }}>
                {hasRealImage(selectedProject.image_url) ? (
                  <Image src={selectedProject.image_url} alt={selectedProject.title} fill sizes="600px" className="object-cover" />
                ) : (
                  <ProjectMark title={selectedProject.title} category={selectedProject.category} />
                )}
              </div>

              <p className="mt-6 font-body text-base leading-relaxed text-inkSoft">{selectedProject.description}</p>

              {selectedProject.tags?.length > 0 && (
                <div className="mt-6">
                  <p className="font-mono text-xs uppercase text-muted">Tech Stack:</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {selectedProject.tags.map((t) => (
                      <span key={t} className="rounded-full bg-ink px-3 py-1 font-mono text-xs text-paper">{t}</span>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-8 flex items-center justify-end gap-3 border-t border-hairline pt-4">
                {selectedProject.github_url && (
                  <a href={selectedProject.github_url} target="_blank" rel="noreferrer"
                    className="flex min-h-[44px] items-center gap-2 rounded-full border border-hairline px-4 font-mono text-xs text-ink hover:bg-white">
                    <Github size={14} /> Repository
                  </a>
                )}
                {selectedProject.demo_url && (
                  <a href={selectedProject.demo_url} target="_blank" rel="noreferrer"
                    className="flex min-h-[44px] items-center gap-2 rounded-full bg-ink px-5 font-mono text-xs text-paper hover:bg-ink/90">
                    <ExternalLink size={14} /> Visit Project
                  </a>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </main>
  );
}
