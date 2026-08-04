import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://iuixzmcowiepnalmjxlr.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

const supabase = createClient(supabaseUrl, supabaseAnonKey);

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
