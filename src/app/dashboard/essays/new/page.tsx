// import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getProfileId, admin } from "@/lib/db";

export default async function NewEssayPage() {
  // const { userId } = auth();
  const userId = "dummy-user-id"; // Temporary for build

  if (!userId) {
    redirect('/sign-in');
  }

  const profileId = await getProfileId(userId);

  // During build time with dummy user, redirect to essays list
  if (!profileId) {
    redirect('/dashboard/essays');
  }

  const supabase = admin();

  // Create a new essay with default values
  const { data: essay, error } = await supabase
    .from('essays')
    .insert({
      profile_id: profileId,
      title: 'Untitled Essay',
      content: '',
    })
    .select('id')
    .single();

  if (error) {
    console.error('Error creating essay:', error);
    redirect('/dashboard/essays');
  }

  // Redirect to the new essay
  redirect(`/dashboard/essays/${essay.id}`);
} 