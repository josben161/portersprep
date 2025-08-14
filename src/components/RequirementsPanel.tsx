"use client";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/apiFetch";

export default function RequirementsPanel({
  school,
  applicationId,
  onStart,
}: {
  school: any;
  applicationId: string;
  onStart?: (answerId: string) => void;
}) {
  const essays = school?.essays ?? [];
  const router = useRouter();

  async function startDraft(essay: any) {
    const r = await apiFetch("/api/answers/new", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        application_id: applicationId,
        title: essay.title,
        prompt: essay.prompt,
        word_limit: essay.word_limit ?? null,
      }),
    });
    if (r.ok) {
      const j = await r.json();
      onStart?.(j.id);
      router.push(
        `/dashboard/applications/${applicationId}/ide?answer=${j.id}`,
      );
    } else {
      const msg = await r.text();
      alert(msg || "Could not start draft");
    }
  }

  return (
    <div className="space-y-2 text-sm">
      <div className="text-xs text-muted-foreground">Requirements</div>
      {essays.length === 0 ? (
        <div className="text-muted-foreground">No essays loaded.</div>
      ) : (
        essays.map((e: any, i: number) => (
          <div key={i} className="rounded-md border p-2">
            <div className="flex items-center justify-between">
              <div className="font-medium">{e.title}</div>
              <div className="text-[10px] text-muted-foreground">
                {e.word_limit ? `≤ ${e.word_limit} words` : "no limit"}
              </div>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">{e.prompt}</p>
            <div className="mt-2">
              <button
                className="btn btn-outline text-xs"
                onClick={() => startDraft(e)}
              >
                Start Draft
              </button>
            </div>
          </div>
        ))
      )}
      {school?.verify_in_portal && (
        <div className="rounded-md border border-amber-200 bg-amber-50 p-2 text-[12px] text-amber-800 dark:border-amber-900/40 dark:bg-amber-900/20 dark:text-amber-100">
          Prompts may vary; please confirm in the official application before
          finalizing.
        </div>
      )}
    </div>
  );
}
