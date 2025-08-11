// import { auth } from "@clerk/nextjs/server";
import { z } from "zod";

const Input = z.object({ text: z.string().min(10) });

export async function POST(req: Request) {
  // const { userId } = auth();
  // if (!userId) return new Response("Unauthorized", { status: 401 });
  const userId = "dummy-user-id"; // Temporary for build

  const parsed = Input.safeParse(await req.json());
  if (!parsed.success) return new Response("Bad Request", { status: 400 });

  const comments = [{ pos: 0, len: 60, note: "Lead with quantified impact; trim passive voice." }];
  const suggestions = ["Tighten goal to one sentence", "Remove filler adverbs", "Clarify short- vs long-term path"];

  return Response.json({ comments, suggestions });
} 