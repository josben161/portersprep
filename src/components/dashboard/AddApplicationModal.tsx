"use client";
import { useEffect, useState } from "react";

export default function AddApplicationModal({
  onCreated,
}: {
  onCreated?: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [schools, setSchools] = useState<{ id: string; name: string }[]>([]);
  const [schoolId, setSchoolId] = useState("");
  const [round, setRound] = useState("");
  const [deadline, setDeadline] = useState("");

  useEffect(() => {
    if (!open) return;
    (async () => {
      const r = await fetch("/api/schools");
      setSchools(r.ok ? await r.json() : []);
    })();
  }, [open]);

  async function create() {
    if (!schoolId) return;
    const r = await fetch("/api/applications", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        school_id: schoolId,
        round,
        deadline: deadline || null,
      }),
    });
    if (!r.ok) {
      alert(await r.text());
      return;
    }
    setOpen(false);
    onCreated?.();
  }

  return (
    <>
      <button
        className="rounded-lg border p-3 text-sm hover:bg-black/5 dark:hover:bg-white/5"
        onClick={() => setOpen(true)}
      >
        + Add application
      </button>
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onClick={() => setOpen(false)}
        >
          <div
            className="w-full max-w-md rounded-lg border bg-card p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <div className="text-base font-semibold">New Application</div>
              <button
                className="text-sm text-muted-foreground"
                onClick={() => setOpen(false)}
              >
                ✕
              </button>
            </div>
            <div className="mt-3 grid gap-2 text-sm">
              <label className="text-xs">School</label>
              <select
                className="rounded-md border px-3 py-2"
                value={schoolId}
                onChange={(e) => setSchoolId(e.target.value)}
              >
                <option value="">— Select —</option>
                {schools.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
              <label className="text-xs">Round (optional)</label>
              <input
                className="rounded-md border px-3 py-2"
                value={round}
                onChange={(e) => setRound(e.target.value)}
                placeholder="e.g., R1"
              />
              <label className="text-xs">Deadline (optional)</label>
              <input
                type="date"
                className="rounded-md border px-3 py-2"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
              />
              <div className="mt-2 flex gap-2">
                <button
                  className="btn btn-primary text-xs"
                  onClick={create}
                  disabled={!schoolId}
                >
                  Create
                </button>
                <button
                  className="btn btn-outline text-xs"
                  onClick={() => setOpen(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
