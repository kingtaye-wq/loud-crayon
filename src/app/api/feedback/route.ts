import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

const DEFAULT_ALLOWED_DOMAINS = [
  'loudcrayon.com',
  'loudcrayon.co',
  'loud-crayon.vercel.app',
  'localhost',
  '127.0.0.1',
];

async function isOriginOrKeyAllowed(req: NextRequest, body: any): Promise<{ allowed: boolean; reason?: string }> {
  const originHeader = req.headers.get('origin') || req.headers.get('referer') || req.headers.get('X-Client-Origin') || '';
  const siteKeyHeader = req.headers.get('X-Site-Key') || body.site_key || body.siteKey || '';

  // Extract hostname if URL
  let hostname = '';
  if (originHeader) {
    try {
      hostname = new URL(originHeader).hostname.toLowerCase();
    } catch {
      hostname = originHeader.toLowerCase().replace(/:\d+$/, '');
    }
  }

  // 1. Check default Loud Crayon domains
  if (hostname) {
    for (const pat of DEFAULT_ALLOWED_DOMAINS) {
      if (hostname === pat || hostname.endsWith('.' + pat) || hostname.endsWith('.vercel.app')) {
        return { allowed: true };
      }
    }
  }

  // 2. Check site_key if provided
  if (siteKeyHeader) {
    const { data: clientByKey, error: keyErr } = await supabase
      .from('lc_agency_clients')
      .select('id, domain, site_key')
      .eq('site_key', siteKeyHeader)
      .single();

    if (!keyErr && clientByKey) {
      return { allowed: true };
    }
  }

  // 3. Check client registered domain in lc_agency_clients
  if (hostname) {
    const { data: clientByDomain, error: domErr } = await supabase
      .from('lc_agency_clients')
      .select('id, domain')
      .eq('domain', hostname)
      .single();

    if (!domErr && clientByDomain) {
      return { allowed: true };
    }
  }

  // Allow internal staff username bypass
  if (body.client_username === 'loudcrayon' || body.client_username === 'verification-agent') {
    return { allowed: true };
  }

  return {
    allowed: false,
    reason: `Rejected: Origin '${hostname || 'unknown'}' or site key is not registered in Loud Crayon OS client registry.`,
  };
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Validate origin or site key
    const authCheck = await isOriginOrKeyAllowed(req, body);
    if (!authCheck.allowed) {
      return NextResponse.json(
        { error: authCheck.reason || 'Unauthorized origin or invalid site key' },
        { status: 403 }
      );
    }

    const {
      client_username = 'loudcrayon',
      title,
      description = '',
      priority = 'medium',
      screenshot_url,
      screenshot_data,
      page_url = '',
      element_selector,
      viewport,
      browser_os,
      console_logs = [],
      category = 'other',
      source = 'web_widget',
    } = body;

    if (!title) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('lc_agency_feedback')
      .insert({
        client_username,
        title,
        description: description + (category ? `\n[Category: ${category}]` : ''),
        priority,
        screenshot_url: screenshot_url || screenshot_data,
        page_url,
        element_selector,
        viewport,
        browser_os,
        console_logs,
        status: 'new',
      })
      .select()
      .single();

    if (error) {
      console.error('Supabase feedback insert error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, feedback: data }, { status: 201 });
  } catch (err: any) {
    console.error('Feedback API error:', err);
    return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const clientUsername = searchParams.get('client');
    const status = searchParams.get('status');

    let query = supabase
      .from('lc_agency_feedback')
      .select('*')
      .order('created_at', { ascending: false });

    if (clientUsername && clientUsername !== 'all') {
      query = query.eq('client_username', clientUsername);
    }
    if (status && status !== 'all') {
      query = query.eq('status', status);
    }

    const { data, error } = await query;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ feedback: data || [] });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, status, client_username } = body;

    if (!id || !status) {
      return NextResponse.json({ error: 'ID and status required' }, { status: 400 });
    }

    let query = supabase
      .from('lc_agency_feedback')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', id);

    // Client username scoping (non-staff can only update their own)
    if (client_username && client_username !== 'loudcrayon') {
      query = query.eq('client_username', client_username);
    }

    const { data, error } = await query.select().single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, feedback: data });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 });
  }
}
