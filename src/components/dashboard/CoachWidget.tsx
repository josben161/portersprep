'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Bot, Send, MessageSquare, Target, Lightbulb } from 'lucide-react';
import Link from 'next/link';

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
      setLastResponse('Sorry, I encountered an error. Please try the full coach interface.');
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

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2 text-lg">
            <Bot className="h-5 w-5 text-primary" />
            <span>The Admit Coach</span>
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