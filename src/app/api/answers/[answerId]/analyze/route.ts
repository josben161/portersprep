import { requireAuthedProfile } from "@/lib/authz";
import { getAdminSupabase } from "@/lib/supabaseAdmin";
import { getQuotaSnapshot, assertWithinLimit, logAiUse } from "@/lib/quota";
import { chatJson } from "@/lib/ai";

export async function POST(
  _: Request,
  { params }: { params: { answerId: string } },
) {
  const { profile } = await requireAuthedProfile();
  const snap = await getQuotaSnapshot(profile.clerk_user_id);
  try {
    assertWithinLimit("ai_calls", snap);
  } catch (e) {
    if (e instanceof Response) return e;
    throw e;
  }

  const sb = getAdminSupabase();
  const { data: ans } = await sb
    .from("application_answers")
    .select("id, content_key, applications(schools(name))")
    .eq("id", params.answerId)
    .single();
  // Load content text from S3 by content_key if you store bodies there (left as existing function call)
  const text = ""; // TODO: load content

  const system = "You are an MBA admissions reviewer. Return JSON only.";
  const user = `Text:\n${text}\n\nReturn {"rubric":{"school_focus":{"score":0-5,"hits":[],"misses":[]}, "narrative":{"cohesion":0-5,"gaps":[]}}, "sentences":[{"idx":1,"text":"","tags":["leadership"],"needs_evidence":false,"suggestions":[{"type":"strengthen","text":""}]}]}`;
  const result = await chatJson({ system, user, temperature: 0.3 });

  await logAiUse(profile.id, "ai_analyze");
  return Response.json(result);
}
