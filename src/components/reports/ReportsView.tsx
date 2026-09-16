'use client';

import React, { useState } from 'react';
import { useSolarFlow } from '@/context/SolarFlowContext';
import { formatINR, formatCapacity } from '@/utils/formatters';
import {
  BarChart3,
  TrendingUp,
  Download,
  Calendar,
  Sun,
  FileSpreadsheet,
  CheckCircle2,
  Zap,
  Building2,
  ShieldCheck,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Legend,
} from 'recharts';

export const ReportsView: React.FC = () => {
  const { projects, monitoredPlants, quotations, serviceTickets } = useSolarFlow();

  const [activeReportTab, setActiveReportTab] = useState<
    'sales' | 'projects' | 'generation' | 'service' | 'revenue'
  >('sales');

  // Sales monthly performance
  const monthlySalesData = [
    { month: 'Apr 26', inquiries: 14, quotes: 8, bookedLakhs: 95 },
    { month: 'May 26', inquiries: 18, quotes: 11, bookedLakhs: 140 },
    { month: 'Jun 26', inquiries: 22, quotes: 14, bookedLakhs: 210 },
    { month: 'Jul 26', inquiries: 19, quotes: 12, bookedLakhs: 180 },
    { month: 'Aug 26', inquiries: 26, quotes: 17, bookedLakhs: 280 },
    { month: 'Sep 26 (MTD)', inquiries: 24, quotes: 15, bookedLakhs: 245 },
  ];

  // Generation yields per month (MWh)
  const monthlyGenerationData = [
    { month: 'Apr', solarMWh: 78.4, benchmarkMWh: 75.0 },
    { month: 'May', solarMWh: 88.2, benchmarkMWh: 82.0 },
    { month: 'Jun', solarMWh: 64.0, benchmarkMWh: 65.0 },
    { month: 'Jul', solarMWh: 52.8, benchmarkMWh: 55.0 },
    { month: 'Aug', solarMWh: 59.2, benchmarkMWh: 58.0 },
    { month: 'Sep', solarMWh: 72.6, benchmarkMWh: 70.0 },
  ];

  // Invoicing breakdown
  const revenueSummaryData = [
    { name: 'Advance against PO (15%)', billedLakhs: 79.9, realizedLakhs: 79.9 },
    { name: 'Material Dispatch (60%)', billedLakhs: 319.6, realizedLakhs: 290.0 },
    { name: 'Mechanical Erection (15%)', billedLakhs: 79.9, realizedLakhs: 65.0 },
    { name: 'Commissioning & Sync (10%)', billedLakhs: 53.2, realizedLakhs: 48.0 },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            EPC Executive Analytics & Reports
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Turnkey commercial bookings, field execution velocities, and solar portfolio yields
          </p>
        </div>

        <button
          onClick={() => window.print()}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 text-white hover:bg-slate-800 text-xs font-bold transition-all shadow-xs"
        >
          <Download className="w-3.5 h-3.5" />
          Export Report
        </button>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-2">
        {[
          { id: 'sales', label: 'Sales & Pipeline' },
          { id: 'projects', label: 'Projects & Milestones' },
          { id: 'generation', label: 'Solar Generation Yields' },
          { id: 'service', label: 'O&M & SLA Service' },
          { id: 'revenue', label: 'Revenue Realization' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveReportTab(tab.id as any)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeReportTab === tab.id
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'bg-white text-slate-600 hover:bg-slate-100'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Report 1: Sales */}
      {activeReportTab === 'sales' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs">
            <h3 className="text-base font-bold text-slate-900 mb-1">
              Monthly EPC Bookings & Pipeline Flow (FY 2026-27)
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Value of signed Turnkey EPC agreements in ₹ Lakhs
            </p>

            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlySalesData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} />
                  <YAxis stroke="#94a3b8" fontSize={11} />
                  <Tooltip
                    formatter={(val: number) => [`₹${val} Lakhs`, 'Booked Contracts']}
                    contentStyle={{ backgroundColor: '#0f172a', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                  />
                  <Bar dataKey="bookedLakhs" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 bg-white rounded-xl border border-slate-200">
              <span className="text-xs text-slate-500 block">Avg Order Value (AOV)</span>
              <span className="text-xl font-bold text-slate-900">₹88.5 Lakhs</span>
              <span className="text-[11px] text-emerald-600 block mt-1">+14% vs last quarter</span>
            </div>
            <div className="p-4 bg-white rounded-xl border border-slate-200">
              <span className="text-xs text-slate-500 block">Quote to Win Ratio</span>
              <span className="text-xl font-bold text-emerald-600">38.2%</span>
              <span className="text-[11px] text-slate-400 block mt-1">Industrial C&I segment leading</span>
            </div>
            <div className="p-4 bg-white rounded-xl border border-slate-200">
              <span className="text-xs text-slate-500 block">Sales Cycle Duration</span>
              <span className="text-xl font-bold text-amber-600">32 Days</span>
              <span className="text-[11px] text-slate-400 block mt-1">From inquiry to signed agreement</span>
            </div>
          </div>
        </div>
      )}

      {/* Report 2: Projects */}
      {activeReportTab === 'projects' && (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4">
          <h3 className="text-base font-bold text-slate-900">
            Turnkey Projects Status & Completion Audit
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-slate-600 font-bold">
                  <th className="py-2.5 px-3">Project Code</th>
                  <th className="py-2.5 px-3">Customer</th>
                  <th className="py-2.5 px-3">Capacity</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3">Milestone Progress</th>
                  <th className="py-2.5 px-3">Contract Value</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {projects.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50">
                    <td className="py-3 px-3 font-mono font-bold text-amber-700">{p.projectCode}</td>
                    <td className="py-3 px-3 font-semibold text-slate-800">{p.company}</td>
                    <td className="py-3 px-3 font-bold text-slate-900">{formatCapacity(p.capacityKW)}</td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700">
                        {p.status}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2">
                        <div className="w-24 bg-slate-200 rounded-full h-1.5 overflow-hidden">
                          <div
                            className="bg-amber-500 h-full rounded-full"
                            style={{ width: `${p.progressPercentage}%` }}
                          />
                        </div>
                        <span className="text-[11px] font-bold">{p.progressPercentage}%</span>
                      </div>
                    </td>
                    <td className="py-3 px-3 font-bold text-slate-900">{formatINR(p.totalContractValue, true)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Report 3: Generation */}
      {activeReportTab === 'generation' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs">
            <h3 className="text-base font-bold text-slate-900 mb-1">
              Monthly Generation vs. P50 Benchmark (MWh)
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Comparing operational plant generation against simulation model expectations
            </p>

            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyGenerationData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} />
                  <YAxis stroke="#94a3b8" fontSize={11} />
                  <Tooltip
                    formatter={(val: number) => [`${val} MWh`, 'Generation']}
                    contentStyle={{ backgroundColor: '#0f172a', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                  />
                  <Legend />
                  <Line type="monotone" dataKey="solarMWh" stroke="#f59e0b" strokeWidth={3} name="Actual Solar MWh" />
                  <Line type="monotone" dataKey="benchmarkMWh" stroke="#94a3b8" strokeDasharray="4 4" strokeWidth={2} name="P50 Benchmark" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* Report 4: Service */}
      {activeReportTab === 'service' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              O&M Response Metrics
            </h3>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">Average First Response Time</span>
                <span className="font-bold text-slate-800">42 Minutes</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">Average Mean Time to Repair (MTTR)</span>
                <span className="font-bold text-slate-800">4.8 Hours</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">Tickets Resolved Within SLA</span>
                <span className="font-bold text-emerald-600">96.4%</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-slate-500">Scheduled Module Washing Cycles</span>
                <span className="font-bold text-slate-800">100% on Schedule</span>
              </div>
            </div>
          </div>

          <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              AMC Coverage Status
            </h3>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">Active AMC Contracts</span>
                <span className="font-bold text-emerald-600">5 Plants (1.2 MW)</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">First-Year Complimentary O&M</span>
                <span className="font-bold text-amber-600">3 Plants</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-slate-500">Annual AMC Renewal Rate</span>
                <span className="font-bold text-slate-800">94% Retention</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Report 5: Revenue */}
      {activeReportTab === 'revenue' && (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4">
          <h3 className="text-base font-bold text-slate-900">
            Milestone Billing & Collections Summary (₹ Lakhs)
          </h3>
          <div className="space-y-3">
            {revenueSummaryData.map((item, idx) => (
              <div key={idx} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                <div className="flex justify-between font-bold text-slate-800 mb-1">
                  <span>{item.name}</span>
                  <span className="text-emerald-700">
                    Realized: ₹{item.realizedLakhs} L / Billed: ₹{item.billedLakhs} L
                  </span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-emerald-500 h-full rounded-full"
                    style={{ width: `${(item.realizedLakhs / item.billedLakhs) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
