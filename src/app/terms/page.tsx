import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Scale } from 'lucide-react';
import { AGENCY_CONFIG } from '@/config/agency';

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16 text-slate-200">
      <Link href="/" className="inline-flex items-center gap-1.5 text-xs text-orange-400 hover:text-orange-300 mb-8 font-semibold">
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Home</span>
      </Link>

      <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-6">
        <div className="flex items-center gap-3">
          <Scale className="w-8 h-8 text-orange-400" />
          <div>
            <h1 className="text-2xl font-bold text-white">Terms of Service</h1>
            <p className="text-xs text-slate-400">Loud Crayon AI Agency System · Pricing & Engagement Terms</p>
          </div>
        </div>

        <section className="space-y-3 text-sm text-slate-300">
          <h2 className="text-base font-bold text-white">1. Service Architecture & Pricing Model</h2>
          <p>
            Loud Crayon delivers turnkey AI website builds and ongoing AI visibility for local businesses. Our standard model consists of a <strong>${AGENCY_CONFIG.pricing.upfront}</strong> one-time turnkey build fee covering initial development, Google reviews integration, photos, and 24/7 AI chat agent configuration.
          </p>
          <p>
            Post-launch, clients may subscribe to the <strong>${AGENCY_CONFIG.pricing.recurring}/month</strong> AI Visibility & Ranking Optimization package for continuous Google local search tracking, AI engine citations, and ongoing concierge updates.
          </p>
        </section>

        <section className="space-y-3 text-sm text-slate-300">
          <h2 className="text-base font-bold text-white">2. Launch Approval & Domain Handover</h2>
          <p>
            No website is transitioned from preview staging to live production DNS until the client provides explicit sign-off inside the Client App. Clients maintain full ownership of their domains, brand assets, and customer databases.
          </p>
        </section>

        <section className="space-y-3 text-sm text-slate-300">
          <h2 className="text-base font-bold text-white">3. Pilot Geography & Service Scope</h2>
          <p>
            Our core pilot operates within a 40-minute driving radius across Northeast Ohio (Cuyahoga, Lorain, Medina, Summit, Lake, Geauga counties).
          </p>
        </section>

        <div className="pt-6 border-t border-slate-800 text-xs text-slate-500">
          Last updated: November 2026 · Loud Crayon (@loudcrayon)
        </div>
      </div>
    </div>
  );
}
