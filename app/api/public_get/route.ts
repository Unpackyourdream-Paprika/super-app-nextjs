import { supabaseServer } from "@/lib/supabaseServer";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const content_name = searchParams.get("content_name");
    const content_episode = searchParams.get("content_episode");

    if (!content_name || !content_episode) {
      throw new Error("컨텐츠 정보가 필요합니다.");
    }

    const { data, error } = await supabaseServer
      .from("public_table")
      .select("*")
      .eq("content_name", content_name)
      .eq("content_episode", content_episode)
      .order("created_at", { ascending: false });

    if (error) {
      throw error;
    }

    return NextResponse.json(data, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
