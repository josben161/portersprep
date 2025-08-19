// src/app/api/resume/assess/route.ts
import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/db";
import { callGateway } from "@/lib/ai";
import { z } from "zod";

const AssessSchema = z
  .object({
    userId: z.string().uuid().or(z.string().min(3)), // allow dev ids
    resumeText: z.string().min(1).optional(),
    resumeKey: z.string().min(2).optional(),
  })
  .refine((v) => !!(v.resumeText || v.resumeKey), {
    message: "resumeText or resumeKey required",
  });

export async function POST(req: NextRequest) {
  const traceId = `resume_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  try {
    const raw = await req.json();
    const parsed = AssessSchema.safeParse(raw);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.flatten(), traceId },
        { status: 400 },
      );
    }
    const { userId, resumeText, resumeKey } = parsed.data;

    let finalResumeText = resumeText;

    // If resumeKey is provided but no resumeText, fetch the text from S3 JSON blob
    if (resumeKey && !resumeText) {
      console.log(`Fetching resume text from S3 JSON blob [${traceId}]`);
      
      try {
        const { S3Client, GetObjectCommand } = await import("@aws-sdk/client-s3");
        const s3 = new S3Client({ region: process.env.AWS_REGION });

        // Construct the text JSON key from the PDF key
        const textKey = resumeKey.replace(/\.[^/.]+$/, '.json');

        const command = new GetObjectCommand({
          Bucket: process.env.S3_BUCKET,
          Key: textKey,
        });

        const response = await s3.send(command);

        if (!response.Body) {
          return NextResponse.json(
            { error: "Could not read resume text data", traceId },
            { status: 500 },
          );
        }

        // Get the JSON data
        const chunks: Uint8Array[] = [];
        for await (const chunk of response.Body as any) {
          chunks.push(chunk);
        }
        const jsonBuffer = Buffer.concat(chunks);
        const textData = JSON.parse(jsonBuffer.toString());

        if (textData.extracted_text) {
          finalResumeText = textData.extracted_text;
          console.log(`Using S3 resume text [${traceId}]: ${finalResumeText?.length || 0} characters`);
        } else {
          console.log(`No extracted text found in S3 JSON [${traceId}], returning error`);
          return NextResponse.json(
            { error: "No resume text available for analysis. Please re-upload your resume.", traceId },
            { status: 400 },
          );
        }
        
      } catch (s3Error) {
        console.error(`S3 text fetch error [${traceId}]:`, s3Error);
        return NextResponse.json(
          { error: "Could not access resume text data", traceId },
          { status: 500 },
        );
      }
    }

    if (!userId || !finalResumeText) {
      return NextResponse.json(
        { error: "Missing userId or resumeText", traceId },
        { status: 400 },
      );
    }

    // Persist parsed resume text
    const { error: upErr } = await supabaseAdmin
      .from("profiles")
      .update({
        resume_text: finalResumeText,
        updated_at: new Date().toISOString(),
      })
      .eq("id", userId);
    if (upErr) throw upErr;

    // Ask LLM for feedback (context pulled in gateway)
    let content: string;
    let usage: any;
    try {
      const result = await callGateway("resume", { userId, params: {} });
      content = result.content;
      usage = result.usage;
    } catch (error) {
      console.error(`Gateway error [${traceId}]:`, error);
      // Check if it's a gateway error with traceId
      if (error && typeof error === "object" && "traceId" in error) {
        return NextResponse.json(
          { error: "AI service error", traceId: error.traceId },
          { status: 500 },
        );
      }
      throw error;
    }
    return NextResponse.json({ content, usage, traceId });
  } catch (e: any) {
    console.error(`Resume assess error [${traceId}]:`, e);
    
    // Provide more specific error messages
    let errorMessage = "Unknown error";
    if (e?.message?.includes("pdf-parse")) {
      errorMessage = "Failed to parse PDF file";
    } else if (e?.message?.includes("S3")) {
      errorMessage = "Failed to access resume file";
    } else if (e?.message?.includes("Supabase")) {
      errorMessage = "Failed to save resume data";
    } else if (e?.message) {
      errorMessage = e.message;
    }
    
    return NextResponse.json(
      { error: errorMessage, traceId },
      { status: 500 },
    );
  }
}
