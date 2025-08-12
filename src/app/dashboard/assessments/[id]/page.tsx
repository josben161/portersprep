// import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getProfileId, admin } from "@/lib/db";
import { formatDate } from "@/lib/format";
import { ArrowLeft, Plus, BarChart3, Target, Clock, TrendingUp } from "lucide-react";

interface Assessment {
  id: string;
  created_at: string;
  inputs: any;
  result: {
    bands?: Array<{
      school: string;
      likelihood: string;
    }>;
    angles?: Array<{
      category: string;
      score: number;
    }>;
    gaps?: Array<{
      area: string;
      description: string;
    }>;
    timeline?: Array<{
      month: string;
      tasks: string[];
    }>;
  };
}

export default async function AssessmentDetailPage({
  params
}: {
  params: { id: string }
}) {
  // const { userId } = auth();
  const userId = "dummy-user-id"; // Temporary for build

  if (!userId) {
    redirect('/sign-in');
  }

  const profileId = await getProfileId(userId);

  // During build time with dummy user, show not found instead of redirecting
  if (!profileId) {
    return (
      <div className="p-6">
        <div className="mb-6">
          <a
            href="/dashboard/assessments"
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Assessments
          </a>
        </div>
        <h1 className="text-2xl font-bold mb-4">Assessment Not Found</h1>
        <p className="text-red-600">The assessment you're looking for doesn't exist or you don't have access to it.</p>
      </div>
    );
  }

  const supabase = admin();

  const { data: assessment, error } = await supabase
    .from('assessments')
    .select('*')
    .eq('id', params.id)
    .eq('profile_id', profileId)
    .single();

  if (error || !assessment) {
    return (
      <div className="p-6">
        <div className="mb-6">
          <a
            href="/dashboard/assessments"
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Assessments
          </a>
        </div>
        <h1 className="text-2xl font-bold mb-4">Assessment Not Found</h1>
        <p className="text-red-600">The assessment you're looking for doesn't exist or you don't have access to it.</p>
      </div>
    );
  }

  const assessmentData = assessment as Assessment;

  return (
    <div className="p-6">
      <div className="mb-6 flex justify-between items-start">
        <div>
          <a
            href="/dashboard/assessments"
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Assessments
          </a>
          <h1 className="text-2xl font-bold mb-2">Assessment Details</h1>
          <p className="text-gray-600">Created on {formatDate(assessmentData.created_at)}</p>
        </div>
        <a
          href="/dashboard/assessments/new"
          className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-md hover:opacity-95 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Start Another Assessment
        </a>
      </div>

      <div className="space-y-8">
        {/* Likelihood Bands */}
        {assessmentData.result?.bands && assessmentData.result.bands.length > 0 && (
          <div className="bg-white rounded-lg border p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-blue-600" />
              School Likelihood Bands
            </h2>
            <div className="grid gap-3">
              {assessmentData.result.bands.map((band, index) => (
                <div key={index} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                  <span className="font-medium">{band.school}</span>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    band.likelihood === 'High' ? 'bg-green-100 text-green-800' :
                    band.likelihood === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {band.likelihood}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Profile Angles */}
        {assessmentData.result?.angles && assessmentData.result.angles.length > 0 && (
          <div className="bg-white rounded-lg border p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Target className="h-5 w-5 text-green-600" />
              Profile Angles
            </h2>
            <div className="grid gap-3">
              {assessmentData.result.angles.map((angle, index) => (
                <div key={index} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                  <span className="font-medium">{angle.category}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-16 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-500 h-2 rounded-full" 
                        style={{ width: `${(angle.score / 10) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-sm text-gray-600 w-8">{angle.score}/10</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Gap Analysis */}
        {assessmentData.result?.gaps && assessmentData.result.gaps.length > 0 && (
          <div className="bg-white rounded-lg border p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-orange-600" />
              Gap Analysis
            </h2>
            <div className="space-y-3">
              {assessmentData.result.gaps.map((gap, index) => (
                <div key={index} className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-medium mb-2 text-orange-800">{gap.area}</h3>
                  <p className="text-sm text-gray-600">{gap.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Application Timeline */}
        {assessmentData.result?.timeline && assessmentData.result.timeline.length > 0 && (
          <div className="bg-white rounded-lg border p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Clock className="h-5 w-5 text-purple-600" />
              Application Timeline
            </h2>
            <div className="space-y-4">
              {assessmentData.result.timeline.map((month, index) => (
                <div key={index} className="border-l-2 border-purple-200 pl-4">
                  <h3 className="font-medium text-purple-800 mb-2">{month.month}</h3>
                  <ul className="space-y-1">
                    {month.tasks.map((task, taskIndex) => (
                      <li key={taskIndex} className="text-sm text-gray-600 flex items-start gap-2">
                        <span className="text-purple-500 mt-1">•</span>
                        {task}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Input Data */}
        {assessmentData.inputs && (
          <div className="bg-white rounded-lg border p-6">
            <h2 className="text-lg font-semibold mb-4">Assessment Inputs</h2>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-medium mb-2">Target Schools</h3>
              <p className="text-sm text-gray-600 mb-4">
                {Array.isArray(assessmentData.inputs.targets) 
                  ? assessmentData.inputs.targets.join(', ')
                  : assessmentData.inputs.targets
                }
              </p>
              
              <h3 className="font-medium mb-2">Goals</h3>
              <p className="text-sm text-gray-600 mb-4">{assessmentData.inputs.goals}</p>
              
              {assessmentData.inputs.constraints && (
                <>
                  <h3 className="font-medium mb-2">Additional Context</h3>
                  <p className="text-sm text-gray-600">{assessmentData.inputs.constraints}</p>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 