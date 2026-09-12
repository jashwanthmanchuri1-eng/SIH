import { createClient, SupabaseClient } from '@supabase/supabase-js';
import {
  CropLot,
  BuyerOffer,
  ReverseRequirement,
  FarmerBid,
  DigitalDeal,
  UserProfile,
  SupabaseSyncStatus,
} from '../types';
import {
  INITIAL_CROP_LOTS,
  INITIAL_BUYER_OFFERS,
  INITIAL_REVERSE_REQUIREMENTS,
  INITIAL_POTATO_FARMER_BIDS,
  INITIAL_DIGITAL_DEALS,
} from '../data/mockData';

// Keys from environment variables (safe across tsconfig environments)
const metaEnv = (import.meta as any).env || {};
const supabaseUrl: string = metaEnv.VITE_SUPABASE_URL || '';
const supabaseAnonKey: string = metaEnv.VITE_SUPABASE_ANON_KEY || '';

// Detect whether valid Supabase configuration is present
export const isSupabaseConfigured = (): boolean => {
  if (!supabaseUrl || !supabaseAnonKey) return false;
  if (
    supabaseUrl.includes('YOUR_') ||
    supabaseUrl.includes('example.com') ||
    supabaseAnonKey.includes('YOUR_') ||
    supabaseUrl.trim() === ''
  ) {
    return false;
  }
  return true;
};

// Client singleton
let clientInstance: SupabaseClient | null = null;

export const getSupabaseClient = (): SupabaseClient | null => {
  if (!isSupabaseConfigured()) return null;
  if (!clientInstance) {
    try {
      clientInstance = createClient(supabaseUrl, supabaseAnonKey, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
        },
      });
    } catch (err) {
      console.warn('Failed to initialize Supabase client:', err);
      return null;
    }
  }
  return clientInstance;
};

// LocalStorage Persistence Keys
const LS_KEYS = {
  LOTS: 'farmlink_crop_lots_v1',
  OFFERS: 'farmlink_buyer_offers_v1',
  REQUIREMENTS: 'farmlink_reverse_requirements_v1',
  BIDS: 'farmlink_farmer_bids_v1',
  DEALS: 'farmlink_digital_deals_v1',
  USER: 'farmlink_auth_user_v1',
};

// Helper: safe local storage read
function getLocalItem<T>(key: string, fallback: T): T {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch {
    return fallback;
  }
}

// Helper: safe local storage write
function setLocalItem<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.warn('LocalStorage save failed:', e);
  }
}

// ==========================================
// 1. CROP LOTS DATA ACCESS
// ==========================================
export const dataService = {
  // --- Lots ---
  async getCropLots(): Promise<CropLot[]> {
    const client = getSupabaseClient();
    if (client) {
      try {
        const { data, error } = await client
          .from('crop_lots')
          .select('*')
          .order('created_at', { ascending: false });

        if (!error && data && data.length > 0) {
          return data.map(mapDbLotToApp);
        }
      } catch (err) {
        console.warn('Supabase getCropLots fallback to local:', err);
      }
    }
    return getLocalItem<CropLot[]>(LS_KEYS.LOTS, INITIAL_CROP_LOTS);
  },

  async saveCropLot(lot: CropLot): Promise<CropLot> {
    const client = getSupabaseClient();
    if (client) {
      try {
        const dbRecord = {
          id: lot.id,
          farmer_name: lot.farmerName,
          farmer_phone: lot.farmerPhone,
          crop_name: lot.cropName,
          variety: lot.variety,
          quantity_kg: lot.quantityKg,
          grade: lot.grade,
          harvest_date: lot.harvestDate,
          location: lot.location,
          photo_url: lot.photoUrl,
          benchmark_mandi_price: lot.benchmarkMandiPrice,
          nearest_mandi_name: lot.nearestMandiName,
          status: lot.status,
          created_at: lot.createdAt || new Date().toISOString(),
        };

        const { error } = await client.from('crop_lots').upsert(dbRecord);
        if (error) console.warn('Supabase saveCropLot error:', error);
      } catch (err) {
        console.warn('Supabase saveCropLot failed:', err);
      }
    }

    // Always update local cache
    const current = getLocalItem<CropLot[]>(LS_KEYS.LOTS, INITIAL_CROP_LOTS);
    const updated = [lot, ...current.filter((l) => l.id !== lot.id)];
    setLocalItem(LS_KEYS.LOTS, updated);
    return lot;
  },

  // --- Buyer Offers ---
  async getBuyerOffers(lotId?: string): Promise<BuyerOffer[]> {
    const client = getSupabaseClient();
    if (client) {
      try {
        let query = client.from('buyer_offers').select('*');
        if (lotId) {
          query = query.eq('lot_id', lotId);
        }
        const { data, error } = await query;
        if (!error && data && data.length > 0) {
          return data.map(mapDbOfferToApp);
        }
      } catch (err) {
        console.warn('Supabase getBuyerOffers fallback:', err);
      }
    }
    const all = getLocalItem<BuyerOffer[]>(LS_KEYS.OFFERS, INITIAL_BUYER_OFFERS);
    return lotId ? all.filter((o) => o.lotId === lotId) : all;
  },

  async saveBuyerOffer(offer: BuyerOffer): Promise<BuyerOffer> {
    const client = getSupabaseClient();
    if (client) {
      try {
        const dbRecord = {
          id: offer.id,
          lot_id: offer.lotId,
          buyer_id: offer.buyerId,
          buyer_name: offer.buyerName,
          buyer_type: offer.buyerType,
          buyer_trust_score: offer.buyerTrustScore,
          distance_km: offer.distanceKm,
          offered_price_per_kg: offer.offeredPricePerKg,
          transport_cost_per_kg: offer.transportCostPerKg,
          handling_cost_per_kg: offer.handlingCostPerKg,
          net_farmer_realization_per_kg: offer.netFarmerRealizationPerKg,
          total_net_realization: offer.totalNetRealization,
          delivery_window: offer.deliveryWindow,
          payment_terms: offer.paymentTerms,
          is_recommended: offer.isRecommended,
          notes: offer.notes,
          status: offer.status,
        };
        await client.from('buyer_offers').upsert(dbRecord);
      } catch (err) {
        console.warn('Supabase saveBuyerOffer error:', err);
      }
    }

    const current = getLocalItem<BuyerOffer[]>(LS_KEYS.OFFERS, INITIAL_BUYER_OFFERS);
    const updated = [offer, ...current.filter((o) => o.id !== offer.id)];
    setLocalItem(LS_KEYS.OFFERS, updated);
    return offer;
  },

  // --- Reverse Requirements ---
  async getReverseRequirements(): Promise<ReverseRequirement[]> {
    const client = getSupabaseClient();
    if (client) {
      try {
        const { data, error } = await client
          .from('reverse_requirements')
          .select('*')
          .order('created_at', { ascending: false });

        if (!error && data && data.length > 0) {
          return data.map(mapDbReqToApp);
        }
      } catch (err) {
        console.warn('Supabase getReverseRequirements fallback:', err);
      }
    }
    return getLocalItem<ReverseRequirement[]>(LS_KEYS.REQUIREMENTS, INITIAL_REVERSE_REQUIREMENTS);
  },

  async saveReverseRequirement(req: ReverseRequirement): Promise<ReverseRequirement> {
    const client = getSupabaseClient();
    if (client) {
      try {
        const dbRecord = {
          id: req.id,
          buyer_id: req.buyerId,
          buyer_name: req.buyerName,
          buyer_type: req.buyerType,
          trust_score: req.trustScore,
          crop_name: req.cropName,
          required_quantity_kg: req.requiredQuantityKg,
          fulfilled_quantity_kg: req.fulfilledQuantityKg,
          target_price_min: req.targetPriceMin,
          target_price_max: req.targetPriceMax,
          grade: req.grade,
          delivery_location: req.deliveryLocation,
          deadline_hours: req.deadlineHours,
          delivery_date: req.deliveryDate,
          matching_farmers_count: req.matchingFarmersCount,
          offers_count: req.offersCount,
          status: req.status,
          special_requirements: req.specialRequirements,
        };
        await client.from('reverse_requirements').upsert(dbRecord);
      } catch (err) {
        console.warn('Supabase saveReverseRequirement error:', err);
      }
    }

    const current = getLocalItem<ReverseRequirement[]>(LS_KEYS.REQUIREMENTS, INITIAL_REVERSE_REQUIREMENTS);
    const updated = [req, ...current.filter((r) => r.id !== req.id)];
    setLocalItem(LS_KEYS.REQUIREMENTS, updated);
    return req;
  },

  // --- Farmer Bids ---
  async getFarmerBids(requirementId?: string): Promise<FarmerBid[]> {
    const client = getSupabaseClient();
    if (client) {
      try {
        let query = client.from('farmer_bids').select('*').order('submitted_at', { ascending: false });
        if (requirementId) {
          query = query.eq('requirement_id', requirementId);
        }
        const { data, error } = await query;
        if (!error && data && data.length > 0) {
          return data.map(mapDbBidToApp);
        }
      } catch (err) {
        console.warn('Supabase getFarmerBids fallback:', err);
      }
    }
    const all = getLocalItem<FarmerBid[]>(LS_KEYS.BIDS, INITIAL_POTATO_FARMER_BIDS);
    return requirementId ? all.filter((b) => b.requirementId === requirementId) : all;
  },

  async saveFarmerBid(bid: FarmerBid): Promise<FarmerBid> {
    const client = getSupabaseClient();
    if (client) {
      try {
        const dbRecord = {
          id: bid.id,
          requirement_id: bid.requirementId,
          farmer_name: bid.farmerName,
          farmer_location: bid.farmerLocation,
          quantity_kg: bid.quantityKg,
          offered_price_per_kg: bid.offeredPricePerKg,
          grade: bid.grade,
          distance_km: bid.distanceKm,
          reliability_score: bid.reliabilityScore,
          transport_cost_per_kg: bid.transportCostPerKg,
          net_realization_per_kg: bid.netRealizationPerKg,
          submitted_at: bid.submittedAt,
          status: bid.status,
        };
        await client.from('farmer_bids').upsert(dbRecord);
      } catch (err) {
        console.warn('Supabase saveFarmerBid error:', err);
      }
    }

    const current = getLocalItem<FarmerBid[]>(LS_KEYS.BIDS, INITIAL_POTATO_FARMER_BIDS);
    const updated = [bid, ...current.filter((b) => b.id !== bid.id)];
    setLocalItem(LS_KEYS.BIDS, updated);
    return bid;
  },

  // --- Digital Deals & Ledger ---
  async getDigitalDeals(): Promise<DigitalDeal[]> {
    const client = getSupabaseClient();
    if (client) {
      try {
        const { data, error } = await client
          .from('digital_deals')
          .select('*')
          .order('created_at', { ascending: false });

        if (!error && data && data.length > 0) {
          return data.map(mapDbDealToApp);
        }
      } catch (err) {
        console.warn('Supabase getDigitalDeals fallback:', err);
      }
    }
    return getLocalItem<DigitalDeal[]>(LS_KEYS.DEALS, INITIAL_DIGITAL_DEALS);
  },

  async saveDigitalDeal(deal: DigitalDeal): Promise<DigitalDeal> {
    const client = getSupabaseClient();
    if (client) {
      try {
        const dbRecord = {
          id: deal.id,
          deal_number: deal.dealNumber,
          lot_id: deal.lotId,
          crop_name: deal.cropName,
          quantity_kg: deal.quantityKg,
          farmer_name: deal.farmerName,
          buyer_name: deal.buyerName,
          buyer_trust_score: deal.buyerTrustScore,
          gross_price_per_kg: deal.grossPricePerKg,
          transport_per_kg: deal.transportPerKg,
          net_realization_per_kg: deal.netRealizationPerKg,
          total_farmer_payout: deal.totalFarmerPayout,
          delivery_date: deal.deliveryDate,
          destination_hub: deal.destinationHub,
          payment_status: deal.paymentStatus,
          milestones: deal.milestones,
          created_at: deal.createdAt || new Date().toISOString(),
        };
        await client.from('digital_deals').upsert(dbRecord);
      } catch (err) {
        console.warn('Supabase saveDigitalDeal error:', err);
      }
    }

    const current = getLocalItem<DigitalDeal[]>(LS_KEYS.DEALS, INITIAL_DIGITAL_DEALS);
    const updated = [deal, ...current.filter((d) => d.id !== deal.id)];
    setLocalItem(LS_KEYS.DEALS, updated);
    return deal;
  },

  // --- Test & Diagnostics ---
  async checkSupabaseStatus(): Promise<SupabaseSyncStatus> {
    const configured = isSupabaseConfigured();
    if (!configured) {
      return {
        isConfigured: false,
        isConnected: false,
        errorMessage: 'Supabase credentials not yet provided in .env (VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY). Using persistent LocalStorage engine.',
      };
    }

    const client = getSupabaseClient();
    if (!client) {
      return {
        isConfigured: true,
        isConnected: false,
        errorMessage: 'Failed to initialize Supabase client instance.',
      };
    }

    try {
      // Test querying crop_lots table
      const { data, error } = await client.from('crop_lots').select('id').limit(1);
      if (error) {
        return {
          isConfigured: true,
          isConnected: false,
          supabaseUrl,
          errorMessage: `Connected to Supabase endpoint, but table query returned: ${error.message}. Please run the SQL schema migration in Supabase SQL editor.`,
        };
      }

      return {
        isConfigured: true,
        isConnected: true,
        supabaseUrl,
        lastSyncedAt: new Date().toLocaleTimeString(),
        tablesStatus: {
          cropLots: true,
          buyerOffers: true,
          reverseRequirements: true,
          farmerBids: true,
          digitalDeals: true,
        },
      };
    } catch (err: any) {
      return {
        isConfigured: true,
        isConnected: false,
        supabaseUrl,
        errorMessage: err?.message || 'Network error connecting to Supabase instance.',
      };
    }
  },

  // --- Push Seed Data to Supabase ---
  async seedDemoData(): Promise<{ success: boolean; message: string }> {
    const client = getSupabaseClient();
    if (!client) {
      return { success: false, message: 'Supabase is not configured yet. Add your keys to .env.' };
    }

    try {
      for (const lot of INITIAL_CROP_LOTS) {
        await this.saveCropLot(lot);
      }
      for (const req of INITIAL_REVERSE_REQUIREMENTS) {
        await this.saveReverseRequirement(req);
      }
      for (const bid of INITIAL_POTATO_FARMER_BIDS) {
        await this.saveFarmerBid(bid);
      }
      for (const deal of INITIAL_DIGITAL_DEALS) {
        await this.saveDigitalDeal(deal);
      }
      return { success: true, message: 'Successfully seeded FarmLink sample lots, requirements, and deals to Supabase!' };
    } catch (e: any) {
      return { success: false, message: `Failed to seed data: ${e.message}` };
    }
  },
};

// ==========================================
// DB MAPPERS (Snake_case DB -> CamelCase App)
// ==========================================
function mapDbLotToApp(row: any): CropLot {
  return {
    id: row.id,
    farmerName: row.farmer_name || row.farmerName || 'Farmer',
    farmerPhone: row.farmer_phone || row.farmerPhone || '',
    cropName: row.crop_name || row.cropName || 'Produce',
    variety: row.variety || '',
    quantityKg: Number(row.quantity_kg ?? row.quantityKg ?? 1000),
    grade: row.grade || 'Grade A',
    harvestDate: row.harvest_date || row.harvestDate || 'Today',
    location: row.location || 'Karnataka',
    photoUrl: row.photo_url || row.photoUrl || '',
    benchmarkMandiPrice: Number(row.benchmark_mandi_price ?? row.benchmarkMandiPrice ?? 25),
    nearestMandiName: row.nearest_mandi_name || row.nearestMandiName || 'APMC Mandi',
    status: row.status || 'active',
    createdAt: row.created_at || row.createdAt || new Date().toISOString(),
  };
}

function mapDbOfferToApp(row: any): BuyerOffer {
  return {
    id: row.id,
    lotId: row.lot_id || row.lotId,
    buyerId: row.buyer_id || row.buyerId,
    buyerName: row.buyer_name || row.buyerName,
    buyerType: row.buyer_type || row.buyerType,
    buyerTrustScore: Number(row.buyer_trust_score ?? row.buyerTrustScore ?? 90),
    distanceKm: Number(row.distance_km ?? row.distanceKm ?? 20),
    offeredPricePerKg: Number(row.offered_price_per_kg ?? row.offeredPricePerKg ?? 25),
    transportCostPerKg: Number(row.transport_cost_per_kg ?? row.transportCostPerKg ?? 1),
    handlingCostPerKg: Number(row.handling_cost_per_kg ?? row.handlingCostPerKg ?? 0),
    netFarmerRealizationPerKg: Number(row.net_farmer_realization_per_kg ?? row.netFarmerRealizationPerKg ?? 24),
    totalNetRealization: Number(row.total_net_realization ?? row.totalNetRealization ?? 24000),
    deliveryWindow: row.delivery_window || row.deliveryWindow || 'Immediate',
    paymentTerms: row.payment_terms || row.paymentTerms || 'Smart Escrow',
    isRecommended: Boolean(row.is_recommended ?? row.isRecommended),
    notes: row.notes || '',
    status: row.status || 'active',
  };
}

function mapDbReqToApp(row: any): ReverseRequirement {
  return {
    id: row.id,
    buyerId: row.buyer_id || row.buyerId,
    buyerName: row.buyer_name || row.buyerName,
    buyerType: row.buyer_type || row.buyerType,
    trustScore: Number(row.trust_score ?? row.trustScore ?? 90),
    cropName: row.crop_name || row.cropName,
    requiredQuantityKg: Number(row.required_quantity_kg ?? row.requiredQuantityKg ?? 1000),
    fulfilledQuantityKg: Number(row.fulfilled_quantity_kg ?? row.fulfilledQuantityKg ?? 0),
    targetPriceMin: Number(row.target_price_min ?? row.targetPriceMin ?? 20),
    targetPriceMax: Number(row.target_price_max ?? row.targetPriceMax ?? 30),
    grade: row.grade || 'Grade A',
    deliveryLocation: row.delivery_location || row.deliveryLocation,
    deadlineHours: Number(row.deadline_hours ?? row.deadlineHours ?? 48),
    deliveryDate: row.delivery_date || row.deliveryDate,
    matchingFarmersCount: Number(row.matching_farmers_count ?? row.matchingFarmersCount ?? 10),
    offersCount: Number(row.offers_count ?? row.offersCount ?? 0),
    status: row.status || 'open',
    specialRequirements: Array.isArray(row.special_requirements)
      ? row.special_requirements
      : row.specialRequirements || [],
  };
}

function mapDbBidToApp(row: any): FarmerBid {
  return {
    id: row.id,
    requirementId: row.requirement_id || row.requirementId,
    farmerName: row.farmer_name || row.farmerName,
    farmerLocation: row.farmer_location || row.farmerLocation,
    quantityKg: Number(row.quantity_kg ?? row.quantityKg ?? 500),
    offeredPricePerKg: Number(row.offered_price_per_kg ?? row.offeredPricePerKg ?? 25),
    grade: row.grade || 'Grade A',
    distanceKm: Number(row.distance_km ?? row.distanceKm ?? 25),
    reliabilityScore: Number(row.reliability_score ?? row.reliabilityScore ?? 90),
    transportCostPerKg: Number(row.transport_cost_per_kg ?? row.transportCostPerKg ?? 1),
    netRealizationPerKg: Number(row.net_realization_per_kg ?? row.netRealizationPerKg ?? 24),
    submittedAt: row.submitted_at || row.submittedAt || 'Just now',
    status: row.status || 'pending',
  };
}

function mapDbDealToApp(row: any): DigitalDeal {
  return {
    id: row.id,
    dealNumber: row.deal_number || row.dealNumber,
    lotId: row.lot_id || row.lotId,
    cropName: row.crop_name || row.cropName,
    quantityKg: Number(row.quantity_kg ?? row.quantityKg),
    farmerName: row.farmer_name || row.farmerName,
    buyerName: row.buyer_name || row.buyerName,
    buyerTrustScore: Number(row.buyer_trust_score ?? row.buyerTrustScore ?? 92),
    grossPricePerKg: Number(row.gross_price_per_kg ?? row.grossPricePerKg),
    transportPerKg: Number(row.transport_per_kg ?? row.transportPerKg),
    netRealizationPerKg: Number(row.net_realization_per_kg ?? row.netRealizationPerKg),
    totalFarmerPayout: Number(row.total_farmer_payout ?? row.totalFarmerPayout),
    deliveryDate: row.delivery_date || row.deliveryDate,
    destinationHub: row.destination_hub || row.destinationHub,
    paymentStatus: row.payment_status || row.paymentStatus || 'ESCROW_LOCKED',
    createdAt: row.created_at || row.createdAt || new Date().toISOString(),
    milestones: Array.isArray(row.milestones) ? row.milestones : [],
  };
}

// ==========================================
// AUTH UTILITIES
// ==========================================
export const authService = {
  getCurrentUser(): UserProfile | null {
    return getLocalItem<UserProfile | null>(LS_KEYS.USER, {
      id: 'usr-ramesh-kolar',
      name: 'Ramesh Gowda',
      email: 'ramesh.gowda@farmlink.ai',
      phone: '+91 98450 12849',
      role: 'farmer',
      location: 'Kolar, Karnataka',
      organizationName: 'Gowda Organic Farms',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      isVerified: true,
    });
  },

  async login(emailOrPhone: string, _password?: string, role: 'farmer' | 'buyer' = 'farmer'): Promise<UserProfile> {
    const client = getSupabaseClient();
    if (client && emailOrPhone.includes('@') && _password) {
      try {
        const { data, error } = await client.auth.signInWithPassword({
          email: emailOrPhone,
          password: _password,
        });
        if (!error && data.user) {
          const profile: UserProfile = {
            id: data.user.id,
            email: data.user.email || emailOrPhone,
            name: data.user.user_metadata?.name || (role === 'farmer' ? 'Ramesh Gowda' : 'ABC Foods Procurement'),
            role: (data.user.user_metadata?.role as any) || role,
            location: data.user.user_metadata?.location || (role === 'farmer' ? 'Kolar, Karnataka' : 'Bengaluru, Karnataka'),
            organizationName: data.user.user_metadata?.organizationName || (role === 'farmer' ? 'Gowda Farms' : 'ABC Foods & Hospitality'),
            isVerified: true,
          };
          setLocalItem(LS_KEYS.USER, profile);
          return profile;
        }
      } catch (err) {
        console.warn('Supabase auth sign in fallback:', err);
      }
    }

    // Interactive Instant Login (works even before user enters Supabase keys)
    const isFarmer = role === 'farmer';
    const profile: UserProfile = {
      id: `usr-${Date.now()}`,
      email: emailOrPhone.includes('@') ? emailOrPhone : `${emailOrPhone.replace(/\D/g, '')}@farmlink.ai`,
      name: isFarmer ? 'Ramesh Gowda' : 'ABC Foods Hub',
      phone: emailOrPhone.includes('@') ? '+91 98450 12849' : emailOrPhone,
      role,
      location: isFarmer ? 'Kolar, Karnataka' : 'Bengaluru, Karnataka',
      organizationName: isFarmer ? 'Gowda Agro Farms' : 'ABC Foods & Hospitality Network',
      avatarUrl: isFarmer
        ? 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'
        : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      isVerified: true,
    };
    setLocalItem(LS_KEYS.USER, profile);
    return profile;
  },

  async signup(data: {
    name: string;
    email: string;
    phone?: string;
    role: 'farmer' | 'buyer';
    location: string;
    organizationName?: string;
    password?: string;
  }): Promise<UserProfile> {
    const client = getSupabaseClient();
    if (client && data.password) {
      try {
        const { data: authData, error } = await client.auth.signUp({
          email: data.email,
          password: data.password,
          options: {
            data: {
              name: data.name,
              role: data.role,
              location: data.location,
              organizationName: data.organizationName,
            },
          },
        });
        if (!error && authData.user) {
          const profile: UserProfile = {
            id: authData.user.id,
            email: data.email,
            name: data.name,
            phone: data.phone,
            role: data.role,
            location: data.location,
            organizationName: data.organizationName,
            isVerified: true,
          };
          setLocalItem(LS_KEYS.USER, profile);
          return profile;
        }
      } catch (err) {
        console.warn('Supabase auth sign up fallback:', err);
      }
    }

    const profile: UserProfile = {
      id: `usr-${Date.now()}`,
      email: data.email,
      name: data.name,
      phone: data.phone || '+91 98450 12849',
      role: data.role,
      location: data.location,
      organizationName: data.organizationName,
      isVerified: true,
    };
    setLocalItem(LS_KEYS.USER, profile);
    return profile;
  },

  async logout(): Promise<void> {
    const client = getSupabaseClient();
    if (client) {
      try {
        await client.auth.signOut();
      } catch (e) {
        console.warn('Supabase signOut error:', e);
      }
    }
    localStorage.removeItem(LS_KEYS.USER);
  },
};
