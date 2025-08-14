import { NextRequest } from "next/server";
import { requireAuthedProfile } from "@/lib/authz";
import { getAdminSupabase } from "@/lib/supabaseAdmin";

export async function POST(req: NextRequest) {
  const { profile } = await requireAuthedProfile();
  const { recommender_id, application_id } = await req.json();
  if (!recommender_id || !application_id)
    return new Response("Missing fields", { status: 400 });

  const sb = getAdminSupabase();

  // Verify ownership of application
  const { data: app } = await sb
    .from("applications")
    .select("id,user_id")
    .eq("id", application_id)
    .single();
  if (!app || app.user_id !== profile.id)
    return new Response("Not found", { status: 404 });

  // Verify recommender belongs to user
  const { data: rec } = await sb
    .from("recommenders")
    .select("id,user_id")
    .eq("id", recommender_id)
    .single();
  if (!rec || rec.user_id !== profile.id)
    return new Response("Not found", { status: 404 });

  // Upsert (prevent duplicate)
  const { data, error } = await sb
    .from("recommender_assignments")
    .insert({ recommender_id, application_id })
    .select("id,recommender_id,application_id,status")
    .single();
  if (error) return new Response(error.message, { status: 400 });
  return Response.json(data);
}

export async function PATCH(req: Request) {
  const { profile } = await requireAuthedProfile();
  const { id, status, form_url, notes } = await req.json();
  const sb = getAdminSupabase();
  const { data, error } = await sb
    .from("recommender_assignments")
    .update({ status, form_url, notes })
    .eq("id", id)
    .eq("user_id", profile.id)
    .select("*")
    .single();
  if (error)
    return new Response((error as any).message ?? "Update error", {
      status: 400,
    });
  return Response.json(data);
}
