import { SupabaseClient } from "@supabase/supabase-js";

export async function schools(db: SupabaseClient<any, any, any>) {
  // Note: schools table doesn't exist in the new schema
  console.log("Schools Provider: Schools table not available in new schema");
  return [];
}
