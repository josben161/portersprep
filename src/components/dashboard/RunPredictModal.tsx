"use client";
import { useState } from "react";
import { apiFetch } from "@/lib/apiFetch";

export default function RunPredictModal({ onDone }:{ onDone?: ()=>void }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    resumeText: "",
    gmat: "",
    gpa: "",
    yearsExp: "",
    industry: "",
    roles: "",
    goals: "",
    targetSchools: ""
  });

  async function submit() {
    const payload = {
      resumeText: form.resumeText.trim(),
      gmat: form.gmat ? Number(form.gmat) : undefined,
      gpa: form.gpa ? Number(form.gpa) : undefined,
      yearsExp: form.yearsExp ? Number(form.yearsExp) : undefined,
      industry: form.industry || undefined,
      roles: form.roles ? form.roles.split(",").map(s=>s.trim()).filter(Boolean) : [],
      goals: form.goals.trim(),
      targetSchools: form.targetSchools.split(",").map(s=>s.trim()).filter(Boolean)
    };
    setLoading(true);
    try {
      const r = await apiFetch("/api/assessment/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (r.ok) {
        onDone?.();
        setOpen(false);
      } else {
        const msg = await r.text();
        alert(msg || "Prediction failed");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <button className="btn btn-primary text-xs" onClick={()=> setOpen(true)}>Run Prediction</button>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={()=> setOpen(false)}>
          <div className="w-full max-w-2xl rounded-lg border bg-card p-4" onClick={e=>e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <div className="text-base font-semibold">Run Prediction</div>
              <button className="text-sm text-muted-foreground" onClick={()=> setOpen(false)}>✕</button>
            </div>
            <div className="mt-3 grid gap-2 text-sm">
              <textarea className="h-28 w-full rounded-md border px-3 py-2" placeholder="Paste your resume / CV summary" value={form.resumeText} onChange={e=> setForm(v=>({...v, resumeText: e.target.value}))} />
              <input className="rounded-md border px-3 py-2" placeholder="Target schools (comma‑separated)" value={form.targetSchools} onChange={e=> setForm(v=>({...v, targetSchools: e.target.value}))} />
              <input className="rounded-md border px-3 py-2" placeholder="Career goals (1–2 lines)" value={form.goals} onChange={e=> setForm(v=>({...v, goals: e.target.value}))} />
              <div className="grid gap-2 sm:grid-cols-3">
                <input className="rounded-md border px-3 py-2" placeholder="GMAT (opt.)" value={form.gmat} onChange={e=> setForm(v=>({...v, gmat: e.target.value}))} />
                <input className="rounded-md border px-3 py-2" placeholder="GPA (opt.)" value={form.gpa} onChange={e=> setForm(v=>({...v, gpa: e.target.value}))} />
                <input className="rounded-md border px-3 py-2" placeholder="Years exp (opt.)" value={form.yearsExp} onChange={e=> setForm(v=>({...v, yearsExp: e.target.value}))} />
              </div>
              <div className="grid gap-2 sm:grid-cols-3">
                <input className="rounded-md border px-3 py-2" placeholder="Industry (opt.)" value={form.industry} onChange={e=> setForm(v=>({...v, industry: e.target.value}))} />
                <input className="rounded-md border px-3 py-2 sm:col-span-2" placeholder="Roles (comma‑separated; opt.)" value={form.roles} onChange={e=> setForm(v=>({...v, roles: e.target.value}))} />
              </div>
              <div className="flex gap-2">
                <button className="btn btn-primary text-xs" onClick={submit} disabled={loading}>{loading? "Running…" : "Run"}</button>
                <button className="btn btn-outline text-xs" onClick={()=> setOpen(false)}>Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
} 