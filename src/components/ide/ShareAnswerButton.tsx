"use client";
import { useState } from "react";

export default function ShareAnswerButton({ answerId }:{ answerId: string }){
  const [open, setOpen] = useState(false);
  const [link, setLink] = useState<string | null>(null);
  const [role, setRole] = useState<"editor"|"viewer">("editor");

  async function create(){
    const r = await fetch("/api/answers/share", {
      method: "POST",
      headers: { "Content-Type":"application/json" },
      body: JSON.stringify({ answer_id: answerId, role })
    });
    const j = await r.json();
    if (r.ok) setLink(j.url);
    else alert(j || "Failed to create link");
  }

  return (
    <>
      <button className="btn btn-outline text-xs" onClick={()=> setOpen(true)}>Share</button>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={()=> setOpen(false)}>
          <div className="w-full max-w-md rounded-lg border bg-card p-4" onClick={e=> e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <div className="text-base font-semibold">Share this draft</div>
              <button className="text-sm text-muted-foreground" onClick={()=> setOpen(false)}>✕</button>
            </div>
            <div className="mt-3 space-y-2 text-sm">
              <label className="flex items-center gap-2 text-xs">
                <span>Access</span>
                <select className="rounded-md border px-2 py-1 text-xs" value={role} onChange={e=> setRole(e.target.value as any)}>
                  <option value="editor">Anyone with link can edit</option>
                  <option value="viewer">Anyone with link can view</option>
                </select>
              </label>
              <button className="btn btn-primary text-xs" onClick={create}>Create link</button>
              {link && (
                <div className="rounded-md border p-2 text-xs">
                  <div className="text-muted-foreground mb-1">Share URL</div>
                  <div className="flex items-center gap-2">
                    <input className="flex-1 rounded-md border px-2 py-1" readOnly value={link} />
                    <button className="btn btn-outline text-xs" onClick={()=> navigator.clipboard.writeText(link)}>Copy</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
} 