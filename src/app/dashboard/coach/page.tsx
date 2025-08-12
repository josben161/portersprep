// import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getProfileId } from "@/lib/db";
import Chat from "./Chat";

export default async function CoachPage() {
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
        <h1 className="text-2xl font-bold mb-4">Coach Not Available</h1>
        <p className="text-red-600">Please sign in to access your coach.</p>
      </div>
    );
  }

  return (
    <div className="h-screen flex">
      {/* Left Column - Coach Info */}
      <div className="w-80 border-r bg-gray-50 p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-2">Coach Thread</h1>
          <p className="text-sm text-muted-foreground">
            Chat with your personal MBA admissions coach
          </p>
        </div>

        <div className="space-y-4">
          <div className="bg-white rounded-lg p-4 border">
            <h3 className="font-medium mb-2">Your Coach</h3>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                <span className="text-primary-foreground font-medium">C</span>
              </div>
              <div>
                <div className="font-medium">Coach Sarah</div>
                <div className="text-sm text-muted-foreground">MBA Admissions Expert</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 border">
            <h3 className="font-medium mb-2">What you can ask</h3>
            <ul className="text-sm text-muted-foreground space-y-2">
              <li>• Application strategy advice</li>
              <li>• Essay feedback and guidance</li>
              <li>• Interview preparation tips</li>
              <li>• School selection help</li>
              <li>• Timeline planning</li>
            </ul>
          </div>

          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <h3 className="font-medium text-blue-900 mb-2">💡 Pro Tip</h3>
            <p className="text-sm text-blue-800">
              Be specific in your questions and share your background for the most helpful advice.
            </p>
          </div>
        </div>
      </div>

      {/* Right Column - Chat */}
      <div className="flex-1 flex flex-col">
        <Chat profileId={profileId} />
      </div>
    </div>
  );
} 