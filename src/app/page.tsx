import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, Edit3, Users, CheckCircle, Clock, DollarSign, Shield } from "lucide-react";

export const metadata = {
  title: "PortersPrep — Your MBA Admissions Copilot",
  description: "Assess your odds, get coaching-style essay feedback, and book time with an expert coach. We coach; you write."
};

export default function Home() {
  return (
    <main className="mx-auto max-w-6xl px-6">
      {/* Hero Section */}
      <section className="py-20 text-center">
        <div className="mx-auto max-w-4xl">
          <h1 className="text-5xl font-bold leading-tight tracking-tight">
            Your MBA Admissions Copilot
          </h1>
          <p className="mt-6 text-xl text-muted-foreground">
            Assess your odds, get coaching-style essay feedback, and book time with an expert coach.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <a 
              href="/dashboard" 
              className="rounded-lg bg-black px-6 py-3 text-white font-medium hover:bg-gray-800 transition-colors"
            >
              Open the App
            </a>
            <a 
              href="/pricing" 
              className="rounded-lg border border-gray-300 px-6 py-3 font-medium hover:bg-gray-50 transition-colors"
            >
              View Pricing
            </a>
          </div>
          <p className="mt-6 text-sm text-muted-foreground">
            Used by applicants targeting top MBA programs.
          </p>
        </div>
      </section>

      {/* Feature Cards */}
      <section className="py-16">
        <div className="grid gap-6 md:grid-cols-3">
          <Card>
            <CardHeader>
              <BarChart3 className="h-8 w-8 text-blue-600" />
              <CardTitle>Assess</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Get tailored school strategy and likelihood bands based on your profile and goals.
              </CardDescription>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <Edit3 className="h-8 w-8 text-green-600" />
              <CardTitle>Edit</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Live editor with AI redlines and coaching feedback. No ghostwriting—we coach, you write.
              </CardDescription>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <Users className="h-8 w-8 text-purple-600" />
              <CardTitle>Coach</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                DM a coach and book sessions with full context of your application journey.
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold">How it works</h2>
        </div>
        <div className="grid gap-8 md:grid-cols-3">
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
              <span className="text-xl font-bold text-blue-600">1</span>
            </div>
            <h3 className="font-semibold mb-2">Submit your profile</h3>
            <p className="text-sm text-muted-foreground">
              Share your background, target schools, and application timeline.
            </p>
          </div>
          
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
              <span className="text-xl font-bold text-green-600">2</span>
            </div>
            <h3 className="font-semibold mb-2">Get personalized feedback</h3>
            <p className="text-sm text-muted-foreground">
              Receive assessment results and coaching-style essay feedback.
            </p>
          </div>
          
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-purple-100">
              <span className="text-xl font-bold text-purple-600">3</span>
            </div>
            <h3 className="font-semibold mb-2">Connect with coaches</h3>
            <p className="text-sm text-muted-foreground">
              Book sessions with expert coaches who understand your full context.
            </p>
          </div>
        </div>
      </section>

      {/* Comparison Section */}
      <section className="py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold">PortersPrep vs traditional consulting</h2>
        </div>
        <div className="grid gap-8 md:grid-cols-2">
          <div>
            <h3 className="text-xl font-semibold mb-4">PortersPrep</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                <span className="text-sm">Transparent pricing with no hidden fees</span>
              </li>
              <li className="flex items-start gap-3">
                <Clock className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                <span className="text-sm">Instant feedback and 24/7 availability</span>
              </li>
              <li className="flex items-start gap-3">
                <Shield className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                <span className="text-sm">Ethical approach: we coach, you write</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                <span className="text-sm">Consistent feedback across all materials</span>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-xl font-semibold mb-4">Traditional Consulting</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <DollarSign className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
                <span className="text-sm">High upfront costs and variable pricing</span>
              </li>
              <li className="flex items-start gap-3">
                <Clock className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
                <span className="text-sm">Limited availability and longer response times</span>
              </li>
              <li className="flex items-start gap-3">
                <Shield className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
                <span className="text-sm">Varying approaches to essay assistance</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
                <span className="text-sm">Dependent on individual consultant quality</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16">
        <div className="rounded-2xl bg-gray-50 p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Ready to start your MBA journey?</h2>
          <p className="text-muted-foreground mb-6">
            Join applicants who are taking control of their admissions process.
          </p>
          <a 
            href="/dashboard" 
            className="inline-block rounded-lg bg-black px-8 py-3 text-white font-medium hover:bg-gray-800 transition-colors"
          >
            Get Started Today
          </a>
          <p className="mt-4 text-xs text-muted-foreground">
            We coach; you write. No ghostwriting.
          </p>
        </div>
      </section>
    </main>
  );
} 