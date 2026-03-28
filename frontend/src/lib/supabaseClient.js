import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "https://missing-url.supabase.co";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "missing-key";

if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
  console.warn("⚠️ AURA CONFIG: Missing Vercel Environment Variables! The app is using a fallback to prevent a crash.");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
