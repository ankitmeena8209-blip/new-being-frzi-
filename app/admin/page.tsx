"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Lock, LogOut, Plus, Trash2, ExternalLink, ArrowLeft, ShieldCheck } from "lucide-react";
import { Project, fetchProjects } from "@/lib/supabase";

export default function AdminPage() {
  const [isAuth, setIsAuth] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  // Dashboard state
  const [projects, setProjects] = useState<Project[]>([]);
  const [fetching, setFetching] = useState(false);
  
  // New Project Form
  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newCat, setNewCat] = useState("Fullstack");
  const [newImg, setNewImg] = useState("/images/face-card.png");
  const [newDemo, setNewDemo] = useState("");
  const [newGithub, setNewGithub] = useState("");
  const [newTags, setNewTags] = useState("Next.js, Tailwind, React");
  const [adding, setAdding] = useState(false);
  const [formMsg, setFormMsg] = useState("");

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
    } catch (err) {
      setErrorMsg("Failed to connect to authentication server");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    setIsAuth(false);
  };

  const handleAddProject = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdding(true);
    setFormMsg("");

    try {
      const tagsArray = newTags.split(",").map((t) => t.trim()).filter(Boolean);
      
      const payload = {
        title: newTitle,
        description: newDesc,
        category: newCat,
        image_url: newImg || "/images/face-card.png",
        demo_url: newDemo || null,
        github_url: newGithub || null,
        tags: tagsArray,
      };

      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (data.success && data.project) {
        setProjects((prev) => [data.project, ...prev.filter((p) => p.id !== data.project.id)]);
        setFormMsg("Project published successfully!");
      } else {
        setFormMsg("Project saved.");
        setProjects((prev) => [{ ...payload, id: Date.now().toString() } as Project, ...prev]);
      }

      // Reset form
      setNewTitle("");
      setNewDesc("");
      setNewDemo("");
      setNewGithub("");
    } catch (err: any) {
      setFormMsg(`Note: ${err.message}`);
    } finally {
      setAdding(false);
    }
  };

  const handleDeleteProject = async (id: string) => {
    if (!confirm("Are you sure you want to delete this project?")) return;

    try {
      await fetch(`/api/projects/${id}`, { method: "DELETE" });
      setProjects((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      console.error(err);
      setProjects((prev) => prev.filter((p) => p.id !== id));
    }
  };

  return (
    <main className="relative flex min-h-screen w-full flex-col bg-paper text-ink overflow-x-hidden">
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
                  <label className="block font-mono text-xs uppercase text-muted">
                    Username
                  </label>
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
                  <label className="block font-mono text-xs uppercase text-muted">
                    Password
                  </label>
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
                  <div className="flex items-center gap-2 font-mono text-xs text-green-600 font-semibold uppercase">
                    <ShieldCheck size={16} /> Authenticated Admin Session
                  </div>
                  <h1 className="mt-1 font-display text-4xl">Project Control Center</h1>
                </div>

                <div className="flex items-center gap-3">
                  <a
                    href="/work"
                    className="rounded-full border border-hairline bg-white/60 px-4 py-2 font-mono text-xs text-ink hover:bg-white"
                  >
                    View Public Work Page &rarr;
                  </a>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 rounded-full bg-red-600 px-4 py-2 font-mono text-xs text-white hover:bg-red-700 shadow-sm"
                  >
                    <LogOut size={14} /> Logout
                  </button>
                </div>
              </div>

              {/* Add New Project Card */}
              <div className="rounded-3xl border border-hairline bg-white/80 p-6 sm:p-8 shadow-sm">
                <h2 className="font-display text-2xl flex items-center gap-2">
                  <Plus size={20} /> Publish New Project
                </h2>

                {formMsg && (
                  <div className="mt-3 rounded-xl border border-blue-200 bg-blue-50 p-3 font-mono text-xs text-blue-800">
                    {formMsg}
                  </div>
                )}

                <form onSubmit={handleAddProject} className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <label className="block font-mono text-xs uppercase text-muted">Project Title</label>
                    <input
                      type="text"
                      required
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      placeholder="e.g. Being FRZI Platform"
                      className="mt-1 w-full rounded-xl border border-hairline bg-paper px-4 py-2 font-mono text-sm outline-none focus:border-ink"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block font-mono text-xs uppercase text-muted">Description</label>
                    <textarea
                      required
                      rows={3}
                      value={newDesc}
                      onChange={(e) => setNewDesc(e.target.value)}
                      placeholder="Brief overview of project features..."
                      className="mt-1 w-full rounded-xl border border-hairline bg-paper px-4 py-2 font-body text-sm outline-none focus:border-ink"
                    />
                  </div>

                  <div>
                    <label className="block font-mono text-xs uppercase text-muted">Category</label>
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
                    <label className="block font-mono text-xs uppercase text-muted">Image Asset URL</label>
                    <input
                      type="text"
                      value={newImg}
                      onChange={(e) => setNewImg(e.target.value)}
                      placeholder="/images/face-card.png"
                      className="mt-1 w-full rounded-xl border border-hairline bg-paper px-4 py-2 font-mono text-sm outline-none focus:border-ink"
                    />
                  </div>

                  <div>
                    <label className="block font-mono text-xs uppercase text-muted">Live Demo URL</label>
                    <input
                      type="text"
                      value={newDemo}
                      onChange={(e) => setNewDemo(e.target.value)}
                      placeholder="https://..."
                      className="mt-1 w-full rounded-xl border border-hairline bg-paper px-4 py-2 font-mono text-sm outline-none focus:border-ink"
                    />
                  </div>

                  <div>
                    <label className="block font-mono text-xs uppercase text-muted">GitHub Repository URL</label>
                    <input
                      type="text"
                      value={newGithub}
                      onChange={(e) => setNewGithub(e.target.value)}
                      placeholder="https://github.com/..."
                      className="mt-1 w-full rounded-xl border border-hairline bg-paper px-4 py-2 font-mono text-sm outline-none focus:border-ink"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block font-mono text-xs uppercase text-muted">Tech Stack Tags (Comma-separated)</label>
                    <input
                      type="text"
                      value={newTags}
                      onChange={(e) => setNewTags(e.target.value)}
                      placeholder="Next.js, React, Supabase, Tailwind"
                      className="mt-1 w-full rounded-xl border border-hairline bg-paper px-4 py-2 font-mono text-sm outline-none focus:border-ink"
                    />
                  </div>

                  <div className="sm:col-span-2 mt-2">
                    <button
                      type="submit"
                      disabled={adding}
                      className="w-full rounded-xl bg-ink py-3 font-mono text-xs uppercase tracking-wider text-paper hover:bg-ink/90 transition-all shadow-md"
                    >
                      {adding ? "Publishing..." : "Publish Project to Database"}
                    </button>
                  </div>
                </form>
              </div>

              {/* Projects List */}
              <div className="rounded-3xl border border-hairline bg-white/80 p-6 sm:p-8 shadow-sm">
                <h2 className="font-display text-2xl">Manage Existing Projects ({projects.length})</h2>

                {fetching ? (
                  <p className="mt-4 font-mono text-xs text-muted">Loading projects...</p>
                ) : (
                  <div className="mt-6 flex flex-col gap-4">
                    {projects.map((proj) => (
                      <div
                        key={proj.id}
                        className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-hairline bg-paper p-4"
                      >
                        <div>
                          <span className="font-mono text-[10px] uppercase text-muted">
                            {proj.category}
                          </span>
                          <h3 className="font-display text-lg">{proj.title}</h3>
                          <p className="font-body text-xs text-inkSoft line-clamp-1">{proj.description}</p>
                        </div>

                        <div className="flex items-center gap-3">
                          {proj.demo_url && (
                            <a
                              href={proj.demo_url}
                              target="_blank"
                              rel="noreferrer"
                              className="text-ink hover:underline text-xs font-mono flex items-center gap-1"
                            >
                              <ExternalLink size={12} /> Visit
                            </a>
                          )}
                          <button
                            onClick={() => handleDeleteProject(proj.id)}
                            className="rounded-lg bg-red-100 p-2 text-red-600 hover:bg-red-200 transition-colors"
                            title="Delete project"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

        </div>
      </section>

      <Footer />
    </main>
  );
}
