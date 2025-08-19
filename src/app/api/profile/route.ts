import { requireAuthedProfile } from "@/lib/authz";
import { getAdminSupabase } from "@/lib/supabaseAdmin";

export async function GET() {
  try {
    console.log("Profile API: GET request received");
    const { profile } = await requireAuthedProfile();
    console.log(`Profile API: Returning profile for user ${profile.id}`);
    return Response.json({ profile });
  } catch (e: any) {
    console.error("Profile API: Error in GET:", e);
    return new Response(`Profile API error: ${e?.message || "unknown"}`, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    console.log("Profile API: PUT request received");
    const { profile } = await requireAuthedProfile();
    const patch = await req.json();
    console.log(`Profile API: Updating profile for user ${profile.id}`, patch);

    // Only allow safe fields present in the new schema
    const safe = {
      name: patch.name ?? undefined,
      years_exp: patch.years_exp ?? undefined,
      industry: patch.industry ?? undefined,
      goals: patch.goals ?? undefined,
      gpa: patch.gpa ?? undefined,
      gmat: patch.gmat ?? undefined,
      undergrad: patch.undergrad ?? undefined,
      citizenship: patch.citizenship ?? undefined,
      // resume_key is set via S3 upload route separately
    };

    const sb = getAdminSupabase();
    const { data, error } = await sb
      .from("profiles")
      .update(safe)
      .eq("id", profile.id)
      .select()
      .single();

    if (error) {
      console.error("Profile API: Error updating profile:", error);
      throw error;
    }
    
    console.log(`Profile API: Successfully updated profile for user ${profile.id}`);
    return Response.json({ profile: data });
  } catch (e: any) {
    console.error("Profile API: Error in PUT:", e);
    // previous error complained about resume_text (no longer included here)
    return new Response(`Full update failed: ${e?.message || "unknown"}`, { status: 400 });
  }
}
