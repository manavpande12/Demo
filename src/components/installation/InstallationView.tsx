'use client';

import React, { useState } from 'react';
import { useSolarFlow } from '@/context/SolarFlowContext';
import { Badge } from '@/components/ui/Badge';
import { formatCapacity, formatDate } from '@/utils/formatters';
import { InstallationProject } from '@/types';
import {
  Wrench,
  Users,
  HardHat,
  CheckCircle2,
  Circle,
  Calendar,
  Clock,
  ShieldCheck,
  AlertTriangle,
  ArrowRight,
} from 'lucide-react';

export const InstallationView: React.FC = () => {
  const { installations, toggleInstallationTask, updateInstallationStatus } = useSolarFlow();

  const [selectedInstId, setSelectedInstId] = useState<string>(installations[0]?.id || '');

  const activeInstallation = installations.find((i) => i.id === selectedInstId) || installations[0];

  return (
    <div className="space-y-5 animate-in fade-in duration-300">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Site Execution & Installation</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Field contractor teams, safety quality checklists & erection milestones
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200 flex items-center gap-1.5">
            <HardHat className="w-4 h-4 text-emerald-600" />
            Zero Lost Time Incidents (LTI)
          </span>
        </div>
      </div>

      {/* Project Selector Pills */}
      <div className="flex flex-wrap gap-2">
        {installations.map((inst) => (
          <button
            key={inst.id}
            onClick={() => setSelectedInstId(inst.id)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
              activeInstallation?.id === inst.id
                ? 'bg-slate-900 text-amber-400 border-slate-900 shadow-sm'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
          >
            {inst.projectCode} &bull; {inst.customerName} ({inst.capacityKW} kW)
          </button>
        ))}
      </div>

      {activeInstallation && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Execution Card */}
          <div className="lg:col-span-2 space-y-6">
            {/* Project Overview Card */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded">
                      {activeInstallation.projectCode}
                    </span>
                    <Badge
                      size="sm"
                      variant={
                        activeInstallation.status === 'On Track'
                          ? 'success'
                          : activeInstallation.status === 'Ahead of Schedule'
                          ? 'purple'
                          : 'warning'
                      }
                    >
                      {activeInstallation.status}
                    </Badge>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mt-1">
                    {activeInstallation.company}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {activeInstallation.location} &bull; {formatCapacity(activeInstallation.capacityKW)} Solar Array
                  </p>
                </div>

                <div className="text-right">
                  <span className="text-xs text-slate-500 block">Current Stage</span>
                  <span className="text-sm font-bold text-amber-600 block">
                    {activeInstallation.currentStage}
                  </span>
                </div>
              </div>

              {/* Progress Bar */}
              <div>
                <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1.5">
                  <span>Installation & Checklist Progress</span>
                  <span className="text-amber-600 font-extrabold">
                    {activeInstallation.progressPercentage}%
                  </span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-amber-500 to-emerald-500 rounded-full transition-all duration-300"
                    style={{ width: `${activeInstallation.progressPercentage}%` }}
                  />
                </div>
              </div>

              {/* Execution Team Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                <div>
                  <span className="text-slate-400 block">Lead Site Engineer</span>
                  <span className="font-bold text-slate-800 mt-0.5 block">{activeInstallation.teamLead}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Civil / Electrical Contractor</span>
                  <span className="font-bold text-slate-800 mt-0.5 block">{activeInstallation.contractorName}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Field Team Strength</span>
                  <span className="font-bold text-slate-800 mt-0.5 block">{activeInstallation.teamSize} Technicians</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Target Inspection</span>
                  <span className="font-bold text-slate-800 mt-0.5 block">
                    {formatDate(activeInstallation.estimatedFinishDate)}
                  </span>
                </div>
              </div>
            </div>

            {/* Interactive Field Quality & Safety Checklist */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div>
                  <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-emerald-600" />
                    Site Safety, Civil & Electrical Quality Checklist
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Click items to toggle verification status in real time
                  </p>
                </div>
                <span className="text-xs font-bold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-lg">
                  {activeInstallation.checklist.filter((c) => c.completed).length}/
                  {activeInstallation.checklist.length} Passed
                </span>
              </div>

              <div className="divide-y divide-slate-100 mt-2">
                {activeInstallation.checklist.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => toggleInstallationTask(activeInstallation.id, item.id)}
                    className="py-3.5 px-2 flex items-center justify-between gap-3 hover:bg-slate-50/80 rounded-xl transition-all cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <button className="flex-shrink-0">
                        {item.completed ? (
                          <CheckCircle2 className="w-5 h-5 text-emerald-600 fill-emerald-100" />
                        ) : (
                          <Circle className="w-5 h-5 text-slate-300 hover:text-slate-400" />
                        )}
                      </button>
                      <div>
                        <span
                          className={`text-xs font-semibold ${
                            item.completed ? 'text-slate-900 line-through text-opacity-70' : 'text-slate-800'
                          }`}
                        >
                          {item.title}
                        </span>
                      </div>
                    </div>

                    <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                      {item.category}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Sidebar: Stage Controls & Safety Audit */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600">
                Installation Status Update
              </h4>
              <p className="text-xs text-slate-500">
                Mark installation progress for stakeholder reporting:
              </p>

              <div className="space-y-2">
                {(
                  [
                    'On Track',
                    'Ahead of Schedule',
                    'Delayed',
                    'Ready for Inspection',
                  ] as InstallationProject['status'][]
                ).map((status) => (
                  <button
                    key={status}
                    onClick={() => updateInstallationStatus(activeInstallation.id, status)}
                    className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold border transition-all ${
                      activeInstallation.status === status
                        ? 'bg-amber-500 text-slate-950 border-amber-500 shadow-sm'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>

            {/* Daily Toolbox Talk / Safety Standard */}
            <div className="bg-slate-900 rounded-2xl p-5 text-white shadow-xs space-y-3">
              <div className="flex items-center gap-2">
                <HardHat className="w-4 h-4 text-amber-400" />
                <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                  Daily Toolbox Talk Record
                </h4>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Daily briefing conducted on 100% harness hookup, lifeline rope checks, eye protection during metal drilling, and ladder tie-offs.
              </p>
              <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-400 flex justify-between">
                <span>Audited by: Quality Lead</span>
                <span className="text-emerald-400 font-semibold">Verified Safe</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
