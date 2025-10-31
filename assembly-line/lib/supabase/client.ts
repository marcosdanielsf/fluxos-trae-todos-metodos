import { createClient } from "@supabase/supabase-js";
import { Database } from "./types";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

// Check if Supabase is configured
export const isSupabaseConfigured =
  supabaseUrl &&
  supabaseAnonKey &&
  supabaseUrl !== "your-project-url.supabase.co" &&
  supabaseAnonKey !== "your-anon-key-here";

if (!isSupabaseConfigured) {
  console.warn(
    "⚠️  Supabase não configurado. Consulte SUPABASE_SETUP.md para instruções."
  );
}

// Create client (will only work if properly configured)
export const supabase = isSupabaseConfigured
  ? createClient<Database>(supabaseUrl, supabaseAnonKey)
  : null;
