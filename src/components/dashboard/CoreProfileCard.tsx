"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Skeleton from "@/components/ui/Skeleton";

export default function CoreProfileCard(){
  const [usage, setUsage] = useState<any|null>(null);
  const [stories, setStories] = useState<any[]|null>(null);

  useEffect(()=>{ fetch("/api/me/usage").then(r=>r.ok?r.json():null).then(setUsage).catch(()=>{}); },[]);
  useEffect(()=>{ fetch("/api/stories").then(r=>r.ok?r.json():null).then(setStories).catch(()=>{}); },[]);

  const completePct = (() => {
    const parts = [
      Math.min(1, (usage?.stories_count ?? 0) / 3), // arbitrary baseline
      1 // resume soon (placeholder)
    ];
    return Math.round((parts.reduce((a,b)=>a+b,0)/parts.length)*100);
  })();

  return (
    <div className="card p-4">
      <div className="flex items-start justify-between">
        <div>
          <div className="text-xs text-muted-foreground">Core Profile</div>
          <h3 className="text-base font-semibold">Resume & Story Bank</h3>
        </div>
        <div className="text-xs text-muted-foreground">{completePct}% complete</div>
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <div className="rounded-md border p-3">
          <div className="flex items-center justify-between">
            <div className="text-sm font-medium">Resume / CV</div>
            <Link href="/dashboard/stories" className="text-xs text-brand-500 hover:underline">Open</Link>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            Parse your resume to extract facts (education, roles, awards). Use them in essays with one click.
          </p>
          <div className="mt-3">
            <button className="btn btn-outline text-xs">Upload or Paste</button>
          </div>
        </div>

        <div className="rounded-md border p-3">
          <div className="flex items-center justify-between">
            <div className="text-sm font-medium">Story Bank</div>
            <Link href="/dashboard/stories" className="text-xs text-brand-500 hover:underline">Manage</Link>
          </div>
          <div className="mt-2 flex gap-2 overflow-x-auto pb-2">
            {stories === null && (<>
              <Skeleton className="h-14 w-40" />
              <Skeleton className="h-14 w-40" />
              <Skeleton className="h-14 w-40" />
            </>)}
            {(stories ?? []).slice(0,6).map((s:any)=>(
              <div key={s.id} className="min-w-40 rounded-md border p-2">
                <div className="line-clamp-1 text-xs font-medium">{s.title}</div>
                <div className="mt-1 flex flex-wrap gap-1">
                  {(s.tags ?? []).slice(0,3).map((t:string)=>(
                    <span key={t} className="rounded-full border px-2 py-0.5 text-[10px] text-muted-foreground">{t}</span>
                  ))}
                </div>
              </div>
            ))}
            {(stories ?? []).length === 0 && (
              <div className="text-xs text-muted-foreground">No stories yet.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 