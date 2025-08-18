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
    .select("id, prompt, applications(schools(name))")
    .eq("id", params.answerId)
    .single();

  const system = "You are an MBA essay design expert. Return JSON only.";
  const user = `Prompt: ${ans?.prompt}\n\nReturn {"outline":[{"section":"introduction","points":["point1","point2"]},{"section":"body","points":["point1","point2"]},{"section":"conclusion","points":["point1","point2"]}],"themes":["theme1","theme2"],"tone":"professional"}`;
  const result = await chatJson({ system, user, temperature: 0.7 });

  await logAiUse(profile.id, "ai_design");
  return Response.json(result);
}
