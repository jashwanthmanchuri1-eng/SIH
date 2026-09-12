import React, { useState } from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  FileText,
  Lock,
  Truck,
  DollarSign,
  AlertCircle,
  Building2,
  Clock,
  ExternalLink,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { DigitalDeal, Buyer } from '../types';

interface TrustAndLedgerViewProps {
  deals: DigitalDeal[];
  buyers: Buyer[];
  onProgressDeal?: (dealId: string) => void;
}

export const TrustAndLedgerView: React.FC<TrustAndLedgerViewProps> = ({
  deals,
  buyers,
}) => {
  const [dealList, setDealList] = useState<DigitalDeal[]>(deals);
  const [selectedDealId, setSelectedDealId] = useState<string>(deals[0]?.id || '');

  const activeDeal = dealList.find((d) => d.id === selectedDealId) || dealList[0];

  const handleAdvanceMilestone = (dealId: string) => {
    setDealList((prev) =>
      prev.map((deal) => {
        if (deal.id !== dealId) return deal;

        const currentStepIndex = deal.milestones.findIndex((m) => m.isCurrent);
        if (currentStepIndex === -1 || currentStepIndex >= deal.milestones.length - 1) {
          return deal;
        }

        const updatedMilestones = deal.milestones.map((m, idx) => {
          if (idx <= currentStepIndex) return { ...m, isCompleted: true, isCurrent: false };
          if (idx === currentStepIndex + 1) return { ...m, isCurrent: true };
          return m;
        });

        // If reaching final step, trigger confetti
        if (currentStepIndex + 1 === deal.milestones.length - 1) {
          confetti({
            particleCount: 80,
            spread: 70,
            origin: { y: 0.6 },
          });
        }

        return {
          ...deal,
          paymentStatus:
            currentStepIndex + 1 === deal.milestones.length - 1
              ? 'RELEASED_TO_FARMER'
              : 'TRANSIT_INSPECTION',
          milestones: updatedMilestones,
        };
      })
    );
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="glass-panel p-5 sm:p-6 rounded-2xl space-y-2 border-emerald-500/20">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-extrabold mb-1">
          <ShieldCheck className="h-3.5 w-3.5" />
          <span>Section 8 & 9: Trust Layer & Digital Deal Ledger</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
          Buyer Trust Verification & Auditable Deal Ledger
        </h2>
        <p className="text-xs sm:text-sm text-slate-600">
          Eliminating farmer counterparty risk with audited buyer performance scores and milestone-backed digital transaction protection.
        </p>
      </div>

      {/* SECTION 8: Buyer Trust Score Matrix */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-slate-900 text-sm sm:text-base">
            Verified Institutional Buyers & Trust Profiles
          </h3>
          <span className="text-xs text-emerald-700 font-semibold">
            Identity & Payment History Audited
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {buyers.map((buyer) => (
            <div key={buyer.id} className="glass-panel p-4 rounded-2xl space-y-3 flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between">
                  <img src={buyer.avatarUrl} alt={buyer.name} className="h-10 w-10 rounded-xl object-cover border border-slate-200" />
                  <div className="text-right">
                    <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold">
                      <ShieldCheck className="h-3 w-3 text-emerald-600" />
                      <span>{buyer.trustScore}/100</span>
                    </div>
                    <div className="text-[10px] text-slate-400">Trust Score</div>
                  </div>
                </div>

                <div className="mt-3">
                  <h4 className="font-bold text-slate-900 text-sm leading-tight">{buyer.name}</h4>
                  <div className="text-[11px] text-slate-500 mt-0.5">{buyer.organizationType}</div>
                </div>

                {/* Score stats from Section 8 */}
                <div className="mt-3 pt-2 border-t border-slate-100 space-y-1.5 text-xs">
                  <div className="flex justify-between text-slate-600">
                    <span>Completed Purchases:</span>
                    <strong className="text-slate-800">{buyer.completedPurchases}</strong>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>On-Time Payments:</span>
                    <strong className="text-emerald-700">{buyer.onTimePaymentPercent}%</strong>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Cancellation Rate:</span>
                    <strong className="text-slate-800">{buyer.cancellationRatePercent}%</strong>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 text-[10px] text-slate-500 truncate">
                {buyer.paymentMethod}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 9: Digital Transaction Protection & Simple Ledger */}
      {activeDeal && (
        <div className="glass-panel p-5 sm:p-6 rounded-2xl space-y-6 border-slate-200">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200">
            <div>
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-emerald-700" />
                <h3 className="text-lg font-black text-slate-900">
                  Digital Deal Contract #{activeDeal.dealNumber}
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
                  {activeDeal.paymentStatus}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Binding agreement between <strong className="text-slate-800">{activeDeal.farmerName}</strong> and <strong className="text-slate-800">{activeDeal.buyerName}</strong>
              </p>
            </div>

            <div className="text-left sm:text-right">
              <div className="text-xs text-slate-500">Locked Net Farmer Realization</div>
              <div className="text-2xl font-black text-emerald-700">
                ₹{activeDeal.totalFarmerPayout.toLocaleString()}
              </div>
              <div className="text-[11px] text-slate-500">₹{activeDeal.netRealizationPerKg}/kg net</div>
            </div>
          </div>

          {/* Deal Terms Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs bg-slate-50 p-4 rounded-xl border border-slate-200">
            <div>
              <div className="text-slate-500">Produce & Volume:</div>
              <div className="font-extrabold text-slate-900 mt-0.5">{activeDeal.cropName} • {activeDeal.quantityKg} kg</div>
            </div>
            <div>
              <div className="text-slate-500">Agreed Price (Gross):</div>
              <div className="font-extrabold text-slate-900 mt-0.5">₹{activeDeal.grossPricePerKg}.00/kg</div>
            </div>
            <div>
              <div className="text-slate-500">Logistics Deduction:</div>
              <div className="font-extrabold text-rose-600 mt-0.5">−₹{activeDeal.transportPerKg}.00/kg</div>
            </div>
            <div>
              <div className="text-slate-500">Delivery Schedule:</div>
              <div className="font-extrabold text-slate-900 mt-0.5">{activeDeal.deliveryDate}</div>
            </div>
          </div>

          {/* Step-by-Step Digital Deal Timeline (Section 9) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Auditable Transaction Lifecycle (Escrow Protected)
              </h4>
              <button
                onClick={() => handleAdvanceMilestone(activeDeal.id)}
                className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
              >
                <span>Advance Next Milestone</span>
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>

            <div className="space-y-3">
              {activeDeal.milestones.map((milestone) => (
                <div
                  key={milestone.step}
                  className={`p-3.5 rounded-xl border transition flex items-start gap-3 ${
                    milestone.isCompleted
                      ? 'bg-emerald-50/70 border-emerald-200'
                      : milestone.isCurrent
                      ? 'bg-white border-2 border-emerald-600 shadow-sm'
                      : 'bg-slate-50/50 border-slate-200 opacity-60'
                  }`}
                >
                  <div className="mt-0.5">
                    {milestone.isCompleted ? (
                      <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                    ) : milestone.isCurrent ? (
                      <div className="h-5 w-5 rounded-full border-2 border-emerald-600 flex items-center justify-center">
                        <span className="h-2 w-2 rounded-full bg-emerald-600 animate-ping" />
                      </div>
                    ) : (
                      <div className="h-5 w-5 rounded-full border border-slate-300 text-slate-400 flex items-center justify-center text-xs font-bold">
                        {milestone.step}
                      </div>
                    )}
                  </div>

                  <div className="flex-1 space-y-0.5">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900 text-xs sm:text-sm">
                        Step {milestone.step}: {milestone.title}
                      </span>
                      <span className="text-[10px] text-slate-400 font-medium">
                        {milestone.timestamp}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600">{milestone.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

    </div>
  );
};
