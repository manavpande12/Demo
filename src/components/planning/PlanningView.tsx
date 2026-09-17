"use client";

import React, { useState } from "react";
import {
  CalendarDays,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Layers,
  ChevronRight,
  Filter,
  User,
  Plus,
  Cpu,
  Play,
  Pause,
} from "lucide-react";
import { usePlant } from "../../context/PlantContext";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { PriorityLevel } from "../../types";

export function PlanningView() {
  const {
    planning,
    machines,
    orders,
    setSelectedOrder,
    updatePlanningPriority,
    updatePlanningMachine,
    updatePlanningStatus,
    setIsNewOrderModalOpen,
  } = usePlant();

  const [activeShiftFilter, setActiveShiftFilter] = useState<string>("All");

  const filteredPlans = planning.filter((p) => {
    if (activeShiftFilter === "All") return true;
    return p.shift === activeShiftFilter;
  });

  const scheduledCount = planning.filter((p) => p.status === "Scheduled").length;
  const inProgressCount = planning.filter((p) => p.status === "In Progress").length;
  const completedCount = planning.filter((p) => p.status === "Completed").length;

  // Machine Lanes list for Gantt Board
  const scheduleLanes = [
    { machineCode: "CNC-101", line: "Machining Bay 1" },
    { machineCode: "CNC-102", line: "Machining Bay 1" },
    { machineCode: "CNC-104", line: "Machining Bay 1" },
    { machineCode: "Press-201", line: "Press Shop" },
    { machineCode: "Press-202", line: "Press Shop" },
    { machineCode: "Assembly-301", line: "Assembly Wing" },
    { machineCode: "Welding-401", line: "Fabrication Bay" },
    { machineCode: "Welding-402", line: "Fabrication Bay" },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <CalendarDays className="w-5 h-5 text-indigo-600" />
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">Production Planning & Gantt Dispatch</h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Visual shop-floor scheduling across machine lanes, shift rotations, backlog priorities, and live pause/resume controls
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="primary"
            onClick={() => setIsNewOrderModalOpen(true)}
            className="text-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            Queue New Plan
          </Button>
        </div>
      </div>

      {/* Top Planning KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="p-4 rounded-lg bg-white border border-slate-200 shadow-xs">
          <span className="text-[11px] font-mono text-slate-500 uppercase">Total Scheduled Batches</span>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-slate-900">{planning.length}</span>
            <span className="text-xs text-slate-500 font-sans">Tasks</span>
          </div>
        </div>

        <div className="p-4 rounded-lg bg-white border border-slate-200 shadow-xs">
          <span className="text-[11px] font-mono text-blue-600 uppercase">In Execution</span>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-blue-700">{inProgressCount}</span>
            <span className="text-xs text-blue-600 font-sans">Running</span>
          </div>
        </div>

        <div className="p-4 rounded-lg bg-white border border-slate-200 shadow-xs">
          <span className="text-[11px] font-mono text-slate-600 uppercase">Queued / Scheduled</span>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-slate-800">{scheduledCount}</span>
            <span className="text-xs text-slate-500 font-sans">Pending</span>
          </div>
        </div>

        <div className="p-4 rounded-lg bg-white border border-slate-200 shadow-xs">
          <span className="text-[11px] font-mono text-emerald-600 uppercase">Shift Completed</span>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-emerald-700">{completedCount}</span>
            <span className="text-xs text-emerald-600 font-sans">Done</span>
          </div>
        </div>
      </div>

      {/* Visual Gantt-Style Schedule Board */}
      <Card className="border-slate-200 bg-white shadow-xs">
        <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <CardTitle className="text-slate-900">Machine Lane Allocation Timeline</CardTitle>
            <p className="text-xs text-slate-500 mt-0.5">
              17 September 2026 &mdash; Active shifts timeline across manufacturing lines
            </p>
          </div>

          <div className="flex items-center gap-3 text-xs font-mono">
            <span className="flex items-center gap-1 text-emerald-700 font-semibold">
              <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500 inline-block" /> Completed
            </span>
            <span className="flex items-center gap-1 text-blue-700 font-semibold">
              <span className="w-2.5 h-2.5 rounded-sm bg-blue-600 inline-block" /> In Progress
            </span>
            <span className="flex items-center gap-1 text-amber-700 font-semibold">
              <span className="w-2.5 h-2.5 rounded-sm bg-amber-500 inline-block" /> Paused
            </span>
            <span className="flex items-center gap-1 text-slate-600">
              <span className="w-2.5 h-2.5 rounded-sm bg-slate-400 inline-block" /> Scheduled
            </span>
          </div>
        </CardHeader>

        <CardContent className="p-4 overflow-x-auto">
          <div className="min-w-[760px]">
            {/* Time axis header */}
            <div className="grid grid-cols-12 gap-1 pb-2 border-b border-slate-200 text-[11px] font-mono text-slate-500 text-center">
              <div className="col-span-3 text-left pl-2 font-bold text-slate-700">Machine Lane</div>
              <div className="col-span-4 bg-slate-100 py-1 rounded font-semibold text-slate-700">Shift A (06:00 - 14:00)</div>
              <div className="col-span-4 bg-slate-100 py-1 rounded font-semibold text-slate-700">Shift B (14:00 - 22:00)</div>
              <div className="col-span-1 bg-slate-100/70 py-1 rounded">Shift C</div>
            </div>

            {/* Timeline Rows */}
            <div className="divide-y divide-slate-100 mt-1">
              {scheduleLanes.map((lane) => {
                const assignedPlans = planning.filter((p) => p.machineName === lane.machineCode);

                return (
                  <div key={lane.machineCode} className="grid grid-cols-12 gap-1 py-3 items-center">
                    {/* Lane Title */}
                    <div className="col-span-3 pl-2">
                      <p className="text-xs font-bold text-slate-900 font-mono flex items-center gap-1.5">
                        <Cpu className="w-3.5 h-3.5 text-blue-600" />
                        {lane.machineCode}
                      </p>
                      <p className="text-[10px] text-slate-500">{lane.line}</p>
                    </div>

                    {/* Timeline bar area */}
                    <div className="col-span-9 grid grid-cols-9 gap-2 relative bg-slate-50 p-1.5 rounded-lg border border-slate-200 min-h-[46px] items-center">
                      {assignedPlans.length === 0 ? (
                        <div className="col-span-9 text-center text-[11px] text-slate-400 italic">
                          Idle / Ready for assignment
                        </div>
                      ) : (
                        assignedPlans.map((plan) => {
                          const isShiftA = plan.shift === "A Shift";
                          const colSpanClass = isShiftA ? "col-span-4" : "col-span-4";

                          const bgClass =
                            plan.status === "Completed"
                              ? "bg-emerald-50 border-emerald-300 text-emerald-900"
                              : plan.status === "In Progress"
                              ? "bg-blue-50 border-blue-300 text-blue-900"
                              : plan.status === "Pending"
                              ? "bg-amber-50 border-amber-300 text-amber-900"
                              : "bg-slate-100 border-slate-300 text-slate-800";

                          return (
                            <div
                              key={plan.id}
                              onClick={() => {
                                const foundOrder = orders.find((o) => o.id === plan.orderId);
                                if (foundOrder) setSelectedOrder(foundOrder);
                              }}
                              className={`${colSpanClass} p-2 rounded-md border shadow-2xs cursor-pointer hover:scale-[1.01] transition-transform ${bgClass}`}
                              title={`Click to view ${plan.orderId}`}
                            >
                              <div className="flex items-center justify-between">
                                <span className="text-[11px] font-mono font-bold truncate">
                                  {plan.orderId}
                                </span>
                                <span className="text-[9px] font-mono px-1 rounded bg-white/80 border border-slate-200">
                                  {plan.priority}
                                </span>
                              </div>
                              <p className="text-[10px] truncate mt-0.5 font-sans font-medium text-slate-700">
                                {plan.product} ({plan.plannedQty.toLocaleString()} pcs)
                              </p>
                              {plan.status === "In Progress" && (
                                <div className="mt-1 w-full bg-blue-200 h-1 rounded-full overflow-hidden">
                                  <div
                                    className="bg-blue-600 h-full rounded-full"
                                    style={{ width: `${plan.progressPercent}%` }}
                                  />
                                </div>
                              )}
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Interactive Planning Board Table */}
      <Card className="border-slate-200 bg-white shadow-xs">
        <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <CardTitle className="text-slate-900">Planning Backlog &amp; Allocations</CardTitle>
            <p className="text-xs text-slate-500 mt-0.5">
              Instant pause/resume controls, priority changes, and machine reassignments live in state
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono">
            <span className="text-slate-600">Filter Shift:</span>
            <select
              value={activeShiftFilter}
              onChange={(e) => setActiveShiftFilter(e.target.value)}
              className="bg-slate-50 border border-slate-300 rounded-md px-2.5 py-1 text-xs text-slate-800 font-semibold focus:outline-none cursor-pointer"
            >
              <option value="All">All Shifts</option>
              <option value="A Shift">A Shift</option>
              <option value="B Shift">B Shift</option>
              <option value="C Shift">C Shift</option>
            </select>
          </div>
        </CardHeader>

        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse min-w-[800px]">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-slate-600 font-mono">
                <th className="py-2.5 px-4 font-semibold">Order ID</th>
                <th className="py-2.5 px-4 font-semibold">Product</th>
                <th className="py-2.5 px-4 font-semibold text-right">Planned Qty</th>
                <th className="py-2.5 px-4 font-semibold">Machine Assignment</th>
                <th className="py-2.5 px-4 font-semibold">Priority</th>
                <th className="py-2.5 px-4 font-semibold">Schedule Window</th>
                <th className="py-2.5 px-4 font-semibold">Status</th>
                <th className="py-2.5 px-4 font-semibold text-center">Controls</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono">
              {filteredPlans.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4 font-bold text-blue-700">
                    {item.orderId}
                  </td>
                  <td className="py-3 px-4 font-sans font-semibold text-slate-900">
                    {item.product}
                  </td>
                  <td className="py-3 px-4 text-right text-slate-700 font-medium">
                    {item.plannedQty.toLocaleString()}
                  </td>

                  {/* Machine Assignment Interactive Dropdown */}
                  <td className="py-3 px-4">
                    <select
                      value={item.machineName}
                      onChange={(e) => updatePlanningMachine(item.id, e.target.value)}
                      className="bg-white border border-slate-300 rounded px-2 py-1 text-xs text-slate-800 font-mono font-semibold hover:border-blue-500 focus:outline-none cursor-pointer"
                    >
                      {machines.map((m) => (
                        <option key={m.code} value={m.code}>
                          {m.code} ({m.department.split(" ")[0]})
                        </option>
                      ))}
                    </select>
                  </td>

                  {/* Priority Interactive Dropdown */}
                  <td className="py-3 px-4">
                    <select
                      value={item.priority}
                      onChange={(e) => updatePlanningPriority(item.id, e.target.value as PriorityLevel)}
                      className={`border rounded px-2 py-1 text-xs font-mono font-bold focus:outline-none cursor-pointer ${
                        item.priority === "Urgent" || item.priority === "Critical"
                          ? "bg-rose-50 border-rose-300 text-rose-700"
                          : item.priority === "High"
                          ? "bg-amber-50 border-amber-300 text-amber-800"
                          : "bg-white border-slate-300 text-slate-700"
                      }`}
                    >
                      <option value="Urgent">Urgent</option>
                      <option value="High">High</option>
                      <option value="Medium">Medium</option>
                      <option value="Low">Low</option>
                    </select>
                  </td>

                  <td className="py-3 px-4 text-slate-600 text-[11px]">
                    {item.startDate} &rarr; {item.endDate.split(" ")[1]} ({item.shift})
                  </td>

                  {/* Status Interactive Dropdown */}
                  <td className="py-3 px-4">
                    <select
                      value={item.status}
                      onChange={(e) => updatePlanningStatus(item.id, e.target.value as any)}
                      className="bg-white border border-slate-300 rounded px-2 py-1 text-xs text-slate-800 font-mono font-medium focus:outline-none cursor-pointer"
                    >
                      <option value="Scheduled">Scheduled</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Completed">Completed</option>
                      <option value="Pending">Paused / Pending</option>
                    </select>
                  </td>

                  <td className="py-3 px-4 text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      {/* Instant Pause/Resume button */}
                      {item.status !== "Completed" && (
                        <Button
                          size="xs"
                          variant={item.status === "In Progress" ? "outline" : "primary"}
                          onClick={() =>
                            updatePlanningStatus(
                              item.id,
                              item.status === "In Progress" ? "Pending" : "In Progress"
                            )
                          }
                          className={`text-xs ${
                            item.status === "In Progress"
                              ? "bg-amber-50 border-amber-300 text-amber-800 hover:bg-amber-100"
                              : ""
                          }`}
                          title={item.status === "In Progress" ? "Pause task instantly" : "Resume task instantly"}
                        >
                          {item.status === "In Progress" ? (
                            <>
                              <Pause className="w-3 h-3 mr-1" />
                              Pause
                            </>
                          ) : (
                            <>
                              <Play className="w-3 h-3 mr-1" />
                              Resume
                            </>
                          )}
                        </Button>
                      )}

                      <button
                        onClick={() => {
                          const ord = orders.find((o) => o.id === item.orderId);
                          if (ord) setSelectedOrder(ord);
                        }}
                        className="text-xs text-blue-600 hover:text-blue-800 inline-flex items-center gap-0.5 font-sans font-semibold p-1 rounded hover:bg-slate-100"
                      >
                        Order <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
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