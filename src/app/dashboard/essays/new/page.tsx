// import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getProfileByClerkId, createDocument } from "@/lib/db";

export default async function NewEssayPage() {
  // const { userId } = auth();
  const userId = "dummy-user-id"; // Temporary for build

  if (!userId) {
    redirect('/sign-in');
  }

  const profile = await getProfileByClerkId(userId);

  // During build time with dummy user, redirect to essays list
  if (!profile) {
    redirect('/dashboard/essays');
  }

  // Create a new document with default values
  const id = await createDocument(profile.id, 'Untitled Essay');

  // Redirect to the new document
  redirect(`/dashboard/essays/${id}`);
} 