import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "../../../lib/supabaseServer";

// app/api/public_delete/route.ts
export async function DELETE(req: NextRequest) {
  try {
    const { id, password } = await req.json();

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

    // soft delete: comment_status를 false로 변경
    const { error } = await supabaseServer
      .from("public_table")
      .update({ comment_status: false })
      .eq("id", id);

    if (error) throw error;

    return NextResponse.json({ message: "삭제되었습니다." }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
