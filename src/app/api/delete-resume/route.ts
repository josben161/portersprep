import { NextRequest } from "next/server";
import { requireAuth } from "@/lib/authz";
import { S3Client, DeleteObjectCommand } from "@aws-sdk/client-s3";

const s3 = new S3Client({ region: process.env.AWS_REGION });

export async function DELETE(req: NextRequest) {
  try {
    const { userId } = await requireAuth();

    // Check required environment variables
    if (!process.env.AWS_REGION) {
      return new Response("AWS_REGION not configured", { status: 500 });
    }
    if (!process.env.S3_BUCKET) {
      return new Response("S3_BUCKET not configured", { status: 500 });
    }

    const { pdfKey, textKey } = await req.json();

    if (!pdfKey) {
      return new Response("Missing pdfKey", { status: 400 });
    }

    const deletePromises = [];

    // Delete PDF file
    if (pdfKey) {
      const pdfCommand = new DeleteObjectCommand({
        Bucket: process.env.S3_BUCKET!,
        Key: pdfKey,
      });
      deletePromises.push(s3.send(pdfCommand));
    }

    // Delete JSON text file
    if (textKey) {
      const jsonCommand = new DeleteObjectCommand({
        Bucket: process.env.S3_BUCKET!,
        Key: textKey,
      });
      deletePromises.push(s3.send(jsonCommand));
    }

    // Execute all deletions
    await Promise.all(deletePromises);

    return Response.json({
      success: true,
      message: "Resume files deleted successfully!",
    });
  } catch (error) {
    console.error("Resume deletion error:", error);
    return new Response("Resume deletion failed", { status: 500 });
  }
}
