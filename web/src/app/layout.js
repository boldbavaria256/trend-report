// web/src/app/layout.js

import { Geist } from "next/font/google";
import { Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "The Trend Report",
  description: "Your source for the latest trends in tech, culture, and more.",
};

export default function RootLayout({ children }) {
  return (
    
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      {/* NO WHITESPACE OR COMMENTS BETWEEN <html> AND <body> THAT COULD BECOME TEXT NODES */}
      <body
        className={`antialiased bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 flex flex-col min-h-screen`}
      >
        <Header />
        <main className="flex-grow container mx-auto px-4 sm:px-6 py-8 w-full">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}