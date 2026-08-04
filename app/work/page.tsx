"use client";

import { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import GhostMarquee from "@/components/GhostMarquee";
import { fetchProjects, Project } from "@/lib/supabase";
import { ExternalLink, Github, ArrowLeft, Lock, Filter, Sparkles } from "lucide-react";
import Image from "next/image";

const CATEGORIES = ["All", "Fullstack", "Mobile", "AI/ML"];

export default function WorkPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const data = await fetchProjects();
      setProjects(data);
      setLoading(false);
    }
    loadData();
  }, []);

  const filteredProjects = useMemo(() => {
    if (selectedCategory === "All") return projects;
    return projects.filter(
      (p) => p.category?.toLowerCase() === selectedCategory.toLowerCase()
    );
  }, [projects, selectedCategory]);

  return (
    <main className="relative flex min-h-screen w-full flex-col bg-paper text-ink overflow-x-hidden">
      <Header />
      <GhostMarquee />

      {/* Top Banner / Hero */}
      <section className="relative z-10 px-4 pt-32 pb-12 sm:px-8 sm:pt-36">
        <div className="mx-auto max-w-5xl">
          <div className="flex items-center justify-between">
            <a
              href="/"
              className="inline-flex items-center gap-2 rounded-full border border-hairline bg-paper/80 px-4 py-2 text-xs font-mono tracking-widest uppercase text-inkSoft hover:bg-ink hover:text-paper transition-colors"
            >
              <ArrowLeft size={14} /> Back to Home
            </a>

            <a
              href="/admin"
              className="inline-flex items-center gap-2 rounded-full border border-hairline bg-ink px-4 py-2 text-xs font-mono tracking-widest uppercase text-paper hover:bg-ink/80 transition-colors shadow-sm"
            >
              <Lock size={12} /> Admin Portal
            </a>
          </div>

          <div className="mt-8">
            <p className="font-mono text-xs uppercase tracking-widest2 text-muted">
              003 &middot; Portfolio Showcase
            </p>
            <h1 className="mt-2 font-display text-4xl sm:text-6xl lg:text-7xl leading-none">
              Selected Works &amp; Experiments.
            </h1>
            <p className="mt-4 max-w-xl font-body text-base text-inkSoft">
              A curated collection of web apps, client projects, mobile experiences, and AI side projects built with obsession over design and performance.
            </p>
          </div>

          {/* Category Filter Pills */}
          <div className="mt-10 flex flex-wrap items-center gap-2 border-b border-hairline pb-6">
            <div className="flex items-center gap-1.5 pr-3 text-xs font-mono text-muted uppercase">
              <Filter size={14} /> Filter:
            </div>
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`rounded-full px-4 py-1.5 font-mono text-xs tracking-wider transition-colors ${
                  selectedCategory === cat
                    ? "bg-ink text-paper shadow-sm"
                    : "border border-hairline bg-white/40 text-inkSoft hover:bg-white"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="relative z-10 px-4 pb-24 sm:px-8">
        <div className="mx-auto max-w-5xl">
          {loading ? (
            <div className="flex min-h-[300px] items-center justify-center font-mono text-sm text-muted">
              <Sparkles className="animate-spin mr-2" size={16} /> Loading project vault...
            </div>
          ) : filteredProjects.length === 0 ? (
            <div className="flex min-h-[250px] flex-col items-center justify-center rounded-2xl border border-hairline bg-white/40 p-8 text-center">
              <p className="font-display text-lg">No projects found in this category.</p>
              <button
                onClick={() => setSelectedCategory("All")}
                className="mt-4 rounded-full bg-ink px-4 py-2 font-mono text-xs text-paper"
              >
                View All Projects
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              {filteredProjects.map((project) => (
                <div
                  key={project.id}
                  className="group relative flex flex-col overflow-hidden rounded-3xl border border-hairline bg-white/60 p-6 shadow-sm transition-all hover:shadow-xl hover:border-ink/20"
                >
                  {/* Image Preview */}
                  <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl bg-paper/50 border border-hairline">
                    <Image
                      src={project.image_url || "/images/face-card.png"}
                      alt={project.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 500px"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute top-3 left-3 rounded-full bg-ink/90 px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-paper backdrop-blur-sm">
                      {project.category}
                    </div>
                  </div>

                  {/* Meta */}
                  <div className="mt-5 flex flex-1 flex-col justify-between">
                    <div>
                      <h3 className="font-display text-2xl group-hover:text-signal transition-colors">
                        {project.title}
                      </h3>
                      <p className="mt-2 font-body text-sm text-inkSoft leading-relaxed line-clamp-3">
                        {project.description}
                      </p>

                      {/* Tags */}
                      <div className="mt-4 flex flex-wrap gap-1.5">
                        {project.tags?.map((tag) => (
                          <span
                            key={tag}
                            className="rounded-md border border-hairline bg-paper/80 px-2 py-0.5 font-mono text-[10px] text-muted"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Action Links */}
                    <div className="mt-6 flex items-center justify-between border-t border-hairline pt-4">
                      <div className="flex items-center gap-3">
                        {project.demo_url && (
                          <a
                            href={project.demo_url}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1.5 font-mono text-xs text-ink hover:underline"
                          >
                            <ExternalLink size={14} /> Live Demo
                          </a>
                        )}
                        {project.github_url && (
                          <a
                            href={project.github_url}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1.5 font-mono text-xs text-muted hover:text-ink transition-colors"
                          >
                            <Github size={14} /> Code
                          </a>
                        )}
                      </div>

                      <button
                        onClick={() => setSelectedProject(project)}
                        className="font-mono text-xs text-inkSoft hover:text-ink underline uppercase"
                      >
                        Details &rarr;
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Modal Detail View */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedProject(null)}
            className="fixed inset-0 z-50 flex items-center justify-center bg-ink/60 p-4 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.95, y: 10 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 10 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-hairline bg-paper p-6 sm:p-8 shadow-2xl"
            >
              <button
                onClick={() => setSelectedProject(null)}
                className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-full bg-ink text-paper font-mono text-xs"
              >
                &times;
              </button>

              <span className="font-mono text-xs uppercase tracking-widest text-muted">
                {selectedProject.category}
              </span>
              <h2 className="mt-1 font-display text-3xl sm:text-4xl">
                {selectedProject.title}
              </h2>

              <div className="relative mt-4 aspect-[16/9] w-full overflow-hidden rounded-2xl border border-hairline">
                <Image
                  src={selectedProject.image_url || "/images/face-card.png"}
                  alt={selectedProject.title}
                  fill
                  sizes="600px"
                  className="object-cover"
                />
              </div>

              <p className="mt-6 font-body text-base text-inkSoft leading-relaxed">
                {selectedProject.description}
              </p>

              <div className="mt-6">
                <p className="font-mono text-xs uppercase text-muted">Tech Stack:</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {selectedProject.tags?.map((t) => (
                    <span
                      key={t}
                      className="rounded-full bg-ink px-3 py-1 font-mono text-xs text-paper"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-8 flex items-center justify-end gap-3 border-t border-hairline pt-4">
                {selectedProject.github_url && (
                  <a
                    href={selectedProject.github_url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 rounded-full border border-hairline px-4 py-2 font-mono text-xs text-ink hover:bg-white"
                  >
                    <Github size={14} /> Repository
                  </a>
                )}
                {selectedProject.demo_url && (
                  <a
                    href={selectedProject.demo_url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 rounded-full bg-ink px-5 py-2 font-mono text-xs text-paper hover:bg-ink/90"
                  >
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
