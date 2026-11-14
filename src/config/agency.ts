// ============================================================================
// Loud Crayon AI Agency System — Configuration Constants
// ============================================================================

export const AGENCY_CONFIG = {
  name: 'Loud Crayon',
  domain: 'loudcrayon.co',
  handle: '@loudcrayon',
  tagline: 'AI Websites for Local Businesses',
  description: 'We turn Google reviews, photos, and real services into high-converting, modern websites in minutes — before you spend a single dollar.',

  // Configurable Pricing Constants (from the @oliverr.builds reel model)
  pricing: {
    upfront: Number(process.env.NEXT_PUBLIC_UPFRONT_PRICE || 997),
    recurring: Number(process.env.NEXT_PUBLIC_RECURRING_PRICE || 297),
    upfrontFormatted: '$997',
    recurringFormatted: '$297/mo',
    upfrontLabel: 'One-Time Turnkey Launch',
    recurringLabel: 'AI Visibility, Google Rankings & Review Engine',
  },

  // Target Geography & Category Defaults (Pilot Slice: NE Ohio 40-minute band)
  pilot: {
    defaultCategory: 'Pizzeria & Dining',
    defaultGeography: 'Cleveland, OH',
    supportedCategories: [
      'Pizzeria & Dining',
      'Landscaping & Hardscaping',
      'Plumbing & HVAC',
      'Roofing & Exterior Contractors',
      'Auto Repair & Body Shops',
      'Dental & Health Clinics',
      'Fitness & Martial Arts',
    ],
    targetRadiusMiles: 40,
    geographies: [
      'Cleveland, OH',
      'Lakewood, OH',
      'Parma, OH',
      'Akron, OH',
      'Euclid, OH',
      'Strongsville, OH',
      'Westlake, OH',
    ],
  },

  // Compliance Flags
  compliance: {
    allowColdSms: false, // HARD RULE: NO cold SMS anywhere
    firstTouchChannels: ['email', 'preview_chat'],
    smsRequiresExplicitConsent: true,
    stagingNoindex: true,
  },
};
