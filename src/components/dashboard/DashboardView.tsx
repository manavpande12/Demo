'use client';

import React from 'react';
import { useSolarFlow } from '@/context/SolarFlowContext';
import { StatCard } from '@/components/ui/StatCard';
import { Badge } from '@/components/ui/Badge';
import { formatINR, formatCapacity, formatDate } from '@/utils/formatters';
import {
  Users,
  Building2,
  FolderKanban,
  Zap,
  TrendingUp,
  Sun,
  CheckCircle2,
  Calendar,
  AlertTriangle,
  ArrowUpRight,
  Sparkles,
  ShieldAlert,
  Clock,
  BatteryCharging,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

export const DashboardView: React.FC<{
  onOpenAddLead: () => void;
  onOpenQuotation: () => void;
}> = ({ onOpenAddLead, onOpenQuotation }) => {
  const {
    leads,
    customers,
    projects,
    monitoredPlants,
    serviceTickets,
    setActiveTab,
    setSelectedProjectId,
  } = useSolarFlow();

  // Metrics
  const totalLeads = leads.length;
  const totalCustomers = customers.length;
  const activeProjects = projects.filter((p) => p.status !== 'Commissioned').length;

  const totalInstalledKW = projects
    .filter((p) => p.status === 'Commissioned')
    .reduce((acc, p) => acc + p.capacityKW, 0);

  const totalCapacityUnderExecutionKW = projects
    .filter((p) => p.status !== 'Commissioned')
    .reduce((acc, p) => acc + p.capacityKW, 0);

  const totalRevenue = projects.reduce((acc, p) => acc + p.totalContractValue, 0);

  // Generation data from primary monitored plant
  const primaryPlant = monitoredPlants[0];
  const generationData = primaryPlant ? primaryPlant.hourlyTrend : [];

  // Pipeline distribution
  const pipelineData = [
    { name: 'New Inquiry', count: leads.filter((l) => l.status === 'New').length, color: '#94a3b8' },
    { name: 'Contacted', count: leads.filter((l) => l.status === 'Contacted').length, color: '#38bdf8' },
    { name: 'Survey Sched.', count: leads.filter((l) => l.status === 'Survey Scheduled').length, color: '#f59e0b' },
    { name: 'Proposal Sent', count: leads.filter((l) => l.status === 'Proposal Sent').length, color: '#fb923c' },
    { name: 'Won / Converted', count: leads.filter((l) => l.status === 'Converted').length, color: '#10b981' },
  ];

  // Plant generation status
  const totalGenerationTodayKWh = monitoredPlants.reduce((acc, p) => acc + p.dailyGenerationKWh, 0);
  const currentLiveKW = monitoredPlants.reduce((acc, p) => acc + p.currentGenerationKW, 0);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 p-6 text-white shadow-md">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-semibold mb-2">
              <Sun className="w-3.5 h-3.5 text-amber-400" />
              India Rooftop & Ground Mount Solar EPC
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              Solar Operations Overview
            </h2>
            <p className="text-slate-300 text-sm mt-1 max-w-xl">
              Track turnkey EPC pipelines, DISCOM net-metering sanctions, site execution, and live inverter telemetry.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={onOpenAddLead}
              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm shadow-md transition-all flex items-center gap-1.5"
            >
              <Sparkles className="w-4 h-4" />
              New Solar Lead
            </button>
            <button
              onClick={onOpenQuotation}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-sm border border-slate-700 transition-all flex items-center gap-1.5"
            >
              Quotation Builder
            </button>
          </div>
        </div>
      </div>

      {/* 5 Core Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard
          title="Total Leads"
          value={totalLeads}
          subtitle={`${leads.filter((l) => l.status === 'New' || l.status === 'Contacted').length} requiring follow-up`}
          change="+18% MoM"
          isPositive={true}
          icon={Users}
          iconColor="text-blue-600"
          iconBg="bg-blue-50"
        />
        <StatCard
          title="Active Customers"
          value={totalCustomers}
          subtitle="C&I and Institutional"
          change="+4 this Qtr"
          isPositive={true}
          icon={Building2}
          iconColor="text-indigo-600"
          iconBg="bg-indigo-50"
        />
        <StatCard
          title="Projects In Progress"
          value={activeProjects}
          subtitle={`${totalCapacityUnderExecutionKW} kW under execution`}
          change="3 Near Completion"
          isPositive={true}
          icon={FolderKanban}
          iconColor="text-amber-600"
          iconBg="bg-amber-50"
        />
        <StatCard
          title="Commissioned Solar"
          value={formatCapacity(totalInstalledKW)}
          subtitle="Grid-synced capacity"
          change="100% PR"
          isPositive={true}
          icon={Zap}
          iconColor="text-emerald-600"
          iconBg="bg-emerald-50"
        />
        <StatCard
          title="Contract Value"
          value={formatINR(totalRevenue, true)}
          subtitle="Total EPC pipeline"
          change="+24% YoY"
          isPositive={true}
          icon={TrendingUp}
          iconColor="text-solar-600"
          iconBg="bg-solar-50"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Solar Generation Yield Curve */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Sun className="w-4 h-4 text-amber-500" />
                Live Solar Generation Curve (Today)
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                {primaryPlant?.plantName} (Current: {currentLiveKW.toFixed(1)} kW)
              </p>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1.5 text-slate-600">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                Output (kW)
              </span>
              <button
                onClick={() => setActiveTab('monitoring')}
                className="text-solar-600 hover:text-solar-700 font-semibold flex items-center gap-0.5"
              >
                Telemetry <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="h-64 sm:h-72 w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={generationData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorGen" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="time" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                <Tooltip
                  formatter={(val: number) => [`${val} kW`, 'Generation']}
                  contentStyle={{ backgroundColor: '#0f172a', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                />
                <Area
                  type="monotone"
                  dataKey="generationKW"
                  stroke="#f59e0b"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#colorGen)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-slate-100 text-center">
            <div className="p-2 rounded-lg bg-slate-50">
              <span className="text-[11px] text-slate-500 block">Today's Generation</span>
              <span className="text-sm font-bold text-slate-800">{totalGenerationTodayKWh.toFixed(0)} kWh</span>
            </div>
            <div className="p-2 rounded-lg bg-slate-50">
              <span className="text-[11px] text-slate-500 block">Peak Irradiance</span>
              <span className="text-sm font-bold text-slate-800">920 W/m²</span>
            </div>
            <div className="p-2 rounded-lg bg-slate-50">
              <span className="text-[11px] text-slate-500 block">Avg PR (Performance)</span>
              <span className="text-sm font-bold text-emerald-600">81.6%</span>
            </div>
          </div>
        </div>

        {/* Sales Inquiry Pipeline Breakdown */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900">Lead Pipeline Funnel</h3>
                <p className="text-xs text-slate-500">Commercial inquiries conversion</p>
              </div>
              <button
                onClick={() => setActiveTab('leads')}
                className="text-xs font-semibold text-solar-600 hover:text-solar-700"
              >
                View Leads &rarr;
              </button>
            </div>

            <div className="h-44 w-full mt-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={pipelineData} layout="vertical" margin={{ top: 5, right: 15, left: 35, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                  <XAxis type="number" stroke="#94a3b8" fontSize={11} allowDecimals={false} />
                  <YAxis type="category" dataKey="name" stroke="#64748b" fontSize={11} tickLine={false} />
                  <Tooltip
                    formatter={(val: number) => [val, 'Leads']}
                    contentStyle={{ backgroundColor: '#0f172a', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                  />
                  <Bar dataKey="count" fill="#f59e0b" radius={[0, 4, 4, 0]} barSize={16}>
                    {pipelineData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="space-y-2 mt-2 pt-3 border-t border-slate-100">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-600">High-Probability Enquiries</span>
              <span className="font-semibold text-slate-900">₹2.85 Cr pipeline</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-600">Conversion Rate</span>
              <span className="font-semibold text-emerald-600">33.3% Win Ratio</span>
            </div>
          </div>
        </div>
      </div>

      {/* Projects Progress & Active Installation Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Project Milestones Execution */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-slate-900">Active Turnkey Projects</h3>
              <p className="text-xs text-slate-500">Live progress across engineering, approvals, and erection</p>
            </div>
            <button
              onClick={() => setActiveTab('projects')}
              className="text-xs font-semibold text-solar-600 hover:text-solar-700"
            >
              All Projects &rarr;
            </button>
          </div>

          <div className="divide-y divide-slate-100 mt-2">
            {projects.slice(0, 3).map((project) => (
              <div
                key={project.id}
                onClick={() => {
                  setSelectedProjectId(project.id);
                  setActiveTab('projects');
                }}
                className="py-3.5 hover:bg-slate-50/70 p-2 rounded-xl transition-colors cursor-pointer"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded">
                        {project.projectCode}
                      </span>
                      <h4 className="text-sm font-bold text-slate-900 truncate">{project.company}</h4>
                      <Badge
                        size="sm"
                        variant={
                          project.status === 'Commissioned'
                            ? 'success'
                            : project.status === 'Installation'
                            ? 'warning'
                            : 'info'
                        }
                      >
                        {project.status}
                      </Badge>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">
                      {project.capacityKW} kW | {project.location} | Manager: {project.projectManager}
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <span className="text-sm font-bold text-slate-800">{formatINR(project.totalContractValue, true)}</span>
                    <span className="text-xs text-slate-400 block">Target: {formatDate(project.targetCompletionDate)}</span>
                  </div>
                </div>

                <div className="mt-3 flex items-center gap-3">
                  <div className="flex-1 bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        project.progressPercentage === 100 ? 'bg-emerald-500' : 'bg-solar-500'
                      }`}
                      style={{ width: `${project.progressPercentage}%` }}
                    />
                  </div>
                  <span className="text-xs font-bold text-slate-700 w-10 text-right">
                    {project.progressPercentage}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Tasks & Field Activities */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900">Upcoming Field Tasks</h3>
                <p className="text-xs text-slate-500">Surveys, CEIG visits & follow-ups</p>
              </div>
              <Calendar className="w-4 h-4 text-slate-400" />
            </div>

            <div className="space-y-3 mt-3">
              <div className="p-3 rounded-xl bg-amber-50/60 border border-amber-200/60 flex items-start gap-3">
                <Clock className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                <div className="min-w-0">
                  <p className="text-xs font-bold text-slate-900">Site Feasibility Drone Survey</p>
                  <p className="text-[11px] text-slate-600">Sharma Polytex Mills, Surat (250 kW)</p>
                  <span className="text-[10px] text-amber-700 font-semibold mt-1 inline-block">
                    Scheduled: Sep 22, 10:30 AM
                  </span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-blue-50/60 border border-blue-200/60 flex items-start gap-3">
                <ShieldAlert className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                <div className="min-w-0">
                  <p className="text-xs font-bold text-slate-900">CEIG Electrical Safety Inspection</p>
                  <p className="text-[11px] text-slate-600">Zenith Tech Park, Bengaluru (400 kW)</p>
                  <span className="text-[10px] text-blue-700 font-semibold mt-1 inline-block">
                    Scheduled: Sep 25, 02:00 PM
                  </span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-emerald-50/60 border border-emerald-200/60 flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                <div className="min-w-0">
                  <p className="text-xs font-bold text-slate-900">DISCOM Bi-Directional TOD Meter Install</p>
                  <p className="text-[11px] text-slate-600">Apex Logistics, Pune (MSEDCL Feeder)</p>
                  <span className="text-[10px] text-emerald-700 font-semibold mt-1 inline-block">
                    Sanction Order In Hand
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs text-slate-500">Service Tickets Open</span>
            <button
              onClick={() => setActiveTab('service')}
              className="text-xs font-bold text-amber-600 hover:underline"
            >
              {serviceTickets.filter((t) => t.status !== 'Resolved').length} Active Tickets &rarr;
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
