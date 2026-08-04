import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { createClient } from "@supabase/supabase-js";
import { updateProjectInStore, deleteProjectFromStore } from "@/lib/project-store";
import { mapRowToProject } from "@/lib/supabase";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://iuixzmcowiepnalmjxlr.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = params.id;
  try {
    const body = await request.json();

    const baseUpdateData = {
      name: body.title,
      description: body.description,
      url: body.demo_url || body.github_url || "",
      icon: body.category || (Array.isArray(body.tags) ? body.tags[0] : "Fullstack"),
      thumbnail: body.image_url || "/images/face-card.png",
      updated_at: new Date().toISOString(),
    };

    const fullUpdateData = {
      ...baseUpdateData,
      title: body.title,
      category: body.category,
      image_url: body.image_url,
      demo_url: body.demo_url,
      github_url: body.github_url,
      tags: body.tags,
    };

    let updatedRow = null;

    try {
      const res1 = await supabase.from("Project").update(fullUpdateData).eq("id", id).select();
      if (!res1.error && res1.data && res1.data.length > 0) {
        updatedRow = res1.data[0];
      } else {
        const res2 = await supabase.from("Project").update(baseUpdateData).eq("id", id).select();
        if (!res2.error && res2.data && res2.data.length > 0) {
          updatedRow = res2.data[0];
        }
      }
    } catch (e) {
      console.warn("Supabase PUT info:", e);
    }

    const appUpdates = {
      title: body.title,
      description: body.description,
      category: body.category,
      image_url: body.image_url,
      demo_url: body.demo_url,
      github_url: body.github_url,
      tags: body.tags,
    };

    const updatedStore = updateProjectInStore(id, appUpdates);
    const resultProj = updatedRow ? mapRowToProject(updatedRow) : (updatedStore || { id, ...appUpdates });

    revalidatePath("/work");
    revalidatePath("/admin");

    return NextResponse.json({
      success: true,
      project: resultProj,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = params.id;
  try {
    try {
      await supabase.from("Project").delete().eq("id", id);
    } catch (e) {
      console.warn("Supabase DELETE info:", e);
    }

    deleteProjectFromStore(id);

    revalidatePath("/work");
    revalidatePath("/admin");

    return NextResponse.json({ success: true, message: `Permanently deleted project ${id}` });
  } catch (err: any) {
    deleteProjectFromStore(id);
    revalidatePath("/work");
    revalidatePath("/admin");
    return NextResponse.json({ success: true, message: `Removed project ${id}` });
  }
}
