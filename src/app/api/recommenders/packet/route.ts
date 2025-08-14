import { requireAuthedProfile } from "@/lib/authz";
import { getAdminSupabase } from "@/lib/supabaseAdmin";
import { chatJson } from "@/lib/ai";

export async function POST(req: Request) {
  const { profile } = await requireAuthedProfile();
  const { recommender_id, application_id } = await req.json();
  const sb = getAdminSupabase();

  const { data: rec } = await sb
    .from("recommenders")
    .select("id,name,relationship")
    .eq("id", recommender_id)
    .eq("user_id", profile.id)
    .single();
  const { data: app } = await sb
    .from("applications")
    .select("id, school_id")
    .eq("id", application_id)
    .eq("user_id", profile.id)
    .single();
  if (!rec || !app) return new Response("Not found", { status: 404 });

  const { data: stories } = await sb
    .from("anchor_stories")
    .select("title, summary")
    .eq("user_id", profile.id)
    .limit(6);

  const system = "You are an MBA admissions coach. Return concise JSON only.";
  const user = `
Applicant strengths:
${(stories ?? []).map((s) => `- ${s.title}: ${s.summary ?? ""}`).join("\n")}

Recommender: ${rec.name} (${rec.relationship || "relationship not set"})
Target school: ${app.school_id}

Return JSON:
{
  "outline": ["Why candidate", "Evidence stories", "Leadership & analytics", "Closing"],
  "draft_md": "Markdown guidance the recommender can adapt, with bullets and anecdotes to consider."
}
  `.trim();

  const result = await chatJson({ system, user, temperature: 0.3 });
  const packet = result?.outline
    ? result
    : { outline: [], draft_md: "## Draft\n\n(Generation failed, try again.)" };

  const { data, error } = await sb
    .from("recommender_packets")
    .insert({
      user_id: profile.id,
      recommender_id,
      application_id,
      packet_json: packet,
      draft_md: packet.draft_md,
    })
    .select("*")
    .single();
  if (error)
    return new Response((error as any).message ?? "Insert error", {
      status: 400,
    });

  return Response.json(data);
}
