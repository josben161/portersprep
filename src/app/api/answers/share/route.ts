import { NextRequest } from "next/server";
import { requireAuthedProfile } from "@/lib/authz";
import { getAdminSupabase } from "@/lib/supabaseAdmin";
import { newToken, hashPasscode } from "@/lib/share";

export async function POST(req: NextRequest) {
  const { profile } = await requireAuthedProfile();
  const sb = getAdminSupabase();
  const { answer_id, role = "editor", expires_at, passcode } = await req.json();
  if (!answer_id) return new Response("Missing answer_id", { status: 400 });

  // Verify ownership
  const { data: ans } = await sb
    .from("application_answers")
    .select("id, application_id")
    .eq("id", answer_id)
    .single();
  if (!ans) return new Response("Not found", { status: 404 });

  const { data: app } = await sb
    .from("applications")
    .select("user_id")
    .eq("id", ans.application_id)
    .single();
  if (!app || (app as any).user_id !== profile.id)
    return new Response("Not found", { status: 404 });

  const token = newToken(24);
  const { data, error } = await sb
    .from("answer_share_links")
    .insert({
      answer_id,
      token,
      role,
      expires_at: expires_at ?? null,
      passcode_hash: hashPasscode(passcode ?? null),
      created_by: profile.id,
    })
    .select("token")
    .single();
  if (error) return new Response(error.message, { status: 400 });

  return Response.json({
    token: data.token,
    url: `${process.env.NEXT_PUBLIC_APP_URL}/share/${data.token}`,
  });
}
