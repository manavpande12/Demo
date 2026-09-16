'use client';

import React, { useState } from 'react';
import { useSolarFlow } from '@/context/SolarFlowContext';
import { Badge } from '@/components/ui/Badge';
import { formatDate } from '@/utils/formatters';
import { NewTicketModal } from './NewTicketModal';
import { TicketPriority, TicketStatus } from '@/types';
import {
  HeadphonesIcon,
  Plus,
  Search,
  Wrench,
  CheckCircle2,
  Clock,
  AlertTriangle,
  ShieldCheck,
  User,
  Calendar,
} from 'lucide-react';

export const ServiceView: React.FC = () => {
  const { serviceTickets, updateTicketStatus } = useSolarFlow();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const filteredTickets = serviceTickets.filter((ticket) => {
    const matchesSearch =
      ticket.issueTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.ticketNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.technician.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesPriority = priorityFilter === 'ALL' || ticket.priority === priorityFilter;
    const matchesStatus = statusFilter === 'ALL' || ticket.status === statusFilter;

    return matchesSearch && matchesPriority && matchesStatus;
  });

  return (
    <div className="space-y-5 animate-in fade-in duration-300">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Service & AMC Maintenance Desk
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Turnkey post-commissioning O&M, periodic module cleaning, and warranty service
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm shadow-sm transition-all"
        >
          <Plus className="w-4 h-4" />
          Raise Service Ticket
        </button>
      </div>

      {/* Filter Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search by ticket #, company, or issue..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none"
          />
        </div>

        <div>
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none bg-white"
          >
            <option value="ALL">All Priorities</option>
            <option value="Critical">Critical</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>

        <div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none bg-white"
          >
            <option value="ALL">All Statuses</option>
            <option value="Open">Open</option>
            <option value="Assigned">Assigned</option>
            <option value="In Progress">In Progress</option>
            <option value="Resolved">Resolved</option>
            <option value="Closed">Closed</option>
          </select>
        </div>
      </div>

      {/* Tickets List */}
      <div className="space-y-3">
        {filteredTickets.length === 0 ? (
          <div className="bg-white p-12 text-center rounded-2xl border border-slate-200 text-slate-400 text-sm">
            No service tickets matching filter parameters.
          </div>
        ) : (
          filteredTickets.map((ticket) => (
            <div
              key={ticket.id}
              className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs hover:border-amber-300 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="space-y-1.5 min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded">
                    {ticket.ticketNumber}
                  </span>
                  <Badge
                    size="sm"
                    variant={
                      ticket.priority === 'Critical'
                        ? 'danger'
                        : ticket.priority === 'High'
                        ? 'warning'
                        : 'neutral'
                    }
                  >
                    {ticket.priority} Priority
                  </Badge>
                  <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    {ticket.amcStatus}
                  </span>
                </div>

                <h3 className="font-bold text-slate-900 text-base">
                  {ticket.issueTitle}
                </h3>

                <p className="text-xs text-slate-500 leading-relaxed">
                  {ticket.description}
                </p>

                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 pt-2 text-xs text-slate-500">
                  <span className="font-semibold text-slate-700">
                    {ticket.company} ({ticket.plantName})
                  </span>
                  <span className="flex items-center gap-1">
                    <User className="w-3.5 h-3.5 text-slate-400" />
                    Tech: {ticket.technician}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    SLA: {ticket.resolutionTimeEstimate}
                  </span>
                  <span className="text-slate-400">
                    Logged: {ticket.createdAt}
                  </span>
                </div>

                {ticket.resolutionNotes && (
                  <div className="mt-2 p-2 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-800">
                    <strong>Resolution Note:</strong> {ticket.resolutionNotes}
                  </div>
                )}
              </div>

              {/* Status Selector */}
              <div className="flex flex-col sm:flex-row md:flex-col items-start md:items-end gap-2 flex-shrink-0">
                <span className="text-[11px] font-medium text-slate-400">
                  Ticket Lifecycle Status
                </span>
                <select
                  value={ticket.status}
                  onChange={(e) =>
                    updateTicketStatus(
                      ticket.id,
                      e.target.value as TicketStatus,
                      e.target.value === 'Resolved' ? 'Checked by technician and generation normalized.' : undefined
                    )
                  }
                  className={`text-xs font-bold px-3 py-1.5 rounded-xl border focus:outline-none cursor-pointer ${
                    ticket.status === 'Resolved' || ticket.status === 'Closed'
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                      : ticket.status === 'In Progress'
                      ? 'bg-amber-50 text-amber-700 border-amber-300'
                      : 'bg-blue-50 text-blue-700 border-blue-300'
                  }`}
                >
                  <option value="Open">Open</option>
                  <option value="Assigned">Assigned</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Resolved">Resolved</option>
                  <option value="Closed">Closed</option>
                </select>
              </div>
            </div>
          ))
        )}
      </div>

      <NewTicketModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />
    </div>
  );
};
