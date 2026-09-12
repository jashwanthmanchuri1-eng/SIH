import React, { useState } from 'react';
import {
  Sliders,
  TrendingUp,
  Award,
  Truck,
  CheckCircle,
  HelpCircle,
  RotateCcw,
  Sparkles,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { CropLot } from '../types';

interface NetRealizationCalculatorProps {
  lot: CropLot;
  onClose?: () => void;
  onAcceptWinner?: () => void;
}

export const NetRealizationCalculator: React.FC<NetRealizationCalculatorProps> = ({
  lot,
  onClose,
  onAcceptWinner,
}) => {
  // Configurable parameters for the demo
  const [quantityKg, setQuantityKg] = useState<number>(lot.quantityKg || 1000);
  const [mandiPrice, setMandiPrice] = useState<number>(lot.benchmarkMandiPrice || 25);
  const [mandiDistanceKm, setMandiDistanceKm] = useState<number>(8); // local mandi

  // Buyer A (Kolar -> Whitefield/Hosur ~28 km)
  const [buyerAPrice, setBuyerAPrice] = useState<number>(27);
  const [buyerADistanceKm, setBuyerADistanceKm] = useState<number>(28);
  const [buyerATransportRatePerKg, setBuyerATransportRatePerKg] = useState<number>(1.0);

  // Buyer B (Kolar -> Yeshwanthpur/North BLR ~68 km)
  const [buyerBPrice, setBuyerBPrice] = useState<number>(29);
  const [buyerBDistanceKm, setBuyerBDistanceKm] = useState<number>(68);
  const [buyerBTransportRatePerKg, setBuyerBTransportRatePerKg] = useState<number>(4.0);

  // Vehicle type preset
  const [vehicleType, setVehicleType] = useState<'mini_truck' | 'auto' | 'canter'>('mini_truck');

  // Calculations
  // 1. Mandi: Near, minimal transit (approx ₹0.20/kg or ₹0 when factored in farmgate sale)
  const mandiTransportPerKg = (mandiDistanceKm * 15) / quantityKg; // ~ ₹0.12/kg rounded down
  const mandiNetPerKg = mandiPrice; // Mandi benchmark
  const mandiTotalNet = Math.round(mandiPrice * quantityKg);

  // 2. Buyer A: ₹27 - ₹1 = ₹26/kg
  const buyerANetPerKg = buyerAPrice - buyerATransportRatePerKg;
  const buyerATotalNet = Math.round(buyerANetPerKg * quantityKg);

  // 3. Buyer B: ₹29 - ₹4 = ₹25/kg
  const buyerBNetPerKg = buyerBPrice - buyerBTransportRatePerKg;
  const buyerBTotalNet = Math.round(buyerBNetPerKg * quantityKg);

  // Determine winner
  const options = [
    { id: 'mandi', name: 'Nearby APMC Mandi', gross: mandiPrice, transport: 0, netPerKg: mandiPrice, totalNet: mandiTotalNet, extra: 0 },
    { id: 'buyerA', name: 'Buyer A (ABC Foods)', gross: buyerAPrice, transport: buyerATransportRatePerKg, netPerKg: buyerANetPerKg, totalNet: buyerATotalNet, extra: buyerATotalNet - mandiTotalNet },
    { id: 'buyerB', name: 'Buyer B (Metro Retail)', gross: buyerBPrice, transport: buyerBTransportRatePerKg, netPerKg: buyerBNetPerKg, totalNet: buyerBTotalNet, extra: buyerBTotalNet - mandiTotalNet },
  ];

  const highestNetOption = [...options].sort((a, b) => b.totalNet - a.totalNet)[0];

  const resetToRameshPreset = () => {
    setQuantityKg(1000);
    setMandiPrice(25);
    setMandiDistanceKm(8);
    setBuyerAPrice(27);
    setBuyerADistanceKm(28);
    setBuyerATransportRatePerKg(1.0);
    setBuyerBPrice(29);
    setBuyerBDistanceKm(68);
    setBuyerBTransportRatePerKg(4.0);
  };

  return (
    <div className="space-y-6">
      
      {/* Header & Core Thesis */}
      <div className="glass-panel p-5 sm:p-6 rounded-2xl space-y-3 border-emerald-500/20">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold mb-1">
              <Award className="h-3 w-3" />
              <span>Net Realization & Freight Discovery Engine</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Farmer Net Price Realization Calculator
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
              Formula: <span className="font-semibold text-slate-900">Selling price − transportation − handling = Net farmer realization</span>
            </p>
          </div>

          <button
            onClick={resetToRameshPreset}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition self-start sm:self-auto"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Reset Ramesh Demo (Kolar)</span>
          </button>
        </div>

        {/* Highlight Banner: Winner Callout */}
        <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 text-white shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-0.5">
            <div className="text-[11px] font-bold text-emerald-200 tracking-wider uppercase flex items-center gap-1">
              <Sparkles className="h-3.5 w-3.5" />
              <span>FarmLink Selling Recommendation</span>
            </div>
            <div className="text-lg sm:text-xl font-extrabold flex items-center gap-2">
              <span>🏆 Sell to {highestNetOption.name}</span>
            </div>
            <p className="text-xs text-emerald-100">
              Gives you the highest net realization of <strong className="text-white">₹{highestNetOption.netPerKg.toFixed(2)}/kg</strong>.
              {highestNetOption.extra > 0 && (
                <span> Extra farmer income: <strong className="text-white underline decoration-emerald-300 decoration-2">+₹{highestNetOption.extra.toLocaleString()}</strong> over local mandi.</span>
              )}
            </p>
          </div>

          {onAcceptWinner && (
            <button
              onClick={onAcceptWinner}
              className="px-4 py-2 rounded-xl bg-white text-emerald-900 font-extrabold text-xs shadow hover:bg-emerald-50 transition active:scale-95 shrink-0"
            >
              Lock This Deal Now
            </button>
          )}
        </div>
      </div>

      {/* The 3-Way Comparative Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Mandi Card */}
        <div className="glass-panel p-5 rounded-2xl flex flex-col justify-between border-slate-200 hover:shadow-md transition">
          <div>
            <div className="flex items-center justify-between text-xs font-semibold text-slate-500 mb-2">
              <span>Nearest APMC Mandi</span>
              <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] font-bold">
                {mandiDistanceKm} km
              </span>
            </div>

            <h3 className="text-base font-bold text-slate-900">Kolar Market Yard</h3>
            
            <div className="mt-4 space-y-2 p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Mandi Price:</span>
                <span className="font-bold text-slate-800">₹{mandiPrice}.00/kg</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Transport / Loading:</span>
                <span className="text-slate-500">₹0.00/kg</span>
              </div>
              <div className="pt-2 border-t border-slate-200 flex justify-between font-bold text-slate-900">
                <span>Net Rate:</span>
                <span className="text-slate-900 font-black">₹{mandiPrice}.00/kg</span>
              </div>
            </div>

            <div className="mt-4 text-center">
              <div className="text-xs text-slate-500 font-medium">Total Net Realization</div>
              <div className="text-2xl font-black text-slate-800 mt-0.5">
                ₹{mandiTotalNet.toLocaleString()}
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5">Baseline Benchmark</div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-500">
            Trader deduction and mandi commission may further lower cash received.
          </div>
        </div>

        {/* Buyer A (The true winner) */}
        <div className="glass-panel p-5 rounded-2xl flex flex-col justify-between border-2 border-emerald-500 shadow-lg shadow-emerald-500/10 relative">
          <div className="absolute -top-3 right-4 px-3 py-0.5 rounded-full bg-emerald-600 text-white text-[10px] font-black uppercase tracking-wider shadow">
            Recommended Choice
          </div>

          <div>
            <div className="flex items-center justify-between text-xs font-semibold text-emerald-800 mb-2">
              <span>Direct Verified Buyer</span>
              <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                {buyerADistanceKm} km
              </span>
            </div>

            <h3 className="text-base font-bold text-slate-900">Buyer A (ABC Foods)</h3>
            
            <div className="mt-4 space-y-2 p-3 rounded-xl bg-emerald-50/80 border border-emerald-200 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Gross Offered:</span>
                <span className="font-extrabold text-slate-900">₹{buyerAPrice}.00/kg</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Transport Cost:</span>
                <span className="font-semibold text-rose-600">−₹{buyerATransportRatePerKg.toFixed(2)}/kg</span>
              </div>
              <div className="pt-2 border-t border-emerald-200 flex justify-between font-bold text-emerald-950">
                <span>Net Realization:</span>
                <span className="text-emerald-700 text-sm font-black">₹{buyerANetPerKg.toFixed(2)}/kg</span>
              </div>
            </div>

            <div className="mt-4 text-center">
              <div className="text-xs text-emerald-900 font-bold">Total Net Realization</div>
              <div className="text-3xl font-black text-emerald-700 mt-0.5">
                ₹{buyerATotalNet.toLocaleString()}
              </div>
              <div className="inline-flex items-center gap-1 text-xs font-extrabold text-emerald-800 bg-emerald-100/90 px-2 py-0.5 rounded-full mt-1.5">
                <span>+₹{(buyerATotalNet - mandiTotalNet).toLocaleString()} extra profit</span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-emerald-100 text-[11px] text-emerald-800 font-medium">
            ✔ Optimal balance: Higher selling rate with short 28 km haul.
          </div>
        </div>

        {/* Buyer B (The decoy — looks higher at ₹29, but yields same as mandi due to ₹4 transit!) */}
        <div className="glass-panel p-5 rounded-2xl flex flex-col justify-between border-slate-200 hover:shadow-md transition">
          <div>
            <div className="flex items-center justify-between text-xs font-semibold text-slate-500 mb-2">
              <span>Distanced Buyer</span>
              <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] font-bold">
                {buyerBDistanceKm} km away
              </span>
            </div>

            <h3 className="text-base font-bold text-slate-900">Buyer B (Metro Supermarket)</h3>
            
            <div className="mt-4 space-y-2 p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Sticker Price (High):</span>
                <span className="font-extrabold text-indigo-700">₹{buyerBPrice}.00/kg</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Transport Cost (Heavy):</span>
                <span className="font-semibold text-rose-600">−₹{buyerBTransportRatePerKg.toFixed(2)}/kg</span>
              </div>
              <div className="pt-2 border-t border-slate-200 flex justify-between font-bold text-slate-900">
                <span>Net Rate:</span>
                <span className="text-slate-800 font-black">₹{buyerBNetPerKg.toFixed(2)}/kg</span>
              </div>
            </div>

            <div className="mt-4 text-center">
              <div className="text-xs text-slate-500 font-medium">Total Net Realization</div>
              <div className="text-2xl font-black text-slate-800 mt-0.5">
                ₹{buyerBTotalNet.toLocaleString()}
              </div>
              <div className="text-[11px] text-slate-500 mt-0.5">
                Net gain vs Mandi: ₹{(buyerBTotalNet - mandiTotalNet).toLocaleString()}
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-amber-800 bg-amber-50/70 p-2 rounded-lg font-medium">
            ⚠️ Illusion Trap: Looks like ₹29/kg, but 68 km freight completely eats the difference.
          </div>
        </div>

      </div>

      {/* Interactive Controls Panel */}
      <div className="glass-panel p-5 sm:p-6 rounded-2xl space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-200">
          <Sliders className="h-4 w-4 text-emerald-700" />
          <h3 className="font-bold text-slate-900 text-sm sm:text-base">
            Simulate Your Own Distance, Fuel, & Produce Volume
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          
          {/* Quantity Slider */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-slate-600">Crop Quantity:</span>
              <span className="text-emerald-700 font-black">{quantityKg.toLocaleString()} kg</span>
            </div>
            <input
              type="range"
              min="200"
              max="5000"
              step="100"
              value={quantityKg}
              onChange={(e) => setQuantityKg(Number(e.target.value))}
              className="w-full accent-emerald-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>200 kg</span>
              <span>2,500 kg</span>
              <span>5,000 kg</span>
            </div>
          </div>

          {/* Buyer A Price Slider */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-slate-600">Buyer A Price (₹/kg):</span>
              <span className="text-emerald-700 font-black">₹{buyerAPrice}</span>
            </div>
            <input
              type="range"
              min="20"
              max="40"
              step="0.5"
              value={buyerAPrice}
              onChange={(e) => setBuyerAPrice(Number(e.target.value))}
              className="w-full accent-emerald-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>₹20</span>
              <span>₹30</span>
              <span>₹40</span>
            </div>
          </div>

          {/* Buyer B Transport Slider */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-slate-600">Buyer B Transport Cost (₹/kg):</span>
              <span className="text-rose-600 font-black">₹{buyerBTransportRatePerKg.toFixed(1)}</span>
            </div>
            <input
              type="range"
              min="1.0"
              max="8.0"
              step="0.5"
              value={buyerBTransportRatePerKg}
              onChange={(e) => setBuyerBTransportRatePerKg(Number(e.target.value))}
              className="w-full accent-emerald-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>₹1.0/kg (local)</span>
              <span>₹4.0/kg</span>
              <span>₹8.0/kg (far)</span>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
};
