import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const supabaseUrl = "https://ytomchbcdfocierzxbbe.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl0b21jaGJjZGZvY2llcnp4YmJlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYxNzQ4MzUsImV4cCI6MjA3MTc1MDgzNX0.c856JIjJ8DnyVHVbV_rvfj1pPV4mEAu1pD1yviiwkNU";

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  }
});
