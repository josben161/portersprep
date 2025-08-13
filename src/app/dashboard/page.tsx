"use client";
import { Suspense } from "react";
import CoreProfileCard from "@/components/dashboard/CoreProfileCard";
import PredictCard from "@/components/dashboard/PredictCard";
import ApplicationsGrid from "@/components/dashboard/ApplicationsGrid";
import RecommendationsPanel from "@/components/dashboard/RecommendationsPanel";
import CoachWidget from "@/components/dashboard/CoachWidget";

export default function Dashboard(){
  return (
    <div className="mx-auto max-w-7xl p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">Your MBA Command Center</h1>
        <p className="text-sm text-muted-foreground">Build your core profile, manage schools, and keep recommenders moving.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 space-y-6">
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

        <div className="lg:col-span-1">
          <Suspense fallback={<div className="card p-6">Loading planner…</div>}>
            <CoachWidget />
          </Suspense>
        </div>
      </div>
    </div>
  );
} 