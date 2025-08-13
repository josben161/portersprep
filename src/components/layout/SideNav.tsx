"use client";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

const items = [
  { href: "/dashboard", label: "Profile", desc: "Resume & Story Bank" },
  { href: "/dashboard/predict", label: "Predict", desc: "Fit by school" },
  { href: "/dashboard/applications", label: "Applications", desc: "Essays & tasks" },
  { href: "/dashboard/recommendations", label: "Recommendations", desc: "School-specific" },
  { href: "/dashboard/coach", label: "Coach", desc: "Ask anything" },
];

export default function SideNav() {
  const pathname = usePathname();
  return (
    <aside className="hidden w-60 shrink-0 border-r bg-background md:block">
      <div className="p-4 flex items-center">
        <Image
          src="/brand/long_logo.png"
          alt="The Admit Architect"
          width={160}
          height={40}
          className="h-8 w-auto"
        />
      </div>
      <div className="px-2 pb-3 pt-1 text-xs uppercase tracking-wide text-muted-foreground">Command Center</div>
      <nav className="px-2 pb-4 space-y-1">
        {items.map(it => {
          const active = pathname === it.href || pathname?.startsWith(it.href + "/");
          return (
            <Link
              key={it.href}
              href={it.href}
              className={`block rounded-md px-3 py-2 text-sm transition-colors ${active ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted"}`}
            >
              <div className="font-medium">{it.label}</div>
              <div className="text-[11px] text-muted-foreground">{it.desc}</div>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
} 