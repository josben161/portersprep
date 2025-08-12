"use client";
import { useEffect, useState } from "react";
import Skeleton from "@/components/ui/Skeleton";

type Recommender = {
  id: string;
  name: string;
  email?: string|null;
  assigned?: number;
  completed?: number;
};

export default function RecommendationsPanel(){
  const [data, setData] = useState<Recommender[]|null>(null);
  useEffect(()=>{
    fetch("/api/recommenders").then(r=>r.ok?r.json():null).then(setData).catch(()=> setData([]));
  },[]);

  return (
    <div className="card p-4">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-xs text-muted-foreground">Recommendations</div>
          <h3 className="text-base font-semibold">Recommender progress</h3>
        </div>
        <button className="btn btn-outline text-xs">Add recommender</button>
      </div>

      <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {data === null && (<>
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
        </>)}
        {(data ?? []).length === 0 && <div className="text-sm text-muted-foreground">No recommenders yet.</div>}
        {(data ?? []).map(r=>(
          <div key={r.id} className="rounded-md border p-3 text-sm">
            <div className="font-medium">{r.name}</div>
            <div className="text-[11px] text-muted-foreground">{r.email ?? "—"}</div>
            <div className="mt-1 text-[12px] text-muted-foreground">Assigned: {r.assigned ?? 0} • Completed: {r.completed ?? 0}</div>
            <div className="mt-2 flex gap-2">
              <button className="btn btn-outline text-xs">Prep pack</button>
              <button className="btn btn-outline text-xs">Manage</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 