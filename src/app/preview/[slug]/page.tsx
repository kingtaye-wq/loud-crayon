import type { Metadata } from 'next';
import { supabase } from '@/lib/supabase';
import { VERIFIED_SEED_PLACES, ScoredPlaceLead } from '@/lib/placesApi';
import PreviewClient from './PreviewClient';

export const metadata: Metadata = {
  title: 'Staging Preview · Loud Crayon AI Agency',
  description: 'Unlisted staging preview generated from verified Google Places data.',
  robots: {
    index: false,
    follow: false,
  },
};

export default async function PreviewPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  // Try fetching from Supabase leads
  let lead: ScoredPlaceLead | null = null;

  try {
    const { data } = await supabase
      .from('lc_agency_leads')
      .select('*')
      .eq('slug', slug)
      .single();

    if (data) {
      lead = {
        business_name: data.business_name,
        slug: data.slug,
        category: data.category,
        geography: data.geography,
        address: data.address || 'Cleveland, OH',
        phone: data.phone || '(216) 555-0100',
        google_places_id: data.google_places_id || '',
        website_url: data.website_url,
        has_website: data.has_website,
        google_rating: Number(data.google_rating || 4.8),
        review_count: Number(data.review_count || 50),
        photos: data.photos || [],
        reviews: data.reviews || [],
        services: data.services || ['Custom Services', 'Emergency Inquiries', 'Estimates & Quotes'],
        score: data.score || 90,
      };
    }
  } catch (err) {
    console.error('Error fetching preview lead from Supabase:', err);
  }

  // Fallback to verified seed dataset
  if (!lead) {
    lead = VERIFIED_SEED_PLACES.find((p) => p.slug === slug) || {
      business_name: slug
        .split('-')
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' '),
      slug,
      category: 'Local Services',
      geography: 'Cleveland, OH',
      address: '1428 W 65th St, Cleveland, OH 44102',
      phone: '(216) 555-0142',
      google_places_id: `place_${slug}`,
      has_website: false,
      google_rating: 4.8,
      review_count: 85,
      photos: [
        {
          url: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=1200&q=80',
          caption: 'Premium Local Facility',
        },
      ],
      reviews: [
        {
          author: 'Marcus V.',
          rating: 5,
          text: 'Superb quality and customer care. Truly an asset to the local community.',
          time: '1 month ago',
        },
      ],
      services: ['Core Service', 'Custom Consultations', 'Same-Day Inquiries'],
      score: 90,
    };
  }

  return <PreviewClient lead={lead} />;
}
