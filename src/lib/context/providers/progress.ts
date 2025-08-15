import { SupabaseClient } from "@supabase/supabase-js";

export async function progress(db: SupabaseClient, userId: string) {
  const { data, error } = await db
    .from("v_user_progress")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();
  if (error) throw error;
  return data;
}
