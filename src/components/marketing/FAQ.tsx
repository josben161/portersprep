"use client";
import { useState } from "react";

const QA = [
  { q: "Is this allowed by schools?", a: "Yes. We provide coaching and drafting tools but do not fabricate or misrepresent your profile. You own the final content." },
  { q: "Can I reuse stories across schools?", a: "Yes. Our Story Bank helps you adapt tone and emphasis per school while keeping facts consistent." },
  { q: "Do you handle recommendations?", a: "We generate recommender packets with prompts and examples that differ from your essays." },
  { q: "How is my data stored?", a: "Your content is stored securely; you can export or delete it any time." },
];

export default function FAQ(){
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section className="mx-auto max-w-3xl px-6 py-16">
      <h3 className="text-2xl font-semibold">FAQ</h3>
      <div className="mt-6 divide-y rounded-lg border">
        {QA.map((item, i)=>(
          <details key={i} open={open===i} onClick={()=> setOpen(open===i ? null : i)} className="group p-4 [&_summary]:list-none">
            <summary className="flex cursor-pointer items-center justify-between text-sm font-medium">
              {item.q}
              <span className="text-muted-foreground group-open:rotate-180 transition">⌄</span>
            </summary>
            <p className="mt-2 text-sm text-muted-foreground">{item.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
} 