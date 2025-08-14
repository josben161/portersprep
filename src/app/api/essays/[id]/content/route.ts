import { auth } from "@clerk/nextjs/server";
import {
  S3Client,
  GetObjectCommand,
  PutObjectCommand,
} from "@aws-sdk/client-s3";
import { getDocument, getOrCreateProfileByClerkId } from "@/lib/db";
import { currentUser } from "@clerk/nextjs/server";

const s3 = new S3Client({ region: process.env.AWS_REGION });

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const { userId } = auth();
  if (!userId) return new Response("Unauthorized", { status: 401 });
  const u = await currentUser();
  const profile = await getOrCreateProfileByClerkId(
    userId,
    u?.emailAddresses?.[0]?.emailAddress,
    u?.firstName ?? undefined,
  );
  const doc = await getDocument(params.id);
  if (!doc || doc.user_id !== profile.id)
    return new Response("Not found", { status: 404 });

  const key = `essays/${params.id}.txt`;
  try {
    const obj = await s3.send(
      new GetObjectCommand({ Bucket: process.env.S3_BUCKET!, Key: key }),
    );
    const body = await obj.Body?.transformToString();
    return new Response(body ?? "", { status: 200 });
  } catch {
    return new Response("", { status: 200 });
  }
}

export async function POST(
  req: Request,
  { params }: { params: { id: string } },
) {
  const { userId } = auth();
  if (!userId) return new Response("Unauthorized", { status: 401 });
  const u = await currentUser();
  const profile = await getOrCreateProfileByClerkId(
    userId,
    u?.emailAddresses?.[0]?.emailAddress,
    u?.firstName ?? undefined,
  );
  const doc = await getDocument(params.id);
  if (!doc || doc.user_id !== profile.id)
    return new Response("Not found", { status: 404 });

  const { text } = await req.json();
  const key = `essays/${params.id}.txt`;
  await s3.send(
    new PutObjectCommand({
      Bucket: process.env.S3_BUCKET!,
      Key: key,
      Body: text,
      ContentType: "text/plain",
    }),
  );
  return new Response("ok");
}
