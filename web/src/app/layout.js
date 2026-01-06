import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ThemeProvider } from "@/components/ThemeProvider";
import RegisterSW from "@/components/RegisterSW";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: {
    template: '%s | The Trend Report',
    default: 'The Trend Report',
  },
  description: "Your source for the latest trends in tech, culture, and more.",
  openGraph: {
    title: 'The Trend Report',
    description: 'Your source for the latest trends in tech, culture, and more.',
    url: 'https://thetrendreport.com',
    siteName: 'The Trend Report',
    locale: 'en_US',
    type: 'website',
  },
};

export const viewport = {
  themeColor: "#ffffff",
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} scroll-smooth`}>
      <body className="antialiased min-h-screen flex flex-col selection:bg-zinc-200 selection:text-zinc-900 dark:selection:bg-zinc-800 dark:selection:text-zinc-100">
        <ThemeProvider>
          <RegisterSW />
          <Header />
          <main className="flex-grow w-full">
            {children}
          </main>
          <Footer />
          <Analytics />
        </ThemeProvider>
      </body>
    </html>
  );
}