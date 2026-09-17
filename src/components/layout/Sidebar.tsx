"use client";

import React from "react";
import {
  LayoutDashboard,
  Boxes,
  CalendarRange,
  Cpu,
  Clock,
  ShieldCheck,
  Package,
  Wrench,
  FileSpreadsheet,
  Settings,
  ChevronLeft,
  ChevronRight,
  Factory,
  MapPin,
  Clock3,
  X,
} from "lucide-react";
import { usePlant, ViewTab } from "../../context/PlantContext";
import { cn } from "../../utils/cn";

interface NavItem {
  id: ViewTab;
  label: string;
  icon: React.ElementType;
  badge?: string | number;
  badgeVariant?: "warning" | "breakdown" | "default" | "urgent";
}

export function Sidebar() {
  const {
    activeTab,
    setActiveTab,
    selectedPlant,
    selectedShift,
    machines,
    downtime,
    inventory,
    maintenance,
    isSidebarCollapsed,
    setIsSidebarCollapsed,
    isMobileSidebarOpen,
    setIsMobileSidebarOpen,
  } = usePlant();

  // Dynamic badge counts
  const breakdownMachinesCount = machines.filter((m) => m.status === "breakdown").length;
  const openDowntimeCount = downtime.filter((d) => d.status === "Open").length;
  const lowStockCount = inventory.filter((i) => i.status === "Low Stock" || i.status === "Out of Stock").length;
  const overdueMaintenance = maintenance.filter((m) => m.status === "Overdue" || m.status === "In Progress").length;

  const navItems: NavItem[] = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "production", label: "Production", icon: Boxes },
    { id: "planning", label: "Production Planning", icon: CalendarRange },
    {
      id: "machines",
      label: "Machines",
      icon: Cpu,
      badge: breakdownMachinesCount > 0 ? breakdownMachinesCount : undefined,
      badgeVariant: "breakdown",
    },
    {
      id: "downtime",
      label: "Downtime",
      icon: Clock,
      badge: openDowntimeCount > 0 ? `${openDowntimeCount} active` : undefined,
      badgeVariant: "urgent",
    },
    { id: "quality", label: "Quality", icon: ShieldCheck },
    {
      id: "inventory",
      label: "Inventory",
      icon: Package,
      badge: lowStockCount > 0 ? lowStockCount : undefined,
      badgeVariant: "warning",
    },
    {
      id: "maintenance",
      label: "Maintenance",
      icon: Wrench,
      badge: overdueMaintenance > 0 ? overdueMaintenance : undefined,
      badgeVariant: "default",
    },
    { id: "reports", label: "Reports", icon: FileSpreadsheet },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  const handleNavClick = (id: ViewTab) => {
    setActiveTab(id);
    setIsMobileSidebarOpen(false);
  };

  const navContent = (
    <div className="flex flex-col h-full bg-white border-r border-slate-200 text-slate-700 select-none">
      {/* Brand Header */}
      <div className="h-16 flex items-center px-4 border-b border-slate-200 justify-between gap-3 shrink-0 bg-white">
        <div className="flex items-center gap-2.5 overflow-hidden">
          <div className="w-9 h-9 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 shrink-0 shadow-2xs">
            <Factory className="w-5 h-5" />
          </div>
          {(!isSidebarCollapsed || isMobileSidebarOpen) && (
            <div className="flex flex-col truncate">
              <span className="font-extrabold text-sm tracking-wider text-slate-900 uppercase font-mono">
                MFGFlow
              </span>
              <span className="text-[10px] text-slate-500 font-medium truncate">
                Manufacturing System
              </span>
            </div>
          )}
        </div>

        {/* Desktop Collapse Toggle */}
        <button
          onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          className="hidden lg:flex p-1.5 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          title={isSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isSidebarCollapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <ChevronLeft className="w-4 h-4" />
          )}
        </button>

        {/* Mobile Close Button */}
        {isMobileSidebarOpen && (
          <button
            onClick={() => setIsMobileSidebarOpen(false)}
            className="lg:hidden p-1.5 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Nav List */}
      <nav className="flex-1 overflow-y-auto p-2.5 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          const showFull = !isSidebarCollapsed || isMobileSidebarOpen;

          return (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              title={!showFull ? item.label : undefined}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium transition-all group relative",
                isActive
                  ? "bg-blue-50 text-blue-700 border border-blue-200 shadow-2xs font-semibold"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/80 border border-transparent",
                !showFull && "justify-center px-2"
              )}
            >
              <Icon
                className={cn(
                  "w-4 h-4 shrink-0 transition-colors",
                  isActive ? "text-blue-600" : "text-slate-400 group-hover:text-slate-700"
                )}
              />
              {showFull && (
                <span className="flex-1 text-left truncate">{item.label}</span>
              )}

              {showFull && item.badge && (
                <span
                  className={cn(
                    "ml-auto px-1.5 py-0.5 rounded text-[10px] font-mono",
                    item.badgeVariant === "breakdown"
                      ? "bg-rose-100 text-rose-700 border border-rose-200 font-bold"
                      : item.badgeVariant === "urgent"
                      ? "bg-amber-100 text-amber-800 border border-amber-200 font-semibold"
                      : item.badgeVariant === "warning"
                      ? "bg-orange-100 text-orange-800 border border-orange-200"
                      : "bg-slate-100 text-slate-700 border border-slate-200"
                  )}
                >
                  {item.badge}
                </span>
              )}

              {!showFull && item.badge && (
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white" />
              )}
            </button>
          );
        })}
      </nav>

      {/* Plant & Shift Footer */}
      <div className="p-3 border-t border-slate-200 bg-slate-50/80 shrink-0">
        {(!isSidebarCollapsed || isMobileSidebarOpen) ? (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs text-slate-700">
              <MapPin className="w-3.5 h-3.5 text-blue-600 shrink-0" />
              <div className="truncate">
                <p className="text-[10px] text-slate-400 uppercase font-mono tracking-wider">Plant</p>
                <p className="font-semibold text-xs truncate text-slate-800">{selectedPlant}</p>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-700 pt-1.5 border-t border-slate-200/80">
              <div className="flex items-center gap-2">
                <Clock3 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <div>
                  <p className="text-[10px] text-slate-400 uppercase font-mono tracking-wider">Shift</p>
                  <p className="font-semibold text-xs text-slate-800">{selectedShift}</p>
                </div>
              </div>
              <span className="inline-flex items-center gap-1 text-[10px] text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded font-mono font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Active
              </span>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2 py-1">
            <div
              className="p-1.5 rounded-md bg-white border border-slate-200 text-blue-600 shadow-2xs"
              title={`Plant: ${selectedPlant}`}
            >
              <MapPin className="w-4 h-4" />
            </div>
            <div
              className="p-1.5 rounded-md bg-white border border-slate-200 text-emerald-600 shadow-2xs"
              title={`Shift: ${selectedShift}`}
            >
              <Clock3 className="w-4 h-4" />
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside
        className={cn(
          "hidden lg:flex flex-col shrink-0 z-30 transition-all duration-200 ease-in-out h-screen",
          isSidebarCollapsed ? "w-20" : "w-64"
        )}
      >
        {navContent}
      </aside>

      {/* Mobile Slide-over Overlay Drawer */}
      {isMobileSidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden animate-in fade-in duration-150">
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs"
            onClick={() => setIsMobileSidebarOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 w-72 max-w-[80vw] shadow-2xl z-10 animate-in slide-in-from-left duration-200">
            {navContent}
          </div>
        </div>
      )}
    </>
  );
}