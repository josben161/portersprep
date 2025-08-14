"use client";
import { useState } from "react";
import { apiFetch } from "@/lib/apiFetch";
import Link from "next/link";

export default function RunPredictModal({ onDone }: { onDone?: () => void }) {
  const [loading, setLoading] = useState(false);
  const [insufficientContext, setInsufficientContext] = useState<any>(null);

  async function runPrediction() {
    setLoading(true);
    setInsufficientContext(null);
    
    try {
      const r = await apiFetch("/api/predict/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });
      
      if (r.ok) {
        onDone?.();
      } else {
        const data = await r.json();
        if (data.error === "insufficient_context") {
          setInsufficientContext(data);
        } else {
          alert(data.message || "Prediction failed");
        }
      }
    } catch (error) {
      console.error("Prediction error:", error);
      alert("Failed to run prediction. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <button
        className="bg-blue-600 hover:bg-blue-700 text-white rounded-md px-3 py-2 text-xs transition-colors"
        onClick={runPrediction}
        disabled={loading}
      >
        {loading ? "Running..." : "Run Prediction"}
      </button>
      
      {insufficientContext && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onClick={() => setInsufficientContext(null)}
        >
          <div
            className="w-full max-w-2xl rounded-lg border bg-card p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="text-lg font-semibold">Complete Your Profile</div>
              <button
                className="text-sm text-muted-foreground hover:text-foreground"
                onClick={() => setInsufficientContext(null)}
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                {insufficientContext.message}
              </p>
              
              <div className="bg-muted/50 rounded-lg p-4">
                <div className="text-sm font-medium mb-2">Profile Completeness: {insufficientContext.profileCompleteness}%</div>
                <div className="space-y-2 text-sm">
                  {insufficientContext.missing.resume && (
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                      <span>Upload your resume/CV</span>
                    </div>
                  )}
                  {insufficientContext.missing.profile && (
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                      <span>Complete your profile information</span>
                    </div>
                  )}
                  {insufficientContext.missing.applications && (
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
                      <span>Add target schools to your applications</span>
                    </div>
                  )}
                  {insufficientContext.missing.essays && (
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
                      <span>Start working on your essays</span>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex gap-2">
                <Link
                  href="/dashboard"
                  className="bg-blue-600 hover:bg-blue-700 text-white rounded-md px-3 py-2 text-xs transition-colors"
                  onClick={() => setInsufficientContext(null)}
                >
                  Complete Profile
                </Link>
                <button
                  className="btn btn-outline text-xs"
                  onClick={() => setInsufficientContext(null)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
