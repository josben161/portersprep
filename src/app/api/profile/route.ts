import { NextRequest } from "next/server";
import { requireAuthedProfile } from "@/lib/authz";
import { getAdminSupabase } from "@/lib/supabaseAdmin";

export async function GET() {
  try {
    const { profile } = await requireAuthedProfile();
    const sb = getAdminSupabase();

    // Query with basic fields first
    const { data, error } = await sb
      .from("profiles")
      .select("id, name, email, subscription_tier")
      .eq("id", profile.id)
      .single();

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

    // Try to get additional fields if they exist
    let additionalFields: any = {};
    try {
      const { data: extendedData } = await sb
        .from("profiles")
        .select("resume_key, resume_filename, resume_analysis, goals, industry, years_exp, gpa, gmat")
        .eq("id", profile.id)
        .single();

      if (extendedData) {
        additionalFields = extendedData;
      }
    } catch (extendedError) {
      console.log("Extended fields not available yet:", extendedError);
      // Continue with basic fields only
    }

    // Return with defaults for missing fields
    return Response.json({
      id: data.id,
      name: data.name || "",
      email: data.email || "",
      subscription_tier: data.subscription_tier || "free",
      resume_key: additionalFields.resume_key || null,
      resume_filename: additionalFields.resume_filename || null,
      resume_analysis: additionalFields.resume_analysis || null,
      goals: additionalFields.goals || "",
      industry: additionalFields.industry || "",
      years_exp: additionalFields.years_exp || null,
      gpa: additionalFields.gpa || null,
      gmat: additionalFields.gmat || null,
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

    // Only update fields that we know exist
    const updates: any = {};
    const safeFields = ["name", "resume_key"]; // Start with fields we know exist

    // Try to include additional fields if they exist
    const additionalFields = ["goals", "industry", "years_exp", "gpa", "gmat", "resume_filename"];

    for (const k of [...safeFields, ...additionalFields]) {
      if (k in body) {
        updates[k] = body[k];
      }
    }

    if (Object.keys(updates).length === 0) {
      return Response.json({ ok: true });
    }

    const sb = getAdminSupabase();

    // Try to update with all fields first
    let { error } = await sb
      .from("profiles")
      .update(updates)
      .eq("id", profile.id);

    // If that fails, try updating only safe fields
    if (error) {
      console.log("Full update failed, trying safe fields only:", error);
      const safeUpdates: any = {};
      for (const k of safeFields) {
        if (k in body) safeUpdates[k] = body[k];
      }

      if (Object.keys(safeUpdates).length > 0) {
        const { error: safeError } = await sb
          .from("profiles")
          .update(safeUpdates)
          .eq("id", profile.id);

        if (safeError) {
          console.error("Safe update also failed:", safeError);
          return new Response("Update failed", { status: 500 });
        }
      }
    }

    return Response.json({ ok: true });
  } catch (error) {
    console.error("Profile PUT error:", error);
    return new Response("Profile error", { status: 500 });
  }
}
