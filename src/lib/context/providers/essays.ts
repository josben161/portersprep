import { SupabaseClient } from "@supabase/supabase-js";

export async function essays(db: SupabaseClient<any, any, any>, _userId: string, scope: any) {
  // Note: answers table doesn't exist in the new schema
  console.log("Essays Provider: answers table not available in new schema");
  return [];
}
