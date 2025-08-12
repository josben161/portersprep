import { NextRequest } from "next/server";
import { requireAuthedProfile } from "@/lib/authz";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import crypto from "node:crypto";

const s3 = new S3Client({ region: process.env.AWS_REGION });

export async function GET(req: NextRequest) {
  await requireAuthedProfile(); // auth gate
  const { searchParams } = new URL(req.url);
  const ext = searchParams.get("ext") || "pdf";
  const key = `resumes/${crypto.randomUUID()}.${ext}`;
  const url = await getSignedUrl(s3, new PutObjectCommand({
    Bucket: process.env.S3_BUCKET!,
    Key: key,
    ContentType: "application/octet-stream"
  }), { expiresIn: 60 });
  return Response.json({ url, key });
} 