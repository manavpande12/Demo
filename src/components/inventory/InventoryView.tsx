'use client';

import React, { useState } from 'react';
import { useSolarFlow } from '@/context/SolarFlowContext';
import { Badge } from '@/components/ui/Badge';
import { formatINR } from '@/utils/formatters';
import { AdjustStockModal } from './AdjustStockModal';
import {
  Boxes,
  Plus,
  Minus,
  Search,
  AlertTriangle,
  CheckCircle2,
  Package,
  Layers,
  ArrowUpDown,
} from 'lucide-react';

export const InventoryView: React.FC = () => {
  const { inventory, adjustStock } = useSolarFlow();

  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const filteredInventory = inventory.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.itemCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.brand.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = categoryFilter === 'ALL' || item.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const lowStockCount = inventory.filter((i) => i.status === 'Low Stock' || i.status === 'Out of Stock').length;
  const totalValuation = inventory.reduce((acc, i) => acc + i.currentStock * i.unitPrice, 0);

  return (
    <div className="space-y-5 animate-in fade-in duration-300">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Warehouse & Stock Inventory</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Total Inventory Valuation: <span className="font-bold text-slate-800">{formatINR(totalValuation, true)}</span> &bull;{' '}
            <span className={lowStockCount > 0 ? 'text-rose-600 font-bold' : 'text-slate-500'}>
              {lowStockCount} items below threshold
            </span>
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm shadow-sm transition-all"
        >
          <Plus className="w-4 h-4" />
          Add Warehouse Item
        </button>
      </div>

      {/* Filter Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search by module name, SKU, brand..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none"
          />
        </div>

        <div>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none bg-white"
          >
            <option value="ALL">All Categories</option>
            <option value="Solar Panels">Solar Panels</option>
            <option value="Inverters">Inverters</option>
            <option value="Mounting Structures">Mounting Structures</option>
            <option value="DC/AC Cables">DC/AC Cables</option>
            <option value="Balance of System">Balance of System</option>
            <option value="Protection & Earthing">Protection & Earthing</option>
          </select>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/75 text-slate-600 font-semibold uppercase text-[11px] tracking-wider">
                <th className="py-3 px-4">Item & SKU</th>
                <th className="py-3 px-4">Category & Brand</th>
                <th className="py-3 px-4">Warehouse Bin</th>
                <th className="py-3 px-4 text-center">Current Stock</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Unit Price</th>
                <th className="py-3 px-4 text-center">Quick Adjust</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredInventory.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-slate-400">
                    No inventory items found.
                  </td>
                </tr>
              ) : (
                filteredInventory.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                    {/* Item & SKU */}
                    <td className="py-3.5 px-4">
                      <span className="font-bold text-slate-900 block text-sm">{item.name}</span>
                      <span className="font-mono text-[11px] font-semibold text-amber-700 bg-amber-50 px-1.5 py-0.2 rounded inline-block mt-0.5">
                        {item.itemCode}
                      </span>
                      <p className="text-[11px] text-slate-400 mt-1 max-w-xs truncate">
                        {item.specifications}
                      </p>
                    </td>

                    {/* Category & Brand */}
                    <td className="py-3.5 px-4">
                      <span className="font-semibold text-slate-800 block">{item.category}</span>
                      <span className="text-xs text-slate-500">{item.brand}</span>
                    </td>

                    {/* Warehouse Bin */}
                    <td className="py-3.5 px-4">
                      <span className="text-xs font-mono text-slate-600 bg-slate-100 px-2 py-1 rounded">
                        {item.locationRack}
                      </span>
                    </td>

                    {/* Current Stock */}
                    <td className="py-3.5 px-4 text-center">
                      <span className="text-base font-extrabold text-slate-900">
                        {item.currentStock.toLocaleString('en-IN')}
                      </span>
                      <span className="text-xs text-slate-500 ml-1">{item.unit}</span>
                      <span className="text-[10px] text-slate-400 block mt-0.5">
                        Min: {item.minStockAlert} {item.unit}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4">
                      <Badge
                        size="sm"
                        variant={
                          item.status === 'In Stock'
                            ? 'success'
                            : item.status === 'Low Stock'
                            ? 'danger'
                            : 'neutral'
                        }
                      >
                        {item.status}
                      </Badge>
                    </td>

                    {/* Unit Price */}
                    <td className="py-3.5 px-4 text-right">
                      <span className="font-bold text-slate-800">{formatINR(item.unitPrice)}</span>
                      <span className="text-[11px] text-slate-400 block">per {item.unit}</span>
                    </td>

                    {/* Quick Adjust */}
                    <td className="py-3.5 px-4 text-center">
                      <div className="inline-flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl">
                        <button
                          onClick={() => adjustStock(item.id, -10)}
                          disabled={item.currentStock <= 0}
                          className="w-7 h-7 rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-200 flex items-center justify-center font-bold text-xs disabled:opacity-40 transition-colors"
                          title="Reduce 10 units"
                        >
                          -10
                        </button>
                        <button
                          onClick={() => adjustStock(item.id, 10)}
                          className="w-7 h-7 rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-200 flex items-center justify-center font-bold text-xs transition-colors"
                          title="Add 10 units"
                        >
                          +10
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <AdjustStockModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />
    </div>
  );
};
