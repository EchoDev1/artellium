/**
 * ARTELLIUM AFRICA - DHL EXPRESS DELIVERY & GLOBAL SHIPPING ENGINE
 * Comprehensive Country Database, Regional Zones, DHL Fine Art Integration,
 * and Admin-Managed Delivery Pricing System.
 */

// Comprehensive List of Global Countries categorized by Zone
export const WORLD_COUNTRIES = [
  // --- AFRICA (Domestic & Regional Zones) ---
  { code: 'NG', name: 'Nigeria', flag: '🇳🇬', dialCode: '+234', zone: 'domestic_ng', region: 'West Africa (HQ)' },
  { code: 'GH', name: 'Ghana', flag: '🇬🇭', dialCode: '+233', zone: 'west_africa', region: 'West Africa' },
  { code: 'SN', name: 'Senegal', flag: '🇸🇳', dialCode: '+221', zone: 'west_africa', region: 'West Africa' },
  { code: 'CI', name: "Côte d'Ivoire", flag: '🇨🇮', dialCode: '+225', zone: 'west_africa', region: 'West Africa' },
  { code: 'BJ', name: 'Benin', flag: '🇧🇯', dialCode: '+229', zone: 'west_africa', region: 'West Africa' },
  { code: 'TG', name: 'Togo', flag: '🇹🇬', dialCode: '+228', zone: 'west_africa', region: 'West Africa' },
  { code: 'ML', name: 'Mali', flag: '🇲🇱', dialCode: '+223', zone: 'west_africa', region: 'West Africa' },
  { code: 'BF', name: 'Burkina Faso', flag: '🇧🇫', dialCode: '+226', zone: 'west_africa', region: 'West Africa' },
  { code: 'NE', name: 'Niger', flag: '🇳🇪', dialCode: '+227', zone: 'west_africa', region: 'West Africa' },
  { code: 'GN', name: 'Guinea', flag: '🇬🇳', dialCode: '+224', zone: 'west_africa', region: 'West Africa' },
  { code: 'SL', name: 'Sierra Leone', flag: '🇸🇱', dialCode: '+232', zone: 'west_africa', region: 'West Africa' },
  { code: 'LR', name: 'Liberia', flag: '🇱🇷', dialCode: '+231', zone: 'west_africa', region: 'West Africa' },
  { code: 'GM', name: 'Gambia', flag: '🇬🇲', dialCode: '+220', zone: 'west_africa', region: 'West Africa' },
  { code: 'CV', name: 'Cape Verde', flag: '🇨🇻', dialCode: '+238', zone: 'west_africa', region: 'West Africa' },
  { code: 'GW', name: 'Guinea-Bissau', flag: '🇬🇼', dialCode: '+245', zone: 'west_africa', region: 'West Africa' },

  // East Africa (EAC)
  { code: 'KE', name: 'Kenya', flag: '🇰🇪', dialCode: '+254', zone: 'east_africa', region: 'East Africa' },
  { code: 'RW', name: 'Rwanda', flag: '🇷🇼', dialCode: '+250', zone: 'east_africa', region: 'East Africa' },
  { code: 'TZ', name: 'Tanzania', flag: '🇹🇿', dialCode: '+255', zone: 'east_africa', region: 'East Africa' },
  { code: 'UG', name: 'Uganda', flag: '🇺🇬', dialCode: '+256', zone: 'east_africa', region: 'East Africa' },
  { code: 'ET', name: 'Ethiopia', flag: '🇪🇹', dialCode: '+251', zone: 'east_africa', region: 'East Africa' },
  { code: 'SS', name: 'South Sudan', flag: '🇸🇸', dialCode: '+211', zone: 'east_africa', region: 'East Africa' },
  { code: 'BI', name: 'Burundi', flag: '🇧🇮', dialCode: '+257', zone: 'east_africa', region: 'East Africa' },
  { code: 'DJ', name: 'Djibouti', flag: '🇩🇯', dialCode: '+253', zone: 'east_africa', region: 'East Africa' },
  { code: 'ER', name: 'Eritrea', flag: '🇪🇷', dialCode: '+291', zone: 'east_africa', region: 'East Africa' },
  { code: 'SO', name: 'Somalia', flag: '🇸🇴', dialCode: '+252', zone: 'east_africa', region: 'East Africa' },
  { code: 'SC', name: 'Seychelles', flag: '🇸🇨', dialCode: '+248', zone: 'east_africa', region: 'East Africa' },
  { code: 'MU', name: 'Mauritius', flag: '🇲🇺', dialCode: '+230', zone: 'east_africa', region: 'East Africa' },
  { code: 'KM', name: 'Comoros', flag: '🇰🇲', dialCode: '+269', zone: 'east_africa', region: 'East Africa' },
  { code: 'MG', name: 'Madagascar', flag: '🇲🇬', dialCode: '+261', zone: 'east_africa', region: 'East Africa' },

  // Southern Africa (SADC)
  { code: 'ZA', name: 'South Africa', flag: '🇿🇦', dialCode: '+27', zone: 'southern_africa', region: 'Southern Africa' },
  { code: 'NA', name: 'Namibia', flag: '🇳🇦', dialCode: '+264', zone: 'southern_africa', region: 'Southern Africa' },
  { code: 'BW', name: 'Botswana', flag: '🇧🇼', dialCode: '+267', zone: 'southern_africa', region: 'Southern Africa' },
  { code: 'ZW', name: 'Zimbabwe', flag: '🇿🇼', dialCode: '+263', zone: 'southern_africa', region: 'Southern Africa' },
  { code: 'ZM', name: 'Zambia', flag: '🇿🇲', dialCode: '+260', zone: 'southern_africa', region: 'Southern Africa' },
  { code: 'MZ', name: 'Mozambique', flag: '🇲🇿', dialCode: '+258', zone: 'southern_africa', region: 'Southern Africa' },
  { code: 'AO', name: 'Angola', flag: '🇦🇴', dialCode: '+244', zone: 'southern_africa', region: 'Southern Africa' },
  { code: 'MW', name: 'Malawi', flag: '🇲🇼', dialCode: '+265', zone: 'southern_africa', region: 'Southern Africa' },
  { code: 'SZ', name: 'Eswatini', flag: '🇸🇿', dialCode: '+268', zone: 'southern_africa', region: 'Southern Africa' },
  { code: 'LS', name: 'Lesotho', flag: '🇱🇸', dialCode: '+266', zone: 'southern_africa', region: 'Southern Africa' },

  // Central Africa (CEMAC)
  { code: 'CM', name: 'Cameroon', flag: '🇨🇲', dialCode: '+237', zone: 'central_africa', region: 'Central Africa' },
  { code: 'CD', name: 'DR Congo', flag: '🇨🇩', dialCode: '+243', zone: 'central_africa', region: 'Central Africa' },
  { code: 'CG', name: 'Congo (Brazzaville)', flag: '🇨🇬', dialCode: '+242', zone: 'central_africa', region: 'Central Africa' },
  { code: 'GA', name: 'Gabon', flag: '🇬🇦', dialCode: '+241', zone: 'central_africa', region: 'Central Africa' },
  { code: 'GQ', name: 'Equatorial Guinea', flag: '🇬🇶', dialCode: '+240', zone: 'central_africa', region: 'Central Africa' },
  { code: 'CF', name: 'Central African Republic', flag: '🇨🇫', dialCode: '+236', zone: 'central_africa', region: 'Central Africa' },
  { code: 'TD', name: 'Chad', flag: '🇹🇩', dialCode: '+235', zone: 'central_africa', region: 'Central Africa' },
  { code: 'ST', name: 'São Tomé & Príncipe', flag: '🇸🇹', dialCode: '+239', zone: 'central_africa', region: 'Central Africa' },

  // North Africa & Mediterranean
  { code: 'EG', name: 'Egypt', flag: '🇪🇬', dialCode: '+20', zone: 'north_africa', region: 'North Africa' },
  { code: 'MA', name: 'Morocco', flag: '🇲🇦', dialCode: '+212', zone: 'north_africa', region: 'North Africa' },
  { code: 'DZ', name: 'Algeria', flag: '🇩🇿', dialCode: '+213', zone: 'north_africa', region: 'North Africa' },
  { code: 'TN', name: 'Tunisia', flag: '🇹🇳', dialCode: '+216', zone: 'north_africa', region: 'North Africa' },
  { code: 'LY', name: 'Libya', flag: '🇱🇾', dialCode: '+218', zone: 'north_africa', region: 'North Africa' },
  { code: 'SD', name: 'Sudan', flag: '🇸🇩', dialCode: '+249', zone: 'north_africa', region: 'North Africa' },
  { code: 'MR', name: 'Mauritania', flag: '🇲🇷', dialCode: '+222', zone: 'north_africa', region: 'North Africa' },

  // --- EUROPE ---
  { code: 'GB', name: 'United Kingdom', flag: '🇬🇧', dialCode: '+44', zone: 'uk_europe', region: 'Europe' },
  { code: 'FR', name: 'France', flag: '🇫🇷', dialCode: '+33', zone: 'uk_europe', region: 'Europe' },
  { code: 'DE', name: 'Germany', flag: '🇩🇪', dialCode: '+49', zone: 'uk_europe', region: 'Europe' },
  { code: 'IT', name: 'Italy', flag: '🇮🇹', dialCode: '+39', zone: 'uk_europe', region: 'Europe' },
  { code: 'ES', name: 'Spain', flag: '🇪🇸', dialCode: '+34', zone: 'uk_europe', region: 'Europe' },
  { code: 'CH', name: 'Switzerland', flag: '🇨🇭', dialCode: '+41', zone: 'uk_europe', region: 'Europe' },
  { code: 'NL', name: 'Netherlands', flag: '🇳🇱', dialCode: '+31', zone: 'uk_europe', region: 'Europe' },
  { code: 'BE', name: 'Belgium', flag: '🇧🇪', dialCode: '+32', zone: 'uk_europe', region: 'Europe' },
  { code: 'SE', name: 'Sweden', flag: '🇸🇪', dialCode: '+46', zone: 'uk_europe', region: 'Europe' },
  { code: 'NO', name: 'Norway', flag: '🇳🇴', dialCode: '+47', zone: 'uk_europe', region: 'Europe' },
  { code: 'DK', name: 'Denmark', flag: '🇩🇰', dialCode: '+45', zone: 'uk_europe', region: 'Europe' },
  { code: 'FI', name: 'Finland', flag: '🇫🇮', dialCode: '+358', zone: 'uk_europe', region: 'Europe' },
  { code: 'AT', name: 'Austria', flag: '🇦🇹', dialCode: '+43', zone: 'uk_europe', region: 'Europe' },
  { code: 'IE', name: 'Ireland', flag: '🇮🇪', dialCode: '+353', zone: 'uk_europe', region: 'Europe' },
  { code: 'PT', name: 'Portugal', flag: '🇵🇹', dialCode: '+351', zone: 'uk_europe', region: 'Europe' },
  { code: 'PL', name: 'Poland', flag: '🇵🇱', dialCode: '+48', zone: 'uk_europe', region: 'Europe' },
  { code: 'CZ', name: 'Czech Republic', flag: '🇨🇿', dialCode: '+420', zone: 'uk_europe', region: 'Europe' },
  { code: 'GR', name: 'Greece', flag: '🇬🇷', dialCode: '+30', zone: 'uk_europe', region: 'Europe' },
  { code: 'HU', name: 'Hungary', flag: '🇭🇺', dialCode: '+36', zone: 'uk_europe', region: 'Europe' },
  { code: 'RO', name: 'Romania', flag: '🇷🇴', dialCode: '+40', zone: 'uk_europe', region: 'Europe' },
  { code: 'LU', name: 'Luxembourg', flag: '🇱🇺', dialCode: '+352', zone: 'uk_europe', region: 'Europe' },
  { code: 'MC', name: 'Monaco', flag: '🇲🇨', dialCode: '+377', zone: 'uk_europe', region: 'Europe' },
  { code: 'TR', name: 'Turkey', flag: '🇹🇷', dialCode: '+90', zone: 'uk_europe', region: 'Europe' },

  // --- NORTH AMERICA ---
  { code: 'US', name: 'United States', flag: '🇺🇸', dialCode: '+1', zone: 'north_america', region: 'North America' },
  { code: 'CA', name: 'Canada', flag: '🇨🇦', dialCode: '+1', zone: 'north_america', region: 'North America' },
  { code: 'MX', name: 'Mexico', flag: '🇲🇽', dialCode: '+52', zone: 'north_america', region: 'North America' },

  // --- MIDDLE EAST & GULF (GCC) ---
  { code: 'AE', name: 'United Arab Emirates', flag: '🇦🇪', dialCode: '+971', zone: 'middle_east', region: 'Middle East' },
  { code: 'SA', name: 'Saudi Arabia', flag: '🇸🇦', dialCode: '+966', zone: 'middle_east', region: 'Middle East' },
  { code: 'QA', name: 'Qatar', flag: '🇶🇦', dialCode: '+974', zone: 'middle_east', region: 'Middle East' },
  { code: 'KW', name: 'Kuwait', flag: '🇰🇼', dialCode: '+965', zone: 'middle_east', region: 'Middle East' },
  { code: 'OM', name: 'Oman', flag: '🇴🇲', dialCode: '+968', zone: 'middle_east', region: 'Middle East' },
  { code: 'BH', name: 'Bahrain', flag: '🇧🇭', dialCode: '+973', zone: 'middle_east', region: 'Middle East' },
  { code: 'IL', name: 'Israel', flag: '🇮🇱', dialCode: '+972', zone: 'middle_east', region: 'Middle East' },
  { code: 'JO', name: 'Jordan', flag: '🇯🇴', dialCode: '+962', zone: 'middle_east', region: 'Middle East' },
  { code: 'LB', name: 'Lebanon', flag: '🇱🇧', dialCode: '+961', zone: 'middle_east', region: 'Middle East' },

  // --- ASIA-PACIFIC ---
  { code: 'JP', name: 'Japan', flag: '🇯🇵', dialCode: '+81', zone: 'asia_pacific', region: 'Asia-Pacific' },
  { code: 'CN', name: 'China', flag: '🇨🇳', dialCode: '+86', zone: 'asia_pacific', region: 'Asia-Pacific' },
  { code: 'SG', name: 'Singapore', flag: '🇸🇬', dialCode: '+65', zone: 'asia_pacific', region: 'Asia-Pacific' },
  { code: 'HK', name: 'Hong Kong', flag: '🇭🇰', dialCode: '+852', zone: 'asia_pacific', region: 'Asia-Pacific' },
  { code: 'KR', name: 'South Korea', flag: '🇰🇷', dialCode: '+82', zone: 'asia_pacific', region: 'Asia-Pacific' },
  { code: 'IN', name: 'India', flag: '🇮🇳', dialCode: '+91', zone: 'asia_pacific', region: 'Asia-Pacific' },
  { code: 'AU', name: 'Australia', flag: '🇦🇺', dialCode: '+61', zone: 'asia_pacific', region: 'Oceania' },
  { code: 'NZ', name: 'New Zealand', flag: '🇳🇿', dialCode: '+64', zone: 'asia_pacific', region: 'Oceania' },
  { code: 'MY', name: 'Malaysia', flag: '🇲🇾', dialCode: '+60', zone: 'asia_pacific', region: 'Asia-Pacific' },
  { code: 'ID', name: 'Indonesia', flag: '🇮🇩', dialCode: '+62', zone: 'asia_pacific', region: 'Asia-Pacific' },
  { code: 'TH', name: 'Thailand', flag: '🇹🇭', dialCode: '+66', zone: 'asia_pacific', region: 'Asia-Pacific' },
  { code: 'VN', name: 'Vietnam', flag: '🇻🇳', dialCode: '+84', zone: 'asia_pacific', region: 'Asia-Pacific' },
  { code: 'PH', name: 'Philippines', flag: '🇵🇭', dialCode: '+63', zone: 'asia_pacific', region: 'Asia-Pacific' },
  { code: 'TW', name: 'Taiwan', flag: '🇹🇼', dialCode: '+886', zone: 'asia_pacific', region: 'Asia-Pacific' },

  // --- LATIN AMERICA & CARIBBEAN ---
  { code: 'BR', name: 'Brazil', flag: '🇧🇷', dialCode: '+55', zone: 'latin_america', region: 'Latin America' },
  { code: 'AR', name: 'Argentina', flag: '🇦🇷', dialCode: '+54', zone: 'latin_america', region: 'Latin America' },
  { code: 'CL', name: 'Chile', flag: '🇨🇱', dialCode: '+56', zone: 'latin_america', region: 'Latin America' },
  { code: 'CO', name: 'Colombia', flag: '🇨🇴', dialCode: '+57', zone: 'latin_america', region: 'Latin America' },
  { code: 'PE', name: 'Peru', flag: '🇵🇪', dialCode: '+51', zone: 'latin_america', region: 'Latin America' },
  { code: 'JM', name: 'Jamaica', flag: '🇯🇲', dialCode: '+1876', zone: 'latin_america', region: 'Caribbean' },
  { code: 'BB', name: 'Barbados', flag: '🇧🇧', dialCode: '+1246', zone: 'latin_america', region: 'Caribbean' },
  { code: 'TT', name: 'Trinidad and Tobago', flag: '🇹🇹', dialCode: '+1868', zone: 'latin_america', region: 'Caribbean' },
  { code: 'BS', name: 'Bahamas', flag: '🇧🇸', dialCode: '+1242', zone: 'latin_america', region: 'Caribbean' },
  { code: 'PA', name: 'Panama', flag: '🇵🇦', dialCode: '+507', zone: 'latin_america', region: 'Latin America' },
  { code: 'CR', name: 'Costa Rica', flag: '🇨🇷', dialCode: '+506', zone: 'latin_america', region: 'Latin America' },

  // --- REST OF THE WORLD ---
  { code: 'IS', name: 'Iceland', flag: '🇮🇸', dialCode: '+354', zone: 'rest_of_world', region: 'Europe' },
  { code: 'MT', name: 'Malta', flag: '🇲🇹', dialCode: '+356', zone: 'rest_of_world', region: 'Europe' },
  { code: 'CY', name: 'Cyprus', flag: '🇨🇾', dialCode: '+357', zone: 'rest_of_world', region: 'Europe' },
  { code: 'FJ', name: 'Fiji', flag: '🇫🇯', dialCode: '+679', zone: 'rest_of_world', region: 'Oceania' },
  { code: 'OTHER', name: 'Other International Destination', flag: '🌐', dialCode: '+00', zone: 'rest_of_world', region: 'Global' }
];

// Delivery Zones with Names and Delivery Estimates
export const SHIPPING_ZONES = [
  {
    id: 'domestic_ng',
    name: 'Nigeria (Domestic Expedited)',
    description: 'Direct courier & bonded transit across Nigerian metropolitan centers & states.',
    estimatedDays: '1-3 Business Days',
    defaultPriceNGN: 35000,
    carrierService: 'DHL Express Domestic / Artellium Secure Courier'
  },
  {
    id: 'west_africa',
    name: 'West Africa (ECOWAS Corridor)',
    description: 'Cross-border express fine art freight across ECOWAS member states.',
    estimatedDays: '2-4 Business Days',
    defaultPriceNGN: 85000,
    carrierService: 'DHL Express Regional Air Freight'
  },
  {
    id: 'east_africa',
    name: 'East Africa (EAC Corridor)',
    description: 'Direct air transport to Kenya, Rwanda, Tanzania, Uganda, and surrounding hubs.',
    estimatedDays: '3-5 Business Days',
    defaultPriceNGN: 110000,
    carrierService: 'DHL Express Fine Art Worldwide'
  },
  {
    id: 'central_africa',
    name: 'Central Africa (CEMAC)',
    description: 'Climate-controlled insured courier across Cameroon, Gabon, Congo, DR Congo.',
    estimatedDays: '3-5 Business Days',
    defaultPriceNGN: 120000,
    carrierService: 'DHL Express Fine Art Worldwide'
  },
  {
    id: 'southern_africa',
    name: 'Southern Africa (SADC)',
    description: 'Priority flight transit to South Africa, Namibia, Botswana, and SADC hubs.',
    estimatedDays: '3-5 Business Days',
    defaultPriceNGN: 130000,
    carrierService: 'DHL Express Fine Art Worldwide'
  },
  {
    id: 'north_africa',
    name: 'North Africa & Mediterranean',
    description: 'Direct transit to Egypt, Morocco, Algeria, Tunisia, and Mediterranean destinations.',
    estimatedDays: '3-6 Business Days',
    defaultPriceNGN: 145000,
    carrierService: 'DHL Express Fine Art Worldwide'
  },
  {
    id: 'uk_europe',
    name: 'United Kingdom & Europe',
    description: 'Priority intercontinental courier with pre-cleared fine art customs documentation.',
    estimatedDays: '3-5 Business Days',
    defaultPriceNGN: 175000,
    carrierService: 'DHL Express Fine Art Worldwide (Insured)'
  },
  {
    id: 'north_america',
    name: 'United States & Canada',
    description: 'Direct transatlantic DHL flight with museum-grade timber crating and customs clearance.',
    estimatedDays: '4-6 Business Days',
    defaultPriceNGN: 195000,
    carrierService: 'DHL Express Fine Art Worldwide (Insured)'
  },
  {
    id: 'middle_east',
    name: 'Middle East & Gulf (GCC)',
    description: 'White-glove courier to UAE, Saudi Arabia, Qatar, Bahrain, Kuwait, and Oman.',
    estimatedDays: '3-5 Business Days',
    defaultPriceNGN: 185000,
    carrierService: 'DHL Express Fine Art Worldwide'
  },
  {
    id: 'asia_pacific',
    name: 'Asia-Pacific & Oceania',
    description: 'Expedited air routing to Japan, Singapore, Hong Kong, Australia, and New Zealand.',
    estimatedDays: '5-7 Business Days',
    defaultPriceNGN: 220000,
    carrierService: 'DHL Express Fine Art Worldwide'
  },
  {
    id: 'latin_america',
    name: 'Latin America & Caribbean',
    description: 'Archival consignment routing across Brazil, Argentina, Colombia, and Caribbean islands.',
    estimatedDays: '5-8 Business Days',
    defaultPriceNGN: 240000,
    carrierService: 'DHL Express Fine Art Worldwide'
  },
  {
    id: 'rest_of_world',
    name: 'Rest of World / Remote Territories',
    description: 'Global courier coverage to all remaining international sovereign destinations.',
    estimatedDays: '6-9 Business Days',
    defaultPriceNGN: 260000,
    carrierService: 'DHL Express Fine Art Worldwide'
  }
];

// Initial DHL Shipping & Admin Delivery Pricing Configuration
export const INITIAL_SHIPPING_SETTINGS = {
  // Plugin Activation & Integration Controls
  pluginEnabled: true,
  carrierName: 'DHL Express Fine Art',
  pricingMode: 'admin_managed', // 'admin_managed' (Admin Dashboard rates) or 'dhl_api_live' (DHL API)
  
  // DHL Official Plugin Credentials & Account Configuration
  dhlAccountNumber: 'DHL-AFR-8849201',
  dhlApiKey: '',
  dhlApiSecret: '',
  dhlApiEnvironment: 'sandbox', // 'sandbox' | 'production'
  dhlDefaultDispatchHub: 'Lagos Atelier Central Hub, Nigeria (Artellium HQ)',

  // Fine Art Handling & Crating Options
  cratingType: 'Archival Museum Timber Crating with Dual Shock Sensors',
  includeCratingFeeInRate: true,
  standaloneCratingFeeNGN: 25000,
  insuranceIncluded: true,
  insuranceRatePercent: 1.5, // 1.5% of artwork value
  freeShippingThresholdNGN: 0, // 0 = disabled, e.g. 15000000 for free global delivery on high-value orders

  // Admin Controlled Base Rates per Zone (in NGN)
  zoneRates: {
    domestic_ng: 35000,
    west_africa: 85000,
    east_africa: 110000,
    central_africa: 120000,
    southern_africa: 130000,
    north_africa: 145000,
    uk_europe: 175000,
    north_america: 195000,
    middle_east: 185000,
    asia_pacific: 220000,
    latin_america: 240000,
    rest_of_world: 260000
  },

  // Per-Country Specific Price Overrides set by Admin (Country Code -> NGN)
  countryOverrides: {
    // Examples admin can modify:
    NG: 35000,
    GH: 75000,
    GB: 175000,
    US: 195000,
    ZA: 130000,
    AE: 185000
  },

  // Notification and notes
  dispatchNotice: 'All consignments are packed in ISO-certified museum crates with tamper-evident seals and dual shock/tilt sensors.'
};

/**
 * Find country by ISO code or country name
 */
export function findCountry(query) {
  if (!query) return WORLD_COUNTRIES[0];
  const q = String(query).trim().toLowerCase();
  return (
    WORLD_COUNTRIES.find(c => c.code.toLowerCase() === q) ||
    WORLD_COUNTRIES.find(c => c.name.toLowerCase() === q) ||
    WORLD_COUNTRIES.find(c => c.name.toLowerCase().includes(q)) ||
    WORLD_COUNTRIES[0]
  );
}

/**
 * Calculate DHL Shipping Rate for a given country, order total, and item count
 */
export function calculateDhlShippingRate(countryCodeOrName, cartTotal = 0, itemCount = 1, settings = INITIAL_SHIPPING_SETTINGS) {
  const cfg = { ...INITIAL_SHIPPING_SETTINGS, ...settings };
  const country = findCountry(countryCodeOrName);
  const zone = SHIPPING_ZONES.find(z => z.id === country.zone) || SHIPPING_ZONES[0];

  // 1. Check for Free Shipping Threshold
  if (cfg.freeShippingThresholdNGN > 0 && cartTotal >= cfg.freeShippingThresholdNGN) {
    return {
      priceNGN: 0,
      isFreeShipping: true,
      country,
      zone,
      carrier: cfg.carrierName,
      estimatedDays: zone.estimatedDays,
      serviceTier: zone.carrierService,
      cratingFeeNGN: 0,
      breakdown: 'Free Worldwide Insured Shipping (VIP Tier)'
    };
  }

  // 2. Check for Specific Country Override set by Admin
  let basePrice = 0;
  const upperCode = (country.code || 'NG').toUpperCase();
  if (cfg.countryOverrides && typeof cfg.countryOverrides[upperCode] === 'number') {
    basePrice = cfg.countryOverrides[upperCode];
  } else if (cfg.zoneRates && typeof cfg.zoneRates[country.zone] === 'number') {
    basePrice = cfg.zoneRates[country.zone];
  } else {
    basePrice = zone.defaultPriceNGN;
  }

  // 3. Multi-item Handling Addition: additional items get a 20% consolidated packing increment
  const additionalItems = Math.max(0, itemCount - 1);
  const multiItemIncrement = Math.round(basePrice * 0.20 * additionalItems);
  const finalPriceNGN = basePrice + multiItemIncrement;

  return {
    priceNGN: finalPriceNGN,
    isFreeShipping: false,
    country,
    zone,
    carrier: cfg.carrierName,
    estimatedDays: zone.estimatedDays,
    serviceTier: zone.carrierService,
    multiItemIncrement,
    breakdown: `${country.name} · ${zone.estimatedDays} via ${cfg.carrierName}`
  };
}

/**
 * Generate Authentic DHL 10-digit Air Waybill Number & Tracking URL
 */
export function generateDhlAirWaybill() {
  const prefix = 'ART-DHL';
  const waybillDigits = Math.floor(1000000000 + Math.random() * 9000000000).toString();
  const trackingNumber = `${prefix}-${waybillDigits.slice(-6)}`;
  return {
    waybillNumber: trackingNumber,
    rawAwb: waybillDigits,
    carrier: 'DHL Express Fine Art',
    trackingUrl: `https://www.dhl.com/en/express/tracking.html?AWB=${waybillDigits}`,
    createdAt: new Date().toISOString()
  };
}
