import { auth, currentUser } from "@clerk/nextjs/server";
import { getOrCreateProfileByClerkId } from "@/lib/db";
import { createApplication, listApplications } from "@/lib/apps";

export async function GET() {
  const { userId } = auth();
  if (!userId) return new Response("Unauthorized", { status: 401 });
  const u = await currentUser();
  const p = await getOrCreateProfileByClerkId(userId, u?.emailAddresses?.[0]?.emailAddress, u?.firstName ?? undefined);
  return Response.json(await listApplications(p.id));
}

export async function POST(req: Request) {
  const { userId } = auth();
  if (!userId) return new Response("Unauthorized", { status: 401 });
  const u = await currentUser();
  const p = await getOrCreateProfileByClerkId(userId, u?.emailAddresses?.[0]?.emailAddress, u?.firstName ?? undefined);
  const { schoolId, round } = await req.json();
  if (!schoolId) return new Response("Bad Request", { status: 400 });
  
  // schoolId is actually a school slug, so we need to get the actual school UUID
  const { getAdminSupabase } = await import("@/lib/supabaseAdmin");
  const sb = getAdminSupabase();
  
  // First, try to find the school by slug
  const { data: school } = await sb
    .from("schools")
    .select("id")
    .eq("slug", schoolId)
    .single();
  
  if (!school) {
    // If school doesn't exist, create it using the school data
    const { getSchoolData } = await import("@/lib/schools");
    const schoolData = await getSchoolData(schoolId);
    if (!schoolData) {
      return new Response("School not found", { status: 404 });
    }
    
    // Upsert the school to get its UUID
    const { upsertSchool } = await import("@/lib/apps");
    const schoolUUID = await upsertSchool({
      name: schoolData.name,
      slug: schoolData.id,
      website: "",
      brief: {
        cycle: schoolData.cycle,
        verify_in_portal: schoolData.verify_in_portal,
        country: schoolData.country
      }
    });
    
    const id = await createApplication(p.id, schoolUUID, round);
    return Response.json({ id });
  }
  
  // School exists, use its UUID
  const id = await createApplication(p.id, school.id, round);
  return Response.json({ id });
} 