"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import {
  Lock,
  LogOut,
  Plus,
  Trash2,
  Edit3,
  ExternalLink,
  ArrowLeft,
  ShieldCheck,
  Wand2,
  Loader2,
  Sparkles,
  Link as LinkIcon,
  Image as ImageIcon,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { Project, fetchProjects } from "@/lib/supabase";

/* ------------------------------------------------------------------ */
/* Generated project mark (matches /work)                              */
/* ------------------------------------------------------------------ */
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

const hasRealImage = (url?: string | null) =>
  !!url && url.trim() !== "" && !url.includes("face-card");

const TINTS: readonly { from: string; to: string }[] = [
  { from: "#FDE6D3", to: "#FCF2E9" }, // peach
  { from: "#D9E2FF", to: "#EBF0FF" }, // periwinkle
  { from: "#E9D8FB", to: "#F5EEFD" }, // lilac
];

function ProjectMark({ title, category }: { title: string; category: string }) {
  const h = hash(`${title}|${category}`);
  const c = (category || "").toLowerCase();
  const rot = (h % 24) - 12;
  const j = (n: number) => ((h >> n) % 9) - 4;

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
      <span className="absolute inset-0 grid place-items-center font-display text-2xl text-ink/80 sm:text-3xl">
        {initials(title)}
      </span>
    </span>
  );
}

export default function AdminPage() {
  const [isAuth, setIsAuth] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  // Dashboard state
  const [projects, setProjects] = useState<Project[]>([]);
  const [fetching, setFetching] = useState(false);

  // Streamlined Add Project Form (Name, Link, Logo)
  const [newTitle, setNewTitle] = useState("");
  const [newLink, setNewLink] = useState("");
  const [newImg, setNewImg] = useState(""); // empty string: no face-card fallback!
  const [newDesc, setNewDesc] = useState("");
  const [newCat, setNewCat] = useState("Fullstack");
  const [newTags, setNewTags] = useState("Next.js, React");
  const [showAdvanced, setShowAdvanced] = useState(false);

  const [fetchingRepo, setFetchingRepo] = useState(false);
  const [adding, setAdding] = useState(false);
  const [formMsg, setFormMsg] = useState("");

  // Edit Modal State
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDesc, setEditDesc] = useState("");
  const [editCat, setEditCat] = useState("Fullstack");
  const [editImg, setEditImg] = useState("");
  const [editDemo, setEditDemo] = useState("");
  const [editGithub, setEditGithub] = useState("");
  const [editTags, setEditTags] = useState("");
  const [saving, setSaving] = useState(false);

  const loadProjects = useCallback(async () => {
    setFetching(true);
    const data = await fetchProjects();
    setProjects(data);
    setFetching(false);
  }, []);

  useEffect(() => {
    if (document.cookie.includes("admin_session")) {
      setIsAuth(true);
      loadProjects();
    }
  }, [loadProjects]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setIsAuth(true);
        loadProjects();
      } else {
        setErrorMsg(data.message || "Invalid credentials");
      }
    } catch {
      setErrorMsg("Failed to connect to authentication server");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    setIsAuth(false);
  };

  // Optional: Auto-Fetch repository metadata if link is a GitHub URL
  const handleAutoFetchRepo = async () => {
    if (!newLink.trim()) return;
    setFetchingRepo(true);
    setFormMsg("");

    try {
      const res = await fetch("/api/admin/fetch-repo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: newLink.trim() }),
      });

      const data = await res.json();
      if (res.ok && data.success && data.repoInfo) {
        const info = data.repoInfo;
        if (!newTitle.trim()) setNewTitle(info.title);
        setNewDesc(info.description || "");
        setNewCat(info.category || "Fullstack");
        setNewTags(info.tags.join(", "));
        setFormMsg(`✨ Auto-fetched details from GitHub (${info.stars} ⭐)`);
      } else {
        setFormMsg(`Note: ${data.error || "Could not fetch GitHub info automatically."}`);
      }
    } catch {
      setFormMsg("Note: Enter details manually.");
    } finally {
      setFetchingRepo(false);
    }
  };

  // Create Project (POST)
  const handleAddProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    setAdding(true);
    setFormMsg("");

    try {
      const isGithub = newLink.includes("github.com");
      const tagsArray = newTags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);

      const payload = {
        title: newTitle.trim(),
        description: newDesc.trim() || `${newTitle} project and experiment.`,
        category: newCat || "Fullstack",
        image_url: newImg.trim() || "", // root-cause fix: empty string!
        demo_url: isGithub ? null : newLink.trim() || null,
        github_url: isGithub ? newLink.trim() : null,
        tags: tagsArray.length > 0 ? tagsArray : ["Web", "React"],
      };

      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (data.success && data.project) {
        setProjects((prev) => [data.project, ...prev.filter((p) => p.id !== data.project.id)]);
        setFormMsg("🎉 Project published successfully!");
      } else {
        const fallbackObj = { ...payload, id: Date.now().toString() };
        setProjects((prev) => [fallbackObj, ...prev]);
        setFormMsg("Project saved locally.");
      }

      // Reset easy form
      setNewTitle("");
      setNewLink("");
      setNewImg("");
      setNewDesc("");
    } catch (err: any) {
      setFormMsg(`Save note: ${err.message}`);
    } finally {
      setAdding(false);
    }
  };

  // Open Edit Modal
  const openEditModal = (proj: Project) => {
    setEditingProject(proj);
    setEditTitle(proj.title);
    setEditDesc(proj.description || "");
    setEditCat(proj.category || "Fullstack");
    setEditImg(proj.image_url || ""); // root-cause fix: empty string!
    setEditDemo(proj.demo_url || "");
    setEditGithub(proj.github_url || "");
    setEditTags(proj.tags ? proj.tags.join(", ") : "");
  };

  // Save Edit (PUT)
  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProject) return;
    setSaving(true);

    try {
      const updatedPayload = {
        title: editTitle,
        description: editDesc,
        category: editCat,
        image_url: editImg || "", // root-cause fix: empty string!
        demo_url: editDemo || null,
        github_url: editGithub || null,
        tags: editTags.split(",").map((t) => t.trim()).filter(Boolean),
      };

      await fetch(`/api/projects/${editingProject.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedPayload),
      });

      setProjects((prev) =>
        prev.map((p) =>
          p.id === editingProject.id ? { ...p, ...updatedPayload } : p
        )
      );

      setEditingProject(null);
    } catch (err) {
      console.error("Save edit error:", err);
    } finally {
      setSaving(false);
    }
  };

  // Delete Project (DELETE)
  const handleDeleteProject = async (id: string) => {
    if (!confirm("Are you sure you want to permanently delete this project?")) return;
    setProjects((prev) => prev.filter((p) => p.id !== id));

    try {
      await fetch(`/api/projects/${id}`, { method: "DELETE" });
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  return (
    <main className="relative flex min-h-screen w-full flex-col overflow-x-hidden bg-paper text-ink">
      <Header />

      <section className="relative z-10 px-4 pt-32 pb-24 sm:px-8 sm:pt-36">
        <div className="mx-auto max-w-4xl">
          {!isAuth ? (
            /* Login Form */
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="mx-auto max-w-md rounded-3xl border border-hairline bg-white/80 p-8 shadow-xl backdrop-blur-md"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-ink text-paper shadow-md">
                <Lock size={20} />
              </div>

              <h1 className="mt-4 font-display text-3xl">Admin Portal</h1>
              <p className="mt-1 font-body text-xs text-muted">
                Authorized access only. Enter admin credentials to manage projects.
              </p>

              {errorMsg && (
                <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 font-mono text-xs text-red-600">
                  {errorMsg}
                </div>
              )}

              <form onSubmit={handleLogin} className="mt-6 flex flex-col gap-4">
                <div>
                  <label className="block font-mono text-xs uppercase text-muted">Username</label>
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter admin username"
                    className="mt-1 w-full rounded-xl border border-hairline bg-paper px-4 py-2.5 font-mono text-sm text-ink outline-none focus:border-ink"
                  />
                </div>

                <div>
                  <label className="block font-mono text-xs uppercase text-muted">Password</label>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter admin password"
                    className="mt-1 w-full rounded-xl border border-hairline bg-paper px-4 py-2.5 font-mono text-sm text-ink outline-none focus:border-ink"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="mt-2 w-full rounded-xl bg-ink py-3 font-mono text-xs uppercase tracking-wider text-paper hover:bg-ink/90 transition-all shadow-md"
                >
                  {loading ? "Authenticating..." : "Login to Control Center"}
                </button>
              </form>

              <div className="mt-6 border-t border-hairline pt-4 text-center">
                <a
                  href="/work"
                  className="inline-flex items-center gap-1 font-mono text-xs text-muted hover:text-ink"
                >
                  <ArrowLeft size={12} /> Back to Work Showcase
                </a>
              </div>
            </motion.div>
          ) : (
            /* Admin Dashboard */
            <div className="flex flex-col gap-8">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-hairline pb-6">
                <div>
                  <div className="flex items-center gap-2 font-mono text-xs font-semibold uppercase text-emerald-600">
                    <ShieldCheck size={16} /> Authenticated Admin Session
                  </div>
                  <h1 className="mt-1 font-display text-4xl">Project Control Center</h1>
                </div>

                <div className="flex items-center gap-3">
                  <a
                    href="/work"
                    className="rounded-full border border-hairline bg-white/60 px-4 py-2 font-mono text-xs text-ink transition-colors hover:bg-white"
                  >
                    View Public Work Page &rarr;
                  </a>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 rounded-full bg-red-600 px-4 py-2 font-mono text-xs text-white shadow-sm transition-colors hover:bg-red-700"
                  >
                    <LogOut size={14} /> Logout
                  </button>
                </div>
              </div>

              {/* Streamlined Add New Project Form (Name + Link + Logo) */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="rounded-3xl border border-hairline bg-white/80 p-6 sm:p-8 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <h2 className="flex items-center gap-2 font-display text-2xl">
                    <Plus size={20} /> Add New Project
                  </h2>
                  <span className="font-mono text-[11px] uppercase tracking-wider text-muted">
                    Quick Publish
                  </span>
                </div>

                {formMsg && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="mt-3 rounded-xl border border-blue-200 bg-blue-50 p-3 font-mono text-xs text-blue-800"
                  >
                    {formMsg}
                  </motion.div>
                )}

                <form onSubmit={handleAddProject} className="mt-6 flex flex-col gap-5">
                  {/* Primary Fields Grid */}
                  <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                    {/* 1. Project Name */}
                    <div className="md:col-span-2">
                      <label className="block font-mono text-xs uppercase text-muted">
                        Project Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={newTitle}
                        onChange={(e) => setNewTitle(e.target.value)}
                        placeholder="e.g. Being FRZI Web"
                        className="mt-1 w-full rounded-2xl border border-hairline bg-paper px-4 py-3 font-display text-lg outline-none transition-colors focus:border-ink"
                      />
                    </div>

                    {/* 2. Project Link */}
                    <div>
                      <div className="flex items-center justify-between">
                        <label className="block font-mono text-xs uppercase text-muted">
                          Project Link / URL
                        </label>
                        {newLink.includes("github.com") && (
                          <button
                            type="button"
                            onClick={handleAutoFetchRepo}
                            disabled={fetchingRepo}
                            className="inline-flex items-center gap-1 font-mono text-[11px] text-ink hover:underline disabled:opacity-50"
                          >
                            {fetchingRepo ? (
                              <Loader2 size={11} className="animate-spin" />
                            ) : (
                              <Wand2 size={11} />
                            )}
                            Auto-Fill from GitHub
                          </button>
                        )}
                      </div>
                      <div className="relative mt-1">
                        <LinkIcon
                          size={15}
                          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted"
                        />
                        <input
                          type="text"
                          value={newLink}
                          onChange={(e) => setNewLink(e.target.value)}
                          placeholder="https://github.com/... or https://yoursite.com"
                          className="w-full rounded-2xl border border-hairline bg-paper py-3 pl-10 pr-4 font-mono text-sm outline-none transition-colors focus:border-ink"
                        />
                      </div>
                    </div>

                    {/* 3. Logo / Image Section */}
                    <div>
                      <label className="block font-mono text-xs uppercase text-muted">
                        Logo / Image URL
                      </label>
                      <div className="relative mt-1">
                        <ImageIcon
                          size={15}
                          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted"
                        />
                        <input
                          type="text"
                          value={newImg}
                          onChange={(e) => setNewImg(e.target.value)}
                          placeholder="https://... (or leave empty)"
                          className="w-full rounded-2xl border border-hairline bg-paper py-3 pl-10 pr-4 font-mono text-sm outline-none transition-colors focus:border-ink"
                        />
                      </div>
                      <p className="mt-1 font-mono text-[11px] text-muted">
                        Leave empty to auto-generate a mark
                      </p>
                    </div>
                  </div>

                  {/* Real-time Logo / Mark Preview */}
                  <div className="flex items-center gap-4 rounded-2xl border border-hairline bg-paper/60 p-4">
                    <div className="relative flex h-16 w-20 shrink-0 overflow-hidden rounded-xl border border-hairline bg-gradient-to-br from-[#FDE6D3] to-[#FCF2E9]">
                      {hasRealImage(newImg) ? (
                        <Image src={newImg} alt="Preview" fill className="object-cover" />
                      ) : (
                        <ProjectMark title={newTitle || "New"} category={newCat} />
                      )}
                    </div>
                    <div>
                      <span className="font-mono text-[10px] uppercase text-muted">
                        Logo Preview
                      </span>
                      <p className="font-display text-sm">
                        {newTitle ? newTitle : "Project mark auto-generates from title"}
                      </p>
                      <span className="font-mono text-[10px] text-inkSoft">
                        {hasRealImage(newImg)
                          ? "Custom image configured"
                          : "Auto-generated motif & initials (pastel gradient)"}
                      </span>
                    </div>
                  </div>

                  {/* Optional Details Toggle */}
                  <div className="border-t border-hairline pt-3">
                    <button
                      type="button"
                      onClick={() => setShowAdvanced(!showAdvanced)}
                      className="inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-wider text-muted hover:text-ink"
                    >
                      {showAdvanced ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                      {showAdvanced ? "Hide Extra Details" : "Add Description, Category & Tags (Optional)"}
                    </button>

                    <AnimatePresence>
                      {showAdvanced && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2"
                        >
                          <div className="sm:col-span-2">
                            <label className="block font-mono text-xs uppercase text-muted">
                              Description
                            </label>
                            <textarea
                              rows={2}
                              value={newDesc}
                              onChange={(e) => setNewDesc(e.target.value)}
                              placeholder="Brief summary of what this project does..."
                              className="mt-1 w-full rounded-xl border border-hairline bg-paper px-4 py-2 font-body text-sm outline-none focus:border-ink"
                            />
                          </div>

                          <div>
                            <label className="block font-mono text-xs uppercase text-muted">
                              Category
                            </label>
                            <select
                              value={newCat}
                              onChange={(e) => setNewCat(e.target.value)}
                              className="mt-1 w-full rounded-xl border border-hairline bg-paper px-4 py-2 font-mono text-sm outline-none focus:border-ink"
                            >
                              <option value="Fullstack">Fullstack</option>
                              <option value="Mobile">Mobile</option>
                              <option value="AI/ML">AI/ML</option>
                            </select>
                          </div>

                          <div>
                            <label className="block font-mono text-xs uppercase text-muted">
                              Tags
                            </label>
                            <input
                              type="text"
                              value={newTags}
                              onChange={(e) => setNewTags(e.target.value)}
                              placeholder="React, Next.js, Supabase"
                              className="mt-1 w-full rounded-xl border border-hairline bg-paper px-4 py-2 font-mono text-sm outline-none focus:border-ink"
                            />
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    type="submit"
                    disabled={adding}
                    className="flex w-full items-center justify-center gap-2 rounded-2xl bg-ink py-3.5 font-mono text-xs uppercase tracking-wider text-paper shadow-md transition-all hover:bg-ink/90 disabled:opacity-60"
                  >
                    {adding ? (
                      <>
                        <Loader2 size={14} className="animate-spin" /> Publishing...
                      </>
                    ) : (
                      <>
                        <Sparkles size={14} /> Publish Project
                      </>
                    )}
                  </motion.button>
                </form>
              </motion.div>

              {/* Projects List with Logos & Animations */}
              <div className="rounded-3xl border border-hairline bg-white/80 p-6 sm:p-8 shadow-sm">
                <div className="flex items-center justify-between">
                  <h2 className="font-display text-2xl">
                    Manage Existing Projects ({projects.length})
                  </h2>
                  <span className="font-mono text-xs text-muted">Real-time sync</span>
                </div>

                {fetching ? (
                  <div className="flex min-h-[160px] items-center justify-center font-mono text-xs text-muted">
                    <Loader2 size={16} className="mr-2 animate-spin" /> Loading projects...
                  </div>
                ) : (
                  <motion.div layout className="mt-6 flex flex-col gap-3">
                    <AnimatePresence>
                      {projects.map((proj) => {
                        const tint = TINTS[hash(proj.title) % TINTS.length]!;
                        return (
                          <motion.div
                            key={proj.id}
                            layout
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.96 }}
                            whileHover={{ y: -2, transition: { duration: 0.2 } }}
                            className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-hairline bg-paper p-4 transition-shadow hover:shadow-md"
                          >
                            <div className="flex items-center gap-4">
                              {/* Logo / Generated Mark */}
                              <div
                                className="relative flex h-14 w-18 shrink-0 overflow-hidden rounded-xl border border-hairline"
                                style={{
                                  background: `linear-gradient(160deg, ${tint.from}, ${tint.to})`,
                                }}
                              >
                                {hasRealImage(proj.image_url) ? (
                                  <Image
                                    src={proj.image_url}
                                    alt={proj.title}
                                    fill
                                    className="object-cover"
                                  />
                                ) : (
                                  <ProjectMark title={proj.title} category={proj.category} />
                                )}
                              </div>

                              <div>
                                <span className="font-mono text-[10px] uppercase tracking-wider text-muted">
                                  {proj.category}
                                </span>
                                <h3 className="font-display text-lg leading-tight">{proj.title}</h3>
                                <p className="font-body text-xs text-inkSoft line-clamp-1">
                                  {proj.description || "No description provided."}
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center gap-2">
                              {(proj.demo_url || proj.github_url) && (
                                <a
                                  href={(proj.demo_url || proj.github_url) as string}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="flex items-center gap-1 rounded-lg border border-hairline bg-white/60 px-3 py-1.5 font-mono text-xs text-ink transition-colors hover:bg-white"
                                >
                                  <ExternalLink size={12} /> Link
                                </a>
                              )}
                              <button
                                onClick={() => openEditModal(proj)}
                                className="rounded-lg bg-blue-50 p-2 text-blue-700 transition-colors hover:bg-blue-100"
                                title="Edit project"
                              >
                                <Edit3 size={15} />
                              </button>
                              <button
                                onClick={() => handleDeleteProject(proj.id)}
                                className="rounded-lg bg-red-50 p-2 text-red-600 transition-colors hover:bg-red-100"
                                title="Delete project"
                              >
                                <Trash2 size={15} />
                              </button>
                            </div>
                          </motion.div>
                        );
                      })}
                    </AnimatePresence>
                  </motion.div>
                )}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Edit Modal */}
      <AnimatePresence>
        {editingProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setEditingProject(null)}
            className="fixed inset-0 z-50 flex items-center justify-center bg-ink/60 p-4 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.95, y: 10 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 10 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-3xl border border-hairline bg-paper p-6 sm:p-8 shadow-2xl"
            >
              <button
                onClick={() => setEditingProject(null)}
                className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-full bg-ink text-paper font-mono text-xs"
              >
                &times;
              </button>

              <h2 className="font-display text-2xl">Edit Project</h2>
              <form onSubmit={handleSaveEdit} className="mt-4 flex flex-col gap-4">
                <div>
                  <label className="block font-mono text-xs uppercase text-muted">Title</label>
                  <input
                    type="text"
                    required
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-hairline bg-white px-4 py-2 font-mono text-sm outline-none"
                  />
                </div>

                <div>
                  <label className="block font-mono text-xs uppercase text-muted">
                    Logo / Image URL
                  </label>
                  <input
                    type="text"
                    value={editImg}
                    onChange={(e) => setEditImg(e.target.value)}
                    placeholder="https://... (or leave empty)"
                    className="mt-1 w-full rounded-xl border border-hairline bg-white px-4 py-2 font-mono text-sm outline-none"
                  />
                  <p className="mt-1 font-mono text-[11px] text-muted">
                    Leave empty to auto-generate a mark
                  </p>
                </div>

                <div>
                  <label className="block font-mono text-xs uppercase text-muted">Description</label>
                  <textarea
                    rows={3}
                    value={editDesc}
                    onChange={(e) => setEditDesc(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-hairline bg-white px-4 py-2 font-body text-sm outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block font-mono text-xs uppercase text-muted">Category</label>
                    <select
                      value={editCat}
                      onChange={(e) => setEditCat(e.target.value)}
                      className="mt-1 w-full rounded-xl border border-hairline bg-white px-4 py-2 font-mono text-sm outline-none"
                    >
                      <option value="Fullstack">Fullstack</option>
                      <option value="Mobile">Mobile</option>
                      <option value="AI/ML">AI/ML</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-mono text-xs uppercase text-muted">Tags</label>
                    <input
                      type="text"
                      value={editTags}
                      onChange={(e) => setEditTags(e.target.value)}
                      className="mt-1 w-full rounded-xl border border-hairline bg-white px-4 py-2 font-mono text-sm outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block font-mono text-xs uppercase text-muted">Live Demo URL</label>
                    <input
                      type="text"
                      value={editDemo}
                      onChange={(e) => setEditDemo(e.target.value)}
                      className="mt-1 w-full rounded-xl border border-hairline bg-white px-4 py-2 font-mono text-sm outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-mono text-xs uppercase text-muted">GitHub URL</label>
                    <input
                      type="text"
                      value={editGithub}
                      onChange={(e) => setEditGithub(e.target.value)}
                      className="mt-1 w-full rounded-xl border border-hairline bg-white px-4 py-2 font-mono text-sm outline-none"
                    />
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-end gap-3 border-t border-hairline pt-4">
                  <button
                    type="button"
                    onClick={() => setEditingProject(null)}
                    className="rounded-full border border-hairline px-4 py-2 font-mono text-xs text-muted"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="rounded-full bg-ink px-6 py-2 font-mono text-xs text-paper"
                  >
                    {saving ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </main>
  );
}
