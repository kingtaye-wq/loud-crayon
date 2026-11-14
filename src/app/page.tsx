'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  ArrowRight,
  Search,
  CheckCircle2,
  Calendar,
  MessageSquare,
  TrendingUp,
  ShieldAlert,
  Zap,
  Globe,
  Star,
  ExternalLink,
} from 'lucide-react';
import { AGENCY_CONFIG } from '@/config/agency';

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState(AGENCY_CONFIG.pilot.defaultGeography);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [bookedStatus, setBookedStatus] = useState(false);

  return (
    <div className="relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-gradient-to-b from-orange-500/15 via-amber-500/5 to-transparent blur-3xl pointer-events-none -z-10" />

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-20 text-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs font-semibold mb-6">
          <Zap className="w-3.5 h-3.5" />
          <span>Loud Crayon AI Agency Engine · Staging Preview v1.0</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-tight sm:leading-none">
          We Auto-Build Your Website <br className="hidden sm:inline" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-amber-300 to-orange-500">
            Before You Spend a Single Dollar.
          </span>
        </h1>

        <p className="mt-6 text-base sm:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
          Our AI scans Google for top-rated local businesses without modern websites, automatically crafts a custom, high-converting digital storefront from your real reviews and photos, and delivers your unlisted preview in minutes.
        </p>

        {/* Live Interactive Search / Preview Generator */}
        <div className="mt-10 max-w-2xl mx-auto p-2 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-2xl backdrop-blur-xl">
          <div className="flex flex-col sm:flex-row items-center gap-2">
            <div className="flex items-center gap-2 flex-1 px-3 py-2 w-full">
              <Search className="w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Business Name (e.g. Cleveland Pizza Co.)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent border-0 text-white placeholder-slate-500 text-sm focus:outline-none w-full"
              />
            </div>
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="bg-slate-800 text-slate-300 text-xs px-3 py-2.5 rounded-xl border border-slate-700 focus:outline-none w-full sm:w-auto"
            >
              {AGENCY_CONFIG.pilot.geographies.map((geo) => (
                <option key={geo} value={geo}>
                  {geo}
                </option>
              ))}
            </select>
            <Link
              href={`/preview/${searchQuery ? searchQuery.toLowerCase().replace(/[^a-z0-9]+/g, '-') : 'cleveland-pizza-co'}`}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-orange-600 to-amber-600 text-white font-semibold text-sm hover:from-orange-500 hover:to-amber-500 transition-all flex items-center justify-center gap-2 shadow-lg shadow-orange-600/30 whitespace-nowrap"
            >
              <span>View Preview</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Sample Live Previews Pills */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-2 text-xs text-slate-400">
          <span className="font-semibold text-slate-500">Live Seeded Previews:</span>
          <Link
            href="/preview/cleveland-pizza-co"
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
          >
            🍕 Cleveland Pizza Co. <ExternalLink className="w-3 h-3 text-orange-400" />
          </Link>
          <Link
            href="/preview/lakefront-landscaping"
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
          >
            🌿 Lakefront Landscaping <ExternalLink className="w-3 h-3 text-orange-400" />
          </Link>
          <Link
            href="/preview/north-coast-plumbing"
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
          >
            🔧 North Coast Plumbing <ExternalLink className="w-3 h-3 text-orange-400" />
          </Link>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-slate-800">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-xs uppercase font-bold tracking-widest text-orange-400">The 4-Step Agency Flywheel</h2>
          <p className="mt-2 text-3xl font-extrabold text-white">How Loud Crayon Operates</p>
          <p className="mt-3 text-slate-400 text-sm">
            Modeled on the validated AI agency pipeline: zero cold calling, zero generic templates, 100% real local reputation data.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-orange-500/40 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-400 flex items-center justify-center font-bold text-lg mb-4">
              1
            </div>
            <h3 className="text-base font-bold text-white">Google Places Discovery</h3>
            <p className="mt-2 text-xs text-slate-400 leading-relaxed">
              Every morning, our Places API engine identifies local businesses with high customer ratings (4.5+) and zero or outdated web presence in Greater Cleveland.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-orange-500/40 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-400 flex items-center justify-center font-bold text-lg mb-4">
              2
            </div>
            <h3 className="text-base font-bold text-white">Autonomous Site Generation</h3>
            <p className="mt-2 text-xs text-slate-400 leading-relaxed">
              AI extracts actual customer reviews, high-res photos, and real service offerings to compile an unlisted, high-speed staging site ready for viewing.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-orange-500/40 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-400 flex items-center justify-center font-bold text-lg mb-4">
              3
            </div>
            <h3 className="text-base font-bold text-white">Preview Delivery & Chat</h3>
            <p className="mt-2 text-xs text-slate-400 leading-relaxed">
              The owner receives an invitation to inspect their custom site. An on-page AI chat assistant answers questions and schedules a walkthrough call.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-orange-500/40 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-400 flex items-center justify-center font-bold text-lg mb-4">
              4
            </div>
            <h3 className="text-base font-bold text-white">Launch & AI Visibility</h3>
            <p className="mt-2 text-xs text-slate-400 leading-relaxed">
              Client approves their site for {AGENCY_CONFIG.pricing.upfrontFormatted} and activates the {AGENCY_CONFIG.pricing.recurringFormatted} monthly retainer for Google Map Pack ranking and ChatGPT visibility.
            </p>
          </div>
        </div>
      </section>

      {/* Pricing Section (Configurable Constants) */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-xs uppercase font-bold tracking-widest text-orange-400">Transparent Pricing Structure</h2>
          <p className="mt-2 text-3xl font-extrabold text-white">Simple, Turnkey Investment</p>
          <p className="mt-2 text-xs text-slate-400">Configurable agency constants · Staging mode</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Upfront Turnkey Tier */}
          <div className="p-8 rounded-3xl bg-slate-900/90 border border-slate-800 flex flex-col justify-between">
            <div>
              <div className="inline-block px-3 py-1 rounded-lg bg-slate-800 text-slate-300 text-xs font-semibold uppercase mb-4">
                Core Website Build
              </div>
              <h3 className="text-2xl font-bold text-white">{AGENCY_CONFIG.pricing.upfrontLabel}</h3>
              <p className="mt-2 text-xs text-slate-400">
                Complete, live custom website built from your verified Google reviews, photos, and services.
              </p>
              <div className="mt-6 flex items-baseline gap-1">
                <span className="text-4xl font-extrabold text-white">{AGENCY_CONFIG.pricing.upfrontFormatted}</span>
                <span className="text-xs text-slate-400 font-medium">one-time investment</span>
              </div>

              <ul className="mt-8 space-y-3 text-xs text-slate-300">
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-orange-500 flex-shrink-0" />
                  <span>Custom Mobile-Responsive Design</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-orange-500 flex-shrink-0" />
                  <span>Verified Google Reviews & Ratings Embedded</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-orange-500 flex-shrink-0" />
                  <span>High-Res Photo Gallery & Service Menu</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-orange-500 flex-shrink-0" />
                  <span>Interactive On-Page Chatbot & Lead Form</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-orange-500 flex-shrink-0" />
                  <span>Custom Domain Setup & Fast Hosting</span>
                </li>
              </ul>
            </div>

            <button
              onClick={() => setIsBookingOpen(true)}
              className="mt-8 w-full py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-sm transition-colors border border-slate-700 flex items-center justify-center gap-2"
            >
              <Calendar className="w-4 h-4" />
              <span>Book Walkthrough Call</span>
            </button>
          </div>

          {/* Monthly Retainer Tier */}
          <div className="p-8 rounded-3xl bg-gradient-to-b from-slate-900 to-slate-950 border-2 border-orange-500/50 shadow-2xl shadow-orange-500/10 flex flex-col justify-between relative">
            <div className="absolute -top-3.5 right-6 px-3 py-1 rounded-full bg-gradient-to-r from-orange-600 to-amber-600 text-white text-[11px] font-bold uppercase tracking-wider shadow">
              High Growth Retainer
            </div>

            <div>
              <div className="inline-block px-3 py-1 rounded-lg bg-orange-500/10 text-orange-400 text-xs font-semibold uppercase mb-4 border border-orange-500/20">
                Monthly AI Visibility Engine
              </div>
              <h3 className="text-2xl font-bold text-white">{AGENCY_CONFIG.pricing.recurringLabel}</h3>
              <p className="mt-2 text-xs text-slate-400">
                Continuous ranking expansion on Google Maps, ChatGPT, Perplexity, and automated review collection.
              </p>
              <div className="mt-6 flex items-baseline gap-1">
                <span className="text-4xl font-extrabold text-orange-400">{AGENCY_CONFIG.pricing.recurringFormatted}</span>
                <span className="text-xs text-slate-400 font-medium">/ month recurring</span>
              </div>

              <ul className="mt-8 space-y-3 text-xs text-slate-300">
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-orange-500 flex-shrink-0" />
                  <span>Google Map Pack Local SEO Optimization</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-orange-500 flex-shrink-0" />
                  <span>AI Visibility (ChatGPT & Perplexity Mentions)</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-orange-500 flex-shrink-0" />
                  <span>Automated 5-Star Review Generation Engine</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-orange-500 flex-shrink-0" />
                  <span>Unlimited Screenshot Edits & Monthly Reports</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-orange-500 flex-shrink-0" />
                  <span>Priority 24/7 Agency Support</span>
                </li>
              </ul>
            </div>

            <button
              onClick={() => setIsBookingOpen(true)}
              className="mt-8 w-full py-3.5 rounded-xl bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white font-semibold text-sm transition-all shadow-lg shadow-orange-600/30 flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>Claim Your Business Site</span>
            </button>
          </div>
        </div>
      </section>

      {/* Booking Modal */}
      {isBookingOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-[#111827] border border-slate-800 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative">
            <button
              onClick={() => setIsBookingOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white text-lg font-bold"
            >
              ✕
            </button>

            <div className="flex items-center gap-2 text-orange-400 mb-2">
              <Calendar className="w-5 h-5" />
              <span className="text-xs uppercase font-bold tracking-wider">Loud Crayon Walkthrough</span>
            </div>

            <h3 className="text-xl font-bold text-white">Book Your 15-Minute Site Review</h3>
            <p className="mt-1 text-xs text-slate-400">
              Walk through your generated website, confirm custom domain settings, and review local Google ranking projections.
            </p>

            {bookedStatus ? (
              <div className="mt-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs">
                🎉 Your walkthrough call has been recorded! Our AI Agency specialist will open your preview at the scheduled time.
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setBookedStatus(true);
                }}
                className="mt-6 space-y-4 text-xs"
              >
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Your Name</label>
                  <input
                    type="text"
                    required
                    placeholder="Alex Morgan"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Business Name</label>
                  <input
                    type="text"
                    required
                    placeholder="Cleveland Pizza Co."
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Preferred Contact Phone or Email</label>
                  <input
                    type="text"
                    required
                    placeholder="(216) 555-0199 or name@business.com"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-orange-500"
                  />
                </div>
                <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-[11px] text-slate-400 flex items-start gap-2">
                  <ShieldAlert className="w-4 h-4 text-orange-400 flex-shrink-0 mt-0.5" />
                  <span>Compliance Guarantee: Loud Crayon never sends cold SMS. Contact information is strictly used for your requested walkthrough call.</span>
                </div>
                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold transition-all shadow-lg"
                >
                  Confirm Walkthrough Slot
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
