"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { Plus, Minus } from "lucide-react";
import { useState } from "react";

const faqs = [
  {
    question: "How does The Admit Architect help with MBA applications?",
    answer: "The Admit Architect is a comprehensive platform that guides you through every step of your MBA application process. We provide admission assessments, AI-powered essay writing tools, story management, and expert coaching to help you craft compelling applications that stand out to admissions committees."
  },
  {
    question: "Is The Admit Architect suitable for all MBA programs?",
    answer: "Yes! The Admit Architect is designed to work with all MBA programs, from top-tier schools like Harvard and Stanford to regional programs. Our tools adapt to each school's specific requirements and essay prompts."
  },
  {
    question: "How accurate are the admission assessments?",
    answer: "Our admission assessments use data from thousands of successful applications and are based on current admissions trends. While no assessment can guarantee admission, we provide realistic likelihood bands and specific recommendations to improve your chances."
  },
  {
    question: "Can I use The Admit Architect for multiple schools?",
    answer: "Absolutely! You can create separate application workspaces for each school you're applying to. Our platform helps you organize your applications, track deadlines, and adapt your stories for different essay prompts."
  },
  {
    question: "How does the AI essay feedback work?",
    answer: "Our AI analyzes your essays for content, structure, and alignment with each school's values. It provides specific suggestions while preserving your authentic voice. The AI is trained on successful MBA applications and understands what admissions committees look for."
  },
  {
    question: "What's included in the free plan?",
    answer: "The free plan includes 1 school workspace, 2 essays total, basic analysis, Story Bank up to 3 stories, and 5 AI actions per month. It's perfect for getting started and understanding how The Admit Architect works."
  },
  {
    question: "How do I get expert coaching?",
    answer: "Expert coaching is available through our Plus and Pro plans. You can book sessions with MBA admissions experts who have experience with your target schools. They provide personalized feedback and strategy guidance."
  },
  {
    question: "Is my data secure?",
    answer: "Yes, we take data security seriously. All your information is encrypted, and we never share your personal data with third parties. You maintain full control over your content and can export or delete your data at any time."
  },
  {
    question: "Can I cancel my subscription anytime?",
    answer: "Yes, you can cancel your subscription at any time. You'll continue to have access to your plan features until the end of your billing period. No long-term commitments required."
  },
  {
    question: "Do you offer refunds?",
    answer: "We offer a 30-day money-back guarantee for all paid plans. If you're not satisfied with The Admit Architect within the first 30 days, we'll provide a full refund."
  },
  {
    question: "How do I get started?",
    answer: "Getting started is easy! Simply sign up for a free account, complete your profile, and start with an admission assessment. Our platform will guide you through each step of the process."
  },
  {
    question: "What makes The Admit Architect different from other services?",
    answer: "The Admit Architect combines AI-powered tools with human expertise in a unified platform. Unlike traditional consulting, you get instant feedback and can work at your own pace. Unlike generic writing tools, our AI is specifically trained on MBA applications and understands what admissions committees look for."
  }
];

function FAQItem({ question, answer, isOpen, onToggle }: { question: string; answer: string; isOpen: boolean; onToggle: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="border-b border-border"
    >
      <button
        onClick={onToggle}
        className="flex w-full items-center justify-between py-6 text-left hover:bg-muted/50 transition-colors"
      >
        <h3 className="text-lg font-medium pr-4">{question}</h3>
        {isOpen ? (
          <Minus className="h-5 w-5 text-muted-foreground flex-shrink-0" />
        ) : (
          <Plus className="h-5 w-5 text-muted-foreground flex-shrink-0" />
        )}
      </button>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
          className="pb-6"
        >
          <p className="text-muted-foreground leading-relaxed">{answer}</p>
        </motion.div>
      )}
    </motion.div>
  );
}

export default function FAQPage() {
  const [openItems, setOpenItems] = useState<number[]>([]);

  const toggleItem = (index: number) => {
    setOpenItems(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

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
              <span className="h-1.5 w-1.5 rounded-full bg-brand-500" /> Common questions
            </span>
            <h1 className="mt-5 text-4xl font-semibold leading-tight tracking-tight md:text-6xl">
              Frequently Asked <span className="bg-gradient-to-r from-brand-400 to-brand-600 bg-clip-text text-transparent">Questions</span>
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-balance text-base text-muted-foreground md:text-lg">
              Get answers to the most common questions about The Admit Architect and how we can help with your MBA applications.
            </p>
          </motion.div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20">
        <div className="mx-auto max-w-4xl px-6">
          <div className="space-y-2">
            {faqs.map((faq, index) => (
              <FAQItem
                key={index}
                question={faq.question}
                answer={faq.answer}
                isOpen={openItems.includes(index)}
                onToggle={() => toggleItem(index)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-muted/30">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <h2 className="text-3xl font-semibold mb-4">Still have questions?</h2>
          <p className="text-lg text-muted-foreground mb-8">
            Can&apos;t find what you&apos;re looking for? Our support team is here to help.
          </p>
          <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link href="/contact" className="rounded-md bg-blue-600 px-6 py-3 text-white font-medium shadow-sm hover:bg-blue-700 transition-colors">
              Contact support
            </Link>
            <Link href="/sign-up" className="btn btn-outline">
              Start free trial
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
} 