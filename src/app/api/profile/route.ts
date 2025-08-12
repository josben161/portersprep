import { NextRequest } from "next/server";
import { requireAuthedProfile } from "@/lib/authz";
import { getAdminSupabase } from "@/lib/supabaseAdmin";

export async function GET() {
  const { profile } = await requireAuthedProfile();
  const sb = getAdminSupabase();
  const { data, error } = await sb
    .from("profiles")
    .select("id, name, email, subscription_tier, resume_key, goals, industry, years_exp, gpa, gmat")
    .eq("id", profile.id)
    .single();
  if (error) return new Response(error.message, { status: 400 });
  return Response.json(data);
}

export async function PUT(req: NextRequest) {
  const { profile } = await requireAuthedProfile();
  const body = await req.json().catch(()=> ({}));
  const updates: any = {};
  for (const k of ["name","goals","industry","years_exp","gpa","gmat","resume_key"]) {
    if (k in body) updates[k] = body[k];
  }
  const sb = getAdminSupabase();
  const { error } = await sb.from("profiles").update(updates).eq("id", profile.id);
  if (error) return new Response(error.message, { status: 400 });
  return Response.json({ ok: true });
} 