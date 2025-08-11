export const metadata = { title: "FAQ — PortersPrep", description: "Answers to common questions." };

export default function FAQ() {
  const qas = [
    ["Do you write essays?", "No. We coach; you write. Our tools deliver structured feedback and redlines that preserve your voice."],
    ["Can I cancel anytime?", "Yes. You can cancel from the billing portal; your plan runs through the paid period."],
    ["What happens if I hit monthly limits?", "Upgrade on the Pricing page or wait for the monthly reset."],
    ["Will you support all schools?", "Yes—our approach is school-agnostic and we adapt prompts per program."],
    ["Is my data private?", "We encrypt in transit and at rest. We don't sell or share your content."],
  ];
  return (
    <section className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="text-4xl font-bold">FAQ</h1>
      <div className="mt-8 divide-y rounded-lg border">
        {qas.map(([q,a]) => (
          <details key={q} className="group p-4">
            <summary className="cursor-pointer list-none font-medium">{q}</summary>
            <p className="mt-2 text-sm text-muted-foreground">{a}</p>
          </details>
        ))}
      </div>
    </section>
  );
} 