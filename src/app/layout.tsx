import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { FinancialProfileProvider } from "@/hooks/useFinancialProfile";
import { Header } from "@/components/layout/Header";
import { FeedbackButton } from "@/components/shared/FeedbackButton";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "FIRE — Financial Independence Tracker",
  description: "Know where you stand. Know when you're free.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <FinancialProfileProvider>
          <Header />
          <main className="mx-auto max-w-6xl px-4 py-6 pb-20 sm:px-6 sm:pb-6 lg:px-8">
            {children}
          </main>
          <FeedbackButton />
        </FinancialProfileProvider>
      </body>
    </html>
  );
}
