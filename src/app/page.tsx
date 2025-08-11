import Image from "next/image";

export const metadata = {
  title: "Your MBA Admissions Copilot — PortersPrep",
  description: "Assess your odds, sharpen essays with coaching-style feedback, and book an expert coach."
};

export default function Home() {
  const universities = [
    { name: "Harvard Business School", logo: "/images/universities/harvard.png" },
    { name: "Stanford GSB", logo: "/images/universities/stanford.png" },
    { name: "Oxford", logo: "/images/universities/oxford.png" },
    { name: "Cambridge", logo: "/images/universities/cambridge.png" },
    { name: "HKU", logo: "/images/universities/hku.png" },
    { name: "INSEAD", logo: "/images/universities/insead.png" },
    { name: "Melbourne University", logo: "/images/universities/melbourne.png" },
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
              <a href="/dashboard" className="rounded-md bg-primary px-5 py-3 text-primary-foreground shadow-sm hover:opacity-95">Open the App</a>
              <a href="/pricing" className="rounded-md border px-5 py-3">View Pricing</a>
            </div>
            <p className="mt-6 text-sm text-muted-foreground">
              Used by applicants targeting top MBA programs. We coach - You share your voice - We maximise you chances..
            </p>
          </div>
          <div className="flex justify-center lg:justify-end">
            <div className="relative w-full max-w-sm">
              {/* Replace this with your actual image */}
              <div className="aspect-[4/5] rounded-xl border bg-gradient-to-br from-primary/10 to-primary/5 overflow-hidden">
                <Image
                  src="/images/success-story.jpg" // Add your image here
                  alt="Student celebrating MBA acceptance"
                  width={400}
                  height={500}
                  className="w-full h-full object-cover"
                  priority
                />
                {/* Optional overlay with success text */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                  <p className="text-white text-sm font-medium">Our users have been accepted to Harvard Business School, GSB, and more! See how you can join them.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* University Logos Carousel */}
      <section className="border-t border-b bg-muted/20 overflow-hidden">
        <div className="mx-auto max-w-6xl px-4 py-8">
          <div className="text-center mb-6">
            <p className="text-sm text-muted-foreground font-medium">
              Trusted by applicants targeting leading institutions worldwide
            </p>
          </div>
          
          {/* Carousel Container */}
          <div className="relative">
            {/* First row of logos */}
            <div className="flex animate-scroll-left">
              {[...universities, ...universities].map((university, index) => (
                <div key={`${university.name}-${index}`} className="flex items-center justify-center mx-8 md:mx-12 flex-shrink-0">
                  <div className="relative w-20 h-12 md:w-24 md:h-14 opacity-40 hover:opacity-60 transition-opacity">
                    <Image
                      src={university.logo}
                      alt={university.name}
                      fill
                      className="object-contain"
                      sizes="(max-width: 768px) 80px, 96px"
                    />
                  </div>
                </div>
              ))}
            </div>
            
            {/* Second row of logos (reverse direction) */}
            <div className="flex animate-scroll-right mt-4">
              {[...universities, ...universities].map((university, index) => (
                <div key={`${university.name}-reverse-${index}`} className="flex items-center justify-center mx-8 md:mx-12 flex-shrink-0">
                  <div className="relative w-20 h-12 md:w-24 md:h-14 opacity-40 hover:opacity-60 transition-opacity">
                    <Image
                      src={university.logo}
                      alt={university.name}
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
          <a href="/dashboard" className="mt-4 inline-block rounded-md bg-primary px-5 py-2.5 text-primary-foreground shadow-sm hover:opacity-95">Open the App</a>
        </div>
      </section>
    </>
  );
} 