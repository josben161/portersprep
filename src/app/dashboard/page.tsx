"use client";
import { useEffect, useState } from "react";
import Skeleton from "@/components/ui/Skeleton";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, FileText, MessageSquare, CreditCard, Plus, ArrowRight, BookOpen, Target, Sparkles, CheckCircle, Play } from "lucide-react";
import { toast } from "react-hot-toast";
import Link from "next/link";

export default function DashboardPage() {
  const [isLoadingBilling, setIsLoadingBilling] = useState(false);
  const [usage, setUsage] = useState<any|null>(null);

  // Fetch real usage data
  useEffect(() => {
    fetch("/api/me/usage").then(r=>r.json()).then(setUsage).catch(()=>{});
  }, []);

  const handleManageBilling = async () => {
    setIsLoadingBilling(true);
    try {
      const response = await fetch('/api/billing/portal', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        window.location.href = data.url;
      } else {
        console.error('Failed to access billing portal');
        toast.error('Failed to access billing portal. Please try again.');
      }
    } catch (error) {
      console.error('Error accessing billing portal:', error);
      toast.error('An error occurred. Please try again.');
    } finally {
      setIsLoadingBilling(false);
    }
  };

  const isNewUser = !usage || (usage.schools_count === 0 && usage.assessments_count === 0);

  const onboardingSteps = [
    {
      title: "Get Your Admission Chances",
      description: "See where you stand with top MBA programs",
      icon: Target,
      href: "/dashboard/assessments/new",
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      completed: usage ? usage.assessments_count > 0 : false
    },
    {
      title: "Create Your First Application",
      description: "Set up your target school and requirements",
      icon: FileText,
      href: "/dashboard/applications/new",
      color: "text-green-600",
      bgColor: "bg-green-50",
      completed: usage ? usage.schools_count > 0 : false
    },
    {
      title: "Build Your Story Bank",
      description: "Organize your key experiences and achievements",
      icon: BookOpen,
      href: "/dashboard/stories",
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      completed: usage ? usage.stories_count > 0 : false
    },
    {
      title: "Start Your First Essay",
      description: "Begin drafting with AI-powered guidance",
      icon: Sparkles,
      href: "/dashboard/essays/new",
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      completed: usage ? usage.essays_count > 0 : false
    }
  ];

  const quickActions = [
    {
      title: "New Assessment",
      description: "Get your admission chances",
      href: "/dashboard/assessments/new",
      icon: Target
    },
    {
      title: "New Application", 
      description: "Start a school application",
      href: "/dashboard/applications/new",
      icon: FileText
    },
    {
      title: "New Essay",
      description: "Start writing your application",
      href: "/dashboard/essays/new", 
      icon: Sparkles
    }
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Welcome Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Welcome to PortersPrep</h1>
        <p className="text-muted-foreground text-lg">
          {isNewUser 
            ? "Let's get you started on your MBA application journey. Follow these steps to set up your workspace."
            : "Ready to continue your MBA application? Here's what you can work on next."
          }
        </p>
      </div>

      {/* Onboarding Flow for New Users */}
      {isNewUser && (
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Play className="h-5 w-5 text-brand-500" />
            <h2 className="text-xl font-semibold">Getting Started</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {onboardingSteps.map((step, index) => {
              const IconComponent = step.icon;
              return (
                <Link key={step.title} href={step.href}>
                  <Card className={`h-full hover:shadow-md transition-all duration-200 border-2 ${
                    step.completed 
                      ? 'border-green-200 bg-green-50/50' 
                      : 'border-muted hover:border-brand-200'
                  }`}>
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className={`p-3 rounded-lg ${step.bgColor}`}>
                          {step.completed ? (
                            <CheckCircle className="h-6 w-6 text-green-600" />
                          ) : (
                            <IconComponent className={`h-6 w-6 ${step.color}`} />
                          )}
                        </div>
                        <div className="text-sm font-medium text-muted-foreground">
                          Step {index + 1}
                        </div>
                      </div>
                      <CardTitle className="text-lg flex items-center gap-2">
                        {step.title}
                        {step.completed && <CheckCircle className="h-4 w-4 text-green-600" />}
                      </CardTitle>
                      <CardDescription>{step.description}</CardDescription>
                    </CardHeader>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-4 mb-8">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-50">
                <Target className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">
                  {usage ? usage.assessments_count : <Skeleton className="h-6 w-14" />}
                </div>
                <div className="text-sm text-muted-foreground">Assessments</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-50">
                <FileText className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">
                  {usage ? usage.schools_count : <Skeleton className="h-6 w-14" />}
                </div>
                <div className="text-sm text-muted-foreground">Applications</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-purple-50">
                <BookOpen className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">
                  {usage ? usage.stories_count : <Skeleton className="h-6 w-14" />}
                </div>
                <div className="text-sm text-muted-foreground">Stories</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-orange-50">
                <Sparkles className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">
                  {usage ? usage.essays_count : <Skeleton className="h-6 w-14" />}
                </div>
                <div className="text-sm text-muted-foreground">Essays</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Quick Actions */}
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5" />
                Quick Actions
              </CardTitle>
              <CardDescription>Get started with these common tasks</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {quickActions.map((action) => {
                const IconComponent = action.icon;
                return (
                  <Link key={action.title} href={action.href}>
                    <div className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted transition-colors group">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-muted">
                          <IconComponent className="h-4 w-4" />
                        </div>
                        <div>
                          <div className="font-medium">{action.title}</div>
                          <div className="text-sm text-muted-foreground">{action.description}</div>
                        </div>
                      </div>
                      <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                    </div>
                  </Link>
                );
              })}
            </CardContent>
          </Card>
        </div>

        {/* Plan & Billing */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Your Plan</CardTitle>
              <CardDescription>Current subscription details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Current Plan</span>
                  <span className="font-medium">Free</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Schools</span>
                  <span className="font-medium">
                    {usage ? usage.schools_count : <Skeleton className="h-4 w-8" />} / 1
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Essays</span>
                  <span className="font-medium">
                    {usage ? usage.essays_count : <Skeleton className="h-4 w-8" />} / 2
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">AI Actions</span>
                  <span className="font-medium">0 / 5</span>
                </div>
              </div>
              
              <div className="pt-3 border-t">
                <Link
                  href="/pricing"
                  className="block w-full text-center rounded-md bg-brand-500 px-3 py-2 text-sm font-medium text-white hover:bg-brand-600 transition-colors"
                >
                  Upgrade to Plus
                </Link>
                <button
                  onClick={handleManageBilling}
                  disabled={isLoadingBilling}
                  className="w-full mt-2 text-center text-sm text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
                >
                  {isLoadingBilling ? 'Loading...' : 'Manage billing'}
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Pro Tip */}
      <div className="mt-8 p-4 bg-gradient-to-r from-brand-50 to-blue-50 rounded-lg border border-brand-200">
        <div className="flex items-start gap-3">
          <Sparkles className="h-5 w-5 text-brand-600 mt-0.5" />
          <div>
            <h3 className="font-medium text-brand-900 mb-1">💡 Pro Tip</h3>
            <p className="text-sm text-brand-800">
              Start with a free assessment to see your admission chances, then upgrade to Plus for unlimited schools, essays, and AI-powered feedback.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 