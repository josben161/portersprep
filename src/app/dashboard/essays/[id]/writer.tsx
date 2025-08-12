"use client";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-hot-toast";

export default function Editor({ id, initialTitle, onMetaSave }:{
  id: string; initialTitle: string; onMetaSave: (title: string, wc: number) => Promise<void>;
}) {
  const [title, setTitle] = useState(initialTitle);
  const [text, setText] = useState("");
  const [saving, setSaving] = useState(false);
  const timer = useRef<any>(null);

  function countWords(s: string) {
    const m = s.trim().match(/\S+/g);
    return m ? m.length : 0;
  }

  useEffect(() => {
    fetch(`/api/essays/${id}/content`)
      .then(r => r.text())
      .then(setText)
      .catch(() => toast.error("Failed to load content"));
  }, [id]);

  useEffect(() => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(async () => {
      setSaving(true);
      try {
        await fetch(`/api/essays/${id}/content`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text })
        });
        await onMetaSave(title, countWords(text));
        toast.success("Saved");
      } catch {
        toast.error("Save failed");
      } finally {
        setSaving(false);
      }
    }, 1000);
    return () => clearTimeout(timer.current);
  }, [title, text, id, onMetaSave]);

  return (
    <div>
      <input
        className="w-full rounded-md border px-3 py-2 text-lg font-medium"
        value={title}
        onChange={e=>setTitle(e.target.value)}
      />
      <textarea
        className="mt-4 h-[60vh] w-full rounded-md border p-3 leading-7"
        value={text}
        onChange={e=>setText(e.target.value)}
        placeholder="Start writing your essay here..."
      />
      <div className="mt-2 text-xs text-muted-foreground">{saving ? "Saving..." : "Saved"}</div>
      <div className="mt-4">
        <button
          onClick={async ()=> {
            const res = await fetch("/api/redline", { method:"POST", headers:{ "Content-Type":"application/json" }, body: JSON.stringify({ text }) });
            if (!res.ok) { toast.error("Redline failed"); return; }
            const data = await res.json();
            toast.success(`Got ${data.suggestions.length} suggestions`);
            alert(`Suggestions: \n- ${data.suggestions.join("\n- ")}`);
          }}
          className="rounded-md bg-primary px-3 py-2 text-primary-foreground"
        >
          AI Redline
        </button>
      </div>
    </div>
  );
} 