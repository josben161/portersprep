"use client";
import { useEffect, useState } from "react";
import Skeleton from "@/components/ui/Skeleton";
import PrepPackModal from "./PrepPackModal";

type Recommender = { id: string; name: string; email?: string|null; relationship?: string|null; assigned?: number; completed?: number; };
type AppOpt = { id: string; label: string };

export default function RecommendationsPanel(){
  const [data, setData] = useState<Recommender[]|null>(null);
  const [newRec, setNewRec] = useState({ name:"", email:"", relationship:"" });
  const [apps, setApps] = useState<AppOpt[]>([]);

  async function refresh(){ const r = await fetch("/api/recommenders"); setData(r.ok ? await r.json() : []); }
  useEffect(()=>{ refresh(); },[]);
  useEffect(()=>{ (async()=>{ const r = await fetch("/api/applications"); const j = r.ok ? await r.json() : []; setApps(j.map((x:any)=>({ id:x.id, label: x.school?.name || "School" }))); })(); },[]);

  async function create(){
    if(!newRec.name) return;
    const r = await fetch("/api/recommenders", { method:"POST", headers:{ "Content-Type":"application/json" }, body: JSON.stringify(newRec) });
    if (r.ok) { setNewRec({ name:"", email:"", relationship:"" }); refresh(); }
  }
  async function assign(recommenderId: string, applicationId: string){
    if (!applicationId) return;
    await fetch("/api/recommenders/assign", { method:"POST", headers:{ "Content-Type":"application/json" }, body: JSON.stringify({ recommender_id: recommenderId, application_id: applicationId }) });
    refresh();
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
              <select className="w-full rounded-md border px-2 py-1 text-xs" onChange={(e)=> assign(r.id, e.target.value)} defaultValue="">
                <option value="" disabled>Assign to application…</option>
                {apps.map(a=> <option key={a.id} value={a.id}>{a.label}</option>)}
              </select>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 