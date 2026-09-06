/**
 * ARTELLIUM AFRICA - FINE ART DELIVERY TRACKING ENGINE
 * Comprehensive Multi-Role Tracking Lifecycle & Checkpoint Utilities
 */

export const TRACKING_STAGES = [
  {
    id: 'payment_confirmed',
    step: 1,
    label: 'Payment Settled via WEMA Bank',
    shortLabel: 'Payment Settled',
    description: 'Order logged & corporate escrow settlement confirmed. Dual provenance certificate minted.',
    badgeClass: 'bg-blue-100 text-blue-800 border-blue-200',
    iconName: 'CreditCard'
  },
  {
    id: 'curation_verification',
    step: 2,
    label: 'Atelier Curation & COA Verification',
    shortLabel: 'COA Verification',
    description: 'Physical inspection at accredited atelier. Holographic seal & Dual Certificate of Authenticity signed by master artist.',
    badgeClass: 'bg-amber-100 text-amber-800 border-amber-200',
    iconName: 'ShieldCheck'
  },
  {
    id: 'archival_crating',
    step: 3,
    label: 'Museum-Grade Packaging & Crating',
    shortLabel: 'Archival Crating',
    description: 'Masterpiece secured in climate-controlled archival timber casing with shock sensors and tamper-evident seals.',
    badgeClass: 'bg-purple-100 text-purple-800 border-purple-200',
    iconName: 'Package'
  },
  {
    id: 'in_transit',
    step: 4,
    label: 'Dispatched & In Transit',
    shortLabel: 'In Transit',
    description: 'Handed over to insured international fine art logistics carrier. Air waybill and customs clearance initiated.',
    badgeClass: 'bg-indigo-100 text-indigo-800 border-indigo-200',
    iconName: 'Truck'
  },
  {
    id: 'out_for_delivery',
    step: 5,
    label: 'Out for Final Delivery',
    shortLabel: 'Out for Delivery',
    description: 'Dispatched with local bonded courier for direct white-glove delivery to collector residence or gallery.',
    badgeClass: 'bg-orange-100 text-orange-800 border-orange-200',
    iconName: 'MapPin'
  },
  {
    id: 'delivered',
    step: 6,
    label: 'Delivered & Collector Verified',
    shortLabel: 'Delivered',
    description: 'White-glove handover completed. Physical certificate inspected and delivery confirmed by collector.',
    badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    iconName: 'CheckCircle2'
  }
];

export const CARRIER_OPTIONS = [
  { id: 'dhl', name: 'DHL Express Fine Art', trackingUrlPrefix: 'https://www.dhl.com/en/express/tracking.html?AWB=' },
  { id: 'fedex', name: 'FedEx Priority Freight', trackingUrlPrefix: 'https://www.fedex.com/fedextrack/?trknbr=' },
  { id: 'artellium_courier', name: 'Artellium Insured Courier', trackingUrlPrefix: '#' },
  { id: 'gig', name: 'GIG Logistics Pan-Africa', trackingUrlPrefix: 'https://giglogistics.com/track/?tracking_code=' },
  { id: 'bollore', name: 'Africa Global Logistics (Bolloré)', trackingUrlPrefix: '#' }
];

export function getStageConfig(stageId) {
  return TRACKING_STAGES.find(s => s.id === stageId) || TRACKING_STAGES[0];
}

export function getStageStep(stageId) {
  const cfg = getStageConfig(stageId);
  return cfg ? cfg.step : 1;
}

export function isStageCompleted(stageId, currentStageId) {
  const stepTarget = getStageStep(stageId);
  const stepCurrent = getStageStep(currentStageId);
  return stepCurrent >= stepTarget;
}

export function isCurrentStage(stageId, currentStageId) {
  return stageId === currentStageId;
}

export function generateTrackingNumber(carrierName = 'DHL') {
  const code = carrierName.includes('FedEx') ? 'FDX' : carrierName.includes('GIG') ? 'GIG' : 'DHL';
  const randomNum = Math.floor(100000 + Math.random() * 900000);
  return `ART-${code}-${randomNum}`;
}

export function createInitialTracking({
  carrier = 'DHL Express Fine Art',
  origin = 'Lagos Atelier, Nigeria',
  destination = 'Collector Residence / Fine Art Vault',
  currentStage = 'payment_confirmed',
  estimatedDays = 7
} = {}) {
  const now = new Date();
  const estDate = new Date(now.getTime() + estimatedDays * 24 * 60 * 60 * 1000);
  const trackingNumber = generateTrackingNumber(carrier);

  return {
    trackingNumber,
    carrier,
    currentStage,
    origin,
    destination,
    estimatedDelivery: estDate.toISOString().split('T')[0],
    currentLocation: origin,
    lastUpdated: now.toISOString(),
    checkpoints: [
      {
        id: `chk-${Date.now()}-1`,
        stage: 'payment_confirmed',
        title: 'Order Confirmed & Payment Settled via WEMA Bank',
        location: 'Artellium Treasury Desk, Lagos',
        timestamp: now.toISOString(),
        note: 'Direct WEMA Bank PLC settlement confirmed. Dual Certificate of Authenticity minting initialized.',
        completed: true
      }
    ]
  };
}
