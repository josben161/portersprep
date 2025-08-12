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
  try {
    const { profile } = await requireAuthedProfile();
    const sb = getAdminSupabase();

    console.log("Starting prediction for user:", profile.id);

    // Load profile data
    const { data: prof, error: profileError } = await sb.from("profiles")
      .select("name, goals, industry, years_exp, gpa, gmat, resume_key")
      .eq("id", profile.id)
      .single();
      
    if (profileError) {
      console.error("Profile fetch error:", profileError);
      return new Response(`Failed to load profile: ${profileError.message}`, { status: 500 });
    }

    if (!prof) {
      return new Response("Profile not found", { status: 404 });
    }

    console.log("Profile loaded:", { name: prof.name, industry: prof.industry });

    // Load stories
    const { data: stories, error: storiesError } = await sb.from("anchor_stories")
      .select("title, summary")
      .eq("user_id", profile.id)
      .limit(8);
      
    if (storiesError) {
      console.error("Stories fetch error:", storiesError);
      // Continue without stories
    }

    console.log("Stories loaded:", stories?.length || 0);

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
    
    console.log("Generated prediction with", result.schools.length, "schools");

    // Insert assessment record
    const { data: assessment, error: insertError } = await sb.from("assessments").insert({
      user_id: profile.id, 
      inputs, 
      result
    }).select("id").single();
    
    if (insertError) {
      console.error("Assessment insert error:", insertError);
      
      // Try to provide more helpful error messages
      if (insertError.code === '42501') {
        return new Response("Database permission error. Please contact support.", { status: 500 });
      } else if (insertError.code === '23505') {
        return new Response("Duplicate assessment detected.", { status: 409 });
      } else {
        return new Response(`Failed to save prediction: ${insertError.message}`, { status: 500 });
      }
    }

    console.log("Assessment saved successfully:", assessment?.id);

    return Response.json({ 
      ok: true, 
      assessment_id: assessment?.id,
      message: "Prediction completed successfully"
    });
    
  } catch (error) {
    console.error("Predict/run API error:", error);
    
    if (error instanceof Error) {
      return new Response(`Prediction failed: ${error.message}`, { status: 500 });
    } else {
      return new Response("An unexpected error occurred", { status: 500 });
    }
  }
} 