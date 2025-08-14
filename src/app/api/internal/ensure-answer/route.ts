import { auth, currentUser } from "@clerk/nextjs/server";
import { getOrCreateProfileByClerkId } from "@/lib/db";
import { getApplication } from "@/lib/apps";
import { getAdminSupabase } from "@/lib/supabaseAdmin";

export async function POST(req: Request) {
  const { userId } = auth();
  if (!userId) return new Response("Unauthorized", { status: 401 });
  const u = await currentUser();
  const p = await getOrCreateProfileByClerkId(
    userId,
    u?.emailAddresses?.[0]?.emailAddress,
    u?.firstName ?? undefined,
  );
  const body = await req.json(); // { appId, questionId, archetype }

  if (!body?.appId || !body?.questionId || !body?.archetype)
    return new Response("Bad Request", { status: 400 });

  const sb = getAdminSupabase();
  const app = await getApplication(body.appId);
  if (!app || app.user_id !== p.id)
    return new Response("Forbidden", { status: 403 });

  // Check if answer exists
  const { data: existing } = await sb
    .from("application_answers")
    .select("id")
    .eq("application_id", body.appId)
    .eq("question_id", body.questionId)
    .maybeSingle();

  if (existing) {
    return Response.json({ id: existing.id });
  }

  // Create new answer
  const { data: answer, error } = await sb
    .from("application_answers")
    .insert({
      application_id: body.appId,
      question_id: body.questionId,
      archetype: body.archetype,
    })
    .select("id")
    .single();

  if (error) return new Response(error.message, { status: 400 });
  return Response.json({ id: answer.id });
}
