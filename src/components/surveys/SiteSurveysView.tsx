'use client';

import React, { useState } from 'react';
import { useSolarFlow } from '@/context/SolarFlowContext';
import { Badge } from '@/components/ui/Badge';
import { formatCapacity, formatINR, formatDate } from '@/utils/formatters';
import { AddSurveyModal } from './AddSurveyModal';
import { SurveyStatus } from '@/types';
import {
  Compass,
  Plus,
  Search,
  MapPin,
  Sun,
  FileCheck2,
  ArrowRight,
  TrendingUp,
  Layers,
} from 'lucide-react';

export const SiteSurveysView: React.FC<{ onOpenQuotationWithParams?: (capacity: number, custId: string) => void }> = ({
  onOpenQuotationWithParams,
}) => {
  const { surveys, updateSurveyStatus, setActiveTab } = useSolarFlow();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const filteredSurveys = surveys.filter((s) => {
    const matchesSearch =
      s.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.surveyNumber.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'ALL' || s.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalSurveyedKW = surveys.reduce((acc, s) => acc + s.recommendedCapacityKW, 0);

  return (
    <div className="space-y-5 animate-in fade-in duration-300">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Site Surveys & Feasibility</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Detailed 3D shadow analysis, roof load checks & recommended kW capacity ({formatCapacity(totalSurveyedKW)} surveyed)
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm shadow-sm transition-all"
        >
          <Plus className="w-4 h-4" />
          Conduct New Survey
        </button>
      </div>

      {/* Filter Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search by client, survey ID, city..."
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
            <option value="ALL">All Survey Statuses</option>
            <option value="Report Approved">Report Approved</option>
            <option value="Completed">Completed</option>
            <option value="In Progress">In Progress</option>
            <option value="Pending">Pending</option>
          </select>
        </div>
      </div>

      {/* Survey Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredSurveys.map((survey) => (
          <div
            key={survey.id}
            className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              {/* Header */}
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-xs font-mono font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded">
                    {survey.surveyNumber}
                  </span>
                  <h3 className="font-bold text-slate-900 text-base mt-2">{survey.company}</h3>
                  <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3 h-3 text-slate-400" />
                    {survey.siteLocation}
                  </p>
                </div>

                <select
                  value={survey.status}
                  onChange={(e) => updateSurveyStatus(survey.id, e.target.value as SurveyStatus)}
                  className="text-[11px] font-semibold px-2 py-1 rounded-lg border border-slate-200 focus:outline-none bg-slate-50 cursor-pointer"
                >
                  <option value="Pending">Pending</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                  <option value="Report Approved">Report Approved</option>
                </select>
              </div>

              {/* Sizing & Generation Highlight */}
              <div className="mt-4 p-3 rounded-xl bg-amber-50/50 border border-amber-200/70 grid grid-cols-2 gap-2 text-center">
                <div>
                  <span className="text-[11px] text-slate-500 block">Recommended</span>
                  <span className="text-lg font-bold text-amber-700">
                    {formatCapacity(survey.recommendedCapacityKW)}
                  </span>
                </div>
                <div>
                  <span className="text-[11px] text-slate-500 block">Est. Yield / Year</span>
                  <span className="text-lg font-bold text-emerald-700">
                    {(survey.estimatedYearlyGenerationKWh / 1000).toFixed(1)}k kWh
                  </span>
                </div>
              </div>

              {/* Technical Details */}
              <div className="mt-4 space-y-2 text-xs border-t border-slate-100 pt-3">
                <div className="flex justify-between">
                  <span className="text-slate-500">Roof Area (Gross / Shadow-Free):</span>
                  <span className="font-medium text-slate-800">
                    {survey.roofAreaSqFt.toLocaleString('en-IN')} / {survey.shadowFreeAreaSqFt.toLocaleString('en-IN')} sq.ft
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Roof Type:</span>
                  <span className="font-medium text-slate-800">{survey.roofType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Monthly Consumption:</span>
                  <span className="font-medium text-slate-800">
                    {survey.monthlyElectricityUnits.toLocaleString('en-IN')} kWh (₹{(survey.avgMonthlyBill / 100000).toFixed(1)}L)
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Tilt & Azimuth:</span>
                  <span className="font-medium text-slate-800">
                    {survey.tiltAngle}° &bull; {survey.structureOrientation}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Surveyor:</span>
                  <span className="text-slate-700">{survey.surveyorName}</span>
                </div>
              </div>

              {survey.notes && (
                <div className="mt-3 p-2 bg-slate-50 rounded-lg text-[11px] text-slate-600 italic">
                  "{survey.notes}"
                </div>
              )}
            </div>

            {/* Footer action */}
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] text-slate-400">Date: {formatDate(survey.surveyDate)}</span>

              <button
                onClick={() => {
                  if (onOpenQuotationWithParams) {
                    onOpenQuotationWithParams(survey.recommendedCapacityKW, survey.customerId);
                  } else {
                    setActiveTab('quotations');
                  }
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 text-amber-400 hover:bg-slate-800 text-xs font-bold transition-all shadow-xs"
              >
                Create Proposal <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <AddSurveyModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />
    </div>
  );
};
