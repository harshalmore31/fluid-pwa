import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { PWAManager } from "@/components/PWAManager";
import { ThemeProvider } from "@/components/ThemeProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0a0a0a' }
  ],
}

export const metadata: Metadata = {
  title: {
    default: 'Fluid PWA Framework',
    template: '%s | Fluid PWA'
  },
      description: 'The Ultimate Offline-First Progressive Web App Framework - Rapid PWA development with multiple batteries for seamless offline experiences',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Fluid PWA',
    startupImage: [
      '/icon-192x192.png',
      '/icon-512x512.png',
    ],
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: 'website',
    siteName: 'Fluid PWA Framework',
    title: 'Fluid PWA Framework',
    description: 'The Ultimate Offline-First Framework for Next.js PWAs',
    images: ['/icon-512x512.png'],
  },
  twitter: {
    card: 'summary',
    title: 'Fluid PWA Framework',
    description: 'The Ultimate Offline-First Framework for Next.js PWAs',
    images: ['/icon-512x512.png'],
  },
  icons: {
    shortcut: '/icon-192x192.png',
    apple: [
      { url: '/icon-192x192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icon-512x512.png', sizes: '512x512', type: 'image/png' },
    ],
    other: [
      {
        rel: 'mask-icon',
        url: '/icon-192x192.svg',
        color: '#1e3a8a',
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full" suppressHydrationWarning>
      <head>
        <meta name="application-name" content="Fluid PWA" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Fluid PWA" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
        <meta name="msapplication-TileColor" content="#1e3a8a" />
        <meta name="msapplication-tap-highlight" content="no" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased h-full bg-background text-foreground transition-colors duration-300`}
      >
        <ThemeProvider>
          {children}
          <PWAManager />
        </ThemeProvider>
      </body>
    </html>
  );
}
