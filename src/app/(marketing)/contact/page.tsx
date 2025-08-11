'use client';

import { useState } from 'react';

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
    <section className="mx-auto max-w-4xl px-6 py-16">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Contact Us</h1>
        <p className="text-lg text-muted-foreground">
          Have questions? We'd love to hear from you.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-12">
        <div>
          <h2 className="text-2xl font-semibold mb-6">Get in Touch</h2>
          <p className="text-muted-foreground mb-6">
            Whether you have questions about our services, need technical support, 
            or want to provide feedback, we're here to help.
          </p>
          
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">General Inquiries</h3>
              <p className="text-muted-foreground text-sm">
                For general questions about our services and pricing
              </p>
              <a 
                href="mailto:hello@portersprep.com" 
                className="text-blue-600 hover:underline text-sm"
              >
                hello@portersprep.com
              </a>
            </div>
            
            <div>
              <h3 className="font-semibold mb-2">Technical Support</h3>
              <p className="text-muted-foreground text-sm">
                For help with the platform or technical issues
              </p>
              <a 
                href="mailto:support@portersprep.com" 
                className="text-blue-600 hover:underline text-sm"
              >
                support@portersprep.com
              </a>
            </div>
            
            <div>
              <h3 className="font-semibold mb-2">Privacy & Legal</h3>
              <p className="text-muted-foreground text-sm">
                For privacy policy or terms of service questions
              </p>
              <a 
                href="mailto:legal@portersprep.com" 
                className="text-blue-600 hover:underline text-sm"
              >
                legal@portersprep.com
              </a>
            </div>
          </div>
        </div>

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
                />
              </div>
              
              <button
                type="submit"
                className="w-full bg-black text-white py-2 px-4 rounded-md hover:bg-gray-800 transition-colors"
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

      <div className="mt-16 text-center">
        <p className="text-muted-foreground mb-4">
          Prefer to email us directly?
        </p>
        <a 
          href="mailto:hello@portersprep.com?subject=Contact from PortersPrep Website" 
          className="inline-block bg-gray-100 text-gray-800 px-6 py-3 rounded-md hover:bg-gray-200 transition-colors"
        >
          Send us an email
        </a>
      </div>
    </section>
  );
} 