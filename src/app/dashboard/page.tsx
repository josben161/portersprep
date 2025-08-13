"use client";
import { Suspense } from "react";
import AIAssistant from "@/components/dashboard/AIAssistant";
import CoreProfileCard from "@/components/dashboard/CoreProfileCard";
import PredictCard from "@/components/dashboard/PredictCard";
import ApplicationsGrid from "@/components/dashboard/ApplicationsGrid";
import RecommendationsPanel from "@/components/dashboard/RecommendationsPanel";

export default function Dashboard(){
  return (
    <div className="mx-auto max-w-6xl p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Your MBA Command Center</h1>
        <p className="text-sm text-muted-foreground">Build your core profile, manage schools, and keep recommenders moving.</p>
      </div>

      <Suspense fallback={<div className="card p-6">Loading AI assistant…</div>}>
        <AIAssistant />
      </Suspense>

      <Suspense fallback={<div className="card p-6">Loading core profile…</div>}>
        <CoreProfileCard />
      </Suspense>

      <Suspense fallback={<div className="card p-6">Loading prediction…</div>}>
        <PredictCard />
      </Suspense>

      <Suspense fallback={<div className="card p-6">Loading applications…</div>}>
        <ApplicationsGrid />
      </Suspense>

      <Suspense fallback={<div className="card p-6">Loading recommendations…</div>}>
        <RecommendationsPanel />
      </Suspense>
    </div>
  );
} 