import { CheckCircle, FileText, MessageSquare, BarChart3, Users, Calendar } from "lucide-react";

export const metadata = { 
  title: "How it works — PortersPrep", 
  description: "Your complete MBA admissions journey: Assess your odds, edit with AI guidance, and get expert coaching." 
};

export default function HowItWorks() {
  const steps = [
    {
      title: "Assess",
      icon: BarChart3,
      desc: "Get data-driven insights into your MBA admission chances",
      details: [
        "Complete our comprehensive intake form with your background",
        "Receive admit likelihood bands for your target schools",
        "Identify your strongest profile angles to emphasize",
        "Get a personalized timeline and action plan",
        "Understand gaps and next steps to improve your odds"
      ],
      cta: "Start Assessment",
      href: "/dashboard/assessments"
    },
    {
      title: "Edit",
      icon: FileText,
      desc: "Write with AI guidance that preserves your authentic voice",
      details: [
        "Draft essays in our collaborative editor with real-time feedback",
        "Receive AI redlines that trim filler and improve clarity",
        "Get suggestions for stronger opening hooks and conclusions",
        "Maintain your unique voice — no ghostwriting",
        "Track word counts and ensure you meet requirements"
      ],
      cta: "Start Writing",
      href: "/dashboard/essays"
    },
    {
      title: "Coach",
      icon: MessageSquare,
      desc: "Work with experts who see your full context and drafts",
      details: [
        "Message coaches directly with your specific questions",
        "Book 1-on-1 sessions with MBA admissions experts",
        "Coaches see your assessments, essays, and background",
        "Get personalized feedback on your application strategy",
        "Receive guidance on school selection and timeline"
      ],
      cta: "Connect with Coach",
      href: "/dashboard/coach"
    }
  ];

  const benefits = [
    {
      icon: Users,
      title: "Expert Guidance",
      desc: "Work with coaches who've helped hundreds of successful applicants"
    },
    {
      icon: Calendar,
      title: "Structured Timeline",
      desc: "Clear milestones and deadlines to keep you on track"
    },
    {
      icon: CheckCircle,
      title: "Ethics First",
      desc: "We coach - You share your voice - We maximise you chances.. No ghostwriting, just authentic guidance"
    }
  ];

  return (
    <>
      {/* Hero Section */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">How PortersPrep Works</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Your complete MBA admissions journey in three simple steps. From assessment to acceptance, 
            we provide the tools, guidance, and expertise you need to succeed.
          </p>
        </div>

        {/* Main Steps */}
        <div className="space-y-12">
          {steps.map((step, index) => {
            const IconComponent = step.icon;
            return (
              <div key={step.title} className="grid gap-8 lg:grid-cols-2 items-center">
                <div className={`space-y-6 ${index % 2 === 1 ? 'lg:order-2' : ''}`}>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary">
                      <IconComponent className="w-6 h-6" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-semibold">{step.title}</h2>
                      <p className="text-muted-foreground">{step.desc}</p>
                    </div>
                  </div>
                  
                  <ul className="space-y-3">
                    {step.details.map((detail, detailIndex) => (
                      <li key={detailIndex} className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{detail}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <a 
                    href={step.href}
                    className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-primary-foreground shadow-sm hover:opacity-95 transition-opacity"
                  >
                    {step.cta}
                  </a>
                </div>
                
                <div className={`rounded-lg border bg-card p-6 ${index % 2 === 1 ? 'lg:order-1' : ''}`}>
                  <div className="aspect-video bg-gradient-to-br from-primary/5 to-primary/10 rounded-md flex items-center justify-center">
                    <IconComponent className="w-16 h-16 text-primary/40" />
                  </div>
                  <div className="mt-4 text-center">
                    <p className="text-sm text-muted-foreground">
                      {step.title} preview coming soon
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Benefits Section */}
      <section className="border-t bg-muted/30">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-semibold mb-4">Why Choose PortersPrep?</h2>
            <p className="text-muted-foreground">
              We combine technology and human expertise to give you the best of both worlds.
            </p>
          </div>
          
          <div className="grid gap-6 md:grid-cols-3">
            {benefits.map(benefit => {
              const IconComponent = benefit.icon;
              return (
                <div key={benefit.title} className="text-center space-y-4">
                  <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <IconComponent className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-semibold">{benefit.title}</h3>
                  <p className="text-sm text-muted-foreground">{benefit.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="rounded-lg border bg-card p-8 text-center">
          <h2 className="text-2xl font-semibold mb-4">Ready to Start Your MBA Journey?</h2>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            Join hundreds of applicants who've used PortersPrep to navigate their MBA admissions successfully.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <a 
              href="/dashboard" 
              className="rounded-md bg-primary px-6 py-3 text-primary-foreground shadow-sm hover:opacity-95 transition-opacity"
            >
              Start Your Assessment
            </a>
            <a 
              href="/pricing" 
              className="rounded-md border px-6 py-3 hover:bg-muted transition-colors"
            >
              View Pricing
            </a>
          </div>
        </div>
      </section>
    </>
  );
} 