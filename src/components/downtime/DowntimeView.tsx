"use client";

import React, { useState } from "react";
import {
  Clock,
  AlertTriangle,
  AlertOctagon,
  Wrench,
  Package,
  Cpu,
  Filter,
  CheckCircle2,
  Plus,
  Download,
  Layers,
  ChevronRight,
} from "lucide-react";
import { usePlant } from "../../context/PlantContext";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { DOWNTIME_BY_REASON } from "../../data/mockData";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { downloadCsv } from "../../utils/exportCsv";

export function DowntimeView() {
  const {
    downtime,
    machines,
    orders,
    setSelectedOrder,
    setActiveTab,
    setIsLogDowntimeModalOpen,
    resolveDowntimeIncident,
    showToast,
  } = usePlant();

  const [reasonFilter, setReasonFilter] = useState<string>("All");
  const [machineFilter, setMachineFilter] = useState<string>("All");
  const [shiftFilter, setShiftFilter] = useState<string>("All");

  const filteredDowntime = downtime.filter((d) => {
    const matchesReason = reasonFilter === "All" || d.reason === reasonFilter;
    const matchesMachine = machineFilter === "All" || d.machineName === machineFilter;
    const matchesShift = shiftFilter === "All" || d.shift === shiftFilter;
    return matchesReason && matchesMachine && matchesShift;
  });

  // Calculate dynamic totals
  const totalMinutes = downtime.reduce((sum, d) => sum + d.durationMinutes, 0);
  const totalHours = Math.floor(totalMinutes / 60);
  const remainingMins = totalMinutes % 60;

  const mechanicalMins = downtime
    .filter((d) => d.reason === "Mechanical")
    .reduce((sum, d) => sum + d.durationMinutes, 0);
  const setupMins = downtime
    .filter((d) => d.reason === "Setup")
    .reduce((sum, d) => sum + d.durationMinutes, 0);
  const materialMins = downtime
    .filter((d) => d.reason === "Material Shortage")
    .reduce((sum, d) => sum + d.durationMinutes, 0);

  const handleExport = () => {
    const headers = [
      "Incident ID",
      "Machine",
      "Duration (Mins)",
      "Reason Category",
      "Shift",
      "Date",
      "Reported Time",
      "MTTR (Mins)",
      "Technician",
      "Status",
      "Affected Order",
      "Maintenance WO",
      "Action Taken",
    ];
    const rows = filteredDowntime.map((d) => [
      d.id,
      d.machineName,
      d.durationMinutes,
      d.reason,
      d.shift,
      d.date,
      d.time,
      d.mttrMinutes,
      d.technician,
      d.status,
      d.affectedBatchId || "N/A",
      d.maintenanceTicketId || "N/A",
      d.actionTaken,
    ]);
    downloadCsv(`MFGFlow_Downtime_Analysis_${new Date().toISOString().split("T")[0]}`, headers, rows);
    showToast({
      title: "Export Completed",
      description: `Downloaded downtime log with ${filteredDowntime.length} events.`,
      type: "success",
    });
  };

  // Machine downtime roll-up table
  const machineRollup = [
    { machine: "Press-202", duration: "8h 14m", minutes: 494, events: 3, reason: "Hydraulic seal rupture", status: "breakdown" },
    { machine: "CNC-104", duration: "2h 45m", minutes: 165, events: 4, reason: "Tool holder wear & vibration", status: "running" },
    { machine: "Welding-402", duration: "2h 10m", minutes: 130, events: 2, reason: "Electrode redressing & calibration", status: "maintenance" },
    { machine: "Press-201", duration: "1h 05m", minutes: 65, events: 1, reason: "Material shortage (CRCA sheet)", status: "idle" },
    { machine: "CNC-102", duration: "0h 35m", minutes: 35, events: 1, reason: "Interlock sensor cycle reset", status: "running" },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-rose-600" />
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">Downtime Analysis & OEE Losses</h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Root cause stoppage categorization, MTTR tracking, interconnected batch impact, and incident resolution
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={handleExport}
            className="text-xs bg-white border-slate-300 text-slate-700 hover:bg-slate-50"
          >
            <Download className="w-3.5 h-3.5" />
            Export CSV
          </Button>
          <Button
            size="sm"
            variant="danger"
            onClick={() => setIsLogDowntimeModalOpen(true)}
            className="text-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            Log Downtime Incident
          </Button>
        </div>
      </div>

      {/* Top Downtime KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-xs">
          <span className="text-[11px] font-mono text-slate-500 uppercase tracking-wider">Total Downtime</span>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-rose-600">
              {totalHours}h {remainingMins}m
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Across all plant assets</p>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-xs">
          <span className="text-[11px] font-mono text-rose-600 uppercase tracking-wider">Mechanical Failures</span>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-rose-600">
              {Math.floor(mechanicalMins / 60)}h {mechanicalMins % 60}m
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Component wear & hydraulics</p>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-xs">
          <span className="text-[11px] font-mono text-amber-600 uppercase tracking-wider">Setup & Changeover</span>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-amber-600">
              {Math.floor(setupMins / 60)}h {setupMins % 60}m
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Tooling and die change delays</p>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-xs">
          <span className="text-[11px] font-mono text-blue-600 uppercase tracking-wider">Material Shortage</span>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-blue-600">
              {Math.floor(materialMins / 60)}h {materialMins % 60}m
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Warehouse transfer buffers</p>
        </div>
      </div>

      {/* Donut Chart and Machine Downtime Table */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Downtime by Reason Donut Chart */}
        <Card className="border-slate-200 bg-white shadow-xs flex flex-col">
          <CardHeader className="pb-2">
            <CardTitle className="text-slate-900">Downtime by Reason</CardTitle>
            <p className="text-xs text-slate-500 mt-0.5">Categorized breakdown of stoppage causes</p>
          </CardHeader>
          <CardContent className="p-4 flex-1 flex flex-col items-center justify-center">
            <div className="w-full h-52">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={DOWNTIME_BY_REASON}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={75}
                    paddingAngle={3}
                    dataKey="hours"
                  >
                    {DOWNTIME_BY_REASON.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
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
                    formatter={(val: any, name: any) => [`${val} Hours`, name]}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Legend list */}
            <div className="w-full grid grid-cols-2 gap-2 mt-2 pt-3 border-t border-slate-100 text-[11px] font-mono">
              {DOWNTIME_BY_REASON.map((item) => (
                <div key={item.name} className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                  <span className="text-slate-700 truncate">{item.name}</span>
                  <span className="text-slate-500 ml-auto font-bold">{item.hours}h</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Machine Downtime Summary (2 columns) */}
        <div className="lg:col-span-2">
          <Card className="border-slate-200 bg-white shadow-xs h-full flex flex-col">
            <CardHeader className="pb-3 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-slate-900">Machine Downtime Rollup</CardTitle>
                <p className="text-xs text-slate-500 mt-0.5">Cumulative stoppage hours and primary root causes</p>
              </div>
            </CardHeader>
            <CardContent className="p-0 flex-1 overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 text-slate-500 font-mono">
                    <th className="py-2.5 px-4 font-semibold">Machine</th>
                    <th className="py-2.5 px-4 font-semibold text-right">Downtime</th>
                    <th className="py-2.5 px-4 font-semibold text-center">Events</th>
                    <th className="py-2.5 px-4 font-semibold">Main Reason</th>
                    <th className="py-2.5 px-4 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-mono">
                  {machineRollup.map((row) => (
                    <tr key={row.machine} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-4 font-bold text-slate-800">
                        {row.machine}
                      </td>
                      <td className="py-3 px-4 text-right font-bold text-rose-600">
                        {row.duration}
                      </td>
                      <td className="py-3 px-4 text-center text-slate-600">
                        {row.events}
                      </td>
                      <td className="py-3 px-4 font-sans text-slate-600">
                        {row.reason}
                      </td>
                      <td className="py-3 px-4">
                        <Badge
                          variant={
                            row.status === "breakdown"
                              ? "breakdown"
                              : row.status === "maintenance"
                              ? "maintenance"
                              : row.status === "idle"
                              ? "idle"
                              : "running"
                          }
                          dot
                        >
                          {row.status.toUpperCase()}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Filter and Incident History Log */}
      <Card className="border-slate-200 bg-white shadow-xs">
        <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <CardTitle className="text-slate-900">Recent Stoppage & Breakdown Incidents</CardTitle>
            <p className="text-xs text-slate-500 mt-0.5">Filter by date, machine, reason code, and linked work orders</p>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
            {/* Reason Filter */}
            <select
              value={reasonFilter}
              onChange={(e) => setReasonFilter(e.target.value)}
              className="bg-slate-50 border border-slate-300 rounded-md px-2.5 py-1 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="All">All Reasons</option>
              <option value="Mechanical">Mechanical</option>
              <option value="Electrical">Electrical</option>
              <option value="Material Shortage">Material Shortage</option>
              <option value="Setup">Setup</option>
              <option value="Operator">Operator</option>
              <option value="Other">Other</option>
            </select>

            {/* Shift Filter */}
            <select
              value={shiftFilter}
              onChange={(e) => setShiftFilter(e.target.value)}
              className="bg-slate-50 border border-slate-300 rounded-md px-2.5 py-1 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="All">All Shifts</option>
              <option value="A Shift">A Shift</option>
              <option value="B Shift">B Shift</option>
              <option value="C Shift">C Shift</option>
            </select>
          </div>
        </CardHeader>

        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-slate-500 font-mono">
                <th className="py-2.5 px-4 font-semibold">Incident ID</th>
                <th className="py-2.5 px-4 font-semibold">Machine</th>
                <th className="py-2.5 px-4 font-semibold text-right">Duration</th>
                <th className="py-2.5 px-4 font-semibold">Reason</th>
                <th className="py-2.5 px-4 font-semibold">Interrelated Batch / WO</th>
                <th className="py-2.5 px-4 font-semibold">Time & Shift</th>
                <th className="py-2.5 px-4 font-semibold">Technician</th>
                <th className="py-2.5 px-4 font-semibold">Status</th>
                <th className="py-2.5 px-4 font-semibold text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono">
              {filteredDowntime.map((d) => (
                <tr key={d.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4 font-bold text-rose-600">{d.id}</td>
                  <td className="py-3 px-4 font-semibold text-slate-800">
                    <div>{d.machineName}</div>
                    {d.line && <div className="text-[10px] text-slate-400">{d.line}</div>}
                  </td>
                  <td className="py-3 px-4 text-right font-bold text-rose-600">
                    {d.durationMinutes} mins
                  </td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded text-[11px] bg-slate-100 text-slate-700 border border-slate-200">
                      {d.reason}
                    </span>
                  </td>
                  <td className="py-3 px-4 space-y-1">
                    {d.affectedBatchId && (
                      <button
                        onClick={() => {
                          const ord = orders.find((o) => o.id === d.affectedBatchId);
                          if (ord) setSelectedOrder(ord);
                          else setActiveTab("production");
                        }}
                        className="flex items-center gap-1 text-[11px] text-blue-600 hover:text-blue-800 hover:underline font-semibold"
                        title="Click to view affected production order"
                      >
                        <Layers className="w-3 h-3 text-blue-500" />
                        Batch: {d.affectedBatchId}
                      </button>
                    )}
                    {d.maintenanceTicketId && (
                      <button
                        onClick={() => setActiveTab("maintenance")}
                        className="flex items-center gap-1 text-[11px] text-purple-600 hover:text-purple-800 hover:underline font-semibold"
                        title="Click to view maintenance ticket"
                      >
                        <Wrench className="w-3 h-3 text-purple-500" />
                        WO: {d.maintenanceTicketId}
                      </button>
                    )}
                    {!d.affectedBatchId && !d.maintenanceTicketId && (
                      <span className="text-slate-400 text-[10px]">-</span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-slate-500 text-[11px]">
                    {d.time} ({d.shift})
                  </td>
                  <td className="py-3 px-4 font-sans text-slate-700">{d.technician}</td>
                  <td className="py-3 px-4">
                    <Badge
                      variant={
                        d.status === "Resolved"
                          ? "completed"
                          : d.status === "Open"
                          ? "breakdown"
                          : "warning"
                      }
                      dot
                    >
                      {d.status}
                    </Badge>
                  </td>
                  <td className="py-3 px-4 text-center">
                    {d.status !== "Resolved" ? (
                      <Button
                        size="xs"
                        variant="success"
                        onClick={() =>
                          resolveDowntimeIncident(
                            d.id,
                            "Part replaced & verified by shift maintenance engineer."
                          )
                        }
                      >
                        Resolve
                      </Button>
                    ) : (
                      <span className="text-emerald-600 font-semibold text-xs flex items-center justify-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Done
                      </span>
                    )}
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