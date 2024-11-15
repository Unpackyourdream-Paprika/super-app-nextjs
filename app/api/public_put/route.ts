import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "../../../lib/supabaseServer";

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      id,
      userid,
      password,
      comment_status,
      content_name,
      content_episode,
    } = body;

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    const { data, error } = await supabaseServer
      .from("public_table")
      .update({
        userid,
        password,
        comment_status,
        content_name,
        content_episode,
        updated_at: new Date(),
      })
      .eq("id", id);

    if (error) {
      throw error;
    }

    return NextResponse.json(
      { message: "Data updated successfully", data },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
