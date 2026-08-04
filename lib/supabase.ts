import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://iuixzmcowiepnalmjxlr.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface Project {
  id: string;
  title: string;
  description: string;
  category: string;
  image_url: string;
  demo_url?: string | null;
  github_url?: string | null;
  tags: string[];
  featured?: boolean;
  created_at?: string;
}

export const FALLBACK_PROJECTS: Project[] = [];

export function mapRowToProject(row: any): Project {
  if (!row) return row;
  const url = row.url || "";
  const isGithub = typeof url === "string" && url.includes("github.com");
  return {
    id: String(row.id),
    title: row.title || row.name || "Untitled Project",
    description: row.description || "",
    category: row.category || row.icon || "Fullstack",
    image_url: row.image_url || row.thumbnail || "/images/face-card.png",
    demo_url: row.demo_url !== undefined ? row.demo_url : (!isGithub && url ? url : null),
    github_url: row.github_url !== undefined ? row.github_url : (isGithub ? url : null),
    tags: Array.isArray(row.tags)
      ? row.tags
      : row.icon
      ? [row.icon]
      : ["Next.js", "React"],
    featured: row.featured ?? row.is_featured ?? true,
    created_at: row.created_at || new Date().toISOString(),
  };
}

export async function fetchProjects(): Promise<Project[]> {
  try {
    const res = await fetch("/api/projects", { cache: "no-store" });
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data)) {
        return data.map(mapRowToProject);
      }
    }
  } catch (err) {
    console.error("Failed to fetch projects API:", err);
  }

  return FALLBACK_PROJECTS;
}
