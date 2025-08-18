import { NextRequest } from "next/server";
import { requireAuthedProfile } from "@/lib/authz";
import { getAdminSupabase } from "@/lib/supabaseAdmin";

export async function PUT(req: NextRequest) {
  const { profile } = await requireAuthedProfile();
  const { key } = await req.json();
  if (!key) return new Response("key required", { status: 400 });
  const sb = getAdminSupabase();
  const { error } = await sb.from("profiles").update({ resume_key: key }).eq("id", profile.id);
  if (error) return new Response(error.message, { status: 400 });
  return Response.json({ ok: true });
}
