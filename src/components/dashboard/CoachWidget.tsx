'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Bot, Send, MessageSquare, Target, Lightbulb, CheckCircle, Clock } from 'lucide-react';
import Link from 'next/link';
import { analyzeOnboardingStatus, OnboardingStep } from '@/lib/onboarding-assistant';

interface QuickMessage {
  text: string;
  icon: React.ReactNode;
  category: string;
}

const quickMessages: QuickMessage[] = [
  {
    text: "How's my progress?",
    icon: <Target className="h-4 w-4" />,
    category: "progress"
  },
  {
    text: "Help with my essay",
    icon: <Lightbulb className="h-4 w-4" />,
    category: "essay"
  },
  {
    text: "Search for college info",
    icon: <MessageSquare className="h-4 w-4" />,
    category: "search"
  }
];

export default function CoachWidget() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [lastResponse, setLastResponse] = useState('');
  const [onboardingProgress, setOnboardingProgress] = useState<any>(null);
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    // Check if user needs onboarding
    const checkOnboarding = async () => {
      try {
        const meRes = await fetch("/api/me");
        if (meRes.ok) {
          const meData = await meRes.json();
          const progress = await analyzeOnboardingStatus(meData.profile.id);
          setOnboardingProgress(progress);
          
          // Show onboarding if user has critical missing items
          if (progress.critical_missing.length > 0) {
            setShowOnboarding(true);
          }
        }
      } catch (error) {
        console.error('Error checking onboarding status:', error);
      }
    };

    checkOnboarding();
  }, []);

  const sendMessage = async (text: string) => {
    setIsLoading(true);
    setMessage(text);

    try {
      const response = await fetch('/api/coach/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: text,
          context: {}
        }),
      });

      const data = await response.json();

      if (data.message) {
        setLastResponse(data.message);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setLastResponse('Sorry, I encountered an error. Please try the full planner interface.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !isLoading) {
      sendMessage(message.trim());
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'text-red-600 dark:text-red-400';
      case 'high': return 'text-orange-600 dark:text-orange-400';
      case 'medium': return 'text-yellow-600 dark:text-yellow-400';
      case 'low': return 'text-green-600 dark:text-green-400';
      default: return 'text-gray-600 dark:text-gray-400';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'critical': return '🔴';
      case 'high': return '🟠';
      case 'medium': return '🟡';
      case 'low': return '🟢';
      default: return '⚪';
    }
  };

  if (showOnboarding && onboardingProgress) {
    return (
      <Card className="w-full h-full">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2 text-lg">
              <Bot className="h-5 w-5 text-primary" />
              <span>Welcome! Let's Get Started</span>
            </CardTitle>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => setShowOnboarding(false)}
            >
              Skip
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Profile Completion</span>
              <span className="text-sm text-muted-foreground">
                {onboardingProgress.completed_steps}/{onboardingProgress.total_steps}
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${onboardingProgress.completion_percentage}%` }}
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="text-sm font-medium mb-2">Next Steps:</div>
            {onboardingProgress.next_steps.map((step: OnboardingStep, index: number) => (
              <div key={step.id} className="flex items-start space-x-2 p-2 rounded-md border hover:bg-gray-50 dark:hover:bg-gray-900/30">
                <span className="text-sm mt-0.5">{getPriorityIcon(step.priority)}</span>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className={`text-sm font-medium ${getPriorityColor(step.priority)}`}>
                      {step.title}
                    </span>
                    <span className="text-xs text-muted-foreground flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      {step.estimated_time} min
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{step.description}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-2 border-t">
            <Button 
              className="w-full" 
              size="sm"
              onClick={() => {
                // Navigate to profile page to complete onboarding
                window.location.href = '/dashboard';
              }}
            >
              Complete Profile →
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full h-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2 text-lg">
            <Bot className="h-5 w-5 text-primary" />
            <span>The Admit Planner</span>
          </CardTitle>
          <Link href="/dashboard/coach">
            <Button variant="outline" size="sm">
              Open Full Chat
            </Button>
          </Link>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {!isExpanded ? (
          <>
            <p className="text-sm text-muted-foreground">
              Your AI assistant for college applications. Get quick help with essays, progress tracking, and more.
            </p>
            
            <div className="grid grid-cols-1 gap-2">
              {quickMessages.map((quickMsg, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  className="justify-start h-auto p-3"
                  onClick={() => sendMessage(quickMsg.text)}
                  disabled={isLoading}
                >
                  <div className="flex items-center space-x-2">
                    {quickMsg.icon}
                    <span className="text-sm">{quickMsg.text}</span>
                  </div>
                </Button>
              ))}
            </div>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(true)}
              className="w-full"
            >
              Ask something else...
            </Button>
          </>
        ) : (
          <div className="space-y-3">
            <form onSubmit={handleSubmit} className="flex space-x-2">
              <Input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Ask me anything..."
                disabled={isLoading}
                className="flex-1"
              />
              <Button type="submit" size="icon" disabled={!message.trim() || isLoading}>
                <Send className="h-4 w-4" />
              </Button>
            </form>
            
            {isLoading && (
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
                <span>Thinking...</span>
              </div>
            )}
            
            {lastResponse && (
              <div className="p-3 bg-muted rounded-lg">
                <p className="text-sm whitespace-pre-wrap">{lastResponse}</p>
              </div>
            )}
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(false)}
              className="w-full"
            >
              Show quick actions
            </Button>
          </div>
        )}
        
        <div className="pt-2 border-t">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Powered by GPT-4</span>
            <Badge variant="secondary" className="text-xs">
              AI Assistant
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 