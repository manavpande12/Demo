'use client';

import React, { useState } from 'react';
import { useSolarFlow } from '@/context/SolarFlowContext';
import { Badge } from '@/components/ui/Badge';
import { formatINR, formatCapacity, formatDate } from '@/utils/formatters';
import { Quotation, QuotationStatus } from '@/types';
import { QuotationBuilderModal } from './QuotationBuilderModal';
import { QuotationPrintView } from './QuotationPrintView';
import {
  FileText,
  Plus,
  Search,
  Printer,
  CheckCircle2,
  Clock,
  Eye,
  ArrowRight,
  TrendingUp,
  FolderKanban,
} from 'lucide-react';

interface QuotationsViewProps {
  isCreateModalOpen: boolean;
  onCloseCreateModal: () => void;
  onOpenCreateModal: () => void;
  initialCapacity?: number;
  initialCustomerId?: string;
}

export const QuotationsView: React.FC<QuotationsViewProps> = ({
  isCreateModalOpen,
  onCloseCreateModal,
  onOpenCreateModal,
  initialCapacity,
  initialCustomerId,
}) => {
  const { quotations, updateQuotationStatus, addProject, setActiveTab } = useSolarFlow();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [viewingQuotation, setViewingQuotation] = useState<Quotation | null>(null);

  const filteredQuotations = quotations.filter((q) => {
    const matchesSearch =
      q.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.quotationNumber.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'ALL' || q.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalAcceptedValue = quotations
    .filter((q) => q.status === 'Accepted')
    .reduce((acc, q) => acc + q.grandTotal, 0);

  const totalPipelineValue = quotations
    .filter((q) => q.status === 'Sent' || q.status === 'Under Review')
    .reduce((acc, q) => acc + q.grandTotal, 0);

  return (
    <div className="space-y-5 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Solar EPC Quotations</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Accepted Proposals: <span className="font-bold text-emerald-700">{formatINR(totalAcceptedValue, true)}</span> &bull; Open Under Review: <span className="font-bold text-amber-700">{formatINR(totalPipelineValue, true)}</span>
          </p>
        </div>

        <button
          onClick={onOpenCreateModal}
          className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm shadow-sm transition-all"
        >
          <Plus className="w-4 h-4" />
          Build New Quotation
        </button>
      </div>

      {/* Filter Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search by quote #, company, or customer..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none"
          />
        </div>

        <div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none bg-white"
          >
            <option value="ALL">All Proposal Statuses</option>
            <option value="Accepted">Accepted / Won</option>
            <option value="Under Review">Under Review</option>
            <option value="Sent">Sent to Client</option>
            <option value="Draft">Draft</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Quotation Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/75 text-slate-600 font-semibold uppercase text-[11px] tracking-wider">
                <th className="py-3 px-4">Quotation # & Date</th>
                <th className="py-3 px-4">Customer & Site</th>
                <th className="py-3 px-4">Capacity & Hardware</th>
                <th className="py-3 px-4">Grand Total (Incl. GST)</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredQuotations.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-slate-400">
                    No quotations match your filter criteria.
                  </td>
                </tr>
              ) : (
                filteredQuotations.map((quote) => (
                  <tr key={quote.id} className="hover:bg-slate-50/70 transition-colors">
                    {/* Number & Date */}
                    <td className="py-3.5 px-4">
                      <span className="font-mono font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded text-xs">
                        {quote.quotationNumber}
                      </span>
                      <span className="text-[11px] text-slate-400 block mt-1">
                        Dated: {formatDate(quote.createdAt)}
                      </span>
                      <span className="text-[10px] text-slate-500">
                        Valid till: {formatDate(quote.validUntil)}
                      </span>
                    </td>

                    {/* Customer */}
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900">{quote.company}</div>
                      <div className="text-xs text-slate-500">{quote.customerName}</div>
                      <span className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                        {quote.siteLocation}
                      </span>
                    </td>

                    {/* Hardware */}
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-amber-600">
                        {formatCapacity(quote.systemCapacityKW)}
                      </div>
                      <span className="text-[11px] text-slate-600 block truncate max-w-xs">
                        {quote.panelCount}x {quote.panelBrand.split(' ')[0]} {quote.panelWattage}W
                      </span>
                      <span className="text-[10px] text-slate-400 block truncate max-w-xs">
                        {quote.inverterBrand}
                      </span>
                    </td>

                    {/* Total */}
                    <td className="py-3.5 px-4">
                      <div className="font-extrabold text-slate-900 text-sm">
                        {formatINR(quote.grandTotal)}
                      </div>
                      <span className="text-[11px] text-slate-500 block">
                        Base: {formatINR(quote.subtotal, true)} + GST {quote.gstRate}%
                      </span>
                    </td>

                    {/* Status Dropdown */}
                    <td className="py-3.5 px-4">
                      <select
                        value={quote.status}
                        onChange={(e) =>
                          updateQuotationStatus(quote.id, e.target.value as QuotationStatus)
                        }
                        className={`text-xs font-semibold px-2 py-1 rounded-lg border focus:outline-none cursor-pointer ${
                          quote.status === 'Accepted'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                            : quote.status === 'Under Review'
                            ? 'bg-purple-50 text-purple-700 border-purple-300'
                            : quote.status === 'Rejected'
                            ? 'bg-rose-50 text-rose-700 border-rose-300'
                            : 'bg-amber-50 text-amber-700 border-amber-300'
                        }`}
                      >
                        <option value="Draft">Draft</option>
                        <option value="Sent">Sent</option>
                        <option value="Under Review">Under Review</option>
                        <option value="Accepted">Accepted</option>
                        <option value="Rejected">Rejected</option>
                      </select>
                    </td>

                    {/* Action */}
                    <td className="py-3.5 px-4 text-right space-x-2">
                      <button
                        onClick={() => setViewingQuotation(quote)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-900 bg-amber-100 hover:bg-amber-200 rounded-lg transition-colors shadow-xs"
                      >
                        <Eye className="w-3.5 h-3.5 text-slate-800" />
                        View / Print
                      </button>

                      {quote.status === 'Accepted' && (
                        <button
                          onClick={() => {
                            addProject({
                              customerId: quote.customerId,
                              customerName: quote.customerName,
                              company: quote.company,
                              location: quote.siteLocation,
                              city: quote.siteLocation.split(',')[1]?.trim() || 'Pune',
                              capacityKW: quote.systemCapacityKW,
                              projectType: 'Industrial Rooftop C&I',
                              status: 'Active',
                              startDate: new Date().toISOString().split('T')[0],
                              targetCompletionDate: new Date(Date.now() + 90 * 86400000).toISOString().split('T')[0],
                              projectManager: 'Mahesh Patil',
                              totalContractValue: quote.grandTotal,
                              stages: [],
                            });
                            setActiveTab('projects');
                          }}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-bold text-emerald-800 bg-emerald-100 hover:bg-emerald-200 rounded-lg transition-colors shadow-xs"
                          title="Initialize active turnkey project from accepted quote"
                        >
                          <FolderKanban className="w-3.5 h-3.5" />
                          To Project
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Builder Modal */}
      <QuotationBuilderModal
        isOpen={isCreateModalOpen}
        onClose={onCloseCreateModal}
        initialCapacity={initialCapacity}
        initialCustomerId={initialCustomerId}
      />

      {/* Print / View Modal */}
      <QuotationPrintView
        quotation={viewingQuotation}
        onClose={() => setViewingQuotation(null)}
      />
    </div>
  );
};
