import { requireAuthedProfile } from "@/lib/authz";
import { getAdminSupabase } from "@/lib/supabaseAdmin";
import { chatJson } from "@/lib/ai";

export async function POST(req: Request) {
  const { profile } = await requireAuthedProfile();
  const { recommender_id, application_id } = await req.json();
  const sb = getAdminSupabase();

  // Load recommender, application, school json + story highlights
  const { data: rec } = await sb.from("recommenders").select("id,name,relationship").eq("id", recommender_id).eq("user_id", profile.id).single();
  const { data: app } = await sb.from("applications").select("id, school_id").eq("id", application_id).eq("user_id", profile.id).single();
  if (!rec || !app) return new Response("Not found", { status: 404 });

  // TODO: if you store highlights, fetch them; simple placeholder
  const highlights = await sb.from("anchor_stories").select("title, summary").eq("user_id", profile.id).limit(5);

  // Load school meta if you've got it in your /data/schools loader (optional: pass its brief)
  const system = "You are an MBA admissions coach. Return JSON with 'outline' and 'draft_md' for a recommender packet.";
  const user = `
Recommender: ${rec.name} (${rec.relationship || "relationship not set"})
Applicant strengths (from stories): ${(highlights.data ?? []).map(s => `- ${s.title}: ${s.summary ?? ""}`).join("\n")}
School target: ${app.school_id}

Return JSON only:
{
  "outline": ["Why candidate", "Evidence stories", "Leadership & analytics", "Closing"],
  "draft_md": "Markdown guidance the recommender can adapt, with bullet points and anecdotes to consider."
}
  `.trim();

  const result = await chatJson({ system, user, temperature: 0.3 });
  const packet_json = result?.outline ? result : { outline: [], draft_md: "## Draft\n\n(Unable to generate. Try again.)" };

  const { data, error } = await sb.from("recommender_packets").insert({
    user_id: profile.id,
    recommender_id, application_id,
    packet_json, draft_md: packet_json.draft_md
  }).select("*").single();
  if (error) return new Response(error.message, { status: 400 });

  return Response.json(data);
} 