import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "../../../lib/supabaseServer";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      userid,
      password,
      comment_status,
      content_name,
      content_episode,
      comment_content,
    } = body;

    // 데이터 유효성 검사 강화
    if (!userid || !password || !content_name || !content_episode) {
      return NextResponse.json(
        { error: "Required fields are missing" },
        { status: 400 }
      );
    }

    // content_name과 content_episode 타입 검사 및 변환
    const parsedEpisode = Number(content_episode);

    console.log(parsedEpisode, "parsedEpisode??");

    if (isNaN(parsedEpisode)) {
      return NextResponse.json(
        { error: "Invalid episode number" },
        { status: 400 }
      );
    }

    const { data, error } = await supabaseServer
      .from("public_table")
      .insert([
        {
          userid,
          password,
          comment_status,
          content_name,
          content_episode: parsedEpisode, // 숫자로 변환된 값 사용
          comment_content,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ])
      .select();

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(
      {
        message: "Data inserted successfully",
        data,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Server error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
