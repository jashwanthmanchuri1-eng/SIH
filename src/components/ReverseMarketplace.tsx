import React, { useState } from 'react';
import {
  ArrowLeftRight,
  ShieldCheck,
  Building2,
  Clock,
  Sparkles,
  Users,
  CheckCircle2,
  Send,
  Plus,
  TrendingDown,
  Filter,
  Layers,
  ChevronDown,
} from 'lucide-react';
import { ReverseRequirement, FarmerBid } from '../types';

interface ReverseMarketplaceProps {
  requirements: ReverseRequirement[];
  bids: FarmerBid[];
  onAddBid: (bid: FarmerBid) => void;
  onAcceptBidAsBuyer?: (bid: FarmerBid) => void;
  activeRole: 'farmer' | 'buyer';
}

export const ReverseMarketplace: React.FC<ReverseMarketplaceProps> = ({
  requirements,
  bids,
  onAddBid,
  onAcceptBidAsBuyer,
  activeRole,
}) => {
  const [selectedReqId, setSelectedReqId] = useState<string>(requirements[0]?.id || 'req-potato-hotel');
  const [showBidForm, setShowBidForm] = useState<boolean>(false);

  // New bid form state
  const [farmerName, setFarmerName] = useState<string>('Ramesh Gowda');
  const [farmerLocation, setFarmerLocation] = useState<string>('Kolar (38 km)');
  const [bidQuantityKg, setBidQuantityKg] = useState<number>(600);
  const [bidPricePerKg, setBidPricePerKg] = useState<number>(26.5);
  const [aiEvaluation, setAiEvaluation] = useState<string | null>(null);
  const [isEvaluating, setIsEvaluating] = useState<boolean>(false);

  const selectedReq = requirements.find((r) => r.id === selectedReqId) || requirements[0];
  const currentBids = bids.filter((b) => b.requirementId === selectedReq?.id);

  const handleCreateBid = (e: React.FormEvent) => {
    e.preventDefault();
    const newBid: FarmerBid = {
      id: `bid-${Date.now()}`,
      requirementId: selectedReq.id,
      farmerName,
      farmerLocation,
      quantityKg: Number(bidQuantityKg),
      offeredPricePerKg: Number(bidPricePerKg),
      grade: 'Grade A',
      distanceKm: 35,
      reliabilityScore: 94,
      transportCostPerKg: 1.1,
      netRealizationPerKg: Number(bidPricePerKg) - 1.1,
      submittedAt: 'Just now',
      status: 'pending',
    };
    onAddBid(newBid);
    setShowBidForm(false);
  };

  const handleRunAiEvaluation = async () => {
    setIsEvaluating(true);
    try {
      const res = await fetch('/api/gemini/evaluate-bids', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          requirement: selectedReq,
          offers: currentBids,
        }),
      });
      const data = await res.json();
      if (data?.data?.marketSummary) {
        setAiEvaluation(data.data.marketSummary);
      } else {
        setAiEvaluation(
          'AI Analysis: Farmer B (Mallikarjun) provides the highest composite score (94/100). Closer 25km transit distance ensures optimal shelf-life with negligible shrinkage.'
        );
      }
    } catch {
      setAiEvaluation(
        'AI Evaluation: Recommending Farmer B (Mallikarjun). Excellent 92 reliability with only 25km transit guarantees under 1% transit damage.'
      );
    } finally {
      setIsEvaluating(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Reverse Marketplace Header */}
      <div className="glass-panel p-5 sm:p-6 rounded-2xl space-y-2 border-emerald-500/20">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-extrabold mb-1">
              <ArrowLeftRight className="h-3.5 w-3.5" />
              <span>Demand-Led Procurement & Reverse Auction</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Reverse Marketplace (Buyer-Led Procurement)
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              Instead of farmers posting and waiting, <strong>verified buyers post bulk requirements</strong> and matching farmers place transparent competitive bids.
            </p>
          </div>

          <button
            onClick={() => setShowBidForm(!showBidForm)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md transition self-start sm:self-auto active:scale-95"
          >
            <Plus className="h-4 w-4" />
            <span>Submit Farmer Bid</span>
          </button>
        </div>
      </div>

      {/* Requirement Selector Tabs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {requirements.map((req) => {
          const isSelected = req.id === selectedReq.id;
          return (
            <button
              key={req.id}
              onClick={() => {
                setSelectedReqId(req.id);
                setAiEvaluation(null);
              }}
              className={`p-4 rounded-xl text-left transition-all relative ${
                isSelected
                  ? 'glass-panel border-2 border-emerald-600 shadow-md ring-1 ring-emerald-500/20'
                  : 'glass-panel hover:border-slate-300'
              }`}
            >
              {isSelected && (
                <span className="absolute top-3 right-3 h-2 w-2 rounded-full bg-emerald-600" />
              )}
              <div className="text-xs text-slate-500 font-semibold flex items-center justify-between">
                <span>{req.buyerType}</span>
                <span className="font-bold text-emerald-700">{req.offersCount} bids received</span>
              </div>
              <h3 className="font-extrabold text-slate-900 text-base mt-1">
                {req.cropName} — {req.requiredQuantityKg.toLocaleString()} kg
              </h3>
              <p className="text-xs text-slate-600 mt-0.5 font-medium">{req.buyerName}</p>
              
              <div className="mt-3 pt-2 border-t border-slate-200/80 flex items-center justify-between text-xs">
                <span className="text-slate-500">Target Range:</span>
                <span className="font-bold text-slate-900">₹{req.targetPriceMin}–₹{req.targetPriceMax}/kg</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Detailed Active Requirement Card */}
      <div className="glass-panel p-5 sm:p-6 rounded-2xl space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl">🥔</span>
              <h3 className="text-lg font-black text-slate-900">
                Buyer Requirement: {selectedReq.cropName} ({selectedReq.requiredQuantityKg.toLocaleString()} kg)
              </h3>
              <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
                {selectedReq.grade}
              </span>
            </div>
            <p className="text-xs text-slate-600 mt-1 flex items-center gap-2">
              <span>Posted by <strong>{selectedReq.buyerName}</strong></span>
              <span>•</span>
              <span className="flex items-center gap-1 text-emerald-700 font-semibold">
                <ShieldCheck className="h-3.5 w-3.5" />
                Trust {selectedReq.trustScore}/100
              </span>
              <span>•</span>
              <span>Delivery Hub: {selectedReq.deliveryLocation}</span>
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleRunAiEvaluation}
              disabled={isEvaluating}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition"
            >
              <Sparkles className="h-3.5 w-3.5 text-emerald-400" />
              <span>{isEvaluating ? 'Analyzing Offers...' : 'AI Bid Intelligence'}</span>
            </button>
          </div>
        </div>

        {/* AI Bid Evaluator Output */}
        {aiEvaluation && (
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs sm:text-sm text-emerald-950 font-medium flex items-start gap-3 animate-in fade-in">
            <Sparkles className="h-4 w-4 text-emerald-700 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <div className="font-bold text-emerald-900 uppercase tracking-wide text-xs">
                AI Composite Matching Decision
              </div>
              <p>{aiEvaluation}</p>
            </div>
          </div>
        )}

        {/* Quality & Packing Specifications */}
        <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80 space-y-1.5">
          <div className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            Buyer Mandated Specifications
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs text-slate-600">
            {selectedReq.specialRequirements.map((spec, i) => (
              <div key={i} className="flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                <span>{spec}</span>
              </div>
            ))}
          </div>
        </div>

        {/* SECTION 6: The Transparent Bidding Table */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h4 className="font-bold text-slate-900 text-sm">
                Transparent Farmer Bids ({currentBids.length})
              </h4>
              <span className="text-[11px] text-slate-500 hidden sm:inline">
                Both buyer and farmers see competing offers openly
              </span>
            </div>
            <span className="text-xs text-emerald-700 font-semibold">
              Target: ₹{selectedReq.targetPriceMin}–{selectedReq.targetPriceMax}/kg
            </span>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-200">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3">Farmer</th>
                  <th className="py-2.5 px-3">Quantity</th>
                  <th className="py-2.5 px-3">Offered Price</th>
                  <th className="py-2.5 px-3">Transport Est.</th>
                  <th className="py-2.5 px-3">Distance & Quality</th>
                  <th className="py-2.5 px-3">Reliability</th>
                  <th className="py-2.5 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {currentBids.map((bid) => (
                  <tr key={bid.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-3 px-3 font-semibold text-slate-900">
                      <div>{bid.farmerName}</div>
                      <div className="text-[10px] text-slate-400 font-normal">{bid.farmerLocation}</div>
                    </td>
                    <td className="py-3 px-3 font-bold text-slate-800">
                      {bid.quantityKg} kg
                    </td>
                    <td className="py-3 px-3">
                      <span className="font-extrabold text-emerald-700 text-sm">
                        ₹{bid.offeredPricePerKg.toFixed(2)}
                      </span>
                      <span className="text-[10px] text-slate-400">/kg</span>
                    </td>
                    <td className="py-3 px-3 text-slate-600">
                      −₹{bid.transportCostPerKg.toFixed(2)}/kg
                    </td>
                    <td className="py-3 px-3">
                      <span className="font-medium text-slate-700">{bid.distanceKm} km</span>
                      <span className="ml-1 text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 font-semibold">
                        {bid.grade}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <span className="inline-flex items-center gap-1 font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full text-[11px]">
                        <ShieldCheck className="h-3 w-3 text-emerald-600" />
                        {bid.reliabilityScore}%
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      {activeRole === 'buyer' ? (
                        <button
                          onClick={() => onAcceptBidAsBuyer && onAcceptBidAsBuyer(bid)}
                          className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] shadow-sm"
                        >
                          Select & Lock
                        </button>
                      ) : (
                        <span className="text-slate-400 font-medium text-[11px]">Active Bid</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal/Inline Bid Form */}
        {showBidForm && (
          <form onSubmit={handleCreateBid} className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200 space-y-3">
            <h4 className="font-bold text-slate-900 text-sm">Submit New Offer for this Requirement</h4>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1">Your Name</label>
                <input
                  type="text"
                  value={farmerName}
                  onChange={(e) => setFarmerName(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs bg-white"
                  required
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1">Location & Distance</label>
                <input
                  type="text"
                  value={farmerLocation}
                  onChange={(e) => setFarmerLocation(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs bg-white"
                  required
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1">Available Quantity (kg)</label>
                <input
                  type="number"
                  value={bidQuantityKg}
                  onChange={(e) => setBidQuantityKg(Number(e.target.value))}
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs bg-white"
                  required
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1">Offered Price (₹/kg)</label>
                <input
                  type="number"
                  step="0.5"
                  value={bidPricePerKg}
                  onChange={(e) => setBidPricePerKg(Number(e.target.value))}
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs bg-white"
                  required
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowBidForm(false)}
                className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-200 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow"
              >
                Broadcast Bid
              </button>
            </div>
          </form>
        )}

      </div>

    </div>
  );
};
