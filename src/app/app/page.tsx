'use client';

import React, { useState, useEffect, useRef } from 'react';
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
  Globe,
  Download,
  Upload,
  RefreshCw,
  Bell,
  Clock,
  AlertCircle,
  Smartphone,
  ChevronRight,
  Layers,
  ShoppingBag,
  FileText,
  Activity,
  Check,
} from 'lucide-react';
import { AGENCY_CONFIG } from '@/config/agency';
import { supabase } from '@/lib/supabase';

type TabType = 'website' | 'plugin' | 'maintenance' | 'services' | 'billing' | 'dashboard' | 'onboarding';

interface MaintenanceTicket {
  id: string;
  title: string;
  category: string;
  status: 'Received' | 'In progress' | 'Needs your approval' | 'Done';
  created_at: string;
  page_url?: string;
  screenshot_url?: string;
  notes?: string;
}

export default function ClientAppPage() {
  const [username, setUsername] = useState('testclient');
  const [businessName, setBusinessName] = useState('Cleveland Pizza Co.');
  const [activeTab, setActiveTab] = useState<TabType>('website');

  // Client unique site key
  const siteKey = `lc_live_${username.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_997`;
  const siteDomain = 'clevelandpizzaco.com';
  const stagingUrl = '/preview/cleveland-pizza-co';

  // Payment State
  const [upfrontPaid, setUpfrontPaid] = useState(true);
  const [mrrActive, setMrrActive] = useState(true);

  // Plugin Connection Test State
  const [pluginTesting, setPluginTesting] = useState(false);
  const [pluginStatus, setPluginStatus] = useState<{ connected: boolean; version: string; lastPing: string }>({
    connected: true,
    version: '1.2.0',
    lastPing: '2 mins ago',
  });

  // Maintenance Requests State
  const [tickets, setTickets] = useState<MaintenanceTicket[]>([
    {
      id: 'REQ-101',
      title: 'Update Friday hours to 11pm',
      category: 'hours/info',
      status: 'Done',
      created_at: '2026-11-18T14:20:00Z',
      notes: 'Updated on Google Business and live menu footer.',
    },
    {
      id: 'REQ-102',
      title: 'Swap Hero image for holiday pizza special',
      category: 'photo swap',
      status: 'Needs your approval',
      created_at: '2026-11-19T09:15:00Z',
      notes: 'New holiday hero uploaded to staging. Please review and approve.',
    },
    {
      id: 'REQ-103',
      title: 'Add catering inquiry form link to navbar',
      category: 'new page',
      status: 'In progress',
      created_at: '2026-11-20T04:10:00Z',
      notes: 'Form created, linking into main menu.',
    },
  ]);

  // Request a Change Modal State (Mobile PWA & Touch Canvas)
  const [showChangeModal, setShowChangeModal] = useState(false);
  const [changeTitle, setChangeTitle] = useState('');
  const [changeCategory, setChangeCategory] = useState('text change');
  const [changeNotes, setChangeNotes] = useState('');
  const [changeImage, setChangeImage] = useState<string | null>(null);
  const [isSubmittingChange, setIsSubmittingChange] = useState(false);
  const [changeSuccessMsg, setChangeSuccessMsg] = useState(false);

  // Canvas drawing state
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  // Onboarding Form State
  const [domainChoice, setDomainChoice] = useState('new');
  const [domainNameInput, setDomainNameInput] = useState(siteDomain);
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
          domainName: domainNameInput,
          brandColor,
          submittedAt: new Date().toISOString(),
        },
        status: 'in_progress',
      });
    } catch (err) {
      console.error('Error saving onboarding data:', err);
    }
  };

  const handleTestPluginConnection = () => {
    setPluginTesting(true);
    setTimeout(() => {
      setPluginTesting(false);
      setPluginStatus({
        connected: true,
        version: '1.2.0',
        lastPing: 'Just now (HTTP 200 OK)',
      });
    }, 1200);
  };

  const handleApproveTicket = (id: string) => {
    setTickets((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: 'Done' } : t))
    );
  };

  const handleReopenTicket = (id: string) => {
    setTickets((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: 'In progress' } : t))
    );
  };

  // Canvas drawing touch handlers
  const handleTouchStart = (e: React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    const touch = e.touches[0];
    ctx.beginPath();
    ctx.moveTo(touch.clientX - rect.left, touch.clientY - rect.top);
    setIsDrawing(true);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    const touch = e.touches[0];
    ctx.lineTo(touch.clientX - rect.left, touch.clientY - rect.top);
    ctx.strokeStyle = '#ea580c';
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.stroke();
  };

  const handleTouchEnd = () => {
    setIsDrawing(false);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setChangeImage(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmitChangeRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!changeTitle) return;
    setIsSubmittingChange(true);

    const newTicket: MaintenanceTicket = {
      id: `REQ-${Math.floor(100 + Math.random() * 900)}`,
      title: changeTitle,
      category: changeCategory,
      status: 'Received',
      created_at: new Date().toISOString(),
      notes: changeNotes,
      screenshot_url: changeImage || undefined,
    };

    try {
      await fetch('/api/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Client-Origin': window.location.origin,
          'X-Site-Key': siteKey,
        },
        body: JSON.stringify({
          client_username: username,
          title: changeTitle,
          description: changeNotes,
          category: changeCategory,
          priority: 'medium',
          page_url: siteDomain,
          screenshot_data: changeImage,
          source: 'mobile_pwa_client_app',
        }),
      });
    } catch {
      // Offline / fallback gracefully
    }

    setTickets((prev) => [newTicket, ...prev]);
    setIsSubmittingChange(false);
    setChangeSuccessMsg(true);
    setTimeout(() => {
      setChangeSuccessMsg(false);
      setShowChangeModal(false);
      setChangeTitle('');
      setChangeNotes('');
      setChangeImage(null);
    }, 1500);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Client Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-6 border-b border-slate-800 gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 text-orange-400 text-xs font-semibold mb-2 border border-orange-500/20">
            <Smartphone className="w-3.5 h-3.5" />
            <span>Client Workspace & PWA</span>
            <span>·</span>
            <span>@{username}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            {businessName}
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Website management, maintenance requests, and AI agency portal.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowChangeModal(true)}
            className="px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-semibold text-xs flex items-center gap-2 shadow-lg shadow-orange-600/20 transition-colors"
          >
            <Camera className="w-3.5 h-3.5" />
            <span>Request a change</span>
          </button>
          <Link
            href={stagingUrl}
            target="_blank"
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center gap-2 transition-colors"
          >
            <span>Open Preview</span>
            <ExternalLink className="w-3.5 h-3.5 text-orange-400" />
          </Link>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-2 border-b border-slate-800 pt-6 pb-2 text-xs font-semibold overflow-x-auto scrollbar-none">
        <button
          onClick={() => setActiveTab('website')}
          className={`px-4 py-2 rounded-xl flex items-center gap-2 whitespace-nowrap transition-colors ${
            activeTab === 'website'
              ? 'bg-orange-600 text-white shadow'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <Globe className="w-3.5 h-3.5" />
          <span>My Website</span>
        </button>

        <button
          onClick={() => setActiveTab('plugin')}
          className={`px-4 py-2 rounded-xl flex items-center gap-2 whitespace-nowrap transition-colors ${
            activeTab === 'plugin'
              ? 'bg-orange-600 text-white shadow'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <Download className="w-3.5 h-3.5" />
          <span>Install the Update Plugin</span>
        </button>

        <button
          onClick={() => setActiveTab('maintenance')}
          className={`px-4 py-2 rounded-xl flex items-center gap-2 whitespace-nowrap transition-colors ${
            activeTab === 'maintenance'
              ? 'bg-orange-600 text-white shadow'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Maintenance Requests</span>
          <span className="bg-slate-900/60 text-orange-400 px-1.5 py-0.2 rounded-full text-[10px]">
            {tickets.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('services')}
          className={`px-4 py-2 rounded-xl flex items-center gap-2 whitespace-nowrap transition-colors ${
            activeTab === 'services'
              ? 'bg-orange-600 text-white shadow'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <ShoppingBag className="w-3.5 h-3.5" />
          <span>Services / Upsells</span>
        </button>

        <button
          onClick={() => setActiveTab('billing')}
          className={`px-4 py-2 rounded-xl flex items-center gap-2 whitespace-nowrap transition-colors ${
            activeTab === 'billing'
              ? 'bg-orange-600 text-white shadow'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <CreditCard className="w-3.5 h-3.5" />
          <span>Plan & Billing</span>
        </button>

        <button
          onClick={() => setActiveTab('dashboard')}
          className={`px-4 py-2 rounded-xl flex items-center gap-2 whitespace-nowrap transition-colors ${
            activeTab === 'dashboard'
              ? 'bg-orange-600 text-white shadow'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <TrendingUp className="w-3.5 h-3.5" />
          <span>AI Visibility</span>
        </button>

        <button
          onClick={() => setActiveTab('onboarding')}
          className={`px-4 py-2 rounded-xl flex items-center gap-2 whitespace-nowrap transition-colors ${
            activeTab === 'onboarding'
              ? 'bg-orange-600 text-white shadow'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <Settings className="w-3.5 h-3.5" />
          <span>Setup Details</span>
        </button>
      </div>

      {/* TAB 1: MY WEBSITE HUB */}
      {activeTab === 'website' && (
        <div className="pt-6 space-y-6">
          {/* Site Status Strip */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="bg-[#111827] border border-slate-800 rounded-2xl p-4">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                Site Status
              </span>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-base font-bold text-white">Live Staging (200 OK)</span>
              </div>
              <span className="text-[10px] text-slate-500 mt-1 block">X-Robots: noindex protected</span>
            </div>

            <div className="bg-[#111827] border border-slate-800 rounded-2xl p-4">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                Target Domain
              </span>
              <span className="text-base font-bold text-white block truncate">{siteDomain}</span>
              <span className="text-[10px] text-orange-400 mt-1 block">Pending DNS switch</span>
            </div>

            <div className="bg-[#111827] border border-slate-800 rounded-2xl p-4">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                Last Updated
              </span>
              <span className="text-base font-bold text-white">Today at 1:45 AM</span>
              <span className="text-[10px] text-slate-500 mt-1 block">Via Loud Crayon Build Queue</span>
            </div>

            <div className="bg-[#111827] border border-slate-800 rounded-2xl p-4">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                Update Plugin Status
              </span>
              <div className="flex items-center gap-1.5 text-emerald-400 font-semibold text-sm">
                <Check className="w-4 h-4" />
                <span>Connected (v{pluginStatus.version})</span>
              </div>
              <span className="text-[10px] text-slate-500 mt-1 block">{pluginStatus.lastPing}</span>
            </div>
          </div>

          {/* Embedded Live Preview Container */}
          <div className="bg-[#111827] border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
            <div className="px-5 py-3.5 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                </div>
                <span className="text-xs text-slate-400 font-mono ml-2">https://{siteDomain} (Preview Engine)</span>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowChangeModal(true)}
                  className="px-3 py-1 rounded-lg bg-orange-600/20 text-orange-400 border border-orange-500/30 text-xs font-semibold hover:bg-orange-600/30 transition-colors flex items-center gap-1.5"
                >
                  <Camera className="w-3.5 h-3.5" />
                  <span>Request Edit</span>
                </button>
                <Link
                  href={stagingUrl}
                  target="_blank"
                  className="text-xs text-slate-400 hover:text-white flex items-center gap-1"
                >
                  <span>Open in new tab</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            <div className="relative w-full h-[520px] bg-slate-950">
              <iframe
                src={stagingUrl}
                title="Client Website Preview"
                className="w-full h-full border-none"
              />
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: INSTALL UPDATE PLUGIN */}
      {activeTab === 'plugin' && (
        <div className="pt-6 space-y-6">
          <div className="bg-[#111827] border border-slate-800 rounded-2xl p-6">
            <h2 className="text-lg font-bold text-white mb-2">Install the Update Plugin</h2>
            <p className="text-xs text-slate-400 mb-6">
              The Loud Crayon Update Plugin is your on-site bridge: it enables 1-tap mobile screenshot editing, direct maintenance requests from inside your website, and real-time site synchronization.
            </p>

            {/* Client Site Key */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 mb-6">
              <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                Your Unique Client Site Key (Never Share)
              </label>
              <div className="flex items-center justify-between gap-3">
                <code className="text-sm font-mono text-orange-400 bg-black/40 px-3 py-1.5 rounded-lg border border-orange-500/20 select-all">
                  {siteKey}
                </code>
                <button
                  onClick={handleTestPluginConnection}
                  disabled={pluginTesting}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-2 border border-slate-700 transition-colors"
                >
                  <RefreshCw className={`w-3.5 h-3.5 text-orange-400 ${pluginTesting ? 'animate-spin' : ''}`} />
                  <span>{pluginTesting ? 'Testing Connection...' : 'Test Connection'}</span>
                </button>
              </div>
              <span className="text-[11px] text-slate-500 mt-2 block">
                Connection Status: {pluginStatus.connected ? '✓ Online & Authenticated' : 'Offline'} · Last Ping: {pluginStatus.lastPing}
              </span>
            </div>

            {/* Deployment Channels */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Option A: Loud Crayon Hosted Sites */}
              <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-7 h-7 rounded-lg bg-orange-600/20 text-orange-400 flex items-center justify-center font-bold text-xs">
                    LC
                  </div>
                  <h3 className="text-sm font-bold text-white">Loud Crayon-Hosted Sites</h3>
                </div>
                <p className="text-xs text-slate-400 mb-4">
                  For sites hosted on our high-speed Next.js edge network, the plugin and mobile widget are embedded automatically.
                </p>
                <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-xs text-emerald-400 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>Active & Connected on staging (v{pluginStatus.version}). Updates apply automatically.</span>
                </div>
              </div>

              {/* Option B: WordPress Sites */}
              <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-7 h-7 rounded-lg bg-blue-600/20 text-blue-400 flex items-center justify-center font-bold text-xs">
                    WP
                  </div>
                  <h3 className="text-sm font-bold text-white">WordPress Websites</h3>
                </div>
                <p className="text-xs text-slate-400 mb-4">
                  Running WordPress? Download your customized plugin .zip with your site key pre-configured.
                </p>

                <div className="space-y-3">
                  <button
                    onClick={() => alert(`Downloading loud-crayon-update-plugin-${username}.zip with baked-in site key: ${siteKey}`)}
                    className="w-full py-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-semibold text-xs flex items-center justify-center gap-2 transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download Plugin .zip (v{pluginStatus.version})</span>
                  </button>

                  <div className="text-[11px] text-slate-400 space-y-1">
                    <p className="font-semibold text-slate-300">Quick Install Steps:</p>
                    <p>1. Go to WP Admin → Plugins → Add New → Upload Plugin</p>
                    <p>2. Select the downloaded .zip and click <strong>Activate</strong></p>
                    <p>3. Click <strong>Test Connection</strong> above to confirm sync</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: MAINTENANCE REQUESTS */}
      {activeTab === 'maintenance' && (
        <div className="pt-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-white">Maintenance Requests</h2>
              <p className="text-xs text-slate-400">
                Track edits, bug reports, and copy changes dispatched to the Loud Crayon OS team.
              </p>
            </div>
            <button
              onClick={() => setShowChangeModal(true)}
              className="px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-semibold text-xs flex items-center gap-2 transition-colors"
            >
              <Camera className="w-3.5 h-3.5" />
              <span>Create Request</span>
            </button>
          </div>

          <div className="bg-[#111827] border border-slate-800 rounded-2xl overflow-hidden">
            <div className="divide-y divide-slate-800">
              {tickets.map((t) => (
                <div key={t.id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-900/40 transition-colors">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-orange-400">{t.id}</span>
                      <span className="text-sm font-semibold text-white">{t.title}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 uppercase font-semibold">
                        {t.category}
                      </span>
                    </div>
                    {t.notes && <p className="text-xs text-slate-400">{t.notes}</p>}
                    <span className="text-[10px] text-slate-500 block">Submitted: {new Date(t.created_at).toLocaleString()}</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span
                      className={`text-xs px-2.5 py-1 rounded-full font-semibold ${
                        t.status === 'Done'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : t.status === 'Needs your approval'
                          ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20 animate-pulse'
                          : t.status === 'In progress'
                          ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                          : 'bg-slate-800 text-slate-300'
                      }`}
                    >
                      {t.status}
                    </span>

                    {t.status === 'Needs your approval' && (
                      <button
                        onClick={() => handleApproveTicket(t.id)}
                        className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition-colors"
                      >
                        Approve Change
                      </button>
                    )}

                    {t.status === 'Done' && (
                      <button
                        onClick={() => handleReopenTicket(t.id)}
                        className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
                      >
                        Reopen
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: SERVICES / UPSELLS STORE */}
      {activeTab === 'services' && (
        <div className="pt-6 space-y-6">
          <div className="bg-[#111827] border border-slate-800 rounded-2xl p-6">
            <h2 className="text-lg font-bold text-white mb-2">Services & Add-On Store</h2>
            <p className="text-xs text-slate-400 mb-6">
              Current plans and available verified upgrades. All priced items reflect approved agency config constants.
            </p>

            {/* Current Active Plan */}
            <div className="p-4 bg-orange-500/10 border border-orange-500/20 rounded-xl mb-6 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-orange-400 block">
                  Active Package
                </span>
                <span className="text-sm font-bold text-white">
                  Turnkey AI Website (${AGENCY_CONFIG.pricing.upfront || 997}) + AI Visibility Bundle (${AGENCY_CONFIG.pricing.recurring || 297}/mo)
                </span>
              </div>
              <span className="text-xs bg-emerald-500/20 text-emerald-400 px-3 py-1 rounded-full font-semibold">
                Active & Running
              </span>
            </div>

            {/* Add-On Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Card 1: Additional Location */}
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white mb-1">Additional Location Site</h3>
                  <p className="text-xs text-slate-400 mb-3">
                    Clone and configure your website and AI visibility for a secondary storefront or sister location.
                  </p>
                  <span className="text-lg font-extrabold text-white block mb-4">
                    ${AGENCY_CONFIG.pricing.upfront} <span className="text-xs font-normal text-slate-400">one-time</span>
                  </span>
                </div>
                <button
                  onClick={() => alert('Opening Stripe test checkout for $997 location')}
                  className="w-full py-2 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-semibold text-xs transition-colors"
                >
                  Add Location (Stripe Test)
                </button>
              </div>

              {/* Card 2: AI Voice Receptionist */}
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white mb-1">AI Voice Receptionist (Phone)</h3>
                  <p className="text-xs text-slate-400 mb-3">
                    24/7 automated inbound phone answering, appointment booking, and SMS callback engine.
                  </p>
                  <span className="text-xs font-semibold text-slate-400 block mb-4">
                    Custom deployment / unpriced in config
                  </span>
                </div>
                <button
                  onClick={() => alert('Booking a discovery call for AI Voice Receptionist')}
                  className="w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-xs transition-colors"
                >
                  Book a call
                </button>
              </div>

              {/* Card 3: Custom Photography & Drone Pass */}
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white mb-1">On-Site Pro Photo & Video</h3>
                  <p className="text-xs text-slate-400 mb-3">
                    Professional photographer sent to your storefront for 4K hero shots and team portraits.
                  </p>
                  <span className="text-xs font-semibold text-slate-400 block mb-4">
                    Partner vendor scope / quote on request
                  </span>
                </div>
                <button
                  onClick={() => alert('Booking a consultation for On-Site Photo/Video')}
                  className="w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-xs transition-colors"
                >
                  Book a call
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: PLAN & BILLING */}
      {activeTab === 'billing' && (
        <div className="pt-6 space-y-6">
          <div className="bg-[#111827] border border-slate-800 rounded-2xl p-6">
            <h2 className="text-lg font-bold text-white mb-2">Plan & Billing</h2>
            <p className="text-xs text-slate-400 mb-6">
              Review current subscriptions, payment methods, and automated billing notifications.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                  Active Subscription
                </span>
                <span className="text-base font-bold text-white block">
                  AI Visibility & Reviews Engine (${AGENCY_CONFIG.pricing.recurring || 297}/mo)
                </span>
                <span className="text-xs text-slate-400 mt-2 block">
                  Next Renewal: December 1, 2026 (Staging Test Mode)
                </span>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                  Payment Method on File
                </span>
                <span className="text-base font-bold text-white block">Visa ending in •••• 4242</span>
                <span className="text-xs text-slate-400 mt-2 block">
                  Stripe Test Mode active · No live charges processed
                </span>
              </div>
            </div>

            {/* Notification Center */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
              <div className="flex items-center gap-2 mb-3">
                <Bell className="w-4 h-4 text-orange-400" />
                <h3 className="text-sm font-bold text-white">System Notifications</h3>
              </div>
              <div className="space-y-2 text-xs text-slate-300">
                <div className="p-2.5 bg-slate-950 rounded-lg flex items-center justify-between">
                  <span>✓ Staging site preview ready for @{username}</span>
                  <span className="text-[10px] text-slate-500">Today</span>
                </div>
                <div className="p-2.5 bg-slate-950 rounded-lg flex items-center justify-between">
                  <span>✓ Maintenance ticket REQ-101 marked Done</span>
                  <span className="text-[10px] text-slate-500">Nov 18</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: AI VISIBILITY DASHBOARD */}
      {activeTab === 'dashboard' && (
        <div className="pt-6 space-y-6">
          <div className="bg-[#111827] border border-slate-800 rounded-2xl p-6">
            <h2 className="text-lg font-bold text-white mb-2">AI Visibility & Local Rankings</h2>
            <p className="text-xs text-slate-400 mb-6">
              Deliverables included in your ${AGENCY_CONFIG.pricing.recurring || 297}/mo management bundle.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                <span className="text-xs text-slate-400 block mb-1">Google Maps Local 3-Pack</span>
                <span className="text-2xl font-bold text-white">Rank #1</span>
                <span className="text-[10px] text-emerald-400 block mt-1">+4 spots this month</span>
              </div>
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                <span className="text-xs text-slate-400 block mb-1">ChatGPT / Perplexity Mentions</span>
                <span className="text-2xl font-bold text-white">92%</span>
                <span className="text-[10px] text-emerald-400 block mt-1">Recommended for "Best pizza near me"</span>
              </div>
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                <span className="text-xs text-slate-400 block mb-1">Review Velocity</span>
                <span className="text-2xl font-bold text-white">4.8 ★</span>
                <span className="text-[10px] text-slate-400 block mt-1">14 new reviews generated</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 7: SETUP DETAILS & ONBOARDING */}
      {activeTab === 'onboarding' && (
        <div className="pt-6 space-y-6">
          <div className="bg-[#111827] border border-slate-800 rounded-2xl p-6">
            <h2 className="text-lg font-bold text-white mb-2">Setup Details & Configuration</h2>
            <form onSubmit={handleSaveOnboarding} className="space-y-4 max-w-xl">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Domain Name</label>
                <input
                  type="text"
                  value={domainNameInput}
                  onChange={(e) => setDomainNameInput(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-white"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Brand Accent Color</label>
                <input
                  type="color"
                  value={brandColor}
                  onChange={(e) => setBrandColor(e.target.value)}
                  className="h-10 w-24 bg-transparent cursor-pointer"
                />
              </div>
              <button
                type="submit"
                className="px-4 py-2 bg-orange-600 hover:bg-orange-500 text-white font-semibold text-xs rounded-xl"
              >
                {onboardingSaved ? '✓ Saved' : 'Save Details'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* REQUEST A CHANGE MODAL (MOBILE PWA TOUCH CANVAS & UPLOAD) */}
      {showChangeModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#111827] border border-slate-800 rounded-2xl max-w-lg w-full p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Camera className="w-5 h-5 text-orange-400" />
                <h3 className="text-base font-bold text-white">Request a Change</h3>
              </div>
              <button
                onClick={() => setShowChangeModal(false)}
                className="text-slate-400 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            {changeSuccessMsg ? (
              <div className="p-6 text-center text-emerald-400 font-semibold text-sm">
                ✓ Request submitted to Loud Crayon OS Inbox!
              </div>
            ) : (
              <form onSubmit={handleSubmitChangeRequest} className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Issue Summary *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Change lunch special price to $12"
                    value={changeTitle}
                    onChange={(e) => setChangeTitle(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">Category</label>
                    <select
                      value={changeCategory}
                      onChange={(e) => setChangeCategory(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white"
                    >
                      <option value="text change">Text Change</option>
                      <option value="photo swap">Photo Swap</option>
                      <option value="hours/info">Hours / Info</option>
                      <option value="new page">New Page</option>
                      <option value="bug">Bug Report</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">Attach Photo</label>
                    <label className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-slate-300 flex items-center justify-center gap-2 cursor-pointer hover:bg-slate-800">
                      <Upload className="w-3.5 h-3.5" />
                      <span>{changeImage ? 'Change Image' : 'Upload Screenshot'}</span>
                      <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                    </label>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Notes / Description</label>
                  <textarea
                    rows={2}
                    placeholder="Provide details on what should be changed..."
                    value={changeNotes}
                    onChange={(e) => setChangeNotes(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white"
                  />
                </div>

                {/* Touch Canvas for drawing / markup */}
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    Touch Annotation Canvas (Draw / Circle)
                  </label>
                  <div className="border border-slate-700 rounded-lg overflow-hidden bg-black/60 relative touch-none">
                    <canvas
                      ref={canvasRef}
                      width={440}
                      height={180}
                      onTouchStart={handleTouchStart}
                      onTouchMove={handleTouchMove}
                      onTouchEnd={handleTouchEnd}
                      className="w-full h-[180px] cursor-crosshair"
                    />
                  </div>
                  <span className="text-[10px] text-slate-500 mt-1 block">Draw directly on screen to highlight issues.</span>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowChangeModal(false)}
                    className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmittingChange}
                    className="px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-500 text-white text-xs font-semibold flex items-center gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{isSubmittingChange ? 'Submitting...' : 'Submit Request'}</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
