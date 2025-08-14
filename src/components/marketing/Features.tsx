"use client";
import { motion } from "framer-motion";
import { ReactNode } from "react";

const items: { title: string; desc: string; icon: ReactNode }[] = [
  {
    title: "Narrative Graph",
    desc: "Anchor stories, metrics, and values—reused intelligently across schools.",
    icon: <span>🧭</span>,
  },
  {
    title: "Design → Draft → Analyze",
    desc: "A guided workflow that mirrors how great essays are made.",
    icon: <span>✍️</span>,
  },
  {
    title: "Per‑School Adaptation",
    desc: "Same story, different emphasis. Tone and structure matched to each school.",
    icon: <span>🎚️</span>,
  },
  {
    title: "Coverage & Consistency",
    desc: "See which stories appear where. Avoid repetition, show range.",
    icon: <span>🗺️</span>,
  },
];

export default function Features() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-16 md:py-24">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-3xl font-semibold md:text-4xl">
          Built like a pro's toolkit
        </h2>
        <p className="mt-3 text-muted-foreground">
          Everything you need to craft a compelling, consistent application
          across schools.
        </p>
      </div>
      <div className="mt-10 grid gap-4 sm:grid-cols-2 md:grid-cols-4">
        {items.map((it, i) => (
          <motion.div
            key={it.title}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ delay: i * 0.05, duration: 0.4 }}
            className="card p-5"
          >
            <div className="text-2xl">{it.icon}</div>
            <div className="mt-3 text-base font-medium">{it.title}</div>
            <p className="mt-1 text-sm text-muted-foreground">{it.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
