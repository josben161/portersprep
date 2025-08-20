import { SupabaseClient } from "@supabase/supabase-js";

export async function memory(db: SupabaseClient<any, any, any>, userId: string) {
  // Note: coach_memory table doesn't exist in the new schema
  console.log("Memory Provider: coach_memory table not available in new schema");
  return [];
}
