import { SupabaseClient } from "@supabase/supabase-js";

export async function recommendations(
  db: SupabaseClient,
  _userId: string,
  scope: any,
) {
  const appId =
    typeof scope.recommendations === "object"
      ? scope.recommendations.applicationId
      : null;
  let q = db.from("recommenders").select(`
      id, application_id, email, name, relationship, status, updated_at,
      recommendation_packets ( id, last_sent_at )
    `);
  if (appId) q = q.eq("application_id", appId);
  const { data, error } = await q;
  if (error) throw error;
  return data ?? [];
}
