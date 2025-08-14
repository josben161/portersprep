import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "How The Admit Architect Works — MBA Admissions CoPilot",
  description:
    "See how The Admit Architect guides you through every step of your MBA application process.",
  openGraph: {
    title: "How The Admit Architect Works — MBA Admissions CoPilot",
    description:
      "Step-by-step guide to using The Admit Architect for your MBA applications.",
    type: "website",
  },
};

export default function HowItWorksLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
