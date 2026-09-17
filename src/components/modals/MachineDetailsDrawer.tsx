"use client";

import React from "react";
import { Drawer } from "../ui/drawer";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { usePlant } from "../../context/PlantContext";
import {
  Thermometer,
  Activity,
  Gauge,
  Clock,
  AlertOctagon,
  Wrench,
  CheckCircle2,
  Calendar,
  Layers,
  Play,
  RotateCcw,
  User,
  Edit2,
  Trash2,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export function MachineDetailsDrawer() {
  const {
    selectedMachine,
    setSelectedMachine,
    updateMachineStatus,
    setIsScheduleMaintenanceModalOpen,
    setIsLogDowntimeModalOpen,
    setIsEditMachineModalOpen,
    setMachineToEdit,
    deleteMachine,
    openDeleteConfirm,
    orders,
    setSelectedOrder,
    setActiveTab,
  } = usePlant();

  if (!selectedMachine) return null;

  const statusVariant =
    selectedMachine.status === "running"
      ? "running"
      : selectedMachine.status === "breakdown"
      ? "breakdown"
      : selectedMachine.status === "idle"
      ? "idle"
      : "maintenance";

  const telemetryHistory = [
    { time: "13:00", temp: selectedMachine.temperature - 2, vibe: Number((selectedMachine.vibration - 0.2).toFixed(1)), rpm: selectedMachine.speedRpm > 0 ? selectedMachine.speedRpm - 30 : 0 },
    { time: "13:15", temp: selectedMachine.temperature - 1, vibe: Number((selectedMachine.vibration - 0.1).toFixed(1)), rpm: selectedMachine.speedRpm > 0 ? selectedMachine.speedRpm + 10 : 0 },
    { time: "13:30", temp: selectedMachine.temperature, vibe: selectedMachine.vibration, rpm: selectedMachine.speedRpm },
    { time: "13:45", temp: selectedMachine.temperature + 1, vibe: Number((selectedMachine.vibration + 0.1).toFixed(1)), rpm: selectedMachine.speedRpm > 0 ? selectedMachine.speedRpm - 20 : 0 },
    { time: "14:00", temp: selectedMachine.temperature, vibe: selectedMachine.vibration, rpm: selectedMachine.speedRpm },
  ];

  const handleEdit = () => {
    setMachineToEdit(selectedMachine);
    setIsEditMachineModalOpen(true);
  };

  const handleDelete = () => {
    openDeleteConfirm({
      title: `Decommission Machine ${selectedMachine.code}`,
      message: `Are you sure you want to decommission and remove ${selectedMachine.name} (${selectedMachine.code}) from the plant fleet? Any active batch allocations will be cleared.`,
      confirmLabel: "Decommission Asset",
      onConfirm: () => {
        deleteMachine(selectedMachine.id);
        setSelectedMachine(null);
      },
    });
  };

  return (
    <Drawer
      isOpen={!!selectedMachine}
      onClose={() => setSelectedMachine(null)}
      title={`${selectedMachine.code} - ${selectedMachine.name}`}
      subtitle={`${selectedMachine.department} | ${selectedMachine.model} (${selectedMachine.year})`}
      width="xl"
    >
      <div className="space-y-6 text-xs font-sans">
        {/* Machine Status Header */}
        <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-200">
          <div className="flex items-center gap-3">
            <span className="text-slate-500 font-mono">Current Status:</span>
            <Badge variant={statusVariant} size="md" dot>
              {selectedMachine.status.toUpperCase()}
            </Badge>
          </div>
          <div className="text-slate-500 font-mono text-[11px] flex items-center gap-1.5">
            <User className="w-3.5 h-3.5 text-slate-400" />
            Operator: <span className="text-slate-900 font-semibold">{selectedMachine.operator}</span>
          </div>
        </div>

        {/* Cross-Module Linkages Ribbon */}
        <div className="space-y-2 p-3 rounded-xl bg-slate-50 border border-slate-200">
          <span className="text-[10px] font-mono uppercase text-slate-500 font-semibold block">
            Interconnected Operations & Routing
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 font-mono text-xs">
            {selectedMachine.currentOrderId ? (
              <div
                onClick={() => {
                  const ord = orders.find((o) => o.id === selectedMachine.currentOrderId);
                  if (ord) {
                    setSelectedMachine(null);
                    setSelectedOrder(ord);
                  } else {
                    setActiveTab("production");
                  }
                }}
                className="p-2 rounded-lg bg-blue-50 border border-blue-200 text-blue-800 cursor-pointer hover:bg-blue-100 transition-colors flex items-center justify-between"
              >
                <div className="flex items-center gap-1.5 truncate">
                  <Layers className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                  <span className="font-bold">{selectedMachine.currentOrderId}</span>
                  <span className="text-[10px] text-blue-600 truncate">({selectedMachine.currentOrderProduct})</span>
                </div>
                <span className="text-[10px] underline shrink-0 font-semibold">View &rarr;</span>
              </div>
            ) : (
              <div className="p-2 rounded-lg bg-white border border-slate-200 text-slate-500">
                Active Order: <span className="font-semibold">None (Idle Queue)</span>
              </div>
            )}

            {selectedMachine.activeMaintenanceId ? (
              <div
                onClick={() => {
                  setSelectedMachine(null);
                  setActiveTab("maintenance");
                }}
                className="p-2 rounded-lg bg-purple-50 border border-purple-200 text-purple-800 cursor-pointer hover:bg-purple-100 transition-colors flex items-center justify-between"
              >
                <div className="flex items-center gap-1.5">
                  <Wrench className="w-3.5 h-3.5 text-purple-600" />
                  <span className="font-bold">WO: {selectedMachine.activeMaintenanceId}</span>
                </div>
                <span className="text-[10px] underline font-semibold">Inspect &rarr;</span>
              </div>
            ) : selectedMachine.activeDowntimeId ? (
              <div
                onClick={() => {
                  setSelectedMachine(null);
                  setActiveTab("downtime");
                }}
                className="p-2 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 cursor-pointer hover:bg-rose-100 transition-colors flex items-center justify-between"
              >
                <div className="flex items-center gap-1.5">
                  <AlertOctagon className="w-3.5 h-3.5 text-rose-600" />
                  <span className="font-bold">Incident: {selectedMachine.activeDowntimeId}</span>
                </div>
                <span className="text-[10px] underline font-semibold">Inspect &rarr;</span>
              </div>
            ) : (
              <div className="p-2 rounded-lg bg-white border border-slate-200 text-slate-500">
                Service: <span className="text-emerald-600 font-semibold">No active stoppages</span>
              </div>
            )}
          </div>
        </div>

        {/* Live Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono">
          <div className="p-3 rounded-xl bg-white border border-slate-200 shadow-xs">
            <div className="flex items-center gap-1.5 text-slate-500 text-[10px] uppercase">
              <Thermometer className="w-3.5 h-3.5 text-rose-600" />
              Temperature
            </div>
            <p className="text-xl font-bold text-slate-900 mt-1">
              {selectedMachine.temperature}&deg;C
            </p>
            <span className="text-[10px] text-slate-400">Trip &gt; 80&deg;C</span>
          </div>

          <div className="p-3 rounded-xl bg-white border border-slate-200 shadow-xs">
            <div className="flex items-center gap-1.5 text-slate-500 text-[10px] uppercase">
              <Activity className="w-3.5 h-3.5 text-amber-600" />
              Vibration
            </div>
            <p className="text-xl font-bold text-slate-900 mt-1">
              {selectedMachine.vibration} mm/s
            </p>
            <span className="text-[10px] text-slate-400">Warning &gt; 3.0</span>
          </div>

          <div className="p-3 rounded-xl bg-white border border-slate-200 shadow-xs">
            <div className="flex items-center gap-1.5 text-slate-500 text-[10px] uppercase">
              <Gauge className="w-3.5 h-3.5 text-blue-600" />
              Spindle Speed
            </div>
            <p className="text-xl font-bold text-slate-900 mt-1">
              {selectedMachine.speedRpm > 0 ? `${selectedMachine.speedRpm.toLocaleString()} RPM` : "0 RPM"}
            </p>
            <span className="text-[10px] text-slate-400">Direct drive</span>
          </div>

          <div className="p-3 rounded-xl bg-white border border-slate-200 shadow-xs">
            <div className="flex items-center gap-1.5 text-slate-500 text-[10px] uppercase">
              <Clock className="w-3.5 h-3.5 text-emerald-600" />
              Runtime (Shift A)
            </div>
            <p className="text-xl font-bold text-slate-900 mt-1">
              {selectedMachine.runtimeHours}h {selectedMachine.runtimeMinutes}m
            </p>
            <span className="text-[10px] text-slate-400">Since 06:00 AM</span>
          </div>
        </div>

        {/* Telemetry Line Charts */}
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <p className="font-mono text-xs font-semibold text-slate-900">
              Live Sensor History (Last 60 mins)
            </p>
            <span className="text-[10px] font-mono text-emerald-600 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Polling at 1Hz
            </span>
          </div>

          <div className="h-44 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={telemetryHistory}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="time" stroke="#64748b" fontSize={10} />
                <YAxis stroke="#64748b" fontSize={10} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#ffffff",
                    borderColor: "#cbd5e1",
                    borderRadius: "0.5rem",
                    fontSize: "11px",
                    color: "#0f172a",
                    boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                    fontFamily: "monospace",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="temp"
                  name="Temperature (°C)"
                  stroke="#ef4444"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                />
                <Line
                  type="monotone"
                  dataKey="vibe"
                  name="Vibration (mm/s)"
                  stroke="#f59e0b"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Quick Actions & Supervisor Controls */}
        <div className="space-y-3 pt-2 border-t border-slate-200">
          <p className="text-xs font-mono font-semibold text-slate-700">Supervisor Shop-Floor Controls</p>

          <div className="grid grid-cols-2 gap-2">
            <Button
              size="sm"
              variant={selectedMachine.status === "running" ? "secondary" : "outline"}
              onClick={() => updateMachineStatus(selectedMachine.id, "running")}
              className="text-xs justify-start"
            >
              <Play className="w-3.5 h-3.5 text-emerald-600 mr-2" />
              Set Machine Running
            </Button>

            <Button
              size="sm"
              variant={selectedMachine.status === "idle" ? "secondary" : "outline"}
              onClick={() => updateMachineStatus(selectedMachine.id, "idle")}
              className="text-xs justify-start"
            >
              <Clock className="w-3.5 h-3.5 text-amber-600 mr-2" />
              Place in Standby / Idle
            </Button>

            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                setSelectedMachine(null);
                setIsScheduleMaintenanceModalOpen(true);
              }}
              className="text-xs justify-start bg-white border-slate-300 text-slate-700 hover:bg-slate-50"
            >
              <Wrench className="w-3.5 h-3.5 text-purple-600 mr-2" />
              Schedule Maintenance
            </Button>

            <Button
              size="sm"
              variant="danger"
              onClick={() => {
                setSelectedMachine(null);
                setIsLogDowntimeModalOpen(true);
              }}
              className="text-xs justify-start"
            >
              <AlertOctagon className="w-3.5 h-3.5 mr-2" />
              Log Breakdown Trip
            </Button>
          </div>

          {/* Asset Management Actions (Edit & Delete) */}
          <div className="pt-2 border-t border-slate-200 flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={handleEdit}
              className="flex-1 text-xs bg-white border-slate-300 text-slate-700 hover:bg-slate-50"
            >
              <Edit2 className="w-3.5 h-3.5 mr-1.5" />
              Edit Specifications
            </Button>

            <Button
              size="sm"
              variant="outline"
              onClick={handleDelete}
              className="flex-1 text-xs bg-rose-50/60 border-rose-200 text-rose-700 hover:bg-rose-100"
            >
              <Trash2 className="w-3.5 h-3.5 mr-1.5" />
              Decommission Asset
            </Button>
          </div>
        </div>
      </div>
    </Drawer>
  );
}