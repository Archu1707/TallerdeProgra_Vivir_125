import { createClient } from "@supabase/supabase-js";

// Supabase project: TallerdeProgra_Vivir_125 (wtboeqyvoxoiwzuyzwuf)
// The publishable key is safe to expose in browser code; access is controlled by RLS.
const SUPABASE_URL =
  import.meta.env.VITE_SUPABASE_URL ?? "https://wtboeqyvoxoiwzuyzwuf.supabase.co";
const SUPABASE_PUBLISHABLE_KEY =
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ??
  "sb_publishable_S4hYxDze1ksElsgyuGNisw_kJJqYutp";

const isBrowser = typeof window !== "undefined";

export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: isBrowser ? window.localStorage : undefined,
    persistSession: isBrowser,
    autoRefreshToken: isBrowser,
  },
});
