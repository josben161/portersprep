"use client";
import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/apiFetch";

export default function CoreProfileCard(){
  const [p, setP] = useState<any|null>(null);
  const [saving, setSaving] = useState(false);
  useEffect(()=>{ (async()=>{
    const r = await fetch("/api/profile");
    setP(r.ok? await r.json(): null);
  })(); },[]);

  async function uploadCV(file: File){
    const r = await apiFetch(`/api/s3-presign?ext=${encodeURIComponent(file.name.split(".").pop()||"pdf")}`);
    if (!r.ok) { alert(await r.text()); return; }
    const { url, key } = await r.json();
    const put = await fetch(url, { method:"PUT", headers: { "Content-Type": file.type || "application/octet-stream" }, body: file });
    if (!put.ok) { alert("Upload failed"); return; }
    // Save resume_key on profile
    await apiFetch("/api/profile", { method:"PUT", headers:{ "Content-Type":"application/json" }, body: JSON.stringify({ resume_key: key }) });
    const rr = await fetch("/api/profile"); setP(rr.ok? await rr.json(): p);
  }

  async function saveProfile(){
    setSaving(true);
    try {
      await apiFetch("/api/profile", { method:"PUT", headers:{ "Content-Type":"application/json" }, body: JSON.stringify(p) });
      alert("Saved");
    } catch { alert("Save failed"); } finally { setSaving(false); }
  }

  if (!p) return <section className="card p-4 text-sm text-muted-foreground">Loading profile…</section>;

  return (
    <section className="card p-4">
      <div className="text-xs text-muted-foreground">Core Profile</div>
      <h3 className="text-base font-semibold">Resume & Story Bank</h3>
      <div className="mt-3 grid gap-2 text-sm sm:grid-cols-2">
        <input className="rounded-md border px-3 py-2" placeholder="Name" value={p.name ?? ""} onChange={e=> setP((v:any)=>({...v, name: e.target.value}))} />
        <input className="rounded-md border px-3 py-2" placeholder="Industry" value={p.industry ?? ""} onChange={e=> setP((v:any)=>({...v, industry: e.target.value}))} />
        <input className="rounded-md border px-3 py-2" placeholder="Years experience" value={p.years_exp ?? ""} onChange={e=> setP((v:any)=>({...v, years_exp: e.target.value}))} />
        <input className="rounded-md border px-3 py-2" placeholder="GPA" value={p.gpa ?? ""} onChange={e=> setP((v:any)=>({...v, gpa: e.target.value}))} />
        <input className="rounded-md border px-3 py-2" placeholder="GMAT" value={p.gmat ?? ""} onChange={e=> setP((v:any)=>({...v, gmat: e.target.value}))} />
        <input className="sm:col-span-2 rounded-md border px-3 py-2" placeholder="Goals (1–2 lines)" value={p.goals ?? ""} onChange={e=> setP((v:any)=>({...v, goals: e.target.value}))} />
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-2 text-sm">
        <label className="btn btn-outline text-xs">
          Upload CV
          <input type="file" className="hidden" accept=".pdf,.doc,.docx,.txt" onChange={e=> { const f = e.target.files?.[0]; if (f) uploadCV(f); }} />
        </label>
        <button className="btn btn-primary text-xs" onClick={saveProfile} disabled={saving}>{saving? "Saving…" : "Save profile"}</button>
        {p.resume_key && <span className="text-xs text-muted-foreground">CV on file</span>}
      </div>
    </section>
  );
} 