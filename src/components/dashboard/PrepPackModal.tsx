"use client";
import { useEffect, useState } from "react";

type Opt = { id: string; label: string };

export default function PrepPackModal() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState<any | null>(null);
  const [recommenderId, setRecommenderId] = useState("");
  const [applicationId, setApplicationId] = useState("");
  const [recs, setRecs] = useState<Opt[]>([]);
  const [apps, setApps] = useState<Opt[]>([]);

  useEffect(() => {
    if (!open) return;
    (async () => {
      const r1 = await fetch("/api/recommenders");
      const j1 = r1.ok ? await r1.json() : [];
      setRecs(j1.map((x: any) => ({ id: x.id, label: x.name })));
      const r2 = await fetch("/api/applications");
      const j2 = r2.ok ? await r2.json() : [];
      setApps(
        j2.map((x: any) => ({ id: x.id, label: x.school?.name || "School" })),
      );
    })();
  }, [open]);

  async function generate() {
    if (!recommenderId || !applicationId) return;
    setLoading(true);
    try {
      const r = await fetch("/api/recommenders/packet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          recommender_id: recommenderId,
          application_id: applicationId,
        }),
      });
      const j = await r.json();
      setContent(j);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <button className="btn btn-outline text-xs" onClick={() => setOpen(true)}>
        Prep pack
      </button>
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onClick={() => setOpen(false)}
        >
          <div
            className="w-full max-w-2xl rounded-lg border bg-card p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <div className="text-base font-semibold">
                Recommender Prep Pack
              </div>
              <button
                className="text-sm text-muted-foreground"
                onClick={() => setOpen(false)}
              >
                ✕
              </button>
            </div>

            <div className="mt-3 grid gap-2 text-sm">
              <select
                className="w-full rounded-md border px-3 py-2"
                value={recommenderId}
                onChange={(e) => setRecommenderId(e.target.value)}
              >
                <option value="">Select recommender…</option>
                {recs.map((o) => (
                  <option key={o.id} value={o.id}>
                    {o.label}
                  </option>
                ))}
              </select>
              <select
                className="w-full rounded-md border px-3 py-2"
                value={applicationId}
                onChange={(e) => setApplicationId(e.target.value)}
              >
                <option value="">Select application…</option>
                {apps.map((o) => (
                  <option key={o.id} value={o.id}>
                    {o.label}
                  </option>
                ))}
              </select>
              <div className="flex gap-2">
                <button
                  className="btn btn-primary text-xs"
                  onClick={generate}
                  disabled={loading || !recommenderId || !applicationId}
                >
                  {loading ? "Generating…" : "Generate"}
                </button>
                <button
                  className="btn btn-outline text-xs"
                  onClick={() => setContent(null)}
                >
                  Clear
                </button>
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
