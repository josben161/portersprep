import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "How PortersPrep Works — MBA Admissions CoPilot",
  description: "See how PortersPrep guides you through every step of your MBA application process.",
  openGraph: {
    title: "How PortersPrep Works — MBA Admissions CoPilot",
    description: "Step-by-step guide to using PortersPrep for your MBA applications.",
    type: "website"
  }
};

export default function HowItWorksLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
} 