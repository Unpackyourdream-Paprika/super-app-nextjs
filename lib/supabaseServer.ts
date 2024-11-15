// import { createClient } from "@supabase/supabase-js";

// const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
// const supabaseServiceRoleKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// console.log("Supabase URL:", process.env.NEXT_PUBLIC_SUPABASE_URL);
// console.log("Supabase Service Role Key:", process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

// if (!supabaseUrl || !supabaseServiceRoleKey) {
//   throw new Error("Supabase URL과 Service Role Key가 설정되지 않았습니다.");
// }

// export const supabaseServer = createClient(supabaseUrl, supabaseServiceRoleKey);

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // SERVICE_ROLE 키 사용

if (!supabaseUrl || !supabaseServiceRoleKey) {
  throw new Error("Supabase URL과 Service Role Key가 설정되지 않았습니다.");
}

export const supabaseServer = createClient(
  supabaseUrl,
  supabaseServiceRoleKey,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);
