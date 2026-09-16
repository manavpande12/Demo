'use client';

import React, { useState, useMemo } from 'react';
import { useSolarFlow } from '@/context/SolarFlowContext';
import { Badge } from '@/components/ui/Badge';
import { formatCapacity, formatINR, formatDate } from '@/utils/formatters';
import { CustomerDetailModal } from './CustomerDetailModal';
import { Modal } from '@/components/ui/Modal';
import {
  Building2,
  Search,
  Plus,
  Phone,
  Mail,
  MapPin,
  FolderKanban,
  Zap,
  ExternalLink,
  ShieldCheck,
} from 'lucide-react';
import { CustomerType } from '@/types';

export const CustomersView: React.FC = () => {
  const { customers, addCustomer, selectedCustomerId, setSelectedCustomerId } = useSolarFlow();

  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('ALL');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New Customer Form state
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: 'Gujarat',
    customerType: 'Industrial' as CustomerType,
    gstNumber: '',
    discom: 'Torrent Power',
    sanctionedLoadKW: 250,
    consumerNumber: '',
  });

  const filteredCustomers = useMemo(() => {
    return customers.filter((cust) => {
      const matchesSearch =
        cust.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cust.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cust.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cust.discom.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesType = typeFilter === 'ALL' || cust.customerType === typeFilter;

      return matchesSearch && matchesType;
    });
  }, [customers, searchTerm, typeFilter]);

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.company) return;

    addCustomer(formData);
    setIsAddModalOpen(false);
    setFormData({
      name: '',
      company: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      state: 'Gujarat',
      customerType: 'Industrial',
      gstNumber: '',
      discom: 'Torrent Power',
      sanctionedLoadKW: 250,
      consumerNumber: '',
    });
  };

  const totalContractedKW = customers.reduce((acc, c) => acc + (c.totalCapacityKW || 0), 0);

  return (
    <div className="space-y-5 animate-in fade-in duration-300">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Solar Clients Directory</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            {customers.length} Accounts &bull; Combined Solar Capacity: {formatCapacity(totalContractedKW)}
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm shadow-sm transition-all"
        >
          <Plus className="w-4 h-4" />
          Add Client Account
        </button>
      </div>

      {/* Filter Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search by client name, company, DISCOM or city..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none"
          />
        </div>

        <div>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none bg-white"
          >
            <option value="ALL">All Client Segments</option>
            <option value="Industrial">Industrial (C&I)</option>
            <option value="Commercial">Commercial (Offices, Warehouses)</option>
            <option value="Institutional">Institutional (Hospitals, Colleges)</option>
            <option value="Residential">Residential Society / Villa</option>
          </select>
        </div>
      </div>

      {/* Customers Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCustomers.map((cust) => (
          <div
            key={cust.id}
            className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs hover:shadow-md hover:border-amber-300 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-2">
                <div>
                  <Badge
                    size="sm"
                    variant={
                      cust.customerType === 'Industrial'
                        ? 'purple'
                        : cust.customerType === 'Commercial'
                        ? 'info'
                        : 'neutral'
                    }
                  >
                    {cust.customerType}
                  </Badge>
                  <h3 className="font-bold text-slate-900 text-base mt-2 line-clamp-1">
                    {cust.company}
                  </h3>
                </div>
                <div className="w-9 h-9 rounded-xl bg-amber-50 border border-amber-200/60 flex items-center justify-center text-amber-700 flex-shrink-0">
                  <Building2 className="w-4 h-4" />
                </div>
              </div>

              <p className="text-xs text-slate-500 font-medium mt-1">
                Contact: <span className="text-slate-800">{cust.name}</span>
              </p>

              <div className="mt-4 pt-3 border-t border-slate-100 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">DISCOM Utility:</span>
                  <span className="font-semibold text-slate-800">{cust.discom}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Sanctioned Load:</span>
                  <span className="font-bold text-amber-600">{cust.sanctionedLoadKW} kW</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Location:</span>
                  <span className="text-slate-700 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-slate-400" />
                    {cust.city}, {cust.state}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                {formatCapacity(cust.totalCapacityKW || 0)} Total
              </span>

              <button
                onClick={() => setSelectedCustomerId(cust.id)}
                className="text-xs font-bold text-solar-700 hover:text-solar-800 flex items-center gap-1 hover:underline"
              >
                View Account <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Customer Details Modal */}
      <CustomerDetailModal
        customerId={selectedCustomerId}
        onClose={() => setSelectedCustomerId(null)}
      />

      {/* Add Customer Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add Client Account"
        subtitle="Record master utility profile and GST registration"
      >
        <form onSubmit={handleAddSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Company / Organization Name *
              </label>
              <input
                type="text"
                required
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Contact Person *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Client Segment
              </label>
              <select
                value={formData.customerType}
                onChange={(e) => setFormData({ ...formData, customerType: e.target.value as CustomerType })}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none bg-white"
              >
                <option value="Industrial">Industrial</option>
                <option value="Commercial">Commercial</option>
                <option value="Institutional">Institutional</option>
                <option value="Residential">Residential</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                DISCOM Utility
              </label>
              <select
                value={formData.discom}
                onChange={(e) => setFormData({ ...formData, discom: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none bg-white"
              >
                <option value="Torrent Power">Torrent Power</option>
                <option value="MSEDCL">MSEDCL (Maharashtra)</option>
                <option value="BESCOM">BESCOM (Karnataka)</option>
                <option value="PGVCL">PGVCL (Gujarat)</option>
                <option value="UGVCL">UGVCL (Gujarat)</option>
                <option value="TSSPDCL">TSSPDCL (Telangana)</option>
                <option value="TANGEDCO">TANGEDCO (Tamil Nadu)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Sanctioned Load (kW)
              </label>
              <input
                type="number"
                value={formData.sanctionedLoadKW}
                onChange={(e) => setFormData({ ...formData, sanctionedLoadKW: parseFloat(e.target.value) || 0 })}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Consumer Account Number
              </label>
              <input
                type="text"
                value={formData.consumerNumber}
                onChange={(e) => setFormData({ ...formData, consumerNumber: e.target.value })}
                placeholder="DISCOM Billing ID"
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                GST Number
              </label>
              <input
                type="text"
                value={formData.gstNumber}
                onChange={(e) => setFormData({ ...formData, gstNumber: e.target.value })}
                placeholder="24AAAAA0000A1Z5"
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsAddModalOpen(false)}
              className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-sm font-bold text-slate-950 bg-amber-500 hover:bg-amber-400 rounded-lg"
            >
              Save Client
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
