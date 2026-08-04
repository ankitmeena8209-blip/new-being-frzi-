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
  demo_url?: string;
  github_url?: string;
  tags: string[];
  featured?: boolean;
  created_at?: string;
}

export const FALLBACK_PROJECTS: Project[] = [
  {
    id: "1",
    title: "Being FRZI Portfolio",
    description: "Ultra-sleek portfolio & web platform with Framer Motion, dynamic typography, and Supabase integration.",
    category: "Fullstack",
    image_url: "/images/face-card.png",
    demo_url: "https://being-frzi.vercel.app",
    github_url: "https://github.com/ankitmeena8209-blip/new-being-frzi-",
    tags: ["Next.js 14", "Tailwind CSS", "Framer Motion", "Supabase"],
    featured: true,
  },
  {
    id: "2",
    title: "AI Creative Studio",
    description: "High-performance generative asset generator and smart prompt engineering workflow tool.",
    category: "AI/ML",
    image_url: "/images/hero-ankit.png",
    demo_url: "https://github.com/ankitmeena8209-blip",
    github_url: "https://github.com/ankitmeena8209-blip",
    tags: ["React", "Python", "OpenAI", "FastAPI"],
    featured: true,
  },
];

export async function fetchProjects(): Promise<Project[]> {
  try {
    const res = await fetch("/api/projects", { cache: "no-store" });
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        return data;
      }
    }
  } catch (err) {
    console.error("Failed to fetch projects API:", err);
  }

  return FALLBACK_PROJECTS;
}
