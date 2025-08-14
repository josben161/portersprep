"use client";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { useUser, SignInButton, SignOutButton } from "@clerk/nextjs";
import { User, LogOut, Settings, Menu, X } from "lucide-react";
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, isSignedIn } = useUser();
  const profileRef = useRef<HTMLDivElement>(null);

  const base =
    "transition-colors hover:text-foreground underline-offset-4 hover:underline";

  // Close profile dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target as Node)
      ) {
        setProfileOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link
          href={isSignedIn ? "/dashboard" : "/"}
          className="flex items-center"
        >
          <Image
            src="/brand/long_logo.png"
            alt="The Admit Architect"
            width={200}
            height={40}
            className="h-10 w-auto"
            priority
          />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-6 text-sm md:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`${base} ${pathname === l.href ? "text-foreground" : "text-muted-foreground"}`}
            >
              {l.label}
            </Link>
          ))}
          {isSignedIn ? (
            <Link
              href="/dashboard"
              className="rounded-md bg-primary px-3 py-1.5 text-primary-foreground shadow-sm hover:opacity-95"
            >
              Dashboard
            </Link>
          ) : (
            <Link
              href="/dashboard"
              className="rounded-md bg-primary px-3 py-1.5 text-primary-foreground shadow-sm hover:opacity-95"
            >
              Get admitted
            </Link>
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
                <span className="text-sm font-medium">
                  {user?.firstName || user?.emailAddresses?.[0]?.emailAddress}
                </span>
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
            <div className="flex items-center gap-2">
              <SignInButton>
                <button className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Sign in
                </button>
              </SignInButton>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-md hover:bg-muted transition-colors"
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t bg-background">
          <nav className="px-4 py-2 space-y-1">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={`block px-3 py-2 rounded-md text-sm transition-colors ${
                  pathname === l.href
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                {l.label}
              </Link>
            ))}
            {isSignedIn ? (
              <Link
                href="/dashboard"
                className="block px-3 py-2 rounded-md text-sm bg-primary text-primary-foreground hover:opacity-95"
              >
                Dashboard
              </Link>
            ) : (
              <Link
                href="/dashboard"
                className="block px-3 py-2 rounded-md text-sm bg-primary text-primary-foreground hover:opacity-95"
              >
                Get admitted
              </Link>
            )}
            {isSignedIn && (
              <>
                <Link
                  href="/dashboard/profile"
                  className="flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted rounded-md"
                >
                  <Settings className="h-4 w-4" />
                  Profile Settings
                </Link>
                <SignOutButton>
                  <button className="flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted rounded-md w-full text-left">
                    <LogOut className="h-4 w-4" />
                    Sign Out
                  </button>
                </SignOutButton>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
