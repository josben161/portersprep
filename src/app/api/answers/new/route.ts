import { auth, currentUser } from "@clerk/nextjs/server";
import { getAdminSupabase } from "@/lib/supabaseAdmin";
import { getQuotaSnapshot, assertWithinLimit } from "@/lib/quota";

export async function POST(req: Request) {
  const { userId } = auth(); if(!userId) return new Response("Unauthorized",{status:401});
  const u = await currentUser();
  const snap = await getQuotaSnapshot(userId);
  try { assertWithinLimit("essays", snap); } catch (e) { if (e instanceof Response) return e; throw e; }

  const body = await req.json(); // { application_id, question_id }
  const sb = getAdminSupabase();
  const { data, error } = await sb.from("application_answers").insert({ application_id: body.application_id, question_id: body.question_id, content_key: null }).select("*").single();
  if (error) return new Response(error.message, { status: 400 });
  return Response.json(data);
} 