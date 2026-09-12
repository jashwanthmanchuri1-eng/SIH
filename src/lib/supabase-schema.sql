-- ==========================================================
-- FarmLink AI: Supabase Database Schema
-- Run this SQL in your Supabase SQL Editor (https://supabase.com/dashboard/project/_/sql)
-- ==========================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Crop Lots Table (Farmer Harvest Listings)
CREATE TABLE IF NOT EXISTS public.crop_lots (
    id TEXT PRIMARY KEY,
    farmer_name TEXT NOT NULL,
    farmer_phone TEXT,
    crop_name TEXT NOT NULL,
    variety TEXT,
    quantity_kg NUMERIC NOT NULL,
    grade TEXT NOT NULL DEFAULT 'Grade A',
    harvest_date TEXT NOT NULL,
    location TEXT NOT NULL,
    photo_url TEXT,
    benchmark_mandi_price NUMERIC NOT NULL DEFAULT 25,
    nearest_mandi_name TEXT,
    status TEXT NOT NULL DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Buyer Offers Table (Direct Offers on Farmer Produce)
CREATE TABLE IF NOT EXISTS public.buyer_offers (
    id TEXT PRIMARY KEY,
    lot_id TEXT REFERENCES public.crop_lots(id) ON DELETE CASCADE,
    buyer_id TEXT NOT NULL,
    buyer_name TEXT NOT NULL,
    buyer_type TEXT NOT NULL,
    buyer_trust_score NUMERIC DEFAULT 90,
    distance_km NUMERIC DEFAULT 20,
    offered_price_per_kg NUMERIC NOT NULL,
    transport_cost_per_kg NUMERIC NOT NULL DEFAULT 1.0,
    handling_cost_per_kg NUMERIC NOT NULL DEFAULT 0,
    net_farmer_realization_per_kg NUMERIC NOT NULL,
    total_net_realization NUMERIC NOT NULL,
    delivery_window TEXT,
    payment_terms TEXT DEFAULT 'Smart Escrow Guaranteed',
    is_recommended BOOLEAN DEFAULT false,
    notes TEXT,
    status TEXT NOT NULL DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Reverse Requirements Table (Buyer-Led Bulk Demands)
CREATE TABLE IF NOT EXISTS public.reverse_requirements (
    id TEXT PRIMARY KEY,
    buyer_id TEXT NOT NULL,
    buyer_name TEXT NOT NULL,
    buyer_type TEXT NOT NULL,
    trust_score NUMERIC DEFAULT 92,
    crop_name TEXT NOT NULL,
    required_quantity_kg NUMERIC NOT NULL,
    fulfilled_quantity_kg NUMERIC DEFAULT 0,
    target_price_min NUMERIC NOT NULL,
    target_price_max NUMERIC NOT NULL,
    grade TEXT NOT NULL DEFAULT 'Grade A',
    delivery_location TEXT NOT NULL,
    deadline_hours NUMERIC DEFAULT 48,
    delivery_date TEXT NOT NULL,
    matching_farmers_count NUMERIC DEFAULT 0,
    offers_count NUMERIC DEFAULT 0,
    status TEXT NOT NULL DEFAULT 'open',
    special_requirements JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. Farmer Bids Table (Bids placed by farmers on buyer requirements)
CREATE TABLE IF NOT EXISTS public.farmer_bids (
    id TEXT PRIMARY KEY,
    requirement_id TEXT REFERENCES public.reverse_requirements(id) ON DELETE CASCADE,
    farmer_name TEXT NOT NULL,
    farmer_location TEXT NOT NULL,
    quantity_kg NUMERIC NOT NULL,
    offered_price_per_kg NUMERIC NOT NULL,
    grade TEXT NOT NULL DEFAULT 'Grade A',
    distance_km NUMERIC DEFAULT 25,
    reliability_score NUMERIC DEFAULT 90,
    transport_cost_per_kg NUMERIC DEFAULT 1.0,
    net_realization_per_kg NUMERIC NOT NULL,
    submitted_at TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. Digital Deals & Auditable Escrow Ledger Table
CREATE TABLE IF NOT EXISTS public.digital_deals (
    id TEXT PRIMARY KEY,
    deal_number TEXT NOT NULL UNIQUE,
    lot_id TEXT,
    crop_name TEXT NOT NULL,
    quantity_kg NUMERIC NOT NULL,
    farmer_name TEXT NOT NULL,
    buyer_name TEXT NOT NULL,
    buyer_trust_score NUMERIC DEFAULT 94,
    gross_price_per_kg NUMERIC NOT NULL,
    transport_per_kg NUMERIC NOT NULL,
    net_realization_per_kg NUMERIC NOT NULL,
    total_farmer_payout NUMERIC NOT NULL,
    delivery_date TEXT,
    destination_hub TEXT,
    payment_status TEXT NOT NULL DEFAULT 'ESCROW_LOCKED',
    milestones JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 7. User Profiles Table
CREATE TABLE IF NOT EXISTS public.profiles (
    id TEXT PRIMARY KEY,
    email TEXT,
    phone TEXT,
    name TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'farmer',
    organization_name TEXT,
    location TEXT,
    avatar_url TEXT,
    is_verified BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 8. Enable Public Access for Prototype / RLS policies
ALTER TABLE public.crop_lots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.buyer_offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reverse_requirements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.farmer_bids ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.digital_deals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Allow anon read & write for app demonstration
CREATE POLICY "Public read crop_lots" ON public.crop_lots FOR SELECT USING (true);
CREATE POLICY "Public insert/update crop_lots" ON public.crop_lots FOR ALL USING (true);

CREATE POLICY "Public read buyer_offers" ON public.buyer_offers FOR SELECT USING (true);
CREATE POLICY "Public insert/update buyer_offers" ON public.buyer_offers FOR ALL USING (true);

CREATE POLICY "Public read reverse_requirements" ON public.reverse_requirements FOR SELECT USING (true);
CREATE POLICY "Public insert/update reverse_requirements" ON public.reverse_requirements FOR ALL USING (true);

CREATE POLICY "Public read farmer_bids" ON public.farmer_bids FOR SELECT USING (true);
CREATE POLICY "Public insert/update farmer_bids" ON public.farmer_bids FOR ALL USING (true);

CREATE POLICY "Public read digital_deals" ON public.digital_deals FOR SELECT USING (true);
CREATE POLICY "Public insert/update digital_deals" ON public.digital_deals FOR ALL USING (true);

CREATE POLICY "Public read profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Public insert/update profiles" ON public.profiles FOR ALL USING (true);
