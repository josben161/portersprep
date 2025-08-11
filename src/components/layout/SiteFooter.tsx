import Link from "next/link";

export default function SiteFooter() {
  return (
    <footer className="border-t bg-gradient-to-b from-transparent to-accent/40">
      <div className="mx-auto max-w-6xl px-4 py-10 text-sm text-muted-foreground">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} PortersPrep — We coach - You share your voice - We maximise you chances..</p>
          <nav className="flex flex-wrap gap-4">
            <Link href="/about" className="hover:underline underline-offset-4">About</Link>
            <Link href="/privacy" className="hover:underline underline-offset-4">Privacy</Link>
            <Link href="/terms" className="hover:underline underline-offset-4">Terms</Link>
            <Link href="/contact" className="hover:underline underline-offset-4">Contact</Link>
          </nav>
        </div>
      </div>
    </footer>
  );
} 