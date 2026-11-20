import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

test('Loud Crayon Amendment 1 & 2 Verification Suite', async (t) => {
  await t.test('1. Extension Manifest: <all_urls> removed, allowlist present', () => {
    const manifestPath = path.join(rootDir, 'extension/manifest.json');
    assert.ok(fs.existsSync(manifestPath), 'manifest.json must exist');
    const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));

    const hostPerms = manifest.host_permissions || [];
    assert.ok(!hostPerms.includes('<all_urls>'), 'host_permissions must NOT include <all_urls>');

    const contentScripts = manifest.content_scripts || [];
    for (const cs of contentScripts) {
      assert.ok(!cs.matches.includes('<all_urls>'), 'content_scripts matches must NOT include <all_urls>');
    }

    const hasAllowedDomain = hostPerms.some((p) =>
      p.includes('loudcrayon.com') || p.includes('loudcrayon.co') || p.includes('loud-crayon.vercel.app')
    );
    assert.ok(hasAllowedDomain, 'host_permissions must contain Loud Crayon allowlist domains');
  });

  await t.test('2. Extension Popup: domain restriction & disabled state for non-LC sites', () => {
    const popupJsPath = path.join(rootDir, 'extension/popup.js');
    assert.ok(fs.existsSync(popupJsPath), 'popup.js must exist');
    const content = fs.readFileSync(popupJsPath, 'utf8');
    assert.match(content, /isAllowed|checkAllowlist|allowlist/i, 'popup.js must check URL against allowlist');
    assert.match(content, /Not a Loud Crayon website/i, 'popup.js must show disabled state when site is not allowlisted');
  });

  await t.test('3. API Allowlist Endpoint: returns LC domains and client domains', () => {
    const allowlistRoutePath = path.join(rootDir, 'src/app/api/feedback/allowlist/route.ts');
    assert.ok(fs.existsSync(allowlistRoutePath), 'allowlist route must exist at /api/feedback/allowlist/route.ts');
    const content = fs.readFileSync(allowlistRoutePath, 'utf8');
    assert.match(content, /loudcrayon\.com/i, 'Allowlist must include loudcrayon.com');
    assert.match(content, /lc_agency_clients/i, 'Allowlist must query lc_agency_clients');
  });

  await t.test('4. Feedback API: Origin & Site-Key Validation', () => {
    const feedbackRoutePath = path.join(rootDir, 'src/app/api/feedback/route.ts');
    assert.ok(fs.existsSync(feedbackRoutePath), 'feedback route must exist at /api/feedback/route.ts');
    const content = fs.readFileSync(feedbackRoutePath, 'utf8');
    assert.match(content, /site_key|siteKey|origin/i, 'Feedback route must validate site_key or origin');
    assert.match(content, /403|400|unauthorized|rejected/i, 'Feedback route must reject unallowed origins/keys');
  });

  await t.test('5. Mobile PWA: Web App Manifest & Service Worker', () => {
    const manifestPath = path.join(rootDir, 'public/manifest.json');
    assert.ok(fs.existsSync(manifestPath), 'public/manifest.json must exist');
    const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
    assert.equal(manifest.display, 'standalone', 'PWA display must be standalone');
    assert.ok(manifest.start_url, 'PWA must have start_url');

    const swPath = path.join(rootDir, 'public/sw.js');
    assert.ok(fs.existsSync(swPath), 'public/sw.js must exist');

    const layoutPath = path.join(rootDir, 'src/app/layout.tsx');
    const layoutContent = fs.readFileSync(layoutPath, 'utf8');
    assert.match(layoutContent, /manifest\.json/i, 'Root layout must link manifest.json');
  });

  await t.test('6. Expanded Client App: Hub, Plugin Install, Maintenance, Services & Billing', () => {
    const appPagePath = path.join(rootDir, 'src/app/app/page.tsx');
    assert.ok(fs.existsSync(appPagePath), 'src/app/app/page.tsx must exist');
    const content = fs.readFileSync(appPagePath, 'utf8');

    // 1) My Website hub
    assert.match(content, /My Website/i, 'Must have My Website hub');
    assert.match(content, /iframe/i, 'Must have live site embedded preview');
    assert.match(content, /Request a change|Request Edit/i, 'Must have request change CTA');

    // 2) Install Update Plugin
    assert.match(content, /Install the Update Plugin|Update Plugin/i, 'Must have Install Plugin section');
    assert.match(content, /site key|site_key/i, 'Must show client unique site key');
    assert.match(content, /Test Connection|Connection Test/i, 'Must have connection test action');

    // 3) Maintenance Requests
    assert.match(content, /Maintenance Requests|Maintenance/i, 'Must have Maintenance Requests view');
    assert.match(content, /Received|In progress|Needs your approval|Done/i, 'Must support status workflow');

    // 4) Services / Upsells store
    assert.match(content, /Services|Upsells/i, 'Must have Services / Upsells section');
    assert.match(content, /997/i, 'Must reflect 997 turnkey site');
    assert.match(content, /297/i, 'Must reflect 297/mo bundle');
    assert.match(content, /Book a call/i, 'Unpriced add-ons must show Book a call');

    // 5) Plan & Billing
    assert.match(content, /Plan|Billing/i, 'Must have Plan & Billing section');
  });

  await t.test('7. Lead Engine Scraper Adapter & Bake-Off Architecture (Amendment 2)', () => {
    const scraperTypesPath = path.join(rootDir, 'src/lib/scrapers/types.ts');
    assert.ok(fs.existsSync(scraperTypesPath), 'src/lib/scrapers/types.ts must exist');
    const typesContent = fs.readFileSync(scraperTypesPath, 'utf8');
    assert.match(typesContent, /ScraperVendor/i, 'Must define ScraperVendor interface');
    assert.match(typesContent, /RawPlace/i, 'Must define RawPlace normalized interface');

    const adapterPath = path.join(rootDir, 'src/lib/scrapers/index.ts');
    assert.ok(fs.existsSync(adapterPath), 'src/lib/scrapers/index.ts must exist');
    const adapterContent = fs.readFileSync(adapterPath, 'utf8');
    assert.match(adapterContent, /apify/i, 'Must support Apify vendor');
    assert.match(adapterContent, /outscraper/i, 'Must support Outscraper vendor');
    assert.match(adapterContent, /scrapio/i, 'Must support Scrap.io vendor');

    // Staging and promotion logic
    assert.match(adapterContent, /scraped_unverified/i, 'Imports must land as scraped_unverified');
    assert.match(adapterContent, /promoteLead|verifyWithPlaces/i, 'Promotion must require Places verification');
  });
});
