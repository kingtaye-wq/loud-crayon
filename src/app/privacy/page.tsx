import React from 'react';
import Link from 'next/link';
import { ArrowLeft, ShieldCheck } from 'lucide-react';

export default function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16 text-slate-200">
      <Link href="/" className="inline-flex items-center gap-1.5 text-xs text-orange-400 hover:text-orange-300 mb-8 font-semibold">
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Home</span>
      </Link>

      <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-6">
        <div className="flex items-center gap-3">
          <ShieldCheck className="w-8 h-8 text-orange-400" />
          <div>
            <h1 className="text-2xl font-bold text-white">Privacy Policy</h1>
            <p className="text-xs text-slate-400">Loud Crayon AI Agency System · Staging Environment</p>
          </div>
        </div>

        <section className="space-y-3 text-sm text-slate-300">
          <h2 className="text-base font-bold text-white">1. Core Compliance Principles</h2>
          <p>
            Loud Crayon operates with strict compliance standards. We strictly prohibit unsolicited outbound SMS messages (&ldquo;cold SMS&rdquo;). All messaging interactions require direct on-page consent through web chat, contact forms, or authorized client communication channels.
          </p>
        </section>

        <section className="space-y-3 text-sm text-slate-300">
          <h2 className="text-base font-bold text-white">2. Business Data & Public Information</h2>
          <p>
            Prospect data evaluated by our scouting pipeline is derived exclusively from sanctioned public APIs (e.g. Google Places API) and public directory records. We do not engage in unauthorized scraping or unverified data harvesting.
          </p>
        </section>

        <section className="space-y-3 text-sm text-slate-300">
          <h2 className="text-base font-bold text-white">3. Staging & Search Engine Indexing</h2>
          <p>
            All generated prospect previews and staging builds are published with strict <code>noindex, nofollow</code> headers and robots directives. Staging preview sites remain unlisted and do not interfere with live client production domains.
          </p>
        </section>

        <section className="space-y-3 text-sm text-slate-300">
          <h2 className="text-base font-bold text-white">4. Screenshot Feedback & Telemetry</h2>
          <p>
            Bug reports and feedback collected via our embeddable widget or Chrome extension include viewport dimensions, targeted DOM elements, and console errors strictly for troubleshooting and debugging purposes within the Loud Crayon OS.
          </p>
        </section>

        <div className="pt-6 border-t border-slate-800 text-xs text-slate-500">
          Last updated: November 2026 · Loud Crayon (@loudcrayon)
        </div>
      </div>
    </div>
  );
}
