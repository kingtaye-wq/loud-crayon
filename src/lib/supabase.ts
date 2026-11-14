import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://iwtqkzcwfiertrlhvkhn.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml3dHFremN3ZmllcnRybGh2a2huIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODIzODE3MDIsImV4cCI6MjA5Nzk1NzcwMn0.Zd9pXsQJWlvr1N2nlRGgUJE54l-MMAMnNv9sBZck_1A';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false, // Username-only auth mode on staging
  },
});

export interface LeadRecord {
  id: string;
  business_name: string;
  slug: string;
  category: string;
  geography: string;
  address?: string;
  phone?: string;
  google_places_id?: string;
  website_url?: string;
  has_website: boolean;
  google_rating: number;
  review_count: number;
  photos: { url: string; caption?: string }[];
  reviews: { author: string; rating: number; text: string; time?: string }[];
  services: string[];
  score: number;
  status: 'scouted' | 'building' | 'preview_ready' | 'contacted' | 'engaged' | 'closed' | 'suppressed';
  created_at: string;
  updated_at: string;
}

export interface BuildQueueRecord {
  id: string;
  lead_id: string;
  business_name: string;
  slug: string;
  status: 'queued' | 'building' | 'ready' | 'failed';
  qa_checklist: {
    name_verified: boolean;
    contact_verified: boolean;
    reviews_imported: boolean;
    photos_rendered: boolean;
    chat_active: boolean;
    noindex_confirmed: boolean;
  };
  preview_url: string;
  template_id: string;
  error_log?: string;
  created_at: string;
  updated_at: string;
}

export interface PipelineRecord {
  id: string;
  lead_id?: string;
  client_username: string;
  business_name: string;
  stage: 'preview_ready' | 'chat_engaged' | 'call_booked' | 'call_showed' | 'closed_won' | 'nurture' | 'closed_lost';
  upfront_paid: boolean;
  upfront_amount: number;
  mrr_active: boolean;
  mrr_amount: number;
  booked_call_at?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface ClientRecord {
  id: string;
  username: string;
  business_name: string;
  slug: string;
  status: 'active' | 'onboarding' | 'at_risk' | 'churned';
  plan_type: string;
  mrr: number;
  google_rank_data: {
    keywords: string[];
    average_rank: number;
    rank_change_30d: string;
  };
  ai_visibility_score: number;
  review_metrics: {
    average_rating: number;
    total_reviews: number;
    monthly_new_reviews: number;
  };
  created_at: string;
  updated_at: string;
}

export interface FeedbackRecord {
  id: string;
  client_username: string;
  title: string;
  description?: string;
  screenshot_url?: string;
  page_url: string;
  element_selector?: string;
  viewport?: string;
  browser_os?: string;
  console_logs: { type: string; message: string; timestamp: string }[];
  status: 'new' | 'in_progress' | 'resolved';
  priority: 'low' | 'medium' | 'high';
  created_at: string;
  updated_at: string;
}
