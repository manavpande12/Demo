'use client';

import React from 'react';
import { Quotation } from '@/types';
import { useSolarFlow } from '@/context/SolarFlowContext';
import { Modal } from '@/components/ui/Modal';
import { formatINR, formatCapacity, formatDate } from '@/utils/formatters';
import { Printer, X, Sun, Download, ShieldCheck, Zap } from 'lucide-react';

interface QuotationPrintViewProps {
  quotation: Quotation | null;
  onClose: () => void;
}

export const QuotationPrintView: React.FC<QuotationPrintViewProps> = ({
  quotation,
  onClose,
}) => {
  const { companySettings } = useSolarFlow();

  if (!quotation) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <Modal
      isOpen={!!quotation}
      onClose={onClose}
      title={`Solar EPC Proposal: ${quotation.quotationNumber}`}
      subtitle={`Turnkey Solar Solution for ${quotation.company}`}
      maxWidth="4xl"
    >
      <div className="space-y-6 text-slate-800">
        {/* Action Header */}
        <div className="flex items-center justify-between no-print pb-3 border-b border-slate-100">
          <span className="text-xs text-slate-500">
            Official B2B EPC Proposal Document
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 text-white hover:bg-slate-800 text-xs font-bold transition-all shadow-sm"
            >
              <Printer className="w-3.5 h-3.5" />
              Print / Save PDF
            </button>
          </div>
        </div>

        {/* Printable Proposal Document */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6 print:border-none print:p-0">
          {/* Header & Letterhead */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-slate-200 pb-6">
            <div>
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center text-slate-950 font-bold">
                  <Sun className="w-5 h-5" />
                </div>
                <h2 className="text-xl font-extrabold tracking-tight text-slate-950">
                  {companySettings.companyName}
                </h2>
              </div>
              <p className="text-xs text-slate-500 mt-1 max-w-sm">
                {companySettings.tagline}
              </p>
              <p className="text-[11px] text-slate-400 mt-1">
                {companySettings.officeAddress}
              </p>
              <p className="text-[11px] text-slate-500 font-mono mt-0.5">
                GSTIN: {companySettings.gstNumber} | CIN: U40106GJ2021PTC121084
              </p>
            </div>

            <div className="text-left sm:text-right">
              <span className="inline-block px-3 py-1 rounded bg-amber-100 text-amber-900 font-mono font-bold text-xs">
                PROPOSAL #{quotation.quotationNumber}
              </span>
              <p className="text-xs text-slate-500 mt-2">
                Date: <span className="font-semibold text-slate-800">{formatDate(quotation.createdAt)}</span>
              </p>
              <p className="text-xs text-slate-500">
                Validity: <span className="font-semibold text-slate-800">{formatDate(quotation.validUntil)}</span>
              </p>
              <p className="text-xs text-slate-500">
                Status: <span className="font-bold text-emerald-700">{quotation.status}</span>
              </p>
            </div>
          </div>

          {/* Client & Site Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs">
            <div>
              <span className="font-bold text-slate-500 uppercase tracking-wider block mb-1">
                Proposal Prepared For:
              </span>
              <h4 className="text-sm font-bold text-slate-900">{quotation.company}</h4>
              <p className="text-slate-600 mt-0.5">Attn: {quotation.customerName}</p>
              <p className="text-slate-500 mt-1">{quotation.siteLocation}</p>
            </div>

            <div>
              <span className="font-bold text-slate-500 uppercase tracking-wider block mb-1">
                Proposed Solar PV Installation:
              </span>
              <div className="flex items-center gap-2">
                <span className="text-base font-extrabold text-amber-600">
                  {formatCapacity(quotation.systemCapacityKW)}
                </span>
                <span className="text-slate-500">Grid-Interactive Turnkey System</span>
              </div>
              <p className="text-slate-600 mt-1">
                Modules: {quotation.panelCount} Nos &bull; {quotation.panelWattage}Wp each
              </p>
              <p className="text-slate-500">
                Structure: {quotation.structureType}
              </p>
            </div>
          </div>

          {/* Bill of Quantities Table */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
              Itemized Commercial Schedule (BOQ)
            </h4>
            <table className="w-full border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-100 text-slate-700 font-bold">
                  <th className="py-2.5 px-3 text-left">#</th>
                  <th className="py-2.5 px-3 text-left">Description & Specifications</th>
                  <th className="py-2.5 px-3 text-center">Capacity / Qty</th>
                  <th className="py-2.5 px-3 text-right">Amount (₹)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                <tr>
                  <td className="py-2.5 px-3 font-semibold text-slate-400">01</td>
                  <td className="py-2.5 px-3">
                    <span className="font-bold text-slate-800 block">{quotation.panelBrand}</span>
                    <span className="text-[11px] text-slate-500">
                      Tier-1 ALMM enlisted high-efficiency mono PERC / TopCon bifacial modules
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-center font-medium text-slate-700">
                    {quotation.panelCount} Modules
                  </td>
                  <td className="py-2.5 px-3 text-right font-medium text-slate-900">
                    {formatINR(quotation.panelCost)}
                  </td>
                </tr>

                <tr>
                  <td className="py-2.5 px-3 font-semibold text-slate-400">02</td>
                  <td className="py-2.5 px-3">
                    <span className="font-bold text-slate-800 block">{quotation.inverterBrand}</span>
                    <span className="text-[11px] text-slate-500">
                      Multi-MPPT string inverter with integrated DC disconnector & datalogger
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-center font-medium text-slate-700">
                    {quotation.inverterCapacityKW} kW
                  </td>
                  <td className="py-2.5 px-3 text-right font-medium text-slate-900">
                    {formatINR(quotation.inverterCost)}
                  </td>
                </tr>

                <tr>
                  <td className="py-2.5 px-3 font-semibold text-slate-400">03</td>
                  <td className="py-2.5 px-3">
                    <span className="font-bold text-slate-800 block">Module Mounting Structure (MMS)</span>
                    <span className="text-[11px] text-slate-500">
                      {quotation.structureType} with SS304 A2-70 grade fasteners
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-center font-medium text-slate-700">1 Lot</td>
                  <td className="py-2.5 px-3 text-right font-medium text-slate-900">
                    {formatINR(quotation.structureCost)}
                  </td>
                </tr>

                <tr>
                  <td className="py-2.5 px-3 font-semibold text-slate-400">04</td>
                  <td className="py-2.5 px-3">
                    <span className="font-bold text-slate-800 block">Balance of System (BOS) & Cables</span>
                    <span className="text-[11px] text-slate-500">
                      Polycab XLPO 1.5kV DC cables, AC cables, DCDB/ACDB with Type II SPDs, Chemical Earthing
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-center font-medium text-slate-700">1 Lot</td>
                  <td className="py-2.5 px-3 text-right font-medium text-slate-900">
                    {formatINR(quotation.bosAndCablesCost)}
                  </td>
                </tr>

                <tr>
                  <td className="py-2.5 px-3 font-semibold text-slate-400">05</td>
                  <td className="py-2.5 px-3">
                    <span className="font-bold text-slate-800 block">Erection, Testing & Commissioning</span>
                    <span className="text-[11px] text-slate-500">
                      Civil foundation, mechanical structure mounting, electrical stringing & quality audits
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-center font-medium text-slate-700">Turnkey</td>
                  <td className="py-2.5 px-3 text-right font-medium text-slate-900">
                    {formatINR(quotation.installationCost)}
                  </td>
                </tr>

                <tr>
                  <td className="py-2.5 px-3 font-semibold text-slate-400">06</td>
                  <td className="py-2.5 px-3">
                    <span className="font-bold text-slate-800 block">
                      DISCOM Liaisoning & Net Metering Coordination
                    </span>
                    <span className="text-[11px] text-slate-500">
                      Application filing, CEIG inspection clearance, transformer sync, and bi-directional meter setup
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-center font-medium text-slate-700">Complete</td>
                  <td className="py-2.5 px-3 text-right font-medium text-slate-900">
                    {formatINR(quotation.liaisoningNetMeteringCost)}
                  </td>
                </tr>

                {quotation.discount > 0 && (
                  <tr className="bg-emerald-50/50">
                    <td className="py-2 px-3 font-semibold text-emerald-600">-</td>
                    <td className="py-2 px-3 font-bold text-emerald-700">
                      Special EPC Commercial Discount
                    </td>
                    <td className="py-2 px-3 text-center">-</td>
                    <td className="py-2 px-3 text-right font-bold text-emerald-700">
                      - {formatINR(quotation.discount)}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Financial Totals */}
          <div className="flex justify-end">
            <div className="w-full sm:w-80 space-y-2 text-xs border-t border-slate-200 pt-3">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal (Excl. Taxes):</span>
                <span className="font-semibold text-slate-900">{formatINR(quotation.subtotal)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Composite GST @ {quotation.gstRate}%:</span>
                <span className="font-semibold text-slate-900">{formatINR(quotation.totalGST)}</span>
              </div>
              <div className="flex justify-between text-base font-extrabold text-slate-950 pt-2 border-t border-slate-300">
                <span>Total Turnkey Price:</span>
                <span className="text-amber-600">{formatINR(quotation.grandTotal)}</span>
              </div>
            </div>
          </div>

          {/* Payment Terms and Warranties */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-200 text-[11px]">
            <div>
              <span className="font-bold text-slate-700 block mb-1">Payment Milestones:</span>
              <p className="text-slate-600 leading-relaxed bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                {quotation.paymentTerms}
              </p>
            </div>
            <div>
              <span className="font-bold text-slate-700 block mb-1">Standard Warranties:</span>
              <ul className="text-slate-600 space-y-1 bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                <li>&bull; <strong>25 Years</strong> Linear Performance Warranty on PV Modules</li>
                <li>&bull; <strong>8 Years</strong> Manufacturer Replacement Warranty on Inverters</li>
                <li>&bull; <strong>5 Years</strong> Comprehensive O&M & Free Generation Maintenance</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};
