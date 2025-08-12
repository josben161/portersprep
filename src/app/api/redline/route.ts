import { requireAuthedProfile } from "@/lib/authz";
import { z } from "zod";

const Input = z.object({ text: z.string().min(10) });

export async function POST(req: Request) {
  const { profile } = await requireAuthedProfile();
  const parsed = Input.safeParse(await req.json());
  if (!parsed.success) return new Response("Bad Request", { status: 400 });

  // TODO: Implement actual redline logic with OpenAI
  const comments = [{ pos: 0, len: 60, note: "Lead with quantified impact; trim passive voice." }];
  const suggestions = ["Tighten goal to one sentence", "Remove filler adverbs", "Clarify short- vs long-term path"];

  return Response.json({ comments, suggestions });
} 