import { SupabaseClient } from "@supabase/supabase-js";

export async function progress(db: SupabaseClient<any, any, any>, userId: string) {
  // Note: v_user_progress view doesn't exist in the new schema
  console.log("Progress Provider: v_user_progress view not available in new schema");
  return null;
}
