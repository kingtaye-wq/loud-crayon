# Loud Crayon — Amendment 2026-11-18 (Alex)
Supersedes the parts of the 2026-11-13 spec noted below. Everything not changed here stays in force (staging-first, username-for-now, no cold SMS, Places API only, RLS day one, $997/$297 as config).

## Status it amends
- recessOS #104 was the DISPATCH BOARD only. Antigravity handed off 2026-11-14 (comment 6870079762): repo kingtaye-wq/loud-crayon, staging https://loud-crayon.vercel.app (still live 2026-11-18, 200, noindex), Supabase iwtqkzcwfiertrlhvkhn with lc_agency_* tables, /app, /os, extension/ with manifest host_permissions <all_urls>.
- Dre's full live verification of that handoff was never completed — #104 is still OPEN. This amendment is verified together with the original build, not instead of it.
- Code search 2026-11-18: no maintenance / plugin / upsell modules exist in kingtaye-wq/loud-crayon yet. They are new work below.

## 1. Screenshot tool: Loud Crayon sites ONLY (Alex, 2026-11-18)
Yes — restrict it. It must only allow editing/feedback on Loud Crayon websites.
- Extension: REMOVE `<all_urls>` from host_permissions and content_scripts matches in extension/manifest.json. Replace with an allowlist.
- Allowlist source of truth = Loud Crayon OS client registry: loudcrayon-owned domains (loudcrayon.com, loudcrayon.co, loud-crayon.vercel.app + preview subdomains) PLUS every active client's registered domain in lc_agency_clients. Extension checks the OS endpoint (e.g. /api/feedback/allowlist, cached, username-authenticated) before activating; on a non-Loud-Crayon site the popup shows a disabled "Not a Loud Crayon website" state and captures nothing.
- Widget / update plugin: server validates a per-client site key + origin against the same registry on every submission; /api/feedback rejects any origin/key not registered. CORS allowlist = registry only.
- Permissions scoping: a client admin can only create/view requests for their own site(s); Loud Crayon staff usernames can act across all Loud Crayon sites. Requests can never target a non-Loud-Crayon URL.
- Benefits to note in handoff: narrower Chrome Web Store permission justification, no accidental capture of banking/personal pages, requests automatically route to the right client/site in the OS.

## 2. Mobile: available on phones (Alex, 2026-11-18)
Chrome extensions do not run on iOS Safari/Chrome and do not run on Android Chrome — do NOT try to ship the extension as the mobile answer. Build these instead, all feeding the same Feedback / Maintenance queue in Loud Crayon OS:
- **Client App as an installable PWA** (manifest + service worker, Add to Home Screen, mobile-first). In the app: My Website → "Request a change" → upload a screenshot from the photo library or take a photo, OR capture the in-app site preview, then annotate on a touch canvas (draw, arrow, text pin), add a note/category, submit.
- **In-site mobile widget:** when a client admin (username session) opens their own Loud Crayon site on a phone, the update plugin shows a floating "Request edit" button with the same capture/annotate/submit flow (upload fallback where in-page capture is blocked by the mobile browser).
- Same /api/feedback endpoint, same site-key + allowlist validation as §1. Acceptance includes a real phone pass (Alex's phone is final acceptance for visual work — state device/browser tested).

## 3. Home is Loud Crayon OS, not RecessOS (Alex, 2026-11-18)
- All product code lives ONLY in kingtaye-wq/loud-crayon: the OS is loud-crayon /os, its data is the Loud Crayon Supabase (lc_agency_*), the client app is loud-crayon /app.
- Do NOT build any of this into RecessOS code, the Recess app, or Recess Supabase. recessOS #104 remains only the shared dispatch/tracking board (the same way 3J and Mic Map were tracked there) — if tracking must move, mirror the work as an issue in kingtaye-wq/loud-crayon and link it from #104.
- New modules below appear in Loud Crayon OS (staff view) AND the Loud Crayon client app (client view of their own data only, RLS-scoped).

## 4. Client-facing App — expanded (Alex, 2026-11-18)
The current /app (preview/approve, Stripe test, onboarding, visibility dashboard) is the starting point. Add:
1. **My Website hub** — embedded live view of their actual site + open-in-new-tab, site status (live/staging, domain, last updated, last plugin ping), quick links to preview vs live.
2. **Install the Update Plugin** — a dedicated page in the app:
   - Shows the client's unique plugin + site key (never another client's).
   - Loud Crayon-hosted sites: plugin embedded automatically — show Connected / version / last ping status, with an Enable/Update action.
   - WordPress sites: downloadable plugin .zip generated for that client (site key baked in or entered on activation), step-by-step install (WP Admin → Plugins → Add New → Upload → Activate → confirm connection in the app), connection test button.
   - The plugin is the vehicle for §1/§2: screenshot feedback + maintenance requests from inside their site, plus update notices.
3. **Maintenance Requests** — the client view of the screenshot system: create a request (screenshot/photo + annotation + category: text change, photo swap, hours/info, new page, bug, other), list their requests with status (Received → In progress → Needs your approval → Done), approve/reopen a completed change, full history. Staff side = the same tickets in Loud Crayon OS Feedback/Maintenance inbox.
4. **Services / Upsells** — a services store in the app: current plan first (what they already have), then available add-ons as cards from CONFIG (existing config constants are $997 site + $297/mo bundle; do not invent new prices — any add-on without an Alex-approved price shows "Book a call" not a made-up price). Each card: what it is, monthly/one-time if priced in config, Add / Book-a-call CTA, Stripe test-mode checkout stub where priced. Active add-ons show in My Website / Plan.
5. **Plan & Billing + Notifications** — current plan, add-ons, next renewal (test data labelled as such on staging), and in-app notifications when a maintenance request changes status or a preview/update is ready.

## Acceptance criteria (amendment)
- [ ] extension/manifest.json contains no `<all_urls>`; extension activates only on allowlisted Loud Crayon domains and shows the disabled state elsewhere (demo on one allowed + one non-allowed site)
- [ ] /api/feedback rejects a submission from an unregistered origin/site key (test shown) and accepts one from a registered client site
- [ ] PWA installs from a phone browser; a maintenance request with an annotated uploaded screenshot is created on a phone and appears in Loud Crayon OS
- [ ] No code for any of this lands in RecessOS / Recess repos; all code in kingtaye-wq/loud-crayon; tracking mirrored in a loud-crayon repo issue linked from recessOS #104
- [ ] Client app: My Website hub, Plugin install page (hosted status + WP .zip download + connection test), Maintenance Requests (create/list/approve), Services/Upsells (config prices only), Plan/Notifications — all working on staging with the testclient username, scoped to that client's site only
- [ ] Original #104 verification completed alongside: username login, preview engine, OS pipeline, RLS — Dre verifies live (desktop + mobile) before Alex is asked to close
