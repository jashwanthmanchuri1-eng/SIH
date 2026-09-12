/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  LayoutDashboard,
  Calculator,
  ArrowLeftRight,
  Scan,
  ShieldCheck,
  Building2,
  Mic,
  PlusCircle,
  Sparkles,
  CheckCircle2,
  RefreshCw,
} from 'lucide-react';

import {
  CropLot,
  BuyerOffer,
  ReverseRequirement,
  FarmerBid,
  MarketIntelligence,
  DigitalDeal,
  LanguageCode,
  QualityGrade,
  QualityAnalysisResult,
  UserProfile,
} from './types';

import {
  INITIAL_CROP_LOTS,
  VERIFIED_BUYERS,
  INITIAL_BUYER_OFFERS,
  INITIAL_REVERSE_REQUIREMENTS,
  INITIAL_POTATO_FARMER_BIDS,
  DEFAULT_MARKET_INTELLIGENCE,
  INITIAL_DIGITAL_DEALS,
} from './data/mockData';

import { Navbar } from './components/Navbar';
import { FarmerHomeDashboard } from './components/FarmerHomeDashboard';
import { NetRealizationCalculator } from './components/NetRealizationCalculator';
import { ReverseMarketplace } from './components/ReverseMarketplace';
import { CropQualityInspector } from './components/CropQualityInspector';
import { TrustAndLedgerView } from './components/TrustAndLedgerView';
import { BuyerPortalView } from './components/BuyerPortalView';
import { VoiceAssistantModal } from './components/VoiceAssistantModal';
import { CropLotCreatorModal } from './components/CropLotCreatorModal';
import { AuthModal } from './components/AuthModal';
import { authService, dataService } from './lib/supabase';

export default function App() {
  // Navigation & Role State
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [activeRole, setActiveRole] = useState<'farmer' | 'buyer'>('farmer');
  const [currentLanguage, setCurrentLanguage] = useState<LanguageCode>('Kannada');
  const [isAiConnected, setIsAiConnected] = useState<boolean>(true);

  // User Authentication State
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => authService.getCurrentUser());
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'signup'>('login');

  // App Data State
  const [activeLot, setActiveLot] = useState<CropLot>(INITIAL_CROP_LOTS[0]);
  const [allLots, setAllLots] = useState<CropLot[]>(INITIAL_CROP_LOTS);
  const [marketIntel, setMarketIntel] = useState<MarketIntelligence>(DEFAULT_MARKET_INTELLIGENCE);
  const [buyerOffers, setBuyerOffers] = useState<BuyerOffer[]>(INITIAL_BUYER_OFFERS);
  const [reverseRequirements, setReverseRequirements] = useState<ReverseRequirement[]>(INITIAL_REVERSE_REQUIREMENTS);
  const [farmerBids, setFarmerBids] = useState<FarmerBid[]>(INITIAL_POTATO_FARMER_BIDS);
  const [digitalDeals, setDigitalDeals] = useState<DigitalDeal[]>(INITIAL_DIGITAL_DEALS);

  // Modals
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState<boolean>(false);
  const [isLotCreatorOpen, setIsLotCreatorOpen] = useState<boolean>(false);
  const [isQualityModalOpen, setIsQualityModalOpen] = useState<boolean>(false);
  const [dealSuccessModal, setDealSuccessModal] = useState<{
    isOpen: boolean;
    deal?: DigitalDeal;
  }>({ isOpen: false });

  // Toast Notification State
  const [notification, setNotification] = useState<{ title: string; subtitle?: string } | null>(null);

  const showNotification = (title: string, subtitle?: string) => {
    setNotification({ title, subtitle });
    setTimeout(() => setNotification(null), 4000);
  };

  // Initial Data Fetching from Supabase or LocalStorage cache
  const loadPlatformData = async () => {
    try {
      const [lots, offers, reqs, bids, deals] = await Promise.all([
        dataService.getCropLots(),
        dataService.getBuyerOffers(),
        dataService.getReverseRequirements(),
        dataService.getFarmerBids(),
        dataService.getDigitalDeals(),
      ]);

      if (lots && lots.length > 0) {
        setAllLots(lots);
        setActiveLot(lots[0]);
      }
      if (offers && offers.length > 0) setBuyerOffers(offers);
      if (reqs && reqs.length > 0) setReverseRequirements(reqs);
      if (bids && bids.length > 0) setFarmerBids(bids);
      if (deals && deals.length > 0) setDigitalDeals(deals);
    } catch (e) {
      console.warn('Error loading platform data:', e);
    }
  };

  // Health check & Initial load
  useEffect(() => {
    loadPlatformData();

    fetch('/api/health')
      .then((res) => res.json())
      .then(() => setIsAiConnected(true))
      .catch(() => setIsAiConnected(false));
  }, []);

  // Handler: Auth success
  const handleAuthSuccess = (user: UserProfile) => {
    setCurrentUser(user);
    setActiveRole(user.role);
    showNotification(`Welcome, ${user.name}!`, `Logged in as verified ${user.role}.`);
    confetti({ particleCount: 40, spread: 60 });
  };

  // Handler: Logout
  const handleLogout = async () => {
    await authService.logout();
    setCurrentUser(null);
    showNotification('Signed Out', 'You have been signed out.');
  };

  // Handler: Load Ramesh Gowda Scenario (Kolar 1000kg tomatoes)
  const handleLoadRameshDemo = () => {
    setActiveLot(INITIAL_CROP_LOTS[0]);
    setMarketIntel(DEFAULT_MARKET_INTELLIGENCE);
    setBuyerOffers(INITIAL_BUYER_OFFERS);
    setActiveRole('farmer');
    setActiveTab('dashboard');
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.7 },
    });
  };

  // Handler: Accept Offer & Create Digital Deal
  const handleAcceptOffer = async (offer: BuyerOffer) => {
    const newDeal: DigitalDeal = {
      id: `deal-FL-${Date.now()}`,
      dealNumber: `FL-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      lotId: activeLot.id,
      cropName: `${activeLot.cropName} (${activeLot.grade})`,
      quantityKg: activeLot.quantityKg,
      farmerName: activeLot.farmerName,
      buyerName: offer.buyerName,
      buyerTrustScore: offer.buyerTrustScore,
      grossPricePerKg: offer.offeredPricePerKg,
      transportPerKg: offer.transportCostPerKg,
      netRealizationPerKg: offer.netFarmerRealizationPerKg,
      totalFarmerPayout: activeLot.quantityKg * offer.netFarmerRealizationPerKg,
      deliveryDate: offer.deliveryWindow,
      destinationHub: `${offer.buyerName} Receiving Bay, Bengaluru`,
      paymentStatus: 'ESCROW_LOCKED',
      createdAt: new Date().toISOString(),
      milestones: [
        {
          step: 1,
          title: 'Offer Accepted & Terms Sealed',
          timestamp: 'Just now',
          isCompleted: true,
          isCurrent: false,
          detail: `Agreed at ₹${offer.offeredPricePerKg}/kg (Net ₹${offer.netFarmerRealizationPerKg}/kg after ₹${offer.transportCostPerKg} transport).`,
        },
        {
          step: 2,
          title: 'Smart Escrow Funded',
          timestamp: 'Instant Confirmation',
          isCompleted: true,
          isCurrent: false,
          detail: `₹${(activeLot.quantityKg * offer.netFarmerRealizationPerKg).toLocaleString()} secured in FarmLink Digital Guarantee.`,
        },
        {
          step: 3,
          title: 'Dispatch & Farmgate Logistics Pickup',
          timestamp: 'Scheduled for Harvest Dispatch',
          isCompleted: false,
          isCurrent: true,
          detail: 'Mini truck logistics partner dispatched to farmgate.',
        },
        {
          step: 4,
          title: 'Delivery Weighbridge & Quality Scan',
          timestamp: 'Pending Delivery',
          isCompleted: false,
          isCurrent: false,
          detail: 'Automated weight ticket and calibrated brix verification.',
        },
        {
          step: 5,
          title: 'Instant Farmer Bank Transfer Release',
          timestamp: 'Auto-Trigger on Delivery',
          isCompleted: false,
          isCurrent: false,
          detail: 'Full escrow payment direct to farmer UPI account.',
        },
      ],
    };

    setDigitalDeals((prev) => [newDeal, ...prev]);
    setDealSuccessModal({ isOpen: true, deal: newDeal });
    await dataService.saveDigitalDeal(newDeal);

    confetti({
      particleCount: 100,
      spread: 80,
      origin: { y: 0.6 },
    });
  };

  // Handler: Create new Lot & fetch AI price intelligence
  const handleCreateNewLot = async (lot: CropLot) => {
    setActiveLot(lot);
    setAllLots((prev) => [lot, ...prev]);
    setActiveTab('dashboard');
    showNotification('Harvest Lot Listed', `${lot.cropName} (${lot.quantityKg}kg) added to market.`);
    await dataService.saveCropLot(lot);

    try {
      const res = await fetch('/api/gemini/market-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          crop: lot.cropName,
          quantity: lot.quantityKg,
          qualityGrade: lot.grade,
          harvestDate: lot.harvestDate,
          location: lot.location,
          mandiPrice: lot.benchmarkMandiPrice,
        }),
      });
      const json = await res.json();
      if (json?.data) {
        setMarketIntel({
          cropName: `${lot.cropName} (${lot.grade})`,
          location: lot.location,
          benchmarkMandiPrice: lot.benchmarkMandiPrice,
          fairPriceRange: json.data.fairPriceRange || [lot.benchmarkMandiPrice + 1, lot.benchmarkMandiPrice + 4],
          recommendedPrice: json.data.recommendedPrice || lot.benchmarkMandiPrice + 2,
          confidenceScore: json.data.confidenceScore || 87,
          confidenceReason: json.data.confidenceReason || 'High buyer demand in nearby processing hubs.',
          sellRecommendation: json.data.sellRecommendation || 'SELL_NOW',
          sellRecommendationReason: json.data.sellRecommendationReason || 'Favorable direct trading window.',
          demandLevel: json.data.demandLevel || 'HIGH',
          supplyFactor: json.data.supplyFactor || 'Below seasonal arrivals',
          potentialNetUpsidePercent: json.data.potentialNetUpsidePercent || 12,
          arrivalTrend: 'Steady',
          priceTrendHistory: DEFAULT_MARKET_INTELLIGENCE.priceTrendHistory,
        });
      }
    } catch {
      // Keep robust defaults
    }
  };

  // Handler: Apply Certified Quality Grade
  const handleApplyGrade = (grade: QualityGrade, result: QualityAnalysisResult) => {
    setActiveLot((prev) => ({
      ...prev,
      grade,
    }));
    setIsQualityModalOpen(false);
    confetti({ particleCount: 35, spread: 50 });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f8faf9] text-slate-900 selection:bg-emerald-200">
      
      {/* Platform Navigation */}
      <Navbar
        currentLanguage={currentLanguage}
        onLanguageChange={setCurrentLanguage}
        activeRole={activeRole}
        onRoleChange={setActiveRole}
        onLoadRameshDemo={handleLoadRameshDemo}
        isAiConnected={isAiConnected}
        currentUser={currentUser}
        onOpenAuth={(mode) => {
          setAuthModalMode(mode);
          setIsAuthModalOpen(true);
        }}
        onLogout={handleLogout}
      />

      {/* Sub-Header Navigation Tabs (Mobile-first horizontal scroll) */}
      <div className="sticky top-16 z-30 w-full backdrop-blur-md bg-white/70 border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto py-2 no-scrollbar">
            
            <button
              id="tab-dashboard"
              onClick={() => setActiveTab('dashboard')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                activeTab === 'dashboard'
                  ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/20'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
              }`}
            >
              <LayoutDashboard className="h-3.5 w-3.5" />
              <span>Farmer Dashboard</span>
            </button>

            <button
              id="tab-net-calculator"
              onClick={() => setActiveTab('calculator')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                activeTab === 'calculator'
                  ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/20'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
              }`}
            >
              <Calculator className="h-3.5 w-3.5" />
              <span>Net Price Discovery</span>
            </button>

            <button
              id="tab-reverse-marketplace"
              onClick={() => setActiveTab('reverse')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                activeTab === 'reverse'
                  ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/20'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
              }`}
            >
              <ArrowLeftRight className="h-3.5 w-3.5" />
              <span>Reverse Marketplace & Bids</span>
            </button>

            <button
              id="tab-quality-inspector"
              onClick={() => setActiveTab('quality')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                activeTab === 'quality'
                  ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/20'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
              }`}
            >
              <Scan className="h-3.5 w-3.5" />
              <span>AI Crop Quality</span>
            </button>

            <button
              id="tab-trust-ledger"
              onClick={() => setActiveTab('trust')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                activeTab === 'trust'
                  ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/20'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
              }`}
            >
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>Trust Scores & Deals ({digitalDeals.length})</span>
            </button>

            <button
              id="tab-buyer-portal"
              onClick={() => {
                setActiveRole('buyer');
                setActiveTab('buyer');
              }}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                activeTab === 'buyer'
                  ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/20'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
              }`}
            >
              <Building2 className="h-3.5 w-3.5" />
              <span>Buyer Hub</span>
            </button>

          </div>
        </div>
      </div>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'dashboard' && (
          <FarmerHomeDashboard
            lot={activeLot}
            marketIntel={marketIntel}
            offers={buyerOffers}
            onOpenCalculator={() => setActiveTab('calculator')}
            onOpenVoiceModal={() => setIsVoiceModalOpen(true)}
            onOpenQualityModal={() => setIsQualityModalOpen(true)}
            onOpenLotCreator={() => setIsLotCreatorOpen(true)}
            onAcceptOffer={handleAcceptOffer}
            onSelectTab={setActiveTab}
          />
        )}

        {activeTab === 'calculator' && (
          <NetRealizationCalculator
            lot={activeLot}
            onAcceptWinner={() => handleAcceptOffer(buyerOffers[0])}
          />
        )}

        {activeTab === 'reverse' && (
          <ReverseMarketplace
            requirements={reverseRequirements}
            bids={farmerBids}
            onAddBid={async (newBid) => {
              setFarmerBids((prev) => [newBid, ...prev]);
              await dataService.saveFarmerBid(newBid);
              showNotification('Bid Submitted Successfully', `Offered ₹${newBid.offeredPricePerKg}/kg for ${newBid.quantityKg}kg.`);
              confetti({ particleCount: 30, spread: 45 });
            }}
            onAcceptBidAsBuyer={async (bid) => {
              const newDeal: DigitalDeal = {
                id: `deal-FL-REV-${Date.now()}`,
                dealNumber: `FL-REV-${Math.floor(1000 + Math.random() * 9000)}`,
                lotId: bid.requirementId || 'direct-rev',
                cropName: `Direct Procurement (${bid.grade})`,
                quantityKg: bid.quantityKg,
                farmerName: bid.farmerName,
                buyerName: 'ABC Foods & Hospitality',
                buyerTrustScore: 94,
                grossPricePerKg: bid.offeredPricePerKg,
                transportPerKg: bid.transportCostPerKg,
                netRealizationPerKg: bid.netRealizationPerKg,
                totalFarmerPayout: bid.quantityKg * bid.netRealizationPerKg,
                deliveryDate: 'Within 48 hours',
                destinationHub: 'Central Distribution Depot, Bengaluru',
                paymentStatus: 'ESCROW_LOCKED',
                createdAt: new Date().toISOString(),
                milestones: [
                  {
                    step: 1,
                    title: 'Reverse Auction Bid Accepted',
                    timestamp: 'Just now',
                    isCompleted: true,
                    isCurrent: false,
                    detail: `Bid accepted from ${bid.farmerName} at ₹${bid.offeredPricePerKg}/kg (Net ₹${bid.netRealizationPerKg}/kg).`,
                  },
                  {
                    step: 2,
                    title: 'Smart Escrow Funded by Buyer',
                    timestamp: 'Instant Confirmation',
                    isCompleted: true,
                    isCurrent: false,
                    detail: `₹${(bid.quantityKg * bid.netRealizationPerKg).toLocaleString()} locked in FarmLink digital trust guarantee.`,
                  },
                  {
                    step: 3,
                    title: 'Logistics Dispatched to Farm',
                    timestamp: 'In Progress',
                    isCompleted: false,
                    isCurrent: true,
                    detail: `Collection vehicle routed to ${bid.farmerLocation}.`,
                  },
                ],
              };
              setDigitalDeals((prev) => [newDeal, ...prev]);
              await dataService.saveDigitalDeal(newDeal);
              setDealSuccessModal({ isOpen: true, deal: newDeal });
              confetti({ particleCount: 80, spread: 70 });
            }}
            activeRole={activeRole}
          />
        )}

        {activeTab === 'quality' && (
          <CropQualityInspector
            onApplyGradeToLot={handleApplyGrade}
          />
        )}

        {activeTab === 'trust' && (
          <TrustAndLedgerView
            deals={digitalDeals}
            buyers={VERIFIED_BUYERS}
          />
        )}

        {activeTab === 'buyer' && (
          <BuyerPortalView
            requirements={reverseRequirements}
            lots={allLots}
            onPostRequirement={async (req) => {
              setReverseRequirements((prev) => [req, ...prev]);
              await dataService.saveReverseRequirement(req);
              showNotification('Procurement Requirement Posted', `Broadcasting ${req.requiredQuantityKg}kg ${req.cropName} demand to nearby farmers.`);
              confetti({ particleCount: 40, spread: 50 });
            }}
            onSelectFarmerLot={(lot) => {
              setActiveLot(lot);
              setActiveTab('calculator');
            }}
          />
        )}
      </main>

      {/* Floating Bottom Quick-Action Bar for mobile accessibility */}
      <div className="sticky bottom-4 z-30 max-w-sm mx-auto w-full px-4">
        <div className="glass-panel-dark text-white rounded-2xl p-2 px-3 shadow-2xl flex items-center justify-between gap-2 border border-white/20">
          <button
            onClick={() => setIsVoiceModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold transition active:scale-95 shadow"
          >
            <Mic className="h-3.5 w-3.5" />
            <span>Voice Advisor</span>
          </button>

          <button
            onClick={() => setIsLotCreatorOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/15 hover:bg-white/25 text-white text-xs font-semibold transition"
          >
            <PlusCircle className="h-3.5 w-3.5" />
            <span>Add Produce</span>
          </button>

          <button
            onClick={handleLoadRameshDemo}
            className="text-[11px] font-bold text-emerald-300 hover:text-white transition underline underline-offset-2"
          >
            Reset Demo
          </button>
        </div>
      </div>

      {/* Modals */}
      <VoiceAssistantModal
        isOpen={isVoiceModalOpen}
        onClose={() => setIsVoiceModalOpen(false)}
        currentLanguage={currentLanguage}
        onLanguageChange={setCurrentLanguage}
      />

      <CropLotCreatorModal
        isOpen={isLotCreatorOpen}
        onClose={() => setIsLotCreatorOpen(false)}
        onCreateLot={handleCreateNewLot}
      />

      {isQualityModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-4xl rounded-3xl glass-panel p-6 shadow-2xl bg-white/95 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-end mb-2">
              <button
                onClick={() => setIsQualityModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 text-xs font-bold px-2 py-1 rounded-lg hover:bg-slate-100"
              >
                ✕ Close Inspector
              </button>
            </div>
            <CropQualityInspector onApplyGradeToLot={handleApplyGrade} />
          </div>
        </div>
      )}

      {/* Deal Confirmation Modal */}
      {dealSuccessModal.isOpen && dealSuccessModal.deal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-md rounded-3xl glass-panel p-6 shadow-2xl space-y-4 bg-white border border-white text-center">
            <div className="h-14 w-14 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="h-8 w-8" />
            </div>

            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                Contract Confirmed
              </span>
              <h3 className="text-xl font-black text-slate-900 mt-2">
                Digital Escrow Deal Locked!
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Contract #{dealSuccessModal.deal.dealNumber}
              </p>
            </div>

            <div className="bg-emerald-50/80 p-4 rounded-2xl border border-emerald-200 text-left text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-600">Buyer:</span>
                <strong className="text-slate-900">{dealSuccessModal.deal.buyerName}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Net Farmer Payout:</span>
                <strong className="text-emerald-700 text-sm font-black">
                  ₹{dealSuccessModal.deal.totalFarmerPayout.toLocaleString()}
                </strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Net Rate per kg:</span>
                <strong className="text-slate-900">₹{dealSuccessModal.deal.netRealizationPerKg}/kg</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Payment Status:</span>
                <span className="text-emerald-800 font-bold">Smart Escrow Secured</span>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => {
                  setDealSuccessModal({ isOpen: false });
                  setActiveTab('trust');
                }}
                className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-md transition"
              >
                View Deal in Transaction Ledger
              </button>
              <button
                onClick={() => setDealSuccessModal({ isOpen: false })}
                className="py-2.5 px-4 rounded-xl border border-slate-200 text-slate-600 font-bold text-xs hover:bg-slate-100 transition"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* User Login & Registration Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onAuthSuccess={handleAuthSuccess}
        initialMode={authModalMode}
        initialRole={activeRole}
      />

      {/* Floating Dynamic Feedback Toast */}
      {notification && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-bottom-3 duration-300">
          <div className="px-4 py-2.5 rounded-2xl bg-slate-900/95 text-white shadow-2xl border border-white/20 flex items-center gap-3 backdrop-blur-md">
            <div className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
            <div>
              <div className="text-xs font-bold text-slate-100 leading-tight">
                {notification.title}
              </div>
              {notification.subtitle && (
                <div className="text-[11px] text-slate-300 leading-tight mt-0.5">
                  {notification.subtitle}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t border-slate-200/60 py-6 text-center text-xs text-slate-500 mt-12 bg-white/40">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="font-semibold text-slate-700">
            🌾 FarmLink AI — Market Linkage & Net Realization Engine
          </div>
          <div className="text-[11px] text-slate-400">
            Information + Trust + Negotiation + Transaction for Indian Farmers
          </div>
        </div>
      </footer>

    </div>
  );
}
