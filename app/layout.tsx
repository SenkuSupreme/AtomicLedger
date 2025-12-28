
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import AuthProvider from "@/components/AuthProvider";
import ClientLayout from "@/components/ClientLayout";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ApexLedger",
  description: "AI-Powered Trade Journal & Backtester",
};

import { PortfolioProvider } from "@/context/PortfolioContext";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-black text-white`}
      >

        <AuthProvider>
          <PortfolioProvider>
            <ClientLayout>
              {children}
            </ClientLayout>
          </PortfolioProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
