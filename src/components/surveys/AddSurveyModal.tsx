'use client';

import React, { useState, useEffect } from 'react';
import { Modal } from '@/components/ui/Modal';
import { useSolarFlow } from '@/context/SolarFlowContext';
import { SurveyStatus } from '@/types';
import { Compass, Calculator, Info } from 'lucide-react';

interface AddSurveyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddSurveyModal: React.FC<AddSurveyModalProps> = ({ isOpen, onClose }) => {
  const { customers, addSurvey } = useSolarFlow();

  const [selectedCustomerId, setSelectedCustomerId] = useState(
    customers[0]?.id || ''
  );
  const [roofType, setRoofType] = useState<'RCC Flat Roof' | 'Metal Shed Sheet' | 'Tile/Sloped' | 'Ground Mount'>('Metal Shed Sheet');
  const [roofAreaSqFt, setRoofAreaSqFt] = useState<number>(20000);
  const [shadowFreeAreaSqFt, setShadowFreeAreaSqFt] = useState<number>(18000);
  const [monthlyUnits, setMonthlyUnits] = useState<number>(30000);
  const [avgMonthlyBill, setAvgMonthlyBill] = useState<number>(270000);
  const [orientation, setOrientation] = useState('True South (180°)');
  const [tiltAngle, setTiltAngle] = useState<number>(15);
  const [surveyorName, setSurveyorName] = useState('Hardik Trivedi (Lead Engineer)');
  const [notes, setNotes] = useState('');

  // Auto Calculations:
  // In India, 1 kW solar requires approx 80-100 sq ft shadow-free area (Mono PERC ~545W+ modules).
  // Sizing by roof: shadowFreeArea / 90 sq ft per kW
  // Sizing by consumption: (monthlyUnits * 12) / 1500 kWh per year per kW
  const calculatedCapacityByRoof = Math.round(shadowFreeAreaSqFt / 90);
  const calculatedCapacityByUnits = Math.round((monthlyUnits * 12) / 1500);

  // Recommended capacity is the constrained capacity (capped by 100% of sanctioned load / consumption or available roof)
  const recommendedCapacityKW = Math.min(calculatedCapacityByRoof, Math.max(10, calculatedCapacityByUnits));
  const estimatedYearlyGenerationKWh = Math.round(recommendedCapacityKW * 1500);

  const currentCustomer = customers.find((c) => c.id === selectedCustomerId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentCustomer) return;

    addSurvey({
      customerId: currentCustomer.id,
      customerName: currentCustomer.name,
      company: currentCustomer.company,
      siteLocation: `${currentCustomer.address}, ${currentCustomer.city}`,
      city: currentCustomer.city,
      roofType,
      roofAreaSqFt,
      shadowFreeAreaSqFt,
      monthlyElectricityUnits: monthlyUnits,
      avgMonthlyBill,
      recommendedCapacityKW,
      estimatedYearlyGenerationKWh,
      structureOrientation: orientation,
      tiltAngle,
      surveyDate: new Date().toISOString().split('T')[0],
      surveyorName,
      status: 'Completed',
      notes,
    });

    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create Site Feasibility Survey"
      subtitle="Engineering assessment & automated solar capacity sizing"
      maxWidth="3xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Customer Select */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Client / Enterprise *
          </label>
          <select
            value={selectedCustomerId}
            onChange={(e) => setSelectedCustomerId(e.target.value)}
            className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none bg-white"
          >
            {customers.map((c) => (
              <option key={c.id} value={c.id}>
                {c.company} — {c.city} ({c.discom})
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Rooftop / Site Type
            </label>
            <select
              value={roofType}
              onChange={(e) => setRoofType(e.target.value as any)}
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none bg-white"
            >
              <option value="Metal Shed Sheet">Metal Shed Sheet (PEB)</option>
              <option value="RCC Flat Roof">RCC Flat Roof</option>
              <option value="Tile/Sloped">Tile / Sloped Roof</option>
              <option value="Ground Mount">Ground Mount Land</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Lead Surveyor / Engineer
            </label>
            <input
              type="text"
              value={surveyorName}
              onChange={(e) => setSurveyorName(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Total Roof Area (sq. ft.)
            </label>
            <input
              type="number"
              min="100"
              value={roofAreaSqFt}
              onChange={(e) => {
                const val = parseFloat(e.target.value) || 0;
                setRoofAreaSqFt(val);
                setShadowFreeAreaSqFt(Math.round(val * 0.85)); // 85% shadow free default
              }}
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Shadow-Free Usable Area (sq. ft.)
            </label>
            <input
              type="number"
              min="50"
              value={shadowFreeAreaSqFt}
              onChange={(e) => setShadowFreeAreaSqFt(parseFloat(e.target.value) || 0)}
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Average Monthly Electricity (kWh / Units)
            </label>
            <input
              type="number"
              min="100"
              value={monthlyUnits}
              onChange={(e) => {
                const units = parseFloat(e.target.value) || 0;
                setMonthlyUnits(units);
                setAvgMonthlyBill(Math.round(units * 8.5)); // ~₹8.5 per industrial HT unit
              }}
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Average Monthly Bill (₹)
            </label>
            <input
              type="number"
              value={avgMonthlyBill}
              onChange={(e) => setAvgMonthlyBill(parseFloat(e.target.value) || 0)}
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Azimuth / Orientation
            </label>
            <input
              type="text"
              value={orientation}
              onChange={(e) => setOrientation(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Tilt Angle (Degrees)
            </label>
            <input
              type="number"
              min="0"
              max="45"
              value={tiltAngle}
              onChange={(e) => setTiltAngle(parseFloat(e.target.value) || 0)}
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Live Frontend Calculation Results */}
        <div className="p-4 rounded-xl bg-gradient-to-r from-amber-500/10 to-emerald-500/10 border border-amber-300/80">
          <div className="flex items-center gap-2 text-amber-900 font-bold text-xs uppercase tracking-wider mb-2">
            <Calculator className="w-4 h-4 text-amber-600" />
            Automated Solar Capacity & Generation Sizing
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-center">
            <div className="p-2.5 rounded-lg bg-white/90 border border-amber-200">
              <span className="text-[11px] text-slate-500 block">Recommended Capacity</span>
              <span className="text-lg font-bold text-amber-700">{recommendedCapacityKW} kW</span>
              <span className="text-[10px] text-slate-400 block mt-0.5">Based on shadow-free area</span>
            </div>
            <div className="p-2.5 rounded-lg bg-white/90 border border-amber-200">
              <span className="text-[11px] text-slate-500 block">Est. Annual Generation</span>
              <span className="text-lg font-bold text-emerald-700">
                {(estimatedYearlyGenerationKWh / 1000).toFixed(1)}k kWh
              </span>
              <span className="text-[10px] text-slate-400 block mt-0.5">@ 1500 kWh/kWp/yr</span>
            </div>
            <div className="p-2.5 rounded-lg bg-white/90 border border-amber-200">
              <span className="text-[11px] text-slate-500 block">Est. Annual Bill Savings</span>
              <span className="text-lg font-bold text-slate-900">
                ₹{((estimatedYearlyGenerationKWh * 8.5) / 100000).toFixed(2)} Lakhs
              </span>
              <span className="text-[10px] text-slate-400 block mt-0.5">@ ₹8.5/unit tariff</span>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Site Notes & Structural Observations
          </label>
          <textarea
            rows={2}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="e.g. Purling spacing 1.4m, roof corrosion-free, high water pressure available for module washing..."
            className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none"
          />
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-5 py-2 text-sm font-bold text-slate-950 bg-amber-500 hover:bg-amber-400 rounded-lg shadow-sm"
          >
            Save Survey Report
          </button>
        </div>
      </form>
    </Modal>
  );
};
