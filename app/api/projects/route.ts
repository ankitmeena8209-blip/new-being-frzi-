import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { createClient } from "@supabase/supabase-js";
import { getProjectsStore, addProjectToStore } from "@/lib/project-store";
import { mapRowToProject } from "@/lib/supabase";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://iuixzmcowiepnalmjxlr.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function GET() {
  try {
    const { data, error } = await supabase
      .from("Project")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) {
      const mapped = data.map(mapRowToProject);
      mapped.forEach((item) => addProjectToStore(item));
      return NextResponse.json(mapped);
    }
  } catch (e) {
    console.warn("Supabase GET info:", e);
  }
  
  return NextResponse.json(getProjectsStore());
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const id = Date.now().toString();

    const basePayload = {
      id,
      name: body.title || "Untitled Project",
      description: body.description || "",
      url: body.demo_url || body.github_url || "",
      icon: body.category || (Array.isArray(body.tags) ? body.tags[0] : "Fullstack"),
      thumbnail: body.image_url || "/images/face-card.png",
      display_order: 1,
      is_featured: true,
      is_visible: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const fullPayload = {
      ...basePayload,
      title: body.title || "Untitled Project",
      category: body.category || "Fullstack",
      image_url: body.image_url || "/images/face-card.png",
      demo_url: body.demo_url || null,
      github_url: body.github_url || null,
      tags: Array.isArray(body.tags) ? body.tags : ["Next.js", "React"],
    };

    let insertedRow = null;

    try {
      const res1 = await supabase.from("Project").insert([fullPayload]).select();
      if (!res1.error && res1.data && res1.data.length > 0) {
        insertedRow = res1.data[0];
      } else {
        const res2 = await supabase.from("Project").insert([basePayload]).select();
        if (!res2.error && res2.data && res2.data.length > 0) {
          insertedRow = res2.data[0];
        }
      }
    } catch (e) {
      console.warn("Supabase POST info:", e);
    }

    const newProj = insertedRow
      ? mapRowToProject(insertedRow)
      : {
          id,
          title: body.title || "Untitled Project",
          description: body.description || "",
          category: body.category || "Fullstack",
          image_url: body.image_url || "/images/face-card.png",
          demo_url: body.demo_url || null,
          github_url: body.github_url || null,
          tags: Array.isArray(body.tags) ? body.tags : ["Next.js", "React"],
          created_at: new Date().toISOString(),
        };

    addProjectToStore(newProj);
    revalidatePath("/work");
    revalidatePath("/admin");

    return NextResponse.json({ success: true, project: newProj });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
