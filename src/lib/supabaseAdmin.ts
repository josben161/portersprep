import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let admin: SupabaseClient | null = null;

export function getAdminSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  if (!url || !key) {
    console.error("Missing Supabase environment variables:", {
      url: !!url,
      key: !!key
    });
    throw new Error("Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY");
  }
  
  if (!admin) {
    admin = createClient(url, key, { 
      auth: { 
        persistSession: false,
        autoRefreshToken: false
      },
      db: {
        schema: 'public'
      }
    });
    
    // Verify the client is working
    console.log("Admin Supabase client created with service role key");
  }
  
  return admin;
} 