import React, { useState } from 'react';
import { X, Sprout, Sparkles, MapPin, Calendar, Scale, Award, ArrowRight } from 'lucide-react';
import { CropLot, QualityGrade } from '../types';

interface CropLotCreatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateLot: (lot: CropLot) => void;
}

export const CropLotCreatorModal: React.FC<CropLotCreatorModalProps> = ({
  isOpen,
  onClose,
  onCreateLot,
}) => {
  const [cropName, setCropName] = useState<string>('Tomato');
  const [variety, setVariety] = useState<string>('Hybrid Roma (Shivaji)');
  const [quantityKg, setQuantityKg] = useState<number>(1000);
  const [grade, setGrade] = useState<QualityGrade>('Grade A');
  const [harvestDate, setHarvestDate] = useState<string>('Tomorrow (Morning 6:00 AM)');
  const [location, setLocation] = useState<string>('Kolar, Karnataka');
  const [farmerName, setFarmerName] = useState<string>('Ramesh Gowda');
  const [mandiPrice, setMandiPrice] = useState<number>(25);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newLot: CropLot = {
      id: `lot-${Date.now()}`,
      farmerName,
      farmerPhone: '+91 98450 12849',
      cropName,
      variety,
      quantityKg: Number(quantityKg),
      grade,
      harvestDate,
      location,
      photoUrl: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=800&auto=format&fit=crop&q=80',
      benchmarkMandiPrice: Number(mandiPrice),
      nearestMandiName: `${location.split(',')[0]} APMC Market`,
      status: 'active',
      createdAt: new Date().toISOString(),
    };
    onCreateLot(newLot);
    onClose();
  };

  const loadPreset = (presetCrop: string, presetQty: number, presetLoc: string, price: number) => {
    setCropName(presetCrop);
    setQuantityKg(presetQty);
    setLocation(presetLoc);
    setMandiPrice(price);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-lg rounded-3xl glass-panel p-6 shadow-2xl space-y-5 bg-white/95 border border-white">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-200">
          <div className="flex items-center gap-2.5">
            <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center text-white shadow-md">
              <Sprout className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-base sm:text-lg">
                Step 1: Create New Crop Lot
              </h3>
              <p className="text-xs text-slate-500">
                Enter harvest details to trigger automatic fair price discovery & buyer matches
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Quick Presets */}
        <div className="space-y-1">
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Quick Presets:</div>
          <div className="flex flex-wrap gap-1.5">
            <button
              type="button"
              onClick={() => loadPreset('Tomato', 1000, 'Kolar, Karnataka', 25)}
              className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100 transition"
            >
              🍅 Ramesh (1,000kg Tomato - Kolar)
            </button>
            <button
              type="button"
              onClick={() => loadPreset('Potato', 2000, 'Hassan, Karnataka', 22)}
              className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200 hover:bg-slate-200 transition"
            >
              🥔 Patil (2,000kg Potato - Hassan)
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Crop Name</label>
              <input
                type="text"
                value={cropName}
                onChange={(e) => setCropName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white font-medium"
                required
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Quantity (kg)</label>
              <input
                type="number"
                value={quantityKg}
                onChange={(e) => setQuantityKg(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white font-medium"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Quality Grade</label>
              <select
                value={grade}
                onChange={(e) => setGrade(e.target.value as QualityGrade)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white font-medium"
              >
                <option value="Grade A">Grade A (Hotel & Export Quality)</option>
                <option value="Grade B">Grade B (Retail Mandi Standard)</option>
                <option value="Grade C">Grade C (Processing Pulp Grade)</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Harvest Schedule</label>
              <input
                type="text"
                value={harvestDate}
                onChange={(e) => setHarvestDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white font-medium"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Farm Location</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white font-medium"
                required
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Local Mandi Rate (₹/kg)</label>
              <input
                type="number"
                step="0.5"
                value={mandiPrice}
                onChange={(e) => setMandiPrice(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white font-medium"
                required
              />
            </div>
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-md flex items-center gap-1.5 active:scale-95"
            >
              <span>Publish Lot & Discover Prices</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
