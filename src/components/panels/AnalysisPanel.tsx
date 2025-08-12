"use client";
export default function AnalysisPanel({ analysis }: { analysis?: any }) {
  if (!analysis) return <div className="text-sm text-muted-foreground">Run "Analyze" to see school focus, narrative fit, sentence-level signals, and evidence gaps.</div>;
  const af = analysis?.rubric?.school_focus;
  const nf = analysis?.rubric?.narrative;
  return (
    <div className="space-y-4 text-sm">
      <section>
        <div className="text-xs text-muted-foreground">School Focus</div>
        <div className="mt-1">Score: <span className="font-medium">{af?.score ?? 0}/5</span></div>
        <ul className="mt-1 ml-4 list-disc">{(af?.hits ?? []).map((x:string)=> <li key={x} className="text-green-700 dark:text-green-300">{x}</li>)}</ul>
        <ul className="mt-1 ml-4 list-disc">{(af?.misses ?? []).map((x:string)=> <li key={x} className="text-amber-700 dark:text-amber-300">{x}</li>)}</ul>
      </section>
      <section>
        <div className="text-xs text-muted-foreground">Narrative Fit</div>
        <div className="mt-1">Cohesion: <span className="font-medium">{nf?.cohesion ?? 0}/5</span></div>
        <ul className="mt-1 ml-4 list-disc">{(nf?.gaps ?? []).map((x:string)=> <li key={x}>{x}</li>)}</ul>
      </section>
      <section>
        <div className="text-xs text-muted-foreground">Sentence-level</div>
        <div className="mt-2 space-y-2">
          {(analysis?.sentences ?? []).map((s:any)=>(
            <div key={s.idx} className="rounded-md border p-2">
              <div className="text-[11px] text-muted-foreground">#{s.idx}</div>
              <div>{s.text}</div>
              <div className="mt-1 flex flex-wrap gap-1">
                {(s.tags ?? []).map((t:string)=> <span key={t} className="rounded bg-secondary px-1.5 py-0.5 text-[10px]">{t}</span>)}
                {s.needs_evidence && <span className="rounded bg-amber-100 px-1.5 py-0.5 text-[10px] text-amber-800 dark:bg-amber-900/30 dark:text-amber-200">needs evidence</span>}
              </div>
              <ul className="mt-1 ml-4 list-disc text-xs">{(s.suggestions ?? []).map((sg:any,i:number)=> <li key={i}><span className="font-medium">{sg.type}:</span> {sg.text}</li>)}</ul>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
} 