import { requireAuthedProfile } from "@/lib/authz";
import { getQuotaSnapshot, assertWithinLimit, logAiUse } from "@/lib/quota";
import { chatJson } from "@/lib/ai";

export async function POST(req: Request) {
  const { profile, clerkUserId } = await requireAuthedProfile();
  const snap = await getQuotaSnapshot(clerkUserId);
  try {
    assertWithinLimit("ai_calls", snap);
  } catch (e) {
    if (e instanceof Response) return e;
    throw e;
  }

  const { text, prompt } = await req.json();

  const system = "You are an MBA essay editing expert. Return JSON only.";
  const user = `Text: ${text}\nPrompt: ${prompt}\n\nReturn {"redlines":[{"start":0,"end":10,"suggestion":"improved text","reason":"explanation"}],"overall_score":8,"feedback":"overall feedback"}`;
  const result = await chatJson({ system, user, temperature: 0.4 });

  await logAiUse(profile.id, "ai_redline");
  return Response.json(result);
}
