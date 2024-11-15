import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "../../../lib/supabaseServer";

export async function PUT(req: NextRequest) {
  try {
    const { id, password, comment_content } = await req.json();

    // 비밀번호 확인
    const { data: comment } = await supabaseServer
      .from("public_table")
      .select("*")
      .eq("id", id)
      .eq("password", password)
      .single();

    if (!comment) {
      return NextResponse.json(
        { error: "비밀번호가 일치하지 않습니다." },
        { status: 401 }
      );
    }

    // 댓글 수정
    const { error } = await supabaseServer
      .from("public_table")
      .update({
        comment_content,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id);

    if (error) throw error;

    return NextResponse.json({ message: "수정되었습니다." }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
