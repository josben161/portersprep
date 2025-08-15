import { NextRequest, NextResponse } from "next/server";
import { requireAuthedProfile } from "@/lib/authz";
import { callGateway } from "@/lib/ai";

export async function GET(request: NextRequest) {
  const traceId = `greeting-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  try {
    const { profile } = await requireAuthedProfile();

    const { content } = await callGateway("coach", {
      userId: profile.id,
      params: {
        mode: "greeting",
      },
    });

    return NextResponse.json({ greeting: content });
  } catch (error) {
    console.error(`Error getting personalized greeting [${traceId}]:`, error);
    return NextResponse.json({
      greeting:
        "Hello! I'm The Admit Planner, and I'm here to help you with your college application process.",
    });
  }
}
