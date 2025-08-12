"use client";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

type Recommender = { id:string; name:string; email?:string|null; relationship?:string|null; assigned?:number; completed?:number; };
type AppLite = { id:string; school?:{ id:string; name:string } };

export default function RecsPage(){
  const [recs, setRecs] = useState<Recommender[]>([]);
  const [apps, setApps] = useState<AppLite[]>([]);
  const [selectedApp, setSelectedApp] = useState<string>("");

  useEffect(()=>{ (async()=>{
    const r1 = await fetch("/api/recommenders"); setRecs(r1.ok? await r1.json(): []);
    const r2 = await fetch("/api/applications"); setApps(r2.ok? await r2.json(): []);
  })(); },[]);

  const app = useMemo(()=> apps.find(a=> a.id === selectedApp) ?? null, [apps, selectedApp]);
  const [school, setSchool] = useState<any|null>(null);
  useEffect(()=>{ (async()=>{
    if (!selectedApp) return setSchool(null);
    const r = await fetch(`/api/applications/${selectedApp}/school`);
    setSchool(r.ok ? await r.json() : null);
  })(); },[selectedApp]);

  return (
    <div className="mx-auto max-w-5xl p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Recommendations</h1>
          <p className="text-sm text-muted-foreground">Assign recommenders per school and share school-specific guidance.</p>
        </div>
        <Link href="/dashboard" className="btn btn-outline text-xs">Back</Link>
      </div>

      <div className="rounded-md border p-3">
        <div className="text-xs text-muted-foreground">Select application</div>
        <select className="mt-1 w-full rounded-md border px-3 py-2 text-sm" value={selectedApp} onChange={e=> setSelectedApp(e.target.value)}>
          <option value="">— Choose a school —</option>
          {apps.map(a=> <option key={a.id} value={a.id}>{a.school?.name ?? "School"}</option>)}
        </select>
      </div>

      {app && school && (
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-md border p-3">
            <div className="text-sm font-medium">{school.name} — LOR Requirements</div>
            <div className="mt-2 text-xs text-muted-foreground">
              {school.lor ? <>Letters required: <b>{school.lor.count}</b> • Format: <b>{school.lor.format}</b></> : "Not specified"}
            </div>
            <div className="mt-2 text-xs">
              {school.video_assessment ? <>Video: <b>{school.video_assessment.provider}</b> — {school.video_assessment.notes ?? ""}</> : null}
            </div>
            <div className="mt-2 text-[11px] text-muted-foreground">
              Source: <a href={school.essays?.[0]?.source_url ?? "#"} target="_blank" rel="noreferrer" className="underline">official</a>
            </div>
          </div>

          <div className="rounded-md border p-3">
            <div className="text-sm font-medium">Assign recommenders to {school.name}</div>
            <AssignList appId={app.id} recs={recs} />
          </div>
        </div>
      )}
    </div>
  );
}

function AssignList({ appId, recs }:{ appId:string; recs:Recommender[] }){
  const [assigned, setAssigned] = useState<Record<string, boolean>>({});
  useEffect(()=>{ (async()=>{
    const r = await fetch("/api/recommenders"); // simple refresh after assign
    // Could fetch assignment list; for MVP we just allow quick POST
  })(); },[appId]);

  async function assign(recommender_id: string){
    await fetch("/api/recommenders/assign", { method:"POST", headers:{"Content-Type":"application/json"}, body: JSON.stringify({ recommender_id, application_id: appId }) });
    setAssigned(prev => ({ ...prev, [recommender_id]: true }));
  }

  return (
    <div className="space-y-2">
      {recs.length === 0 && <div className="text-sm text-muted-foreground">No recommenders yet. Add in dashboard.</div>}
      {recs.map(r=> (
        <div key={r.id} className="flex items-center justify-between rounded-md border p-2 text-sm">
          <div>
            <div className="font-medium">{r.name}</div>
            <div className="text-[11px] text-muted-foreground">{r.email ?? "—"}</div>
          </div>
          <button className="btn btn-outline text-xs" onClick={()=> assign(r.id)} disabled={assigned[r.id]}>Assign</button>
        </div>
      ))}
    </div>
  );
} 