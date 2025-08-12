"use client";
import { useEffect, useState } from "react";

export default function SharePage({ params }: { params: { token: string } }) {
  const [state, setState] = useState<{ role: string; answer: any } | null>(null);
  const [saving, setSaving] = useState(false);
  const [content, setContent] = useState("");

  useEffect(()=> {
    (async ()=>{
      const r = await fetch(`/api/answers/share/${params.token}`);
      if (!r.ok) return;
      const j = await r.json();
      setState(j);
      setContent(j.answer?.body ?? "");
      // Liveblocks editor wiring can be added here if you already have a collaborative editor component.
    })();
  },[params.token]);

  async function save(){
    setSaving(true);
    try {
      const r = await fetch(`/api/answers/share/${params.token}`, {
        method: "POST", headers: { "Content-Type":"application/json" },
        body: JSON.stringify({ content })
      });
      if (!r.ok) alert(await r.text());
    } finally { setSaving(false); }
  }

  if (!state) return <div className="p-6 text-sm text-muted-foreground">Loading…</div>;
  const readonly = state.role !== "editor";

  return (
    <div className="mx-auto max-w-3xl p-6">
      <div className="mb-3 rounded-md border p-3">
        <div className="text-xs text-muted-foreground">PortersPrep — Shared Draft</div>
        <div className="text-base font-semibold">{state.answer?.title ?? "Untitled"}</div>
        <div className="mt-1 text-[12px] text-muted-foreground">{state.answer?.prompt}</div>
        {state.answer?.word_limit && <div className="mt-1 text-[11px] text-muted-foreground">≤ {state.answer.word_limit} words</div>}
      </div>

      <textarea
        className="min-h-[50vh] w-full rounded-md border p-3 text-sm"
        value={content}
        onChange={e=> setContent(e.target.value)}
        readOnly={readonly}
        placeholder={readonly ? "View only" : "Start editing…"}
      />

      <div className="mt-3 flex gap-2">
        <button className="btn btn-outline text-xs" onClick={()=> window.location.reload()}>Reload</button>
        {!readonly && <button className="btn btn-primary text-xs" onClick={save} disabled={saving}>{saving? "Saving…" : "Save"}</button>}
      </div>
    </div>
  );
} 