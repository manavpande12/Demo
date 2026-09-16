'use client';

import React from 'react';
import { Modal } from '@/components/ui/Modal';
import { Customer } from '@/types';
import { useSolarFlow } from '@/context/SolarFlowContext';
import { formatCapacity, formatINR, formatDate } from '@/utils/formatters';
import {
  Building2,
  Mail,
  Phone,
  MapPin,
  FileSpreadsheet,
  Zap,
  FolderKanban,
  CheckCircle2,
} from 'lucide-react';
import { Badge } from '@/components/ui/Badge';

interface CustomerDetailModalProps {
  customerId: string | null;
  onClose: () => void;
}

export const CustomerDetailModal: React.FC<CustomerDetailModalProps> = ({
  customerId,
  onClose,
}) => {
  const { customers, projects, quotations, setActiveTab, setSelectedProjectId } = useSolarFlow();

  const customer = customers.find((c) => c.id === customerId);
  if (!customer) return null;

  const associatedProjects = projects.filter((p) => p.customerId === customer.id);
  const associatedQuotations = quotations.filter((q) => q.customerId === customer.id);

  return (
    <Modal
      isOpen={!!customerId}
      onClose={onClose}
      title={customer.company}
      subtitle={`Customer ID: ${customer.id} | Type: ${customer.customerType}`}
      maxWidth="3xl"
    >
      <div className="space-y-6">
        {/* Contact & DISCOM Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Contact Person & Details
            </h4>
            <div className="text-sm font-semibold text-slate-800">{customer.name}</div>
            <div className="flex items-center gap-2 text-xs text-slate-600">
              <Mail className="w-3.5 h-3.5 text-slate-400" />
              <a href={`mailto:${customer.email}`} className="text-solar-600 hover:underline">
                {customer.email}
              </a>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-600">
              <Phone className="w-3.5 h-3.5 text-slate-400" />
              <span>{customer.phone}</span>
            </div>
            <div className="flex items-start gap-2 text-xs text-slate-600">
              <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0 mt-0.5" />
              <span>{customer.address}, {customer.city}, {customer.state}</span>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Utility & Grid Profile
            </h4>
            <div className="flex justify-between text-xs">
              <span className="text-slate-500">Electricity Utility (DISCOM):</span>
              <span className="font-bold text-slate-800">{customer.discom}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-slate-500">Consumer Account No:</span>
              <span className="font-mono font-bold text-slate-800">{customer.consumerNumber}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-slate-500">Sanctioned Contract Demand:</span>
              <span className="font-bold text-amber-600">{customer.sanctionedLoadKW} kW / kVA</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-slate-500">GST Registration:</span>
              <span className="font-mono text-slate-800">{customer.gstNumber}</span>
            </div>
          </div>
        </div>

        {/* Associated Projects */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-2">
            <FolderKanban className="w-4 h-4 text-amber-500" />
            Associated Solar Projects ({associatedProjects.length})
          </h4>

          {associatedProjects.length === 0 ? (
            <div className="p-4 rounded-xl bg-slate-50 border border-dashed border-slate-200 text-center text-xs text-slate-500">
              No live projects created yet for this client.
            </div>
          ) : (
            <div className="space-y-2.5">
              {associatedProjects.map((prj) => (
                <div
                  key={prj.id}
                  className="p-3.5 rounded-xl border border-slate-200 bg-white hover:border-amber-300 transition-all flex items-center justify-between gap-3"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded">
                        {prj.projectCode}
                      </span>
                      <span className="text-sm font-bold text-slate-900">{prj.capacityKW} kW Rooftop</span>
                      <Badge
                        size="sm"
                        variant={prj.status === 'Commissioned' ? 'success' : 'warning'}
                      >
                        {prj.status}
                      </Badge>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">
                      {prj.location} &bull; Value: {formatINR(prj.totalContractValue)} &bull; Progress: {prj.progressPercentage}%
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      onClose();
                      setSelectedProjectId(prj.id);
                      setActiveTab('projects');
                    }}
                    className="text-xs font-semibold text-solar-600 hover:text-solar-700 px-3 py-1.5 rounded-lg bg-amber-50 hover:bg-amber-100"
                  >
                    View Project &rarr;
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Associated Quotations */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-2">
            <FileSpreadsheet className="w-4 h-4 text-blue-500" />
            Quotation History ({associatedQuotations.length})
          </h4>
          {associatedQuotations.length === 0 ? (
            <div className="p-4 rounded-xl bg-slate-50 border border-dashed border-slate-200 text-center text-xs text-slate-500">
              No quotations recorded yet.
            </div>
          ) : (
            <div className="space-y-2">
              {associatedQuotations.map((q) => (
                <div
                  key={q.id}
                  className="p-3 rounded-xl border border-slate-200 flex items-center justify-between text-xs"
                >
                  <div>
                    <span className="font-mono font-bold text-slate-800 mr-2">{q.quotationNumber}</span>
                    <span className="text-slate-600 font-medium">{q.systemCapacityKW} kW System</span>
                    <span className="text-slate-400 block mt-0.5">Dated: {formatDate(q.createdAt)}</span>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-slate-900 block">{formatINR(q.grandTotal)}</span>
                    <Badge size="sm" variant={q.status === 'Accepted' ? 'success' : 'neutral'}>
                      {q.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};
