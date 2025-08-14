import { NextRequest } from "next/server";
import { requireAuthedProfile } from "@/lib/authz";
import { getAdminSupabase } from "@/lib/supabaseAdmin";

export async function GET() {
  try {
    const { profile } = await requireAuthedProfile();
    const sb = getAdminSupabase();

    // Try to get all fields in one query, with fallback for missing columns
    let data: any = {};
    let error: any = null;

    try {
      // Try with all fields first
      const result = await sb
        .from("profiles")
        .select("id, name, email, subscription_tier, resume_key, resume_filename, resume_analysis, goals, industry, years_exp, gpa, gmat")
        .eq("id", profile.id)
        .single();
      
      data = result.data;
      error = result.error;
    } catch (queryError) {
      console.log("Full query failed, trying basic fields:", queryError);
      
      // Fallback to basic fields only
      const result = await sb
        .from("profiles")
        .select("id, name, email, subscription_tier")
        .eq("id", profile.id)
        .single();
      
      data = result.data;
      error = result.error;
    }

    if (error) {
      console.error("Profile fetch error:", error);
      // Return default profile if not found
      return Response.json({
        id: profile.id,
        name: "",
        email: "",
        subscription_tier: "free",
        resume_key: null,
        resume_filename: null,
        resume_analysis: null,
        goals: "",
        industry: "",
        years_exp: null,
        gpa: null,
        gmat: null,
      });
    }

    // Return with defaults for missing fields
    return Response.json({
      id: data.id,
      name: data.name || "",
      email: data.email || "",
      subscription_tier: data.subscription_tier || "free",
      resume_key: data.resume_key || null,
      resume_filename: data.resume_filename || null,
      resume_analysis: data.resume_analysis || null,
      goals: data.goals || "",
      industry: data.industry || "",
      years_exp: data.years_exp || null,
      gpa: data.gpa || null,
      gmat: data.gmat || null,
    });
  } catch (error) {
    console.error("Profile API error:", error);
    return new Response("Profile error", { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const { profile } = await requireAuthedProfile();
    const body = await req.json().catch(() => ({}));

    if (Object.keys(body).length === 0) {
      return Response.json({ ok: true });
    }

    const sb = getAdminSupabase();

    // Try to update with all fields first
    let { error } = await sb
      .from("profiles")
      .update(body)
      .eq("id", profile.id);

    // If that fails, try updating only safe fields
    if (error) {
      console.log("Full update failed, trying safe fields only:", error);
      const safeFields = ["name", "resume_key", "resume_filename"];
      const safeUpdates: any = {};
      
      for (const k of safeFields) {
        if (k in body) {
          safeUpdates[k] = body[k];
        }
      }

      if (Object.keys(safeUpdates).length > 0) {
        const { error: safeError } = await sb
          .from("profiles")
          .update(safeUpdates)
          .eq("id", profile.id);

        if (safeError) {
          console.error("Safe update also failed:", safeError);
          return new Response(safeError.message, { status: 400 });
        }
      }
    }

    return Response.json({ ok: true });
  } catch (error) {
    console.error("Profile PUT error:", error);
    return new Response("Profile error", { status: 500 });
  }
}
