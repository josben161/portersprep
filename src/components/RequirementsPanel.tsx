"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { School } from "@/lib/schools";

export default function RequirementsPanel({ appId, school }: { appId: string; school: School }) {
  const r = useRouter();
  const [busy, setBusy] = useState<number | null>(null);

  return (
    <div className="space-y-4">
      {school.verify_in_portal && (
        <div className="rounded-md border border-amber-300 bg-amber-50 p-3 text-sm text-amber-900 dark:border-amber-800 dark:bg-amber-900/20 dark:text-amber-200">
          Prompts may vary by round. Please confirm in the official portal before finalizing.
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        {school.essays.map((e, idx) => (
          <div key={idx} className="rounded-lg border bg-card p-4 shadow-sm transition hover:shadow-md">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-sm font-semibold">{e.title}</div>
                <div className="mt-1 text-xs text-muted-foreground">
                  Type: {e.type === "short" ? "Short" : "Long"} • {e.word_limit ? `≤ ${e.word_limit} words` : "Word limit: see source"}
                </div>
              </div>
              <a 
                href={e.source_url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-xs underline text-muted-foreground hover:text-foreground"
              >
                Source
              </a>
            </div>
            <p className="mt-3 text-sm leading-6">{e.prompt}</p>
            <div className="mt-4">
              <button
                disabled={busy === idx}
                onClick={async () => {
                  try {
                    setBusy(idx);
                    const res = await fetch("/api/requirements/start-draft", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ appId, schoolId: school.id, essayIndex: idx })
                    });
                    if (!res.ok) throw new Error("Failed to start draft");
                    // Go to workspace; the draft will be present and selected once user clicks question
                    r.push(`/dashboard/applications/${appId}`);
                  } catch {
                    alert("Could not start draft. Please try again.");
                  } finally {
                    setBusy(null);
                  }
                }}
                className="rounded-md bg-primary px-3 py-2 text-sm text-primary-foreground shadow-sm hover:opacity-95 disabled:pointer-events-none disabled:opacity-50"
              >
                {busy === idx ? "Starting…" : "Start Draft"}
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-lg border p-4">
        <div className="text-sm font-semibold">Other Requirements</div>
        <dl className="mt-2 grid gap-2 text-sm text-muted-foreground sm:grid-cols-2">
          <div>
            <dt className="font-medium text-foreground">Letters of Recommendation</dt>
            <dd>{school.lor ? `${school.lor.count} • ${school.lor.format}` : "See school website"}</dd>
          </div>
          <div>
            <dt className="font-medium text-foreground">Video / Assessment</dt>
            <dd>
              {school.video_assessment 
                ? `${school.video_assessment.provider}${school.video_assessment.notes ? ` — ${school.video_assessment.notes}` : ""}` 
                : "None / varies"
              }
            </dd>
          </div>
        </dl>
      </div>
    </div>
  );
} 