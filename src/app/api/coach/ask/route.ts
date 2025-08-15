import { NextRequest } from "next/server";
import { requireAuthedProfile } from "@/lib/authz";
import { callGateway } from "@/lib/ai";

export async function POST(req: NextRequest) {
  const { profile } = await requireAuthedProfile();
  const { question } = await req.json();
  const traceId = `ask-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  if (!question || typeof question !== "string") {
    return new Response("Missing question", { status: 400 });
  }

  try {
    const { content } = await callGateway("coach", {
      userId: profile.id,
      params: {
        question,
        mode: "expert_advice",
      },
    });

    return Response.json({ response: content });
  } catch (error) {
    console.error(`Coach API error [${traceId}]:`, error);
    return new Response("Failed to get response", { status: 500 });
  }
}
