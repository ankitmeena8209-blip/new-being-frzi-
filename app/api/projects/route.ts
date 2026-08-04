import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { createClient } from "@supabase/supabase-js";
import { getProjectsStore, addProjectToStore } from "@/lib/project-store";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://iuixzmcowiepnalmjxlr.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function GET() {
  try {
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data && data.length > 0) {
      // Sync DB records into local store
      data.forEach((item) => addProjectToStore(item));
    }
  } catch (e) {
    console.warn("Supabase GET info:", e);
  }
  
  return NextResponse.json(getProjectsStore());
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
        addProjectToStore(data[0]);
        revalidatePath("/work");
        revalidatePath("/admin");
        return NextResponse.json({ success: true, project: data[0] });
      }
    } catch (e) {
      console.warn("Supabase POST info:", e);
    }

    addProjectToStore(newProj);
    revalidatePath("/work");
    revalidatePath("/admin");

    return NextResponse.json({ success: true, project: newProj });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
