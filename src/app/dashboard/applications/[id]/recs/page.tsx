"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

type Recommender = { id:string; name:string; email?:string|null; relationship?:string|null; };
type Assignment = { id:string; recommender_id:string; status:"invited"|"drafting"|"submitted" };

export default function AppRecsPage(){
  const params = useParams<{ id: string }>();
  const appId = params.id;
  const [recs, setRecs] = useState<Recommender[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newRel, setNewRel] = useState("");

  async function load(){
    const r = await fetch("/api/recommenders");
    setRecs(r.ok? await r.json(): []);
    const ar = await fetch(`/api/applications/${appId}/recs`);
    if (ar.ok) setAssignments(await ar.json());
  }

  useEffect(()=> { load(); },[appId]);

  async function createRec(){
    const r = await fetch("/api/recommenders", {
      method:"POST", headers:{ "Content-Type":"application/json" },
      body: JSON.stringify({ name:newName, email:newEmail || null, relationship:newRel || null })
    });
    if (!r.ok) { alert(await r.text()); return; }
    setNewName(""); setNewEmail(""); setNewRel("");
    await load();
  }

  async function assign(recommender_id: string){
    const r = await fetch("/api/recommenders/assign", {
      method:"POST", headers:{ "Content-Type":"application/json" },
      body: JSON.stringify({ recommender_id, application_id: appId })
    });
    if (!r.ok) { alert(await r.text()); return; }
    await load();
  }

  async function setStatus(id: string, status: Assignment["status"]){
    const r = await fetch(`/api/recommenders/assign/${id}`, {
      method:"PUT", headers:{ "Content-Type":"application/json" },
      body: JSON.stringify({ status })
    });
    if (!r.ok) { alert(await r.text()); return; }
    await load();
  }

  return (
    <div className="mx-auto max-w-5xl p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Recommenders</h1>
        <Link className="btn btn-outline text-xs" href={`/dashboard/applications/${appId}/ide`}>Back to workspace</Link>
      </div>

      <section className="rounded-lg border p-4">
        <div className="text-sm font-medium">Your recommenders</div>
        <div className="mt-3 grid gap-2 md:grid-cols-2">
          {recs.map(r=>(
            <div key={r.id} className="flex items-center justify-between rounded-md border p-2 text-sm">
              <div>
                <div className="font-medium">{r.name}</div>
                <div className="text-[11px] text-muted-foreground">{r.email ?? "—"} {r.relationship ? `• ${r.relationship}` : ""}</div>
              </div>
              <button className="btn btn-outline text-xs" onClick={()=> assign(r.id)}>Assign</button>
            </div>
          ))}
          {recs.length === 0 && <div className="text-sm text-muted-foreground">No recommenders yet.</div>}
        </div>

        <div className="mt-4 rounded-md border p-3">
          <div className="text-xs text-muted-foreground">Add new recommender</div>
          <div className="mt-2 grid gap-2 md:grid-cols-3">
            <input className="rounded-md border px-2 py-1 text-sm" placeholder="Name" value={newName} onChange={e=> setNewName(e.target.value)} />
            <input className="rounded-md border px-2 py-1 text-sm" placeholder="Email (optional)" value={newEmail} onChange={e=> setNewEmail(e.target.value)} />
            <input className="rounded-md border px-2 py-1 text-sm" placeholder="Relationship (optional)" value={newRel} onChange={e=> setNewRel(e.target.value)} />
          </div>
          <div className="mt-2">
            <button className="btn btn-primary text-xs" onClick={createRec} disabled={!newName}>Save</button>
          </div>
        </div>
      </section>

      <section className="rounded-lg border p-4">
        <div className="text-sm font-medium">Assignments</div>
        <div className="mt-3 space-y-2">
          {assignments.map(a=>(
            <div key={a.id} className="flex items-center justify-between rounded-md border p-2 text-sm">
              <div>
                <div className="font-medium">Assignment</div>
                <div className="text-[11px] text-muted-foreground">Status: {a.status}</div>
              </div>
              <div className="flex gap-2">
                {["invited","drafting","submitted"].map(s=>(
                  <button key={s} className="btn btn-outline text-xs" onClick={()=> setStatus(a.id, s as any)}>{s}</button>
                ))}
              </div>
            </div>
          ))}
          {assignments.length === 0 && <div className="text-sm text-muted-foreground">No assignments yet.</div>}
        </div>
      </section>
    </div>
  );
} 