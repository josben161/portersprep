"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, FileText, MessageSquare, CreditCard, Plus, ArrowRight, BookOpen } from "lucide-react";
import { toast } from "react-hot-toast";

export default function DashboardPage() {
  const [isLoadingBilling, setIsLoadingBilling] = useState(false);

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

  const cards = [
    {
      title: "Applications",
      description: "Manage your MBA applications",
      icon: FileText,
      href: "/dashboard/applications",
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      borderColor: "border-orange-200"
    },
    {
      title: "Assessments",
      description: "Get your MBA admission chances",
      icon: BarChart3,
      href: "/dashboard/assessments",
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200"
    },
    {
      title: "Essays",
      description: "Write and edit your application essays",
      icon: FileText,
      href: "/dashboard/essays",
      color: "text-green-600",
      bgColor: "bg-green-50",
      borderColor: "border-green-200"
    },
    {
      title: "Story Bank",
      description: "Manage your anchor stories",
      icon: BookOpen,
      href: "/dashboard/stories",
      color: "text-indigo-600",
      bgColor: "bg-indigo-50",
      borderColor: "border-indigo-200"
    },
    {
      title: "Coach",
      description: "Message your personal MBA coach",
      icon: MessageSquare,
      href: "/dashboard/coach",
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200"
    }
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Welcome back</h1>
          <p className="text-muted-foreground">
            Ready to work on your MBA application? Here's what you can do next.
          </p>
        </div>
        <button
          onClick={handleManageBilling}
          disabled={isLoadingBilling}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm border rounded-md hover:bg-muted transition-colors disabled:opacity-50"
        >
          <CreditCard className="h-4 w-4" />
          {isLoadingBilling ? 'Loading...' : 'Manage billing'}
        </button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-5 mb-8">
        {cards.map((card) => {
          const IconComponent = card.icon;
          return (
            <a
              key={card.title}
              href={card.href}
              className="group block"
            >
              <Card className="h-full hover:shadow-md transition-shadow border-2 hover:border-primary/20">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className={`p-2 rounded-lg ${card.bgColor}`}>
                      <IconComponent className={`h-6 w-6 ${card.color}`} />
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                  <CardTitle className="text-lg">{card.title}</CardTitle>
                  <CardDescription>{card.description}</CardDescription>
                </CardHeader>
              </Card>
            </a>
          );
        })}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <a
              href="/dashboard/applications/new"
              className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted transition-colors"
            >
              <div>
                <div className="font-medium">New Application</div>
                <div className="text-sm text-muted-foreground">Start a school application</div>
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground" />
            </a>
            <a
              href="/dashboard/assessments/new"
              className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted transition-colors"
            >
              <div>
                <div className="font-medium">New Assessment</div>
                <div className="text-sm text-muted-foreground">Get your admission chances</div>
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground" />
            </a>
            <a
              href="/dashboard/essays/new"
              className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted transition-colors"
            >
              <div>
                <div className="font-medium">New Essay</div>
                <div className="text-sm text-muted-foreground">Start writing your application</div>
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground" />
            </a>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Your Plan</CardTitle>
            <CardDescription>Current subscription details</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Current Plan</span>
                <span className="font-medium">Free</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Assessments Used</span>
                <span className="font-medium">0 / 1</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Essays Used</span>
                <span className="font-medium">0 / 1</span>
              </div>
              <div className="pt-2">
                <a
                  href="/pricing"
                  className="text-sm text-primary hover:underline"
                >
                  Upgrade for more capacity →
                </a>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <h3 className="font-medium text-blue-900 mb-2">💡 Pro Tip</h3>
        <p className="text-sm text-blue-800">
          Start with a free assessment to see your admission chances, then upgrade to Plus or Pro for unlimited access and AI-powered essay feedback.
        </p>
      </div>
    </div>
  );
} 