import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      client_username = 'loudcrayon',
      title,
      description = '',
      priority = 'medium',
      screenshot_url,
      page_url = '',
      element_selector,
      viewport,
      browser_os,
      console_logs = [],
    } = body;

    if (!title) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('lc_agency_feedback')
      .insert({
        client_username,
        title,
        description,
        priority,
        screenshot_url,
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
