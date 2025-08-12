import type { Metadata } from "next";
import Hero from "@/components/marketing/Hero";
import Features from "@/components/marketing/Features";
import LogoStrip from "@/components/marketing/LogoStrip";
import Testimonials from "@/components/marketing/Testimonials";
import FinalCTA from "@/components/marketing/FinalCTA";

export const metadata: Metadata = {
  title: "Features — PortersPrep MBA Admissions CoPilot",
  description: "Discover the powerful features that make PortersPrep the ultimate MBA application workspace.",
  openGraph: {
    title: "Features — PortersPrep MBA Admissions CoPilot",
    description: "AI-powered essay analysis, story management, and school-specific guidance.",
    type: "website"
  }
};

export default function FeaturesPage() {
  return (
    <>
      <Hero />
      <Features />
      <LogoStrip />
      <Testimonials />
      <FinalCTA />
    </>
  );
} 