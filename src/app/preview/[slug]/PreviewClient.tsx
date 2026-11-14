'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  Phone,
  MapPin,
  Clock,
  Star,
  CheckCircle2,
  Calendar,
  MessageSquare,
  ShieldCheck,
  Send,
  X,
  ExternalLink,
} from 'lucide-react';
import { ScoredPlaceLead } from '@/lib/placesApi';
import { AGENCY_CONFIG } from '@/config/agency';

export default function PreviewClient({ lead }: { lead: ScoredPlaceLead }) {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<
    { sender: 'bot' | 'user'; text: string; time: string }[]
  >([
    {
      sender: 'bot',
      text: `👋 Hi! I'm the Loud Crayon AI preview assistant. We built this custom website for ${lead.business_name} using your real Google reviews and photos. How can I help you?`,
      time: 'Just now',
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [quoteSubmitted, setQuoteSubmitted] = useState(false);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const userText = inputMessage.trim();
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    setChatMessages((prev) => [...prev, { sender: 'user', text: userText, time: now }]);
    setInputMessage('');

    // Automated Contextual Bot Response
    setTimeout(() => {
      let reply = `Thanks for asking! Loud Crayon launches this complete site for ${lead.business_name} for ${AGENCY_CONFIG.pricing.upfrontFormatted} turnkey (including custom domain setup and hosting). Would you like to schedule a quick 15-minute walkthrough call with our team?`;

      if (/price|cost|how much|fee/i.test(userText)) {
        reply = `Our turnkey launch is ${AGENCY_CONFIG.pricing.upfrontFormatted} one-time. If you want ongoing Google Map Pack SEO, ChatGPT visibility, and automated review collection, our monthly retainer is ${AGENCY_CONFIG.pricing.recurringFormatted}/mo.`;
      } else if (/domain|hosting|live|launch/i.test(userText)) {
        reply = `We can connect your existing domain or set up a brand new one. Once you approve the site on your walkthrough call, we publish it live within 24 hours!`;
      } else if (/yes|book|schedule|call|talk/i.test(userText)) {
        reply = `Awesome! Tap the "Book Walkthrough" button at the top to pick a 15-minute slot that works for you.`;
        setIsBookingOpen(true);
      }

      setChatMessages((prev) => [...prev, { sender: 'bot', text: reply, time: now }]);
    }, 600);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col relative selection:bg-orange-500 selection:text-white">
      {/* ─── Top Staging Preview Sticky Banner ─────────────────────────────── */}
      <div className="sticky top-16 z-30 bg-gradient-to-r from-orange-950 via-slate-900 to-amber-950 border-b border-orange-500/30 px-4 py-2.5 shadow-md">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-semibold text-white">
              Live Staging Preview for <span className="underline decoration-orange-400 underline-offset-2">{lead.business_name}</span>
            </span>
            <span className="text-slate-400 hidden md:inline">· Unlisted & Noindex</span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              onClick={() => setIsBookingOpen(true)}
              className="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-medium transition-colors flex items-center gap-1.5"
            >
              <Calendar className="w-3.5 h-3.5 text-orange-400" />
              <span>Book Walkthrough</span>
            </button>
            <Link
              href={`/app?claim=${lead.slug}`}
              className="px-4 py-1.5 rounded-lg bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white font-bold transition-all shadow-md flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Claim for {AGENCY_CONFIG.pricing.upfrontFormatted}</span>
            </Link>
          </div>
        </div>
      </div>

      {/* ─── Business Website Hero ────────────────────────────────────────── */}
      <header className="relative bg-slate-900 border-b border-slate-800/80 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs font-semibold mb-4">
              <span>{lead.category}</span>
              <span>·</span>
              <span>{lead.geography}</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
              {lead.business_name}
            </h1>

            <p className="mt-4 text-sm sm:text-base text-slate-300 leading-relaxed">
              Greater Cleveland&apos;s trusted choice for premium {lead.category.toLowerCase()}. Backed by verified 5-star customer reviews, skilled local craftsmanship, and dedicated neighborhood service.
            </p>

            {/* Google Rating Badge */}
            <div className="mt-6 flex items-center gap-3 p-3 rounded-2xl bg-slate-800/80 border border-slate-700/80 max-w-sm">
              <div className="flex items-center text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <div className="text-xs">
                <span className="font-bold text-white">{lead.google_rating} / 5.0</span>
                <span className="text-slate-400 ml-1.5">({lead.review_count} Google Reviews)</span>
              </div>
            </div>

            {/* Quick Contact Buttons */}
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <a
                href={`tel:${lead.phone}`}
                className="px-5 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-semibold text-xs transition-colors flex items-center gap-2 shadow"
              >
                <Phone className="w-4 h-4" />
                <span>Call {lead.phone}</span>
              </a>
              <a
                href="#quote"
                className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-xs transition-colors"
              >
                Request Free Quote
              </a>
            </div>
          </div>

          {/* Primary Featured Photo */}
          <div className="relative rounded-3xl overflow-hidden border border-slate-700/80 shadow-2xl aspect-video lg:aspect-auto lg:h-[380px]">
            {lead.photos[0] ? (
              <img
                src={lead.photos[0].url}
                alt={lead.photos[0].caption || lead.business_name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-slate-800 flex items-center justify-center text-slate-500">
                <span>Featured Business Image</span>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-6">
              <span className="text-xs text-slate-200 font-medium">
                {lead.photos[0]?.caption || `${lead.business_name} in ${lead.geography}`}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* ─── Services Section ─────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-xs uppercase font-bold tracking-widest text-orange-400">Our Offerings</h2>
          <p className="mt-2 text-2xl sm:text-3xl font-extrabold text-white">Services & Specialties</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {lead.services.map((svc, idx) => (
            <div
              key={idx}
              className="p-6 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-colors"
            >
              <div className="w-8 h-8 rounded-lg bg-orange-500/10 text-orange-400 flex items-center justify-center mb-3">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <h3 className="text-base font-bold text-white">{svc}</h3>
              <p className="mt-2 text-xs text-slate-400 leading-relaxed">
                Custom tailored for {lead.business_name} clients with transparent pricing, fast turnaround, and guaranteed satisfaction.
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── Verified Google Reviews ──────────────────────────────────────── */}
      <section className="bg-slate-900/60 border-y border-slate-800/80 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between mb-12 gap-4">
            <div>
              <h2 className="text-xs uppercase font-bold tracking-widest text-orange-400">Social Proof</h2>
              <p className="mt-1 text-2xl sm:text-3xl font-extrabold text-white">Verified Customer Reviews</p>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Imported directly from Google Places</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {lead.reviews.map((rev, idx) => (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center text-amber-400 mb-3">
                    {[...Array(rev.rating || 5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="text-xs text-slate-300 italic leading-relaxed">&ldquo;{rev.text}&rdquo;</p>
                </div>
                <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-500">
                  <span className="font-semibold text-slate-300">{rev.author}</span>
                  <span>{rev.time || 'Verified Google Review'}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Photos Gallery ───────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="text-xs uppercase font-bold tracking-widest text-orange-400">Visual Tour</h2>
          <p className="mt-1 text-2xl font-extrabold text-white">Gallery & Recent Work</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {lead.photos.map((photo, idx) => (
            <div
              key={idx}
              className="rounded-2xl overflow-hidden border border-slate-800 aspect-video relative group"
            >
              <img
                src={photo.url}
                alt={photo.caption || 'Gallery photo'}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              {photo.caption && (
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex items-end p-4">
                  <span className="text-xs text-slate-200">{photo.caption}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ─── Contact & Location Info ─────────────────────────────────────── */}
      <section id="quote" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-slate-800">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div>
            <h2 className="text-xs uppercase font-bold tracking-widest text-orange-400">Location & Hours</h2>
            <p className="mt-1 text-3xl font-extrabold text-white">Visit or Contact Us</p>

            <div className="mt-8 space-y-4 text-xs text-slate-300">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-orange-400 flex-shrink-0 mt-0.5" />
                <span>{lead.address}</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-orange-400 flex-shrink-0" />
                <span>{lead.phone}</span>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="w-4 h-4 text-orange-400 flex-shrink-0" />
                <span>Mon – Sat: 9:00 AM – 7:00 PM · Sun: Closed</span>
              </div>
            </div>
          </div>

          {/* Instant Quote Form */}
          <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800">
            <h3 className="text-lg font-bold text-white mb-2">Request an Estimate</h3>
            <p className="text-xs text-slate-400 mb-6">
              Send a direct message to {lead.business_name} for pricing and scheduling.
            </p>

            {quoteSubmitted ? (
              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs">
                ✅ Thank you! Your inquiry has been dispatched to {lead.business_name}.
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setQuoteSubmitted(true);
                }}
                className="space-y-4 text-xs"
              >
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Your Name</label>
                  <input
                    type="text"
                    required
                    placeholder="Jane Doe"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Phone or Email</label>
                  <input
                    type="text"
                    required
                    placeholder="(216) 555-0100"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Service Requested</label>
                  <input
                    type="text"
                    placeholder="Details about your inquiry..."
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-orange-500"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold transition-all shadow-md"
                >
                  Send Inquiry
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* ─── On-Page Chat Assistant Widget (Bottom Right) ──────────────────── */}
      <div className="fixed bottom-5 right-5 z-40">
        {!isChatOpen ? (
          <button
            onClick={() => setIsChatOpen(true)}
            className="flex items-center gap-2.5 px-4 py-3 rounded-full bg-gradient-to-r from-orange-600 to-amber-600 text-white font-bold text-xs shadow-2xl hover:scale-105 transition-transform"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Chat with Loud Crayon AI</span>
          </button>
        ) : (
          <div className="w-[340px] sm:w-[380px] h-[480px] bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl flex flex-col overflow-hidden backdrop-blur-xl">
            {/* Chat Header */}
            <div className="bg-slate-800/90 px-4 py-3 border-b border-slate-700/80 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-orange-500/20 text-orange-400 flex items-center justify-center">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold text-white block">Loud Crayon AI Assistant</span>
                  <span className="text-[10px] text-emerald-400 block">● Live On Preview</span>
                </div>
              </div>
              <button
                onClick={() => setIsChatOpen(false)}
                className="text-slate-400 hover:text-white text-sm"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Chat Body */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3 text-xs">
              {chatMessages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex flex-col ${
                    msg.sender === 'user' ? 'items-end' : 'items-start'
                  }`}
                >
                  <div
                    className={`max-w-[85%] p-3 rounded-2xl ${
                      msg.sender === 'user'
                        ? 'bg-orange-600 text-white rounded-br-none'
                        : 'bg-slate-800 text-slate-200 rounded-bl-none border border-slate-700/60'
                    }`}
                  >
                    {msg.text}
                  </div>
                  <span className="text-[10px] text-slate-500 mt-1 px-1">{msg.time}</span>
                </div>
              ))}
            </div>

            {/* Chat Input */}
            <form onSubmit={handleSendMessage} className="p-3 bg-slate-950 border-t border-slate-800 flex gap-2">
              <input
                type="text"
                placeholder="Ask about pricing, custom domain, launch..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-orange-500"
              />
              <button
                type="submit"
                className="p-2 rounded-xl bg-orange-600 hover:bg-orange-500 text-white transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        )}
      </div>

      {/* ─── Walkthrough Booking Modal ─────────────────────────────────────── */}
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

            <h3 className="text-xl font-bold text-white">Review Your Site for {lead.business_name}</h3>
            <p className="mt-1 text-xs text-slate-400">
              Walk through this exact staging preview with our team, approve revisions, and launch for {AGENCY_CONFIG.pricing.upfrontFormatted}.
            </p>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                alert(`Appointment confirmed! We'll call ${lead.phone} at your requested time.`);
                setIsBookingOpen(false);
              }}
              className="mt-6 space-y-4 text-xs"
            >
              <div>
                <label className="block text-slate-300 font-medium mb-1">Your Name</label>
                <input
                  type="text"
                  required
                  placeholder="Owner / Manager Name"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-orange-500"
                />
              </div>
              <div>
                <label className="block text-slate-300 font-medium mb-1">Phone Number for Call</label>
                <input
                  type="text"
                  required
                  defaultValue={lead.phone}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-orange-500"
                />
              </div>
              <div>
                <label className="block text-slate-300 font-medium mb-1">Preferred Time</label>
                <select className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-orange-500">
                  <option>Tomorrow at 10:00 AM EST</option>
                  <option>Tomorrow at 2:00 PM EST</option>
                  <option>Next Business Day at 11:30 AM EST</option>
                </select>
              </div>
              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold transition-all shadow-md"
              >
                Confirm Walkthrough Call
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
