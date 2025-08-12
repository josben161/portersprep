"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

export default function Hero() {
  // University logos for the carousel
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
    <section className="relative overflow-hidden">
      {/* Background */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(800px_400px_at_10%_-10%,rgba(57,109,255,0.18),transparent_60%),radial-gradient(800px_400px_at_90%_-20%,rgba(57,109,255,0.12),transparent_60%)]" />
      </div>

      <div className="mx-auto max-w-6xl px-6 py-20 md:py-28">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="mx-auto max-w-3xl text-center"
        >
          <span className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs text-muted-foreground backdrop-blur">
            <span className="h-1.5 w-1.5 rounded-full bg-brand-500" /> Your MBA, but with a strategist in the loop
          </span>
          <h1 className="mt-5 text-4xl font-semibold leading-tight tracking-tight md:text-6xl">
            The <span className="bg-gradient-to-r from-brand-400 to-brand-600 bg-clip-text text-transparent">CoPilot for MBA Applicants</span>
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-balance text-base text-muted-foreground md:text-lg">
            Design your narrative, draft faster, and tailor every essay to each school's DNA. Strategy, writing, and feedback—all in one focused workspace.
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link href="/sign-up" className="rounded-md bg-blue-600 px-4 py-2 text-white text-sm font-medium shadow-sm hover:bg-blue-700 transition-colors">
              Get started free
            </Link>
            <Link href="/pricing" className="btn btn-outline">
              See plans
            </Link>
          </div>

          <div className="mt-6 text-xs text-muted-foreground">
            No fake stats. Just a clean start and real tools that help.
          </div>
        </motion.div>

        {/* University Logos Carousel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="mt-16"
        >
          <div className="text-center mb-6">
            <p className="text-sm text-muted-foreground font-medium">
              Used by applicants to get accepted to world leading institutions
            </p>
          </div>
          
          {/* Continuous Carousel Container */}
          <div className="relative overflow-hidden">
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
        </motion.div>
      </div>
    </section>
  );
} 