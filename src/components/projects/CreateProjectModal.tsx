'use client';

import React, { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { useSolarFlow } from '@/context/SolarFlowContext';
import { ProjectStatus } from '@/types';
import { FolderKanban, Plus, Sparkles } from 'lucide-react';

interface CreateProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateProjectModal: React.FC<CreateProjectModalProps> = ({ isOpen, onClose }) => {
  const { customers, projects, addProject } = useSolarFlow();

  const nextCodeNum = projects.length + 1;
  const defaultCode = `SF-PRJ-2026-0${nextCodeNum}`;

  const [selectedCustomerId, setSelectedCustomerId] = useState<string>(
    customers[0]?.id || ''
  );
  const [projectCode, setProjectCode] = useState<string>(defaultCode);
  const [capacityKW, setCapacityKW] = useState<number>(250);
  const [projectType, setProjectType] = useState<string>('Industrial Rooftop C&I');
  const [location, setLocation] = useState<string>('');
  const [city, setCity] = useState<string>('Ahmedabad');
  const [startDate, setStartDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [targetCompletionDate, setTargetCompletionDate] = useState<string>(
    new Date(Date.now() + 90 * 86400000).toISOString().split('T')[0]
  );
  const [projectManager, setProjectManager] = useState<string>('Mahesh Patil');
  const [totalContractValue, setTotalContractValue] = useState<number>(8750000);
  const [status, setStatus] = useState<ProjectStatus>('Active');

  const currentCustomer = customers.find((c) => c.id === selectedCustomerId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentCustomer) return;

    addProject({
      customProjectCode: projectCode,
      customerId: currentCustomer.id,
      customerName: currentCustomer.name,
      company: currentCustomer.company,
      location: location || `${currentCustomer.address}, ${currentCustomer.city}`,
      city: city || currentCustomer.city,
      capacityKW,
      projectType,
      status,
      startDate,
      targetCompletionDate,
      projectManager,
      totalContractValue,
      stages: [], // will default to standard 7 turnkey stages
    });

    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create New Solar EPC Project"
      subtitle="Initialize turnkey project milestones, allocated engineering team & schedule"
      maxWidth="3xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Select Client Account *
            </label>
            <select
              value={selectedCustomerId}
              onChange={(e) => {
                setSelectedCustomerId(e.target.value);
                const cust = customers.find((c) => c.id === e.target.value);
                if (cust) {
                  setLocation(`${cust.address}, ${cust.city}`);
                  setCity(cust.city);
                }
              }}
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none bg-white"
            >
              {customers.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.company} ({c.city} - {c.discom})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Project Code / Identifier *
            </label>
            <input
              type="text"
              required
              value={projectCode}
              onChange={(e) => setProjectCode(e.target.value)}
              placeholder="e.g. SF-PRJ-2026-05"
              className="w-full px-3 py-2 text-sm font-mono font-bold text-amber-700 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              System Capacity (kWp) *
            </label>
            <input
              type="number"
              min="5"
              step="5"
              value={capacityKW}
              onChange={(e) => {
                const kw = parseFloat(e.target.value) || 0;
                setCapacityKW(kw);
                setTotalContractValue(Math.round(kw * 35000)); // approx ₹35k/kW default
              }}
              className="w-full px-3 py-2 text-sm font-bold text-slate-900 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Project Classification
            </label>
            <select
              value={projectType}
              onChange={(e) => setProjectType(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none bg-white"
            >
              <option value="Industrial Rooftop C&I">Industrial Rooftop C&I (PEB/RCC)</option>
              <option value="Commercial Rooftop + Carport">Commercial Rooftop + Carport</option>
              <option value="Ground Mount Captive">Ground Mount Captive</option>
              <option value="Institutional Campus">Institutional Campus (Hospital/College)</option>
              <option value="Residential Society">Residential Society Group Housing</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Site Location / Industrial Area
            </label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. Plot 45, GIDC Industrial Estate"
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              City
            </label>
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="e.g. Pune, Surat, Bengaluru"
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Assigned Project Director / Manager
            </label>
            <select
              value={projectManager}
              onChange={(e) => setProjectManager(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none bg-white"
            >
              <option value="Mahesh Patil">Mahesh Patil (Sr. Project Manager)</option>
              <option value="Siddharth Nair">Siddharth Nair (Lead EPC Engineer)</option>
              <option value="Jignesh Makwana">Jignesh Makwana (Execution Head)</option>
              <option value="Rohan Deshmukh">Rohan Deshmukh (Project Engg)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Initial Execution Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as ProjectStatus)}
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none bg-white"
            >
              <option value="Active">Active (Design & Engineering)</option>
              <option value="Under Approval">Under DISCOM Feasibility</option>
              <option value="Installation">Installation & Erection</option>
              <option value="Commissioned">Commissioned</option>
              <option value="On Hold">On Hold</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Start Date
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Target Commissioning Date
            </label>
            <input
              type="date"
              value={targetCompletionDate}
              onChange={(e) => setTargetCompletionDate(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none bg-white"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Total Turnkey EPC Contract Value (₹)
            </label>
            <input
              type="number"
              min="0"
              step="50000"
              value={totalContractValue}
              onChange={(e) => setTotalContractValue(parseFloat(e.target.value) || 0)}
              className="w-full px-3 py-2 text-sm font-bold text-slate-900 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none"
            />
            <span className="text-[11px] text-slate-400 mt-0.5 block">
              Calculates to ~₹{(totalContractValue / (capacityKW || 1)).toFixed(0)} per kWp turnkey
            </span>
          </div>
        </div>

        {/* Milestone Preset Note */}
        <div className="p-3 bg-amber-50/60 border border-amber-200/80 rounded-xl text-xs text-amber-900">
          <span className="font-bold block mb-1">7 Default Turnkey EPC Milestones Included:</span>
          <p className="text-[11px] text-amber-800 leading-relaxed">
            Engineering & Design &bull; DISCOM Approvals &bull; Material Procurement &bull; Civil & Structure &bull; Electrical & Panels &bull; CEIG Testing &bull; Net Metering Sync. You can add more steps, edit or delete them anytime in the project manager.
          </p>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-5 py-2 text-sm font-bold text-slate-950 bg-amber-500 hover:bg-amber-400 rounded-lg shadow-sm flex items-center gap-1.5"
          >
            <Sparkles className="w-4 h-4" />
            Initialize Project
          </button>
        </div>
      </form>
    </Modal>
  );
};
