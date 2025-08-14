"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import RunPredictModal from "@/components/dashboard/RunPredictModal";

type Prediction = {
  id: string;
  created_at: string;
  result: {
    schools: Array<{
      school: string;
      band: string;
      confidence?: number;
    }>;
  };
};

function BandBadge({ band }: { band: string }) {
  const cls =
    band === "reach"
      ? "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-200"
      : band === "target"
        ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-200"
        : "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-200";
  return (
    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${cls}`}>
      {band}
    </span>
  );
}

export default function PredictPage() {
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [loading, setLoading] = useState(true);

  async function refresh() {
    setLoading(true);
    try {
      const r = await fetch("/api/predict/history");
      if (r.ok) {
        const data = await r.json();
        setPredictions(data);
      }
    } catch (error) {
      console.error("Failed to load predictions:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refresh();
  }, []);

  return (
    <div className="mx-auto max-w-4xl p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Predict My Chances</h1>
          <p className="text-sm text-muted-foreground">
            View your fit scores by school and run new predictions.
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/dashboard" className="btn btn-outline text-xs">
            Back to Dashboard
          </Link>
          <RunPredictModal onDone={refresh} />
        </div>
      </div>

      {loading && (
        <div className="space-y-4">
          <div className="h-8 w-48 animate-pulse rounded-md bg-black/5 dark:bg-white/5" />
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-20 w-full animate-pulse rounded-md bg-black/5 dark:bg-white/5"
              />
            ))}
          </div>
        </div>
      )}

      {!loading && predictions.length === 0 && (
        <div className="rounded-md border p-8 text-center">
          <div className="text-lg font-medium mb-2">No predictions yet</div>
          <div className="text-sm text-muted-foreground mb-4">
            Run your first prediction to see your fit scores by school.
          </div>
          <RunPredictModal onDone={refresh} />
        </div>
      )}

      {!loading && predictions.length > 0 && (
        <div className="space-y-4">
          {predictions.map((pred) => (
            <div key={pred.id} className="rounded-md border p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="text-sm text-muted-foreground">
                  {new Date(pred.created_at).toLocaleString()}
                </div>
                <div className="text-xs text-muted-foreground">
                  {pred.result.schools.length} schools
                </div>
              </div>

              <div className="grid gap-2">
                {pred.result.schools.map((school, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between rounded border p-2"
                  >
                    <div className="truncate">{school.school}</div>
                    <div className="flex items-center gap-2">
                      {school.confidence && (
                        <span className="text-xs text-muted-foreground">
                          {Math.round(school.confidence * 100)}%
                        </span>
                      )}
                      <BandBadge band={school.band} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
