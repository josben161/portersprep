import { requireAuthedProfile } from "@/lib/authz";
import { getAdminSupabase } from "@/lib/supabaseAdmin";

export async function GET() {
  try {
    const { profile } = await requireAuthedProfile();
    return Response.json({ profile });
  } catch (e: any) {
    return new Response(`Profile API error: ${e?.message || "unknown"}`, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const { profile } = await requireAuthedProfile();
    const patch = await req.json();

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

    if (error) throw error;
    return Response.json({ profile: data });
  } catch (e: any) {
    // previous error complained about resume_text (no longer included here)
    return new Response(`Full update failed: ${e?.message || "unknown"}`, { status: 400 });
  }
}
