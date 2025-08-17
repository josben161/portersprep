import { NextRequest } from "next/server";
import { requireAuth } from "@/lib/authz";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import crypto from "node:crypto";

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

    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return new Response("No file provided", { status: 400 });
    }

    // Validate file type
    const fileName = file.name.toLowerCase();
    const allowedExtensions = [".pdf", ".doc", ".docx", ".txt"];
    const hasValidExtension = allowedExtensions.some((ext) =>
      fileName.endsWith(ext),
    );

    if (!hasValidExtension) {
      return new Response(
        `File type not allowed. Please use: ${allowedExtensions.join(", ")}`,
        { status: 400 },
      );
    }

    // Generate S3 key
    const ext = fileName.split(".").pop() || "pdf";
    const key = `resumes/${userId}/${crypto.randomUUID()}.${ext}`;
    const originalFileName = file.name; // Store original filename

    // Determine content type
    const contentType =
      ext === "pdf"
        ? "application/pdf"
        : ext === "doc"
          ? "application/msword"
          : ext === "docx"
            ? "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            : "text/plain";

    // Convert file to buffer
    const buffer = Buffer.from(await file.arrayBuffer());

    // Upload to S3
    const command = new PutObjectCommand({
      Bucket: process.env.S3_BUCKET!,
      Key: key,
      Body: buffer,
      ContentType: contentType,
      Metadata: {
        "original-filename": originalFileName, // Store original filename in S3 metadata
      },
    });

    await s3.send(command);

    // Also upload the extracted text as a JSON blob alongside the PDF
    const textKey = key.replace(/\.[^/.]+$/, '.json'); // Replace extension with .json
    const textData = {
      extracted_text: "", // Will be populated by client
      extracted_at: new Date().toISOString(),
      original_filename: originalFileName,
      pdf_key: key
    };

    const textCommand = new PutObjectCommand({
      Bucket: process.env.S3_BUCKET!,
      Key: textKey,
      Body: JSON.stringify(textData, null, 2),
      ContentType: "application/json",
      Metadata: {
        "original-filename": originalFileName,
        "pdf-key": key
      },
    });

    await s3.send(textCommand);

    // Update profile with resume_key and original filename
    const { getAdminSupabase } = await import("@/lib/supabaseAdmin");
    const sb = getAdminSupabase();

    // Try to update existing profile first
    const { error: updateError } = await sb
      .from("profiles")
      .update({
        resume_key: key,
        resume_filename: originalFileName, // Store original filename in database
      })
      .eq("clerk_user_id", userId);

    if (updateError) {
      console.error("Profile update error:", updateError);
      // Try to create profile if update fails
      const { error: insertError } = await sb.from("profiles").insert({
        clerk_user_id: userId,
        resume_key: key,
        resume_filename: originalFileName,
        email: "user@example.com", // Provide default email to satisfy constraint
        name: "User",
        subscription_tier: "free",
      });

      if (insertError) {
        console.error("Profile insert error:", insertError);
        // Continue anyway since S3 upload succeeded
      }
    }

    return Response.json({
      success: true,
      key,
      textKey: textKey, // Include the text JSON key
      message: "CV uploaded successfully!",
    });
  } catch (error) {
    console.error("CV upload error:", error);
    return new Response(
      `Upload failed: ${error instanceof Error ? error.message : "Unknown error"}`,
      { status: 500 },
    );
  }
}
