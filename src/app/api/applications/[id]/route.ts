import { auth, currentUser } from "@clerk/nextjs/server";
import { getOrCreateProfileByClerkId } from "@/lib/db";
import { getApplication } from "@/lib/apps";
import { getSchoolData } from "@/lib/schools";

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const { userId } = auth();
  if (!userId) return new Response("Unauthorized", { status: 401 });

  const u = await currentUser();
  const profile = await getOrCreateProfileByClerkId(
    userId,
    u?.emailAddresses?.[0]?.emailAddress,
    u?.firstName ?? undefined,
  );

  try {
    const app = await getApplication(params.id);
    if (app.user_id !== profile.id) {
      return new Response("Forbidden", { status: 403 });
    }

    // Get school data from JSON files
    const schoolData = await getSchoolData(app.school_id);

    // Combine application data with school data
    const enrichedApp = {
      ...app,
      schools: schoolData
        ? {
            name: schoolData.name,
            slug: schoolData.id, // Use the school ID as slug
          }
        : null,
    };

    return Response.json(enrichedApp);
  } catch (error) {
    console.error("Application API error:", error);
    return new Response("Not found", { status: 404 });
  }
}
