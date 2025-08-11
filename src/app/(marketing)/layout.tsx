import { jsonLdOrganization } from "@/lib/seo";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLdOrganization()),
        }}
      />
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </div>
    </>
  );
}

function Navbar() {
  return (
    <header className="border-b">
      <div className="container mx-auto px-6 py-4">
        <nav className="flex items-center justify-between">
          <div className="text-xl font-semibold">PortersPrep</div>
          <div className="hidden md:flex items-center space-x-8">
            <a href="/" className="text-sm hover:text-gray-600">Home</a>
            <a href="/how-it-works" className="text-sm hover:text-gray-600">How it works</a>
            <a href="/features" className="text-sm hover:text-gray-600">Features</a>
            <a href="/pricing" className="text-sm hover:text-gray-600">Pricing</a>
            <a href="/faq" className="text-sm hover:text-gray-600">FAQ</a>
            <a href="/dashboard" className="text-sm bg-black text-white px-4 py-2 rounded hover:bg-gray-800">Open App</a>
          </div>
          <div className="md:hidden">
            <a href="/dashboard" className="text-sm bg-black text-white px-3 py-1 rounded">App</a>
          </div>
        </nav>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="border-t bg-gray-50">
      <div className="container mx-auto px-6 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="text-sm text-gray-600 mb-4 md:mb-0">
            © 2024 PortersPrep. We coach; you write.
          </div>
          <div className="flex space-x-6 text-sm">
            <a href="/about" className="text-gray-600 hover:text-gray-900">About</a>
            <a href="/privacy" className="text-gray-600 hover:text-gray-900">Privacy</a>
            <a href="/terms" className="text-gray-600 hover:text-gray-900">Terms</a>
            <a href="/contact" className="text-gray-600 hover:text-gray-900">Contact</a>
          </div>
        </div>
      </div>
    </footer>
  );
} 