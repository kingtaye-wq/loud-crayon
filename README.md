# Loud Crayon — AI Agency System for Local Businesses

> **"AI Websites, Google Rankings & AI Visibility for Local Businesses"**  
> Turnkey Model: **\$997 upfront launch** + **\$297/mo recurring AI visibility & rankings**  
> Brand: `@loudcrayon` · Staging: `https://loud-crayon-staging.vercel.app`

---

## 1. Overview & System Components

Loud Crayon is an end-to-end AI agency operational system inspired by Oliver (@oliverr.builds) and architected for high-converting local service acquisition in the Greater Cleveland / Northeast Ohio pilot band.

The system delivers 4 tightly integrated pillars:

```
┌────────────────────────────────────────────────────────────────────────┐
│                        LOUD CRAYON AI AGENCY SYSTEM                    │
├───────────────────┬───────────────────┬────────────────────────────────┤
│ 1. Marketing Site │ 2. Preview Engine │ 3. Client App                  │
│    (/)            │    (/preview/*)   │    (/app)                      │
│ - Instant demo    │ - Auto-scouted    │ - Site approval flow           │
│ - $997/$297 cards │ - Real reviews    │ - Stripe test checkout ($997)  │
│ - Flywheel & FAQs │ - 24/7 AI chat    │ - Onboarding agents            │
│ - Booking modal   │ - Noindex locked  │ - AI Visibility / Rank dash    │
├───────────────────┴───────────────────┴────────────────────────────────┤
│ 4. Loud Crayon OS (/os)                                                │
│ - Activity vs. Revenue Scorecard ($997 upfront & $297/mo separate)     │
│ - Google Places Lead Engine & Scoring (missing web = prime prospect)   │
│ - Auto-Build Pipeline Queue with 6-point QA checklist                  │
│ - Sales Pipeline Tracker (Preview → Chat → Booked → Won)               │
│ - Userback-Style Screenshot Feedback Inbox (DOM selector + console)    │
│ - 4 Autonomous Client Onboarding Agents (GMB, DNS, Stripe, AI Concierge│
├────────────────────────────────────────────────────────────────────────┤
│ 5. Manifest V3 Chrome Extension (extension/)                           │
│ - One-click visible tab screenshot via chrome.tabs.captureVisibleTab   │
│ - DOM element inspector (hover & click to grab CSS selector)           │
│ - Instant dispatch to Loud Crayon OS Feedback Inbox (/api/feedback)    │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Alex's Locked Decisions (2026-11-13)

1. **Staging-First Architecture:**
   - Deployed on staging (`loud-crayon.vercel.app`).
   - Global `X-Robots-Tag: noindex, nofollow` headers and meta tags on all prospect preview and client routes.
   - Production domains and DNS remain completely untouched until client sign-off.

2. **Username-Only Authentication (Staging Policy):**
   - No email verification, magic links, OAuth, or SSO gates exist in this build (avoids blocked mailbox dependencies).
   - Admin Login: `loudcrayon` → routes directly to **Loud Crayon OS** (`/os`).
   - Client Login: `testclient` (or any client slug) → routes directly to **Client App** (`/app`).

3. **Configurable Pricing Constants:**
   - Turnkey Launch: `AGENCY_CONFIG.pricing.upfront` = **\$997** (one-time).
   - AI Visibility & Google Rankings: `AGENCY_CONFIG.pricing.recurring` = **\$297/mo** (recurring MRR).
   - Overridable via environment variables `NEXT_PUBLIC_UPFRONT_PRICE` and `NEXT_PUBLIC_RECURRING_PRICE`.

4. **Strict Compliance Principles:**
   - **HARD RULE: NO Cold SMS.** First touch is restricted to email and on-page preview web chat. SMS is strictly opt-in with explicit customer consent.
   - Official Google Places API only (sanctioned API, no fragile HTML scraping).
   - Prospect preview pages are unlisted, isolated, and marked `noindex`.

5. **Supabase Data Layer with Day-One RLS:**
   - Dedicated Supabase instance with 7 isolated tables (`lc_agency_*`):
     - `lc_agency_leads`: Discovered local businesses, Places IDs, ratings, and scores.
     - `lc_agency_build_queue`: Auto-generation queue with QA verification flags.
     - `lc_agency_pipeline`: Sales opportunities (activity strictly separated from revenue).
     - `lc_agency_clients`: Active client accounts, MRR, Google ranks, and AI visibility.
     - `lc_agency_onboarding`: Client onboarding submissions and 4 autonomous setup agents.
     - `lc_agency_feedback`: Screenshot bug reports with DOM selectors and console logs.
     - `lc_agency_users`: Username registry for staging access.
   - All 7 tables have Row-Level Security (RLS) enabled and verified.

6. **Feedback System:**
   - Built-in embeddable widget (`<FeedbackWidget />`) on all preview pages.
   - Companion Manifest V3 Chrome Extension (`extension/`) for internal admin inspections.

---

## 3. Getting Started

### Local Development

```bash
git clone https://github.com/kingtaye-wq/loud-crayon.git
cd loud-crayon
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application:
- Marketing Website: [http://localhost:3000](http://localhost:3000)
- Loud Crayon OS: [http://localhost:3000/os](http://localhost:3000/os)
- Client App: [http://localhost:3000/app](http://localhost:3000/app)
- Live Prospect Preview: [http://localhost:3000/preview/cleveland-pizza-co](http://localhost:3000/preview/cleveland-pizza-co)

### Chrome Extension Installation

1. Navigate to `chrome://extensions/` in Chrome or Edge.
2. Enable **Developer mode**.
3. Click **Load unpacked** and select the `extension/` folder inside this directory.

---

## 4. Verification Suite

Run the automated system test suite covering Supabase RLS, pricing constants, Chrome extension manifest, and build artifacts:

```bash
node test-system.mjs
```

---

*Loud Crayon — An AI agency operational system by the Recess team.*
