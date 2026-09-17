"use client";

import React, { useState } from "react";
import {
  ShieldCheck,
  CheckCircle2,
  AlertOctagon,
  FileCheck,
  TrendingDown,
  Plus,
  Download,
  Filter,
  BarChart3,
  Search,
  Layers,
  Cpu,
} from "lucide-react";
import { usePlant } from "../../context/PlantContext";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import {
  QUALITY_TREND_7DAYS,
  DEFECT_ANALYSIS_DATA,
} from "../../data/mockData";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { downloadCsv } from "../../utils/exportCsv";

export function QualityView() {
  const {
    firstPassYield,
    rejectionRate,
    totalInspectionsCount,
    totalDefectsCount,
    inspections,
    orders,
    machines,
    setSelectedOrder,
    setSelectedMachine,
    setActiveTab,
    showToast,
  } = usePlant();

  const [searchFilter, setSearchFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const filteredInspections = inspections.filter((ins) => {
    const matchesSearch =
      ins.id.toLowerCase().includes(searchFilter.toLowerCase()) ||
      ins.product.toLowerCase().includes(searchFilter.toLowerCase()) ||
      ins.batch.toLowerCase().includes(searchFilter.toLowerCase()) ||
      (ins.orderId && ins.orderId.toLowerCase().includes(searchFilter.toLowerCase())) ||
      (ins.machineId && ins.machineId.toLowerCase().includes(searchFilter.toLowerCase())) ||
      ins.inspector.toLowerCase().includes(searchFilter.toLowerCase());

    const matchesStatus = statusFilter === "All" || ins.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleExport = () => {
    const headers = [
      "Inspection ID",
      "Product",
      "Batch Number",
      "Linked Order",
      "Assigned Machine",
      "Sample Qty",
      "Accepted Qty",
      "Rejected Qty",
      "Defect Reason",
      "Inspector",
      "Status",
      "Date",
      "Shift",
    ];
    const rows = filteredInspections.map((i) => [
      i.id,
      i.product,
      i.batch,
      i.orderId || "N/A",
      i.machineId || "N/A",
      i.sampleQty,
      i.acceptedQty,
      i.rejectedQty,
      i.defectType,
      i.inspector,
      i.status,
      i.date,
      i.shift,
    ]);
    downloadCsv(`MFGFlow_Quality_Inspections_${new Date().toISOString().split("T")[0]}`, headers, rows);
    showToast({
      title: "Export Completed",
      description: `Exported ${filteredInspections.length} quality audit logs to CSV.`,
      type: "success",
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">Quality Assurance & Metrology</h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            First pass yield analysis, Pareto defect classification, and CMM batch inspection logs cross-linked with orders
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={handleExport}
            className="text-xs bg-white border-slate-300 text-slate-700 hover:bg-slate-50"
          >
            <Download className="w-3.5 h-3.5" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* Top Quality KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-xs">
          <span className="text-[11px] font-mono text-slate-500 uppercase tracking-wider">First Pass Yield (FPY)</span>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-emerald-600">{firstPassYield}%</span>
          </div>
          <p className="text-[11px] text-emerald-600 font-mono mt-1">&gt; 95% target compliance</p>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-xs">
          <span className="text-[11px] font-mono text-slate-500 uppercase tracking-wider">Rejection Rate</span>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-amber-600">{rejectionRate}%</span>
          </div>
          <p className="text-[11px] text-slate-400 font-mono mt-1">Tolerance threshold: &le; 2.5%</p>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-xs">
          <span className="text-[11px] font-mono text-slate-500 uppercase tracking-wider">Total Inspections</span>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-slate-900">
              {totalInspectionsCount.toLocaleString()}
            </span>
            <span className="text-xs text-slate-500 font-sans">Parts</span>
          </div>
          <p className="text-[11px] text-slate-400 font-mono mt-1">100% CMM sampling verified</p>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-xs">
          <span className="text-[11px] font-mono text-slate-500 uppercase tracking-wider">Defects Logged</span>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-rose-600">{totalDefectsCount}</span>
            <span className="text-xs text-slate-500 font-sans">Pieces</span>
          </div>
          <p className="text-[11px] text-slate-400 font-mono mt-1">Quarantined for rework/scrap</p>
        </div>
      </div>

      {/* Quality Trend Line Chart & Defect Pareto Bar Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quality Trend (7-Day Rejection %) */}
        <Card className="border-slate-200 bg-white shadow-xs">
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-slate-900">Quality Trend (Last 7 Days)</CardTitle>
              <p className="text-xs text-slate-500 mt-0.5">Rejection percentage vs upper target limit</p>
            </div>
            <span className="text-xs font-mono text-emerald-700 font-semibold bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-200">
              Mean: 2.38%
            </span>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="h-60 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={QUALITY_TREND_7DAYS} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                  <XAxis
                    dataKey="day"
                    stroke="#64748b"
                    fontSize={11}
                    tickLine={false}
                    axisLine={{ stroke: "#cbd5e1" }}
                  />
                  <YAxis
                    stroke="#64748b"
                    fontSize={11}
                    tickLine={false}
                    axisLine={{ stroke: "#cbd5e1" }}
                    domain={[1.5, 3.5]}
                    tickFormatter={(v) => `${v}%`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#ffffff",
                      borderColor: "#cbd5e1",
                      borderRadius: "0.5rem",
                      fontSize: "12px",
                      color: "#0f172a",
                      boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                      fontFamily: "monospace",
                    }}
                    formatter={(val: any) => [`${val}% Rejections`, "Rejection Rate"]}
                  />
                  <Line
                    type="monotone"
                    dataKey="rejectionRate"
                    stroke="#d97706"
                    strokeWidth={2.5}
                    dot={{ fill: "#d97706", r: 4 }}
                    activeDot={{ r: 6, fill: "#b45309" }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Defect Analysis Bar Chart */}
        <Card className="border-slate-200 bg-white shadow-xs">
          <CardHeader className="pb-2">
            <CardTitle className="text-slate-900">Defect Analysis Breakdown</CardTitle>
            <p className="text-xs text-slate-500 mt-0.5">Pareto count of reject root causes</p>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="h-60 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={DEFECT_ANALYSIS_DATA} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                  <XAxis
                    dataKey="reason"
                    stroke="#64748b"
                    fontSize={10}
                    tickLine={false}
                    axisLine={{ stroke: "#cbd5e1" }}
                  />
                  <YAxis
                    stroke="#64748b"
                    fontSize={11}
                    tickLine={false}
                    axisLine={{ stroke: "#cbd5e1" }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#ffffff",
                      borderColor: "#cbd5e1",
                      borderRadius: "0.5rem",
                      fontSize: "12px",
                      color: "#0f172a",
                      boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                      fontFamily: "monospace",
                    }}
                    formatter={(val: any) => [`${val} Defects`, "Count"]}
                  />
                  <Bar dataKey="count" fill="#ef4444" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Inspection Table */}
      <Card className="border-slate-200 bg-white shadow-xs">
        <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <CardTitle className="text-slate-900">Quality Inspection Records</CardTitle>
            <p className="text-xs text-slate-500 mt-0.5">
              Shift batch verification logs, sample tolerance limits, linked orders and inspector sign-offs
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="relative max-w-xs">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2" />
              <input
                type="text"
                placeholder="Search batch, order, machine..."
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                className="bg-slate-50 border border-slate-300 rounded-md pl-8 pr-3 py-1 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-slate-50 border border-slate-300 rounded-md px-2.5 py-1 text-xs text-slate-800 font-mono focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="All">All Statuses</option>
              <option value="Passed">Passed</option>
              <option value="Rejected">Rejected</option>
              <option value="Conditional">Conditional</option>
            </select>
          </div>
        </CardHeader>

        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-slate-500 font-mono">
                <th className="py-2.5 px-4 font-semibold">Inspection ID</th>
                <th className="py-2.5 px-4 font-semibold">Product</th>
                <th className="py-2.5 px-4 font-semibold">Batch & Linked Order</th>
                <th className="py-2.5 px-4 font-semibold">Machine</th>
                <th className="py-2.5 px-4 font-semibold text-right">Sample</th>
                <th className="py-2.5 px-4 font-semibold text-right text-emerald-600">Passed</th>
                <th className="py-2.5 px-4 font-semibold text-right text-rose-600">Rejected</th>
                <th className="py-2.5 px-4 font-semibold">Defect Type</th>
                <th className="py-2.5 px-4 font-semibold">Inspector</th>
                <th className="py-2.5 px-4 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono">
              {filteredInspections.map((record) => (
                <tr key={record.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4 font-bold text-blue-600">{record.id}</td>
                  <td className="py-3 px-4 font-sans font-medium text-slate-800">
                    {record.product}
                  </td>
                  <td className="py-3 px-4 space-y-0.5">
                    <div className="text-slate-600 text-[11px] font-bold">{record.batch}</div>
                    {record.orderId && (
                      <button
                        onClick={() => {
                          const ord = orders.find((o) => o.id === record.orderId);
                          if (ord) setSelectedOrder(ord);
                          else setActiveTab("production");
                        }}
                        className="flex items-center gap-1 text-[10px] text-blue-600 hover:text-blue-800 hover:underline"
                        title="Click to view production order"
                      >
                        <Layers className="w-2.5 h-2.5" />
                        Order: {record.orderId}
                      </button>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    {record.machineId ? (
                      <button
                        onClick={() => {
                          const m = machines.find((mach) => mach.code === record.machineId || mach.id === record.machineId);
                          if (m) setSelectedMachine(m);
                          else setActiveTab("machines");
                        }}
                        className="flex items-center gap-1 text-[11px] text-slate-700 hover:text-blue-600 font-semibold"
                        title="Click to inspect machine"
                      >
                        <Cpu className="w-3 h-3 text-slate-400" />
                        {record.machineId}
                      </button>
                    ) : (
                      <span className="text-slate-400">-</span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-right text-slate-600 font-medium">
                    {record.sampleQty}
                  </td>
                  <td className="py-3 px-4 text-right font-bold text-emerald-600">
                    {record.acceptedQty}
                  </td>
                  <td className="py-3 px-4 text-right font-bold text-rose-600">
                    {record.rejectedQty}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-0.5 rounded text-[11px] ${
                        record.defectType === "None"
                          ? "bg-slate-100 text-slate-500"
                          : "bg-rose-50 text-rose-700 border border-rose-200"
                      }`}
                    >
                      {record.defectType}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-sans text-slate-600">{record.inspector}</td>
                  <td className="py-3 px-4">
                    <Badge
                      variant={
                        record.status === "Passed"
                          ? "completed"
                          : record.status === "Rejected"
                          ? "breakdown"
                          : "warning"
                      }
                      dot
                    >
                      {record.status}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}