'use client';

import { useState } from 'react';
import { Mail, MessageSquare, Phone } from 'lucide-react';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Placeholder for form submission
    setSubmitted(true);
    // In a real implementation, you would send this to your API
    console.log('Form submitted:', formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <main className="mx-auto max-w-4xl px-6 py-16">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Contact Us</h1>
        <p className="text-lg text-muted-foreground">
          Have questions? We'd love to hear from you.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-12">
        {/* Contact Info */}
        <div>
          <h2 className="text-2xl font-semibold mb-6">Get in Touch</h2>
          <p className="text-muted-foreground mb-8">
            Whether you have questions about our services, need technical support, 
            or want to provide feedback, we're here to help.
          </p>
          
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Mail className="h-5 w-5 text-blue-600" />
                </div>
              </div>
              <div>
                <h3 className="font-semibold mb-1">Email Support</h3>
                <p className="text-muted-foreground text-sm mb-2">
                  For general questions and support
                </p>
                <a 
                  href="mailto:support@portersprep.com" 
                  className="text-blue-600 hover:underline text-sm"
                >
                  support@portersprep.com
                </a>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <MessageSquare className="h-5 w-5 text-green-600" />
                </div>
              </div>
              <div>
                <h3 className="font-semibold mb-1">In-App Chat</h3>
                <p className="text-muted-foreground text-sm mb-2">
                  Chat with coaches and get quick answers
                </p>
                <a 
                  href="/dashboard" 
                  className="text-green-600 hover:underline text-sm"
                >
                  Open the app
                </a>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Phone className="h-5 w-5 text-purple-600" />
                </div>
              </div>
              <div>
                <h3 className="font-semibold mb-1">Response Time</h3>
                <p className="text-muted-foreground text-sm">
                  We typically respond within 24 hours during business days
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div>
          {!submitted ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-2">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                  placeholder="Your name"
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                  placeholder="your.email@example.com"
                />
              </div>
              
              <div>
                <label htmlFor="message" className="block text-sm font-medium mb-2">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                  placeholder="How can we help you?"
                />
              </div>
              
              <button
                type="submit"
                className="w-full bg-black text-white py-3 px-4 rounded-md hover:bg-gray-800 transition-colors"
              >
                Send Message
              </button>
            </form>
          ) : (
            <div className="text-center py-8">
              <div className="text-green-600 text-4xl mb-4">✓</div>
              <h3 className="text-xl font-semibold mb-2">Message Sent!</h3>
              <p className="text-muted-foreground mb-4">
                Thank you for reaching out. We'll get back to you within 24 hours.
              </p>
              <button
                onClick={() => {
                  setSubmitted(false);
                  setFormData({ name: '', email: '', message: '' });
                }}
                className="text-blue-600 hover:underline"
              >
                Send another message
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Direct Email CTA */}
      <div className="mt-16 text-center">
        <p className="text-muted-foreground mb-4">
          Prefer to email us directly?
        </p>
        <a 
          href="mailto:support@portersprep.com?subject=Contact from PortersPrep Website" 
          className="inline-flex items-center gap-2 bg-gray-100 text-gray-800 px-6 py-3 rounded-md hover:bg-gray-200 transition-colors"
        >
          <Mail className="h-4 w-4" />
          Send us an email
        </a>
      </div>
    </main>
  );
} 