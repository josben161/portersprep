import { auth, currentUser } from "@clerk/nextjs/server";
import { getAnswer, getApplication } from "@/lib/apps";
import { getOrCreateProfileByClerkId } from "@/lib/db";
import {
  S3Client,
  GetObjectCommand,
  PutObjectCommand,
} from "@aws-sdk/client-s3";

const s3 = new S3Client({ region: process.env.AWS_REGION });

export async function GET(
  _: Request,
  { params }: { params: { answerId: string } },
) {
  const { userId } = auth();
  if (!userId) return new Response("Unauthorized", { status: 401 });
  const u = await currentUser();
  const p = await getOrCreateProfileByClerkId(
    userId,
    u?.emailAddresses?.[0]?.emailAddress,
    u?.firstName ?? undefined,
  );
  const ans = await getAnswer(params.answerId);
  const app = await getApplication(ans.application_id);
  if (app.user_id !== p.id) return new Response("Forbidden", { status: 403 });
  const key = ans.content_s3_key ?? `applications/${app.id}/${ans.id}.md`;
  try {
    const obj = await s3.send(
      new GetObjectCommand({ Bucket: process.env.S3_BUCKET!, Key: key }),
    );
    const text = await obj.Body?.transformToString();
    return new Response(text ?? "", { status: 200 });
  } catch {
    return new Response("", { status: 200 });
  }
}

export async function POST(
  req: Request,
  { params }: { params: { answerId: string } },
) {
  const { userId } = auth();
  if (!userId) return new Response("Unauthorized", { status: 401 });
  const u = await currentUser();
  const p = await getOrCreateProfileByClerkId(
    userId,
    u?.emailAddresses?.[0]?.emailAddress,
    u?.firstName ?? undefined,
  );
  const ans = await getAnswer(params.answerId);
  const app = await getApplication(ans.application_id);
  if (app.user_id !== p.id) return new Response("Forbidden", { status: 403 });
  const body = await req.json();
  const text = body?.text ?? "";
  const key = ans.content_s3_key ?? `applications/${app.id}/${ans.id}.md`;
  await s3.send(
    new PutObjectCommand({
      Bucket: process.env.S3_BUCKET!,
      Key: key,
      Body: text,
      ContentType: "text/markdown",
    }),
  );
  // save meta
  const wc = (text.trim().match(/\S+/g) ?? []).length;
  const { updateAnswerMeta } = await import("@/lib/apps");
  await updateAnswerMeta(ans.id, { content_s3_key: key, word_count: wc });
  return new Response("ok");
}
