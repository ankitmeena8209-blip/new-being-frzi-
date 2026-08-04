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
    image_url: "/images/hero-ankit.png",
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
    image_url: "/images/face-card.png",
    demo_url: "https://github.com/ankitmeena8209-blip",
    github_url: "https://github.com/ankitmeena8209-blip",
    tags: ["React", "Python", "OpenAI", "FastAPI"],
    featured: true,
  },
  {
    id: "3",
    title: "Mobile Commerce App",
    description: "Cross-platform mobile application built with React Native for instant flash sales.",
    category: "Mobile",
    image_url: "/images/face-card.png",
    demo_url: "https://github.com/ankitmeena8209-blip",
    github_url: "https://github.com/ankitmeena8209-blip",
    tags: ["React Native", "Expo", "Stripe", "PostgreSQL"],
    featured: false,
  },
];

export async function fetchProjects(): Promise<Project[]> {
  try {
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .order("created_at", { ascending: false });

    if (error || !data || data.length === 0) {
      console.warn("Supabase query returned empty/error, using fallback projects:", error?.message);
      return FALLBACK_PROJECTS;
    }

    return data as Project[];
  } catch (err) {
    console.error("Failed to connect to Supabase projects table:", err);
    return FALLBACK_PROJECTS;
  }
}
