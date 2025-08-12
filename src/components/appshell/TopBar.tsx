"use client";
import Link from "next/link";
import ThemeToggle from "@/components/ThemeToggle";
import FocusToggle from "@/components/FocusToggle";

export default function TopBar({
  title,
  subtitle,
  actions,
}: { title: string; subtitle?: string; actions?: React.ReactNode }) {
  return (
    <div className="flex h-14 items-center justify-between">
      <div className="min-w-0 hide-in-focus">
        <div className="truncate text-sm text-muted-foreground">{subtitle}</div>
        <h1 className="truncate text-lg font-semibold leading-none">{title}</h1>
      </div>
      <div className="flex items-center gap-2">
        <ThemeToggle />
        <FocusToggle />
        <Link href="/dashboard" className="rounded-md border px-3 py-1.5 text-sm">Dashboard</Link>
        {actions}
      </div>
    </div>
  );
} 