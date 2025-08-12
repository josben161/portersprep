"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

function BandBadge({ band }: { band?: string }) {
  if (!band) return null;
  const cls =
    band === "reach"
      ? "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-200 border border-rose-200 dark:border-rose-800"
      : band === "target"
      ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-200 border border-amber-200 dark:border-amber-800"
      : "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-200 border border-emerald-200 dark:border-emerald-800";
  return <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${cls}`}>{band}</span>;
}

function ConfidenceBar({ confidence }: { confidence?: number }) {
  if (!confidence) return null;
  const percentage = Math.round(confidence * 100);
  const color = confidence > 0.7 ? "bg-emerald-500" : confidence > 0.4 ? "bg-amber-500" : "bg-rose-500";
  
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
        <div 
          className={`h-1.5 rounded-full ${color} transition-all duration-300`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      <span className="text-xs text-muted-foreground">{percentage}%</span>
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

export default function PredictCard() {
  const [pred, setPred] = useState<any | null>(null);
  const [profile, setProfile] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [running, setRunning] = useState(false);

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

  async function refresh() {
    setLoading(true);
    try {
      const r = await fetch("/api/predict");
      if (r.ok) {
        const predData = await r.json();
        setPred(predData);
      }
    } catch (error) {
      console.error("Failed to load prediction:", error);
    } finally {
      setLoading(false);
    }
  }

  async function runFromProfile(){
    setRunning(true);
    try {
      const r = await fetch("/api/predict/run", { method:"POST" });
      if (!r.ok) {
        const errorText = await r.text();
        alert(`Failed to run prediction: ${errorText}`);
        return;
      }
      await refresh();
    } catch (error) {
      console.error("Failed to run prediction:", error);
      alert("Failed to run prediction. Please try again.");
    } finally { 
      setRunning(false); 
    }
  }

  useEffect(() => { 
    loadProfile();
    refresh(); 
  }, []);

  const hasProfileData = profile?.name || profile?.industry || profile?.years_exp || profile?.gpa || profile?.gmat || profile?.goals;
  const schools = pred?.result?.schools || [];
  const hasPredictions = schools.length > 0;

  return (
    <section className="card p-4">
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="text-xs text-muted-foreground">Predict My Chances</div>
          <h3 className="text-base font-semibold">Fit score by school</h3>
        </div>
        <div className="flex gap-2">
          <Link href="/dashboard/predict" className="btn btn-outline text-xs">History</Link>
          <button 
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-md px-3 py-2 text-xs transition-colors disabled:opacity-50" 
            onClick={runFromProfile} 
            disabled={running || !hasProfileData}
          >
            {running ? "Running…" : "Run Prediction"}
          </button>
        </div>
      </div>

      {/* Profile Summary */}
      <div className="mb-4 p-3 rounded-md bg-gray-50 dark:bg-gray-900/50">
        <div className="text-xs font-medium mb-2">Profile Summary</div>
        <ProfileSummary profile={profile} />
      </div>

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
              ? "Click 'Run Prediction' to generate your fit scores"
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
            <span>Latest prediction</span>
            <span>{new Date(pred.created_at).toLocaleDateString()}</span>
          </div>
          
          <div className="space-y-2">
            {schools.slice(0, 5).map((school: any, index: number) => (
              <div key={school.school || index} className="flex items-center justify-between p-3 rounded-md border hover:bg-gray-50 dark:hover:bg-gray-900/30 transition-colors">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="text-sm font-medium truncate">{school.school}</div>
                    <BandBadge band={school.band} />
                  </div>
                  {school.confidence && (
                    <ConfidenceBar confidence={school.confidence} />
                  )}
                </div>
              </div>
            ))}
            
            {schools.length > 5 && (
              <div className="text-center pt-2">
                <Link href="/dashboard/predict" className="text-xs text-blue-600 dark:text-blue-400 hover:underline">
                  View all {schools.length} schools →
                </Link>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Running State */}
      {running && (
        <div className="text-center py-4">
          <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
          <div className="text-sm text-muted-foreground">Analyzing your profile...</div>
        </div>
      )}
    </section>
  );
} 