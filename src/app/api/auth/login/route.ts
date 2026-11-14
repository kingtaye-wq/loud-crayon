import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const username = (body.username || '').trim().toLowerCase();

    if (!username) {
      return NextResponse.json({ error: 'Username is required' }, { status: 400 });
    }

    // Check pre-configured credentials
    if (username === 'loudcrayon' || username === 'admin') {
      return NextResponse.json({
        success: true,
        user: {
          username: 'loudcrayon',
          role: 'admin',
          name: 'Loud Crayon Admin',
          redirectUrl: '/os',
        },
      });
    }

    if (username === 'testclient') {
      return NextResponse.json({
        success: true,
        user: {
          username: 'testclient',
          role: 'client',
          name: 'Cleveland Pizza Co. (Test Client)',
          slug: 'cleveland-pizza-co',
          redirectUrl: '/app',
        },
      });
    }

    // Check lc_agency_users or lc_agency_clients table
    const { data: clientUser } = await supabase
      .from('lc_agency_clients')
      .select('*')
      .eq('username', username)
      .maybeSingle();

    if (clientUser) {
      return NextResponse.json({
        success: true,
        user: {
          username: clientUser.username,
          role: 'client',
          name: clientUser.business_name,
          slug: clientUser.slug,
          redirectUrl: '/app',
        },
      });
    }

    // Fallback: allow guest preview testing with client role
    return NextResponse.json({
      success: true,
      user: {
        username,
        role: 'client',
        name: `${username} (Staging User)`,
        slug: username,
        redirectUrl: '/app',
      },
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Login error' }, { status: 500 });
  }
}
