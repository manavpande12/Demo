"use client";

import React, { useState } from "react";
import {
  Package,
  AlertTriangle,
  AlertOctagon,
  Search,
  Download,
  Plus,
  ArrowRight,
  TrendingDown,
  Layers,
  ChevronRight,
  Boxes,
  Edit3,
  Edit2,
  Trash2,
} from "lucide-react";
import { usePlant } from "../../context/PlantContext";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { downloadCsv } from "../../utils/exportCsv";

export function InventoryView() {
  const {
    inventory,
    lowStockCount,
    outOfStockCount,
    inventoryValueLakhs,
    setSelectedInventory,
    setSelectedOrder,
    orders,
    setActiveTab,
    setIsAdjustStockModalOpen,
    setStockItemToAdjust,
    setIsNewInventoryModalOpen,
    setIsEditInventoryModalOpen,
    setInventoryToEdit,
    deleteInventoryItem,
    openDeleteConfirm,
    showToast,
  } = usePlant();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [stockStatusFilter, setStockStatusFilter] = useState<string>("All");

  const categories = [
    "All",
    "Raw Materials",
    "Castings",
    "Bearings & Fasteners",
    "Electrical",
    "Consumables",
    "Finished Goods",
  ];

  const filteredItems = inventory.filter((item) => {
    const matchesSearch =
      item.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.location.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCat =
      selectedCategory === "All" || item.category === selectedCategory;

    const matchesStatus =
      stockStatusFilter === "All" || item.status === stockStatusFilter;

    return matchesSearch && matchesCat && matchesStatus;
  });

  const handleExport = () => {
    const headers = [
      "Material Code",
      "Material Name",
      "Category",
      "Current Stock",
      "Minimum Stock",
      "Unit",
      "Storage Location",
      "Status",
      "Unit Cost (INR)",
      "Total Value (INR)",
      "Linked Orders",
      "Last Restocked",
    ];
    const rows = filteredItems.map((i) => [
      i.code,
      i.name,
      i.category,
      i.currentStock,
      i.minStock,
      i.unit,
      i.location,
      i.status,
      i.unitCost,
      i.currentStock * i.unitCost,
      (i.usedInOrders || []).join(", ") || "None",
      i.lastRestocked,
    ]);
    downloadCsv(`MFGFlow_Inventory_Stock_${new Date().toISOString().split("T")[0]}`, headers, rows);
    showToast({
      title: "Export Completed",
      description: `Exported ${filteredItems.length} inventory items to CSV.`,
      type: "success",
    });
  };

  const handleEditItem = (e: React.MouseEvent, item: any) => {
    e.stopPropagation();
    setInventoryToEdit(item);
    setIsEditInventoryModalOpen(true);
  };

  const handleDeleteItem = (e: React.MouseEvent, item: any) => {
    e.stopPropagation();
    openDeleteConfirm({
      title: `Delete Material SKU: ${item.code}`,
      message: `Are you sure you want to discontinue and delete ${item.name} (${item.code}) from warehouse records? Current stock balance: ${item.currentStock} ${item.unit}.`,
      confirmLabel: "Delete SKU",
      onConfirm: () => deleteInventoryItem(item.code),
    });
  };

  const handleAdjustStock = (e: React.MouseEvent, item: any) => {
    e.stopPropagation();
    setStockItemToAdjust(item);
    setIsAdjustStockModalOpen(true);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <Package className="w-5 h-5 text-amber-600" />
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">Material & Parts Inventory</h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Raw materials, components, consumables and WIP stock valuation across central bays with full SKU management
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            size="sm"
            variant="primary"
            onClick={() => setIsNewInventoryModalOpen(true)}
            className="text-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Material
          </Button>

          <Button
            size="sm"
            variant="outline"
            onClick={handleExport}
            className="text-xs bg-white border-slate-300 text-slate-700 hover:bg-slate-50"
          >
            <Download className="w-3.5 h-3.5" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* Top Inventory KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-xs">
          <span className="text-[11px] font-mono text-slate-500 uppercase tracking-wider">Total Tracked Items</span>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-slate-900">{inventory.length}</span>
            <span className="text-xs text-slate-500 font-sans">SKUs</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Across 6 warehouse zones</p>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-xs">
          <span className="text-[11px] font-mono text-amber-600 uppercase tracking-wider">Low Stock Alerts</span>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-amber-600">{lowStockCount}</span>
            <span className="text-xs text-slate-500 font-sans">SKUs</span>
          </div>
          <p className="text-[11px] text-amber-600 font-mono mt-1">Below safety stock limit</p>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-xs">
          <span className="text-[11px] font-mono text-rose-600 uppercase tracking-wider">Critical Out of Stock</span>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-rose-600">{outOfStockCount}</span>
            <span className="text-xs text-slate-500 font-sans">SKUs</span>
          </div>
          <p className="text-[11px] text-rose-600 font-mono mt-1">Affecting active assembly runs</p>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-xs">
          <span className="text-[11px] font-mono text-emerald-600 uppercase tracking-wider">Total Stock Valuation</span>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-emerald-600">
              &#8377;{inventoryValueLakhs}L
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Avg turnaround: 12.4 days</p>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 border-b border-slate-200">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
              selectedCategory === cat
                ? "bg-blue-600 text-white font-semibold shadow-xs"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Search & Stock Filter Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3 rounded-xl border border-slate-200 shadow-xs">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search material code, name, location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-50 border border-slate-300 rounded-md pl-9 pr-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="text-slate-500">Stock Status:</span>
          <select
            value={stockStatusFilter}
            onChange={(e) => setStockStatusFilter(e.target.value)}
            className="bg-slate-50 border border-slate-300 rounded-md px-2.5 py-1 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="All">All Items</option>
            <option value="Healthy">Healthy Stock</option>
            <option value="Low Stock">Low Stock Alert</option>
            <option value="Out of Stock">Out of Stock</option>
          </select>
        </div>
      </div>

      {/* Inventory Table */}
      <Card className="border-slate-200 bg-white shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse min-w-[900px]">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-slate-500 font-mono">
                <th className="py-3 px-4 font-semibold">Material Code</th>
                <th className="py-3 px-4 font-semibold">Material Name</th>
                <th className="py-3 px-4 font-semibold">Category</th>
                <th className="py-3 px-4 font-semibold">Used in Orders</th>
                <th className="py-3 px-4 font-semibold text-right">Current Stock</th>
                <th className="py-3 px-4 font-semibold text-right">Min Stock</th>
                <th className="py-3 px-4 font-semibold">Location</th>
                <th className="py-3 px-4 font-semibold">Status</th>
                <th className="py-3 px-4 font-semibold text-right">Unit Cost</th>
                <th className="py-3 px-4 font-semibold text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono">
              {filteredItems.map((item) => {
                const statusVariant =
                  item.status === "Healthy"
                    ? "running"
                    : item.status === "Low Stock"
                    ? "warning"
                    : "breakdown";

                return (
                  <tr
                    key={item.code}
                    onClick={() => setSelectedInventory(item)}
                    className="hover:bg-slate-50/80 transition-colors cursor-pointer group"
                  >
                    <td className="py-3 px-4 font-bold text-blue-600 group-hover:underline">
                      {item.code}
                    </td>
                    <td className="py-3 px-4 font-sans font-medium text-slate-900">
                      {item.name}
                    </td>
                    <td className="py-3 px-4 text-slate-500 text-[11px]">
                      {item.category}
                    </td>
                    <td className="py-3 px-4">
                      {item.usedInOrders && item.usedInOrders.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {item.usedInOrders.map((ordId) => (
                            <button
                              key={ordId}
                              onClick={(e) => {
                                e.stopPropagation();
                                const ord = orders.find((o) => o.id === ordId);
                                if (ord) setSelectedOrder(ord);
                                else setActiveTab("production");
                              }}
                              className="px-1.5 py-0.5 rounded text-[10px] bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100 font-semibold"
                              title="View production order"
                            >
                              {ordId}
                            </button>
                          ))}
                        </div>
                      ) : (
                        <span className="text-slate-400 text-[11px]">Buffer stock</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right font-bold text-slate-800">
                      <span
                        className={
                          item.currentStock === 0
                            ? "text-rose-600"
                            : item.currentStock <= item.minStock
                            ? "text-amber-600"
                            : "text-slate-900"
                        }
                      >
                        {item.currentStock.toLocaleString()} {item.unit}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right text-slate-500">
                      {item.minStock.toLocaleString()} {item.unit}
                    </td>
                    <td className="py-3 px-4 text-slate-700">
                      <span className="px-1.5 py-0.5 rounded bg-slate-100 border border-slate-200 text-[11px]">
                        {item.location}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant={statusVariant} dot>
                        {item.status}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-right text-slate-700 font-sans">
                      &#8377;{item.unitCost.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center gap-1">
                        {/* Adjust Stock */}
                        <Button
                          size="xs"
                          variant="outline"
                          onClick={(e) => handleAdjustStock(e, item)}
                          className="text-xs bg-white border-slate-300 text-slate-700 hover:bg-slate-50"
                          title="Adjust stock count"
                        >
                          <Edit3 className="w-3 h-3" />
                        </Button>

                        {/* Edit Item Details */}
                        <button
                          onClick={(e) => handleEditItem(e, item)}
                          className="p-1 rounded text-slate-400 hover:text-blue-600 hover:bg-slate-100 transition-colors"
                          title="Edit material details"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>

                        {/* Delete Item */}
                        <button
                          onClick={(e) => handleDeleteItem(e, item)}
                          className="p-1 rounded text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                          title="Delete material SKU"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}