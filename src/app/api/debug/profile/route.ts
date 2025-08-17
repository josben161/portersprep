import { NextRequest } from "next/server";
import { requireAuthedProfile } from "@/lib/authz";
import { getAdminSupabase } from "@/lib/supabaseAdmin";

export async function GET() {
  try {
    const { profile } = await requireAuthedProfile();
    const sb = getAdminSupabase();

    console.log("Debug: Profile ID:", profile.id);

    // Query with basic fields first
    const { data, error } = await sb
      .from("profiles")
      .select("*")
      .eq("id", profile.id)
      .single();

    console.log("Debug: Basic query result:", { data, error });

    if (error) {
      console.error("Debug: Profile fetch error:", error);
      return Response.json({ error: error.message, profileId: profile.id });
    }

    return Response.json({
      profileId: profile.id,
      rawData: data,
      hasName: !!data.name,
      hasGoals: !!data.goals,
      hasIndustry: !!data.industry,
      hasYearsExp: !!data.years_exp,
      hasGpa: !!data.gpa,
      hasGmat: !!data.gmat,
      hasResumeKey: !!data.resume_key,
    });
  } catch (error) {
    console.error("Debug: Profile API error:", error);
    return new Response("Profile error", { status: 500 });
  }
}
