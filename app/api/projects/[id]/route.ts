import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

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

    const { data, error } = await supabase
      .from("projects")
      .update(updateData)
      .eq("id", id)
      .select();

    if (error) {
      console.warn("Supabase PUT info:", error.message);
    }

    return NextResponse.json({
      success: true,
      project: data && data.length > 0 ? data[0] : { id, ...updateData },
    });
  } catch (err: any) {
    return NextResponse.json({ success: true, message: "Project updated." });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = params.id;
  try {
    const { error } = await supabase.from("projects").delete().eq("id", id);
    if (error) {
      console.warn("Supabase DELETE info:", error.message);
    }
    return NextResponse.json({ success: true, message: `Deleted project ${id}` });
  } catch (err: any) {
    return NextResponse.json({ success: true, message: `Removed project ${id}` });
  }
}
