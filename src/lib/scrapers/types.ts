export type ScraperVendorType = 'apify' | 'outscraper' | 'scrapio';

export interface ScraperJobParams {
  category: string;
  area: string;
  limit?: number;
}

export interface RawPlace {
  name: string;
  categories: string[];
  address: string;
  phone: string;
  website: string | null;
  rating: number;
  review_count: number;
  hours?: any;
  coordinates?: {
    lat: number;
    lng: number;
  };
  place_id: string;
  maps_url: string;
  is_closed: boolean;
  source_vendor: ScraperVendorType;
  run_id: string;
  scraped_at: string;
  raw_payload?: any;
}

export interface ScraperVendorRunResult {
  vendor: ScraperVendorType;
  run_id: string;
  configured: boolean;
  status: 'completed' | 'failed' | 'not_configured';
  places: RawPlace[];
  error?: string;
  cost_estimate_usd?: number;
  execution_ms?: number;
}

export interface ScraperVendor {
  vendorName: ScraperVendorType;
  isConfigured(): boolean;
  run(params: ScraperJobParams): Promise<ScraperVendorRunResult>;
}

export interface BakeOffScorecard {
  vendor: ScraperVendorType;
  placesFound: number;
  recallScorePct: number; // vs 24 ground-truth shops
  precisionScorePct: number; // vs false positives
  websiteStatusAccuracyPct: number;
  emailYield: number;
  actualCostUsd: number;
  projectedCostPer1000Usd: number;
  executionTimeMs: number;
}
