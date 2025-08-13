"use client";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { useUser, SignInButton, SignOutButton } from "@clerk/nextjs";
import { User, LogOut, Settings } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";

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
  const [profileOpen, setProfileOpen] = useState(false);
  const { user, isSignedIn } = useUser();
  const profileRef = useRef<HTMLDivElement>(null);
  
  const base = "transition-colors hover:text-foreground underline-offset-4 hover:underline";
  
  // Close profile dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setProfileOpen(false);
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="flex items-center">
          <Image
            src="/brand/the-admit-architect-horizontal.svg"
            alt="The Admit Architect"
            width={200}
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
          {isSignedIn ? (
            <Link href="/dashboard" className="rounded-md bg-primary px-3 py-1.5 text-primary-foreground shadow-sm hover:opacity-95">Dashboard</Link>
          ) : (
            <Link href="/dashboard" className="rounded-md bg-primary px-3 py-1.5 text-primary-foreground shadow-sm hover:opacity-95">Get admitted</Link>
          )}
        </nav>
        
        {/* Desktop Profile Menu */}
        <div className="hidden md:flex items-center gap-4">
          <ThemeToggle />
          {isSignedIn ? (
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2 p-2 rounded-md hover:bg-muted transition-colors"
              >
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                  <User className="h-4 w-4 text-primary-foreground" />
                </div>
                <span className="text-sm font-medium">{user?.firstName || user?.emailAddresses?.[0]?.emailAddress}</span>
              </button>
              
              {profileOpen && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-background border rounded-md shadow-lg py-1">
                  <Link
                    href="/dashboard/profile"
                    onClick={() => setProfileOpen(false)}
                    className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-muted"
                  >
                    <Settings className="h-4 w-4" />
                    Profile Settings
                  </Link>
                  <SignOutButton>
                    <button className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-muted w-full text-left">
                      <LogOut className="h-4 w-4" />
                      Sign Out
                    </button>
                  </SignOutButton>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <SignInButton>
                <button className="text-sm text-muted-foreground hover:text-foreground">
                  Sign In
                </button>
              </SignInButton>
              <Link href="/sign-up" className="rounded-md bg-slate-900 px-3 py-1.5 text-white text-sm shadow-sm hover:bg-slate-800 transition-colors font-medium">
                Get Started
              </Link>
            </div>
          )}
        </div>
        
        {/* Mobile Menu Button */}
        <button
          aria-label="Menu"
          onClick={() => setOpen(!open)}
          className="inline-flex items-center rounded md:hidden"
        >
          <svg width="24" height="24" fill="currentColor"><path d="M4 6h16M4 12h16M4 18h16"/></svg>
        </button>
      </div>
      
      {/* Mobile Menu */}
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
            
            {isSignedIn ? (
              <>
                <Link href="/dashboard" onClick={() => setOpen(false)} className="mt-1 rounded-md bg-primary px-3 py-2 text-primary-foreground text-center shadow-sm hover:opacity-95">Dashboard</Link>
                <div className="border-t pt-2 mt-2">
                  <Link href="/dashboard/profile" onClick={() => setOpen(false)} className="flex items-center gap-2 py-1 text-muted-foreground">
                    <Settings className="h-4 w-4" />
                    Profile Settings
                  </Link>
                  <SignOutButton>
                    <button className="flex items-center gap-2 py-1 text-muted-foreground w-full text-left">
                      <LogOut className="h-4 w-4" />
                      Sign Out
                    </button>
                  </SignOutButton>
                </div>
              </>
            ) : (
              <>
                <Link href="/dashboard" onClick={() => setOpen(false)} className="mt-1 rounded-md bg-slate-900 px-3 py-2 text-white text-center shadow-sm hover:bg-slate-800 transition-colors font-medium">Get admitted</Link>
                <div className="border-t pt-2 mt-2">
                  <SignInButton>
                    <button className="block py-1 text-muted-foreground w-full text-left">Sign In</button>
                  </SignInButton>
                </div>
              </>
            )}
            <div className="border-t pt-2 mt-2">
              <div className="flex items-center justify-between py-1">
                <span className="text-sm text-muted-foreground">Theme</span>
                <ThemeToggle />
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
} 