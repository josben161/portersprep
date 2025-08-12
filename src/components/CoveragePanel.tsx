"use client";
import { useEffect, useState } from "react";

export default function CoveragePanel({ applicationId }:{ applicationId: string }) {
  const [data, setData] = useState<any | null>(null);
  useEffect(()=>{ fetch(`/api/coverage?applicationId=${applicationId}`).then(r=>r.json()).then(setData).catch(()=>{}); },[applicationId]);

  if (!data) return <div className="text-sm text-muted-foreground">Loading coverage…</div>;
  const { stories = [], schools = [] } = data;

  return (
    <div className="space-y-2">
      <div className="text-xs text-muted-foreground">Coverage Heatmap</div>
      <div className="overflow-auto">
        <table className="w-full text-left text-xs">
          <thead><tr><th className="p-2">Story</th>{schools.map((s:any)=> <th key={s.id} className="p-2">{s.name}</th>)}</tr></thead>
          <tbody>
            {stories.map((st:any)=>(
              <tr key={st.id} className="border-t">
                <td className="p-2 font-medium">{st.title}</td>
                {schools.map((sc:any)=>{
                  const used = !!st.usage?.find((u:any)=> u.school_id === sc.id);
                  return <td key={sc.id} className="p-2">{used ? <div className="h-2 w-6 rounded bg-brand-500" /> : <div className="h-2 w-6 rounded bg-black/10 dark:bg-white/10" />}</td>;
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
} 