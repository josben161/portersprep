import { NextRequest } from "next/server";
import { requireAuthedProfile } from "@/lib/authz";
import { getAdminSupabase } from "@/lib/supabaseAdmin";

export async function GET() {
  const { profile } = await requireAuthedProfile();
  const sb = getAdminSupabase();
  const { data, error } = await sb
    .from("recommenders")
    .select("id,name,email,relationship,created_at")
    .eq("user_id", profile.id)
    .order("created_at",{ascending:false});
  if (error) return new Response(error.message, { status: 400 });
  return Response.json(data ?? []);
}

export async function POST(req: NextRequest) {
  const { profile } = await requireAuthedProfile();
  const { name, email, relationship } = await req.json();
  if (!name) return new Response("Name required", { status: 400 });
  const sb = getAdminSupabase();
  const { data, error } = await sb
    .from("recommenders")
    .insert({ user_id: profile.id, name, email: email ?? null, relationship: relationship ?? null })
    .select("id,name,email,relationship")
    .single();
  if (error) return new Response(error.message, { status: 400 });
  return Response.json(data);
} 