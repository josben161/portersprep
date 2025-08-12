"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

function BandBadge({ band }: { band?: string }) {
  if (!band) return null;
  const cls =
    band === "reach"
      ? "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-200"
      : band === "target"
      ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-200"
      : "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-200";
  return <span className={`rounded-full px-2 py-0.5 text-[10px] ${cls}`}>{band}</span>;
}

export default function PredictCard() {
  const [pred, setPred] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [running, setRunning] = useState(false);

  async function refresh() {
    setLoading(true);
    try {
      const r = await fetch("/api/predict");
      if (r.ok) setPred(await r.json());
    } finally {
      setLoading(false);
    }
  }

  async function runFromProfile(){
    setRunning(true);
    try {
      const r = await fetch("/api/predict/run", { method:"POST" });
      if (!r.ok) alert(await r.text());
      await refresh();
    } finally { setRunning(false); }
  }

  useEffect(() => { refresh(); }, []);

  return (
    <section className="card p-4">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-xs text-muted-foreground">Predict My Chances</div>
          <h3 className="text-base font-semibold">Fit score by school</h3>
        </div>
        <div className="flex gap-2">
          <Link href="/dashboard/predict" className="btn btn-outline text-xs">History</Link>
          <button className="btn btn-primary text-xs" onClick={runFromProfile} disabled={running}>{running? "Running…" : "Run from profile"}</button>
        </div>
      </div>

      {loading && <div className="mt-4 text-sm text-muted-foreground">Loading prediction…</div>}

      {!loading && !pred && (
        <div className="mt-4 text-sm">No prediction yet. Click <b>Run from profile</b> to generate.</div>
      )}

      {!loading && pred && (
        <div className="mt-4 space-y-2 text-sm">
          <div className="text-xs text-muted-foreground">
            Last run: {new Date(pred.created_at).toLocaleString()}
          </div>
          {(pred.result?.schools ?? []).map((s: any) => (
            <div key={s.school} className="flex items-center justify-between rounded border p-2">
              <div className="truncate">{s.school}</div>
              <BandBadge band={s.band} />
            </div>
          ))}
          {(!pred.result?.schools || pred.result.schools.length === 0) && (
            <div className="text-muted-foreground">No schools in the last run.</div>
          )}
        </div>
      )}
    </section>
  );
} 