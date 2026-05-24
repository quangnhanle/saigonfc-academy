import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(
  url &&
    anonKey &&
    url !== "https://your-project-ref.supabase.co" &&
    anonKey !== "your-anon-key"
);

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(url, anonKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false
      }
    })
  : null;

export function getSupabase(): SupabaseClient {
  if (!supabase) {
    throw new Error(
      "Supabase chưa được cấu hình. Vui lòng thiết lập VITE_SUPABASE_URL và VITE_SUPABASE_ANON_KEY trong file .env"
    );
  }
  return supabase;
}

export const TABLES = {
  students: "students",
  clubStandards: "club_standards",
  skillTests: "skill_tests",
  subSkillTests: "sub_skill_tests",
  testResults: "test_results"
} as const;
