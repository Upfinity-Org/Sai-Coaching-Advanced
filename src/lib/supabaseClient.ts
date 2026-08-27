import { createClient, SupabaseClient } from "@supabase/supabase-js";

/* =========================================================
   SUPABASE CLIENT
   ---------------------------------------------------------
   Reads two public, non-secret values from the environment:
     VITE_SUPABASE_URL
     VITE_SUPABASE_ANON_KEY
   Both come from Supabase Dashboard -> Project Settings -> API.
   Neither is a secret: the anon key can only do what the Row Level
   Security policies in supabase/schema.sql allow it to do.

   If these aren't set (e.g. first clone, before setup), the site
   falls back to static placeholder content instead of crashing —
   see src/lib/content.ts.
   ========================================================= */

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as
  | string
  | undefined;

export const supabaseEnabled = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase: SupabaseClient | null = supabaseEnabled
  ? createClient(supabaseUrl as string, supabaseAnonKey as string)
  : null;

export const STORAGE_BUCKET = "site-images";
