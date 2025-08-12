import { NextRequest } from "next/server";
import { requireAuthedProfile } from "@/lib/authz";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import crypto from "node:crypto";

const s3 = new S3Client({ region: process.env.AWS_REGION });

export async function GET(req: NextRequest) {
  try {
    // Check required environment variables first
    if (!process.env.AWS_REGION) {
      return new Response("AWS_REGION not configured", { status: 500 });
    }
    if (!process.env.S3_BUCKET) {
      return new Response("S3_BUCKET not configured", { status: 500 });
    }
    
    // Get user info without requiring profile to exist
    const { userId } = await import("@clerk/nextjs/server").then(m => m.auth());
    if (!userId) {
      return new Response("Unauthorized", { status: 401 });
    }
    
    const { searchParams } = new URL(req.url);
    const ext = searchParams.get("ext") || "pdf";
    
    // Validate file extension
    const allowedExtensions = ['pdf', 'doc', 'docx', 'txt'];
    if (!allowedExtensions.includes(ext.toLowerCase())) {
      return new Response(`File type .${ext} not allowed. Please use: ${allowedExtensions.join(', ')}`, { status: 400 });
    }
    
    const key = `resumes/${userId}/${crypto.randomUUID()}.${ext}`;
    
    console.log("Generating presigned URL for:", key);
    
    const contentType = ext === 'pdf' ? 'application/pdf' : 
                       ext === 'doc' ? 'application/msword' :
                       ext === 'docx' ? 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' :
                       'text/plain';
    
    console.log("Creating presigned URL with:", {
      bucket: process.env.S3_BUCKET,
      key,
      contentType,
      region: process.env.AWS_REGION
    });
    
    const url = await getSignedUrl(s3, new PutObjectCommand({
      Bucket: process.env.S3_BUCKET!,
      Key: key,
      ContentType: contentType
    }), { expiresIn: 60 });
    
    console.log("Presigned URL generated successfully");
    return Response.json({ url, key });
    
  } catch (error) {
    console.error("S3 presign error:", error);
    return new Response(`Failed to generate upload URL: ${error instanceof Error ? error.message : 'Unknown error'}`, { status: 500 });
  }
} 