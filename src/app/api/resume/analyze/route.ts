import { NextRequest, NextResponse } from "next/server";
import { requireAuthedProfile } from "@/lib/authz";
import { getAdminSupabase } from "@/lib/supabaseAdmin";
import { analyzeResume } from "@/lib/resume-analyzer";
import { getQuotaSnapshot, assertWithinLimit, logAiUse } from "@/lib/quota";

export async function POST(req: NextRequest) {
  try {
    const { profile, clerkUserId } = await requireAuthedProfile();

    // Check quota
    const snap = await getQuotaSnapshot(clerkUserId);
    try {
      assertWithinLimit("ai_calls", snap);
    } catch (e) {
      if (e instanceof Response) return e;
      throw e;
    }

    if (!profile.resume_key) {
      return NextResponse.json(
        { error: "No resume uploaded" },
        { status: 400 },
      );
    }

    // Get the resume content from S3
    const { S3Client, GetObjectCommand } = await import("@aws-sdk/client-s3");
    const s3 = new S3Client({ region: process.env.AWS_REGION });

    try {
      const command = new GetObjectCommand({
        Bucket: process.env.S3_BUCKET,
        Key: profile.resume_key,
      });

      const response = await s3.send(command);

      if (!response.Body) {
        return NextResponse.json(
          { error: "Could not read resume content" },
          { status: 500 },
        );
      }

      // Get the file as a buffer
      const chunks: Uint8Array[] = [];
      for await (const chunk of response.Body as any) {
        chunks.push(chunk);
      }
      const buffer = Buffer.concat(chunks);

      // Extract text from PDF
      let resumeText: string;
      try {
        // Import pdf-parse and use it directly
        const pdfParse = (await import("pdf-parse")).default;

        // Parse the PDF buffer
        const data = await pdfParse(buffer);
        resumeText = data.text;

        if (!resumeText || resumeText.trim().length === 0) {
          return NextResponse.json(
            { error: "Could not extract text from PDF" },
            { status: 500 },
          );
        }

        console.log("Extracted text length:", resumeText.length);
      } catch (pdfError) {
        console.error("PDF extraction error:", pdfError);
        return NextResponse.json(
          { error: "Could not extract text from PDF file" },
          { status: 500 },
        );
      }

      // Analyze the resume
      const analysis = await analyzeResume(resumeText);

      // Store the analysis in the database
      const supabase = getAdminSupabase();
      const { error: updateError } = await supabase
        .from("profiles")
        .update({ resume_analysis: analysis })
        .eq("id", profile.id);

      if (updateError) {
        console.error("Error storing resume analysis:", updateError);
        // Continue anyway since analysis was successful
      }

      await logAiUse(profile.id, "ai_analyze");
      return NextResponse.json({ analysis });
    } catch (s3Error) {
      console.error("S3 error:", s3Error);
      return NextResponse.json(
        { error: "Could not access resume file" },
        { status: 500 },
      );
    }
  } catch (error) {
    console.error("Resume analysis error:", error);
    return NextResponse.json(
      { error: "Failed to analyze resume" },
      { status: 500 },
    );
  }
}
