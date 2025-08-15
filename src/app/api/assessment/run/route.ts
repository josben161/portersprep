import { z } from "zod";
import { requireAuthedProfile } from "@/lib/authz";
import { getAdminSupabase } from "@/lib/supabaseAdmin";
import { getQuotaSnapshot, assertWithinLimit, logAiUse } from "@/lib/quota";
import { callGateway } from "@/lib/ai";

const Intake = z.object({
  resumeText: z.string().min(50, "Provide at least a short resume summary"),
  gmat: z.number().int().min(400).max(800).optional(),
  gre: z
    .object({
      verbal: z.number().optional(),
      quant: z.number().optional(),
      aw: z.number().optional(),
    })
    .optional(),
  gpa: z.number().min(0).max(4).optional(),
  yearsExp: z.number().min(0).max(40).optional(),
  industry: z.string().optional(),
  roles: z.array(z.string()).optional(),
  targetSchools: z.array(z.string()).min(1),
  goals: z.string().min(10),
  constraints: z.string().optional(),
});

export async function POST(req: Request) {
  const { profile, clerkUserId } = await requireAuthedProfile();
  const body = await req.json();
  const input = Intake.parse(body);

  const snap = await getQuotaSnapshot(clerkUserId);
  try {
    assertWithinLimit("ai_calls", snap);
  } catch (e) {
    if (e instanceof Response) return e;
    throw e;
  }

  const prompt = `
You are an MBA admissions strategist. Provide a concise, school-aware assessment.

CANDIDATE:
Resume: ${input.resumeText}
GMAT: ${input.gmat ?? "n/a"}  GRE: ${JSON.stringify(input.gre ?? {})}
GPA: ${input.gpa ?? "n/a"}   Exp: ${input.yearsExp ?? "n/a"} years
Industry/Roles: ${input.industry ?? ""} | ${(input.roles ?? []).join(", ")}
Goals: ${input.goals}
Constraints: ${input.constraints ?? "none"}

TARGET SCHOOLS: ${input.targetSchools.join(", ")}

Return JSON with:
- "schools": [{ "school": "<name>", "band": "reach|target|safety", "notes": "<1-3 bullets>" }]
- "overall": { "strengths": ["..."], "risks": ["..."], "strategy": ["..."] }
  `.trim();

  const { content } = await callGateway("predict", {
    userId: profile.id,
    params: {
      resumeText: input.resumeText,
      gmat: input.gmat,
      gre: input.gre,
      gpa: input.gpa,
      yearsExp: input.yearsExp,
      industry: input.industry,
      roles: input.roles,
      targetSchools: input.targetSchools,
      goals: input.goals,
      constraints: input.constraints,
    },
  });

  let parsed: any;
  try {
    parsed = JSON.parse(content);
  } catch {
    parsed = {
      schools: [],
      overall: { strengths: [], risks: [], strategy: [] },
    };
  }

  const sb = getAdminSupabase();
  const { error } = await sb.from("assessments").insert({
    user_id: profile.id,
    inputs: input,
    result: parsed,
  });
  if (error) return new Response(error.message, { status: 400 });

  await logAiUse(profile.id, "ai_analyze");
  return Response.json(parsed);
}
