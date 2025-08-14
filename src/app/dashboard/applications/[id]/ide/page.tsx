"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import AppShell from "@/components/appshell/AppShell";
import LeftNav from "@/components/appshell/LeftNav";
import TopBar from "@/components/appshell/TopBar";
import RightTabs from "@/components/appshell/RightTabs";
import AnalysisPanel from "@/components/panels/AnalysisPanel";
import SchoolBriefPanel from "@/components/panels/SchoolBriefPanel";
import StoryBankPanel from "@/components/panels/StoryBankPanel";
import WordLimitBar from "@/components/ui/WordLimitBar";
import { apiFetch } from "@/lib/fetcher";
import CoveragePanel from "@/components/CoveragePanel";
import RequirementsPanel from "@/components/RequirementsPanel";

type Question = {
  id: string;
  prompt: string;
  archetype: string;
  word_limit: number | null;
  metadata?: any;
};

export default function IDE({ params }: { params: { id: string } }) {
  const appId = params.id;

  // State
  const [schoolsNav, setSchoolsNav] = useState<any[]>([]);
  const [schoolJson, setSchoolJson] = useState<any | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [selected, setSelected] = useState<Question | null>(null);
  const [answerId, setAnswerId] = useState<string | null>(null);
  const [content, setContent] = useState("");
  const [analysis, setAnalysis] = useState<any | null>(null);
  const [saving, setSaving] = useState(false);
  const [stories, setStories] = useState<any[]>([]);
  const saveTimer = useRef<any>(null);

  // Load nav + questions + stories
  useEffect(() => {
    (async () => {
      // schools list for left nav
      const apps = await fetch("/api/applications")
        .then((r) => r.json())
        .catch(() => []);
      setSchoolsNav(
        apps.map((a: any) => ({
          id: a.id,
          name: a.schools?.name ?? "School",
          progress: a.progress ?? undefined,
        })),
      );
      const app = apps.find((x: any) => x.id === appId);
      if (!app) return;

      // DB questions
      const qs = await fetch(`/api/schools/${app.school_id}/questions`)
        .then((r) => r.json())
        .catch(() => []);
      setQuestions(qs);

      // Try local JSON (slug in DB)
      try {
        const sb = await fetch(`/api/schools/${app.school_id}`).then((r) =>
          r.json(),
        ); // if you mapped id->slug route differently, update
        setSchoolJson(sb);
      } catch {}

      // Load stories for sidebar
      const storiesData = await fetch("/api/stories")
        .then((r) => r.json())
        .catch(() => []);
      setStories(storiesData);
    })();
  }, [appId]);

  async function openQuestion(q: Question) {
    setSelected(q);
    setAnalysis(null);
    const res = await fetch(`/api/internal/ensure-answer`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ appId, questionId: q.id, archetype: q.archetype }),
    });
    const { id } = await res.json();
    setAnswerId(id);
    const text = await fetch(`/api/answers/${id}/content`).then((r) =>
      r.text(),
    );
    setContent(text);
  }

  // Autosave
  useEffect(() => {
    if (!answerId) return;
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(async () => {
      setSaving(true);
      await fetch(`/api/answers/${answerId}/content`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: content }),
      });
      setSaving(false);
    }, 800);
    return () => clearTimeout(saveTimer.current);
  }, [content, answerId]);

  async function analyze() {
    if (!answerId) return;
    const r = await fetch(`/api/answers/${answerId}/analyze`, {
      method: "POST",
    });
    if (r.ok) setAnalysis(await r.json());
  }

  // Quick insert from StoryBank
  function insertStory(text: string) {
    setContent((c) => c + (c.endsWith("\n") ? "" : "\n\n") + text);
  }

  // Word count
  const wc = useMemo(
    () => content.trim().match(/\S+/g)?.length ?? 0,
    [content],
  );

  // Panels (Right Tabs)
  const rightTabs = useMemo(
    () => [
      { label: "Analysis", node: <AnalysisPanel analysis={analysis} /> },
      {
        label: "School Brief",
        node: (
          <SchoolBriefPanel
            brief={schoolJson?.brief ?? null}
            schoolName={schoolJson?.name}
          />
        ),
      },
      { label: "Story Bank", node: <StoryBankPanel onInsert={insertStory} /> },
      { label: "Coverage", node: <CoveragePanel applicationId={appId} /> },
    ],
    [analysis, schoolJson],
  );

  // Left: 3-zone Dashboard layout (compact for IDE)
  const leftNavNode = (
    <div className="flex h-full flex-col space-y-4 p-4">
      {/* Zone 1: Core Profile (Compact) */}
      <div className="space-y-2">
        <div className="text-xs text-muted-foreground font-medium">
          Core Profile
        </div>
        <div className="rounded-md border p-3 text-xs">
          <div className="flex items-center justify-between mb-2">
            <div className="font-medium">Story Bank</div>
            <Link
              href="/dashboard/stories"
              className="text-brand-500 hover:underline"
            >
              Manage
            </Link>
          </div>
          <div className="space-y-1">
            {stories.length > 0 ? (
              stories.slice(0, 3).map((s: any) => (
                <div key={s.id} className="rounded border p-1.5">
                  <div className="font-medium text-[10px]">{s.title}</div>
                  <div className="text-[9px] text-muted-foreground line-clamp-1">
                    {s.summary}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-muted-foreground">No stories loaded</div>
            )}
          </div>
        </div>
      </div>

      {/* Zone 2: Current Application */}
      <div className="space-y-2">
        <div className="text-xs text-muted-foreground font-medium">
          Current Application
        </div>
        <div className="rounded-md border p-3 text-xs">
          <div className="font-medium mb-2">{schoolJson?.name ?? "School"}</div>
          <div className="space-y-1">
            {questions.map((q) => (
              <button
                key={q.id}
                onClick={() => openQuestion(q)}
                className={`block w-full text-left p-1.5 rounded hover:bg-accent ${selected?.id === q.id ? "bg-secondary" : ""}`}
              >
                <div className="font-medium text-[10px]">
                  {q.archetype.replace("_", " ")}
                </div>
                <div className="text-[9px] text-muted-foreground line-clamp-1">
                  {q.prompt}
                </div>
                {q.word_limit && (
                  <div className="text-[8px] text-muted-foreground">
                    ≤ {q.word_limit} words
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Zone 3: Quick Actions */}
      <div className="space-y-2">
        <div className="text-xs text-muted-foreground font-medium">
          Quick Actions
        </div>
        <div className="rounded-md border p-3 text-xs space-y-2">
          <Link
            href="/dashboard/applications"
            className="block text-center btn btn-outline text-[10px] py-1"
          >
            All Applications
          </Link>
          <Link
            href="/dashboard/stories"
            className="block text-center btn btn-outline text-[10px] py-1"
          >
            Story Bank
          </Link>
          <Link
            href="/dashboard/assessments"
            className="block text-center btn btn-outline text-[10px] py-1"
          >
            Run Prediction
          </Link>
        </div>
      </div>
    </div>
  );

  // Center: Tabs (Design / Draft / Analyze)
  const [tab, setTab] = useState<"design" | "draft" | "analyze">("draft");

  return (
    <AppShell
      top={
        <TopBar
          title={schoolJson?.name ?? "Application Workspace"}
          subtitle="IDE Mode"
          actions={
            <div className="flex items-center gap-2">
              <button
                onClick={() => setTab("design")}
                className={`rounded-md border px-3 py-1.5 text-sm ${tab === "design" ? "bg-secondary" : ""}`}
              >
                Design
              </button>
              <button
                onClick={() => setTab("draft")}
                className={`rounded-md border px-3 py-1.5 text-sm ${tab === "draft" ? "bg-secondary" : ""}`}
              >
                Draft
              </button>
              <button
                onClick={() => {
                  setTab("analyze");
                  analyze();
                }}
                className={`rounded-md border px-3 py-1.5 text-sm ${tab === "analyze" ? "bg-secondary" : ""}`}
              >
                Analyze
              </button>
            </div>
          }
        />
      }
      left={leftNavNode}
      right={<RightTabs tabs={rightTabs} />}
    >
      <div className="flex h-full flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b p-3">
          <div className="min-w-0">
            <div className="truncate text-sm text-muted-foreground">
              {selected ? selected.archetype : "Select a question"}
            </div>
            <div className="truncate text-base font-medium">
              {selected?.prompt ?? "—"}
            </div>
          </div>
          <div className="w-56">
            <WordLimitBar count={wc} limit={selected?.word_limit ?? null} />
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-auto p-3">
          {tab === "design" && (
            <DesignPane
              answerId={answerId}
              wordLimit={selected?.word_limit ?? null}
              onDraftReady={(key) => {
                /* noop; saved in S3 via API */
              }}
            />
          )}
          {tab === "draft" && (
            <textarea
              className="h-[60vh] w-full rounded-md border p-3 leading-7"
              placeholder="Start your draft or use Design → Create Coaching Draft"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          )}
          {tab === "analyze" && (
            <div className="text-sm text-muted-foreground">
              Analysis appears in the right panel. Make fixes here in the draft
              tab.
            </div>
          )}
        </div>

        {/* Sticky actions */}
        <div className="sticky bottom-0 border-t bg-card/70 p-2 backdrop-blur supports-[backdrop-filter]:bg-card/60">
          <div className="flex items-center justify-between">
            <div className="text-xs text-muted-foreground">
              Tip: Use Story Bank → Insert summary, then refine with metrics.
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setTab("design")}
                className="rounded-md border px-3 py-1.5 text-sm"
              >
                Design
              </button>
              <button
                onClick={() => {
                  setTab("analyze");
                  analyze();
                }}
                className="rounded-md bg-primary px-3 py-1.5 text-sm text-primary-foreground"
              >
                Analyze
              </button>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}

/* ===== Design Pane (inline component) ===== */
function DesignPane({
  answerId,
  wordLimit,
  onDraftReady,
}: {
  answerId: string | null;
  wordLimit: number | null;
  onDraftReady: (key: string) => void;
}) {
  const [selectedStoryIds, setSelectedStoryIds] = useState<string[]>([]);
  const [stories, setStories] = useState<any[]>([]);
  const [outline, setOutline] = useState<any | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    fetch("/api/stories")
      .then((r) => r.json())
      .then(setStories)
      .catch(() => {});
  }, []);

  async function genOutline() {
    if (!answerId) return;
    setBusy(true);
    const r = await fetch(`/api/answers/${answerId}/design`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ selectedStoryIds, wordLimit }),
    });
    setBusy(false);
    if (r.ok) setOutline(await r.json());
  }

  async function makeDraft() {
    if (!answerId || !outline) return;
    setBusy(true);
    const r = await fetch(`/api/answers/${answerId}/draft`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ outline: outline.outline ?? outline, wordLimit }),
    });
    setBusy(false);
    if (r.ok) onDraftReady((await r.json()).key);
  }

  return (
    <div className="space-y-4">
      <div className="rounded-lg border p-3">
        <div className="text-sm font-semibold">Select stories to use</div>
        <div className="mt-2 grid gap-2 sm:grid-cols-2">
          {stories.map((s: any) => {
            const active = selectedStoryIds.includes(s.id);
            return (
              <button
                key={s.id}
                onClick={() => {
                  setSelectedStoryIds((ids) =>
                    active ? ids.filter((x) => x !== s.id) : [...ids, s.id],
                  );
                }}
                className={`rounded-md border p-2 text-left text-sm ${active ? "bg-secondary" : "hover:bg-accent"}`}
              >
                <div className="font-medium">{s.title}</div>
                <div className="text-xs text-muted-foreground line-clamp-2">
                  {s.summary}
                </div>
              </button>
            );
          })}
        </div>
        <div className="mt-3 flex gap-2">
          <button
            onClick={genOutline}
            disabled={busy}
            className="rounded-md border px-3 py-1.5 text-sm"
          >
            {busy ? "Working…" : "Create Outline"}
          </button>
          <button
            onClick={makeDraft}
            disabled={!outline || busy}
            className="rounded-md bg-primary px-3 py-1.5 text-sm text-primary-foreground"
          >
            Create Coaching Draft
          </button>
        </div>
      </div>

      {outline && (
        <div className="rounded-lg border p-3">
          <div className="text-sm font-semibold">Outline</div>
          <div className="mt-2 space-y-2">
            {(outline?.outline?.sections ?? outline?.sections ?? []).map(
              (sec: any, i: number) => (
                <div key={i} className="rounded-md border p-2">
                  <div className="text-sm font-medium">{sec.title}</div>
                  <ul className="ml-4 list-disc text-sm">
                    {(sec.bullets ?? []).map((b: string, j: number) => (
                      <li key={j}>{b}</li>
                    ))}
                  </ul>
                </div>
              ),
            )}
          </div>
        </div>
      )}
    </div>
  );
}
