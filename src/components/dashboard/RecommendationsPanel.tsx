"use client";
import Link from "next/link";
export default function RecommendationsPanel(){
  return (
    <div className="card p-4">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-xs text-muted-foreground">Recommendations</div>
          <h3 className="text-base font-semibold">Track per school</h3>
        </div>
        <Link href="/dashboard/recommendations" className="btn btn-outline text-xs">Open recommendations</Link>
      </div>
      <p className="mt-3 text-sm text-muted-foreground">
        Add and assign recommenders inside each application. This panel summarizes progress only.
      </p>
    </div>
  );
} 