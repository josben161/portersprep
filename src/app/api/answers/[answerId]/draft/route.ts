import { auth, currentUser } from "@clerk/nextjs/server";
import { getOrCreateProfileByClerkId } from "@/lib/db";
import { getAnswer, getApplication } from "@/lib/apps";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const s3 = new S3Client({ region: process.env.AWS_REGION });

export async function POST(req: Request, { params }: { params: { answerId: string }}) {
  const { userId } = auth(); if(!userId) return new Response("Unauthorized", {status:401});
  const u = await currentUser();
  const p = await getOrCreateProfileByClerkId(userId, u?.emailAddresses?.[0]?.emailAddress, u?.firstName ?? undefined);

  const body = await req.json(); // { outline, wordLimit }
  const ans = await getAnswer(params.answerId);
  const app = await getApplication(ans.application_id);
  if (app.user_id !== p.id) return new Response("Forbidden", { status: 403 });

  const coachingPrompt = `Draft a coaching-style essay (not final prose) from this outline. Include inline notes like [ADD METRIC], [TIE TO SCHOOL VALUE].
  Respect word limit ${body.wordLimit ?? "?"}. Outline: ${JSON.stringify(body.outline)}`;

  const r = await fetch("https://api.openai.com/v1/chat/completions", {
    method:"POST",
    headers:{ "Content-Type":"application/json", "Authorization":`Bearer ${process.env.OPENAI_API_KEY!}` },
    body: JSON.stringify({
      model: process.env.OPENAI_MODEL || "gpt-4o-mini",
      messages:[{role:"system",content:"You are an ethical MBA coach. You do not fabricate facts."},{role:"user",content:coachingPrompt}],
      temperature:0.3
    })
  });
  const j = await r.json();
  const text = j.choices?.[0]?.message?.content ?? "";

  const key = `applications/${app.id}/${ans.id}.md`;
  await s3.send(new PutObjectCommand({ Bucket: process.env.S3_BUCKET!, Key:key, Body:text, ContentType:"text/markdown" }));
  return Response.json({ ok: true, key });
} 