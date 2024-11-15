import { supabaseServer } from "../../../lib/supabaseServer";

export async function GET(req) {
    const { data, error } = await supabaseServer.from("public_table").select("*");
    if (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
      });
    }
    return new Response(JSON.stringify(data), { status: 200 });
  }
