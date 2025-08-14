import { NextRequest } from "next/server";
import { requireAuthedProfile } from "@/lib/authz";
import { getAdminSupabase } from "@/lib/supabaseAdmin";

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  const { profile } = await requireAuthedProfile();
  const { status } = await req.json();
  if (!["invited", "drafting", "submitted"].includes(status)) {
    return new Response("Invalid status", { status: 400 });
  }

  const sb = getAdminSupabase();

  // Ensure assignment belongs to user's application
  const { data: row } = await sb
    .from("recommender_assignments")
    .select("id,application_id")
    .eq("id", params.id)
    .single();
  if (!row) return new Response("Not found", { status: 404 });

  const { data: app } = await sb
    .from("applications")
    .select("user_id")
    .eq("id", row.application_id)
    .single();
  if (!app || app.user_id !== profile.id)
    return new Response("Not found", { status: 404 });

  const { error } = await sb
    .from("recommender_assignments")
    .update({ status })
    .eq("id", params.id);
  if (error) return new Response(error.message, { status: 400 });
  return Response.json({ ok: true });
}
