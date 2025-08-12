import type { Metadata } from "next";
import Hero from "@/components/marketing/Hero";
import FAQ from "@/components/marketing/FAQ";
import FinalCTA from "@/components/marketing/FinalCTA";

export const metadata: Metadata = {
  title: "FAQ — PortersPrep MBA Admissions CoPilot",
  description: "Frequently asked questions about PortersPrep and MBA applications.",
  openGraph: {
    title: "FAQ — PortersPrep MBA Admissions CoPilot",
    description: "Get answers to common questions about using PortersPrep for your MBA applications.",
    type: "website"
  }
};

export default function FAQPage() {
  return (
    <>
      <Hero />
      <FAQ />
      <FinalCTA />
    </>
  );
} 