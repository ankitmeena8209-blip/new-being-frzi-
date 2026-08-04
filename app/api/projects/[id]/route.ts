import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { createClient } from "@supabase/supabase-js";
import { updateProjectInStore, deleteProjectFromStore } from "@/lib/project-store";

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
    const updateData = {
      title: body.title,
      description: body.description,
      category: body.category,
      image_url: body.image_url,
      demo_url: body.demo_url,
      github_url: body.github_url,
      tags: body.tags,
    };

    try {
      await supabase.from("projects").update(updateData).eq("id", id);
    } catch (e) {
      console.warn("Supabase PUT info:", e);
    }

    const updated = updateProjectInStore(id, updateData);

    revalidatePath("/work");
    revalidatePath("/admin");

    return NextResponse.json({
      success: true,
      project: updated || { id, ...updateData },
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
      await supabase.from("projects").delete().eq("id", id);
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
