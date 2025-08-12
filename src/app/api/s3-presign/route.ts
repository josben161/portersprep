import { NextRequest } from "next/server";
import { requireAuthedProfile } from "@/lib/authz";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import crypto from "node:crypto";

const s3 = new S3Client({ region: process.env.AWS_REGION });

export async function GET(req: NextRequest) {
  try {
    await requireAuthedProfile(); // auth gate
    
    // Check required environment variables
    if (!process.env.AWS_REGION) {
      return new Response("AWS_REGION not configured", { status: 500 });
    }
    if (!process.env.S3_BUCKET) {
      return new Response("S3_BUCKET not configured", { status: 500 });
    }
    
    const { searchParams } = new URL(req.url);
    const ext = searchParams.get("ext") || "pdf";
    const key = `resumes/${crypto.randomUUID()}.${ext}`;
    
    console.log("Generating presigned URL for:", key);
    
    const url = await getSignedUrl(s3, new PutObjectCommand({
      Bucket: process.env.S3_BUCKET!,
      Key: key,
      ContentType: "application/octet-stream"
    }), { expiresIn: 60 });
    
    console.log("Presigned URL generated successfully");
    return Response.json({ url, key });
    
  } catch (error) {
    console.error("S3 presign error:", error);
    return new Response(`Failed to generate upload URL: ${error instanceof Error ? error.message : 'Unknown error'}`, { status: 500 });
  }
} 