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
  const id = await createApplication(p.id, schoolId, round);
  return Response.json({ id });
} 