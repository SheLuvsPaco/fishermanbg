import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://faapmfiqzcpazzveezdp.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZhYXBtZmlxemNwYXp6dmVlemRwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc5ODIxMzMsImV4cCI6MjA3MzU1ODEzM30.F7mFZu88Ily8l8fiyBvh7e4xLEhBR97sx8LLKKOePp0";

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});