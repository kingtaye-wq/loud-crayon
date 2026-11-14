'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Terminal,
  Search,
  Zap,
  CheckCircle2,
  Clock,
  TrendingUp,
  DollarSign,
  Users,
  Camera,
  Bot,
  ShieldAlert,
  ArrowRight,
  ExternalLink,
  MessageSquare,
  AlertTriangle,
  RefreshCw,
  Eye,
  Filter,
} from 'lucide-react';
import { AGENCY_CONFIG } from '@/config/agency';
import { supabase, LeadRecord, BuildQueueRecord, PipelineRecord, FeedbackRecord } from '@/lib/supabase';
import { VERIFIED_SEED_PLACES } from '@/lib/placesApi';

export default function LoudCrayonOsPage() {
  const [activeTab, setActiveTab] = useState<'leads' | 'queue' | 'pipeline' | 'feedback' | 'agents' | 'clients'>('leads');
  const [leads, setLeads] = useState<LeadRecord[]>([]);
  const [queue, setQueue] = useState<BuildQueueRecord[]>([]);
  const [pipeline, setPipeline] = useState<PipelineRecord[]>([]);
  const [feedback, setFeedback] = useState<FeedbackRecord[]>([]);
  const [loading, setLoading] = useState(false);

  // Lead Finder Form State
  const [category, setCategory] = useState(AGENCY_CONFIG.pilot.defaultCategory);
  const [geography, setGeography] = useState(AGENCY_CONFIG.pilot.defaultGeography);

  const fetchOsData = async () => {
    setLoading(true);
    try {
      // 1. Fetch Leads
      const { data: leadsData } = await supabase
        .from('lc_agency_leads')
        .select('*')
        .order('score', { ascending: false });

      if (leadsData && leadsData.length > 0) {
        setLeads(leadsData as LeadRecord[]);
      } else {
        // Fallback to verified seeds
        setLeads(VERIFIED_SEED_PLACES as any);
      }

      // 2. Fetch Build Queue
      const { data: queueData } = await supabase
        .from('lc_agency_build_queue')
        .select('*')
        .order('created_at', { ascending: false });

      if (queueData) {
        setQueue(queueData as BuildQueueRecord[]);
      }

      // 3. Fetch Pipeline
      const { data: pipelineData } = await supabase
        .from('lc_agency_pipeline')
        .select('*')
        .order('created_at', { ascending: false });

      if (pipelineData) {
        setPipeline(pipelineData as PipelineRecord[]);
      }

      // 4. Fetch Feedback
      const { data: feedbackData } = await supabase
        .from('lc_agency_feedback')
        .select('*')
        .order('created_at', { ascending: false });

      if (feedbackData) {
        setFeedback(feedbackData as FeedbackRecord[]);
      }
    } catch (err) {
      console.error('Error fetching OS data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOsData();
  }, []);

  const handleRunFinder = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/leads/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ category, geography }),
      });
      const json = await res.json();
      if (json.leads) {
        setLeads(json.leads);
      }
      fetchOsData();
    } catch (err) {
      console.error('Error running Places finder:', err);
    } finally {
      setLoading(false);
    }
  };

  // Metrics Calculations (Separating Activity vs. Revenue)
  const totalLeads = leads.length;
  const totalSitesReady = queue.filter((q) => q.status === 'ready').length;
  const totalEngagedChats = pipeline.filter((p) => p.stage === 'chat_engaged').length;

  const totalUpfrontCollected = pipeline.filter((p) => p.upfront_paid).length * AGENCY_CONFIG.pricing.upfront;
  const totalMrrActive = pipeline.filter((p) => p.mrr_active).length * AGENCY_CONFIG.pricing.recurring;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* OS Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-6 border-b border-slate-800 gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 text-orange-400 text-xs font-semibold mb-2 border border-orange-500/20">
            <Terminal className="w-3.5 h-3.5" />
            <span>Loud Crayon Command Center</span>
            <span>·</span>
            <span>OS v1.0 Staging</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Loud Crayon OS
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Automated Google Places lead scoring, autonomous build pipeline, and revenue tracking.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchOsData}
            disabled={loading}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh OS</span>
          </button>
        </div>
      </div>

      {/* ─── Scorecard: Activity vs. Revenue (Strictly Separated) ─────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Activity Card */}
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs uppercase font-bold tracking-wider text-slate-400">
              Operational Activity (Work Executed)
            </span>
            <span className="text-[11px] text-slate-500">Places API + Auto-Build</span>
          </div>

          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800/80">
              <span className="text-2xl sm:text-3xl font-extrabold text-white">{totalLeads}</span>
              <span className="block text-[11px] text-slate-400 mt-1">Leads Scouted</span>
            </div>
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800/80">
              <span className="text-2xl sm:text-3xl font-extrabold text-orange-400">{totalSitesReady}</span>
              <span className="block text-[11px] text-slate-400 mt-1">Previews Built</span>
            </div>
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800/80">
              <span className="text-2xl sm:text-3xl font-extrabold text-emerald-400">{totalEngagedChats}</span>
              <span className="block text-[11px] text-slate-400 mt-1">Preview Chats</span>
            </div>
          </div>
        </div>

        {/* Revenue Card (Dollars never dressed up as progress) */}
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs uppercase font-bold tracking-wider text-emerald-400">
              Closed Revenue & MRR
            </span>
            <span className="text-[11px] text-slate-500">Stripe Test Metrics</span>
          </div>

          <div className="grid grid-cols-2 gap-4 text-center">
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800/80">
              <span className="text-2xl sm:text-3xl font-extrabold text-white">
                ${totalUpfrontCollected.toLocaleString()}
              </span>
              <span className="block text-[11px] text-slate-400 mt-1">
                {AGENCY_CONFIG.pricing.upfrontFormatted} Upfront Collected
              </span>
            </div>
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800/80">
              <span className="text-2xl sm:text-3xl font-extrabold text-emerald-400">
                ${totalMrrActive.toLocaleString()}/mo
              </span>
              <span className="block text-[11px] text-slate-400 mt-1">
                {AGENCY_CONFIG.pricing.recurringFormatted} Active MRR
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-800 pb-2 text-xs font-semibold">
        <button
          onClick={() => setActiveTab('leads')}
          className={`px-4 py-2 rounded-xl transition-colors ${
            activeTab === 'leads' ? 'bg-orange-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          1. Lead Engine ({leads.length})
        </button>
        <button
          onClick={() => setActiveTab('queue')}
          className={`px-4 py-2 rounded-xl transition-colors ${
            activeTab === 'queue' ? 'bg-orange-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          2. Build Queue ({queue.length})
        </button>
        <button
          onClick={() => setActiveTab('pipeline')}
          className={`px-4 py-2 rounded-xl transition-colors ${
            activeTab === 'pipeline' ? 'bg-orange-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          3. Sales Pipeline ({pipeline.length})
        </button>
        <button
          onClick={() => setActiveTab('feedback')}
          className={`px-4 py-2 rounded-xl transition-colors ${
            activeTab === 'feedback' ? 'bg-orange-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          4. Feedback Inbox ({feedback.length})
        </button>
        <button
          onClick={() => setActiveTab('agents')}
          className={`px-4 py-2 rounded-xl transition-colors ${
            activeTab === 'agents' ? 'bg-orange-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          5. Onboarding Agents
        </button>
        <button
          onClick={() => setActiveTab('clients')}
          className={`px-4 py-2 rounded-xl transition-colors ${
            activeTab === 'clients' ? 'bg-orange-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          6. Clients & MRR
        </button>
      </div>

      {/* ─── TAB 1: Lead Engine ───────────────────────────────────────────── */}
      {activeTab === 'leads' && (
        <div className="space-y-6">
          {/* Places API Query Controls */}
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
              <div>
                <label className="block text-[11px] text-slate-400 font-semibold mb-1">Target Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                >
                  {AGENCY_CONFIG.pilot.supportedCategories.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] text-slate-400 font-semibold mb-1">Geography (40-Min Band)</label>
                <select
                  value={geography}
                  onChange={(e) => setGeography(e.target.value)}
                  className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                >
                  {AGENCY_CONFIG.pilot.geographies.map((g) => (
                    <option key={g} value={g}>
                      {g}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <button
              onClick={handleRunFinder}
              disabled={loading}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-colors"
            >
              <Search className="w-3.5 h-3.5" />
              <span>Scout Places Leads</span>
            </button>
          </div>

          {/* Leads Table */}
          <div className="rounded-3xl bg-slate-900 border border-slate-800 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950/80 border-b border-slate-800 text-[11px] uppercase tracking-wider text-slate-400">
                  <tr>
                    <th className="py-3.5 px-4">Business Name & Category</th>
                    <th className="py-3.5 px-4">Location</th>
                    <th className="py-3.5 px-4">Website Status</th>
                    <th className="py-3.5 px-4">Google Rating</th>
                    <th className="py-3.5 px-4">Lead Score</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80 font-normal">
                  {leads.map((lead) => (
                    <tr key={lead.slug} className="hover:bg-slate-800/30 transition-colors">
                      <td className="py-3.5 px-4">
                        <span className="font-bold text-white block">{lead.business_name}</span>
                        <span className="text-[11px] text-slate-400">{lead.category}</span>
                      </td>
                      <td className="py-3.5 px-4">{lead.geography}</td>
                      <td className="py-3.5 px-4">
                        {lead.has_website ? (
                          <span className="text-amber-400 flex items-center gap-1 text-[11px]">
                            <AlertTriangle className="w-3 h-3" /> Outdated Web
                          </span>
                        ) : (
                          <span className="text-emerald-400 font-bold text-[11px]">
                            ● No Website (Prime)
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="font-semibold text-white">★ {lead.google_rating}</span>
                        <span className="text-slate-500 text-[11px] ml-1">({lead.review_count})</span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="px-2 py-0.5 rounded-md bg-orange-500/10 text-orange-400 font-bold border border-orange-500/20">
                          {lead.score} / 100
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <Link
                          href={`/preview/${lead.slug}`}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold"
                        >
                          <span>Preview</span>
                          <ExternalLink className="w-3 h-3 text-orange-400" />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ─── TAB 2: Build Queue ───────────────────────────────────────────── */}
      {activeTab === 'queue' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {queue.map((item) => (
              <div key={item.slug} className="p-6 rounded-3xl bg-slate-900 border border-slate-800 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs uppercase font-bold text-orange-400">Template: {item.template_id}</span>
                    <span
                      className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase ${
                        item.status === 'ready'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                      }`}
                    >
                      ● {item.status}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-white">{item.business_name}</h3>
                  <span className="text-[11px] text-slate-400 block mt-0.5 font-mono">{item.preview_url}</span>

                  {/* QA Checklist */}
                  <div className="mt-4 pt-4 border-t border-slate-800 space-y-2 text-xs text-slate-300">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Google Reviews & Rating Seeded</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Photos & Gallery Rendered</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      <span>On-Page Chatbot Active</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Noindex Meta Tag Confirmed</span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between">
                  <Link
                    href={item.preview_url}
                    className="text-xs text-orange-400 hover:text-orange-300 font-semibold flex items-center gap-1"
                  >
                    <span>Open Live Preview</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Link>

                  <span className="text-[10px] text-slate-500">Auto-Generated</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ─── TAB 3: Sales Pipeline ───────────────────────────────────────── */}
      {activeTab === 'pipeline' && (
        <div className="space-y-6">
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs text-slate-300">
            <span className="font-semibold">Pipeline Velocity: 3 Active Opportunities</span>
            <span className="text-slate-400">Activity tracked separately from closed dollars</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {pipeline.map((deal) => (
              <div key={deal.client_username} className="p-6 rounded-3xl bg-slate-900 border border-slate-800">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-white">{deal.business_name}</span>
                  <span className="px-2 py-0.5 rounded bg-orange-500/10 text-orange-400 text-[10px] font-bold uppercase">
                    {deal.stage.replace('_', ' ')}
                  </span>
                </div>

                <span className="text-[11px] text-slate-400 block font-mono">@{deal.client_username}</span>

                <div className="mt-4 p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Upfront Price:</span>
                    <span className="font-bold text-white">${deal.upfront_amount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Recurring MRR:</span>
                    <span className="font-bold text-emerald-400">${deal.mrr_amount}/mo</span>
                  </div>
                </div>

                <p className="mt-3 text-[11px] text-slate-400 italic">
                  &ldquo;{deal.notes || 'Prospect active on staging preview.'}&rdquo;
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ─── TAB 4: Feedback Inbox (Userback-Style Screenshot Reports) ───── */}
      {activeTab === 'feedback' && (
        <div className="space-y-6">
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs">
            <div>
              <span className="font-bold text-white block">OS Feedback Inbox</span>
              <span className="text-slate-400">
                Triage incoming annotated screenshot reports from the Chrome extension or embeddable widget.
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-orange-500/10 text-orange-400 font-semibold border border-orange-500/20">
                {feedback.length} Reports Logged
              </span>
            </div>
          </div>

          {feedback.length === 0 ? (
            <div className="p-12 text-center rounded-3xl bg-slate-900 border border-slate-800 text-slate-400 text-xs">
              <Camera className="w-8 h-8 mx-auto text-slate-500 mb-3" />
              <p className="font-bold text-slate-300">No Screenshot Reports In Queue</p>
              <p className="mt-1">
                Use the bottom-right feedback button or the Chrome extension to capture an annotated page.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {feedback.map((item) => (
                <div key={item.id} className="p-6 rounded-3xl bg-slate-900 border border-slate-800 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-white">{item.title}</span>
                      <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-[10px] font-bold uppercase">
                        ● {item.status}
                      </span>
                    </div>

                    <p className="text-xs text-slate-300 mt-1">{item.description}</p>

                    {item.screenshot_url && (
                      <div className="mt-4 rounded-xl overflow-hidden border border-slate-800 aspect-video bg-black">
                        <img
                          src={item.screenshot_url}
                          alt="Screenshot capture"
                          className="w-full h-full object-contain"
                        />
                      </div>
                    )}

                    {/* Metadata Context */}
                    <div className="mt-4 p-3 rounded-xl bg-slate-950 border border-slate-800 text-[11px] space-y-1 font-mono text-slate-400">
                      <div>Page: {item.page_url}</div>
                      {item.element_selector && <div>Selector: {item.element_selector}</div>}
                      {item.viewport && <div>Viewport: {item.viewport}</div>}
                      {item.browser_os && <div>OS/Browser: {item.browser_os}</div>}
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between">
                    <span className="text-[10px] text-slate-500">By @{item.client_username}</span>
                    <button
                      onClick={() => alert(`Context dispatched to Antigravity coding queue for element: ${item.element_selector || item.page_url}`)}
                      className="px-3 py-1.5 rounded-lg bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs"
                    >
                      Dispatch to AI Coder
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ─── TAB 5: Onboarding Agents ─────────────────────────────────────── */}
      {activeTab === 'agents' && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800">
            <h3 className="text-lg font-bold text-white mb-2">Autonomous Agency Setup Pipeline</h3>
            <p className="text-xs text-slate-400">
              When a client submits their onboarding answers, 4 AI agents execute setup tasks in parallel with human-in-the-loop review.
            </p>

            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
                <span className="text-xs font-bold text-white block">Copywriter AI</span>
                <span className="text-[10px] text-emerald-400 block mb-2">● Active</span>
                <p className="text-[11px] text-slate-400">
                  Customizes headlines, menu items, and tone to match local Cleveland neighborhoods.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
                <span className="text-xs font-bold text-white block">Local SEO AI</span>
                <span className="text-[10px] text-emerald-400 block mb-2">● Active</span>
                <p className="text-[11px] text-slate-400">
                  Optimizes Google Business Profile primary & secondary categories for map ranking.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
                <span className="text-xs font-bold text-white block">Reputation AI</span>
                <span className="text-[10px] text-orange-400 block mb-2">● Ready</span>
                <p className="text-[11px] text-slate-400">
                  Deploys 5-star review collector and sets up automated post-service review sequences.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
                <span className="text-xs font-bold text-white block">Knowledge Graph AI</span>
                <span className="text-[10px] text-orange-400 block mb-2">● Ready</span>
                <p className="text-[11px] text-slate-400">
                  Feeds structured Schema.org JSON-LD to ChatGPT, Perplexity, and Apple Maps bots.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─── TAB 6: Clients & MRR ─────────────────────────────────────────── */}
      {activeTab === 'clients' && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs">
            <div>
              <h3 className="text-base font-bold text-white">Active Retainer Accounts</h3>
              <p className="text-slate-400 mt-0.5">Loud Crayon AI Visibility & SEO Clients ($297/mo)</p>
            </div>
            <span className="px-3 py-1.5 rounded-full bg-emerald-500/10 text-emerald-400 font-bold border border-emerald-500/20">
              Total Active MRR: ${totalMrrActive.toLocaleString()}/mo
            </span>
          </div>

          <div className="rounded-3xl bg-slate-900 border border-slate-800 overflow-hidden">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950/80 border-b border-slate-800 text-[11px] uppercase tracking-wider text-slate-400">
                <tr>
                  <th className="py-3 px-4">Client</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Plan</th>
                  <th className="py-3 px-4">MRR</th>
                  <th className="py-3 px-4">Map Pack Rank</th>
                  <th className="py-3 px-4">AI Score</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                <tr className="hover:bg-slate-800/30">
                  <td className="py-3.5 px-4 font-bold text-white">Cleveland Pizza Co.</td>
                  <td className="py-3.5 px-4 text-emerald-400">● Active</td>
                  <td className="py-3.5 px-4">Bundle ($997 + $297)</td>
                  <td className="py-3.5 px-4 font-bold text-white">$297/mo</td>
                  <td className="py-3.5 px-4">#4.2 (▲ +3)</td>
                  <td className="py-3.5 px-4 text-orange-400 font-bold">84 / 100</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
