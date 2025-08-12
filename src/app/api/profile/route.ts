import { NextRequest } from "next/server";
import { requireAuthedProfile } from "@/lib/authz";
import { getAdminSupabase } from "@/lib/supabaseAdmin";

export async function GET() {
  try {
    const { profile } = await requireAuthedProfile();
    const sb = getAdminSupabase();
    
    // Simple query that works regardless of column existence
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
        goals: "",
        industry: "",
        years_exp: null,
        gpa: null,
        gmat: null
      });
    }

    // Return with defaults for missing fields
    return Response.json({
      id: data.id,
      name: data.name || "",
      email: data.email || "",
      subscription_tier: data.subscription_tier || "free",
      resume_key: null, // Will be added by migration
      goals: "",
      industry: "",
      years_exp: null,
      gpa: null,
      gmat: null
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
    
    // Only update basic fields for now
    const updates: any = {};
    for (const k of ["name"]) {
      if (k in body) updates[k] = body[k];
    }
    
    if (Object.keys(updates).length === 0) {
      return Response.json({ ok: true });
    }
    
    const sb = getAdminSupabase();
    const { error } = await sb
      .from("profiles")
      .update(updates)
      .eq("id", profile.id);
      
    if (error) {
      console.error("Profile update error:", error);
      return new Response("Update failed", { status: 500 });
    }
    
    return Response.json({ ok: true });
  } catch (error) {
    console.error("Profile PUT error:", error);
    return new Response("Profile error", { status: 500 });
  }
} 