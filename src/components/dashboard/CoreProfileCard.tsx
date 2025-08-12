"use client";
import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/apiFetch";

export default function CoreProfileCard(){
  const [p, setP] = useState<any|null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  useEffect(()=>{ (async()=>{
    try {
      const r = await fetch("/api/profile");
      if (r.ok) {
        setP(await r.json());
      } else {
        // If profile doesn't exist, create a default one
        setP({
          name: "",
          email: "",
          subscription_tier: "free",
          resume_key: null,
          goals: "",
          industry: "",
          years_exp: null,
          gpa: null,
          gmat: null
        });
      }
    } catch (error) {
      console.error("Failed to load profile:", error);
      // Set default profile on error
      setP({
        name: "",
        email: "",
        subscription_tier: "free",
        resume_key: null,
        goals: "",
        industry: "",
        years_exp: null,
        gpa: null,
        gmat: null
      });
    } finally {
      setLoading(false);
    }
  })(); },[]);

  async function uploadCV(file: File){
    try {
      console.log("Starting CV upload for file:", file.name);
      
      // Use server-side upload to avoid CORS issues
      const formData = new FormData();
      formData.append('file', file);
      
      const r = await apiFetch("/api/upload-cv", {
        method: "POST",
        body: formData
      });
      
      if (!r.ok) {
        const errorText = await r.text();
        console.error("CV upload failed:", errorText);
        alert(`Upload failed: ${errorText}`);
        return;
      }
      
      const result = await r.json();
      console.log("CV upload completed successfully:", result);
      
      // Refresh profile data
      const rr = await fetch("/api/profile"); 
      setP(rr.ok? await rr.json(): p);
      
      alert("CV uploaded successfully!");
      
    } catch (error) {
      console.error("CV upload error:", error);
      alert(`Upload failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async function saveProfile(){
    setSaving(true);
    try {
      await apiFetch("/api/profile", { method:"PUT", headers:{ "Content-Type":"application/json" }, body: JSON.stringify(p) });
      alert("Saved");
    } catch { alert("Save failed"); } finally { setSaving(false); }
  }

  if (loading) return <section className="card p-4 text-sm text-muted-foreground">Loading profile…</section>;
  if (!p) return <section className="card p-4 text-sm text-muted-foreground">Failed to load profile</section>;

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
          <input 
            type="file" 
            className="hidden" 
            accept=".pdf,.doc,.docx,.txt" 
            onChange={e=> { 
              const f = e.target.files?.[0]; 
              if (f) {
                const ext = f.name.split('.').pop()?.toLowerCase();
                const allowedExtensions = ['pdf', 'doc', 'docx', 'txt'];
                if (!allowedExtensions.includes(ext || '')) {
                  alert(`Please select a PDF, Word document, or text file. Got: .${ext}`);
                  return;
                }
                uploadCV(f); 
              }
            }} 
          />
        </label>
        <button className="btn btn-primary text-xs" onClick={saveProfile} disabled={saving}>{saving? "Saving…" : "Save profile"}</button>
        {p.resume_key && <span className="text-xs text-muted-foreground">CV on file</span>}
      </div>
    </section>
  );
} 