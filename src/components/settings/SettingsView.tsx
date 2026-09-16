'use client';

import React, { useState } from 'react';
import { useSolarFlow } from '@/context/SolarFlowContext';
import {
  Building2,
  ShieldCheck,
  Bell,
  User,
  Palette,
  CheckCircle2,
  Save,
  Sun,
} from 'lucide-react';

export const SettingsView: React.FC = () => {
  const { companySettings, updateCompanySettings } = useSolarFlow();

  const [formData, setFormData] = useState({ ...companySettings });

  const [notificationPrefs, setNotificationPrefs] = useState({
    emailAlertsOnFaults: true,
    smsOnDispatch: true,
    dailyGenerationDigest: true,
    lowStockWarnings: true,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateCompanySettings(formData);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300 max-w-4xl">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            System & Company Settings
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Configure EPC legal entity, default quotation tax rates, DISCOM lists & notification rules
          </p>
        </div>

        <button
          onClick={handleSubmit}
          className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm shadow-sm transition-all"
        >
          <Save className="w-4 h-4" />
          Save Changes
        </button>
      </div>

      {/* Company Profile Form */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-5">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
          <Building2 className="w-5 h-5 text-amber-600" />
          <h3 className="text-base font-bold text-slate-900">
            EPC Company Profile & Statutory Details
          </h3>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Display Brand Name
              </label>
              <input
                type="text"
                value={formData.companyName}
                onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Registered Legal Name
              </label>
              <input
                type="text"
                value={formData.legalName}
                onChange={(e) => setFormData({ ...formData, legalName: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Company GSTIN
              </label>
              <input
                type="text"
                value={formData.gstNumber}
                onChange={(e) => setFormData({ ...formData, gstNumber: e.target.value })}
                className="w-full px-3 py-2 text-sm font-mono border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Company PAN
              </label>
              <input
                type="text"
                value={formData.panNumber}
                onChange={(e) => setFormData({ ...formData, panNumber: e.target.value })}
                className="w-full px-3 py-2 text-sm font-mono border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Official Business Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Contact Phone (+91)
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Headquarters Registered Office
              </label>
              <input
                type="text"
                value={formData.officeAddress}
                onChange={(e) => setFormData({ ...formData, officeAddress: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Default Composite GST Rate on Solar Works (%)
              </label>
              <input
                type="number"
                step="0.1"
                value={formData.defaultGstRate}
                onChange={(e) => setFormData({ ...formData, defaultGstRate: parseFloat(e.target.value) || 0 })}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Standard Inverter Warranty (Years)
              </label>
              <input
                type="number"
                value={formData.warrantyYearsInverters}
                onChange={(e) => setFormData({ ...formData, warrantyYearsInverters: parseInt(e.target.value) || 0 })}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none"
              />
            </div>
          </div>
        </form>
      </div>

      {/* Notification Preferences */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
          <Bell className="w-5 h-5 text-solar-600" />
          <h3 className="text-base font-bold text-slate-900">
            Automated Alert & Notification Rules
          </h3>
        </div>

        <div className="space-y-3">
          {[
            {
              key: 'emailAlertsOnFaults',
              title: 'Telemetry Inverter Fault Alerts',
              desc: 'Dispatch instantaneous alert to O&M technicians on thermal or string faults',
            },
            {
              key: 'lowStockWarnings',
              title: 'Warehouse Low-Stock Warnings',
              desc: 'Notify procurement team when solar panels or inverters drop below buffer minimum',
            },
            {
              key: 'smsOnDispatch',
              title: 'Customer SMS Milestone Updates',
              desc: 'Simulate dispatch notifications when structure or panels arrive on site',
            },
            {
              key: 'dailyGenerationDigest',
              title: 'Executive Daily Generation Digest',
              desc: 'Email aggregated solar generation report at 07:00 PM every evening',
            },
          ].map((item) => (
            <div
              key={item.key}
              className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200"
            >
              <div>
                <span className="text-xs font-bold text-slate-800 block">{item.title}</span>
                <span className="text-[11px] text-slate-500">{item.desc}</span>
              </div>
              <input
                type="checkbox"
                checked={(notificationPrefs as any)[item.key]}
                onChange={(e) =>
                  setNotificationPrefs({ ...notificationPrefs, [item.key]: e.target.checked })
                }
                className="w-4 h-4 accent-amber-500 cursor-pointer"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Demo User Profile */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
          <User className="w-5 h-5 text-indigo-600" />
          <h3 className="text-base font-bold text-slate-900">Demo User Persona</h3>
        </div>

        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-slate-900 text-amber-400 font-bold flex items-center justify-center text-base border-2 border-amber-400">
            VR
          </div>
          <div>
            <span className="text-sm font-bold text-slate-900 block">Vikram Rathore</span>
            <span className="text-xs text-slate-500 block">Sr. Project Director &bull; SolarFlow EPC</span>
            <span className="text-[11px] text-emerald-600 font-semibold mt-0.5 block">
              Full Administrative & Engineering Privileges
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
