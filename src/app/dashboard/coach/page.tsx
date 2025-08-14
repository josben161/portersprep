"use client";

import { useState, useEffect, useRef } from "react";
import { Send, Bot, User, Search, Lightbulb, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getPersonalizedGreeting } from "@/lib/coach-personalization";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
  functionCall?: any;
}

export default function CoachPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [personalizedGreeting, setPersonalizedGreeting] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Load personalized greeting
    const loadGreeting = async () => {
      try {
        const response = await fetch("/api/me");
        const data = await response.json();
        if (data.profile?.id) {
          const greeting = await getPersonalizedGreeting(data.profile.id);
          setPersonalizedGreeting(greeting);
        }
      } catch (error) {
        console.error("Error loading greeting:", error);
        setPersonalizedGreeting(
          "Hello! I'm The Admit Planner, and I'm here to help you with your college application process.",
        );
      }
    };

    loadGreeting();
  }, []);

  useEffect(() => {
    // Load recent conversations
    fetch("/api/coach/chat")
      .then((res) => res.json())
      .then((data) => {
        if (data.conversations) {
          const formattedMessages = data.conversations
            .flatMap((conv: any) => [
              {
                id: `${conv.id}-user`,
                role: "user" as const,
                content: conv.message,
                timestamp: conv.created_at,
              },
              {
                id: `${conv.id}-assistant`,
                role: "assistant" as const,
                content: conv.response,
                timestamp: conv.created_at,
                functionCall: conv.context?.functionCall,
              },
            ])
            .reverse();
          setMessages(formattedMessages);
        }
      })
      .catch(console.error);
  }, []);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/coach/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: input.trim(),
          context: {},
        }),
      });

      const data = await response.json();

      if (data.message) {
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: data.message,
          timestamp: new Date().toISOString(),
          functionCall: data.functionCall,
        };
        setMessages((prev) => [...prev, assistantMessage]);
      }
    } catch (error) {
      console.error("Error sending message:", error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "Sorry, I encountered an error. Please try again.",
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const renderFunctionCall = (functionCall: any) => {
    if (!functionCall) return null;

    const getFunctionIcon = (functionName: string) => {
      switch (functionName) {
        case "analyze_user_progress":
          return <Target className="h-4 w-4" />;
        case "generate_essay_guidance":
          return <Lightbulb className="h-4 w-4" />;
        case "search_web":
          return <Search className="h-4 w-4" />;
        default:
          return <Bot className="h-4 w-4" />;
      }
    };

    const getFunctionTitle = (functionName: string) => {
      switch (functionName) {
        case "analyze_user_progress":
          return "Progress Analysis";
        case "generate_essay_guidance":
          return "Essay Guidance";
        case "search_web":
          return "Web Search";
        default:
          return "AI Insight";
      }
    };

    return (
      <div className="mt-2 p-3 bg-muted/50 rounded-lg border">
        <div className="flex items-center space-x-2 mb-2">
          {getFunctionIcon(functionCall.name)}
          <Badge variant="secondary">
            {getFunctionTitle(functionCall.name)}
          </Badge>
        </div>
        {functionCall.arguments && (
          <div className="text-sm text-muted-foreground">
            <pre className="whitespace-pre-wrap">
              {JSON.stringify(JSON.parse(functionCall.arguments), null, 2)}
            </pre>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center">
          <div className="flex items-center space-x-2">
            <Bot className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-semibold">The Admit Planner</h1>
          </div>
          <div className="ml-4 text-sm text-muted-foreground">
            Your AI assistant for college applications
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-hidden">
        <div className="h-full flex flex-col">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 ? (
              <div className="flex items-center justify-center h-full">
                <Card className="w-full max-w-2xl">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Bot className="h-5 w-5" />
                      <span>Welcome to The Admit Planner!</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-muted-foreground">
                      {personalizedGreeting ||
                        "I'm here to help you with your college application process. I can assist with:"}
                    </p>
                    <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
                      <li>Essay writing and brainstorming</li>
                      <li>Application strategy and timeline</li>
                      <li>School selection guidance</li>
                      <li>Profile completion</li>
                      <li>Recommendation management</li>
                      <li>Interview preparation</li>
                      <li>Web search for current information</li>
                    </ul>
                    <p className="text-muted-foreground">
                      What would you like to work on today?
                    </p>
                  </CardContent>
                </Card>
              </div>
            ) : (
              messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`flex items-start space-x-2 max-w-[80%] ${
                      message.role === "user"
                        ? "flex-row-reverse space-x-reverse"
                        : ""
                    }`}
                  >
                    <div
                      className={`flex h-8 w-8 items-center justify-center rounded-full ${
                        message.role === "user"
                          ? "bg-primary text-primary-foreground"
                          : "bg-[#592d20]/10 text-[#592d20]"
                      }`}
                    >
                      {message.role === "user" ? (
                        <User className="h-4 w-4" />
                      ) : (
                        <Bot className="h-4 w-4" />
                      )}
                    </div>
                    <div
                      className={`rounded-lg px-4 py-2 ${
                        message.role === "user"
                          ? "bg-primary text-primary-foreground"
                          : "bg-[#592d20]/10 text-[#592d20] border border-[#592d20]/20"
                      }`}
                    >
                      <p className="text-sm whitespace-pre-wrap">
                        {message.content}
                      </p>
                      {message.functionCall &&
                        renderFunctionCall(message.functionCall)}
                    </div>
                  </div>
                </div>
              ))
            )}
            {isLoading && (
              <div className="flex justify-start">
                <div className="flex items-start space-x-2 max-w-[80%]">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#592d20]/10 text-[#592d20]">
                    <Bot className="h-4 w-4" />
                  </div>
                  <div className="rounded-lg px-4 py-2 bg-[#592d20]/10 text-[#592d20] border border-[#592d20]/20">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-[#592d20] rounded-full animate-bounce"></div>
                      <div
                        className="w-2 h-2 bg-[#592d20] rounded-full animate-bounce"
                        style={{ animationDelay: "0.1s" }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-[#592d20] rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="border-t bg-background p-4">
            <div className="flex space-x-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me anything about your college applications..."
                disabled={isLoading}
                className="flex-1"
              />
              <Button
                onClick={sendMessage}
                disabled={!input.trim() || isLoading}
                size="icon"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
