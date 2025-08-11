import { Poppins } from "next/font/google";
import "./globals.css";

const poppins = Poppins({ 
  subsets: ["latin"], 
  weight: ["300", "400", "500", "600", "700"], 
  variable: "--font-poppins", 
  display: "swap" 
});

export const metadata = {
  title: "PortersPrep — MBA Admissions Copilot",
  description: "Assess • Edit • Coach",
  icons: { icon: "/favicon.png" }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={poppins.variable}>
      <body className="min-h-screen font-sans">{children}</body>
    </html>
  );
} 