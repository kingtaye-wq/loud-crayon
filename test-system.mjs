import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

const SUPABASE_URL = 'https://iwtqkzcwfiertrlhvkhn.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml3dHFremN3ZmllcnRybGh2a2huIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODIzODE3MDIsImV4cCI6MjA5Nzk1NzcwMn0.Zd9pXsQJWlvr1N2nlRGgUJE54l-MMAMnNv9sBZck_1A';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: { persistSession: false },
});

async function runTests() {
  console.log('=== LOUD CRAYON AUTOMATED VERIFICATION SUITE ===\n');
  let passed = 0;
  let failed = 0;

  function assert(name, condition, details = '') {
    if (condition) {
      console.log(`[PASS] ${name}`);
      passed++;
    } else {
      console.error(`[FAIL] ${name} ${details}`);
      failed++;
    }
  }

  // 1. Verify Supabase tables and RLS
  try {
    const { data: leads, error: leadsErr } = await supabase.from('lc_agency_leads').select('*').limit(3);
    assert('Supabase: lc_agency_leads readable under RLS', !leadsErr && leads.length > 0, leadsErr?.message);

    const { data: queue, error: queueErr } = await supabase.from('lc_agency_build_queue').select('*').limit(3);
    assert('Supabase: lc_agency_build_queue readable under RLS', !queueErr && queue.length > 0, queueErr?.message);

    const { data: pipe, error: pipeErr } = await supabase.from('lc_agency_pipeline').select('*').limit(3);
    assert('Supabase: lc_agency_pipeline readable under RLS', !pipeErr && pipe.length > 0, pipeErr?.message);

    const { data: clients, error: clientsErr } = await supabase.from('lc_agency_clients').select('*').limit(3);
    assert('Supabase: lc_agency_clients readable under RLS', !clientsErr && clients.length > 0, clientsErr?.message);

    const { data: users, error: usersErr } = await supabase.from('lc_agency_users').select('*').limit(2);
    assert('Supabase: lc_agency_users readable under RLS', !usersErr && users.length > 0, usersErr?.message);

    // Test feedback insert
    const { data: fbInsert, error: fbErr } = await supabase.from('lc_agency_feedback').insert({
      client_username: 'verification-agent',
      title: 'Automated Test Feedback Ticket',
      description: 'Verification of feedback pipeline and RLS insert policy.',
      priority: 'low',
      page_url: 'http://localhost:3000/preview/cleveland-pizza-co',
      element_selector: '#hero-cta',
      viewport: '1440x900',
      browser_os: 'Node/VerificationTest',
      status: 'resolved',
    }).select().single();

    assert('Supabase: lc_agency_feedback insert under RLS', !fbErr && fbInsert?.id, fbErr?.message);

    if (fbInsert?.id) {
      await supabase.from('lc_agency_feedback').delete().eq('id', fbInsert.id);
    }
  } catch (e) {
    assert('Supabase connectivity', false, e.message);
  }

  // 2. Verify Config Constants
  try {
    const configPath = './src/config/agency.ts';
    const configContent = fs.readFileSync(configPath, 'utf8');
    assert('Config: Turnkey upfront price 997', configContent.includes('997'));
    assert('Config: AI visibility recurring 297/mo', configContent.includes('297'));
    assert('Config: Pilot 40-minute Cleveland band', configContent.includes('targetRadiusMiles: 40') && configContent.includes('Cleveland, OH'));
    assert('Config: Cold SMS forbidden', configContent.includes('allowColdSms: false'));
  } catch (e) {
    assert('Config constants check', false, e.message);
  }

  // 3. Verify Manifest V3 Chrome Extension
  try {
    const manifestPath = './extension/manifest.json';
    const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
    assert('Extension: Manifest V3 declared', manifest.manifest_version === 3);
    assert('Extension: Permissions include activeTab & scripting', manifest.permissions.includes('activeTab') && manifest.permissions.includes('scripting'));
    assert('Extension: Host permissions restricted to allowlist (no <all_urls>)', !manifest.host_permissions.includes('<all_urls>') && manifest.host_permissions.some(p => p.includes('loudcrayon.com')));
    assert('Extension: Popup and background service worker configured', manifest.action?.default_popup === 'popup.html' && manifest.background?.service_worker === 'background.js');
  } catch (e) {
    assert('Extension manifest check', false, e.message);
  }

  // 4. Verify Next.js Build Output Artifacts
  try {
    const nextDir = './.next';
    assert('Next.js: .next build directory exists', fs.existsSync(nextDir));
    const buildManifest = JSON.parse(fs.readFileSync(path.join(nextDir, 'build-manifest.json'), 'utf8'));
    assert('Next.js: Build manifest contains pages', Object.keys(buildManifest.pages).length > 0);
  } catch (e) {
    assert('Build artifacts check', false, e.message);
  }

  console.log(`\nVerification Complete: ${passed} Passed, ${failed} Failed.`);
  process.exit(failed > 0 ? 1 : 0);
}

runTests();
