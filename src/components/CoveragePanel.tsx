"use client";
import { useEffect, useState } from "react";

export default function CoveragePanel({ applicationId }:{ applicationId: string }){
  const [data, setData] = useState<any>({ current:[], all:[] });
  useEffect(()=>{ fetch(`/api/coverage/${applicationId}`).then(r=>r.json()).then(setData); },[applicationId]);

  // Aggregate story usage
  const agg = new Map<string, { title:string; tags:string[]; here:number; total:number }>();
  for(const row of data.all){
    const id = row.story_id;
    const entry = agg.get(id) ?? { title: row.anchor_stories?.title ?? "Story", tags: row.anchor_stories?.tags ?? [], here:0, total:0 };
    entry.total += 1;
    agg.set(id, entry);
  }
  for(const row of data.current){
    const id = row.story_id;
    const entry = agg.get(id) ?? { title: row.anchor_stories?.title ?? "Story", tags: row.anchor_stories?.tags ?? [], here:0, total:0 };
    entry.here += 1;
    agg.set(id, entry);
  }

  const rows = Array.from(agg.entries()).map(([id,v])=>({ id, ...v }));

  return (
    <div className="rounded-lg border p-4">
      <div className="text-sm font-semibold">Story Coverage</div>
      <div className="mt-2 text-xs text-muted-foreground">Aim for diverse primary stories across schools.</div>
      <div className="mt-3 space-y-2">
        {rows.map(r=>(
          <div key={r.id} className="rounded-md border p-2">
            <div className="flex items-center justify-between text-sm">
              <div className="font-medium">{r.title}</div>
              <div className="text-xs text-muted-foreground">{r.here} here • {r.total} total</div>
            </div>
            <div className="mt-1 flex flex-wrap gap-1 text-[10px]">
              {r.tags.map((t:string)=> <span key={t} className="rounded bg-secondary px-2 py-0.5">{t}</span>)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 