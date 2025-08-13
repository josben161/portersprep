export function defaultOpenGraph() {
  return {
    title: "The Academic Architect — MBA Admissions Copilot",
    description: "Assess your odds, get coaching-style essay feedback, and book time with an expert coach.",
    url: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
    siteName: "The Academic Architect",
    type: "website",
  };
}

export function jsonLdOrganization() {
  return {
    "@context": "https://schema.org",
    "@type": "EducationalService",
    name: "The Academic Architect",
    url: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
    description: "We coach - You share your voice - We maximise you chances..",
    serviceType: "MBA Admissions Consulting",
    areaServed: "Worldwide",
    provider: {
      "@type": "Organization",
      name: "The Academic Architect",
      url: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
    },
  };
} 