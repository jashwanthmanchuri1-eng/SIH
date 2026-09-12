import React, { useState } from 'react';
import {
  Building2,
  PlusCircle,
  ShieldCheck,
  CheckCircle2,
  Clock,
  ArrowRight,
  Filter,
  Sparkles,
  Users,
} from 'lucide-react';
import { ReverseRequirement, CropLot, QualityGrade } from '../types';

interface BuyerPortalViewProps {
  requirements: ReverseRequirement[];
  lots: CropLot[];
  onPostRequirement: (req: ReverseRequirement) => void;
  onSelectFarmerLot: (lot: CropLot) => void;
}

export const BuyerPortalView: React.FC<BuyerPortalViewProps> = ({
  requirements,
  lots,
  onPostRequirement,
  onSelectFarmerLot,
}) => {
  const [showPostModal, setShowPostModal] = useState<boolean>(false);
  const [cropName, setCropName] = useState<string>('Tomato');
  const [qtyKg, setQtyKg] = useState<number>(1000);
  const [targetMin, setTargetMin] = useState<number>(27);
  const [targetMax, setTargetMax] = useState<number>(30);
  const [location, setLocation] = useState<string>('Whitefield Distribution Depot, Bengaluru');
  const [grade, setGrade] = useState<QualityGrade>('Grade A');

  const handleCreateRequirement = (e: React.FormEvent) => {
    e.preventDefault();
    const newReq: ReverseRequirement = {
      id: `req-${Date.now()}`,
      buyerId: 'buyer-abc-foods',
      buyerName: 'ABC Foods & Hospitality',
      buyerType: 'Hotel Chain',
      trustScore: 94,
      cropName,
      requiredQuantityKg: Number(qtyKg),
      fulfilledQuantityKg: 0,
      targetPriceMin: Number(targetMin),
      targetPriceMax: Number(targetMax),
      grade,
      deliveryLocation: location,
      deadlineHours: 48,
      deliveryDate: 'Friday, Sept 14',
      matchingFarmersCount: 14,
      offersCount: 0,
      status: 'open',
      specialRequirements: ['Minimum 85% color uniformity', 'Pre-weighed in 25kg crates'],
    };
    onPostRequirement(newReq);
    setShowPostModal(false);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="glass-panel p-5 sm:p-6 rounded-2xl space-y-2 border-emerald-500/20">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-extrabold mb-1">
              <Building2 className="h-3.5 w-3.5" />
              <span>Section 4: Demand-Led Agriculture (Buyer Terminal)</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Institutional Buyer Procurement Hub
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              Hotels, restaurants, supermarkets, and food processors broadcast bulk demand directly to certified farmers with guaranteed payment escrow.
            </p>
          </div>

          <button
            onClick={() => setShowPostModal(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md transition self-start sm:self-auto active:scale-95"
          >
            <PlusCircle className="h-4 w-4" />
            <span>Post New Procurement Order</span>
          </button>
        </div>
      </div>

      {/* Live Active Bulk Requirements */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-slate-900 text-sm sm:text-base">
            Your Active Procurement Demands ({requirements.length})
          </h3>
          <span className="text-xs text-slate-500">Auto-matching with nearby farmer supply</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {requirements.map((req) => (
            <div key={req.id} className="glass-panel p-5 rounded-2xl space-y-3 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
                  <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                    {req.grade}
                  </span>
                  <span className="text-emerald-700 font-bold">{req.matchingFarmersCount} farmers matched</span>
                </div>

                <h4 className="text-base font-extrabold text-slate-900 mt-2">
                  {req.cropName} — {req.requiredQuantityKg.toLocaleString()} kg
                </h4>
                <div className="text-xs text-slate-500 mt-0.5 font-medium">{req.deliveryLocation}</div>

                <div className="mt-3 p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs flex justify-between items-center">
                  <span className="text-slate-500">Target Buying Price:</span>
                  <span className="font-extrabold text-slate-900">₹{req.targetPriceMin}–₹{req.targetPriceMax}/kg</span>
                </div>

                <div className="mt-2 text-xs text-slate-600 flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5 text-slate-400" />
                  <span>Delivery deadline: {req.deliveryDate}</span>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-500 font-medium">{req.offersCount} bids submitted</span>
                <span className="text-emerald-700 font-bold flex items-center gap-1">
                  <span>Active Request</span>
                  <ArrowRight className="h-3 w-3" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Matching Farmer Supply Ready for Immediate Direct Purchase */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-slate-900 text-sm sm:text-base">
            Verified Farmer Lots Ready for Dispatch ({lots.length})
          </h3>
          <span className="text-xs text-slate-500">Filtered by sub-80km radius</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {lots.map((lot) => (
            <div key={lot.id} className="glass-panel p-5 rounded-2xl space-y-3 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
                  <span>{lot.location}</span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                    {lot.grade} Certified
                  </span>
                </div>

                <div className="mt-2">
                  <h4 className="text-base font-extrabold text-slate-900">
                    {lot.cropName} ({lot.quantityKg.toLocaleString()} kg)
                  </h4>
                  <p className="text-xs text-slate-600 mt-0.5">Farmer: <strong>{lot.farmerName}</strong></p>
                </div>

                <div className="mt-3 p-2.5 rounded-xl bg-emerald-50/80 border border-emerald-200 text-xs space-y-1">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Mandi Benchmark:</span>
                    <span className="font-bold text-slate-800">₹{lot.benchmarkMandiPrice}/kg</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Expected Direct Price:</span>
                    <span className="font-extrabold text-emerald-700">₹{lot.benchmarkMandiPrice + 2}–{lot.benchmarkMandiPrice + 4}/kg</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => onSelectFarmerLot(lot)}
                className="w-full py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition active:scale-95"
              >
                <span>Make Direct Purchase Offer</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Modal: Post New Requirement */}
      {showPostModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-lg rounded-3xl glass-panel p-6 shadow-2xl space-y-4 bg-white/95 border border-white">
            <h3 className="font-black text-slate-900 text-lg">Post Bulk Procurement Requirement</h3>
            
            <form onSubmit={handleCreateRequirement} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Crop Required</label>
                <input
                  type="text"
                  value={cropName}
                  onChange={(e) => setCropName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Required Volume (kg)</label>
                  <input
                    type="number"
                    value={qtyKg}
                    onChange={(e) => setQtyKg(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white"
                    required
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Target Quality Grade</label>
                  <select
                    value={grade}
                    onChange={(e) => setGrade(e.target.value as QualityGrade)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white"
                  >
                    <option value="Grade A">Grade A (Premium Hotel/Retail)</option>
                    <option value="Grade B">Grade B (Standard Wholesale)</option>
                    <option value="Grade C">Grade C (Industrial Puree/Pulp)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Target Min Price (₹/kg)</label>
                  <input
                    type="number"
                    value={targetMin}
                    onChange={(e) => setTargetMin(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white"
                    required
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Target Max Price (₹/kg)</label>
                  <input
                    type="number"
                    value={targetMax}
                    onChange={(e) => setTargetMax(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Receiving Warehouse Location</label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white"
                  required
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowPostModal(false)}
                  className="px-4 py-2 font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-md"
                >
                  Broadcast Requirement to Farmers
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
