'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  CheckCircle2,
  ExternalLink,
  CreditCard,
  TrendingUp,
  Search,
  MessageSquare,
  ShieldCheck,
  Send,
  Camera,
  Bot,
  Star,
  Settings,
  HelpCircle,
} from 'lucide-react';
import { AGENCY_CONFIG } from '@/config/agency';
import { supabase } from '@/lib/supabase';

export default function ClientAppPage() {
  const [username, setUsername] = useState('testclient');
  const [businessName, setBusinessName] = useState('Cleveland Pizza Co.');
  const [activeTab, setActiveTab] = useState<'portal' | 'dashboard' | 'onboarding'>('portal');

  // Payment State
  const [upfrontPaid, setUpfrontPaid] = useState(false);
  const [mrrActive, setMrrActive] = useState(true);

  // Onboarding Form State
  const [domainChoice, setDomainChoice] = useState('new');
  const [domainName, setDomainName] = useState('clevelandpizzaco.com');
  const [gbpAccess, setGbpAccess] = useState(true);
  const [brandColor, setBrandColor] = useState('#f97316');
  const [onboardingSaved, setOnboardingSaved] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem('lc_username');
    if (savedUser && savedUser !== 'loudcrayon') {
      setUsername(savedUser);
    }
  }, []);

  const handleSaveOnboarding = async (e: React.FormEvent) => {
    e.preventDefault();
    setOnboardingSaved(true);

    try {
      await supabase.from('lc_agency_onboarding').upsert({
        client_username: username,
        business_name: businessName,
        form_data: {
          domainChoice,
          domainName,
          gbpAccess,
          brandColor,
          submittedAt: new Date().toISOString(),
        },
        status: 'in_progress',
      });
    } catch (err) {
      console.error('Error saving onboarding data:', err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Client Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-8 border-b border-slate-800 gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 text-orange-400 text-xs font-semibold mb-2 border border-orange-500/20">
            <span>Client Workspace</span>
            <span>·</span>
            <span>Username: @{username}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            {businessName} Portal
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Review your generated website, manage your launch, and monitor Google rankings & AI visibility.
          </p>
        </div>

        {/* View Staging Preview Link */}
        <div className="flex items-center gap-3">
          <Link
            href="/preview/cleveland-pizza-co"
            target="_blank"
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center gap-2 transition-colors"
          >
            <span>Open Staging Preview</span>
            <ExternalLink className="w-3.5 h-3.5 text-orange-400" />
          </Link>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pt-6 pb-2 text-xs font-semibold">
        <button
          onClick={() => setActiveTab('portal')}
          className={`px-4 py-2 rounded-xl transition-colors ${
            activeTab === 'portal'
              ? 'bg-orange-600 text-white shadow'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          Site Approval & Launch
        </button>
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`px-4 py-2 rounded-xl transition-colors ${
            activeTab === 'dashboard'
              ? 'bg-orange-600 text-white shadow'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          AI Visibility & Rankings ($297/mo)
        </button>
        <button
          onClick={() => setActiveTab('onboarding')}
          className={`px-4 py-2 rounded-xl transition-colors ${
            activeTab === 'onboarding'
              ? 'bg-orange-600 text-white shadow'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          Setup Form & AI Agents
        </button>
      </div>

      {/* TAB 1: Site Approval & Launch */}
      {activeTab === 'portal' && (
        <div className="pt-8 space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Approval Card */}
            <div className="lg:col-span-2 p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs uppercase tracking-wider font-bold text-orange-400">
                    Staging Site Ready
                  </span>
                  <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-[11px] font-semibold border border-emerald-500/20">
                    ● QA Passed
                  </span>
                </div>

                <h2 className="text-xl font-bold text-white">Your Custom Website Is Ready For Approval</h2>
                <p className="mt-2 text-xs text-slate-300 leading-relaxed">
                  We compiled your verified reviews, authentic business photos, and full service menu into a mobile-first digital storefront. Open the preview to test interactive forms and on-page chat.
                </p>

                {/* Staging URL Box */}
                <div className="mt-6 p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                  <div className="text-xs">
                    <span className="text-slate-500 block text-[10px] uppercase font-bold">Unlisted Preview URL</span>
                    <span className="font-mono text-slate-200">/preview/cleveland-pizza-co</span>
                  </div>
                  <Link
                    href="/preview/cleveland-pizza-co"
                    className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5"
                  >
                    <span>View Site</span>
                    <ExternalLink className="w-3.5 h-3.5 text-orange-400" />
                  </Link>
                </div>
              </div>

              {/* Actions */}
              <div className="mt-8 pt-6 border-t border-slate-800 flex flex-wrap items-center justify-between gap-4">
                <div className="text-xs text-slate-400 flex items-center gap-2">
                  <Camera className="w-4 h-4 text-orange-400" />
                  <span>Tip: Use the bottom-right feedback button to annotate screenshots directly.</span>
                </div>

                <button
                  onClick={() => alert('Site approved! Proceeding to domain propagation.')}
                  className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-colors shadow"
                >
                  Approve & Launch Site
                </button>
              </div>
            </div>

            {/* Turnkey Checkout Card */}
            <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 text-orange-400 mb-2">
                  <CreditCard className="w-4 h-4" />
                  <span className="text-xs uppercase font-bold tracking-wider">Stripe Test Mode</span>
                </div>

                <h3 className="text-lg font-bold text-white">Turnkey Investment</h3>
                <p className="mt-1 text-xs text-slate-400">
                  {AGENCY_CONFIG.pricing.upfrontLabel} + Domain Setup
                </p>

                <div className="mt-6 p-4 rounded-2xl bg-slate-950 border border-slate-800 text-center">
                  <span className="text-3xl font-extrabold text-white">{AGENCY_CONFIG.pricing.upfrontFormatted}</span>
                  <span className="block text-[11px] text-slate-500 mt-1">One-time payment</span>
                </div>

                <div className="mt-6 space-y-2.5 text-xs text-slate-300">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-orange-500" />
                    <span>Includes 12 Months Hosting</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-orange-500" />
                    <span>Custom Domain DNS Connection</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-orange-500" />
                    <span>Free SSL & Security Hardening</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => {
                  setUpfrontPaid(true);
                  alert('Test Mode Payment of $997 simulated successfully! Receipt recorded in pipeline.');
                }}
                disabled={upfrontPaid}
                className={`mt-8 w-full py-3 rounded-xl font-bold text-xs transition-all shadow-md flex items-center justify-center gap-2 ${
                  upfrontPaid
                    ? 'bg-emerald-600 text-white cursor-default'
                    : 'bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 text-white'
                }`}
              >
                <CreditCard className="w-4 h-4" />
                <span>{upfrontPaid ? '✓ Paid $997 (Test Mode)' : 'Pay $997 (Stripe Test)'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Post-Launch AI Visibility & Rankings ($297/mo) */}
      {activeTab === 'dashboard' && (
        <div className="pt-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Metric 1: Google Map Pack */}
            <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800">
              <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                <span>Google Map Pack Average</span>
                <TrendingUp className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-3xl font-extrabold text-white">#4.2</div>
              <span className="text-xs text-emerald-400 font-semibold mt-1 block">
                ▲ +3 positions this month
              </span>
              <p className="mt-4 text-[11px] text-slate-400 border-t border-slate-800 pt-3">
                Tracking keywords: <em>&ldquo;pizza cleveland&rdquo;</em>, <em>&ldquo;best pizza near me&rdquo;</em>, <em>&ldquo;wood fired pizza 44102&rdquo;</em>.
              </p>
            </div>

            {/* Metric 2: AI Visibility Score */}
            <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800">
              <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                <span>AI Visibility (LLM Queries)</span>
                <Sparkles className="w-4 h-4 text-orange-400" />
              </div>
              <div className="text-3xl font-extrabold text-orange-400">84 / 100</div>
              <span className="text-xs text-slate-400 font-medium mt-1 block">
                ChatGPT & Perplexity Mentions
              </span>
              <p className="mt-4 text-[11px] text-slate-400 border-t border-slate-800 pt-3">
                Your business is actively recommended when users query AI chatbots for top pizza in Cleveland.
              </p>
            </div>

            {/* Metric 3: Automated Review Generation */}
            <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800">
              <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                <span>Reputation Engine</span>
                <Star className="w-4 h-4 text-amber-400" />
              </div>
              <div className="text-3xl font-extrabold text-white">128 Reviews</div>
              <span className="text-xs text-amber-400 font-semibold mt-1 block">
                ★ 4.8 / 5.0 Average Rating
              </span>
              <p className="mt-4 text-[11px] text-slate-400 border-t border-slate-800 pt-3">
                14 new 5-star Google reviews collected automatically via post-visit SMS/email prompts.
              </p>
            </div>
          </div>

          {/* Retainer Status Box */}
          <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <span className="text-xs uppercase font-bold text-orange-400">Monthly Growth Retainer</span>
              <h3 className="text-lg font-bold text-white mt-1">
                {AGENCY_CONFIG.pricing.recurringLabel} ({AGENCY_CONFIG.pricing.recurringFormatted})
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Continuous local SEO ranking, weekly AI knowledge graph updates, and automated review campaigns.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className="px-3 py-1.5 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold border border-emerald-500/20">
                ● Retainer Active
              </span>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: Setup Form & AI Agents */}
      {activeTab === 'onboarding' && (
        <div className="pt-8 space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Client Onboarding Form */}
            <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800">
              <h3 className="text-lg font-bold text-white mb-1">Onboarding Details</h3>
              <p className="text-xs text-slate-400 mb-6">
                Your answers directly instruct our setup AI agents to finalize your site and Google profile.
              </p>

              {onboardingSaved ? (
                <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs">
                  ✅ Onboarding saved! Setup agents are currently generating your deliverables below.
                </div>
              ) : (
                <form onSubmit={handleSaveOnboarding} className="space-y-4 text-xs">
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Domain Strategy</label>
                    <select
                      value={domainChoice}
                      onChange={(e) => setDomainChoice(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-orange-500"
                    >
                      <option value="new">Register a brand new domain for us ($0 included)</option>
                      <option value="existing">Connect our existing domain</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Target Domain Name</label>
                    <input
                      type="text"
                      value={domainName}
                      onChange={(e) => setDomainName(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-orange-500"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="gbp"
                      checked={gbpAccess}
                      onChange={(e) => setGbpAccess(e.target.checked)}
                      className="rounded bg-slate-950 border-slate-700 text-orange-600 focus:ring-0"
                    />
                    <label htmlFor="gbp" className="text-slate-300">
                      I have invited Loud Crayon as a manager on Google Business Profile
                    </label>
                  </div>

                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Brand Accent Color</label>
                    <div className="flex items-center gap-3">
                      <input
                        type="color"
                        value={brandColor}
                        onChange={(e) => setBrandColor(e.target.value)}
                        className="w-10 h-10 rounded-lg cursor-pointer bg-transparent border-0"
                      />
                      <span className="font-mono text-slate-400">{brandColor}</span>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold transition-all shadow-md"
                  >
                    Submit Answers to Setup Agents
                  </button>
                </form>
              )}
            </div>

            {/* AI Setup Agents Task Progress */}
            <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Bot className="w-5 h-5 text-orange-400" />
                  <span>Autonomous Setup Agents</span>
                </h3>
                <span className="text-[11px] text-slate-400">Automated Pipeline</span>
              </div>

              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800/80">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-white">Agent 1: Copywriter AI</span>
                    <span className="text-emerald-400 font-medium">● Complete</span>
                  </div>
                  <p className="mt-1 text-[11px] text-slate-400">
                    Drafted custom hero headlines and localized menu descriptions for Cleveland, OH.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800/80">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-white">Agent 2: Local SEO AI</span>
                    <span className="text-emerald-400 font-medium">● Complete</span>
                  </div>
                  <p className="mt-1 text-[11px] text-slate-400">
                    Audit of Google Business Profile categories, photo geo-tagging, and hours format.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800/80">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-white">Agent 3: Reputation AI</span>
                    <span className="text-orange-400 font-medium">● Ready for Deploy</span>
                  </div>
                  <p className="mt-1 text-[11px] text-slate-400">
                    Embedded 5-star review collection widget ready for customer SMS/email review invites.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800/80">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-white">Agent 4: LLM Knowledge Graph AI</span>
                    <span className="text-orange-400 font-medium">● Ready for Deploy</span>
                  </div>
                  <p className="mt-1 text-[11px] text-slate-400">
                    Structured Schema.org JSON-LD formatted to feed ChatGPT, Perplexity, and Apple Maps.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
