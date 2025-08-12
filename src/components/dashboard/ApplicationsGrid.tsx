"use client";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Skeleton from "@/components/ui/Skeleton";
import ProgressRing from "@/components/ui/ProgressRing";
import { fmtDate, daysUntil } from "@/lib/date";

type AppCard = {
  id: string;
  school?: { id: string; name: string; deadline?: string|null };
  status?: string;
  progress?: { essays: number; total: number; recs?: number; recsTotal?: number };
};

export default function ApplicationsGrid(){
  const [apps, setApps] = useState<AppCard[]|null>(null);

  useEffect(()=>{
    fetch("/api/applications").then(r=>r.ok?r.json():null).then(setApps).catch(()=> setApps([]));
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
        {apps === null && <>
          <Skeleton className="h-28 w-full" />
          <Skeleton className="h-28 w-full" />
          <Skeleton className="h-28 w-full" />
        </>}
        {(apps ?? []).map(a => <AppItem key={a.id} a={a} />)}
        <Link href="/dashboard/applications" className="flex h-28 items-center justify-center rounded-lg border text-sm hover:bg-black/5 dark:hover:bg-white/5">
          + Add application
        </Link>
      </div>
    </div>
  );
}

function AppItem({ a }:{ a: AppCard }){
  const pct = useMemo(()=>{
    const done = a.progress?.essays ?? 0;
    const total = a.progress?.total ?? 1;
    return Math.round((done/Math.max(1,total))*100);
  },[a]);

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
        <ProgressRing value={pct} />
      </div>
      <div className="mt-2 text-xs text-muted-foreground">
        {a.progress?.essays ?? 0}/{a.progress?.total ?? 0} essays • {a.progress?.recs ?? 0}/{a.progress?.recsTotal ?? 0} recs
      </div>
      <div className="mt-3 flex gap-2">
        <Link href={`/dashboard/applications/${a.id}/ide`} className="btn btn-primary text-xs">Open workspace</Link>
        <Link href={`/dashboard/applications/${a.id}`} className="btn btn-outline text-xs">Details</Link>
      </div>
    </div>
  );
} 