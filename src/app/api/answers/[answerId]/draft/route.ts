import { requireAuthedProfile } from "@/lib/authz";
import { getAdminSupabase } from "@/lib/supabaseAdmin";
import { getQuotaSnapshot, assertWithinLimit, logAiUse } from "@/lib/quota";
import { chatJson } from "@/lib/ai";

export async function POST(_: Request, { params }:{ params:{ answerId:string }}) {
  const { profile, clerkUserId } = await requireAuthedProfile();
  const snap = await getQuotaSnapshot(clerkUserId);
  try { assertWithinLimit("ai_calls", snap); } catch (e) { if(e instanceof Response) return e; throw e; }

  const sb = getAdminSupabase();
  const { data: ans } = await sb.from("application_answers").select("id, prompt, word_limit, applications(schools(name))").eq("id", params.answerId).single();
  
  const system = "You are an MBA essay writing expert. Return JSON only.";
  const user = `Prompt: ${ans?.prompt}\nWord Limit: ${ans?.word_limit || "no limit"}\n\nReturn {"draft":"Write a compelling MBA essay draft here...","word_count":250,"tone":"professional","themes":["leadership","growth"]}`;
  const result = await chatJson({ system, user, temperature: 0.8 });

  await logAiUse(profile.id, "ai_draft");
  return Response.json(result);
} 