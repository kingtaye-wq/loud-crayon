'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Camera, CheckCircle2, AlertCircle, X, Crosshair, Send, Loader2 } from 'lucide-react';
import html2canvas from 'html2canvas';

export default function FeedbackWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);
  const [isSelectingElement, setIsSelectingElement] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [screenshotData, setScreenshotData] = useState<string | null>(null);
  const [elementSelector, setElementSelector] = useState<string>('');
  const [logs, setLogs] = useState<{ type: string; message: string; timestamp: string }[]>([]);

  // Intercept window console errors for debugging context
  useEffect(() => {
    const originalError = console.error;
    const originalWarn = console.warn;

    console.error = (...args: any[]) => {
      originalError.apply(console, args);
      try {
        setLogs((prev) => [
          ...prev.slice(-9),
          {
            type: 'error',
            message: args.map((a) => (typeof a === 'object' ? JSON.stringify(a) : String(a))).join(' '),
            timestamp: new Date().toISOString(),
          },
        ]);
      } catch {
        // no-op
      }
    };

    console.warn = (...args: any[]) => {
      originalWarn.apply(console, args);
      try {
        setLogs((prev) => [
          ...prev.slice(-9),
          {
            type: 'warn',
            message: args.map((a) => (typeof a === 'object' ? JSON.stringify(a) : String(a))).join(' '),
            timestamp: new Date().toISOString(),
          },
        ]);
      } catch {
        // no-op
      }
    };

    return () => {
      console.error = originalError;
      console.warn = originalWarn;
    };
  }, []);

  // Element picker logic
  const handleStartElementPicker = () => {
    setIsOpen(false);
    setIsSelectingElement(true);

    const onMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target && !target.classList.contains('lc-feedback-ignore')) {
        target.style.outline = '2px dashed #f97316';
        target.style.cursor = 'crosshair';
      }
    };

    const onMouseOut = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target) {
        target.style.outline = '';
        target.style.cursor = '';
      }
    };

    const onClick = (e: MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();

      const target = e.target as HTMLElement;
      if (target) {
        target.style.outline = '';
        target.style.cursor = '';

        // Generate element selector
        let sel = target.tagName.toLowerCase();
        if (target.id) {
          sel += `#${target.id}`;
        } else if (target.className && typeof target.className === 'string') {
          const firstClass = target.className.split(' ').filter(Boolean)[0];
          if (firstClass) sel += `.${firstClass}`;
        }
        setElementSelector(sel);
      }

      // Cleanup
      document.removeEventListener('mouseover', onMouseOver);
      document.removeEventListener('mouseout', onMouseOut);
      document.removeEventListener('click', onClick, true);
      setIsSelectingElement(false);
      setIsOpen(true);
    };

    document.addEventListener('mouseover', onMouseOver);
    document.addEventListener('mouseout', onMouseOut);
    document.addEventListener('click', onClick, true);
  };

  // Capture current viewport as screenshot
  const handleCaptureScreenshot = async () => {
    setIsCapturing(true);
    setError(null);
    try {
      // Temporarily hide feedback widget during capture
      const widgetElem = document.getElementById('lc-feedback-widget-container');
      if (widgetElem) widgetElem.style.display = 'none';

      const canvas = await html2canvas(document.body, {
        useCORS: true,
        allowTaint: true,
        logging: false,
        scale: window.devicePixelRatio > 1 ? 1 : 1, // keep reasonable resolution
        windowWidth: window.innerWidth,
        windowHeight: window.innerHeight,
      });

      if (widgetElem) widgetElem.style.display = '';

      const dataUrl = canvas.toDataURL('image/jpeg', 0.7);
      setScreenshotData(dataUrl);
    } catch (err: any) {
      console.error('Screenshot error:', err);
      setError('Could not capture screenshot automatically. You can still submit notes.');
      const widgetElem = document.getElementById('lc-feedback-widget-container');
      if (widgetElem) widgetElem.style.display = '';
    } finally {
      setIsCapturing(false);
    }
  };

  // Submit feedback to API
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Please provide a short summary/title.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    const clientUsername =
      typeof window !== 'undefined'
        ? localStorage.getItem('lc_username') || 'loudcrayon'
        : 'loudcrayon';

    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          client_username: clientUsername,
          title,
          description,
          priority,
          screenshot_url: screenshotData,
          page_url: typeof window !== 'undefined' ? window.location.href : '',
          element_selector: elementSelector || undefined,
          viewport: `${window.innerWidth}x${window.innerHeight}`,
          browser_os: navigator.userAgent,
          console_logs: logs,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Failed to submit feedback');
      }

      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setIsOpen(false);
        setTitle('');
        setDescription('');
        setScreenshotData(null);
        setElementSelector('');
      }, 2000);
    } catch (err: any) {
      setError(err.message || 'Error submitting feedback.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <aside
      aria-label="Feedback and Bug Reporting"
      id="lc-feedback-widget-container"
      className="fixed bottom-6 right-6 z-50 lc-feedback-ignore font-sans"
    >
      {/* Floating Launcher Button */}
      {!isOpen && !isSelectingElement && (
        <button
          onClick={() => {
            setIsOpen(true);
            if (!screenshotData) {
              handleCaptureScreenshot();
            }
          }}
          className="flex items-center gap-2 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white font-medium text-xs sm:text-sm px-4 py-2.5 rounded-full shadow-lg shadow-orange-500/25 border border-orange-400/30 transition-transform active:scale-95"
        >
          <Camera className="w-4 h-4" />
          <span>Report Issue / Feedback</span>
        </button>
      )}

      {/* Crosshair instruction overlay */}
      {isSelectingElement && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 bg-orange-600 text-white text-xs font-semibold px-4 py-2 rounded-full shadow-2xl flex items-center gap-2 z-50 pointer-events-none">
          <Crosshair className="w-4 h-4 animate-spin" />
          <span>Click any element on the page to target it</span>
        </div>
      )}

      {/* Feedback Dialog Modal */}
      {isOpen && (
        <div className="w-80 sm:w-96 bg-[#0E131F] border border-slate-700/80 rounded-2xl shadow-2xl p-5 text-slate-100 backdrop-blur-xl animate-in fade-in zoom-in-95 duration-150">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Camera className="w-4 h-4 text-orange-400" />
              <h3 className="font-semibold text-sm text-white">Loud Crayon Feedback</h3>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {submitted ? (
            <div className="py-8 text-center flex flex-col items-center">
              <CheckCircle2 className="w-10 h-10 text-emerald-400 mb-2 animate-bounce" />
              <p className="font-semibold text-sm text-white">Issue Logged Successfully!</p>
              <p className="text-xs text-slate-400 mt-1">
                Dispatched directly to Loud Crayon OS Feedback Inbox.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-3 space-y-3">
              {error && (
                <div className="flex items-center gap-1.5 p-2 bg-red-950/60 border border-red-800/80 rounded-lg text-[11px] text-red-300">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div>
                <label className="block text-[11px] font-semibold text-slate-300 uppercase tracking-wide mb-1">
                  Issue Summary *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Header overlap on mobile, wrong address..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-slate-900/90 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-300 uppercase tracking-wide mb-1">
                  Details / Reproduction Notes
                </label>
                <textarea
                  rows={2}
                  placeholder="What happened? What should happen instead?"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-slate-900/90 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-orange-500 resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 uppercase tracking-wide mb-1">
                    Priority
                  </label>
                  <select
                    value={priority}
                    onChange={(e: any) => setPriority(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-orange-500"
                  >
                    <option value="low">Low (Cosmetic)</option>
                    <option value="medium">Medium (Standard)</option>
                    <option value="high">High (Broken flow)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 uppercase tracking-wide mb-1">
                    Target Selector
                  </label>
                  <button
                    type="button"
                    onClick={handleStartElementPicker}
                    className="w-full bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded-lg px-2 py-1.5 text-xs text-slate-300 truncate text-left flex items-center justify-between"
                  >
                    <span className="truncate">{elementSelector || 'Pick element...'}</span>
                    <Crosshair className="w-3.5 h-3.5 text-orange-400 shrink-0 ml-1" />
                  </button>
                </div>
              </div>

              {/* Screenshot Preview */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[11px] font-semibold text-slate-300 uppercase tracking-wide">
                    Screenshot
                  </label>
                  <button
                    type="button"
                    onClick={handleCaptureScreenshot}
                    disabled={isCapturing}
                    className="text-[10px] text-orange-400 hover:text-orange-300 underline font-medium"
                  >
                    {isCapturing ? 'Snapping...' : 'Re-capture view'}
                  </button>
                </div>

                {screenshotData ? (
                  <div className="relative border border-slate-700 rounded-lg overflow-hidden bg-black/40 group max-h-24">
                    <img
                      src={screenshotData}
                      alt="Captured screenshot preview"
                      className="w-full object-cover object-top h-24 opacity-80 group-hover:opacity-100 transition-opacity"
                    />
                    <div className="absolute bottom-1 right-1 bg-black/75 px-1.5 py-0.5 rounded text-[9px] text-slate-300 font-mono">
                      {typeof window !== 'undefined' ? `${window.innerWidth}x${window.innerHeight}` : ''}
                    </div>
                  </div>
                ) : (
                  <div className="border border-dashed border-slate-700 rounded-lg p-3 text-center bg-slate-900/40">
                    <p className="text-[11px] text-slate-400">No screenshot attached</p>
                    <button
                      type="button"
                      onClick={handleCaptureScreenshot}
                      className="text-xs text-orange-400 font-semibold mt-1"
                    >
                      Capture Current Screen
                    </button>
                  </div>
                )}
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full mt-2 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white font-semibold text-xs py-2 px-4 rounded-lg shadow-md flex items-center justify-center gap-2 transition-all disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Logging to OS Inbox...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>Send to Loud Crayon OS</span>
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      )}
    </aside>
  );
}
