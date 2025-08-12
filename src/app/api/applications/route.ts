import { NextRequest } from "next/server";
import { getAdminSupabase } from "@/lib/supabaseAdmin";
import { requireAuthedProfile } from "@/lib/authz";

export async function GET() {
  const { profile } = await requireAuthedProfile();
  const sb = getAdminSupabase();
  const { data, error } = await sb
    .from("applications")
    .select("id, status, school_id, school:schools(id,name,deadline)")
    .eq("user_id", profile.id)
    .order("created_at", { ascending: false });
  if (error) return new Response(error.message, { status: 400 });
  return Response.json(data ?? []);
}

export async function POST(req: NextRequest) {
  const { profile } = await requireAuthedProfile();
  const body = await req.json().catch(()=> ({}));
  const { school_id, round, deadline } = body || {};
  if (!school_id) return new Response("school_id required", { status: 400 });

  const sb = getAdminSupabase();
  const { data, error } = await sb.from("applications").insert({
    user_id: profile.id, school_id, round: round ?? null, status: "planning", deadline: deadline ?? null
  }).select("id").single();
  if (error) return new Response(error.message, { status: 400 });
  return Response.json(data);
} 