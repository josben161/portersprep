import { SupabaseClient } from "@supabase/supabase-js";

export async function essays(db: SupabaseClient, _userId: string, scope: any) {
  const appId =
    typeof scope.essays === "object" ? scope.essays.applicationId : null;
  let q = db
    .from("answers")
    .select(
      `
      id, application_id, question_id, content, status, updated_at,
      questions!inner ( id, title, prompt, word_limit )
    `,
    )
    .order("updated_at", { ascending: false });
  if (appId) q = q.eq("application_id", appId);
  const { data, error } = await q;
  if (error) throw error;
  return data ?? [];
}
