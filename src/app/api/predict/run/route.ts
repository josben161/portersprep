import { requireAuthedProfile } from "@/lib/authz";
import { getAdminSupabase } from "@/lib/supabaseAdmin";

export async function POST() {
  const { profile } = await requireAuthedProfile();
  const sb = getAdminSupabase();

  const { data: prof } = await sb.from("profiles")
    .select("name, goals, industry, years_exp, gpa, gmat, resume_key").eq("id", profile.id).single();
  const { data: stories } = await sb.from("anchor_stories")
    .select("title, summary").eq("user_id", profile.id).limit(8);

  const inputs = {
    resumeKey: prof?.resume_key ?? null,
    gmat: prof?.gmat ?? null,
    gpa: prof?.gpa ?? null,
    yearsExp: prof?.years_exp ?? null,
    industry: prof?.industry ?? null,
    goals: prof?.goals ?? "",
    stories: (stories ?? []).map(s => ({ title: s.title, summary: s.summary ?? "" })),
  };

  // Call the assessment/run route via DB logic (reuse your existing server code).
  // Here we directly insert a row with mock result if your existing route handles AI.
  const result = { schools: [] }; // Keep empty; your /api/assessment/run likely builds it.
  const { error } = await sb.from("assessments").insert({
    user_id: profile.id, inputs, result
  });
  if (error) return new Response(error.message, { status: 400 });

  return Response.json({ ok: true });
} 