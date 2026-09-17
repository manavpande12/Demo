"use client";

import React, { useState } from "react";
import {
  Wrench,
  Calendar,
  Clock,
  CheckCircle2,
  AlertTriangle,
  AlertOctagon,
  Plus,
  CalendarDays,
  ListFilter,
  User,
  CheckSquare,
  Square,
  ChevronRight,
  Cpu,
} from "lucide-react";
import { usePlant } from "../../context/PlantContext";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { MaintenanceType, MaintenanceStatus } from "../../types";

export function MaintenanceView() {
  const {
    maintenance,
    machines,
    setSelectedMachine,
    setActiveTab,
    setIsScheduleMaintenanceModalOpen,
    toggleChecklistTask,
    updateMaintenanceStatus,
    showToast,
  } = usePlant();

  const [activeTabMode, setActiveTabMode] = useState<"table" | "calendar">("table");
  const [typeFilter, setTypeFilter] = useState<string>("All");
  const [statusFilter, setStatusFilter] = useState<string>("All");

  const filteredMaintenance = maintenance.filter((wo) => {
    const matchesType = typeFilter === "All" || wo.type === typeFilter;
    const matchesStatus = statusFilter === "All" || wo.status === statusFilter;
    return matchesType && matchesStatus;
  });

  const scheduledCount = maintenance.filter((m) => m.status === "Scheduled").length;
  const overdueCount = maintenance.filter((m) => m.status === "Overdue").length;
  const inProgressCount = maintenance.filter((m) => m.status === "In Progress").length;
  const completedCount = maintenance.filter((m) => m.status === "Completed").length;

  // Weekly Calendar Grid Data
  const calendarDays = [
    { day: "Mon 15 Sep", orders: [{ id: "WO-9015", machine: "Assembly-301", type: "Preventive", done: true }] },
    { day: "Tue 16 Sep", orders: [{ id: "WO-9018", machine: "CNC-104", type: "Predictive", overdue: true }] },
    {
      day: "Wed 17 Sep (Today)",
      orders: [
        { id: "WO-9021", machine: "Welding-402", type: "Preventive", active: true },
        { id: "WO-9024", machine: "Press-202", type: "Corrective", critical: true },
      ],
    },
    { day: "Thu 18 Sep", orders: [{ id: "WO-9022", machine: "CNC-102", type: "Preventive", scheduled: true }] },
    { day: "Fri 19 Sep", orders: [{ id: "WO-9025", machine: "CNC-101", type: "Preventive", scheduled: true }] },
    { day: "Sat 20 Sep", orders: [{ id: "WO-9026", machine: "Welding-401", type: "Predictive", scheduled: true }] },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <Wrench className="w-5 h-5 text-purple-600" />
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">Maintenance Management & PM</h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Preventive service scheduling, predictive vibration checks, and corrective repair work orders linked to machine fleet
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Toggle between Table and Calendar */}
          <div className="flex bg-slate-100 border border-slate-200 rounded-lg p-0.5 text-xs font-mono">
            <button
              onClick={() => setActiveTabMode("table")}
              className={`px-3 py-1 rounded-md transition-colors ${
                activeTabMode === "table" ? "bg-white text-slate-900 font-semibold shadow-xs" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Work Orders
            </button>
            <button
              onClick={() => setActiveTabMode("calendar")}
              className={`px-3 py-1 rounded-md transition-colors ${
                activeTabMode === "calendar" ? "bg-white text-slate-900 font-semibold shadow-xs" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              PM Calendar
            </button>
          </div>

          <Button
            size="sm"
            variant="primary"
            onClick={() => setIsScheduleMaintenanceModalOpen(true)}
            className="text-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            Schedule Maintenance
          </Button>
        </div>
      </div>

      {/* Top Maintenance KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-xs">
          <span className="text-[11px] font-mono text-slate-500 uppercase tracking-wider">Scheduled PM</span>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-indigo-600">{scheduledCount}</span>
            <span className="text-xs text-slate-500 font-sans">Tasks</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Planned in weekly cycle</p>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-xs">
          <span className="text-[11px] font-mono text-rose-600 uppercase tracking-wider">Overdue</span>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-rose-600">{overdueCount}</span>
            <span className="text-xs text-slate-500 font-sans">Tasks</span>
          </div>
          <p className="text-[11px] text-rose-600 font-mono mt-1">Requires immediate dispatch</p>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-xs">
          <span className="text-[11px] font-mono text-blue-600 uppercase tracking-wider">In Progress</span>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-blue-600">{inProgressCount}</span>
            <span className="text-xs text-slate-500 font-sans">Active</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Technicians on-site</p>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-xs">
          <span className="text-[11px] font-mono text-emerald-600 uppercase tracking-wider">Completed (MTD)</span>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-emerald-600">{completedCount}</span>
            <span className="text-xs text-slate-500 font-sans">Work Orders</span>
          </div>
          <p className="text-[11px] text-emerald-600 font-mono mt-1">94.2% on-time completion</p>
        </div>
      </div>

      {/* Calendar Mode or Table Mode */}
      {activeTabMode === "calendar" ? (
        <Card className="border-slate-200 bg-white shadow-xs">
          <CardHeader className="pb-3 border-b border-slate-100 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-slate-900">Maintenance Weekly Schedule Calendar</CardTitle>
              <p className="text-xs text-slate-500 mt-0.5">
                Week 38 &mdash; September 2026 Scheduled Service Windows
              </p>
            </div>
            <span className="text-xs font-mono text-slate-500">Shift A & Shift B service slots</span>
          </CardHeader>

          <CardContent className="p-4 overflow-x-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 min-w-[700px]">
              {calendarDays.map((d) => (
                <div
                  key={d.day}
                  className={`p-3 rounded-xl border min-h-[160px] flex flex-col justify-between ${
                    d.day.includes("Today")
                      ? "bg-blue-50/40 border-blue-300 shadow-xs ring-1 ring-blue-400/30"
                      : "bg-slate-50/80 border-slate-200"
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                      <span className="text-xs font-mono font-bold text-slate-800">{d.day}</span>
                    </div>

                    <div className="mt-2.5 space-y-2">
                      {d.orders.map((ord: any) => (
                        <div
                          key={ord.id}
                          className={`p-2 rounded-lg text-xs font-mono border ${
                            ord.critical
                              ? "bg-rose-50 border-rose-300 text-rose-800"
                              : ord.overdue
                              ? "bg-amber-50 border-amber-300 text-amber-800"
                              : ord.done
                              ? "bg-emerald-50 border-emerald-300 text-emerald-800"
                              : "bg-white border-slate-200 text-slate-800"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-bold">{ord.id}</span>
                            <span className="text-[10px] uppercase font-semibold">{ord.type.substring(0, 4)}</span>
                          </div>
                          <p className="text-[11px] font-sans font-medium mt-1">{ord.machine}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <span className="text-[10px] text-slate-400 font-mono mt-2">
                    {d.orders.length} planned WO
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ) : (
        /* Work Orders Table */
        <Card className="border-slate-200 bg-white shadow-xs overflow-hidden">
          <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <div>
              <CardTitle className="text-slate-900">Active & Scheduled Maintenance Work Orders</CardTitle>
              <p className="text-xs text-slate-500 mt-0.5">
                Inspect checklist tasks, update technician progress, or complete work orders
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
              {/* Type Filter */}
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="bg-slate-50 border border-slate-300 rounded-md px-2.5 py-1 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="All">All Types</option>
                <option value="Preventive">Preventive</option>
                <option value="Corrective">Corrective</option>
                <option value="Predictive">Predictive</option>
              </select>

              {/* Status Filter */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-slate-50 border border-slate-300 rounded-md px-2.5 py-1 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="All">All Statuses</option>
                <option value="In Progress">In Progress</option>
                <option value="Overdue">Overdue</option>
                <option value="Scheduled">Scheduled</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
          </CardHeader>

          <CardContent className="p-0 overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-slate-500 font-mono">
                  <th className="py-3 px-4 font-semibold">Work Order</th>
                  <th className="py-3 px-4 font-semibold">Target Machine</th>
                  <th className="py-3 px-4 font-semibold">Type</th>
                  <th className="py-3 px-4 font-semibold">Scheduled Date</th>
                  <th className="py-3 px-4 font-semibold">Technician</th>
                  <th className="py-3 px-4 font-semibold">Priority</th>
                  <th className="py-3 px-4 font-semibold">Status</th>
                  <th className="py-3 px-4 font-semibold">Checklist Progress</th>
                  <th className="py-3 px-4 font-semibold text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono">
                {filteredMaintenance.map((wo) => {
                  const completedTasks = wo.checklist.filter((c) => c.completed).length;
                  const totalTasks = wo.checklist.length;

                  const typeVariant =
                    wo.type === "Preventive"
                      ? "inprogress"
                      : wo.type === "Corrective"
                      ? "breakdown"
                      : "warning";

                  const statusVariant =
                    wo.status === "Completed"
                      ? "completed"
                      : wo.status === "In Progress"
                      ? "inprogress"
                      : wo.status === "Overdue"
                      ? "urgent"
                      : "scheduled";

                  return (
                    <tr key={wo.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-4 font-bold text-purple-600">{wo.id}</td>
                      <td className="py-3 px-4">
                        <button
                          onClick={() => {
                            const m = machines.find((mach) => mach.code === wo.machineName || mach.id === wo.machineId);
                            if (m) setSelectedMachine(m);
                            else setActiveTab("machines");
                          }}
                          className="flex items-center gap-1 font-semibold text-slate-800 hover:text-blue-600 text-left"
                          title="Click to view machine telemetry"
                        >
                          <Cpu className="w-3.5 h-3.5 text-slate-400" />
                          {wo.machineName}
                        </button>
                        {wo.relatedDowntimeId && (
                          <button
                            onClick={() => setActiveTab("downtime")}
                            className="text-[10px] text-rose-600 hover:underline flex items-center gap-1 mt-0.5"
                            title="Linked downtime incident"
                          >
                            <AlertOctagon className="w-2.5 h-2.5" />
                            Incident: {wo.relatedDowntimeId}
                          </button>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant={typeVariant}>{wo.type}</Badge>
                      </td>
                      <td className="py-3 px-4 text-slate-500">{wo.scheduledDate}</td>
                      <td className="py-3 px-4 font-sans text-slate-700">{wo.technician}</td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-0.5 rounded font-semibold text-[11px] ${
                            wo.priority === "Critical"
                              ? "text-rose-700 bg-rose-50 border border-rose-200"
                              : wo.priority === "High"
                              ? "text-amber-700 bg-amber-50 border border-amber-200"
                              : "text-slate-700 bg-slate-100 border border-slate-200"
                          }`}
                        >
                          {wo.priority}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant={statusVariant} dot>
                          {wo.status}
                        </Badge>
                      </td>

                      {/* Interactive Checklist Preview */}
                      <td className="py-3 px-4">
                        <div className="space-y-1 max-w-xs">
                          <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1">
                            <span>Checklist ({completedTasks}/{totalTasks})</span>
                          </div>
                          {wo.checklist.slice(0, 2).map((item, idx) => (
                            <button
                              key={idx}
                              onClick={() => toggleChecklistTask(wo.id, idx)}
                              className="flex items-center gap-2 text-[11px] text-slate-700 hover:text-slate-900 transition-colors text-left w-full truncate"
                            >
                              {item.completed ? (
                                <CheckSquare className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                              ) : (
                                <Square className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                              )}
                              <span className={item.completed ? "line-through text-slate-400" : ""}>
                                {item.task}
                              </span>
                            </button>
                          ))}
                        </div>
                      </td>

                      <td className="py-3 px-4 text-center">
                        {wo.status !== "Completed" ? (
                          <Button
                            size="xs"
                            variant="success"
                            onClick={() => updateMaintenanceStatus(wo.id, "Completed")}
                          >
                            Mark Done
                          </Button>
                        ) : (
                          <span className="text-emerald-600 font-semibold text-xs flex items-center justify-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Closed
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}