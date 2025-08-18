import { NextRequest, NextResponse } from "next/server";
import { requireAuthedProfile } from "@/lib/authz";
import { getAdminSupabase } from "@/lib/supabaseAdmin";
import { getQuotaSnapshot, assertWithinLimit, logAiUse } from "@/lib/quota";
import { callGateway } from "@/lib/ai";

export async function POST(req: NextRequest) {
  const traceId = `predict_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  try {
    const { profile } = await requireAuthedProfile();

    // Check quota
          const snap = await getQuotaSnapshot(profile.clerk_user_id);
    try {
      assertWithinLimit("ai_calls", snap);
    } catch (e) {
      if (e instanceof Response) return e;
      throw e;
    }

    // Use default target schools - context will be provided by gateway
    const targetSchools = [
      "Harvard Business School",
      "Stanford Graduate School of Business",
      "The Wharton School",
      "MIT Sloan School of Management",
      "Columbia Business School",
    ];

    let content: string;
    try {
      const result = await callGateway("predict", {
        userId: profile.id,
        params: {
          targetSchools,
        },
      });
      content = result.content;
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

    let parsed: any;
    try {
      parsed = JSON.parse(content);
    } catch {
      parsed = {
        schools: [],
        overall: { strengths: [], risks: [], strategy: [], next_steps: [] },
      };
    }

    // Store the prediction
    const supabase = getAdminSupabase();
    const { error } = await supabase.from("assessments").insert({
      user_id: profile.id,
      inputs: {
        context_used: true,
        target_schools: targetSchools,
      },
      result: parsed,
    });

    if (error) {
      console.error("Error storing assessment:", error);
      return NextResponse.json(
        { error: "Failed to store prediction" },
        { status: 500 },
      );
    }

    await logAiUse(profile.id, "ai_analyze");
    return NextResponse.json(parsed);
  } catch (error) {
    console.error(`Prediction error [${traceId}]:`, error);
    return NextResponse.json(
      { error: "Internal server error", traceId },
      { status: 500 },
    );
  }
}
