"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

const testimonials = [
  {
    name: "M.",
    role: "MBA Admit",
    quote:
      "It felt like working with a strategist, not just a grammar checker. The coverage view saved me.",
  },
  {
    name: "R.",
    role: "Consultant → MBA",
    quote:
      "Design → Draft → Analyze kept me focused. I stopped second‑guessing and shipped drafts.",
  },
  {
    name: "A.",
    role: "Engineer → MBA",
    quote:
      "Adapting the same story for different schools was the killer feature.",
  },
];

export default function Testimonials() {
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const id = setInterval(
      () => setIdx((i) => (i + 1) % testimonials.length),
      4000,
    );
    return () => clearInterval(id);
  }, []);
  const t = testimonials[idx];

  return (
    <section className="mx-auto max-w-6xl px-6 py-16">
      <div className="grid items-center gap-8 md:grid-cols-2">
        <div>
          <h3 className="text-2xl font-semibold md:text-3xl">
            What candidates say
          </h3>
          <p className="mt-2 text-muted-foreground">
            Short, honest notes from recent users.
          </p>
        </div>
        <div className="rounded-lg border bg-card p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.3 }}
            >
              <p className="text-lg leading-7">"{t.quote}"</p>
              <div className="mt-4 text-sm text-muted-foreground">
                {t.name} • {t.role}
              </div>
            </motion.div>
          </AnimatePresence>
          <div className="mt-4 flex gap-1">
            {testimonials.map((_, i) => (
              <button
                key={i}
                className={`h-1.5 w-6 rounded-full ${i === idx ? "bg-brand-500" : "bg-black/10 dark:bg-white/10"}`}
                onClick={() => setIdx(i)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
