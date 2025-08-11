export const metadata = {
  title: "PortersPrep — MBA Admissions Copilot",
  description: "Assess • Edit • Coach. We coach - You share your voice - We maximise you chances..",
  icons: { icon: "/favicon.png" },
  openGraph: {
    title: "PortersPrep — MBA Admissions Copilot",
    description: "Assess • Edit • Coach. We coach - You share your voice - We maximise you chances..",
    url: process.env.NEXT_PUBLIC_APP_URL,
    siteName: "PortersPrep",
    images: ["/og.png"],
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "PortersPrep — MBA Admissions Copilot",
    description: "Assess • Edit • Coach. We coach - You share your voice - We maximise you chances..",
    images: ["/og.png"]
  }
};

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
} 