"use client";

import React, { useState } from "react";
import {
  Cpu,
  Activity,
  Thermometer,
  Gauge,
  Clock,
  CheckCircle2,
  AlertTriangle,
  AlertOctagon,
  Wrench,
  ChevronRight,
  Filter,
  Package,
  Layers,
  FileSpreadsheet,
  Plus,
  Edit2,
  Trash2,
} from "lucide-react";
import { usePlant } from "../../context/PlantContext";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";

export function MachinesView() {
  const {
    machines,
    setSelectedMachine,
    setSelectedOrder,
    orders,
    activeMachinesCount,
    totalMachinesCount,
    setIsLogDowntimeModalOpen,
    setIsScheduleMaintenanceModalOpen,
    setIsNewMachineModalOpen,
    setIsEditMachineModalOpen,
    setMachineToEdit,
    deleteMachine,
    openDeleteConfirm,
    setActiveTab,
  } = usePlant();

  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [departmentFilter, setDepartmentFilter] = useState<string>("All");

  const runningCount = machines.filter((m) => m.status === "running").length;
  const idleCount = machines.filter((m) => m.status === "idle").length;
  const breakdownCount = machines.filter((m) => m.status === "breakdown").length;
  const maintenanceCount = machines.filter((m) => m.status === "maintenance").length;

  const filteredMachines = machines.filter((m) => {
    const matchesStatus = statusFilter === "All" || m.status === statusFilter;
    const matchesDept = departmentFilter === "All" || m.department === departmentFilter;
    return matchesStatus && matchesDept;
  });

  const departments = Array.from(new Set(machines.map((m) => m.department)));

  const handleEditMachine = (e: React.MouseEvent, machine: any) => {
    e.stopPropagation();
    setMachineToEdit(machine);
    setIsEditMachineModalOpen(true);
  };

  const handleDeleteMachine = (e: React.MouseEvent, machine: any) => {
    e.stopPropagation();
    openDeleteConfirm({
      title: `Decommission Machine ${machine.code}`,
      message: `Are you sure you want to decommission and remove ${machine.name} (${machine.code}) from the plant fleet? Active work orders will be unassigned.`,
      confirmLabel: "Decommission Asset",
      onConfirm: () => deleteMachine(machine.id),
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <Cpu className="w-5 h-5 text-blue-600" />
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">Machine Monitoring & Telemetry</h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Live shop-floor telemetry (vibration, thermal, RPM), active job routing, and machine fleet CRUD operations
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            size="sm"
            variant="primary"
            onClick={() => setIsNewMachineModalOpen(true)}
            className="text-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Machine
          </Button>

          <Button
            size="sm"
            variant="outline"
            onClick={() => setIsScheduleMaintenanceModalOpen(true)}
            className="text-xs bg-white border-slate-300 text-slate-700 hover:bg-slate-50"
          >
            <Wrench className="w-3.5 h-3.5 text-purple-600" />
            Schedule PM
          </Button>

          <Button
            size="sm"
            variant="danger"
            onClick={() => setIsLogDowntimeModalOpen(true)}
            className="text-xs"
          >
            <AlertOctagon className="w-3.5 h-3.5" />
            Report Breakdown
          </Button>
        </div>
      </div>

      {/* Top Machine KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-[11px] font-mono text-slate-500 uppercase tracking-wider">Total Fleet</p>
            <p className="text-2xl font-bold font-mono text-slate-900 mt-1">{totalMachinesCount}</p>
            <p className="text-[10px] text-slate-400 mt-0.5">Assets registered</p>
          </div>
          <div className="p-2.5 rounded-lg bg-slate-100 text-slate-700">
            <Cpu className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-[11px] font-mono text-emerald-600 uppercase tracking-wider">Running</p>
            <p className="text-2xl font-bold font-mono text-emerald-600 mt-1">{runningCount}</p>
            <p className="text-[10px] text-slate-400 mt-0.5">Producing nominal</p>
          </div>
          <div className="p-2.5 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-200">
            <Activity className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-[11px] font-mono text-amber-600 uppercase tracking-wider">Idle / Standby</p>
            <p className="text-2xl font-bold font-mono text-amber-600 mt-1">{idleCount}</p>
            <p className="text-[10px] text-slate-400 mt-0.5">Awaiting batch / tooling</p>
          </div>
          <div className="p-2.5 rounded-lg bg-amber-50 text-amber-600 border border-amber-200">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-[11px] font-mono text-rose-600 uppercase tracking-wider">Down / Maint</p>
            <p className="text-2xl font-bold font-mono text-rose-600 mt-1">{breakdownCount + maintenanceCount}</p>
            <p className="text-[10px] text-slate-400 mt-0.5">Stoppages & service</p>
          </div>
          <div className="p-2.5 rounded-lg bg-rose-50 text-rose-600 border border-rose-200">
            <AlertOctagon className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3 rounded-xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-500" />
          <span className="text-xs text-slate-700 font-semibold">Filter Fleet:</span>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs text-slate-600 font-mono">
            <span>Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-slate-50 border border-slate-300 rounded-md px-2.5 py-1 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="All">All Statuses ({machines.length})</option>
              <option value="running">Running ({runningCount})</option>
              <option value="idle">Idle ({idleCount})</option>
              <option value="breakdown">Breakdown ({breakdownCount})</option>
              <option value="maintenance">Maintenance ({maintenanceCount})</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-slate-600 font-mono">
            <span>Department:</span>
            <select
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              className="bg-slate-50 border border-slate-300 rounded-md px-2.5 py-1 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="All">All Departments</option>
              {departments.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Machine Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredMachines.map((machine) => {
          const statusVariant =
            machine.status === "running"
              ? "running"
              : machine.status === "breakdown"
              ? "breakdown"
              : machine.status === "idle"
              ? "idle"
              : "maintenance";

          const isHot = machine.temperature >= 75;
          const isHighVibration = machine.vibration >= 3.0;

          return (
            <Card
              key={machine.id}
              onClick={() => setSelectedMachine(machine)}
              className="border-slate-200 bg-white hover:border-blue-400 transition-all cursor-pointer group hover:shadow-md flex flex-col justify-between"
            >
              <CardContent className="p-4 space-y-3">
                {/* Header row with Edit / Delete actions */}
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-base text-slate-900 group-hover:text-blue-600 transition-colors">
                        {machine.code}
                      </span>
                      <span className="text-[10px] text-slate-600 font-mono px-1.5 py-0.5 rounded bg-slate-100 border border-slate-200">
                        {machine.type}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 truncate mt-0.5 max-w-[170px]">
                      {machine.name}
                    </p>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <Badge variant={statusVariant} dot>
                      {machine.status.toUpperCase()}
                    </Badge>
                    <button
                      onClick={(e) => handleEditMachine(e, machine)}
                      className="p-1 rounded text-slate-400 hover:text-blue-600 hover:bg-slate-100 transition-colors"
                      title="Edit machine configuration"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={(e) => handleDeleteMachine(e, machine)}
                      className="p-1 rounded text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                      title="Decommission machine"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Interrelated Module Tags (Order, Downtime, Maintenance) */}
                <div className="space-y-1.5 py-1 text-[11px] font-mono">
                  {machine.currentOrderId && (
                    <div
                      onClick={(e) => {
                        e.stopPropagation();
                        const ord = orders.find((o) => o.id === machine.currentOrderId);
                        if (ord) setSelectedOrder(ord);
                        else setActiveTab("production");
                      }}
                      className="p-1.5 rounded-md bg-blue-50/80 border border-blue-200/80 flex items-center justify-between text-blue-700 hover:bg-blue-100 transition-colors"
                      title="View active order"
                    >
                      <span className="flex items-center gap-1 font-semibold truncate">
                        <Layers className="w-3 h-3 text-blue-600 shrink-0" />
                        {machine.currentOrderId}: {machine.currentOrderProduct || "Running Batch"}
                      </span>
                      <ChevronRight className="w-3 h-3 shrink-0 text-blue-500" />
                    </div>
                  )}

                  {machine.activeDowntimeId && (
                    <div
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveTab("downtime");
                      }}
                      className="p-1.5 rounded-md bg-rose-50 border border-rose-200 flex items-center justify-between text-rose-700 hover:bg-rose-100 transition-colors"
                      title="View downtime incident"
                    >
                      <span className="flex items-center gap-1 font-semibold truncate">
                        <AlertOctagon className="w-3 h-3 text-rose-600 shrink-0" />
                        Downtime: {machine.activeDowntimeId}
                      </span>
                      <ChevronRight className="w-3 h-3 shrink-0 text-rose-500" />
                    </div>
                  )}

                  {machine.activeMaintenanceId && (
                    <div
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveTab("maintenance");
                      }}
                      className="p-1.5 rounded-md bg-purple-50 border border-purple-200 flex items-center justify-between text-purple-700 hover:bg-purple-100 transition-colors"
                      title="View maintenance work order"
                    >
                      <span className="flex items-center gap-1 font-semibold truncate">
                        <Wrench className="w-3 h-3 text-purple-600 shrink-0" />
                        WO: {machine.activeMaintenanceId}
                      </span>
                      <ChevronRight className="w-3 h-3 shrink-0 text-purple-500" />
                    </div>
                  )}
                </div>

                {/* Telemetry Sensor Metrics */}
                <div className="grid grid-cols-2 gap-2 pt-1.5 border-t border-slate-100 font-mono">
                  {/* Temperature */}
                  <div className="p-2 rounded-lg bg-slate-50 border border-slate-200/80">
                    <div className="flex items-center justify-between text-slate-500 text-[10px]">
                      <span className="flex items-center gap-1">
                        <Thermometer className="w-3 h-3 text-slate-400" />
                        Temp
                      </span>
                      {isHot && (
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping" />
                      )}
                    </div>
                    <p
                      className={`text-sm font-bold mt-0.5 ${
                        isHot ? "text-rose-600" : "text-slate-800"
                      }`}
                    >
                      {machine.temperature}&deg;C
                    </p>
                  </div>

                  {/* Vibration */}
                  <div className="p-2 rounded-lg bg-slate-50 border border-slate-200/80">
                    <div className="flex items-center justify-between text-slate-500 text-[10px]">
                      <span className="flex items-center gap-1">
                        <Activity className="w-3 h-3 text-slate-400" />
                        Vibration
                      </span>
                      {isHighVibration && (
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping" />
                      )}
                    </div>
                    <p
                      className={`text-sm font-bold mt-0.5 ${
                        isHighVibration ? "text-amber-600" : "text-slate-800"
                      }`}
                    >
                      {machine.vibration} mm/s
                    </p>
                  </div>

                  {/* Speed RPM */}
                  <div className="p-2 rounded-lg bg-slate-50 border border-slate-200/80">
                    <div className="flex items-center justify-between text-slate-500 text-[10px]">
                      <span className="flex items-center gap-1">
                        <Gauge className="w-3 h-3 text-slate-400" />
                        Speed
                      </span>
                    </div>
                    <p className="text-sm font-bold mt-0.5 text-slate-800">
                      {machine.speedRpm > 0 ? `${machine.speedRpm.toLocaleString()} RPM` : "0 RPM"}
                    </p>
                  </div>

                  {/* Runtime */}
                  <div className="p-2 rounded-lg bg-slate-50 border border-slate-200/80">
                    <div className="flex items-center justify-between text-slate-500 text-[10px]">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-400" />
                        Runtime
                      </span>
                    </div>
                    <p className="text-sm font-bold mt-0.5 text-slate-800">
                      {machine.runtimeHours}h {machine.runtimeMinutes}m
                    </p>
                  </div>
                </div>

                {/* OEE Gauge Bar */}
                <div className="pt-2 border-t border-slate-100">
                  <div className="flex items-center justify-between text-xs font-mono mb-1">
                    <span className="text-slate-500">OEE Score:</span>
                    <span
                      className={`font-bold ${
                        machine.oee >= 85
                          ? "text-emerald-600"
                          : machine.oee >= 70
                          ? "text-amber-600"
                          : "text-rose-600"
                      }`}
                    >
                      {machine.oee}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        machine.oee >= 85
                          ? "bg-emerald-500"
                          : machine.oee >= 70
                          ? "bg-amber-500"
                          : "bg-rose-500"
                      }`}
                      style={{ width: `${machine.oee}%` }}
                    />
                  </div>
                </div>

                {/* Operator and Link Footer */}
                <div className="pt-2 flex items-center justify-between text-[11px] text-slate-500 border-t border-slate-100">
                  <span className="truncate">Op: {machine.operator}</span>
                  <span className="text-blue-600 font-semibold group-hover:translate-x-0.5 transition-transform flex items-center">
                    Telemetry &rarr;
                  </span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}