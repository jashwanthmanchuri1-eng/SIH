export type QualityGrade = 'Grade A' | 'Grade B' | 'Grade C';

export type SellRecommendation = 'SELL_NOW' | 'CONSIDER_WAITING' | 'HIGH_RISK_DECLINE';

export type LanguageCode = 'Kannada' | 'Telugu' | 'Hindi' | 'English';

export interface CropLot {
  id: string;
  farmerName: string;
  farmerPhone: string;
  cropName: string;
  variety: string;
  quantityKg: number;
  grade: QualityGrade;
  harvestDate: string;
  location: string;
  coordinates?: { lat: number; lng: number };
  photoUrl: string;
  benchmarkMandiPrice: number;
  nearestMandiName: string;
  status: 'active' | 'negotiating' | 'contracted' | 'completed';
  createdAt: string;
}

export interface Buyer {
  id: string;
  name: string;
  organizationType: 'Hotel Chain' | 'Retail Supermarket' | 'Food Processor' | 'Quick Commerce Dark Store' | 'Wholesaler';
  location: string;
  distanceKm: number;
  trustScore: number; // 0 - 100
  rating: number; // 1 - 5
  completedPurchases: number;
  onTimePaymentPercent: number;
  cancellationRatePercent: number;
  disputeRatePercent: number;
  verifiedBadge: boolean;
  avatarUrl: string;
  paymentMethod: string;
}

export interface BuyerOffer {
  id: string;
  lotId: string;
  buyerId: string;
  buyerName: string;
  buyerType: string;
  buyerTrustScore: number;
  distanceKm: number;
  offeredPricePerKg: number;
  transportCostPerKg: number;
  handlingCostPerKg: number;
  netFarmerRealizationPerKg: number;
  totalNetRealization: number;
  deliveryWindow: string;
  paymentTerms: string;
  isRecommended: boolean;
  notes: string;
  status: 'active' | 'accepted' | 'declined';
}

export interface ReverseRequirement {
  id: string;
  buyerId: string;
  buyerName: string;
  buyerType: string;
  trustScore: number;
  cropName: string;
  requiredQuantityKg: number;
  fulfilledQuantityKg: number;
  targetPriceMin: number;
  targetPriceMax: number;
  grade: QualityGrade;
  deliveryLocation: string;
  deadlineHours: number;
  deliveryDate: string;
  matchingFarmersCount: number;
  offersCount: number;
  status: 'open' | 'fulfilling' | 'closed';
  specialRequirements: string[];
}

export interface FarmerBid {
  id: string;
  requirementId: string;
  farmerName: string;
  farmerLocation: string;
  quantityKg: number;
  offeredPricePerKg: number;
  grade: QualityGrade;
  distanceKm: number;
  reliabilityScore: number;
  transportCostPerKg: number;
  netRealizationPerKg: number;
  submittedAt: string;
  status: 'pending' | 'selected' | 'countered' | 'declined';
}

export interface MarketIntelligence {
  cropName: string;
  location: string;
  benchmarkMandiPrice: number;
  fairPriceRange: [number, number];
  recommendedPrice: number;
  confidenceScore: number;
  confidenceReason: string;
  sellRecommendation: SellRecommendation;
  sellRecommendationReason: string;
  demandLevel: 'HIGH' | 'MODERATE' | 'LOW';
  supplyFactor: string;
  potentialNetUpsidePercent: number;
  arrivalTrend: string;
  priceTrendHistory: {
    day: string;
    mandiPrice: number;
    fairPrice: number;
    buyerDemandIndex: number;
  }[];
}

export interface QualityAnalysisResult {
  cropName: string;
  grade: QualityGrade;
  confidenceScore: number;
  visualQualitySummary: string;
  defectRatePercent: number;
  ripenessStage: string;
  priceImpact: string;
  gradingNotes: string[];
}

export interface DigitalDealMilestone {
  step: number;
  title: string;
  timestamp: string;
  isCompleted: boolean;
  isCurrent: boolean;
  detail: string;
}

export interface DigitalDeal {
  id: string;
  dealNumber: string;
  lotId: string;
  cropName: string;
  quantityKg: number;
  farmerName: string;
  buyerName: string;
  buyerTrustScore: number;
  grossPricePerKg: number;
  transportPerKg: number;
  netRealizationPerKg: number;
  totalFarmerPayout: number;
  deliveryDate: string;
  destinationHub: string;
  paymentStatus: 'ESCROW_LOCKED' | 'TRANSIT_INSPECTION' | 'RELEASED_TO_FARMER';
  createdAt: string;
  milestones: DigitalDealMilestone[];
}

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  phone?: string;
  role: 'farmer' | 'buyer';
  organizationName?: string;
  location: string;
  avatarUrl?: string;
  isVerified?: boolean;
}

export interface SupabaseSyncStatus {
  isConfigured: boolean;
  isConnected: boolean;
  supabaseUrl?: string;
  lastSyncedAt?: string;
  tablesStatus?: {
    cropLots: boolean;
    buyerOffers: boolean;
    reverseRequirements: boolean;
    farmerBids: boolean;
    digitalDeals: boolean;
  };
  errorMessage?: string;
}
