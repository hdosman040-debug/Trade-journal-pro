import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "";
const isCredentialsConfigured = supabaseUrl && supabaseAnonKey;

export const supabase = isCredentialsConfigured ? createClient(supabaseUrl, supabaseAnonKey) : null;

if (!isCredentialsConfigured) {
  console.warn("Supabase credentials are not configured. Running in offline mode.");
}
