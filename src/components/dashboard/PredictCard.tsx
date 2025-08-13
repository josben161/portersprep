"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { SchoolPrediction, ImprovementPlan, generateSchoolPredictions, generateImprovementPlan, calculateOverallAdmissionProbability, getConfidenceLevel } from "@/lib/prediction-engine";

function BandBadge({ probability }: { probability: number }) {
  let band = "safety";
  let cls = "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-200 border border-emerald-200 dark:border-emerald-800";
  
  if (probability < 30) {
    band = "reach";
    cls = "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-200 border border-rose-200 dark:border-rose-800";
  } else if (probability < 60) {
    band = "target";
    cls = "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-200 border border-amber-200 dark:border-amber-800";
  }
  
  return <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${cls}`}>{band}</span>;
}

function ConfidenceBar({ confidence }: { confidence: 'low' | 'medium' | 'high' }) {
  const percentage = confidence === 'high' ? 80 : confidence === 'medium' ? 60 : 40;
  const color = confidence === 'high' ? "bg-emerald-500" : confidence === 'medium' ? "bg-amber-500" : "bg-rose-500";
  
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
        <div 
          className={`h-1.5 rounded-full ${color} transition-all duration-300`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      <span className="text-xs text-muted-foreground capitalize">{confidence}</span>
    </div>
  );
}

function ProfileSummary({ profile }: { profile: any }) {
  const hasData = profile?.name || profile?.industry || profile?.years_exp || profile?.gpa || profile?.gmat || profile?.goals;
  
  if (!hasData) {
    return (
      <div className="text-xs text-muted-foreground">
        Complete your profile to get accurate predictions
      </div>
    );
  }

  return (
    <div className="space-y-1 text-xs">
      {profile?.name && <div><span className="text-muted-foreground">Name:</span> {profile.name}</div>}
      {profile?.industry && <div><span className="text-muted-foreground">Industry:</span> {profile.industry}</div>}
      {profile?.years_exp && <div><span className="text-muted-foreground">Experience:</span> {profile.years_exp} years</div>}
      {(profile?.gpa || profile?.gmat) && (
        <div>
          <span className="text-muted-foreground">Stats:</span> 
          {profile?.gpa && ` GPA: ${profile.gpa}`}
          {profile?.gmat && ` GMAT: ${profile.gmat}`}
        </div>
      )}
    </div>
  );
}

function SchoolPredictionCard({ prediction }: { prediction: SchoolPrediction }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="border rounded-lg p-3 hover:bg-gray-50 dark:hover:bg-gray-900/30 transition-colors">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="text-sm font-medium">{prediction.school_name}</div>
          <BandBadge probability={prediction.admission_probability} />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold">{prediction.admission_probability}%</span>
          <ConfidenceBar confidence={prediction.confidence_level} />
        </div>
      </div>
      
      <div className="text-xs text-muted-foreground mb-2">
        {prediction.fit_analysis}
      </div>
      
      <button 
        onClick={() => setExpanded(!expanded)}
        className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
      >
        {expanded ? 'Hide details' : 'Show details'}
      </button>
      
      {expanded && (
        <div className="mt-3 space-y-3 text-xs">
          <div>
            <div className="font-medium text-green-700 dark:text-green-400 mb-1">Strengths:</div>
            <ul className="list-disc list-inside space-y-1">
              {prediction.strengths.map((strength, index) => (
                <li key={index} className="text-muted-foreground">{strength}</li>
              ))}
            </ul>
          </div>
          
          <div>
            <div className="font-medium text-red-700 dark:text-red-400 mb-1">Areas for Improvement:</div>
            <ul className="list-disc list-inside space-y-1">
              {prediction.weaknesses.map((weakness, index) => (
                <li key={index} className="text-muted-foreground">{weakness}</li>
              ))}
            </ul>
          </div>
          
          <div>
            <div className="font-medium text-blue-700 dark:text-blue-400 mb-1">Recommendations:</div>
            <ul className="list-disc list-inside space-y-1">
              {prediction.recommendations.slice(0, 3).map((rec, index) => (
                <li key={index} className="text-muted-foreground">{rec}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

function ImprovementPlanWidget({ plan }: { plan: ImprovementPlan }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h4 className="text-sm font-semibold text-blue-900 dark:text-blue-100">Improve Your Chances</h4>
          <p className="text-xs text-blue-700 dark:text-blue-300">Action plan to boost your admission probability</p>
        </div>
        <button 
          onClick={() => setExpanded(!expanded)}
          className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
        >
          {expanded ? 'Hide plan' : 'View plan'}
        </button>
      </div>
      
      {expanded && (
        <div className="space-y-3 text-xs">
          <div>
            <div className="font-medium text-green-700 dark:text-green-400 mb-1">Short-term (0-3 months):</div>
            <ul className="list-disc list-inside space-y-1">
              {plan.short_term.map((action, index) => (
                <li key={index} className="text-muted-foreground">{action}</li>
              ))}
            </ul>
          </div>
          
          <div>
            <div className="font-medium text-amber-700 dark:text-amber-400 mb-1">Medium-term (3-6 months):</div>
            <ul className="list-disc list-inside space-y-1">
              {plan.medium_term.map((action, index) => (
                <li key={index} className="text-muted-foreground">{action}</li>
              ))}
            </ul>
          </div>
          
          <div>
            <div className="font-medium text-blue-700 dark:text-blue-400 mb-1">Long-term (6+ months):</div>
            <ul className="list-disc list-inside space-y-1">
              {plan.long_term.map((action, index) => (
                <li key={index} className="text-muted-foreground">{action}</li>
              ))}
            </ul>
          </div>
          
          <div className="pt-2 border-t border-blue-200 dark:border-blue-800">
            <div className="font-medium text-purple-700 dark:text-purple-400 mb-1">Priority Actions:</div>
            <ul className="list-disc list-inside space-y-1">
              {plan.priority_actions.slice(0, 3).map((action, index) => (
                <li key={index} className="text-muted-foreground">{action}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

export default function PredictCard() {
  const [predictions, setPredictions] = useState<SchoolPrediction[]>([]);
  const [improvementPlan, setImprovementPlan] = useState<ImprovementPlan | null>(null);
  const [profile, setProfile] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [running, setRunning] = useState(false);
  const [overallProbability, setOverallProbability] = useState(0);
  const [confidenceLevel, setConfidenceLevel] = useState<'low' | 'medium' | 'high'>('low');

  async function loadProfile() {
    try {
      const r = await fetch("/api/profile");
      if (r.ok) {
        const profileData = await r.json();
        setProfile(profileData);
      }
    } catch (error) {
      console.error("Failed to load profile:", error);
    }
  }

  async function runPredictions() {
    setRunning(true);
    try {
      // Get user ID for predictions
      const meRes = await fetch("/api/me");
      if (!meRes.ok) {
        throw new Error("Failed to load user profile");
      }
      const meData = await meRes.json();
      
      // Get target schools from applications
      const appsRes = await fetch("/api/applications");
      if (!appsRes.ok) {
        throw new Error("Failed to load applications");
      }
      const appsData = await appsRes.json();
      
      const schoolIds = appsData
        .filter((app: any) => app.school_id)
        .map((app: any) => app.school_id);
      
      if (schoolIds.length === 0) {
        // Use default schools if no applications
        const schoolsRes = await fetch("/api/schools");
        if (schoolsRes.ok) {
          const schoolsData = await schoolsRes.json();
          schoolIds.push(...schoolsData.slice(0, 5).map((s: any) => s.id));
        }
      }
      
      // Generate predictions
      const predictions = await generateSchoolPredictions(meData.profile.id, schoolIds);
      setPredictions(predictions);
      
      // Calculate overall probability
      const overall = calculateOverallAdmissionProbability(predictions);
      setOverallProbability(overall);
      
      // Get confidence level
      const confidence = getConfidenceLevel(predictions);
      setConfidenceLevel(confidence);
      
      // Generate improvement plan
      if (predictions.length > 0) {
        const plan = await generateImprovementPlan(meData.profile.id, predictions);
        setImprovementPlan(plan);
      }
      
    } catch (error) {
      console.error("Failed to run predictions:", error);
      alert("Failed to generate predictions. Please try again.");
    } finally {
      setRunning(false);
      setLoading(false);
    }
  }

  useEffect(() => { 
    loadProfile();
    // Don't auto-run predictions, let user trigger them
    setLoading(false);
  }, []);

  const hasProfileData = profile?.name || profile?.industry || profile?.years_exp || profile?.gpa || profile?.gmat || profile?.goals;
  const hasPredictions = predictions.length > 0;

  return (
    <section className="card p-4">
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="text-xs text-muted-foreground">AI-Powered Predictions</div>
          <h3 className="text-base font-semibold">Admission Probability</h3>
        </div>
        <div className="flex gap-2">
          <Link href="/dashboard/predict" className="btn btn-outline text-xs">History</Link>
          <button 
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-md px-3 py-2 text-xs transition-colors disabled:opacity-50" 
            onClick={runPredictions} 
            disabled={running || !hasProfileData}
          >
            {running ? "Analyzing..." : "Generate Predictions"}
          </button>
        </div>
      </div>

      {/* Profile Summary */}
      <div className="mb-4 p-3 rounded-md bg-gray-50 dark:bg-gray-900/50">
        <div className="text-xs font-medium mb-2">Profile Summary</div>
        <ProfileSummary profile={profile} />
      </div>

      {/* Overall Probability */}
      {hasPredictions && (
        <div className="mb-4 p-3 rounded-md bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200 dark:border-green-800">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-medium text-green-900 dark:text-green-100">Overall Admission Probability</div>
              <div className="text-xs text-green-700 dark:text-green-300">Based on {predictions.length} schools</div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-green-900 dark:text-green-100">{overallProbability}%</div>
              <div className="text-xs text-green-700 dark:text-green-300 capitalize">{confidenceLevel} confidence</div>
            </div>
          </div>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="space-y-3">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-3/4"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-1/2"></div>
        </div>
      )}

      {/* No Prediction State */}
      {!loading && !hasPredictions && (
        <div className="text-center py-6">
          <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
            <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <div className="text-sm font-medium mb-1">No predictions yet</div>
          <div className="text-xs text-muted-foreground mb-3">
            {hasProfileData 
              ? "Click 'Generate Predictions' to get AI-powered admission analysis"
              : "Complete your profile first to get accurate predictions"
            }
          </div>
          {!hasProfileData && (
            <Link href="/dashboard" className="text-xs text-blue-600 dark:text-blue-400 hover:underline">
              Complete Profile →
            </Link>
          )}
        </div>
      )}

      {/* Predictions Display */}
      {!loading && hasPredictions && (
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>School-by-school analysis</span>
            <span>{new Date().toLocaleDateString()}</span>
          </div>
          
          <div className="space-y-3">
            {predictions.slice(0, 3).map((prediction, index) => (
              <SchoolPredictionCard key={prediction.school_id || index} prediction={prediction} />
            ))}
            
            {predictions.length > 3 && (
              <div className="text-center pt-2">
                <Link href="/dashboard/predict" className="text-xs text-blue-600 dark:text-blue-400 hover:underline">
                  View all {predictions.length} schools →
                </Link>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Improvement Plan */}
      {improvementPlan && (
        <ImprovementPlanWidget plan={improvementPlan} />
      )}

      {/* Running State */}
      {running && (
        <div className="text-center py-4">
          <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
          <div className="text-sm text-muted-foreground">AI is analyzing your profile...</div>
        </div>
      )}
    </section>
  );
} 