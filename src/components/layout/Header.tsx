"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Menu,
  Search,
  Bell,
  Calendar,
  Layers,
  Building2,
  AlertTriangle,
  AlertOctagon,
  Info,
  ChevronDown,
} from "lucide-react";
import { usePlant } from "../../context/PlantContext";
import { PlantId, ShiftId } from "../../types";
import { cn } from "../../utils/cn";

export function Header() {
  const {
    activeTab,
    selectedPlant,
    setSelectedPlant,
    selectedShift,
    setSelectedShift,
    selectedDate,
    isLiveSimulationActive,
    toggleLiveSimulation,
    lastTickTime,
    alerts,
    setIsGlobalSearchOpen,
    setIsMobileSidebarOpen,
    setActiveTab,
  } = usePlant();

  const [isAlertsOpen, setIsAlertsOpen] = useState(false);
  const alertsRef = useRef<HTMLDivElement>(null);

  const titleMap: Record<string, string> = {
    dashboard: "Plant Overview",
    production: "Production Management",
    planning: "Production Planning & Scheduling",
    machines: "Machine Monitoring & Fleet Telemetry",
    downtime: "Downtime & Stoppage Analysis",
    quality: "Quality Assurance & Metrology",
    inventory: "Material & Parts Inventory",
    maintenance: "Preventive & Corrective Maintenance",
    reports: "Plant Reports & Analytics",
    settings: "Plant & Production Settings",
  };

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (alertsRef.current && !alertsRef.current.contains(e.target as Node)) {
        setIsAlertsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const unreadAlertsCount = alerts.filter((a) => !a.read).length;

  return (
    <header className="h-16 border-b border-slate-200 bg-white/95 backdrop-blur-md px-3 sm:px-6 flex items-center justify-between gap-2 sm:gap-4 sticky top-0 z-20 select-none">
      {/* Left: Mobile Hamburger & Page Title */}
      <div className="flex items-center gap-2 sm:gap-3 min-w-0">
        <button
          onClick={() => setIsMobileSidebarOpen(true)}
          className="lg:hidden p-2 rounded-md text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
          title="Open menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="min-w-0">
          <h1 className="text-sm sm:text-base font-bold text-slate-900 truncate tracking-tight">
            {titleMap[activeTab] || "Plant Overview"}
          </h1>
          <p className="text-[10px] text-slate-500 font-mono hidden sm:block">
            MFGFlow Industrial Suite &bull; {selectedPlant.split(" ")[0]}
          </p>
        </div>
      </div>

      {/* Right Control Bar */}
      <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
        {/* Plant Selector */}
        <div className="hidden xl:flex items-center bg-slate-50 border border-slate-200 rounded-md px-2.5 py-1.5 gap-2 text-xs">
          <Building2 className="w-3.5 h-3.5 text-blue-600" />
          <select
            value={selectedPlant}
            onChange={(e) => setSelectedPlant(e.target.value as PlantId)}
            className="bg-transparent text-slate-700 text-xs font-semibold focus:outline-none cursor-pointer"
          >
            <option value="Mumbai Manufacturing Unit">Mumbai Manufacturing Unit</option>
            <option value="Pune Unit">Pune Unit (Auto Ancillary)</option>
            <option value="Chennai Unit">Chennai Unit (Machining)</option>
          </select>
        </div>

        {/* Shift Selector */}
        <div className="hidden md:flex items-center bg-slate-50 border border-slate-200 rounded-md px-2.5 py-1.5 gap-2 text-xs">
          <Layers className="w-3.5 h-3.5 text-emerald-600" />
          <select
            value={selectedShift}
            onChange={(e) => setSelectedShift(e.target.value as ShiftId)}
            className="bg-transparent text-slate-700 text-xs font-semibold focus:outline-none cursor-pointer"
          >
            <option value="A Shift">A Shift (06:00 - 14:00)</option>
            <option value="B Shift">B Shift (14:00 - 22:00)</option>
            <option value="C Shift">C Shift (22:00 - 06:00)</option>
          </select>
        </div>

        {/* Date Selector */}
        <div className="hidden sm:flex items-center bg-slate-50 border border-slate-200 rounded-md px-2.5 py-1.5 gap-2 text-xs text-slate-700 font-mono">
          <Calendar className="w-3.5 h-3.5 text-slate-500" />
          <span>17 Sep 2026</span>
        </div>

        {/* Live Demo Simulation Pill */}
        <div className="flex items-center bg-slate-50 border border-slate-200 rounded-md p-0.5 sm:p-1 pr-1.5 sm:pr-2 gap-1.5">
          <button
            onClick={toggleLiveSimulation}
            className={cn(
              "flex items-center gap-1.5 px-2 py-1 rounded text-xs font-mono transition-colors cursor-pointer",
              isLiveSimulationActive
                ? "bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold"
                : "bg-slate-200 text-slate-600 border border-slate-300"
            )}
            title={isLiveSimulationActive ? "Click to pause live updates" : "Click to resume live updates"}
          >
            <span
              className={cn(
                "w-2 h-2 rounded-full",
                isLiveSimulationActive ? "bg-emerald-600 animate-ping" : "bg-slate-400"
              )}
            />
            <span className="uppercase text-[10px] sm:text-[11px]">
              {isLiveSimulationActive ? "Live Demo" : "Paused"}
            </span>
          </button>
          <span className="hidden lg:inline text-[10px] text-slate-500 font-mono">
            {lastTickTime}
          </span>
        </div>

        {/* Global Search Shortcut */}
        <button
          onClick={() => setIsGlobalSearchOpen(true)}
          className="flex items-center gap-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-md px-2 sm:px-2.5 py-1.5 text-xs text-slate-600 hover:text-slate-900 transition-colors"
          title="Search machines, orders, materials (Ctrl+K)"
        >
          <Search className="w-3.5 h-3.5 text-slate-500" />
          <span className="hidden md:inline font-medium">Search...</span>
          <kbd className="hidden lg:inline bg-white text-slate-500 border border-slate-200 rounded px-1 py-0.2 text-[10px] font-mono shadow-2xs">
            Ctrl K
          </kbd>
        </button>

        {/* Notifications Popover */}
        <div className="relative" ref={alertsRef}>
          <button
            onClick={() => setIsAlertsOpen(!isAlertsOpen)}
            className="relative p-2 rounded-md bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-600 hover:text-slate-900 transition-colors"
            title="Plant alerts"
          >
            <Bell className="w-4 h-4" />
            {unreadAlertsCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-600 text-[10px] font-bold text-white flex items-center justify-center font-mono shadow-xs">
                {unreadAlertsCount}
              </span>
            )}
          </button>

          {isAlertsOpen && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-xl border border-slate-200 bg-white shadow-2xl p-4 z-50 text-slate-900 animate-in fade-in-50 zoom-in-95 duration-150">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <Bell className="w-4 h-4 text-blue-600" />
                  <span className="text-xs font-bold uppercase tracking-wider font-mono text-slate-900">
                    Plant Incident Alerts
                  </span>
                </div>
                <span className="text-[10px] text-slate-500 font-mono bg-slate-100 px-1.5 py-0.5 rounded">
                  {alerts.length} Total
                </span>
              </div>

              <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 py-2">
                {alerts.length === 0 ? (
                  <p className="text-xs text-slate-500 py-4 text-center">No active plant alerts</p>
                ) : (
                  alerts.map((alert) => (
                    <div
                      key={alert.id}
                      className="py-2.5 flex items-start gap-2.5 hover:bg-slate-50 px-1.5 rounded-lg transition-colors"
                    >
                      {alert.severity === "critical" ? (
                        <AlertOctagon className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                      ) : alert.severity === "warning" ? (
                        <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                      ) : (
                        <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="text-xs font-bold text-slate-900 truncate">
                            {alert.title}
                          </p>
                          <span className="text-[10px] text-slate-400 font-mono">
                            {alert.timestamp}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-600 mt-0.5 leading-relaxed font-sans">
                          {alert.description}
                        </p>
                        <div className="mt-1.5 flex items-center justify-between">
                          <span className="text-[9px] uppercase font-mono px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 border border-slate-200">
                            {alert.category}
                          </span>
                          <button
                            onClick={() => {
                              if (alert.category === "Machine") setActiveTab("machines");
                              if (alert.category === "Quality") setActiveTab("quality");
                              if (alert.category === "Inventory") setActiveTab("inventory");
                              if (alert.category === "Production") setActiveTab("production");
                              setIsAlertsOpen(false);
                            }}
                            className="text-[11px] text-blue-600 hover:text-blue-800 font-semibold"
                          >
                            Investigate &rarr;
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}