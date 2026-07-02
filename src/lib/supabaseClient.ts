import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "";

// Prevents application compilation failures if environment keys are empty
const isCredentialsConfigured = supabaseUrl && supabaseAnonKey;

export const supabase = isCredentialsConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

if (!isCredentialsConfigured) {
  console.warn(
    "Supabase credentials are not configured. The application is running in fully offline, local-only sandbox mode."
  );
}