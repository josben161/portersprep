"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NewAssessment() {
  const r = useRouter();
  const [loading, setLoading] = useState(false);
  const [targets, setTargets] = useState("");
  const [resumeText, setResume] = useState("");
  const [goals, setGoals] = useState("");
  const [constraints, setConstraints] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const res = await fetch("/api/assessment/run", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        targets: targets.split(",").map(s => s.trim()).filter(Boolean),
        resumeText, goals, constraints
      })
    });
    setLoading(false);
    if (!res.ok) { alert("Failed to run assessment"); return; }
    const json = await res.json();
    r.push(`/dashboard/assessments/${json.assessmentId}`);
  }

  return (
    <div className="mx-auto max-w-3xl p-6">
      <h1 className="text-2xl font-semibold">New assessment</h1>
      <form onSubmit={onSubmit} className="mt-6 space-y-4">
        <div>
          <label className="text-sm font-medium">Target schools (comma separated)</label>
          <input className="mt-1 w-full rounded-md border px-3 py-2" value={targets} onChange={e=>setTargets(e.target.value)} required />
        </div>
        <div>
          <label className="text-sm font-medium">Resume / profile summary</label>
          <textarea className="mt-1 w-full rounded-md border px-3 py-2" rows={6} value={resumeText} onChange={e=>setResume(e.target.value)} required />
        </div>
        <div>
          <label className="text-sm font-medium">Goals</label>
          <textarea className="mt-1 w-full rounded-md border px-3 py-2" rows={4} value={goals} onChange={e=>setGoals(e.target.value)} required />
        </div>
        <div>
          <label className="text-sm font-medium">Constraints (optional)</label>
          <textarea className="mt-1 w-full rounded-md border px-3 py-2" rows={3} value={constraints} onChange={e=>setConstraints(e.target.value)} />
        </div>
        <button disabled={loading} className="rounded-md bg-primary px-4 py-2 text-primary-foreground">{loading ? "Running..." : "Run assessment"}</button>
      </form>
    </div>
  );
} 