import { requireAuthedProfile } from "@/lib/authz";
import { getAdminSupabase } from "@/lib/supabaseAdmin";

export async function POST(req: Request) {
  const { profile } = await requireAuthedProfile();
  const body = await req.json();
  const { application_id, title, prompt, word_limit } = body || {};
  if (!application_id || !title)
    return new Response("Missing application_id or title", { status: 400 });

  const sb = getAdminSupabase();
  const { data: app } = await sb
    .from("applications")
    .select("id,user_id")
    .eq("id", application_id)
    .single();
  if (!app || app.user_id !== profile.id)
    return new Response("Not found", { status: 404 });

  const { data, error } = await sb
    .from("application_answers")
    .insert({
      application_id,
      title,
      prompt,
      word_limit,
      body: null,
      content_key: null,
    })
    .select("id")
    .single();
  if (error) return new Response(error.message, { status: 400 });

  return Response.json({ id: data.id });
}
