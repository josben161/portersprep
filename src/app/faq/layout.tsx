import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "FAQ — PortersPrep MBA Admissions CoPilot",
  description: "Frequently asked questions about PortersPrep and MBA applications.",
  openGraph: {
    title: "FAQ — PortersPrep MBA Admissions CoPilot",
    description: "Get answers to common questions about using PortersPrep for your MBA applications.",
    type: "website"
  }
};

export default function FAQLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
} 