'use client';

import React, { useState, useEffect } from 'react';
import { Modal } from '@/components/ui/Modal';
import { useSolarFlow } from '@/context/SolarFlowContext';
import { formatINR } from '@/utils/formatters';
import { Calculator, Sparkles, FileText, CheckCircle2 } from 'lucide-react';

interface QuotationBuilderModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialCapacity?: number;
  initialCustomerId?: string;
}

export const QuotationBuilderModal: React.FC<QuotationBuilderModalProps> = ({
  isOpen,
  onClose,
  initialCapacity,
  initialCustomerId,
}) => {
  const { customers, addQuotation, companySettings } = useSolarFlow();

  const [customerId, setCustomerId] = useState(
    initialCustomerId || customers[0]?.id || ''
  );
  const [systemCapacityKW, setSystemCapacityKW] = useState<number>(initialCapacity || 100);

  // Equipment selection
  const [panelBrand, setPanelBrand] = useState('Waaree Bi-54 545W Mono PERC Bifacial');
  const [panelWattage, setPanelWattage] = useState<number>(545);
  const [inverterBrand, setInverterBrand] = useState('Sungrow Commercial String Inverter');
  const [structureType, setStructureType] = useState('HDG Aluminium Standing Seam Rail-less');

  // Rate parameters (per Watt or lump sum standard Indian EPC costing)
  // Panel ~₹16/W, Inverter ~₹6/W, Structure ~₹3.5/W, Installation ~₹3/W, BOS ~₹2.8/W, Liaisoning ~₹1/W
  const [costPerWattPanel, setCostPerWattPanel] = useState<number>(16);
  const [costPerWattInverter, setCostPerWattInverter] = useState<number>(6);
  const [costPerWattStructure, setCostPerWattStructure] = useState<number>(3.5);
  const [costPerWattInstallation, setCostPerWattInstallation] = useState<number>(3);
  const [costPerWattBOS, setCostPerWattBOS] = useState<number>(2.8);
  const [liaisoningCost, setLiaisoningCost] = useState<number>(150000);

  const [discount, setDiscount] = useState<number>(50000);
  const [gstRate, setGstRate] = useState<number>(companySettings.defaultGstRate || 13.8);

  const [paymentTerms, setPaymentTerms] = useState(
    '20% Advance with PO, 60% Against Material Delivery, 15% on Mechanical Erection, 5% on Net Meter Commissioning'
  );

  useEffect(() => {
    if (initialCapacity) setSystemCapacityKW(initialCapacity);
    if (initialCustomerId) setCustomerId(initialCustomerId);
  }, [initialCapacity, initialCustomerId]);

  const currentCustomer = customers.find((c) => c.id === customerId);

  // Calculations
  const systemWatts = systemCapacityKW * 1000;
  const panelCount = Math.ceil(systemWatts / panelWattage);

  const panelCost = Math.round(systemWatts * costPerWattPanel);
  const inverterCost = Math.round(systemWatts * costPerWattInverter);
  const structureCost = Math.round(systemWatts * costPerWattStructure);
  const installationCost = Math.round(systemWatts * costPerWattInstallation);
  const bosAndCablesCost = Math.round(systemWatts * costPerWattBOS);

  const rawSubtotal =
    panelCost +
    inverterCost +
    structureCost +
    installationCost +
    bosAndCablesCost +
    liaisoningCost -
    discount;

  const subtotal = Math.max(0, rawSubtotal);
  const totalGST = Math.round((subtotal * gstRate) / 100);
  const grandTotal = subtotal + totalGST;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentCustomer) return;

    addQuotation({
      customerId: currentCustomer.id,
      customerName: currentCustomer.name,
      company: currentCustomer.company,
      siteLocation: `${currentCustomer.address}, ${currentCustomer.city}`,
      systemCapacityKW,
      panelBrand,
      panelWattage,
      panelCount,
      inverterBrand,
      inverterCapacityKW: systemCapacityKW,
      structureType,
      panelCost,
      inverterCost,
      structureCost,
      installationCost,
      bosAndCablesCost,
      liaisoningNetMeteringCost: liaisoningCost,
      discount,
      gstRate,
      subtotal,
      totalGST,
      grandTotal,
      status: 'Sent',
      validUntil: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
      paymentTerms,
    });

    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Turnkey Solar EPC Quotation Builder"
      subtitle="Configure equipment, itemized BOQ, GST & payment milestones"
      maxWidth="4xl"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Customer & System Sizing Header */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Select Client Account *
            </label>
            <select
              value={customerId}
              onChange={(e) => setCustomerId(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none bg-white"
            >
              {customers.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.company} ({c.city} - {c.discom})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              System Capacity (kWp) *
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min="5"
                step="5"
                value={systemCapacityKW}
                onChange={(e) => setSystemCapacityKW(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 text-sm font-bold text-amber-700 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none"
              />
              <span className="text-xs font-semibold text-slate-500 whitespace-nowrap">
                {panelCount} Modules
              </span>
            </div>
          </div>
        </div>

        {/* Equipment & Technology Specs */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2.5">
            Key Equipment & Technical Specifications
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                Solar PV Module
              </label>
              <select
                value={panelBrand}
                onChange={(e) => {
                  setPanelBrand(e.target.value);
                  if (e.target.value.includes('550W')) setPanelWattage(550);
                  else if (e.target.value.includes('545W')) setPanelWattage(545);
                  else if (e.target.value.includes('540W')) setPanelWattage(540);
                }}
                className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 bg-white"
              >
                <option value="Waaree Bi-54 545W Mono PERC Bifacial">Waaree Bi-54 545W Mono PERC</option>
                <option value="Adani Solar Shine 550W TopCon Bifacial">Adani Solar 550W TopCon</option>
                <option value="Vikram Solar 540W Mono PERC Half-Cut">Vikram Solar 540W Mono</option>
                <option value="Tata Power Solar 540W Mono PERC">Tata Power 540W Mono</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                Grid-Tied Solar Inverter
              </label>
              <select
                value={inverterBrand}
                onChange={(e) => setInverterBrand(e.target.value)}
                className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 bg-white"
              >
                <option value="Sungrow Commercial Multi-MPPT String Inverter">Sungrow String Inverters</option>
                <option value="Growatt MAX Series Commercial Inverter">Growatt MAX Inverters</option>
                <option value="Solis 3-Phase Commercial Inverter">Solis 3-Phase Inverters</option>
                <option value="Polycab Solar Grid-Tied Inverter">Polycab Solar Inverters</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                Module Mounting Structure (MMS)
              </label>
              <select
                value={structureType}
                onChange={(e) => setStructureType(e.target.value)}
                className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 bg-white"
              >
                <option value="HDG Aluminium Standing Seam Rail-less">Aluminium Rail-less Clamp (Shed)</option>
                <option value="Elevated Hot-Dip Galvanized MS Structure">Elevated HDG Structure (RCC)</option>
                <option value="Ballasted Non-Penetrative Concrete Mount">Ballasted Non-Penetrative</option>
                <option value="Ground Mount Fixed Tilt Purlin">Ground Mount Fixed Tilt</option>
              </select>
            </div>
          </div>
        </div>

        {/* Commercial Cost Breakdown (Bill of Quantities) */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2.5 flex items-center justify-between">
            <span>Itemized EPC Costing (₹/Watt / Lump Sum)</span>
            <span className="text-[11px] text-solar-600 font-medium">Interactive Cost Simulator</span>
          </h4>

          <div className="border border-slate-200 rounded-xl overflow-hidden divide-y divide-slate-100 text-xs">
            {/* Panels */}
            <div className="p-3 bg-white flex items-center justify-between gap-4">
              <div className="w-1/2">
                <span className="font-semibold text-slate-800">Tier-1 Solar PV Modules</span>
                <span className="text-[11px] text-slate-500 block">
                  {panelCount} modules @ {panelWattage}Wp each
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-slate-400">₹</span>
                <input
                  type="number"
                  step="0.5"
                  value={costPerWattPanel}
                  onChange={(e) => setCostPerWattPanel(parseFloat(e.target.value) || 0)}
                  className="w-16 px-2 py-1 border rounded text-right"
                />
                <span className="text-slate-500">/Wp</span>
              </div>
              <span className="font-bold text-slate-900 w-28 text-right">
                {formatINR(panelCost)}
              </span>
            </div>

            {/* Inverters */}
            <div className="p-3 bg-white flex items-center justify-between gap-4">
              <div className="w-1/2">
                <span className="font-semibold text-slate-800">Solar Inverters & Communication Datalogger</span>
                <span className="text-[11px] text-slate-500 block">IP66 rated with WiFi/4G stick</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-slate-400">₹</span>
                <input
                  type="number"
                  step="0.5"
                  value={costPerWattInverter}
                  onChange={(e) => setCostPerWattInverter(parseFloat(e.target.value) || 0)}
                  className="w-16 px-2 py-1 border rounded text-right"
                />
                <span className="text-slate-500">/Wp</span>
              </div>
              <span className="font-bold text-slate-900 w-28 text-right">
                {formatINR(inverterCost)}
              </span>
            </div>

            {/* MMS */}
            <div className="p-3 bg-white flex items-center justify-between gap-4">
              <div className="w-1/2">
                <span className="font-semibold text-slate-800">Mounting Structure & Hardware</span>
                <span className="text-[11px] text-slate-500 block">SS304 fasteners, wind rated 180 km/h</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-slate-400">₹</span>
                <input
                  type="number"
                  step="0.5"
                  value={costPerWattStructure}
                  onChange={(e) => setCostPerWattStructure(parseFloat(e.target.value) || 0)}
                  className="w-16 px-2 py-1 border rounded text-right"
                />
                <span className="text-slate-500">/Wp</span>
              </div>
              <span className="font-bold text-slate-900 w-28 text-right">
                {formatINR(structureCost)}
              </span>
            </div>

            {/* Cables & BOS */}
            <div className="p-3 bg-white flex items-center justify-between gap-4">
              <div className="w-1/2">
                <span className="font-semibold text-slate-800">Balance of System (BOS) & Cables</span>
                <span className="text-[11px] text-slate-500 block">
                  DC/AC XLPO cables, DCDB/ACDB, SPD & Chemical Earthing
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-slate-400">₹</span>
                <input
                  type="number"
                  step="0.2"
                  value={costPerWattBOS}
                  onChange={(e) => setCostPerWattBOS(parseFloat(e.target.value) || 0)}
                  className="w-16 px-2 py-1 border rounded text-right"
                />
                <span className="text-slate-500">/Wp</span>
              </div>
              <span className="font-bold text-slate-900 w-28 text-right">
                {formatINR(bosAndCablesCost)}
              </span>
            </div>

            {/* Installation */}
            <div className="p-3 bg-white flex items-center justify-between gap-4">
              <div className="w-1/2">
                <span className="font-semibold text-slate-800">Installation, Civil & Electrical Works</span>
                <span className="text-[11px] text-slate-500 block">
                  Module handling, erection, termination & testing
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-slate-400">₹</span>
                <input
                  type="number"
                  step="0.2"
                  value={costPerWattInstallation}
                  onChange={(e) => setCostPerWattInstallation(parseFloat(e.target.value) || 0)}
                  className="w-16 px-2 py-1 border rounded text-right"
                />
                <span className="text-slate-500">/Wp</span>
              </div>
              <span className="font-bold text-slate-900 w-28 text-right">
                {formatINR(installationCost)}
              </span>
            </div>

            {/* Liaisoning */}
            <div className="p-3 bg-white flex items-center justify-between gap-4">
              <div className="w-1/2">
                <span className="font-semibold text-slate-800">
                  DISCOM Net Metering & CEIG Statutory Approvals
                </span>
                <span className="text-[11px] text-slate-500 block">
                  End-to-end DISCOM sanction, transformer test & meter sync
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-slate-500 text-xs">Lump Sum</span>
              </div>
              <div className="w-28 text-right">
                <input
                  type="number"
                  step="10000"
                  value={liaisoningCost}
                  onChange={(e) => setLiaisoningCost(parseFloat(e.target.value) || 0)}
                  className="w-full px-2 py-1 border rounded text-right font-bold"
                />
              </div>
            </div>

            {/* Discount */}
            <div className="p-3 bg-amber-50/30 flex items-center justify-between gap-4">
              <div className="w-1/2">
                <span className="font-semibold text-amber-900">Commercial EPC Discount / Promotion</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-slate-500 text-xs">Discount (₹)</span>
              </div>
              <div className="w-28 text-right">
                <input
                  type="number"
                  step="5000"
                  value={discount}
                  onChange={(e) => setDiscount(parseFloat(e.target.value) || 0)}
                  className="w-full px-2 py-1 border rounded text-right font-bold text-emerald-700 bg-white"
                />
              </div>
            </div>
          </div>
        </div>

        {/* GST and Summary Calculations */}
        <div className="p-4 rounded-xl bg-slate-900 text-white space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-300">
            <span>Subtotal (Excl. Taxes):</span>
            <span className="font-semibold text-white">{formatINR(subtotal)}</span>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-300">
            <div className="flex items-center gap-2">
              <span>GST on EPC Works (Composite):</span>
              <input
                type="number"
                step="0.1"
                value={gstRate}
                onChange={(e) => setGstRate(parseFloat(e.target.value) || 0)}
                className="w-14 px-1.5 py-0.5 text-xs rounded bg-slate-800 text-amber-400 font-bold border border-slate-700"
              />
              <span>%</span>
            </div>
            <span className="font-semibold text-white">{formatINR(totalGST)}</span>
          </div>

          <div className="pt-2 border-t border-slate-700 flex items-center justify-between">
            <div>
              <span className="text-sm font-bold text-white block">Grand Total (Inclusive of Taxes)</span>
              <span className="text-[11px] text-amber-400">
                Rate: ₹{(grandTotal / systemCapacityKW).toFixed(0)} per kWp installed
              </span>
            </div>
            <span className="text-2xl font-extrabold text-amber-400">
              {formatINR(grandTotal)}
            </span>
          </div>
        </div>

        {/* Payment Terms */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Payment Milestones & Commercial Conditions
          </label>
          <input
            type="text"
            value={paymentTerms}
            onChange={(e) => setPaymentTerms(e.target.value)}
            className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none"
          />
        </div>

        <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-5 py-2 text-sm font-bold text-slate-950 bg-amber-500 hover:bg-amber-400 rounded-lg shadow-md transition-all flex items-center gap-1.5"
          >
            <Sparkles className="w-4 h-4" />
            Generate Quotation
          </button>
        </div>
      </form>
    </Modal>
  );
};
