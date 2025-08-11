'use client';

import { useState } from 'react';

export default function FAQ() {
  const [openItem, setOpenItem] = useState<number | null>(0);

  const faqs = [
    {
      question: "How does PortersPrep's pricing work?",
      answer: "We offer three tiers: Free (1 assessment/month, 1 essay, 3 redlines), Plus ($49/month for 3 assessments, 5 essays, 20 redlines), and Pro ($199/month for unlimited assessments, 20 essays, 100 redlines). All plans include coach messaging and consultation sessions."
    },
    {
      question: "Do you write essays for me?",
      answer: "No. We coach; you write. Our AI provides feedback and suggestions to improve your writing, but we never write essays for you. This ensures your voice and authenticity shine through in your application."
    },
    {
      question: "How accurate are the school likelihood assessments?",
      answer: "Our assessments are based on historical data and current admissions trends, but they're estimates, not guarantees. Many factors influence admissions decisions, and we provide likelihood bands rather than exact percentages."
    },
    {
      question: "What makes your coaches qualified?",
      answer: "Our coaches are experienced MBA admissions consultants with backgrounds in top business schools. They understand the application process, essay requirements, and what admissions committees look for in candidates."
    },
    {
      question: "How do you protect my privacy and data?",
      answer: "We take data security seriously. All personal information and essays are encrypted, and we never share your data with third parties. You can request deletion of your data at any time."
    },
    {
      question: "Can I use PortersPrep for multiple school applications?",
      answer: "Yes! Your subscription covers multiple school applications. Each assessment is school-specific, and you can create separate essays for different programs within your plan's limits."
    },
    {
      question: "What if I exceed my plan's limits?",
      answer: "You'll receive a notification when approaching your limits. You can upgrade your plan at any time to get more assessments, essays, or redlines. We also offer one-time purchases for additional usage."
    },
    {
      question: "How do I get started?",
      answer: "Simply sign up for a free account and start with your first assessment. Upload your resume, tell us about your goals, and we'll provide personalized school recommendations and strategy."
    }
  ];

  return (
    <section className="mx-auto max-w-4xl px-6 py-16">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Frequently Asked Questions</h1>
        <p className="text-lg text-muted-foreground">
          Everything you need to know about PortersPrep
        </p>
      </div>

      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <div key={index} className="border rounded-lg">
            <button
              className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50"
              onClick={() => setOpenItem(openItem === index ? null : index)}
            >
              <span className="font-medium">{faq.question}</span>
              <span className="text-gray-400">
                {openItem === index ? '−' : '+'}
              </span>
            </button>
            {openItem === index && (
              <div className="px-6 pb-4">
                <p className="text-muted-foreground">{faq.answer}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="text-center mt-12">
        <p className="text-muted-foreground mb-4">
          Still have questions? We're here to help.
        </p>
        <a 
          href="/contact" 
          className="inline-block bg-black text-white px-6 py-2 rounded hover:bg-gray-800 transition-colors"
        >
          Contact Us
        </a>
      </div>
    </section>
  );
} 