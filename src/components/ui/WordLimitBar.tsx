"use client";
import { motion } from "framer-motion";
export default function WordLimitBar({ count, limit }:{ count: number; limit?: number|null }) {
  const max = limit ?? Math.max(300, count + 50);
  const pct = Math.min(100, (count / max) * 100);
  const color = limit ? (count > limit ? "bg-rose-500" : pct > 90 ? "bg-amber-500" : "bg-brand-500") : "bg-brand-500";
  return (
    <div className="h-2 w-full overflow-hidden rounded-full bg-black/5 dark:bg-white/10">
      <motion.div
        className={`h-full ${color}`}
        initial={{ width: 0 }}
        animate={{ width: `${pct}%` }}
        transition={{ duration: .35, ease: [0.16,1,0.3,1] }}
      />
    </div>
  );
} 