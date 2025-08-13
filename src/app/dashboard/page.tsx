"use client";
import { Suspense } from "react";
import CoreProfileCard from "@/components/dashboard/CoreProfileCard";
import PredictCard from "@/components/dashboard/PredictCard";
import ApplicationsGrid from "@/components/dashboard/ApplicationsGrid";
import RecommendationsPanel from "@/components/dashboard/RecommendationsPanel";

export default function Dashboard(){
  return (
    <div className="mx-auto max-w-4xl p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">Your MBA Dashboard</h1>
        <p className="text-sm text-muted-foreground">Build your core profile, manage schools, and keep recommenders moving.</p>
      </div>

      <div className="space-y-6">
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
    </div>
  );
} 