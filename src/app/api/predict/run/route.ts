import { NextRequest, NextResponse } from "next/server";
import { requireAuthedProfile } from "@/lib/authz";
import { getAdminSupabase } from "@/lib/supabaseAdmin";
import { getQuotaSnapshot, assertWithinLimit, logAiUse } from "@/lib/quota";
import { aiContextManager } from "@/lib/ai-context-manager";

export async function POST(req: NextRequest) {
  try {
    const { profile, clerkUserId } = await requireAuthedProfile();

    // Check quota
    const snap = await getQuotaSnapshot(clerkUserId);
    try {
      assertWithinLimit("ai_calls", snap);
    } catch (e) {
      if (e instanceof Response) return e;
      throw e;
    }

    // Get user context using AI context manager
    const userContext = await aiContextManager.getUserContext(profile.id);

    // Check if we have sufficient context for prediction
    const hasResume = userContext.resume?.resume_analysis || userContext.profile?.resume_key;
    const hasProfile = userContext.profile?.gmat || userContext.profile?.gpa || userContext.profile?.years_experience;
    const hasApplications = userContext.applications && userContext.applications.length > 0;
    const hasEssays = userContext.essays && userContext.essays.length > 0;

    // Determine if we have sufficient context
    const profileCompleteness = userContext.progress?.completeness || 0;
    const hasSufficientContext = profileCompleteness >= 50 && (hasResume || hasProfile);

    if (!hasSufficientContext) {
      return NextResponse.json({
        error: "insufficient_context",
        message: "Please complete your profile and upload your resume to get accurate predictions.",
        profileCompleteness,
        missing: {
          resume: !hasResume,
          profile: !hasProfile,
          applications: !hasApplications,
          essays: !hasEssays
        }
      }, { status: 400 });
    }

    // Extract target schools from applications or use default top schools
    const targetSchools = userContext.applications
      ?.map(app => app.schools?.name)
      .filter(Boolean) || [
        "Harvard Business School",
        "Stanford Graduate School of Business", 
        "The Wharton School",
        "MIT Sloan School of Management",
        "Columbia Business School"
      ];

    // Build comprehensive prompt using context
    const prompt = `
You are an MBA admissions strategist. Provide a comprehensive, data-driven assessment based on the candidate's complete profile.

CANDIDATE PROFILE:
${userContext.profile?.gmat ? `GMAT: ${userContext.profile.gmat}` : ''}
${userContext.profile?.gpa ? `GPA: ${userContext.profile.gpa}` : ''}
${userContext.profile?.years_experience ? `Experience: ${userContext.profile.years_experience} years` : ''}
${userContext.profile?.industry ? `Industry: ${userContext.profile.industry}` : ''}
${userContext.profile?.current_role ? `Current Role: ${userContext.profile.current_role}` : ''}

RESUME ANALYSIS:
${userContext.resume?.resume_analysis ? JSON.stringify(userContext.resume.resume_analysis, null, 2) : 'No resume analysis available'}

APPLICATIONS & ESSAYS:
${userContext.applications?.length ? `Number of applications: ${userContext.applications.length}` : 'No applications yet'}
${userContext.essays?.length ? `Number of essays: ${userContext.essays.length}` : 'No essays yet'}

PROGRESS METRICS:
Profile Completeness: ${profileCompleteness}%
${userContext.progress ? JSON.stringify(userContext.progress, null, 2) : ''}

TARGET SCHOOLS: ${targetSchools.join(", ")}

Based on this comprehensive profile, provide a detailed assessment with:
- "schools": [{ "school": "<name>", "band": "reach|target|safety", "confidence": <0-100>, "notes": "<2-3 specific bullets>" }]
- "overall": { "strengths": ["..."], "risks": ["..."], "strategy": ["..."], "next_steps": ["..."] }

Be specific and reference actual data points from their profile. Consider their GMAT/GPA, experience, industry background, and application progress.
`.trim();

    const r = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY!}`,
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "Respond with strictly valid JSON. No markdown. Be specific and actionable in your assessment.",
          },
          { role: "user", content: prompt },
        ],
        temperature: 0.3,
      }),
    });

    const j = await r.json();
    let parsed: any;
    try {
      parsed = JSON.parse(j.choices?.[0]?.message?.content ?? "{}");
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
        profile_completeness: profileCompleteness,
        target_schools: targetSchools,
        has_resume: !!hasResume,
        has_profile: !!hasProfile,
        has_applications: !!hasApplications,
        has_essays: !!hasEssays
      },
      result: parsed,
    });

    if (error) {
      console.error("Error storing assessment:", error);
      return NextResponse.json({ error: "Failed to store prediction" }, { status: 500 });
    }

    await logAiUse(profile.id, "ai_analyze");
    return NextResponse.json(parsed);

  } catch (error) {
    console.error("Prediction error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
