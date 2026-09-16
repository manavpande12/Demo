'use client';

import React, { useState } from 'react';
import { useSolarFlow } from '@/context/SolarFlowContext';
import { Badge } from '@/components/ui/Badge';
import { formatINR, formatCapacity, formatDate } from '@/utils/formatters';
import { ProjectDetailModal } from './ProjectDetailModal';
import { CreateProjectModal } from './CreateProjectModal';
import {
  FolderKanban,
  Search,
  CheckCircle2,
  Clock,
  MapPin,
  Calendar,
  User,
  ArrowRight,
  TrendingUp,
  Zap,
  Plus,
} from 'lucide-react';
import { ProjectStatus } from '@/types';

export const ProjectsView: React.FC = () => {
  const { projects, selectedProjectId, setSelectedProjectId } = useSolarFlow();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const filteredProjects = projects.filter((p) => {
    const matchesSearch =
      p.projectCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.location.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'ALL' || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalMWp = projects.reduce((acc, p) => acc + p.capacityKW, 0);

  return (
    <div className="space-y-5 animate-in fade-in duration-300">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">EPC Turnkey Projects</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            {projects.length} Total Projects &bull; Combined Capacity: <span className="font-bold text-amber-600">{formatCapacity(totalMWp)}</span>
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="hidden sm:inline text-xs text-slate-600 font-medium">
            {projects.filter((p) => p.status === 'Commissioned').length} Commissioned &bull; {projects.filter((p) => p.status !== 'Commissioned').length} In Progress
          </span>

          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm shadow-sm transition-all"
          >
            <Plus className="w-4 h-4" />
            Create Project
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search by project code, client name, city..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none"
          />
        </div>

        <div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none bg-white"
          >
            <option value="ALL">All Project Statuses</option>
            <option value="Active">Active Engineering</option>
            <option value="Under Approval">Under DISCOM Approval</option>
            <option value="Installation">Installation & Erection</option>
            <option value="Commissioned">Commissioned & Grid-Synced</option>
            <option value="On Hold">On Hold</option>
          </select>
        </div>
      </div>

      {/* Projects List Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredProjects.map((project) => {
          const completedStagesCount = project.stages.filter((s) => s.status === 'completed').length;

          return (
            <div
              key={project.id}
              onClick={() => setSelectedProjectId(project.id)}
              className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs hover:shadow-md hover:border-amber-300 transition-all cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded">
                        {project.projectCode}
                      </span>
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
                    <h3 className="font-bold text-slate-900 text-base mt-2">{project.company}</h3>
                    <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      {project.location}
                    </p>
                  </div>

                  <div className="text-right flex-shrink-0">
                    <span className="text-base font-extrabold text-amber-600 block">
                      {formatCapacity(project.capacityKW)}
                    </span>
                    <span className="text-xs font-semibold text-slate-800 block">
                      {formatINR(project.totalContractValue, true)}
                    </span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="mt-4 pt-3 border-t border-slate-100">
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="text-slate-600 font-medium">Turnkey Milestones</span>
                    <span className="font-bold text-slate-900">
                      {completedStagesCount}/{project.stages.length} Stages ({project.progressPercentage}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        project.progressPercentage === 100 ? 'bg-emerald-500' : 'bg-solar-500'
                      }`}
                      style={{ width: `${project.progressPercentage}%` }}
                    />
                  </div>
                </div>

                {/* Stages Mini Pills */}
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {project.stages.map((st, i) => (
                    <span
                      key={st.id}
                      className={`text-[10px] px-2 py-0.5 rounded-md font-medium ${
                        st.status === 'completed'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : st.status === 'in_progress'
                          ? 'bg-amber-50 text-amber-700 border border-amber-200'
                          : 'bg-slate-50 text-slate-400 border border-slate-200'
                      }`}
                    >
                      {i + 1}. {st.name.split(' ')[0]}
                    </span>
                  ))}
                </div>
              </div>

              {/* Bottom Metadata */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <div className="flex items-center gap-1">
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  <span>PM: {project.projectManager}</span>
                </div>

                <button className="text-xs font-bold text-solar-700 flex items-center gap-1 hover:underline">
                  Manage Stages <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Detail & Stage Management Modal */}
      <ProjectDetailModal
        projectId={selectedProjectId}
        onClose={() => setSelectedProjectId(null)}
      />

      {/* Create Project Modal */}
      <CreateProjectModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </div>
  );
};
