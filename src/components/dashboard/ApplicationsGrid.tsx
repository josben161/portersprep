"use client";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Skeleton from "@/components/ui/Skeleton";
import ProgressRing from "@/components/ui/ProgressRing";
import { fmtDate, daysUntil } from "@/lib/date";

type AppCard = { id: string; school?: { id: string; name: string; deadline?: string|null }; status?: string; };

export default function ApplicationsGrid(){
  const [apps, setApps] = useState<AppCard[]|null>(null);
  const [progress, setProgress] = useState<Record<string,{ essays_total:number; essays_done:number; recs_total:number; recs_done:number }>>({});
  const [fit, setFit] = useState<Record<string,string>>({});

  useEffect(()=>{ fetch("/api/applications").then(r=>r.ok?r.json():null).then(setApps).catch(()=> setApps([])); },[]);
  useEffect(()=>{ fetch("/api/applications/progress").then(r=>r.ok?r.json():null).then((rows:any[])=>{
    const map: any = {}; (rows||[]).forEach(row => { map[row.application_id] = { essays_total: row.essays_total, essays_done: row.essays_done, recs_total: row.recs_total, recs_done: row.recs_done }; });
    setProgress(map);
  }).catch(()=>{}); },[]);
  useEffect(()=>{
    fetch("/api/predict").then(r=>r.json()).then((p)=>{
      const map: Record<string,string> = {};
      (p?.result?.schools ?? []).forEach((s:any)=> { map[s.school?.toLowerCase() ?? ""] = s.band; });
      setFit(map);
    }).catch(()=>{});
  },[]);

  return (
    <div className="card p-4">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-xs text-muted-foreground">Applications</div>
          <h3 className="text-base font-semibold">Your schools</h3>
        </div>
        <Link href="/dashboard/applications" className="btn btn-outline text-xs">Manage all</Link>
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {apps === null && (<><Skeleton className="h-28 w-full"/><Skeleton className="h-28 w-full"/><Skeleton className="h-28 w-full"/></>)}
        {(apps ?? []).map(a => {
          const pr = progress[a.id] || { essays_total:0, essays_done:0, recs_total:0, recs_done:0 };
          return <AppItem key={a.id} a={a} pr={pr} fit={fit} />;
        })}
        <Link href="/dashboard/applications" className="flex h-28 items-center justify-center rounded-lg border text-sm hover:bg-black/5 dark:hover:bg-white/5">
          + Add application
        </Link>
      </div>
    </div>
  );
}

function AppItem({ a, pr, fit }:{ a: AppCard, pr?: { essays_total:number; essays_done:number; recs_total:number; recs_done:number }, fit: Record<string,string> }){
  const pct = useMemo(()=>{
    const total = (pr?.essays_total || 0) + (pr?.recs_total || 0);
    const done  = (pr?.essays_done  || 0) + (pr?.recs_done  || 0);
    return Math.round((done / Math.max(1,total)) * 100);
  },[pr]);

  const schoolName = a.school?.name ?? "School";
  const dd = daysUntil(a.school?.deadline ?? null);
  const deadlineBadge = dd === null ? "—" : dd >= 0 ? `${dd}d` : "past";

  return (
    <div className="rounded-lg border p-3">
      <div className="flex items-start justify-between">
        <div className="min-w-0">
          <div className="truncate text-sm font-medium">{schoolName}</div>
          <div className="mt-0.5 text-[11px] text-muted-foreground">
            Deadline: {fmtDate(a.school?.deadline)} • <span className={dd !== null && dd <= 14 ? "text-rose-500" : ""}>{deadlineBadge}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {(() => {
            const band = fit[(a.school?.name ?? "").toLowerCase()];
            return band && (
              <span className={`rounded-full px-2 py-0.5 text-[10px] ${
                band==="reach" ? "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-200"
                : band==="target" ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-200"
                : "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-200"
              }`}>{band}</span>
            );
          })()}
          <ProgressRing value={pct} />
        </div>
      </div>
      <div className="mt-2 text-xs text-muted-foreground">
        {(pr?.essays_done ?? 0)}/{(pr?.essays_total ?? 0)} essays • {(pr?.recs_done ?? 0)}/{(pr?.recs_total ?? 0)} recs
      </div>
      <div className="mt-3 flex gap-2">
        <Link href={`/dashboard/applications/${a.id}/ide`} className="btn btn-primary text-xs">Open workspace</Link>
        <Link href={`/dashboard/applications/${a.id}`} className="btn btn-outline text-xs">Details</Link>
      </div>
    </div>
  );
} 