"use client";
import { motion } from "framer-motion";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* Background */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(800px_400px_at_10%_-10%,rgba(57,109,255,0.18),transparent_60%),radial-gradient(800px_400px_at_90%_-20%,rgba(57,109,255,0.12),transparent_60%)]" />
      </div>

      <div className="mx-auto max-w-6xl px-6 py-20 md:py-28">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="mx-auto max-w-3xl text-center"
        >
          <span className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs text-muted-foreground backdrop-blur">
            <span className="h-1.5 w-1.5 rounded-full bg-brand-500" /> Your MBA, but with a strategist in the loop
          </span>
          <h1 className="mt-5 text-4xl font-semibold leading-tight tracking-tight md:text-6xl">
            The <span className="bg-gradient-to-r from-brand-400 to-brand-600 bg-clip-text text-transparent">IDE for MBA Applicants</span>
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-balance text-base text-muted-foreground md:text-lg">
            Design your narrative, draft faster, and tailor every essay to each school's DNA. Strategy, writing, and feedback—all in one focused workspace.
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link href="/sign-up" className="btn btn-primary">
              Get started free
            </Link>
            <Link href="/pricing" className="btn btn-outline">
              See plans
            </Link>
          </div>

          <div className="mt-6 text-xs text-muted-foreground">
            No fake stats. Just a clean start and real tools that help.
          </div>
        </motion.div>
      </div>
    </section>
  );
} 