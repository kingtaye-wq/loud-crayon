import type { Metadata } from 'next';
import './globals.css';
import Link from 'next/link';
import { Sparkles, Terminal, UserCheck, ShieldCheck } from 'lucide-react';
import FeedbackWidget from '@/components/feedback/FeedbackWidget';

export const metadata: Metadata = {
  title: 'Loud Crayon — AI Agency System for Local Businesses',
  description: 'AI Websites, Google Rankings & AI Visibility for Local Businesses. $997 turnkey + $297/mo.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <meta name="robots" content="noindex, nofollow" />
      </head>
      <body className="bg-[#0B0F19] text-slate-100 min-h-screen flex flex-col antialiased selection:bg-orange-500 selection:text-white">
        {/* Staging Top Banner */}
        <div className="bg-gradient-to-r from-orange-600 to-amber-600 text-white text-xs font-semibold px-4 py-1.5 text-center flex items-center justify-center gap-2 shadow-sm">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>STAGING ENVIRONMENT — NOINDEX ACTIVE — DNS UNTOUCHED — USERNAME-ONLY AUTH ACTIVE</span>
          <span className="bg-black/25 px-2 py-0.5 rounded text-[10px] tracking-wide uppercase">Loud Crayon Staging</span>
        </div>

        {/* Global Navigation Header */}
        <header className="sticky top-0 z-40 backdrop-blur-md bg-[#0B0F19]/80 border-b border-slate-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-orange-600 to-amber-500 flex items-center justify-center shadow-lg shadow-orange-500/20 group-hover:scale-105 transition-transform">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-bold tracking-tight text-white flex items-center gap-1.5">
                  LOUD CRAYON <span className="text-[10px] uppercase font-bold px-1.5 py-0.2 bg-orange-500/20 text-orange-400 rounded border border-orange-500/30">AI Agency</span>
                </span>
                <span className="text-[11px] text-slate-400 tracking-wider">@loudcrayon · loudcrayon.co</span>
              </div>
            </Link>

            <nav className="flex items-center gap-2 sm:gap-4">
              <Link
                href="/"
                className="text-xs sm:text-sm font-medium text-slate-300 hover:text-white px-3 py-1.5 rounded-lg hover:bg-slate-800/60 transition-colors"
              >
                Website
              </Link>
              <Link
                href="/os"
                className="flex items-center gap-1.5 text-xs sm:text-sm font-medium text-orange-400 hover:text-orange-300 px-3 py-1.5 rounded-lg bg-orange-500/10 hover:bg-orange-500/20 border border-orange-500/20 transition-all"
              >
                <Terminal className="w-3.5 h-3.5" />
                <span>Loud Crayon OS</span>
              </Link>
              <Link
                href="/app"
                className="flex items-center gap-1.5 text-xs sm:text-sm font-medium text-slate-300 hover:text-white px-3 py-1.5 rounded-lg hover:bg-slate-800/60 transition-colors"
              >
                <UserCheck className="w-3.5 h-3.5" />
                <span>Client App</span>
              </Link>
              <Link
                href="/login"
                className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-slate-800 text-slate-200 hover:bg-slate-700 transition-colors border border-slate-700"
              >
                Username Login
              </Link>
            </nav>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1">{children}</main>

        {/* Global Footer */}
        <footer className="border-t border-slate-800/80 bg-[#080B12] py-8 text-xs text-slate-500">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-400">Loud Crayon AI Agency System</span>
              <span>·</span>
              <span>Username Auth</span>
              <span>·</span>
              <span>Staging Preview Mode</span>
            </div>
            <div className="flex items-center gap-4 text-slate-400">
              <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
              <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
              <span>Handle: @loudcrayon</span>
            </div>
          </div>
        </footer>

        {/* Embeddable Screenshot Feedback Widget */}
        <FeedbackWidget />
      </body>
    </html>
  );
}
