"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { Target, FileText, Sparkles, Users, BarChart3, BookOpen, Zap, Shield, Clock, TrendingUp } from "lucide-react";

const features = [
  {
    icon: Target,
    title: "Admission Assessment",
    description: "Get detailed probability analysis for each target school based on your unique profile.",
    benefits: [
      "School-specific likelihood bands",
      "Profile strength analysis",
      "Strategic recommendations"
    ]
  },
  {
    icon: FileText,
    title: "Essay Workspace",
    description: "AI-powered writing environment with real-time feedback and suggestions.",
    benefits: [
      "Voice-preserving AI suggestions",
      "Real-time grammar and style checks",
      "Word count and limit tracking"
    ]
  },
  {
    icon: BookOpen,
    title: "Story Bank",
    description: "Organize and manage your key experiences for different essay prompts.",
    benefits: [
      "Tag and categorize stories",
      "Track usage across applications",
      "Strength and relevance ratings"
    ]
  },
  {
    icon: Sparkles,
    title: "AI-Powered Analysis",
    description: "Get detailed feedback on your essays with school-specific insights.",
    benefits: [
      "Content and structure analysis",
      "School alignment scoring",
      "Improvement suggestions"
    ]
  },
  {
    icon: Users,
    title: "Expert Coaching",
    description: "Connect with MBA admissions experts for personalized guidance.",
    benefits: [
      "School-specific expertise",
      "Mock interview preparation",
      "Application strategy sessions"
    ]
  },
  {
    icon: BarChart3,
    title: "Progress Tracking",
    description: "Monitor your application progress across all target schools.",
    benefits: [
      "Visual progress indicators",
      "Deadline management",
      "Completion analytics"
    ]
  }
];

const advancedFeatures = [
  {
    icon: Zap,
    title: "AI Draft Generation",
    description: "Generate essay outlines and coaching drafts from your story bank."
  },
  {
    icon: Shield,
    title: "Plagiarism Protection",
    description: "Ensure your essays are original and authentic to your voice."
  },
  {
    icon: Clock,
    title: "Auto-Save",
    description: "Never lose your work with automatic saving and version history."
  },
  {
    icon: TrendingUp,
    title: "Performance Analytics",
    description: "Track your improvement over time with detailed metrics."
  }
];

export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-[radial-gradient(800px_400px_at_10%_-10%,rgba(57,109,255,0.18),transparent_60%),radial-gradient(800px_400px_at_90%_-20%,rgba(57,109,255,0.12),transparent_60%)]" />
        </div>

        <div className="mx-auto max-w-6xl px-6 py-20 md:py-28">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="mx-auto max-w-3xl text-center"
          >
            <span className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs text-muted-foreground backdrop-blur">
              <span className="h-1.5 w-1.5 rounded-full bg-brand-500" /> Powerful tools
            </span>
            <h1 className="mt-5 text-4xl font-semibold leading-tight tracking-tight md:text-6xl">
              Everything you need for <span className="bg-gradient-to-r from-brand-400 to-brand-600 bg-clip-text text-transparent">MBA Success</span>
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-balance text-base text-muted-foreground md:text-lg">
              From initial assessment to final submission, PortersPrep provides the tools, insights, and guidance you need to craft compelling MBA applications.
            </p>

            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link href="/sign-up" className="rounded-md bg-blue-600 px-4 py-2 text-white text-sm font-medium shadow-sm hover:bg-blue-700 transition-colors">
                Try for free
              </Link>
              <Link href="/pricing" className="btn btn-outline">
                View pricing
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main Features */}
      <section className="py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-semibold mb-4">Core Features</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Everything you need to build compelling MBA applications, from assessment to submission.
            </p>
          </div>
          
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="group rounded-lg border bg-card p-6 hover:shadow-lg transition-all duration-200"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-brand-100 text-brand-600 mb-4 group-hover:scale-110 transition-transform">
                    <IconComponent className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground mb-4">{feature.description}</p>
                  <ul className="space-y-2">
                    {feature.benefits.map((benefit, benefitIndex) => (
                      <li key={benefitIndex} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <div className="h-1.5 w-1.5 rounded-full bg-brand-500" />
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Advanced Features */}
      <section className="py-20 bg-muted/30">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-semibold mb-4">Advanced Features</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Premium tools and capabilities for serious applicants who want every advantage.
            </p>
          </div>
          
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {advancedFeatures.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="text-center"
                >
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-100 text-brand-600 mx-auto mb-4">
                    <IconComponent className="h-8 w-8" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <h2 className="text-3xl font-semibold mb-4">Ready to transform your MBA application?</h2>
          <p className="text-lg text-muted-foreground mb-8">
            Join thousands of applicants who have used PortersPrep to get into their dream MBA programs.
          </p>
          <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link href="/sign-up" className="rounded-md bg-blue-600 px-6 py-3 text-white font-medium shadow-sm hover:bg-blue-700 transition-colors">
              Start free trial
            </Link>
            <Link href="/how-it-works" className="btn btn-outline">
              See how it works
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
} 