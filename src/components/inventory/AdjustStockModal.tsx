'use client';

import React, { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { useSolarFlow } from '@/context/SolarFlowContext';
import { InventoryCategory } from '@/types';

interface AdjustStockModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdjustStockModal: React.FC<AdjustStockModalProps> = ({ isOpen, onClose }) => {
  const { addInventoryItem } = useSolarFlow();

  const [formData, setFormData] = useState({
    itemCode: '',
    name: '',
    category: 'Solar Panels' as InventoryCategory,
    brand: '',
    specifications: '',
    unit: 'Nos',
    currentStock: 100,
    minStockAlert: 30,
    unitPrice: 8500,
    locationRack: 'Warehouse A - Bay 1',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.itemCode) return;

    addInventoryItem(formData);
    onClose();
    setFormData({
      itemCode: '',
      name: '',
      category: 'Solar Panels',
      brand: '',
      specifications: '',
      unit: 'Nos',
      currentStock: 100,
      minStockAlert: 30,
      unitPrice: 8500,
      locationRack: 'Warehouse A - Bay 1',
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add Inventory Item"
      subtitle="Register solar modules, inverters, cables or balance of system materials"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Item Code / SKU *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. MOD-WAA-545"
              value={formData.itemCode}
              onChange={(e) => setFormData({ ...formData, itemCode: e.target.value })}
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Category
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value as InventoryCategory })}
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none bg-white"
            >
              <option value="Solar Panels">Solar Panels</option>
              <option value="Inverters">Inverters</option>
              <option value="Mounting Structures">Mounting Structures</option>
              <option value="DC/AC Cables">DC/AC Cables</option>
              <option value="Balance of System">Balance of System</option>
              <option value="Protection & Earthing">Protection & Earthing</option>
            </select>
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Item Name & Model *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Sungrow SG110CX Multi-MPPT String Inverter"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Manufacturer / Brand
            </label>
            <input
              type="text"
              placeholder="e.g. Sungrow, Waaree, Polycab"
              value={formData.brand}
              onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Unit of Measurement
            </label>
            <select
              value={formData.unit}
              onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none bg-white"
            >
              <option value="Nos">Nos (Units)</option>
              <option value="Meters">Meters</option>
              <option value="Sets">Sets</option>
              <option value="Pairs">Pairs</option>
              <option value="Kg">Kg</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Current Stock Quantity
            </label>
            <input
              type="number"
              min="0"
              value={formData.currentStock}
              onChange={(e) => setFormData({ ...formData, currentStock: parseFloat(e.target.value) || 0 })}
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Low Stock Alert Threshold
            </label>
            <input
              type="number"
              min="0"
              value={formData.minStockAlert}
              onChange={(e) => setFormData({ ...formData, minStockAlert: parseFloat(e.target.value) || 0 })}
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Unit Cost Price (₹)
            </label>
            <input
              type="number"
              min="0"
              value={formData.unitPrice}
              onChange={(e) => setFormData({ ...formData, unitPrice: parseFloat(e.target.value) || 0 })}
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Warehouse Bin / Rack
            </label>
            <input
              type="text"
              placeholder="e.g. Warehouse B - Bay 2"
              value={formData.locationRack}
              onChange={(e) => setFormData({ ...formData, locationRack: e.target.value })}
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Technical Specifications & Certifications
          </label>
          <input
            type="text"
            placeholder="e.g. ALMM approved, IP66 rated, 1500V DC rated..."
            value={formData.specifications}
            onChange={(e) => setFormData({ ...formData, specifications: e.target.value })}
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
            className="px-5 py-2 text-sm font-bold text-slate-950 bg-amber-500 hover:bg-amber-400 rounded-lg"
          >
            Add to Inventory
          </button>
        </div>
      </form>
    </Modal>
  );
};
