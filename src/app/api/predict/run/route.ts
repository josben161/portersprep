import { requireAuthedProfile } from "@/lib/authz";
import { getAdminSupabase } from "@/lib/supabaseAdmin";

// Mock school data for demonstration
const MOCK_SCHOOLS = [
  { name: "Harvard Business School", band: "reach" },
  { name: "Stanford Graduate School of Business", band: "reach" },
  { name: "The Wharton School", band: "target" },
  { name: "MIT Sloan School of Management", band: "target" },
  { name: "Columbia Business School", band: "target" },
  { name: "Chicago Booth School of Business", band: "target" },
  { name: "Kellogg School of Management", band: "safety" },
  { name: "Tuck School of Business", band: "safety" },
  { name: "Ross School of Business", band: "safety" },
  { name: "Darden School of Business", band: "safety" }
];

function generateMockPrediction(profile: any) {
  // Generate realistic confidence scores based on profile data
  const baseConfidence = 0.6;
  let confidenceBoost = 0;
  
  // Boost confidence based on profile completeness
  if (profile?.gpa && profile.gpa >= 3.5) confidenceBoost += 0.1;
  if (profile?.gmat && profile.gmat >= 700) confidenceBoost += 0.15;
  if (profile?.years_exp && profile.years_exp >= 3) confidenceBoost += 0.05;
  if (profile?.resume_key) confidenceBoost += 0.05;
  
  const schools = MOCK_SCHOOLS.map(school => ({
    school: school.name,
    band: school.band,
    confidence: Math.min(0.95, baseConfidence + confidenceBoost + (Math.random() * 0.2 - 0.1))
  }));
  
  // Sort by confidence (highest first)
  schools.sort((a, b) => b.confidence - a.confidence);
  
  return { schools };
}

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

  // Generate mock prediction result
  const result = generateMockPrediction(prof);
  
  const { error } = await sb.from("assessments").insert({
    user_id: profile.id, inputs, result
  });
  if (error) return new Response(error.message, { status: 400 });

  return Response.json({ ok: true });
} 