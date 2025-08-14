import { NextRequest } from "next/server";
import { requireAuthedProfile } from "@/lib/authz";
import { chatJson } from "@/lib/ai";

export async function POST(req: NextRequest) {
  const { profile } = await requireAuthedProfile();
  const { question } = await req.json();

  if (!question || typeof question !== "string") {
    return new Response("Missing question", { status: 400 });
  }

  try {
    const response = await chatJson({
      system: `You are an expert MBA admissions coach with deep knowledge of business school applications, essays, interviews, and the overall admissions process. You provide practical, actionable advice to help applicants succeed.

Key areas of expertise:
- Essay writing strategies and structure
- School selection and fit assessment
- Application timeline planning
- Interview preparation
- Resume optimization
- Letter of recommendation guidance
- GMAT/GRE strategy
- Career goals articulation

Always provide specific, actionable advice. Be encouraging but realistic. Focus on practical steps the applicant can take.`,
      user: question,
      model: "gpt-4-turbo-preview",
    });

    return Response.json({ response: response.content });
  } catch (error) {
    console.error("Coach API error:", error);
    return new Response("Failed to get response", { status: 500 });
  }
}
