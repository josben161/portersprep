import { auth, currentUser } from "@clerk/nextjs/server";
import { getOrCreateProfileByClerkId } from "@/lib/db";
import { getApplication } from "@/lib/apps";

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const { userId } = auth();
  if (!userId) return new Response("Unauthorized", { status: 401 });
  
  const u = await currentUser();
  const profile = await getOrCreateProfileByClerkId(userId, u?.emailAddresses?.[0]?.emailAddress, u?.firstName ?? undefined);
  
  try {
    const app = await getApplication(params.id);
    if (app.user_id !== profile.id) {
      return new Response("Forbidden", { status: 403 });
    }
    
    return Response.json(app);
  } catch (error) {
    return new Response("Not found", { status: 404 });
  }
} 