import { auth, currentUser } from "@clerk/nextjs/server";
import { getOrCreateProfileByClerkId } from "@/lib/db";
import { getAnswer, getApplication } from "@/lib/apps";
import { getAdminSupabase } from "@/lib/supabaseAdmin";
import { getQuotaSnapshot, assertWithinLimit, logAiUse } from "@/lib/quota";

export async function POST(req: Request, { params }: { params: { answerId: string }}) {
  const { userId } = auth(); if(!userId) return new Response("Unauthorized", {status:401});
  const u = await currentUser();
  const p = await getOrCreateProfileByClerkId(userId, u?.emailAddresses?.[0]?.emailAddress, u?.firstName ?? undefined);

  const body = await req.json(); // { prompt?: string, selectedStoryIds: string[], wordLimit?: number|null }
  const ans = await getAnswer(params.answerId);
  const app = await getApplication(ans.application_id);
  if (app.user_id !== p.id) return new Response("Forbidden", { status: 403 });
  
  const snap = await getQuotaSnapshot(userId);
  try { assertWithinLimit("ai_calls", snap); } catch (e) { if (e instanceof Response) return e; throw e; }

  const sb = getAdminSupabase();
  const { data: stories } = await sb.from("anchor_stories").select("*").in("id", body.selectedStoryIds ?? []).eq("user_id", p.id);

  const outlinePrompt = `You are an MBA coach. Build a compact outline with 3-5 sections for the essay.
  Respect word limit ${body.wordLimit ?? "?"}. Use these stories: ${JSON.stringify(stories ?? [])}.
  Output JSON: {"sections":[{"title":"...","bullets":["..."]}]}`;

  const r = await fetch("https://api.openai.com/v1/chat/completions", {
    method:"POST",
    headers:{ "Content-Type":"application/json", "Authorization":`Bearer ${process.env.OPENAI_API_KEY!}` },
    body: JSON.stringify({
      model: process.env.OPENAI_MODEL || "gpt-4o-mini",
      messages:[{role:"system",content:"You create concise, actionable essay outlines."},{role:"user",content:outlinePrompt}],
      response_format:{ type:"json_object" },
      temperature:0.4
    })
  });
  const j = await r.json();
  const outline = (()=>{ try { return JSON.parse(j.choices?.[0]?.message?.content ?? "{}"); } catch { return { sections: [] }; }})();

  // version insert
  const { data: latest } = await sb
    .from("essay_outline_versions").select("version").eq("answer_id", ans.id)
    .order("version", { ascending:false }).limit(1).maybeSingle();
  const next = (latest?.version ?? 0) + 1;
  await sb.from("essay_outline_versions").insert({ answer_id: ans.id, version: next, outline });

  // Record story usage
  for (const storyId of body.selectedStoryIds ?? []) {
    await sb.from("story_usage").upsert({
      story_id: storyId,
      answer_id: ans.id,
      application_id: app.id,
      role: "primary"
    });
  }

  await logAiUse(snap.profile_id, "ai_design");
  return Response.json({ version: next, outline });
} 