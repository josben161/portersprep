// import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getProfileId, admin } from "@/lib/db";
import EssayEditor from "./EssayEditor";

interface Essay {
  id: string;
  title: string;
  content: string;
  profile_id: string;
}

export default async function EssayPage({ params }: { params: { id: string } }) {
  // const { userId } = auth();
  const userId = "dummy-user-id"; // Temporary for build

  if (!userId) {
    redirect('/sign-in');
  }

  const profileId = await getProfileId(userId);

  // During build time with dummy user, show not found
  if (!profileId) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Essay Not Found</h1>
        <p className="text-red-600">The essay you're looking for doesn't exist or you don't have access to it.</p>
      </div>
    );
  }

  const supabase = admin();

  const { data: essay, error } = await supabase
    .from('essays')
    .select('*')
    .eq('id', params.id)
    .eq('profile_id', profileId)
    .single();

  if (error || !essay) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Essay Not Found</h1>
        <p className="text-red-600">The essay you're looking for doesn't exist or you don't have access to it.</p>
      </div>
    );
  }

  const essayData = essay as Essay;

  return <EssayEditor essay={essayData} />;
} 