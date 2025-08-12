"use client";
import { useEffect, useState } from "react";

type Story = {
  id: string; title: string; summary: string; detail?: string;
  tags: string[]; strength: number; updated_at: string;
};

export default function StoriesPage(){
  const [stories, setStories] = useState<Story[]>([]);
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<any>({ title:"", summary:"", tags:[], strength:3 });

  async function load(){ setStories(await fetch("/api/stories").then(r=>r.json())); }
  useEffect(()=>{ load(); },[]);

  async function save(){
    const r = await fetch("/api/stories", { method:"POST", headers:{ "Content-Type":"application/json" }, body: JSON.stringify(draft)});
    if(r.ok){ setOpen(false); setDraft({ title:"", summary:"", tags:[], strength:3 }); load(); }
    else alert("Save failed");
  }

  return (
    <div className="mx-auto max-w-6xl p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Story Bank</h1>
        <button onClick={()=>setOpen(true)} className="rounded-md bg-primary px-3 py-2 text-primary-foreground">New story</button>
      </div>

      {open && (
        <div className="mt-4 rounded-lg border p-4 space-y-3">
          <input className="w-full rounded-md border px-3 py-2" placeholder="Title" value={draft.title} onChange={e=>setDraft({...draft,title:e.target.value})}/>
          <textarea className="w-full rounded-md border p-3" rows={4} placeholder="Summary (3–5 sentences)" value={draft.summary} onChange={e=>setDraft({...draft,summary:e.target.value})}/>
          <input className="w-full rounded-md border px-3 py-2" placeholder="Tags (comma‑separated)" onChange={e=>setDraft({...draft,tags:e.target.value.split(",").map((s)=>s.trim()).filter(Boolean)})}/>
          <div className="flex items-center gap-2">
            <label className="text-sm">Strength</label>
            <input type="range" min={1} max={5} value={draft.strength} onChange={e=>setDraft({...draft,strength:Number(e.target.value)})}/>
            <span className="text-xs">{draft.strength}/5</span>
          </div>
          <div className="flex gap-2">
            <button onClick={save} className="rounded-md bg-primary px-3 py-2 text-primary-foreground">Save</button>
            <button onClick={()=>setOpen(false)} className="rounded-md border px-3 py-2">Cancel</button>
          </div>
        </div>
      )}

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {stories.map(s=>(
          <div key={s.id} className="rounded-lg border p-4">
            <div className="flex items-center justify-between">
              <div className="font-medium">{s.title}</div>
              <div className="text-xs text-muted-foreground">Updated {new Date(s.updated_at).toLocaleDateString()}</div>
            </div>
            <p className="mt-2 text-sm">{s.summary}</p>
            <div className="mt-2 flex flex-wrap gap-1 text-[10px]">
              {s.tags.map(t=> <span key={t} className="rounded bg-secondary px-2 py-0.5">{t}</span>)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 