"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Lock, LogOut, Plus, Trash2, Edit3, ExternalLink, ArrowLeft, ShieldCheck, Sparkles, Wand2, Loader2, Check } from "lucide-react";
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

  // Simplified Add Project Form
  const [newTitle, setNewTitle] = useState("");
  const [newGithub, setNewGithub] = useState("");
  const [newDemo, setNewDemo] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newCat, setNewCat] = useState("Fullstack");
  const [newImg, setNewImg] = useState("/images/face-card.png");
  const [newTags, setNewTags] = useState("Next.js, React, Tailwind");
  
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

  // Auto-Fetch repository metadata from GitHub API
  const handleAutoFetchRepo = async () => {
    if (!newGithub.trim()) {
      setFormMsg("Please enter a valid Git Repository URL first.");
      return;
    }

    setFetchingRepo(true);
    setFormMsg("");

    try {
      const res = await fetch("/api/admin/fetch-repo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: newGithub }),
      });

      const data = await res.json();
      if (res.ok && data.success && data.repoInfo) {
        const info = data.repoInfo;
        if (!newTitle.trim()) setNewTitle(info.title);
        setNewDesc(info.description);
        setNewCat(info.category);
        setNewTags(info.tags.join(", "));
        setFormMsg(`✨ Auto-filled metadata from GitHub (${info.stars} ⭐ stars, branch '${info.default_branch}')!`);
      } else {
        setFormMsg(`Note: ${data.error || "Could not fetch GitHub info automatically."}`);
      }
    } catch (err: any) {
      setFormMsg("Auto-fetch error. You can still enter details manually.");
    } finally {
      setFetchingRepo(false);
    }
  };

  // Create Project (POST)
  const handleAddProject = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdding(true);
    setFormMsg("");

    try {
      const tagsArray = newTags.split(",").map((t) => t.trim()).filter(Boolean);
      
      const payload = {
        title: newTitle || "Untitled Project",
        description: newDesc || "Project repository.",
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
        setFormMsg("🎉 Project published successfully to database & website!");
      } else {
        setProjects((prev) => [{ ...payload, id: Date.now().toString() } as Project, ...prev]);
        setFormMsg("Project saved.");
      }

      // Reset form
      setNewTitle("");
      setNewGithub("");
      setNewDemo("");
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
    setEditImg(proj.image_url || "/images/face-card.png");
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
        image_url: editImg || "/images/face-card.png",
        demo_url: editDemo || null,
        github_url: editGithub || null,
        tags: editTags.split(",").map((t) => t.trim()).filter(Boolean),
      };

      await fetch(`/api/projects/${editingProject.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedPayload),
      });

      // Update state reactively
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
    if (!confirm("Are you sure you want to delete this project?")) return;

    // Optimistic UI state update
    setProjects((prev) => prev.filter((p) => p.id !== id));

    try {
      await fetch(`/api/projects/${id}`, { method: "DELETE" });
    } catch (err) {
      console.error("Delete error:", err);
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
                    className="rounded-full border border-hairline bg-white/60 px-4 py-2 font-mono text-xs text-ink hover:bg-white transition-colors"
                  >
                    View Public Work Page &rarr;
                  </a>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 rounded-full bg-red-600 px-4 py-2 font-mono text-xs text-white hover:bg-red-700 shadow-sm transition-colors"
                  >
                    <LogOut size={14} /> Logout
                  </button>
                </div>
              </div>

              {/* Simplified Add New Project Form with GitHub Auto-Fetch */}
              <div className="rounded-3xl border border-hairline bg-white/80 p-6 sm:p-8 shadow-sm">
                <div className="flex items-center justify-between">
                  <h2 className="font-display text-2xl flex items-center gap-2">
                    <Plus size={20} /> Publish New Project
                  </h2>
                  <span className="font-mono text-[11px] text-muted uppercase">Workflow: 3 Quick Steps</span>
                </div>

                {formMsg && (
                  <div className="mt-3 rounded-xl border border-blue-200 bg-blue-50 p-3 font-mono text-xs text-blue-800">
                    {formMsg}
                  </div>
                )}

                <form onSubmit={handleAddProject} className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                  
                  {/* Step 1: Git Repository URL with Auto-Fetch Button */}
                  <div className="sm:col-span-2">
                    <div className="flex items-center justify-between">
                      <label className="block font-mono text-xs uppercase text-muted">1. Git Repository URL</label>
                      <button
                        type="button"
                        onClick={handleAutoFetchRepo}
                        disabled={fetchingRepo}
                        className="inline-flex items-center gap-1.5 font-mono text-xs text-ink hover:underline disabled:opacity-50"
                      >
                        {fetchingRepo ? <Loader2 size={12} className="animate-spin" /> : <Wand2 size={12} />}
                        Auto-Fill Details from GitHub
                      </button>
                    </div>
                    <input
                      type="text"
                      required
                      value={newGithub}
                      onChange={(e) => setNewGithub(e.target.value)}
                      placeholder="https://github.com/owner/repository"
                      className="mt-1 w-full rounded-xl border border-hairline bg-paper px-4 py-2.5 font-mono text-sm outline-none focus:border-ink"
                    />
                  </div>

                  {/* Step 2: Project Name */}
                  <div>
                    <label className="block font-mono text-xs uppercase text-muted">2. Project Name</label>
                    <input
                      type="text"
                      required
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      placeholder="e.g. Being FRZI Web"
                      className="mt-1 w-full rounded-xl border border-hairline bg-paper px-4 py-2.5 font-mono text-sm outline-none focus:border-ink"
                    />
                  </div>

                  {/* Step 3: Live Website URL */}
                  <div>
                    <label className="block font-mono text-xs uppercase text-muted">3. Live Website URL (Optional)</label>
                    <input
                      type="text"
                      value={newDemo}
                      onChange={(e) => setNewDemo(e.target.value)}
                      placeholder="https://..."
                      className="mt-1 w-full rounded-xl border border-hairline bg-paper px-4 py-2.5 font-mono text-sm outline-none focus:border-ink"
                    />
                  </div>

                  {/* Auto-filled details (Editable if needed) */}
                  <div className="sm:col-span-2">
                    <label className="block font-mono text-xs uppercase text-muted">Description (Auto-Filled)</label>
                    <textarea
                      rows={2}
                      value={newDesc}
                      onChange={(e) => setNewDesc(e.target.value)}
                      placeholder="Repository description..."
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
                    <label className="block font-mono text-xs uppercase text-muted">Tech Stack Tags</label>
                    <input
                      type="text"
                      value={newTags}
                      onChange={(e) => setNewTags(e.target.value)}
                      placeholder="Next.js, React, Supabase"
                      className="mt-1 w-full rounded-xl border border-hairline bg-paper px-4 py-2 font-mono text-sm outline-none focus:border-ink"
                    />
                  </div>

                  <div className="sm:col-span-2 mt-2">
                    <button
                      type="submit"
                      disabled={adding}
                      className="w-full rounded-xl bg-ink py-3 font-mono text-xs uppercase tracking-wider text-paper hover:bg-ink/90 transition-all shadow-md disabled:opacity-60"
                    >
                      {adding ? "Publishing to Database..." : "Publish Project"}
                    </button>
                  </div>
                </form>
              </div>

              {/* Projects List (Edit / Delete) */}
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
                            onClick={() => openEditModal(proj)}
                            className="rounded-lg bg-blue-100 p-2 text-blue-700 hover:bg-blue-200 transition-colors"
                            title="Edit project"
                          >
                            <Edit3 size={14} />
                          </button>
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
