import React from 'react';
import {
  TrendingUp,
  ShieldCheck,
  Truck,
  ArrowUpRight,
  Sparkles,
  Info,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Mic,
  PlusCircle,
  Eye,
  Sliders,
  DollarSign,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';
import { CropLot, BuyerOffer, MarketIntelligence } from '../types';

interface FarmerHomeDashboardProps {
  lot: CropLot;
  marketIntel: MarketIntelligence;
  offers: BuyerOffer[];
  onOpenCalculator: () => void;
  onOpenVoiceModal: () => void;
  onOpenQualityModal: () => void;
  onOpenLotCreator: () => void;
  onAcceptOffer: (offer: BuyerOffer) => void;
  onSelectTab: (tab: string) => void;
}

export const FarmerHomeDashboard: React.FC<FarmerHomeDashboardProps> = ({
  lot,
  marketIntel,
  offers,
  onOpenCalculator,
  onOpenVoiceModal,
  onOpenQualityModal,
  onOpenLotCreator,
  onAcceptOffer,
  onSelectTab,
}) => {
  const bestOffer = offers.find((o) => o.isRecommended) || offers[0];

  // Calculated estimated net earnings based on best offer
  const estimatedNetEarnings = bestOffer
    ? lot.quantityKg * bestOffer.netFarmerRealizationPerKg
    : lot.quantityKg * marketIntel.benchmarkMandiPrice;

  // Additional income over Mandi
  const mandiTotal = lot.quantityKg * marketIntel.benchmarkMandiPrice;
  const additionalGain = estimatedNetEarnings - mandiTotal;

  return (
    <div className="space-y-6">
      
      {/* Top Banner: Quick Voice & Produce Action */}
      <div className="relative overflow-hidden rounded-2xl glass-panel p-4 sm:p-6 bg-gradient-to-r from-emerald-900/90 via-teal-900/90 to-slate-900 text-white shadow-xl">
        <div className="absolute -right-8 -top-8 w-44 h-44 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-400/20 text-emerald-300 text-xs font-semibold border border-emerald-400/30">
              <Sparkles className="h-3 w-3" />
              <span>Smart Market Decision Engine</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
              Good morning, {lot.farmerName.split(' ')[0]}!
            </h1>
            <p className="text-sm text-emerald-100/90 max-w-xl">
              Real-time fair price discovery, demand matching, and net transport realization for your harvest in <span className="font-semibold text-white">{lot.location}</span>.
            </p>
          </div>

          {/* Quick Voice Bar & Crop Action */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              id="voice-assistant-trigger"
              onClick={onOpenVoiceModal}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/15 hover:bg-white/25 border border-white/20 text-white text-xs sm:text-sm font-semibold backdrop-blur-md transition shadow-sm active:scale-95"
            >
              <Mic className="h-4 w-4 text-emerald-300 animate-pulse" />
              <span>Voice Assistant (ಕನ್ನಡ/हिंदी)</span>
            </button>
            <button
              id="add-crop-lot-trigger"
              onClick={onOpenLotCreator}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs sm:text-sm font-bold transition shadow-lg shadow-emerald-500/30 active:scale-95"
            >
              <PlusCircle className="h-4 w-4" />
              <span>Add New Lot</span>
            </button>
          </div>
        </div>
      </div>

      {/* SECTION 11: The Ridiculously Simple Farmer Summary Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-3 sm:gap-4">
        
        {/* Card 1: 🌾 My Crop */}
        <div className="col-span-2 sm:col-span-1 lg:col-span-2 glass-panel p-4 rounded-2xl flex flex-col justify-between hover:shadow-md transition">
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold uppercase tracking-wider mb-2">
            <span className="flex items-center gap-1.5">
              <span className="text-base">🌾</span> My Active Lot
            </span>
            <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold">
              {lot.grade}
            </span>
          </div>
          <div>
            <div className="text-lg sm:text-xl font-black text-slate-900 flex items-baseline gap-2">
              <span>{lot.cropName}</span>
              <span className="text-emerald-700 font-extrabold text-base">
                {lot.quantityKg.toLocaleString()} kg
              </span>
            </div>
            <div className="text-xs text-slate-500 mt-1 flex items-center gap-1">
              <span>Harvest: {lot.harvestDate}</span>
            </div>
          </div>
          <button
            onClick={onOpenQualityModal}
            className="mt-3 text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 group"
          >
            <span>Inspect AI Quality Grade</span>
            <ChevronRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

        {/* Card 2: 💰 Current Fair Price */}
        <div className="col-span-1 lg:col-span-1 glass-panel p-4 rounded-2xl flex flex-col justify-between hover:shadow-md transition">
          <div className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-1">
            💰 Fair Price
          </div>
          <div>
            <div className="text-lg sm:text-xl font-black text-slate-900">
              ₹{marketIntel.fairPriceRange[0]}–{marketIntel.fairPriceRange[1]}
              <span className="text-xs font-normal text-slate-500">/kg</span>
            </div>
            <div className="text-[11px] text-slate-600 mt-1 flex items-center gap-1 font-medium">
              <span>Mandi: ₹{marketIntel.benchmarkMandiPrice}</span>
              <span className="text-emerald-700 font-semibold">
                (+₹{marketIntel.recommendedPrice - marketIntel.benchmarkMandiPrice})
              </span>
            </div>
          </div>
          <div className="text-[10px] text-emerald-800 font-semibold bg-emerald-50 px-1.5 py-0.5 rounded mt-2 text-center">
            AI Rec: ₹{marketIntel.recommendedPrice}/kg
          </div>
        </div>

        {/* Card 3: 📈 Market Demand */}
        <div className="col-span-1 lg:col-span-1 glass-panel p-4 rounded-2xl flex flex-col justify-between hover:shadow-md transition">
          <div className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-1">
            📈 Market Demand
          </div>
          <div>
            <div className="text-lg sm:text-xl font-black text-emerald-700 flex items-center gap-1">
              <span>HIGH</span>
              <TrendingUp className="h-4 w-4 text-emerald-600" />
            </div>
            <div className="text-[11px] text-slate-500 mt-1 leading-tight">
              {marketIntel.supplyFactor}
            </div>
          </div>
          <div className="text-[10px] text-slate-500 mt-2 flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>14 active buyers</span>
          </div>
        </div>

        {/* Card 4: 🏪 Best Buyer */}
        <div className="col-span-1 lg:col-span-1 glass-panel p-4 rounded-2xl flex flex-col justify-between hover:shadow-md transition">
          <div className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-1">
            🏪 Best Buyer
          </div>
          <div>
            <div className="text-sm sm:text-base font-bold text-slate-900 truncate">
              {bestOffer?.buyerName?.split('(')[1]?.replace(')', '') || 'ABC Foods'}
            </div>
            <div className="text-lg font-black text-emerald-700 mt-0.5">
              ₹{bestOffer?.offeredPricePerKg}/kg
            </div>
          </div>
          <div className="text-[11px] text-slate-600 mt-2 font-medium flex items-center gap-1">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
            <span>Trust: {bestOffer?.buyerTrustScore}/100</span>
          </div>
        </div>

        {/* Card 5: 🚚 Net Earnings */}
        <div className="col-span-1 lg:col-span-1 glass-emerald p-4 rounded-2xl flex flex-col justify-between shadow-sm">
          <div className="text-xs text-emerald-900 font-bold uppercase tracking-wider mb-1">
            🚚 Net Farmer Payout
          </div>
          <div>
            <div className="text-lg sm:text-xl font-black text-emerald-950">
              ₹{estimatedNetEarnings.toLocaleString()}
            </div>
            <div className="text-[11px] text-emerald-800 font-semibold mt-1">
              Net: ₹{bestOffer?.netFarmerRealizationPerKg}/kg
            </div>
          </div>
          {additionalGain > 0 ? (
            <div className="text-[10px] font-bold text-emerald-900 bg-white/70 px-2 py-0.5 rounded-full mt-2 text-center">
              +₹{additionalGain.toLocaleString()} vs Mandi
            </div>
          ) : (
            <div className="text-[10px] text-slate-500 mt-2">After transport</div>
          )}
        </div>

      </div>

      {/* SECTION 3: The Killer Feature — Transparent Price Confidence Score & Market Decision */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Transparent AI Price Engine & Sell/Wait Advisor */}
        <div className="lg:col-span-2 glass-panel rounded-2xl p-5 sm:p-6 space-y-5">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-200/70">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-slate-900">
                  AI Price Discovery & Decision Engine
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-extrabold flex items-center gap-1">
                  <Sparkles className="h-3 w-3" />
                  {marketIntel.confidenceScore}% Confidence
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Transparent price formation combining mandis, institutional contracts, and supply arrival indexes
              </p>
            </div>

            {/* Decision Recommendation Badge: 🟢 Sell Now */}
            <div className="self-start sm:self-auto flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-900 text-xs font-black">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-600 animate-ping" />
              <span>RECOMMENDATION: SELL NOW</span>
            </div>
          </div>

          {/* Pricing Breakdown Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
              <div className="text-xs font-semibold text-slate-500">Expected Market Range</div>
              <div className="text-xl font-black text-slate-900 mt-1">
                ₹{marketIntel.fairPriceRange[0]} – ₹{marketIntel.fairPriceRange[1]}
                <span className="text-xs font-normal text-slate-500"> /kg</span>
              </div>
              <p className="text-[11px] text-slate-600 mt-1">
                Based on current wholesale arrivals across APMCs
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-emerald-50/80 border border-emerald-200">
              <div className="text-xs font-bold text-emerald-800">AI Recommended Fair Price</div>
              <div className="text-xl font-black text-emerald-900 mt-1">
                ₹{marketIntel.recommendedPrice}.00
                <span className="text-xs font-normal text-emerald-700"> /kg</span>
              </div>
              <p className="text-[11px] text-emerald-800 font-medium mt-1">
                Confidence: <span className="font-bold">{marketIntel.confidenceScore}%</span>
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
              <div className="text-xs font-semibold text-slate-500">Nearby Mandi Benchmark</div>
              <div className="text-xl font-black text-slate-700 mt-1">
                ₹{marketIntel.benchmarkMandiPrice}.00
                <span className="text-xs font-normal text-slate-500"> /kg</span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1 truncate">
                {lot.nearestMandiName}
              </p>
            </div>
          </div>

          {/* Transparent "Why" Explanation — The prompt's mandate */}
          <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-200/80 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-950 uppercase tracking-wide">
              <Info className="h-4 w-4 text-emerald-700 shrink-0" />
              <span>Why this recommendation? (Transparent Market Signals)</span>
            </div>
            <p className="text-sm text-slate-700 font-medium leading-relaxed">
              "{marketIntel.confidenceReason}"
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t border-emerald-200/60 text-xs">
              <div className="flex items-center gap-1.5 text-slate-600">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                <span>Supply Signal: <strong className="text-slate-800">{marketIntel.supplyFactor}</strong></span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-600">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                <span>Transit Shelf-Life: <strong className="text-slate-800">Optimal (3-4 days)</strong></span>
              </div>
            </div>
          </div>

          {/* 7-Day Market Trend Mini-Bar */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-600 font-semibold">
              <span>5-Day Price Formation Trend</span>
              <span className="text-emerald-700">Mandi Price vs Direct Fair Price</span>
            </div>
            <div className="grid grid-cols-6 gap-2">
              {marketIntel.priceTrendHistory.map((item, idx) => (
                <div key={idx} className="p-2 rounded-lg bg-slate-50 border border-slate-200 text-center">
                  <div className="text-[10px] font-bold text-slate-500">{item.day}</div>
                  <div className="text-xs font-extrabold text-emerald-700 mt-1">₹{item.fairPrice}</div>
                  <div className="text-[10px] text-slate-400">mandi ₹{item.mandiPrice}</div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right 1 Col: Quick Comparison & Calculator Teaser */}
        <div className="glass-panel rounded-2xl p-5 space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-sm">Where Should I Sell?</h3>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-semibold">
                Net Formula
              </span>
            </div>
            
            <p className="text-xs text-slate-600 leading-relaxed">
              Selling price − transportation − handling costs = <strong>Net Farmer Realization</strong>.
            </p>

            {/* Visual breakdown of the 3 destinations */}
            <div className="space-y-2 pt-1">
              
              {/* Option 1: Mandi */}
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-slate-800">Local Mandi</span>
                  <div className="text-[11px] text-slate-500">₹25/kg (₹0 transit)</div>
                </div>
                <div className="text-right">
                  <span className="font-bold text-slate-700">₹25,000</span>
                  <div className="text-[10px] text-slate-400">baseline</div>
                </div>
              </div>

              {/* Option 2: Buyer A (Winner) */}
              <div className="p-2.5 rounded-xl bg-emerald-50 border-2 border-emerald-500 flex items-center justify-between text-xs relative">
                <span className="absolute -top-2 right-2 bg-emerald-600 text-white text-[9px] font-black px-2 py-0.2 rounded-full uppercase">
                  Best Net
                </span>
                <div>
                  <span className="font-bold text-emerald-950">Buyer A (ABC Foods)</span>
                  <div className="text-[11px] text-emerald-800">₹27/kg − ₹1 transport</div>
                </div>
                <div className="text-right">
                  <span className="font-black text-emerald-900 text-sm">₹26,000</span>
                  <div className="text-[10px] text-emerald-700 font-bold">+₹1,000 extra</div>
                </div>
              </div>

              {/* Option 3: Buyer B */}
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-slate-800">Buyer B (Metro Retail)</span>
                  <div className="text-[11px] text-slate-500">₹29/kg − ₹4 transport</div>
                </div>
                <div className="text-right">
                  <span className="font-bold text-slate-700">₹25,000</span>
                  <div className="text-[10px] text-slate-400">same as mandi</div>
                </div>
              </div>

            </div>
          </div>

          <div className="space-y-2 pt-2">
            <button
              id="open-net-calculator-btn"
              onClick={onOpenCalculator}
              className="w-full py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition shadow-sm"
            >
              <Sliders className="h-3.5 w-3.5" />
              <span>Open Interactive Net Calculator</span>
            </button>
            <p className="text-[10px] text-center text-slate-500">
              Adjust vehicle distance, diesel rates, and volume in real-time
            </p>
          </div>

        </div>

      </div>

      {/* SECTION 4, 7 & 8: Verified Matched Buyer Offers with Trust Scores & Net Realization */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-bold text-slate-900">
                Verified Buyer Offers ({offers.length})
              </h2>
              <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold">
                Demand-Led Agriculture
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Ranked strictly by <strong>Net Farmer Realization</strong> (Price − Transport) rather than raw gross price.
            </p>
          </div>

          <button
            onClick={() => onSelectTab('reverse')}
            className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 self-start sm:self-auto"
          >
            <span>View Reverse Marketplace (Buyer Requests)</span>
            <ExternalLink className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {offers.map((offer) => (
            <div
              key={offer.id}
              className={`rounded-2xl p-5 flex flex-col justify-between transition-all ${
                offer.isRecommended
                  ? 'glass-panel border-2 border-emerald-500/80 shadow-lg shadow-emerald-500/10'
                  : 'glass-panel hover:border-slate-300'
              }`}
            >
              <div>
                {/* Header: Buyer Name + Trust Badge */}
                <div className="flex items-start justify-between gap-2">
                  <div>
                    {offer.isRecommended && (
                      <span className="inline-block px-2.5 py-0.5 rounded-full bg-emerald-600 text-white text-[10px] font-black tracking-wide uppercase mb-1.5 shadow-sm">
                        🏆 AI Recommended Best Net
                      </span>
                    )}
                    <h3 className="font-bold text-slate-900 text-sm leading-snug">
                      {offer.buyerName}
                    </h3>
                    <div className="text-xs text-slate-500 mt-0.5 flex items-center gap-1.5">
                      <span className="font-medium text-slate-600">{offer.buyerType}</span>
                      <span>•</span>
                      <span>{offer.distanceKm} km away</span>
                    </div>
                  </div>

                  {/* Trust Score Pill */}
                  <div className="text-right shrink-0">
                    <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold">
                      <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                      <span>{offer.buyerTrustScore}/100</span>
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5">Trust Score</div>
                  </div>
                </div>

                {/* Pricing & Realization Breakdown */}
                <div className="my-4 p-3 rounded-xl bg-slate-50/90 border border-slate-200/80 space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-500">Gross Offered Price:</span>
                    <span className="font-extrabold text-slate-800">₹{offer.offeredPricePerKg}.00/kg</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-500">Logistics / Transport:</span>
                    <span className="font-semibold text-rose-600">−₹{offer.transportCostPerKg.toFixed(2)}/kg</span>
                  </div>
                  <div className="pt-2 border-t border-slate-200 flex justify-between items-center">
                    <span className="text-xs font-bold text-slate-900">Net Farmer Price:</span>
                    <span className="text-base font-black text-emerald-700">
                      ₹{offer.netFarmerRealizationPerKg.toFixed(2)}/kg
                    </span>
                  </div>
                  <div className="text-[11px] text-right font-medium text-slate-600">
                    Total Net: <strong className="text-slate-900">₹{(lot.quantityKg * offer.netFarmerRealizationPerKg).toLocaleString()}</strong>
                  </div>
                </div>

                {/* Delivery & Payment specs */}
                <div className="space-y-1 text-xs text-slate-600 mb-4">
                  <div className="flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{offer.deliveryWindow}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                    <span className="truncate">{offer.paymentTerms}</span>
                  </div>
                </div>

                {/* Notes */}
                <p className="text-[11px] text-slate-600 italic bg-white/60 p-2 rounded-lg border border-slate-100 mb-4">
                  "{offer.notes}"
                </p>
              </div>

              {/* Action: Accept Offer */}
              <button
                id={`accept-offer-${offer.id}`}
                onClick={() => onAcceptOffer(offer)}
                className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition active:scale-95 ${
                  offer.isRecommended
                    ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-700/20'
                    : 'bg-slate-900 hover:bg-slate-800 text-white'
                }`}
              >
                <span>Accept Offer & Lock Digital Deal</span>
                <ArrowUpRight className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
