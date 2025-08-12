import type { Metadata } from "next";
import Hero from "@/components/marketing/Hero";
import Features from "@/components/marketing/Features";
import Testimonials from "@/components/marketing/Testimonials";
import FinalCTA from "@/components/marketing/FinalCTA";

export const metadata: Metadata = {
  title: "How PortersPrep Works — MBA Admissions CoPilot",
  description: "See how PortersPrep guides you through every step of your MBA application process.",
  openGraph: {
    title: "How PortersPrep Works — MBA Admissions CoPilot",
    description: "Step-by-step guide to using PortersPrep for your MBA applications.",
    type: "website"
  }
};

export default function HowItWorksPage() {
  return (
    <>
      <Hero />
      <Features />
      <Testimonials />
      <FinalCTA />
    </>
  );
} 