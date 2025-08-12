"use client";
import Link from "next/link";
import ThemeToggle from "@/components/ThemeToggle";

export default function MarketingHeader(){
  return (
    <header className="sticky top-0 z-30 border-b bg-card/70 backdrop-blur supports-[backdrop-filter]:bg-card/60">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2">
          <div className="h-6 w-6 rounded-md bg-gradient-to-b from-brand-400 to-brand-600 shadow" />
          <span className="text-sm font-semibold">PortersPrep</span>
        </Link>
        <nav className="flex items-center gap-4 text-sm">
          <Link href="/pricing" className="text-muted-foreground hover:text-foreground">Pricing</Link>
          <Link href="/sign-in" className="text-muted-foreground hover:text-foreground">Sign in</Link>
          <Link href="/sign-up" className="btn btn-primary">Get started</Link>
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
} 