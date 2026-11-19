# Loud Crayon — Amendment 2 (2026-11-19, Alex): Maps-Scraper Lane for the Lead Engine, as a Free-Tier Bake-Off

Decision history: Alex asked whether Antigravity can scrape Google Maps (many IG posts do) → Dre's research (Nov 19): most posts actually run a vendor service (Apify / Outscraper) via API; DIY scraping is brittle and violates Google ToS; Maps data contains NO emails (email enrichment crawls the business's own website, so it cannot help the no-website segment). Alex first approved adding an Apify/Outscraper lane, then approved Dre's refinement: **file it as a free-tier bake-off — Apify vs Outscraper vs Scrap.io — vendor not locked.** Also considered and NOT used for this lane: Instantly SuperSearch (a B2B people database, not a Maps/local-listings source; cannot return website-status; and Alex's standing 2026-11-08 rule keeps SuperSearch off for leads research can produce — Instantly remains sanctioned for verification/enrichment of research-found contacts only).

## What to build (all code in kingtaye-wq/loud-crayon, Loud Crayon OS — per Amendment 1, nothing into RecessOS/Recess)

### 1. Vendor-agnostic scraper adapter in the Lead Engine
- One internal interface, e.g. `ScraperVendor.run({category, area, limit}) → RawPlace[]`, with three implementations behind it: `apify`, `outscraper`, `scrapio`. OS Lead Engine UI shows vendor, run status, cost, and yield per run. Adding/removing a vendor must not change downstream code.
- Normalized output fields: name, categories, address, phone, website (nullable), rating, review_count, hours, coordinates, place_id / Maps URL, open/closed flags, source_vendor, run_id, scraped_at. Raw vendor payload retained alongside for audit.
- API keys ONLY from environment/secret config (`APIFY_TOKEN`, `OUTSCRAPER_API_KEY`, `SCRAPIO_API_KEY`) — never in code, issues, or commits. With a key absent, that vendor shows "not configured" and the rest of the system works (same pattern as the Places seed-data fallback).

### 2. Scraper = discovery only; Places API = verifier of record
- Scraper results land in a STAGING state in `lc_agency_leads` (`status = scraped_unverified`, `source = scraper:<vendor>`). They NEVER enter the qualified pipeline directly.
- Promotion requires a Places API / Places connector details re-check confirming: business exists, open, independent, and website status (none / social-only / weak / real). Only then `status = qualified`. This mirrors the RFP feed rule: aggregators for discovery, original source for truth.
- Dedupe across vendors and against existing leads by place_id first, then normalized name+phone, then name+address. A shop found by 3 vendors is ONE lead with 3 source records.

### 3. The bake-off (this is the deliverable of this amendment)
- Same job for all three vendors, free tier/trial only — **no paid plan, no card, no credits purchased**: category = independent auto repair, geography = Cleveland + inner-ring tiles (same footprint as the verified pilot batch), limit = each vendor's free allowance (Apify ~$5 credit ≈ 1,250 places; Outscraper 500 free records; Scrap.io trial).
- Score every vendor against the ground truth Dre already verified: `pilot-batch-auto-repair-2026-11-19.md` (24 unique qualified shops after the Noble Rd dedupe; Touch Above and Harles flagged for reclassification) plus its 18+ rejected list.
- Scorecard per vendor, surfaced in Loud Crayon OS and in the handoff comment: (a) recall — how many of the 24 ground-truth shops found; (b) precision — false positives (chains, closed, real-website shops presented as prospects); (c) website-status accuracy vs the Places verification; (d) email yield from any bundled enrichment, counted ONLY where a website exists to crawl (expected ~0 for the no-website segment — report it, don't dress it up); (e) actual cost and projected cost per 1,000 places at the vendor's published rates; (f) run time and failure rate.
- Dre verifies the scorecard live and recommends a winner; **Alex approves any paid vendor plan.** Until then all three stay free-tier.

### 4. Explicitly out of scope
- NO DIY Google Maps scraper (no Playwright/Selenium driving maps.google.com, no proxy rotation code). Vendors carry their own infrastructure; we integrate APIs only.
- NO Instantly SuperSearch for lead discovery in this lane (see decision history). Instantly enrichment/verification of already-found contacts is a separate, already-sanctioned use — not part of this build.
- Contact enrichment add-ons stay OFF by default; enable per-vendor only as part of the bake-off measurement in §3(d).
- No outreach to any scraped business from this lane. Leads flow into the existing OS pipeline states only.

### 5. Risk note (recorded, decided)
Maps scraping by these vendors sits against Google's Terms of Service — Alex was told this plainly on 2026-11-19 and chose to add the lane with the vendor carrying the scraping infrastructure and Places API kept as the verification layer. Data stored per lead: business listing facts + source + scrape date; suppression list honored on every run.

## Acceptance criteria
- [ ] Adapter interface + all three vendor implementations in loud-crayon repo; keys from env only; missing key = graceful "not configured"
- [ ] Scraper imports land as `scraped_unverified` and cannot be promoted without a Places re-check (demo one promotion + one rejection)
- [ ] Dedupe across vendors demonstrated on the bake-off runs (one lead, multiple source records)
- [ ] Bake-off executed on free tiers only ($0 spent — state it in the handoff), scorecard for all three vendors posted in the OS and on loud-crayon #1, scored against the 24-shop ground truth
- [ ] No DIY Maps scraper code anywhere in the repo; no SuperSearch integration in this lane
- [ ] Dre verifies live before Alex is asked to pick/pay for a winner
