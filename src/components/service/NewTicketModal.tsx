'use client';

import React, { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { useSolarFlow } from '@/context/SolarFlowContext';
import { TicketPriority, TicketStatus } from '@/types';

interface NewTicketModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NewTicketModal: React.FC<NewTicketModalProps> = ({ isOpen, onClose }) => {
  const { customers, monitoredPlants, addServiceTicket } = useSolarFlow();

  const [selectedCustomerId, setSelectedCustomerId] = useState(customers[0]?.id || '');
  const [selectedPlantId, setSelectedPlantId] = useState(monitoredPlants[0]?.id || '');
  const [issueTitle, setIssueTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<TicketPriority>('Medium');
  const [technician, setTechnician] = useState('Kamlesh Solanki (Sr. O&M Tech)');
  const [amcStatus, setAmcStatus] = useState<any>('Active AMC');
  const [amcExpiryDate, setAmcExpiryDate] = useState('2027-08-31');
  const [resolutionTimeEstimate, setResolutionTimeEstimate] = useState('Within 24 Hours');

  const customer = customers.find((c) => c.id === selectedCustomerId) || customers[0];
  const plant = monitoredPlants.find((p) => p.id === selectedPlantId) || monitoredPlants[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!issueTitle) return;

    addServiceTicket({
      customerId: customer.id,
      customerName: customer.name,
      company: customer.company,
      plantId: plant?.plantId || 'PLT-GEN-01',
      plantName: plant?.plantName || `${customer.company} Solar Array`,
      issueTitle,
      description,
      priority,
      technician,
      status: 'Open',
      amcStatus,
      amcExpiryDate,
      resolutionTimeEstimate,
    });

    onClose();
    setIssueTitle('');
    setDescription('');
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Raise O&M / Service Ticket"
      subtitle="Log maintenance request, panel washing, or equipment diagnostic check"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Select Client *
            </label>
            <select
              value={selectedCustomerId}
              onChange={(e) => setSelectedCustomerId(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none bg-white"
            >
              {customers.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.company} ({c.city})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Associated Solar Plant *
            </label>
            <select
              value={selectedPlantId}
              onChange={(e) => setSelectedPlantId(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none bg-white"
            >
              {monitoredPlants.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.plantName}
                </option>
              ))}
            </select>
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Issue Summary *
            </label>
            <input
              type="text"
              required
              value={issueTitle}
              onChange={(e) => setIssueTitle(e.target.value)}
              placeholder="e.g. Inverter Error Code 302 / Grid Overvoltage"
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Priority Level
            </label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as TicketPriority)}
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none bg-white"
            >
              <option value="Critical">Critical (Plant Shutdown / Generation Halt)</option>
              <option value="High">High (Single Inverter Down / String Tripped)</option>
              <option value="Medium">Medium (Soiling / Scheduled Maintenance)</option>
              <option value="Low">Low (Datalogger WiFi Reconnect / Aesthetic)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Assigned Field Technician
            </label>
            <select
              value={technician}
              onChange={(e) => setTechnician(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none bg-white"
            >
              <option value="Kamlesh Solanki (Sr. O&M Tech)">Kamlesh Solanki (Sr. O&M Tech)</option>
              <option value="Sagar More (Solar Electrician)">Sagar More (Solar Electrician)</option>
              <option value="Sunil Jadhav & Team (Module Wash)">Sunil Jadhav & Team (Module Wash)</option>
              <option value="Mahesh Patil (Project Manager)">Mahesh Patil (Project Manager)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Client AMC Status
            </label>
            <select
              value={amcStatus}
              onChange={(e) => setAmcStatus(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none bg-white"
            >
              <option value="Active AMC">Active Annual Maintenance Contract</option>
              <option value="Complimentary Year 1">Complimentary Year 1 Free O&M</option>
              <option value="Expiring Soon">Expiring Soon (&lt; 30 Days)</option>
              <option value="Out of Warranty">Out of Warranty / Billable</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              SLA Resolution Commitment
            </label>
            <input
              type="text"
              value={resolutionTimeEstimate}
              onChange={(e) => setResolutionTimeEstimate(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Detailed Symptoms / Description
          </label>
          <textarea
            rows={2}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Provide inverter serial numbers, string IDs, error messages or customer observations..."
            className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none"
          />
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
            className="px-5 py-2 text-sm font-bold text-slate-950 bg-amber-500 hover:bg-amber-400 rounded-lg shadow-sm"
          >
            Raise Ticket
          </button>
        </div>
      </form>
    </Modal>
  );
};
