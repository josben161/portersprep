import { auth, currentUser } from "@clerk/nextjs/server";
import { getAdminSupabase } from "@/lib/supabaseAdmin";
import { getOrCreateProfileByClerkId } from "@/lib/db";
import { getApplication, listSchoolQuestions } from "@/lib/apps";
import { callGateway } from "@/lib/ai";

export async function POST(req: Request) {
  const { userId } = auth();
  if (!userId) return new Response("Unauthorized", { status: 401 });
  const u = await currentUser();
  const p = await getOrCreateProfileByClerkId(
    userId,
    u?.emailAddresses?.[0]?.emailAddress,
    u?.firstName ?? undefined,
  );
  const body = await req.json(); // { storyId, applicationId, tone?, focusTags?:string[], wordLimit?:number|null }

  if (!body?.storyId || !body?.applicationId)
    return new Response("Bad Request", { status: 400 });

  const sb = getAdminSupabase();
  const app = await getApplication(body.applicationId);
  if (!app || app.user_id !== p.id)
    return new Response("Forbidden", { status: 403 });

  // load story
  const { data: story } = await sb
    .from("anchor_stories")
    .select("*")
    .eq("id", body.storyId)
    .eq("user_id", p.id)
    .single();
  if (!story) return new Response("Not found", { status: 404 });

  // load school brief (if any) from DB schools or questions metadata
  const { data: schoolRow } = await sb
    .from("schools")
    .select("id,slug,name,brief")
    .eq("id", app.school_id)
    .single();
  const questions = await listSchoolQuestions(app.school_id);

  const system =
    "You are an ethical MBA essay coach. You adapt stories without inventing facts.";
  const user = `Adapt the following core story for the school: ${schoolRow?.name ?? "this school"}.
CORE STORY (facts; must keep true):
${story.summary}

TONE: ${body?.tone ?? "balanced, professional"}
FOCUS TAGS: ${JSON.stringify(body?.focusTags ?? story.tags ?? [])}
TARGET WORD LIMIT: ${body?.wordLimit ?? "match essay"}

SCHOOL CONTEXT (values, prompts):
${JSON.stringify({ brief: schoolRow?.brief, prompts: questions?.map((q) => ({ archetype: q.archetype, prompt: q.prompt, word_limit: q.word_limit })) }).slice(0, 6000)}

Guidelines:
- Keep facts identical to core story; do not fabricate metrics.
- Emphasize elements aligned with the focus tags and school tone.
- Produce tight, essay‑ready prose (no meta commentary).
- If a metric is missing, ask for [ADD METRIC] rather than inventing it.`;

  const { content } = await callGateway("coach", {
    userId: p.id,
    params: {
      storyId: body.storyId,
      applicationId: body.applicationId,
      storySummary: story.summary,
      schoolName: schoolRow?.name,
      tone: body?.tone,
      focusTags: body?.focusTags,
      wordLimit: body?.wordLimit,
      schoolBrief: schoolRow?.brief,
      questions,
    },
  });
  const adapted = content ?? story.summary;

  // upsert variant (unique by story_id + application_id)
  const style = {
    tone: body?.tone ?? null,
    focus: body?.focusTags ?? [],
    word_limit: body?.wordLimit ?? null,
  };
  const { data: variant, error } = await sb
    .from("story_variants")
    .upsert(
      {
        story_id: story.id,
        application_id: app.id,
        school_id: app.school_id,
        tone_profile: body?.tone ?? null,
        style,
        adapted_text: adapted,
      },
      { onConflict: "story_id,application_id" },
    )
    .select("*")
    .single();

  if (error) return new Response(error.message, { status: 400 });
  return Response.json({ variant });
}
