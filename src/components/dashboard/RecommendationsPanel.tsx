"use client";
import { useEffect, useState } from "react";
import Skeleton from "@/components/ui/Skeleton";
import PrepPackModal from "./PrepPackModal";

type Recommender = { id: string; name: string; email?: string|null; assigned?: number; completed?: number; };

export default function RecommendationsPanel(){
  const [data, setData] = useState<Recommender[]|null>(null);
  const [newRec, setNewRec] = useState({ name:"", email:"", relationship:"" });

  useEffect(()=>{ refresh(); },[]);
  async function refresh(){ const r = await fetch("/api/recommenders"); setData(r.ok ? await r.json() : []); }

  async function create(){
    if(!newRec.name) return;
    const r = await fetch("/api/recommenders", { method:"POST", headers:{ "Content-Type":"application/json" }, body: JSON.stringify(newRec) });
    if (r.ok) { setNewRec({ name:"", email:"", relationship:"" }); refresh(); }
  }

  return (
    <div className="card p-4">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-xs text-muted-foreground">Recommendations</div>
          <h3 className="text-base font-semibold">Recommender progress</h3>
        </div>
        <div className="flex gap-2">
          <input className="w-40 rounded-md border px-2 py-1 text-xs" placeholder="Name" value={newRec.name} onChange={e=>setNewRec(v=>({...v,name:e.target.value}))} />
          <input className="w-44 rounded-md border px-2 py-1 text-xs" placeholder="Email (optional)" value={newRec.email} onChange={e=>setNewRec(v=>({...v,email:e.target.value}))} />
          <button className="btn btn-outline text-xs" onClick={create}>Add</button>
          <PrepPackModal />
        </div>
      </div>

      <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {data === null && (<>
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
        </>)}
        {(data ?? []).length === 0 && <div className="text-sm text-muted-foreground">No recommenders yet.</div>}
        {(data ?? []).map(r=>(
          <div key={r.id} className="rounded-md border p-3 text-sm">
            <div className="font-medium">{r.name}</div>
            <div className="text-[11px] text-muted-foreground">{r.email ?? "—"}</div>
            <div className="mt-1 text-[12px] text-muted-foreground">Assigned: {r.assigned ?? 0} • Completed: {r.completed ?? 0}</div>
            <div className="mt-2 flex gap-2">
              <button className="btn btn-outline text-xs">Prep pack</button>
              <button className="btn btn-outline text-xs">Manage</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 