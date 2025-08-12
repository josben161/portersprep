// import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getProfileId, admin } from "@/lib/db";
import { formatDate } from "@/lib/format";
import { Plus, FileText } from "lucide-react";

interface Essay {
  id: string;
  title: string;
  updated_at: string;
}

export default async function EssaysPage() {
  // const { userId } = auth();
  const userId = "dummy-user-id"; // Temporary for build

  if (!userId) {
    redirect('/sign-in');
  }

  const profileId = await getProfileId(userId);

  // During build time with dummy user, show empty state instead of redirecting
  if (!profileId) {
    return (
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Essays</h1>
          <a
            href="/dashboard/essays/new"
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-md hover:opacity-95 transition-colors"
          >
            <Plus className="h-4 w-4" />
            New Essay
          </a>
        </div>

        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <FileText className="mx-auto h-12 w-12" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No essays yet</h3>
          <p className="text-gray-500 mb-6">
            Start writing your MBA application essays with AI-powered feedback.
          </p>
          <a
            href="/dashboard/essays/new"
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-md hover:opacity-95 transition-colors"
          >
            <Plus className="h-4 w-4" />
            Create Essay
          </a>
        </div>
      </div>
    );
  }

  const supabase = admin();

  const { data: essays, error } = await supabase
    .from('essays')
    .select('id, title, updated_at')
    .eq('profile_id', profileId)
    .order('updated_at', { ascending: false })
    .limit(20);

  if (error) {
    console.error('Error fetching essays:', error);
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Essays</h1>
        <p className="text-red-600">Error loading essays. Please try again.</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Essays</h1>
        <a
          href="/dashboard/essays/new"
          className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-md hover:opacity-95 transition-colors"
        >
          <Plus className="h-4 w-4" />
          New Essay
        </a>
      </div>

      {essays && essays.length > 0 ? (
        <div className="grid gap-4">
          {essays.map((essay: Essay) => (
            <a
              key={essay.id}
              href={`/dashboard/essays/${essay.id}`}
              className="block p-4 bg-white rounded-lg border hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900 mb-1">{essay.title}</h3>
                  <p className="text-sm text-gray-500">
                    Last updated {formatDate(essay.updated_at)}
                  </p>
                </div>
                <FileText className="h-5 w-5 text-gray-400" />
              </div>
            </a>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <FileText className="mx-auto h-12 w-12" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No essays yet</h3>
          <p className="text-gray-500 mb-6">
            Start writing your MBA application essays with AI-powered feedback.
          </p>
          <a
            href="/dashboard/essays/new"
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-md hover:opacity-95 transition-colors"
          >
            <Plus className="h-4 w-4" />
            Create Essay
          </a>
        </div>
      )}
    </div>
  );
} 