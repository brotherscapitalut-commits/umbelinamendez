import { createClient } from "@supabase/supabase-js";

// Pegamos as variáveis de ambiente que estarão cadastradas na Vercel e no .env local
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || import.meta.env.VITESUPABASEURL || "";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || import.meta.env.VITESUPABASEANONKEY || "";

// Se não houver chaves, criamos um dummy client para não quebrar a aplicação (fallback mode)
export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey) 
  : null;
