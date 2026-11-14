import { NextRequest, NextResponse } from 'next/server';
import { searchPlacesAndScore } from '@/lib/placesApi';
import { supabase } from '@/lib/supabase';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { industry = 'pizza', location = 'Cleveland, OH', saveToDb = true } = body;

    const leads = await searchPlacesAndScore(industry, location);

    if (saveToDb && leads.length > 0) {
      // Upsert / insert into lc_agency_leads and queue for auto-build
      for (const lead of leads) {
        const { data: existing } = await supabase
          .from('lc_agency_leads')
          .select('id')
          .eq('slug', lead.slug)
          .maybeSingle();

        let leadId = existing?.id;

        if (!leadId) {
          const { data: inserted, error: insertError } = await supabase
            .from('lc_agency_leads')
            .insert({
              business_name: lead.business_name,
              slug: lead.slug,
              category: lead.category,
              geography: lead.geography,
              address: lead.address,
              phone: lead.phone,
              google_places_id: lead.google_places_id,
              website_url: lead.website_url,
              has_website: lead.has_website,
              google_rating: lead.google_rating,
              review_count: lead.review_count,
              photos: lead.photos,
              reviews: lead.reviews,
              services: lead.services,
              score: lead.score,
              status: 'scouted',
            })
            .select('id')
            .single();

          if (inserted) {
            leadId = inserted.id;

            // Enqueue into build queue
            await supabase.from('lc_agency_build_queue').insert({
              lead_id: leadId,
              business_name: lead.business_name,
              slug: lead.slug,
              status: 'ready',
              qa_checklist: {
                name_verified: true,
                contact_verified: !!lead.phone,
                reviews_imported: lead.reviews.length > 0,
                photos_rendered: lead.photos.length > 0,
                chat_active: true,
                noindex_confirmed: true,
              },
              preview_url: `/preview/${lead.slug}`,
              template_id: lead.category.toLowerCase().includes('pizza')
                ? 'restaurant-modern'
                : 'local-services-premium',
            });
          }
        }
      }
    }

    return NextResponse.json({
      success: true,
      query: { industry, location },
      count: leads.length,
      leads,
    });
  } catch (err: any) {
    console.error('Leads search API error:', err);
    return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const industry = searchParams.get('industry') || 'pizza';
    const location = searchParams.get('location') || 'Cleveland, OH';

    const leads = await searchPlacesAndScore(industry, location);

    return NextResponse.json({
      success: true,
      query: { industry, location },
      count: leads.length,
      leads,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 });
  }
}
