// import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getProfileId, admin } from "@/lib/db";
import { formatDate } from "@/lib/format";
import { Plus } from "lucide-react";

interface Assessment {
  id: string;
  created_at: string;
  result: {
    bands?: Array<{
      school: string;
      likelihood: string;
    }>;
  };
}

export default async function AssessmentsPage() {
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
          <h1 className="text-2xl font-bold">Assessments</h1>
          <a
            href="/dashboard/assessments/new"
            className="inline-flex items-center gap-2 bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors"
          >
            <Plus className="h-4 w-4" />
            New Assessment
          </a>
        </div>
        
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No assessments yet</h3>
          <p className="text-gray-500 mb-6">
            Get started by creating your first assessment to see your MBA admission chances.
          </p>
          <a
            href="/dashboard/assessments/new"
            className="inline-flex items-center gap-2 bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors"
          >
            <Plus className="h-4 w-4" />
            Create Assessment
          </a>
        </div>
      </div>
    );
  }

  const supabase = admin();
  
  const { data: assessments, error } = await supabase
    .from('assessments')
    .select('id, created_at, result')
    .eq('profile_id', profileId)
    .order('created_at', { ascending: false })
    .limit(10);

  if (error) {
    console.error('Error fetching assessments:', error);
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Assessments</h1>
        <p className="text-red-600">Error loading assessments. Please try again.</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Assessments</h1>
        <a
          href="/dashboard/assessments/new"
          className="inline-flex items-center gap-2 bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors"
        >
          <Plus className="h-4 w-4" />
          New Assessment
        </a>
      </div>

      {assessments && assessments.length > 0 ? (
        <div className="bg-white rounded-lg border overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Schools
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {assessments.map((assessment: Assessment) => (
                <tr key={assessment.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatDate(assessment.created_at)}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {assessment.result?.bands ? (
                      <div className="flex flex-wrap gap-1">
                        {assessment.result.bands.slice(0, 3).map((band, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                          >
                            {band.school} ({band.likelihood})
                          </span>
                        ))}
                        {assessment.result.bands.length > 3 && (
                          <span className="text-xs text-gray-500">
                            +{assessment.result.bands.length - 3} more
                          </span>
                        )}
                      </div>
                    ) : (
                      <span className="text-gray-500">No results</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <a
                      href={`/dashboard/assessments/${assessment.id}`}
                      className="text-blue-600 hover:text-blue-900 hover:underline"
                    >
                      View Details
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No assessments yet</h3>
          <p className="text-gray-500 mb-6">
            Get started by creating your first assessment to see your MBA admission chances.
          </p>
          <a
            href="/dashboard/assessments/new"
            className="inline-flex items-center gap-2 bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors"
          >
            <Plus className="h-4 w-4" />
            Create Assessment
          </a>
        </div>
      )}
    </div>
  );
} 