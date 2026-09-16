'use client';

import React, { useState, useMemo } from 'react';
import { useSolarFlow } from '@/context/SolarFlowContext';
import { Badge } from '@/components/ui/Badge';
import { formatINR, formatCapacity, formatDate } from '@/utils/formatters';
import { LeadStatus } from '@/types';
import {
  Search,
  Filter,
  Plus,
  Building2,
  Phone,
  Mail,
  Calendar,
  CheckCircle2,
  ArrowRight,
  TrendingUp,
  MapPin,
  HelpCircle,
} from 'lucide-react';

export const LeadsView: React.FC<{ onOpenAddLead: () => void }> = ({ onOpenAddLead }) => {
  const { leads, updateLeadStatus, convertLeadToCustomer, setActiveTab } = useSolarFlow();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [sourceFilter, setSourceFilter] = useState<string>('ALL');

  const filteredLeads = useMemo(() => {
    return leads.filter((lead) => {
      const matchesSearch =
        lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.notes.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = statusFilter === 'ALL' || lead.status === statusFilter;
      const matchesSource = sourceFilter === 'ALL' || lead.source === sourceFilter;

      return matchesSearch && matchesStatus && matchesSource;
    });
  }, [leads, searchTerm, statusFilter, sourceFilter]);

  const statusVariantMap: Record<LeadStatus, 'neutral' | 'info' | 'warning' | 'purple' | 'success' | 'danger'> = {
    New: 'neutral',
    Contacted: 'info',
    'Survey Scheduled': 'warning',
    'Proposal Sent': 'purple',
    Converted: 'success',
    Lost: 'danger',
  };

  const totalPipelineBudget = leads.reduce((acc, l) => acc + (l.estimatedBudget || 0), 0);

  return (
    <div className="space-y-5 animate-in fade-in duration-300">
      {/* Top Controls Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Solar Leads Pipeline</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Active commercial rooftop enquiries ({leads.length} total, {formatINR(totalPipelineBudget, true)} potential pipeline)
          </p>
        </div>

        <button
          onClick={onOpenAddLead}
          className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm shadow-sm transition-all"
        >
          <Plus className="w-4 h-4" />
          Add New Lead
        </button>
      </div>

      {/* Filter Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search by company, client name, city..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400 flex-shrink-0" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none bg-white"
          >
            <option value="ALL">All Statuses</option>
            <option value="New">New</option>
            <option value="Contacted">Contacted</option>
            <option value="Survey Scheduled">Survey Scheduled</option>
            <option value="Proposal Sent">Proposal Sent</option>
            <option value="Converted">Converted / Won</option>
            <option value="Lost">Lost</option>
          </select>
        </div>

        <div>
          <select
            value={sourceFilter}
            onChange={(e) => setSourceFilter(e.target.value)}
            className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none bg-white"
          >
            <option value="ALL">All Lead Sources</option>
            <option value="IndiaMART">IndiaMART</option>
            <option value="Direct Walk-in">Direct Walk-in</option>
            <option value="Reference">Reference</option>
            <option value="Exhibition/Trade Show">Exhibition</option>
            <option value="Google Search">Google Search</option>
            <option value="Channel Partner">Channel Partner</option>
          </select>
        </div>
      </div>

      {/* Leads Table Card */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/75 text-slate-600 font-semibold uppercase text-[11px] tracking-wider">
                <th className="py-3 px-4">Company & Client</th>
                <th className="py-3 px-4">Capacity & Roof</th>
                <th className="py-3 px-4">Source & State</th>
                <th className="py-3 px-4">Follow-up</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredLeads.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-slate-400">
                    No leads match your filter criteria.
                  </td>
                </tr>
              ) : (
                filteredLeads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-slate-50/70 transition-colors">
                    {/* Company & Client */}
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900 text-sm">{lead.company}</div>
                      <div className="text-xs text-slate-500 flex items-center gap-1.5 mt-0.5">
                        <span>{lead.name}</span>
                        {lead.phone && (
                          <span className="text-slate-400">&bull; {lead.phone}</span>
                        )}
                      </div>
                      {lead.notes && (
                        <p className="text-[11px] text-slate-500 mt-1 max-w-xs italic line-clamp-1">
                          "{lead.notes}"
                        </p>
                      )}
                    </td>

                    {/* Capacity & Roof */}
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-amber-600">
                        {formatCapacity(lead.capacityKW)}
                      </div>
                      <span className="text-[11px] text-slate-500 block">
                        {lead.rooftopType}
                      </span>
                      <span className="text-[11px] font-medium text-slate-700">
                        Est: {formatINR(lead.estimatedBudget, true)}
                      </span>
                    </td>

                    {/* Source & Location */}
                    <td className="py-3.5 px-4">
                      <span className="inline-block text-[11px] font-medium text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                        {lead.source}
                      </span>
                      <div className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        {lead.city}, {lead.state}
                      </div>
                    </td>

                    {/* Follow-up */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5 text-xs text-slate-700">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        {formatDate(lead.followUpDate)}
                      </div>
                      <span className="text-[10px] text-slate-400 block mt-0.5">
                        By: {lead.assignedTo?.split(' ')[0]}
                      </span>
                    </td>

                    {/* Status with Inline Change */}
                    <td className="py-3.5 px-4">
                      <select
                        value={lead.status}
                        onChange={(e) => updateLeadStatus(lead.id, e.target.value as LeadStatus)}
                        className={`text-xs font-semibold px-2 py-1 rounded-lg border focus:outline-none cursor-pointer ${
                          lead.status === 'Converted'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                            : lead.status === 'Lost'
                            ? 'bg-rose-50 text-rose-700 border-rose-300'
                            : lead.status === 'Proposal Sent'
                            ? 'bg-purple-50 text-purple-700 border-purple-300'
                            : 'bg-amber-50 text-amber-700 border-amber-300'
                        }`}
                      >
                        <option value="New">New</option>
                        <option value="Contacted">Contacted</option>
                        <option value="Survey Scheduled">Survey Scheduled</option>
                        <option value="Proposal Sent">Proposal Sent</option>
                        <option value="Converted">Converted</option>
                        <option value="Lost">Lost</option>
                      </select>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right space-x-2">
                      {lead.status !== 'Converted' && (
                        <button
                          onClick={() => convertLeadToCustomer(lead.id)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-lg border border-emerald-200 transition-colors"
                          title="Convert to active customer record"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Convert
                        </button>
                      )}

                      <button
                        onClick={() => setActiveTab('surveys')}
                        className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                      >
                        Survey &rarr;
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
