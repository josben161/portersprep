"use client";
import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/apiFetch";

// Document icon component
function DocumentIcon({ className = "" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  );
}

export default function CoreProfileCard(){
  const [p, setP] = useState<any|null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);

  useEffect(()=>{ (async()=>{
    try {
      const r = await fetch("/api/profile");
      if (r.ok) {
        const profileData = await r.json();
        console.log("Initial profile load:", profileData);
        setP(profileData);
      } else {
        // If profile doesn't exist or API fails, create a default one
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

  async function saveProfile(){
    setSaving(true);
    try {
      await apiFetch("/api/profile", { method:"PUT", headers:{ "Content-Type":"application/json" }, body: JSON.stringify(p) });
      // Don't show alert for auto-save
    } catch (error) { 
      console.error("Profile save failed:", error);
      // Only show error for manual saves
    } finally { setSaving(false); }
  }

  // Auto-save profile changes
  useEffect(() => {
    if (p && !loading) {
      const timeoutId = setTimeout(() => {
        saveProfile();
      }, 1000); // Debounce for 1 second
      
      return () => clearTimeout(timeoutId);
    }
  }, [p?.name]);

  if (loading) return <section className="card p-4 text-sm text-muted-foreground">Loading profile…</section>;
  if (!p) return <section className="card p-4 text-sm text-muted-foreground">Failed to load profile</section>;

  return (
    <section className="card p-4">
      <div className="text-xs text-muted-foreground">Core Profile</div>
      <h3 className="text-base font-semibold">Resume & Story Bank</h3>
      
      {message && (
        <div className={`mt-3 rounded-md p-2 text-sm ${
          message.type === 'success' 
            ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-200' 
            : 'bg-rose-50 text-rose-700 dark:bg-rose-900/30 dark:text-rose-200'
        }`}>
          {message.text}
        </div>
      )}
      
      <div className="mt-3 grid gap-2 text-sm sm:grid-cols-2">
        <input className="rounded-md border px-3 py-2" placeholder="Name" value={p.name ?? ""} onChange={e=> setP((v:any)=>({...v, name: e.target.value}))} />
        <input className="rounded-md border px-3 py-2" placeholder="Industry" value={p.industry ?? ""} onChange={e=> setP((v:any)=>({...v, industry: e.target.value}))} />
        <input className="rounded-md border px-3 py-2" placeholder="Years experience" value={p.years_exp ?? ""} onChange={e=> setP((v:any)=>({...v, years_exp: e.target.value}))} />
        <input className="rounded-md border px-3 py-2" placeholder="GPA" value={p.gpa ?? ""} onChange={e=> setP((v:any)=>({...v, gpa: e.target.value}))} />
        <input className="rounded-md border px-3 py-2" placeholder="GMAT" value={p.gmat ?? ""} onChange={e=> setP((v:any)=>({...v, gmat: e.target.value}))} />
        <input className="sm:col-span-2 rounded-md border px-3 py-2" placeholder="Goals (1–2 lines)" value={p.goals ?? ""} onChange={e=> setP((v:any)=>({...v, goals: e.target.value}))} />
      </div>
      
      <div className="mt-3">
        <div className="rounded-md border-2 border-dashed border-gray-300 dark:border-gray-600 p-6 text-center">
          <DocumentIcon className="w-8 h-8 text-gray-400 dark:text-gray-500 mx-auto mb-2" />
          <div className="text-sm text-gray-600 dark:text-gray-400 mb-3">
            CV upload temporarily disabled
          </div>
          <div className="text-xs text-muted-foreground">
            Database migration in progress
          </div>
        </div>
      </div>
      
      <div className="mt-3 flex items-center gap-2 text-sm">
        {saving && <span className="text-xs text-muted-foreground">Saving…</span>}
      </div>
    </section>
  );
} 