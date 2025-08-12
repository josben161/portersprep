import { auth, currentUser } from "@clerk/nextjs/server";
import { getOrCreateProfileByClerkId, updateProfile } from "@/lib/db";

export async function GET() {
  const { userId } = auth();
  if (!userId) return new Response("Unauthorized", { status: 401 });
  
  const u = await currentUser();
  const profile = await getOrCreateProfileByClerkId(
    userId, 
    u?.emailAddresses?.[0]?.emailAddress, 
    u?.firstName ?? undefined
  );
  
  return Response.json(profile);
}

export async function PATCH(req: Request) {
  const { userId } = auth();
  if (!userId) return new Response("Unauthorized", { status: 401 });
  
  const body = await req.json();
  const { name, email } = body;
  
  // Validate input
  if (name !== undefined && typeof name !== 'string') {
    return new Response("Invalid name", { status: 400 });
  }
  
  if (email !== undefined && typeof email !== 'string') {
    return new Response("Invalid email", { status: 400 });
  }
  
  const updates: Partial<{ name: string; email: string }> = {};
  if (name !== undefined) updates.name = name;
  if (email !== undefined) updates.email = email;
  
  const updatedProfile = await updateProfile(userId, updates);
  return Response.json(updatedProfile);
} 