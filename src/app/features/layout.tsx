import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Features — The Admit Architect MBA Admissions CoPilot",
  description:
    "Discover the powerful features that make The Admit Architect the ultimate MBA application workspace.",
  openGraph: {
    title: "Features — The Admit Architect MBA Admissions CoPilot",
    description:
      "AI-powered essay analysis, story management, and school-specific guidance.",
    type: "website",
  },
};

export default function FeaturesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
