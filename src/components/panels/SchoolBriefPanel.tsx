"use client";
import { useEffect, useState } from "react";

export default function SchoolBriefPanel({ brief, schoolName }: { brief?: any; schoolName?: string }) {
  const [prediction, setPrediction] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [rerunning, setRerunning] = useState(false);

  // Load prediction data
  useEffect(() => {
    if (!schoolName) return;
    fetch("/api/predict")
      .then(r => r.json())
      .then((p) => {
        if (p?.result?.schools) {
          const schoolPred = p.result.schools.find((s: any) => 
            s.school?.toLowerCase() === schoolName?.toLowerCase()
          );
          setPrediction(schoolPred);
        }
      })
      .catch(() => {});
  }, [schoolName]);

  // Re-run prediction
  async function rerunPrediction() {
    setRerunning(true);
    try {
      const r = await fetch("/api/assessment/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          // Send current profile snapshot - you may need to adjust this based on your API
          profile_snapshot: true 
        })
      });
      if (r.ok) {
        // Refresh prediction data
        const p = await fetch("/api/predict").then(r => r.json());
        if (p?.result?.schools) {
          const schoolPred = p.result.schools.find((s: any) => 
            s.school?.toLowerCase() === schoolName?.toLowerCase()
          );
          setPrediction(schoolPred);
        }
      }
    } finally {
      setRerunning(false);
    }
  }

  return (
    <div className="space-y-4 text-sm">
      {/* Prediction Section */}
      <div>
        <div className="text-xs text-muted-foreground mb-2">School Fit Prediction</div>
        {loading ? (
          <div className="text-muted-foreground">Loading prediction...</div>
        ) : prediction ? (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className={`rounded-full px-2 py-1 text-xs font-medium ${
                prediction.band === "reach" ? "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-200"
                : prediction.band === "target" ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-200"
                : "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-200"
              }`}>
                {prediction.band?.toUpperCase()}
              </span>
              <button 
                onClick={rerunPrediction}
                disabled={rerunning}
                className="btn btn-outline text-xs"
              >
                {rerunning ? "Running..." : "Re-run Prediction"}
              </button>
            </div>
            {prediction.notes && (
              <div className="rounded-md border bg-muted/40 p-2 text-xs">
                <div className="font-medium mb-1">Notes:</div>
                <div className="text-muted-foreground">{prediction.notes}</div>
              </div>
            )}
            {prediction.score && (
              <div className="text-xs text-muted-foreground">
                Fit Score: {prediction.score}/10
              </div>
            )}
          </div>
        ) : (
          <div className="text-muted-foreground">
            No prediction data available.
            <button 
              onClick={rerunPrediction}
              disabled={rerunning}
              className="btn btn-outline text-xs ml-2"
            >
              {rerunning ? "Running..." : "Run Prediction"}
            </button>
          </div>
        )}
      </div>

      {/* School Brief Section */}
      <div>
        <div className="text-xs text-muted-foreground mb-2">School Brief</div>
        {!brief ? (
          <div className="text-muted-foreground">No brief loaded. Add a brief in your school data to help the AI match tone/values.</div>
        ) : (
          <pre className="whitespace-pre-wrap rounded-md border bg-muted/40 p-2 text-xs">{JSON.stringify(brief, null, 2)}</pre>
        )}
      </div>
    </div>
  );
} 