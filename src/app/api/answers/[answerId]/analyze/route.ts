import { auth, currentUser } from "@clerk/nextjs/server";
import { getAnswer, getApplication, listSchoolQuestions, listAnalyses, storeAnalysis, updateAnswerMeta } from "@/lib/apps";
import { getOrCreateProfileByClerkId } from "@/lib/db";
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";

const s3 = new S3Client({ region: process.env.AWS_REGION });
const MODEL = process.env.OPENAI_MODEL || "gpt-4o-mini";

async function loadText(bucket: string, key: string) {
  const obj = await s3.send(new GetObjectCommand({ Bucket: bucket, Key: key }));
  return (await obj.Body?.transformToString()) ?? "";
}

export async function POST(_: Request, { params }: { params: { answerId: string } }) {
  const { userId } = auth();
  if (!userId) return new Response("Unauthorized", { status: 401 });
  const u = await currentUser();
  const p = await getOrCreateProfileByClerkId(userId, u?.emailAddresses?.[0]?.emailAddress, u?.firstName ?? undefined);

  const ans = await getAnswer(params.answerId);
  const app = await getApplication(ans.application_id);
  if (app.user_id !== p.id) return new Response("Forbidden", { status: 403 });

  const bucket = process.env.S3_BUCKET!;
  const text = ans.content_s3_key ? await loadText(bucket, ans.content_s3_key) : "";

  // School context: questions and brief
  const questions = await listSchoolQuestions(app.school_id);

  const prompt = {
    role: "user",
    content: [
      { type: "text", text:
`You are an MBA application coach. Analyze the user's draft answer text for a specific school question.
Return strict JSON with:
{
  "rubric": {
    "school_focus": { "hits": string[], "misses": string[], "score": number },
    "narrative": { "cohesion": number, "gaps": string[], "notes": string[] }
  },
  "sentences": [
    { "idx": number, "text": string, "tags": string[], "needs_evidence": boolean, "suggestions": [{ "type": string, "text": string }] }
  ]
}

CRITERIA:
1) School focus: based on what that school looks for (values/tone) in brief + prompt archetype. Identify hits/misses and score 0-5.
2) Narrative fit: does it make sense with an MBA candidate profile? Flag gaps or missing throughline.
3) Sentence enhancement: tag sentences that could show leadership, analytics, or community; rewrite suggestions to elevate those.
4) Evidence: flag sentences that need corroboration; propose a stat or anecdote shape (without fabricating facts).

Keep style coaching-oriented, not ghostwriting. Suggestions should be concise and actionable.` }
    ]
  };

  // Compose brief from questions (archetype) and any school brief if you've stored it
  const schoolBrief = (questions?.length ? { questions } : {});
  const payload = {
    model: MODEL,
    messages: [
      { role: "system", content: "You are a concise, ethical MBA admissions coach. You never fabricate facts." },
      { role: "user", content: `SCHOOL_BRIEF:\n${JSON.stringify(schoolBrief).slice(0, 6000)}` },
      { role: "user", content: `ANSWER_TEXT:\n${text.slice(0, 12000)}` },
      prompt
    ],
    response_format: { type: "json_object" },
    temperature: 0.3
  };

  let json: any = {
    rubric: { school_focus: { hits: [], misses: [], score: 0 }, narrative: { cohesion: 0, gaps: [], notes: [] } },
    sentences: []
  };

  try {
    const r = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": `Bearer ${process.env.OPENAI_API_KEY!}` },
      body: JSON.stringify(payload)
    });
    const out = await r.json();
    json = JSON.parse(out.choices?.[0]?.message?.content ?? "{}");
  } catch (e) {
    // Leave defaults; return best-effort
  }

  await storeAnalysis(ans.id, MODEL, json.rubric, json.sentences);
  await updateAnswerMeta(ans.id, { rubric: json.rubric });
  return Response.json(json);
} 