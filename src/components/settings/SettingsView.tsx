"use client";

import React, { useState } from "react";
import {
  Settings,
  Building2,
  Target,
  Clock,
  Cpu,
  Bell,
  Save,
  CheckCircle2,
} from "lucide-react";
import { usePlant } from "../../context/PlantContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../ui/card";
import { Button } from "../ui/button";
import { SettingsState } from "../../types";

export function SettingsView() {
  const { settings, saveSettings } = usePlant();

  const [formData, setFormData] = useState<SettingsState>(settings);
  const [activeSettingsSection, setActiveSettingsSection] = useState<
    "plant" | "targets" | "shifts" | "machines" | "notifications"
  >("plant");

  const handleChange = (field: keyof SettingsState, val: any) => {
    setFormData((prev) => ({ ...prev, [field]: val }));
  };

  const handleShiftChange = (shift: "shiftA" | "shiftB" | "shiftC", field: "start" | "end", val: string) => {
    setFormData((prev) => ({
      ...prev,
      [shift]: {
        ...prev[shift],
        [field]: val,
      },
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveSettings(formData);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-slate-700" />
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">Plant & Production Settings</h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Configure manufacturing plant master data, shift intervals, threshold rules, and alerts
          </p>
        </div>

        <Button size="sm" variant="primary" onClick={handleSubmit} className="text-xs">
          <Save className="w-3.5 h-3.5" />
          Save Configuration
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Navigation menu */}
        <div className="flex md:flex-col gap-1 overflow-x-auto pb-2 md:pb-0 md:col-span-1">
          {[
            { id: "plant", label: "Plant Information", icon: Building2 },
            { id: "targets", label: "Production Targets", icon: Target },
            { id: "shifts", label: "Shift Configuration", icon: Clock },
            { id: "machines", label: "Machine Thresholds", icon: Cpu },
            { id: "notifications", label: "Notification Channels", icon: Bell },
          ].map((sec) => {
            const Icon = sec.icon;
            const isActive = activeSettingsSection === sec.id;
            return (
              <button
                key={sec.id}
                onClick={() => setActiveSettingsSection(sec.id as any)}
                className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-medium text-left whitespace-nowrap transition-all ${
                  isActive
                    ? "bg-blue-50 text-blue-700 border border-blue-200 font-semibold shadow-xs"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-transparent"
                }`}
              >
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? "text-blue-600" : "text-slate-400"}`} />
                <span>{sec.label}</span>
              </button>
            );
          })}
        </div>

        {/* Settings Forms Content */}
        <div className="md:col-span-3">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Section 1: Plant Information */}
            {activeSettingsSection === "plant" && (
              <Card className="border-slate-200 bg-white shadow-xs">
                <CardHeader>
                  <CardTitle className="text-slate-900">Plant Master Profile</CardTitle>
                  <CardDescription>Primary manufacturing unit details and regulatory license numbers</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 text-xs font-sans">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-slate-600 font-mono mb-1">Plant Name</label>
                      <input
                        type="text"
                        value={formData.plantName}
                        onChange={(e) => handleChange("plantName", e.target.value)}
                        className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-600 font-mono mb-1">Plant Code</label>
                      <input
                        type="text"
                        value={formData.plantCode}
                        onChange={(e) => handleChange("plantCode", e.target.value)}
                        className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-800 font-mono focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-600 font-mono mb-1">Physical Address</label>
                    <input
                      type="text"
                      value={formData.address}
                      onChange={(e) => handleChange("address", e.target.value)}
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-slate-600 font-mono mb-1">GSTIN / Factory Reg</label>
                      <input
                        type="text"
                        value={formData.gstin}
                        onChange={(e) => handleChange("gstin", e.target.value)}
                        className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-800 font-mono focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-600 font-mono mb-1">Timezone</label>
                      <input
                        type="text"
                        value={formData.timezone}
                        onChange={(e) => handleChange("timezone", e.target.value)}
                        className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-800 font-mono focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-600 font-mono mb-1">Base Currency</label>
                      <input
                        type="text"
                        value={formData.currency}
                        onChange={(e) => handleChange("currency", e.target.value)}
                        className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-800 font-mono focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Section 2: Production Targets */}
            {activeSettingsSection === "targets" && (
              <Card className="border-slate-200 bg-white shadow-xs">
                <CardHeader>
                  <CardTitle className="text-slate-900">Production & Quality Targets</CardTitle>
                  <CardDescription>Establish baseline quotas and performance alert triggers</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 text-xs font-sans">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-slate-600 font-mono mb-1">Daily Target Output (Units)</label>
                      <input
                        type="number"
                        value={formData.dailyTarget}
                        onChange={(e) => handleChange("dailyTarget", Number(e.target.value))}
                        className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-800 font-mono focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-600 font-mono mb-1">Monthly Planned Target (Units)</label>
                      <input
                        type="number"
                        value={formData.monthlyTarget}
                        onChange={(e) => handleChange("monthlyTarget", Number(e.target.value))}
                        className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-800 font-mono focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-slate-600 font-mono mb-1">Target OEE Benchmark (%)</label>
                      <input
                        type="number"
                        value={formData.oeeTarget}
                        onChange={(e) => handleChange("oeeTarget", Number(e.target.value))}
                        className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-800 font-mono focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-600 font-mono mb-1">Max Allowable Rejection Rate (%)</label>
                      <input
                        type="number"
                        step="0.1"
                        value={formData.rejectionTolerance}
                        onChange={(e) => handleChange("rejectionTolerance", Number(e.target.value))}
                        className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-800 font-mono focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Section 3: Shifts */}
            {activeSettingsSection === "shifts" && (
              <Card className="border-slate-200 bg-white shadow-xs">
                <CardHeader>
                  <CardTitle className="text-slate-900">Operating Shift Configuration</CardTitle>
                  <CardDescription>Shift rotation schedule for line technicians and supervisors</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 text-xs font-sans">
                  {/* Shift A */}
                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between">
                    <div>
                      <p className="font-bold text-slate-800">Shift A (Morning)</p>
                      <p className="text-slate-500 text-[11px]">Primary production shift</p>
                    </div>
                    <div className="flex items-center gap-2 font-mono">
                      <input
                        type="text"
                        value={formData.shiftA.start}
                        onChange={(e) => handleShiftChange("shiftA", "start", e.target.value)}
                        className="w-20 bg-white border border-slate-300 rounded px-2 py-1 text-center text-slate-800"
                      />
                      <span className="text-slate-400">to</span>
                      <input
                        type="text"
                        value={formData.shiftA.end}
                        onChange={(e) => handleShiftChange("shiftA", "end", e.target.value)}
                        className="w-20 bg-white border border-slate-300 rounded px-2 py-1 text-center text-slate-800"
                      />
                    </div>
                  </div>

                  {/* Shift B */}
                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between">
                    <div>
                      <p className="font-bold text-slate-800">Shift B (Evening)</p>
                      <p className="text-slate-500 text-[11px]">Secondary manufacturing shift</p>
                    </div>
                    <div className="flex items-center gap-2 font-mono">
                      <input
                        type="text"
                        value={formData.shiftB.start}
                        onChange={(e) => handleShiftChange("shiftB", "start", e.target.value)}
                        className="w-20 bg-white border border-slate-300 rounded px-2 py-1 text-center text-slate-800"
                      />
                      <span className="text-slate-400">to</span>
                      <input
                        type="text"
                        value={formData.shiftB.end}
                        onChange={(e) => handleShiftChange("shiftB", "end", e.target.value)}
                        className="w-20 bg-white border border-slate-300 rounded px-2 py-1 text-center text-slate-800"
                      />
                    </div>
                  </div>

                  {/* Shift C */}
                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between">
                    <div>
                      <p className="font-bold text-slate-800">Shift C (Night)</p>
                      <p className="text-slate-500 text-[11px]">Autonomous machining & maintenance</p>
                    </div>
                    <div className="flex items-center gap-2 font-mono">
                      <input
                        type="text"
                        value={formData.shiftC.start}
                        onChange={(e) => handleShiftChange("shiftC", "start", e.target.value)}
                        className="w-20 bg-white border border-slate-300 rounded px-2 py-1 text-center text-slate-800"
                      />
                      <span className="text-slate-400">to</span>
                      <input
                        type="text"
                        value={formData.shiftC.end}
                        onChange={(e) => handleShiftChange("shiftC", "end", e.target.value)}
                        className="w-20 bg-white border border-slate-300 rounded px-2 py-1 text-center text-slate-800"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Section 4: Machine Thresholds */}
            {activeSettingsSection === "machines" && (
              <Card className="border-slate-200 bg-white shadow-xs">
                <CardHeader>
                  <CardTitle className="text-slate-900">Machine Safety & Warning Limits</CardTitle>
                  <CardDescription>Telemetry values that trigger emergency stop or caution indicators</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 text-xs font-sans">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-slate-600 font-mono mb-1">Max Spindle Temperature (&deg;C)</label>
                      <input
                        type="number"
                        value={formData.maxTemperatureThreshold}
                        onChange={(e) => handleChange("maxTemperatureThreshold", Number(e.target.value))}
                        className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-800 font-mono focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-600 font-mono mb-1">Max Vibration Limit (mm/s RMS)</label>
                      <input
                        type="number"
                        step="0.1"
                        value={formData.maxVibrationThreshold}
                        onChange={(e) => handleChange("maxVibrationThreshold", Number(e.target.value))}
                        className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-800 font-mono focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Section 5: Notifications */}
            {activeSettingsSection === "notifications" && (
              <Card className="border-slate-200 bg-white shadow-xs">
                <CardHeader>
                  <CardTitle className="text-slate-900">Alert Dispatch Rules</CardTitle>
                  <CardDescription>Configure automatic notifications for maintenance and production leaders</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3 text-xs font-sans">
                  <label className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 border border-slate-200 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.emailAlerts}
                      onChange={(e) => handleChange("emailAlerts", e.target.checked)}
                      className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                    />
                    <div>
                      <p className="font-bold text-slate-800">Email Shift Summaries</p>
                      <p className="text-slate-500 text-[11px]">Send daily PDF rollups to plant general manager</p>
                    </div>
                  </label>

                  <label className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 border border-slate-200 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.smsAlerts}
                      onChange={(e) => handleChange("smsAlerts", e.target.checked)}
                      className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                    />
                    <div>
                      <p className="font-bold text-slate-800">Critical Breakdown SMS</p>
                      <p className="text-slate-500 text-[11px]">Instant text alert on machine breakdown exceeding 30 mins</p>
                    </div>
                  </label>

                  <label className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 border border-slate-200 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.autoScheduleMaintenance}
                      onChange={(e) => handleChange("autoScheduleMaintenance", e.target.checked)}
                      className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                    />
                    <div>
                      <p className="font-bold text-slate-800">Auto-Generate Work Orders</p>
                      <p className="text-slate-500 text-[11px]">Automatically dispatch PM work order when vibration exceeds limit</p>
                    </div>
                  </label>
                </CardContent>
              </Card>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}