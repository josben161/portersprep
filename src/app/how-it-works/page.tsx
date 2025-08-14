"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  CheckCircle,
  ArrowRight,
  Target,
  FileText,
  Sparkles,
  Users,
} from "lucide-react";

const steps = [
  {
    icon: Target,
    title: "1. Assess Your Chances",
    description:
      "Get a detailed analysis of your admission probability for each target school based on your profile, experience, and goals.",
    details: [
      "Upload your resume and background",
      "Receive school-specific likelihood bands",
      "Get personalized strategy recommendations",
    ],
  },
  {
    icon: FileText,
    title: "2. Set Up Your Applications",
    description:
      "Create application workspaces for each school with their specific requirements, deadlines, and essay prompts.",
    details: [
      "Import school requirements automatically",
      "Track deadlines and progress",
      "Organize by round and priority",
    ],
  },
  {
    icon: Sparkles,
    title: "3. Build Your Story Bank",
    description:
      "Organize your key experiences, achievements, and stories that you'll adapt for different essay prompts.",
    details: [
      "Create anchor stories with tags",
      "Rate story strength and relevance",
      "Track usage across applications",
    ],
  },
  {
    icon: FileText,
    title: "4. Draft with AI Guidance",
    description:
      "Write essays with AI-powered suggestions that preserve your voice while improving clarity and impact.",
    details: [
      "Get real-time feedback as you write",
      "AI suggests improvements and alternatives",
      "Maintain your authentic voice",
    ],
  },
  {
    icon: Users,
    title: "5. Get Expert Review",
    description:
      "Submit your drafts for review by MBA admissions experts who understand each school's unique criteria.",
    details: [
      "School-specific feedback",
      "Detailed improvement suggestions",
      "Mock interview preparation",
    ],
  },
];

export default function HowItWorksPage() {
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
              <span className="h-1.5 w-1.5 rounded-full bg-brand-500" />{" "}
              Step-by-step process
            </span>
            <h1 className="mt-5 text-4xl font-semibold leading-tight tracking-tight md:text-6xl">
              How{" "}
              <span className="bg-gradient-to-r from-brand-400 to-brand-600 bg-clip-text text-transparent">
                The Admit Architect Works
              </span>
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-balance text-base text-muted-foreground md:text-lg">
              From initial assessment to final submission, we guide you through
              every step of your MBA application journey with AI-powered tools
              and expert insights.
            </p>

            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                href="/sign-up"
                className="rounded-md bg-blue-600 px-4 py-2 text-white text-sm font-medium shadow-sm hover:bg-blue-700 transition-colors"
              >
                Start your journey
              </Link>
              <Link href="/pricing" className="btn btn-outline">
                See pricing
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Process Steps */}
      <section className="py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid gap-12">
            {steps.map((step, index) => {
              const IconComponent = step.icon;
              return (
                <motion.div
                  key={step.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className={`grid gap-8 md:grid-cols-2 md:gap-12 ${
                    index % 2 === 1 ? "md:[&>div:first-child]:order-2" : ""
                  }`}
                >
                  <div className="flex flex-col justify-center">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-100 text-brand-600">
                        <IconComponent className="h-6 w-6" />
                      </div>
                      <h2 className="text-2xl font-semibold">{step.title}</h2>
                    </div>
                    <p className="text-lg text-muted-foreground mb-6">
                      {step.description}
                    </p>
                    <ul className="space-y-3">
                      {step.details.map((detail, detailIndex) => (
                        <li
                          key={detailIndex}
                          className="flex items-start gap-3"
                        >
                          <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-muted-foreground">
                            {detail}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="flex items-center justify-center">
                    <div className="relative">
                      <div className="h-64 w-64 rounded-2xl bg-gradient-to-br from-brand-50 to-blue-50 border-2 border-brand-100 flex items-center justify-center">
                        <IconComponent className="h-16 w-16 text-brand-600" />
                      </div>
                      {index < steps.length - 1 && (
                        <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2">
                          <ArrowRight className="h-6 w-6 text-brand-400 rotate-90" />
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-muted/30">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <h2 className="text-3xl font-semibold mb-4">
            Ready to start your MBA journey?
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Join thousands of applicants who have used The Admit Architect to
            get into their dream MBA programs.
          </p>
          <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/sign-up"
              className="rounded-md bg-blue-600 px-6 py-3 text-white font-medium shadow-sm hover:bg-blue-700 transition-colors"
            >
              Get started free
            </Link>
            <Link href="/pricing" className="btn btn-outline">
              View pricing plans
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
