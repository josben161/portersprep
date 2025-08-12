import { auth } from "@clerk/nextjs/server";
import { z } from "zod";
import { getOrCreateProfileByClerkId, createAssessment } from "@/lib/db";

const Input = z.object({
  resumeText: z.string().min(50),
  scores: z.object({ gmat: z.number().optional(), gre: z.object({ v: z.number(), q: z.number() }).optional() }).optional(),
  targets: z.array(z.string()).min(1),
  goals: z.string().min(10),
  constraints: z.string().optional()
});

export async function POST(req: Request) {
  const { userId } = auth();
  if (!userId) return new Response("Unauthorized", { status: 401 });

  const parsed = Input.safeParse(await req.json());
  if (!parsed.success) return new Response("Bad Request", { status: 400 });

  const profile = await getOrCreateProfileByClerkId(userId);
  // TODO: call your AI logic here to compute `result`
  const result = {
    bands: { "Example MBA": "20–30%" },
    angles: ["Impact + quant spike"],
    gaps: ["Clarify leadership scope"],
    timeline: ["Book a mock interview in 3 weeks"]
  };

  const id = await createAssessment(profile.id, parsed.data, result);
  return Response.json({ assessmentId: id });
} 