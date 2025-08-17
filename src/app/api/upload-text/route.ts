import { NextRequest } from "next/server";
import { requireAuth } from "@/lib/authz";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const s3 = new S3Client({ region: process.env.AWS_REGION });

export async function POST(req: NextRequest) {
  try {
    const { userId } = await requireAuth();

    // Check required environment variables
    if (!process.env.AWS_REGION) {
      return new Response("AWS_REGION not configured", { status: 500 });
    }
    if (!process.env.S3_BUCKET) {
      return new Response("S3_BUCKET not configured", { status: 500 });
    }

    const { textKey, textData } = await req.json();

    if (!textKey || !textData) {
      return new Response("Missing textKey or textData", { status: 400 });
    }

    // Upload the text JSON to S3
    const command = new PutObjectCommand({
      Bucket: process.env.S3_BUCKET!,
      Key: textKey,
      Body: JSON.stringify(textData, null, 2),
      ContentType: "application/json",
      Metadata: {
        "original-filename": textData.original_filename,
        "pdf-key": textData.pdf_key
      },
    });

    await s3.send(command);

    return Response.json({
      success: true,
      message: "Text JSON uploaded successfully!",
    });
  } catch (error) {
    console.error("Text upload error:", error);
    return new Response("Text upload failed", { status: 500 });
  }
}
