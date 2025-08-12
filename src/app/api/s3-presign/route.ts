import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import crypto from "node:crypto";
import { requireAuthedProfile } from "@/lib/authz";

const s3 = new S3Client({ region: process.env.AWS_REGION });

export async function POST(req: Request) {
  const { profile } = await requireAuthedProfile();
  const { contentType, ext } = await req.json(); // { contentType: "text/markdown", ext: "md" }
  const bucket = process.env.S3_BUCKET!;
  const key = `users/${profile.id}/${crypto.randomUUID()}.${ext || "bin"}`;

  const cmd = new PutObjectCommand({
    Bucket: bucket,
    Key: key,
    ContentType: contentType || "application/octet-stream",
    ACL: "private"
  });
  const url = await getSignedUrl(s3, cmd, { expiresIn: 60 });
  return Response.json({ url, key });
} 