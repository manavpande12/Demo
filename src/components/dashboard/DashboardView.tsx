"use client";

import React from "react";
import {
  TrendingUp,
  Activity,
  CheckCircle,
  AlertOctagon,
  Clock,
  Cpu,
  ArrowUpRight,
  ArrowDownRight,
  Plus,
  AlertTriangle,
  ChevronRight,
  Wrench,
  Boxes,
} from "lucide-react";
import { usePlant } from "../../context/PlantContext";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { HOURLY_PRODUCTION } from "../../data/mockData";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export function DashboardView() {
  const {
    productionToday,
    productionTarget,
    oee,
    oeeDiff,
    machineAvailability,
    rejectionRate,
    downtimeHours,
    downtimeMinutes,
    activeMachinesCount,
    totalMachinesCount,
    machines,
    alerts,
    setSelectedMachine,
    setActiveTab,
    setIsNewOrderModalOpen,
    setIsLogDowntimeModalOpen,
  } = usePlant();

  const progressPercent = ((productionToday / productionTarget) * 100).toFixed(1);

  // Key spotlight machines as specified
  const highlightCodes = ["CNC-101", "CNC-102", "Press-201", "Press-202", "Assembly-301"];
  const spotlightMachines = highlightCodes
    .map((code) => machines.find((m) => m.code === code))
    .filter(Boolean);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Subheader */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">Plant Overview</h2>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time telemetry and shift progress for Mumbai Manufacturing Unit
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => setIsLogDowntimeModalOpen(true)}
            className="text-xs border-slate-300 text-slate-700 hover:bg-slate-100"
          >
            <Clock className="w-3.5 h-3.5 text-amber-600" />
            Log Downtime
          </Button>
          <Button
            size="sm"
            variant="primary"
            onClick={() => setIsNewOrderModalOpen(true)}
            className="text-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            New Order
          </Button>
        </div>
      </div>

      {/* Top 6 KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
        {/* Production Today */}
        <Card className="border-slate-200 bg-white">
          <CardContent className="p-3.5 sm:p-4">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono uppercase text-slate-500">Production Today</span>
              <Boxes className="w-4 h-4 text-blue-600" />
            </div>
            <div className="mt-2 flex items-baseline gap-1">
              <span className="text-2xl font-bold font-mono text-slate-900 tracking-tight">
                {productionToday.toLocaleString()}
              </span>
              <span className="text-xs text-slate-500 font-sans">Units</span>
            </div>
            <div className="mt-3">
              <div className="flex justify-between text-[11px] text-slate-500 font-mono mb-1">
                <span>Target: {productionTarget.toLocaleString()}</span>
                <span className="text-emerald-600 font-semibold">{progressPercent}%</span>
              </div>
              <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-blue-600 h-full rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, Number(progressPercent))}%` }}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* OEE */}
        <Card className="border-slate-200 bg-white">
          <CardContent className="p-3.5 sm:p-4">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono uppercase text-slate-500">OEE</span>
              <Activity className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="mt-2 flex items-baseline gap-1">
              <span className="text-2xl font-bold font-mono text-slate-900 tracking-tight">
                {oee}%
              </span>
            </div>
            <div className="mt-3 flex items-center gap-1 text-[11px] text-emerald-600 font-mono font-semibold">
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>+{oeeDiff}% vs yesterday</span>
            </div>
          </CardContent>
        </Card>

        {/* Availability */}
        <Card className="border-slate-200 bg-white">
          <CardContent className="p-3.5 sm:p-4">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono uppercase text-slate-500">Availability</span>
              <CheckCircle className="w-4 h-4 text-blue-600" />
            </div>
            <div className="mt-2 flex items-baseline gap-1">
              <span className="text-2xl font-bold font-mono text-slate-900 tracking-tight">
                {machineAvailability}%
              </span>
            </div>
            <div className="mt-3 text-[11px] text-slate-500 font-mono">
              Target benchmark &ge; 90%
            </div>
          </CardContent>
        </Card>

        {/* Rejection Rate */}
        <Card className="border-slate-200 bg-white">
          <CardContent className="p-3.5 sm:p-4">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono uppercase text-slate-500">Rejection Rate</span>
              <AlertOctagon className="w-4 h-4 text-amber-600" />
            </div>
            <div className="mt-2 flex items-baseline gap-1">
              <span className="text-2xl font-bold font-mono text-amber-700 tracking-tight">
                {rejectionRate}%
              </span>
            </div>
            <div className="mt-3 text-[11px] text-emerald-600 font-mono flex items-center gap-1 font-medium">
              <ArrowDownRight className="w-3.5 h-3.5" />
              <span>-0.2% improvement</span>
            </div>
          </CardContent>
        </Card>

        {/* Downtime */}
        <Card className="border-slate-200 bg-white">
          <CardContent className="p-3.5 sm:p-4">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono uppercase text-slate-500">Downtime</span>
              <Clock className="w-4 h-4 text-rose-600" />
            </div>
            <div className="mt-2 flex items-baseline gap-1">
              <span className="text-2xl font-bold font-mono text-rose-700 tracking-tight">
                {downtimeHours}h {downtimeMinutes}m
              </span>
            </div>
            <div className="mt-3 text-[11px] text-rose-600 font-mono font-medium">
              1 critical stop active
            </div>
          </CardContent>
        </Card>

        {/* Active Fleet */}
        <Card className="border-slate-200 bg-white">
          <CardContent className="p-3.5 sm:p-4">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono uppercase text-slate-500">Active Fleet</span>
              <Cpu className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="mt-2 flex items-baseline gap-1">
              <span className="text-2xl font-bold font-mono text-slate-900 tracking-tight">
                {activeMachinesCount}
              </span>
              <span className="text-xs text-slate-500 font-mono">/ {totalMachinesCount}</span>
            </div>
            <div className="mt-3 text-[11px] text-slate-500 font-mono">
              81.8% fleet utilization
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Production vs Target Hourly Chart */}
      <Card className="border-slate-200 bg-white shadow-xs">
        <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2">
          <div>
            <CardTitle className="text-slate-900">Production vs Target</CardTitle>
            <p className="text-xs text-slate-500 mt-0.5">
              Cumulative Shift A hourly output trajectory vs scheduled quota (06:00 &ndash; 18:00)
            </p>
          </div>
          <div className="flex items-center gap-4 text-xs font-mono">
            <span className="flex items-center gap-1.5 text-blue-700 font-semibold">
              <span className="w-3 h-1 bg-blue-600 rounded-full inline-block" />
              Actual Production
            </span>
            <span className="flex items-center gap-1.5 text-slate-500">
              <span className="w-3 h-1 bg-slate-400 rounded-full inline-block border-dashed" />
              Target Production
            </span>
          </div>
        </CardHeader>
        <CardContent className="pt-2">
          <div className="h-64 sm:h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={HOURLY_PRODUCTION} margin={{ top: 10, right: 15, left: -15, bottom: 0 }}>
                <defs>
                  <linearGradient id="prodColor" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="targetColor" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#94a3b8" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#94a3b8" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis
                  dataKey="time"
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
                  tickFormatter={(val) => `${val.toLocaleString()}`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#ffffff",
                    borderColor: "#cbd5e1",
                    borderRadius: "0.5rem",
                    fontSize: "12px",
                    color: "#0f172a",
                    boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                    fontFamily: "monospace",
                  }}
                  formatter={(val: any, name: any) => [
                    `${Number(val).toLocaleString()} Units`,
                    name === "actual" ? "Actual Output" : "Target Quota",
                  ]}
                />
                <Area
                  type="monotone"
                  dataKey="actual"
                  stroke="#2563eb"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#prodColor)"
                  name="actual"
                />
                <Area
                  type="monotone"
                  dataKey="target"
                  stroke="#94a3b8"
                  strokeWidth={2}
                  strokeDasharray="4 4"
                  fillOpacity={1}
                  fill="url(#targetColor)"
                  name="target"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Split Section: Machine Status & Recent Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Machine Status Table */}
        <div className="lg:col-span-2">
          <Card className="border-slate-200 bg-white h-full flex flex-col shadow-xs">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div>
                <CardTitle className="text-slate-900">Machine Status</CardTitle>
                <p className="text-xs text-slate-500 mt-0.5">
                  Core manufacturing stations status, live output, and active order linkage
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setActiveTab("machines")}
                className="text-xs text-blue-600 hover:text-blue-800"
              >
                All Machines ({machines.length}) &rarr;
              </Button>
            </CardHeader>
            <CardContent className="p-0 flex-1 overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse min-w-[560px]">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 text-slate-600 font-mono">
                    <th className="py-2.5 px-4 font-semibold">Machine</th>
                    <th className="py-2.5 px-4 font-semibold">Status</th>
                    <th className="py-2.5 px-4 font-semibold text-right">Production</th>
                    <th className="py-2.5 px-4 font-semibold text-right">OEE</th>
                    <th className="py-2.5 px-4 font-semibold text-right">Runtime</th>
                    <th className="py-2.5 px-4 font-semibold text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-mono">
                  {spotlightMachines.map((m: any) => {
                    const statusVariant =
                      m.status === "running"
                        ? "running"
                        : m.status === "breakdown"
                        ? "breakdown"
                        : m.status === "idle"
                        ? "idle"
                        : "maintenance";

                    return (
                      <tr
                        key={m.id}
                        className="hover:bg-slate-50/80 transition-colors group cursor-pointer"
                        onClick={() => setSelectedMachine(m)}
                      >
                        <td className="py-3 px-4 font-bold text-slate-800">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-900">{m.code}</span>
                            <span className="text-[11px] text-slate-500 font-sans hidden sm:inline">
                              {m.currentOrderProduct || m.name.split(" ")[0]}
                            </span>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <Badge variant={statusVariant} dot>
                            {m.status.toUpperCase()}
                          </Badge>
                        </td>
                        <td className="py-3 px-4 text-right text-slate-800 font-medium">
                          {m.status === "idle" ? "0" : m.productionCount.toLocaleString()}
                        </td>
                        <td className="py-3 px-4 text-right text-slate-800 font-bold">
                          {m.status === "idle" ? (
                            <span className="text-slate-400 font-normal">&mdash;</span>
                          ) : (
                            <span
                              className={
                                m.oee >= 85
                                  ? "text-emerald-700"
                                  : m.oee >= 70
                                  ? "text-amber-700"
                                  : "text-rose-700"
                              }
                            >
                              {m.oee}%
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-right text-slate-600">
                          {m.runtimeHours}h {m.runtimeMinutes}m
                        </td>
                        <td className="py-3 px-4 text-center">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedMachine(m);
                            }}
                            className="text-xs text-blue-600 hover:text-blue-800 font-sans font-semibold inline-flex items-center gap-1 group-hover:underline"
                          >
                            Details <ChevronRight className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </div>

        {/* Recent Alerts */}
        <div>
          <Card className="border-slate-200 bg-white h-full flex flex-col shadow-xs">
            <CardHeader className="pb-3 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-slate-900">Recent Alerts</CardTitle>
                <p className="text-xs text-slate-500 mt-0.5">Live shop floor notifications</p>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-rose-100 text-rose-700 border border-rose-200 font-bold">
                {alerts.length} Active
              </span>
            </CardHeader>
            <CardContent className="p-3.5 flex-1 flex flex-col justify-between space-y-3">
              <div className="space-y-2.5">
                {alerts.map((alert) => (
                  <div
                    key={alert.id}
                    className="p-3 rounded-lg bg-slate-50 border border-slate-200 hover:border-slate-300 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        {alert.severity === "critical" ? (
                          <AlertOctagon className="w-4 h-4 text-rose-600 shrink-0" />
                        ) : (
                          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                        )}
                        <span className="text-xs font-bold text-slate-900">
                          {alert.title}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {alert.timestamp}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600 mt-1 leading-relaxed font-sans">
                      {alert.description}
                    </p>
                    <div className="mt-2 flex items-center justify-between pt-1.5 border-t border-slate-200">
                      <span className="text-[9px] font-mono uppercase text-slate-500 bg-white px-1.5 py-0.2 rounded border border-slate-200">
                        {alert.category}
                      </span>
                      <button
                        onClick={() => {
                          if (alert.category === "Machine") setActiveTab("machines");
                          if (alert.category === "Inventory") setActiveTab("inventory");
                          if (alert.category === "Quality") setActiveTab("quality");
                          if (alert.category === "Production") setActiveTab("production");
                        }}
                        className="text-[11px] text-blue-600 hover:text-blue-800 font-semibold"
                      >
                        Action &rarr;
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-2 border-t border-slate-200">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full text-xs"
                  onClick={() => setActiveTab("maintenance")}
                >
                  <Wrench className="w-3.5 h-3.5 text-slate-500" />
                  View Maintenance Schedule
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}