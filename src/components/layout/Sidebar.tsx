'use client';

import React from 'react';
import { useSolarFlow } from '@/context/SolarFlowContext';
import { ActiveTab } from '@/types';
import {
  LayoutDashboard,
  Users,
  Building2,
  Compass,
  FileText,
  FolderKanban,
  Boxes,
  Wrench,
  Activity,
  HeadphonesIcon,
  BarChart3,
  Settings,
  Sun,
  ChevronRight,
  ShieldCheck,
  Zap,
} from 'lucide-react';

interface NavItem {
  id: ActiveTab;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badgeCount?: (context: ReturnType<typeof useSolarFlow>) => number | null;
  badgeVariant?: 'solar' | 'danger' | 'info';
}

const navItems: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  {
    id: 'leads',
    label: 'Leads',
    icon: Users,
    badgeCount: (ctx) => ctx.leads.filter((l) => l.status === 'New' || l.status === 'Survey Scheduled').length,
    badgeVariant: 'solar',
  },
  { id: 'customers', label: 'Customers', icon: Building2 },
  { id: 'surveys', label: 'Site Surveys', icon: Compass },
  { id: 'quotations', label: 'Quotations', icon: FileText },
  {
    id: 'projects',
    label: 'Projects',
    icon: FolderKanban,
    badgeCount: (ctx) => ctx.projects.filter((p) => p.status === 'Installation' || p.status === 'Active').length,
    badgeVariant: 'info',
  },
  {
    id: 'inventory',
    label: 'Inventory',
    icon: Boxes,
    badgeCount: (ctx) => ctx.inventory.filter((i) => i.status === 'Low Stock').length,
    badgeVariant: 'danger',
  },
  { id: 'installation', label: 'Installation', icon: Wrench },
  { id: 'monitoring', label: 'Monitoring', icon: Activity },
  {
    id: 'service',
    label: 'Service & AMC',
    icon: HeadphonesIcon,
    badgeCount: (ctx) => ctx.serviceTickets.filter((t) => t.status === 'Open' || t.status === 'In Progress').length,
    badgeVariant: 'solar',
  },
  { id: 'reports', label: 'Reports', icon: BarChart3 },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export const Sidebar: React.FC<{ isOpenMobile: boolean; onCloseMobile: () => void }> = ({
  isOpenMobile,
  onCloseMobile,
}) => {
  const context = useSolarFlow();
  const { activeTab, setActiveTab } = context;

  const handleNavClick = (id: ActiveTab) => {
    setActiveTab(id);
    onCloseMobile();
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isOpenMobile && (
        <div
          className="fixed inset-0 bg-slate-900/60 z-40 lg:hidden backdrop-blur-xs"
          onClick={onCloseMobile}
        />
      )}

      <aside
        className={`fixed top-0 left-0 bottom-0 z-50 w-64 bg-slate-900 text-slate-300 flex flex-col border-r border-slate-800 transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Logo Header */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-slate-800/80 bg-slate-950/40">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 via-amber-500 to-solar-600 flex items-center justify-center shadow-lg shadow-amber-500/20 text-slate-950">
              <Sun className="w-5 h-5 fill-current animate-spin-slow" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-lg text-white tracking-tight">SolarFlow</span>
                <span className="text-[10px] font-semibold uppercase tracking-wider bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded">
                  EPC
                </span>
              </div>
              <p className="text-[11px] text-slate-400 -mt-0.5">Enterprise Solar Suite</p>
            </div>
          </div>
        </div>

        {/* Quick System Badge */}
        <div className="px-4 py-3 mx-3 mt-3 rounded-lg bg-slate-800/60 border border-slate-700/60 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-xs font-medium text-slate-300">Live Grid Sync</span>
          </div>
          <span className="text-[11px] text-amber-400 font-semibold flex items-center gap-1">
            <Zap className="w-3 h-3" />
            1.25 MWp
          </span>
        </div>

        {/* Navigation List */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            const count = item.badgeCount ? item.badgeCount(context) : null;

            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-solar-500 to-amber-500 text-slate-950 font-semibold shadow-md shadow-amber-500/20'
                    : 'text-slate-300 hover:bg-slate-800/70 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <Icon
                    className={`w-4 h-4 flex-shrink-0 ${
                      isActive ? 'text-slate-950' : 'text-slate-400'
                    }`}
                  />
                  <span className="truncate">{item.label}</span>
                </div>

                {count !== null && count !== undefined && count > 0 && (
                  <span
                    className={`text-[11px] font-bold px-1.5 py-0.5 rounded-full ${
                      isActive
                        ? 'bg-slate-950 text-amber-300'
                        : item.badgeVariant === 'danger'
                        ? 'bg-rose-500/20 text-rose-400'
                        : 'bg-amber-500/20 text-amber-300'
                    }`}
                  >
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Footer Info */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/40">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-amber-400 font-bold text-xs border border-slate-700">
              VR
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-medium text-white truncate">Vikram Rathore</p>
              <p className="text-[11px] text-slate-400 truncate">Sr. Project Director</p>
            </div>
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </div>
        </div>
      </aside>
    </>
  );
};
