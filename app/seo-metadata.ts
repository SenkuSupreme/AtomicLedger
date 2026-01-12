import type { Metadata } from "next";

export const metadata: Metadata = {
  metadataBase: new URL('https://your-domain.vercel.app'), // Replace with your actual domain
  
  title: {
    default: "AtomicLedger - Professional Forex Trading Journal & Analytics Platform",
    template: "%s | AtomicLedger"
  },
  
  description: "Advanced forex trading journal with AI-powered analytics, backtesting, strategy management, and real-time market insights. Track your trades, analyze performance, and improve your trading edge.",
  
  keywords: [
    "forex trading journal",
    "trading analytics",
    "forex backtesting",
    "trading strategy",
    "forex AI",
    "trade tracker",
    "forex performance",
    "trading psychology",
    "risk management",
    "forex tools",
    "day trading journal",
    "swing trading",
    "forex dashboard",
    "trading metrics",
    "profit tracking",
    "forex education",
    "trading platform",
    "market analysis",
    "technical analysis",
    "forex signals"
  ],
  
  authors: [{ name: "AtomicLedger Team" }],
  creator: "AtomicLedger",
  publisher: "AtomicLedger",
  
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://your-domain.vercel.app',
    siteName: 'AtomicLedger',
    title: 'AtomicLedger - Professional Forex Trading Journal & Analytics',
    description: 'Advanced forex trading journal with AI-powered analytics, backtesting, and real-time market insights. Elevate your trading performance.',
    images: [
      {
        url: '/og-image.png', // You'll need to create this
        width: 1200,
        height: 630,
        alt: 'AtomicLedger - Forex Trading Journal',
      },
    ],
  },
  
  twitter: {
    card: 'summary_large_image',
    title: 'AtomicLedger - Professional Forex Trading Journal',
    description: 'Advanced forex trading journal with AI-powered analytics and backtesting',
    images: ['/og-image.png'], // You'll need to create this
    creator: '@atomicledger', // Replace with your Twitter handle
  },
  
  alternates: {
    canonical: 'https://your-domain.vercel.app',
  },
  
  verification: {
    google: 'your-google-verification-code', // Add after setting up Google Search Console
    // yandex: 'your-yandex-verification-code',
    // bing: 'your-bing-verification-code',
  },
  
  category: 'finance',
  
  other: {
    'application-name': 'AtomicLedger',
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'black-translucent',
    'apple-mobile-web-app-title': 'AtomicLedger',
    'format-detection': 'telephone=no',
    'mobile-web-app-capable': 'yes',
  },
};
