import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

const DEFAULT_LOUDCRAYON_DOMAINS = [
  'loudcrayon.com',
  'loudcrayon.co',
  'loud-crayon.vercel.app',
  'localhost',
  '127.0.0.1',
];

export async function GET() {
  try {
    const clientDomains: string[] = [];

    // Query active client registered domains from lc_agency_clients
    const { data: clients, error } = await supabase
      .from('lc_agency_clients')
      .select('domain, staging_url')
      .eq('status', 'active');

    if (!error && clients) {
      for (const c of clients) {
        if (c.domain) clientDomains.push(c.domain.toLowerCase().trim());
        if (c.staging_url) {
          try {
            const parsed = new URL(c.staging_url);
            clientDomains.push(parsed.hostname.toLowerCase().trim());
          } catch {
            // Ignore malformed URLs
          }
        }
      }
    }

    const allDomains = Array.from(new Set([...DEFAULT_LOUDCRAYON_DOMAINS, ...clientDomains]));

    return NextResponse.json({
      success: true,
      domains: allDomains,
      timestamp: new Date().toISOString(),
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message, domains: DEFAULT_LOUDCRAYON_DOMAINS },
      { status: 500 }
    );
  }
}
