import { auth, currentUser } from "@clerk/nextjs/server";
import { getSchoolData } from "@/lib/schools";
import { getOrCreateProfileByClerkId } from "@/lib/db";
import {
  upsertSchool,
  addSchoolQuestion,
  ensureAnswer,
  getApplication,
  listSchoolQuestions,
} from "@/lib/apps";

function inferArchetype(title: string, prompt: string): string {
  const t = `${title} ${prompt}`.toLowerCase();
  if (t.includes("what matters most")) return "values";
  if (
    t.includes("why stanford") ||
    t.includes("why booth") ||
    t.includes("why tuck") ||
    t.includes("why wharton") ||
    t.includes("why school")
  )
    return "why_school";
  if (
    t.includes("why mba") ||
    t.includes("post-mba") ||
    t.includes("career goals") ||
    t.includes("goal")
  )
    return "goals";
  if (t.includes("leadership")) return "leadership";
  if (t.includes("setback") || t.includes("failure")) return "setback";
  if (t.includes("community")) return "community";
  if (t.includes("growth") || t.includes("curiosity")) return "values";
  return "short_answer";
}

export async function POST(req: Request) {
  const { userId } = auth();
  if (!userId) return new Response("Unauthorized", { status: 401 });
  const u = await currentUser();
  const p = await getOrCreateProfileByClerkId(
    userId,
    u?.emailAddresses?.[0]?.emailAddress,
    u?.firstName ?? undefined,
  );

  const { appId, schoolId, essayIndex } = await req.json();
  if (!appId || !schoolId || typeof essayIndex !== "number")
    return new Response("Bad Request", { status: 400 });

  const school = await getSchoolData(schoolId);
  if (!school) return new Response("School not found", { status: 404 });

  const app = await getApplication(appId);
  if (app.user_id !== p.id) return new Response("Forbidden", { status: 403 });

  // Upsert school row
  const dbSchoolId = await upsertSchool({
    name: school.name,
    slug: school.id,
    website: "",
    brief: {
      cycle: school.cycle,
      verify_in_portal: school.verify_in_portal,
      country: school.country,
    },
  });

  // Ensure question exists (by matching prompt; if not found, insert)
  const qList = await listSchoolQuestions(dbSchoolId);
  const essay = school.essays[essayIndex];
  const archetype = inferArchetype(essay.title, essay.prompt);
  const existing = qList.find(
    (q: any) => q.prompt.trim() === essay.prompt.trim(),
  );
  const questionId =
    existing?.id ||
    (await addSchoolQuestion(dbSchoolId, {
      prompt: essay.prompt,
      archetype,
      word_limit: essay.word_limit ?? null,
      metadata: {
        source_url: essay.source_url,
        title: essay.title,
        type: essay.type,
      },
    }));

  // Ensure answer row and return it
  const answerId = await ensureAnswer(appId, { id: questionId, archetype });
  return Response.json({ answerId });
}
