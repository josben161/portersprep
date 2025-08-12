import { auth, currentUser } from "@clerk/nextjs/server";
import { getOrCreateProfileByClerkId } from "@/lib/db";

export async function requireProfile() {
  const { userId } = auth();
  if (!userId) return null;
  const user = await currentUser();
  const profile = await getOrCreateProfileByClerkId(userId, user?.emailAddresses?.[0]?.emailAddress, user?.firstName ?? undefined);
  return profile;
} 