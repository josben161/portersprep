import { NextRequest } from "next/server";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { requireAuthedProfile } from "@/lib/authz";
import crypto from "node:crypto";

const s3 = new S3Client({ region: process.env.AWS_REGION });

export async function GET(req: NextRequest) {
  await requireAuthedProfile(); // ensure auth
  const { searchParams } = new URL(req.url);
  const filename = searchParams.get("filename");
  if (!filename) return new Response("filename required", { status: 400 });

  // … if you already had a helper to create presigned URLs, reuse it.
  // Placeholder: return a key for the client to upload via a separate uploader component or formdata route.
  const key = `resumes/${crypto.randomUUID()}-${filename}`;
  return Response.json({ key });
}

export async function OPTIONS() {
  return new Response(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
}
