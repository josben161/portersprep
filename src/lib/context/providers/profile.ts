import { SupabaseClient } from "@supabase/supabase-js";

export async function profile(db: SupabaseClient, userId: string) {
  const { data, error } = await db
    .from("users_profile")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();
  if (error) throw error;
  return data;
}
