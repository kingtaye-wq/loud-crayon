'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Sparkles, Terminal, UserCheck, ShieldAlert, ArrowRight } from 'lucide-react';
import { AGENCY_CONFIG } from '@/config/agency';

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (selectedUser: string) => {
    const cleanUser = selectedUser.trim().toLowerCase();

    if (!cleanUser) {
      setError('Please enter a username.');
      return;
    }

    if (cleanUser === 'loudcrayon' || cleanUser === 'admin') {
      localStorage.setItem('lc_username', 'loudcrayon');
      localStorage.setItem('lc_role', 'admin');
      router.push('/os');
    } else {
      localStorage.setItem('lc_username', cleanUser);
      localStorage.setItem('lc_role', 'client');
      router.push('/app');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl relative">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-orange-500/10 border border-orange-500/20 text-orange-400 flex items-center justify-center mx-auto mb-4">
            <Sparkles className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Username Login</h1>
          <p className="mt-1 text-xs text-slate-400">
            Loud Crayon AI Agency System · Staging Access
          </p>
        </div>

        {/* Locked Decision Notice */}
        <div className="mb-6 p-3.5 rounded-xl bg-slate-800/80 border border-slate-700/80 text-[11px] text-slate-300 flex items-start gap-2.5">
          <ShieldAlert className="w-4 h-4 text-orange-400 flex-shrink-0 mt-0.5" />
          <span>
            <strong>Staging Policy:</strong> Identified by <strong>username only</strong>. No email verification, magic link, OAuth, or SSO gates exist in this build.
          </span>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs">
            {error}
          </div>
        )}

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleLogin(username);
          }}
          className="space-y-4"
        >
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Username
            </label>
            <input
              type="text"
              required
              placeholder="e.g. loudcrayon or testclient"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 transition-colors"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white font-bold text-sm transition-all shadow-lg shadow-orange-600/30 flex items-center justify-center gap-2"
          >
            <span>Continue to Portal</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Fast-Track Demo Buttons */}
        <div className="mt-8 pt-6 border-t border-slate-800 space-y-2">
          <span className="text-[11px] uppercase tracking-wider font-bold text-slate-500 block mb-2">
            One-Click Staging Logins
          </span>

          <button
            type="button"
            onClick={() => handleLogin('loudcrayon')}
            className="w-full p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-left text-xs text-slate-200 border border-slate-700 flex items-center justify-between group transition-colors"
          >
            <div className="flex items-center gap-2">
              <Terminal className="w-4 h-4 text-orange-400" />
              <div>
                <span className="font-bold text-white block">loudcrayon (Admin OS)</span>
                <span className="text-[10px] text-slate-400">Leads, Build Queue, Pipeline, Feedback</span>
              </div>
            </div>
            <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-white" />
          </button>

          <button
            type="button"
            onClick={() => handleLogin('testclient')}
            className="w-full p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-left text-xs text-slate-200 border border-slate-700 flex items-center justify-between group transition-colors"
          >
            <div className="flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-amber-400" />
              <div>
                <span className="font-bold text-white block">testclient (Client App)</span>
                <span className="text-[10px] text-slate-400">Cleveland Pizza Co. Portal & AI Dash</span>
              </div>
            </div>
            <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-white" />
          </button>
        </div>
      </div>
    </div>
  );
}
