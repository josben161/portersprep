import { requireAuthedProfile } from "@/lib/authz";
import { redirect } from "next/navigation";
import { createDocument } from "@/lib/db";

export default async function NewEssayPage() {
  const { profile } = await requireAuthedProfile();

  // Create a new document with default values
  const id = await createDocument(profile.id, "Untitled Essay");

  // Redirect to the new document
  redirect(`/dashboard/essays/${id}`);
}
