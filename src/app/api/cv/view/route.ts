import { NextRequest, NextResponse } from "next/server";
import { requireAuthedProfile } from "@/lib/authz";
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3 = new S3Client({ region: process.env.AWS_REGION });

export async function GET(request: NextRequest) {
  try {
    const { profile } = await requireAuthedProfile();

    if (!profile.resume_key) {
      return NextResponse.json({ error: "No CV uploaded" }, { status: 404 });
    }

    // Check required environment variables
    if (!process.env.AWS_REGION || !process.env.S3_BUCKET) {
      return NextResponse.json({ error: "S3 not configured" }, { status: 500 });
    }

    // Create presigned URL for viewing/downloading
    const command = new GetObjectCommand({
      Bucket: process.env.S3_BUCKET,
      Key: profile.resume_key,
      ResponseContentDisposition: `inline; filename="${profile.resume_filename || "CV.pdf"}"`,
    });

    const presignedUrl = await getSignedUrl(s3, command, { expiresIn: 3600 }); // 1 hour

    return NextResponse.json({
      url: presignedUrl,
      filename: profile.resume_filename || "CV.pdf",
      key: profile.resume_key,
    });
  } catch (error) {
    console.error("CV view error:", error);
    return NextResponse.json(
      { error: "Failed to generate CV URL" },
      { status: 500 },
    );
  }
}
