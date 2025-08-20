import { SupabaseClient } from "@supabase/supabase-js";

export async function applications(
  db: SupabaseClient<any, any, any>,
  userId: string,
  scope: any,
) {
  let q = db
    .from("applications")
    .select("id, user_id, school_cycle_id, status, created_at, updated_at")
    .eq("user_id", userId);
  const appId =
    typeof scope.applications === "object"
      ? scope.applications.applicationId
      : null;
  if (appId) q = q.eq("id", appId);
  const { data, error } = await q;
  if (error) throw error;
  return data ?? [];
}
