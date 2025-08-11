"use client";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";

const links = [
  { href: "/", label: "Home" },
  { href: "/how-it-works", label: "How it works" },
  { href: "/features", label: "Features" },
  { href: "/pricing", label: "Pricing" },
  { href: "/faq", label: "FAQ" },
];

export default function TopNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  
  const base = "transition-colors hover:text-foreground underline-offset-4 hover:underline";
  
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="flex items-center">
          <Image
            src="/brand/portersprep.png"
            alt="PortersPrep"
            width={160}
            height={40}
            className="h-10 w-auto"
            priority
          />
        </Link>
        <nav className="hidden items-center gap-6 text-sm md:flex">
          {links.map(l => (
            <Link
              key={l.href}
              href={l.href}
              className={`${base} ${pathname===l.href ? "text-foreground" : "text-muted-foreground"}`}
            >
              {l.label}
            </Link>
          ))}
          <Link href="/dashboard" className="rounded-md bg-primary px-3 py-1.5 text-primary-foreground shadow-sm hover:opacity-95">Get admitted</Link>
        </nav>
        <button
          aria-label="Menu"
          onClick={() => setOpen(!open)}
          className="inline-flex items-center rounded md:hidden"
        >
          <svg width="24" height="24" fill="currentColor"><path d="M4 6h16M4 12h16M4 18h16"/></svg>
        </button>
      </div>
      {open && (
        <div className="border-t bg-background md:hidden">
          <div className="mx-auto max-w-6xl px-4 py-3 flex flex-col gap-2">
            {links.map(l => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className={`py-1 ${pathname===l.href ? "text-foreground" : "text-muted-foreground"}`}
              >
                {l.label}
              </Link>
            ))}
            <Link href="/dashboard" onClick={() => setOpen(false)} className="mt-1 rounded-md bg-primary px-3 py-2 text-primary-foreground text-center shadow-sm hover:opacity-95">Get admitted</Link>
            <div className="border-t pt-2 mt-2">
              <Link href="/sign-in" onClick={() => setOpen(false)} className="block py-1 text-muted-foreground">Sign In</Link>
              <Link href="/sign-up" onClick={() => setOpen(false)} className="block py-1 text-muted-foreground">Sign Up</Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
} 