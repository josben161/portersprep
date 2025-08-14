"use client";
import { useState } from "react";
import { apiFetch } from "@/lib/apiFetch";

export default function StoryQuickAdd({
  onCreated,
}: {
  onCreated?: () => void;
}) {
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [saving, setSaving] = useState(false);
  async function save() {
    setSaving(true);
    try {
      const r = await apiFetch("/api/stories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, summary, tags: [] }),
      });
      if (!r.ok) throw new Error(await r.text());
      setTitle("");
      setSummary("");
      onCreated?.();
    } catch (e: any) {
      alert(e?.message || "Save failed");
    } finally {
      setSaving(false);
    }
  }
  return (
    <div className="rounded-md border p-2 text-sm">
      <input
        className="mb-2 w-full rounded-md border px-2 py-1"
        placeholder="Story title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <textarea
        className="w-full rounded-md border px-2 py-1"
        placeholder="Short summary"
        value={summary}
        onChange={(e) => setSummary(e.target.value)}
      />
      <div className="mt-2">
        <button
          className="btn btn-primary text-xs"
          onClick={save}
          disabled={saving || !title}
        >
          {saving ? "Saving…" : "Save story"}
        </button>
      </div>
    </div>
  );
}
