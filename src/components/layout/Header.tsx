'use client';

import React, { useState } from 'react';
import { useSolarFlow } from '@/context/SolarFlowContext';
import {
  Menu,
  Bell,
  Search,
  Plus,
  SunMedium,
  CheckCircle,
  ExternalLink,
  Zap,
} from 'lucide-react';
import { ActiveTab } from '@/types';

interface HeaderProps {
  onOpenMobileMenu: () => void;
  onOpenAddLeadModal: () => void;
  onOpenQuotationModal: () => void;
}

const tabTitles: Record<ActiveTab, { title: string; subtitle: string }> = {
  dashboard: {
    title: 'Executive Dashboard',
    subtitle: 'High-level solar operations, pipeline & plant performance metrics',
  },
  leads: {
    title: 'Solar Inquiries & Leads',
    subtitle: 'Manage commercial & industrial customer acquisition pipeline',
  },
  customers: {
    title: 'Client Accounts',
    subtitle: 'Consumer master, sanctioned loads, DISCOM consumer IDs & installations',
  },
  surveys: {
    title: 'Site Surveys & Feasibility',
    subtitle: 'Shadow-free roof measurement, 3D solar irradiance & capacity sizing',
  },
  quotations: {
    title: 'Quotation Engine',
    subtitle: 'Generate accurate EPC proposals with Tier-1 modules, inverters & composite GST',
  },
  projects: {
    title: 'EPC Projects',
    subtitle: 'Turnkey milestones from DISCOM approvals to net-metering commissioning',
  },
  inventory: {
    title: 'Warehouse & Materials',
    subtitle: 'Track solar modules, inverters, cables, and balance of system items',
  },
  installation: {
    title: 'Site Execution & Teams',
    subtitle: 'Real-time daily progress, contractor teams, and safety checklist validation',
  },
  monitoring: {
    title: 'Plant Telemetry & Generation',
    subtitle: 'Simulated plant analytics, inverter metrics, and generation yields',
  },
  service: {
    title: 'Service & AMC Helpdesk',
    subtitle: 'O&M maintenance tickets, module washing schedules & inverter diagnostics',
  },
  reports: {
    title: 'Executive Analytics & Reports',
    subtitle: 'Sales performance, generation trends, and revenue realization',
  },
  settings: {
    title: 'System Preferences & Company Profile',
    subtitle: 'Configure EPC GST terms, company tax details, and portal configurations',
  },
};

export const Header: React.FC<HeaderProps> = ({
  onOpenMobileMenu,
  onOpenAddLeadModal,
  onOpenQuotationModal,
}) => {
  const { activeTab, setActiveTab, monitoredPlants, serviceTickets } = useSolarFlow();
  const [showNotifications, setShowNotifications] = useState(false);

  const currentMeta = tabTitles[activeTab] || { title: 'SolarFlow', subtitle: 'Solar EPC Management' };

  // Calculate live alerts
  const totalAlerts = monitoredPlants.reduce(
    (acc, p) => acc + p.alerts.filter((a) => !a.resolved).length,
    0
  );

  return (
    <header className="sticky top-0 z-30 h-16 bg-white border-b border-slate-200/80 px-4 sm:px-6 flex items-center justify-between shadow-xs">
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={onOpenMobileMenu}
          className="p-2 -ml-2 text-slate-500 hover:text-slate-800 lg:hidden rounded-lg hover:bg-slate-100"
          aria-label="Toggle menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="min-w-0">
          <h1 className="text-base sm:text-lg font-bold text-slate-900 truncate flex items-center gap-2">
            {currentMeta.title}
          </h1>
          <p className="text-xs text-slate-500 hidden md:block truncate">
            {currentMeta.subtitle}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        {/* Quick action: Add Lead */}
        <button
          onClick={onOpenAddLeadModal}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-50 text-amber-900 border border-amber-200 hover:bg-amber-100 text-xs font-semibold transition-colors shadow-xs"
        >
          <Plus className="w-3.5 h-3.5 text-amber-700" />
          <span className="hidden sm:inline">Add</span> Lead
        </button>

        {/* Quick action: New Quote */}
        <button
          onClick={onOpenQuotationModal}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-solar-500 text-slate-950 hover:bg-solar-400 text-xs font-bold transition-all shadow-xs"
        >
          <Plus className="w-3.5 h-3.5 text-slate-950" />
          <span className="hidden sm:inline">Build</span> Quote
        </button>

        {/* Live Grid indicator badge */}
        <div className="hidden xl:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-50 border border-slate-200 text-slate-600 text-xs">
          <Zap className="w-3.5 h-3.5 text-solar-500" />
          <span>₹ INR / Net Metering</span>
        </div>

        {/* Notifications Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 text-slate-500 hover:text-slate-800 rounded-lg hover:bg-slate-100 relative transition-colors"
            title="Telemetry & Ticket Alerts"
          >
            <Bell className="w-5 h-5" />
            {totalAlerts > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white" />
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden z-50 animate-in fade-in-50 slide-in-from-top-2">
              <div className="p-3.5 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Live Notifications ({totalAlerts} unread)
                </span>
                <span className="text-[11px] text-solar-600 font-medium cursor-pointer hover:underline">
                  All Systems Online
                </span>
              </div>
              <div className="max-h-72 overflow-y-auto divide-y divide-slate-100 text-xs">
                {monitoredPlants.flatMap((p) =>
                  p.alerts.map((a) => (
                    <div
                      key={a.id}
                      className={`p-3 transition-colors ${
                        a.resolved ? 'bg-white opacity-60' : 'bg-amber-50/40 hover:bg-amber-50/70'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <p className="font-semibold text-slate-800">{p.plantName}</p>
                        <span className="text-[10px] text-slate-400 whitespace-nowrap">{a.timestamp}</span>
                      </div>
                      <p className="text-slate-600 mt-1">{a.message}</p>
                    </div>
                  ))
                )}
              </div>
              <div className="p-2 bg-slate-50 text-center border-t border-slate-100">
                <button
                  onClick={() => {
                    setActiveTab('monitoring');
                    setShowNotifications(false);
                  }}
                  className="text-xs text-solar-700 font-semibold hover:underline"
                >
                  View Monitoring Telemetry &rarr;
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
