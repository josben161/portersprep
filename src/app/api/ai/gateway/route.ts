import { NextRequest, NextResponse } from "next/server";
// eslint-disable-next-line no-restricted-syntax
import OpenAI from "openai";
import { getContext } from "@/lib/context";
import { z } from "zod";

const GatewaySchema = z.object({
  userId: z.string().uuid().or(z.string().min(3)),
  mode: z.enum(["coach", "predict", "resume", "recommender"]),
  params: z.unknown().optional(),
});

export const runtime = "nodejs";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

// Rate limiting
const WINDOW_MS = 5 * 60 * 1000;
const MAX_REQ = 30;
const bucket = new Map<string, { ts: number[] }>();

function rateLimit(userId: string) {
  const now = Date.now();
  const b = bucket.get(userId) ?? { ts: [] };
  b.ts = b.ts.filter((t) => now - t < WINDOW_MS);
  if (b.ts.length >= MAX_REQ) return false;
  b.ts.push(now);
  bucket.set(userId, b);
  return true;
}

function buildScope(mode: string, params: any) {
  if (mode === "resume") return { profile: true };
  if (mode === "predict") return { profile: true, schools: true };
  if (mode === "recommender") {
    return {
      applications: { applicationId: params?.applicationId },
      recommendations: { applicationId: params?.applicationId },
    };
  }
  return { profile: true, applications: true, essays: true, memory: true }; // coach
}

function buildPrompt(mode: string, ctx: any, params: any) {
  if (mode === "predict") {
    return {
      system:
        "You estimate MBA admission likelihood per school and produce a prioritized action plan.",
      user: JSON.stringify({
        profile: ctx.profile,
        stats: (ctx.schools ?? []).flatMap((s: any) =>
          (s.school_cycle_stats ?? []).map((st: any) => ({
            school: s.name,
            cycle_year: st.cycle_year,
            avg_gmat: st.avg_gmat,
            avg_gpa: st.avg_gpa,
          })),
        ),
        params,
      }),
    };
  }
  if (mode === "resume") {
    return {
      system: `You are an MBA resume evaluator. You MUST return ONLY a valid JSON object, nothing else.

Analyze the provided resume and return a JSON object with this EXACT structure:
{
  "summary": "Brief overview of the candidate",
  "strengths": ["strength1", "strength2", "strength3"],
  "weaknesses": ["weakness1", "weakness2"],
  "recommendations": ["recommendation1", "recommendation2", "recommendation3"],
  "mbaReadiness": {
    "fit_score": 85,
    "comments": "Assessment of MBA readiness"
  },
  "experience": {
    "years": 5,
    "leadership": true,
    "international": false
  },
  "education": {
    "major": "Computer Science",
    "institution": "University of Example",
    "gpa": 3.8
  }
}

CRITICAL: Return ONLY the JSON object. No explanations, no markdown, no additional text. Just the JSON starting with { and ending with }.`,
      user: JSON.stringify({ 
        profile: ctx.profile,
        resumeText: ctx.profile?.resume_text || "No resume text available"
      }),
    };
  }
  if (mode === "recommender") {
    return {
      system:
        "You help generate recommender guidance based on candidate strengths and app context.",
      user: JSON.stringify({
        recommendations: ctx.recommendations,
        applications: ctx.applications,
      }),
    };
  }
  return {
    system: "You are the Admit Architect coach.",
    user: JSON.stringify({
      profile: ctx.profile,
      apps: ctx.applications,
      essays: ctx.essays,
      progress: ctx.progress,
    }),
  };
}

export async function POST(req: NextRequest) {
  const traceId = `gw_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  const started = Date.now();
  try {
    const body = await req.json();
    const parsed = GatewaySchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.flatten(), traceId },
        { status: 400 },
      );
    }
    const { userId, mode, params } = parsed.data;
    if (!rateLimit(userId)) {
      return NextResponse.json(
        { error: "rate_limited", traceId },
        { status: 429 },
      );
    }

    const scope = buildScope(mode, params);
    const ctx = await getContext(userId, scope);
    const { system, user } = buildPrompt(mode, ctx, params);

    const resp = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.2,
      response_format: mode === "resume" ? { type: "json_object" } : undefined,
      messages: [
        { role: "system", content: system },
        { role: "user", content: user },
      ],
    });

    const ms = Date.now() - started;
    console.info("[ai-gateway] success", {
      traceId,
      mode,
      userId,
      ms,
      model: "gpt-4o-mini",
      usage: resp.usage,
    });

    return NextResponse.json({
      content: resp.choices?.[0]?.message?.content ?? "",
      usage: resp.usage,
      traceId,
    });
  } catch (e: any) {
    const ms = Date.now() - started;
    console.error("[ai-gateway] error", {
      traceId,
      error: e?.message,
      stack: e?.stack,
      ms,
    });
    return NextResponse.json(
      { error: "internal_error", traceId },
      { status: 500 },
    );
  }
}
