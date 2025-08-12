import Image from "next/image";
import CampusCarousel from "@/components/CampusCarousel";

export const metadata = {
  title: "Your MBA Admissions Copilot — PortersPrep",
  description: "Assess your odds, sharpen essays with coaching-style feedback, and book an expert coach."
};

export default function Home() {
  // Complete list of university logos from the folder
  const universityLogos = [
    "/images/universities/HBS.png",
    "/images/universities/GSB.png", 
    "/images/universities/Said.png",
    "/images/universities/judge.png",
    "/images/universities/HKU.png",
    "/images/universities/insead.png",
    "/images/universities/wharton.png",
    "/images/universities/Tuck.png",
    "/images/universities/melbourne.png",
    "/images/universities/sydney.png"
  ];

  return (
    <>
      <section className="relative overflow-hidden mx-auto max-w-6xl px-4 py-20">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_60%_at_50%_-10%,_hsl(var(--primary)/0.15),_transparent_70%)]" />
        <div className="relative grid items-center gap-10 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <h1 className="text-4xl font-bold leading-tight md:text-5xl">
              Your MBA Admissions Copilot
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              Assess your odds, get voice-preserving AI redlines, and work with a coach who sees your docs and context.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="/dashboard" className="rounded-md bg-primary px-5 py-3 text-primary-foreground shadow-sm hover:opacity-95">Get admitted</a>
              <a href="/pricing" className="rounded-md border px-5 py-3">View paths to success</a>
            </div>
            <p className="mt-6 text-sm text-muted-foreground">
              Used by applicants targeting top MBA programs. We coach - You share your voice - We maximise you chances..
            </p>
          </div>
          <div className="flex justify-center lg:justify-end">
            <CampusCarousel />
          </div>
        </div>
      </section>

      {/* University Logos Carousel */}
      <section className="border-t border-b bg-muted/20 overflow-hidden">
        <div className="mx-auto max-w-6xl px-4 py-8">
          <div className="text-center mb-6">
            <p className="text-sm text-muted-foreground font-medium">
              Used by applicants to get accepted to world leading institutions
            </p>
          </div>
          
          {/* Continuous Carousel Container */}
          <div className="relative">
            <div className="flex animate-scroll-left">
              {[...universityLogos, ...universityLogos, ...universityLogos].map((logo, index) => (
                <div key={`logo-${index}`} className="flex items-center justify-center mx-8 md:mx-12 flex-shrink-0">
                  <div className="relative w-20 h-12 md:w-24 md:h-14 opacity-40 hover:opacity-60 transition-opacity">
                    <Image
                      src={logo}
                      alt="University logo"
                      fill
                      className="object-contain"
                      sizes="(max-width: 768px) 80px, 96px"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="border-t bg-muted/30">
        <div className="mx-auto grid max-w-6xl gap-6 px-4 py-14 sm:grid-cols-3">
          {[
            { title: "Assess", desc: "Tailored school strategy + likelihood bands based on your profile." },
            { title: "Edit", desc: "Collaborative editor with AI redlines that preserve your authentic voice." },
            { title: "Coach", desc: "Message a coach and book time; we bring your docs and context along." }
          ].map(c => (
            <div key={c.title} className="rounded-lg border bg-card p-5 shadow-sm hover:shadow-md hover:translate-y-[1px] transition">
              <div className="text-base font-semibold">{c.title}</div>
              <p className="mt-2 text-sm text-muted-foreground">{c.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="text-2xl font-semibold">Why PortersPrep vs traditional consulting?</h2>
        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <div className="rounded-lg border p-6">
            <h3 className="font-medium">You get speed + structure</h3>
            <ul className="mt-3 list-disc pl-5 text-sm text-muted-foreground space-y-2">
              <li>Instant, repeatable feedback — not calendar-bound.</li>
              <li>Clear timelines and actionables.</li>
              <li>Ethics first: We coach - You share your voice - We maximise you chances..</li>
            </ul>
          </div>
          <div className="rounded-lg border p-6">
            <h3 className="font-medium">You keep your voice</h3>
            <ul className="mt-3 list-disc pl-5 text-sm text-muted-foreground space-y-2">
              <li>No ghostwriting — we never write essays for you.</li>
              <li>Redlines emphasize clarity and impact.</li>
              <li>Coaches see your latest drafts and context.</li>
            </ul>
          </div>
        </div>
        <div className="mt-10 rounded-lg border bg-card p-6 text-center">
          <h3 className="text-lg font-semibold">Ready to start?</h3>
          <p className="mt-2 text-sm text-muted-foreground">Create your first assessment in minutes.</p>
          <a href="/dashboard" className="mt-4 inline-block rounded-md bg-primary px-5 py-2.5 text-primary-foreground shadow-sm hover:opacity-95">Get admitted</a>
        </div>
      </section>
    </>
  );
} 