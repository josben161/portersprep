"use client";
import { useState } from "react";

export default function PrepPackModal(){
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState<any|null>(null);
  const [recommenderId, setRecommenderId] = useState<string>("");
  const [applicationId, setApplicationId] = useState<string>("");

  async function generate() {
    if (!recommenderId || !applicationId) return;
    setLoading(true);
    try {
      const r = await fetch("/api/recommenders/packet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ recommender_id: recommenderId, application_id: applicationId })
      });
      const j = await r.json();
      setContent(j);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <button className="btn btn-outline text-xs" onClick={()=> setOpen(true)}>Prep pack</button>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={()=> setOpen(false)}>
          <div className="w-full max-w-2xl rounded-lg border bg-card p-4" onClick={(e)=>e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <div className="text-base font-semibold">Recommender Prep Pack</div>
              <button className="text-sm text-muted-foreground" onClick={()=> setOpen(false)}>✕</button>
            </div>

            <div className="mt-3 grid gap-2 text-sm">
              <input className="w-full rounded-md border px-3 py-2" placeholder="Recommender ID" value={recommenderId} onChange={e=>setRecommenderId(e.target.value)} />
              <input className="w-full rounded-md border px-3 py-2" placeholder="Application ID" value={applicationId} onChange={e=>setApplicationId(e.target.value)} />
              <div className="flex gap-2">
                <button className="btn btn-primary text-xs" onClick={generate} disabled={loading}>{loading ? "Generating…" : "Generate"}</button>
                <button className="btn btn-outline text-xs" onClick={()=> setContent(null)}>Clear</button>
              </div>
            </div>

            {content?.draft_md && (
              <div className="mt-4 max-h-[50vh] overflow-auto rounded-md border p-3 text-sm">
                <pre className="whitespace-pre-wrap">{content.draft_md}</pre>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
} 