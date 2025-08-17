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

    // If resumeKey is provided, extract text from S3
    if (resumeKey && !resumeText) {
      const { S3Client, GetObjectCommand } = await import("@aws-sdk/client-s3");
      const s3 = new S3Client({ region: process.env.AWS_REGION });

      const command = new GetObjectCommand({
        Bucket: process.env.S3_BUCKET,
        Key: resumeKey,
      });

      const response = await s3.send(command);

      if (!response.Body) {
        return NextResponse.json(
          { error: "Could not read resume content", traceId },
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
      try {
        console.log(`Starting PDF parsing [${traceId}], buffer size: ${buffer.length} bytes`);
        
        // Try to parse without options first
        const pdfParseModule = await import("pdf-parse");
        const pdfParse = pdfParseModule.default || pdfParseModule;
        
        const data = await pdfParse(buffer);
        finalResumeText = data.text;
        
        console.log(`PDF parsed successfully [${traceId}]: ${finalResumeText.length} characters extracted`);
      } catch (pdfError: any) {
        console.error(`PDF parsing error [${traceId}]:`, pdfError);
        console.error(`Error details:`, {
          message: pdfError?.message,
          stack: pdfError?.stack,
          bufferSize: buffer.length,
        });
        
        // If the error mentions test files, try a different approach
        if (pdfError?.message?.includes('test/data') || pdfError?.message?.includes('05-versions-space.pdf')) {
          console.log(`Detected test file error, trying alternative approach [${traceId}]`);
          
          try {
            // Try with a different import method
            const pdfParse = require("pdf-parse");
            const data = await pdfParse(buffer);
            finalResumeText = data.text;
            console.log(`Alternative PDF parsing successful [${traceId}]`);
          } catch (altError) {
            console.error(`Alternative PDF parsing also failed [${traceId}]:`, altError);
            return NextResponse.json(
              { error: "Failed to parse PDF file - test file access issue", traceId },
              { status: 500 },
            );
          }
        } else {
          return NextResponse.json(
            { error: "Failed to parse PDF file", traceId },
            { status: 500 },
          );
        }
      }

      if (!finalResumeText || finalResumeText.trim().length === 0) {
        return NextResponse.json(
          { error: "Could not extract text from PDF", traceId },
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
      .from("users_profile")
      .update({
        resume_text: finalResumeText,
        updated_at: new Date().toISOString(),
      })
      .eq("user_id", userId);
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
