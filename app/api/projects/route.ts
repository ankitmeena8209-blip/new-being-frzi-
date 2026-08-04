import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://iuixzmcowiepnalmjxlr.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// In-memory fallback cache for newly added projects if Supabase table requires auth/migration
let LOCAL_STORE: any[] = [
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

export async function GET() {
  try {
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data && data.length > 0) {
      return NextResponse.json(data);
    }
  } catch (e) {
    console.warn("Supabase GET fallback:", e);
  }
  return NextResponse.json(LOCAL_STORE);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const newProj = {
      id: Date.now().toString(),
      title: body.title || "Untitled Project",
      description: body.description || "",
      category: body.category || "Fullstack",
      image_url: body.image_url || "/images/face-card.png",
      demo_url: body.demo_url || null,
      github_url: body.github_url || null,
      tags: Array.isArray(body.tags) ? body.tags : ["Next.js", "React"],
      created_at: new Date().toISOString(),
    };

    try {
      const { data, error } = await supabase.from("projects").insert([newProj]).select();
      if (!error && data && data.length > 0) {
        LOCAL_STORE.unshift(data[0]);
        return NextResponse.json({ success: true, project: data[0] });
      }
    } catch (e) {
      console.warn("Supabase POST error:", e);
    }

    LOCAL_STORE.unshift(newProj);
    return NextResponse.json({ success: true, project: newProj });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
