import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "FAQ — The Admit Architect MBA Admissions CoPilot",
  description:
    "Frequently asked questions about The Admit Architect and MBA applications.",
  openGraph: {
    title: "FAQ — The Admit Architect MBA Admissions CoPilot",
    description:
      "Get answers to common questions about using The Admit Architect for your MBA applications.",
    type: "website",
  },
};

export default function FAQLayout({ children }: { children: React.ReactNode }) {
  return children;
}
