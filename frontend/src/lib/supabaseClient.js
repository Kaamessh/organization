import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "https://hvmgxmopyzslenzyzjdg.supabase.co"
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh2bWd4bW9weXpzbGVuenl6amRnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ2MTQ0MzUsImV4cCI6MjA5MDE5MDQzNX0.axJZsxHdRhtW4k9ggZ5IhwlIkYLszuSDdYrUk_CIbZM"

// Safely create the client - if env vars are missing, return a mock that won't crash React
let supabase;
try {
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase environment variables in Vercel settings.');
  }
  console.log("🚀 AURA: Supabase Client Initialized with Real Credentials!");
  supabase = createClient(supabaseUrl, supabaseAnonKey);
} catch (e) {
  console.warn('⚠️ AURA: Supabase not configured. Using Mock Client (No Realtime).', e.message);
  // Return a safe mock object so the app can mount without crashing
  supabase = {
    auth: {
      getSession: async () => ({ data: { session: null }, error: null }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
      signInWithPassword: async () => ({ error: { message: '⚠️ App not configured: Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in Vercel Settings!' } }),
      signUp: async () => ({ error: { message: '⚠️ App not configured: Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in Vercel Settings!' } }),
      signOut: async () => {},
    },
    from: () => ({
      select: () => ({ 
        eq: () => ({ 
          order: () => ({ 
            limit: async () => ({ data: [], error: null }) 
          }),
          single: async () => ({ data: null, error: null }), 
          maybeSingle: async () => ({ data: null, error: null }) 
        }) 
      }),
      upsert: async () => ({ error: null }),
      insert: async () => ({ error: null }),
      update: () => ({ eq: async () => ({ error: null }) }),
    }),
    channel: () => ({
      on: () => ({
        on: () => ({
          subscribe: () => {}
        }),
        subscribe: () => {}
      }),
      subscribe: () => {}
    }),
    removeChannel: () => {},

  };
}

export { supabase };
