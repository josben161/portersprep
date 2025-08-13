import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "FAQ — The Academic Architect MBA Admissions CoPilot",
  description: "Frequently asked questions about The Academic Architect and MBA applications.",
  openGraph: {
    title: "FAQ — The Academic Architect MBA Admissions CoPilot",
    description: "Get answers to common questions about using The Academic Architect for your MBA applications.",
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