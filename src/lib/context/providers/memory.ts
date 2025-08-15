import { SupabaseClient } from "@supabase/supabase-js";

export async function memory(db: SupabaseClient, userId: string) {
  const { data, error } = await db
    .from("coach_memory")
    .select("*")
    .eq("user_id", userId)
    .order("updated_at", { ascending: false })
    .limit(100);
  if (error) throw error;
  return data ?? [];
}
