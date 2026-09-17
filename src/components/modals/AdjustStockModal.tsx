"use client";

import React, { useState, useEffect } from "react";
import { Modal } from "../ui/modal";
import { Drawer } from "../ui/drawer";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { usePlant, InventoryItem } from "../../context/PlantContext";
import { Package, Layers, ChevronRight, Edit3, ArrowUpRight, Edit2, Trash2 } from "lucide-react";

export function AdjustStockModal() {
  const {
    isAdjustStockModalOpen,
    setIsAdjustStockModalOpen,
    stockItemToAdjust,
    adjustInventoryStock,
  } = usePlant();

  const [newStockQty, setNewStockQty] = useState<number>(0);
  const [reason, setReason] = useState<string>("Cycle count discrepancy adjustment");

  useEffect(() => {
    if (stockItemToAdjust) {
      setNewStockQty(stockItemToAdjust.currentStock);
    }
  }, [stockItemToAdjust]);

  if (!stockItemToAdjust) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    adjustInventoryStock(stockItemToAdjust.code, Number(newStockQty), reason);
    setIsAdjustStockModalOpen(false);
  };

  return (
    <Modal
      isOpen={isAdjustStockModalOpen}
      onClose={() => setIsAdjustStockModalOpen(false)}
      title={`Adjust Stock: ${stockItemToAdjust.code}`}
      description={`Update current on-hand inventory count for ${stockItemToAdjust.name}`}
      maxWidth="sm"
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs font-sans">
        <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 font-mono text-slate-700">
          <div className="flex justify-between">
            <span className="text-slate-500">Current Recorded Stock:</span>
            <span className="font-bold text-slate-900">
              {stockItemToAdjust.currentStock} {stockItemToAdjust.unit}
            </span>
          </div>
          <div className="flex justify-between mt-1 text-[11px] text-slate-500">
            <span>Safety Threshold:</span>
            <span>
              {stockItemToAdjust.minStock} {stockItemToAdjust.unit}
            </span>
          </div>
        </div>

        <div>
          <label className="block text-slate-600 font-mono mb-1">
            New Verified Physical Stock ({stockItemToAdjust.unit})
          </label>
          <input
            type="number"
            min={0}
            required
            value={newStockQty}
            onChange={(e) => setNewStockQty(Number(e.target.value))}
            className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 font-mono focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm font-bold"
          />
        </div>

        <div>
          <label className="block text-slate-600 font-mono mb-1">Adjustment Reason</label>
          <select
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="Cycle count discrepancy adjustment">Cycle count discrepancy</option>
            <option value="Inward PO arrival delivery">Inward vendor PO arrival</option>
            <option value="Scrapped / Damaged in storage">Damaged / Quality reject</option>
            <option value="Inter-bay transfer reconciliation">Inter-bay transfer</option>
          </select>
        </div>

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
          <Button
            type="button"
            variant="outline"
            onClick={() => setIsAdjustStockModalOpen(false)}
            className="bg-white border-slate-300 text-slate-700 hover:bg-slate-50"
          >
            Cancel
          </Button>
          <Button type="submit" variant="primary">
            Apply Stock Adjustment
          </Button>
        </div>
      </form>
    </Modal>
  );
}

export function InventoryDetailDrawer() {
  const {
    selectedInventory,
    setSelectedInventory,
    setStockItemToAdjust,
    setIsAdjustStockModalOpen,
    orders,
    setSelectedOrder,
    setActiveTab,
    setInventoryToEdit,
    setIsEditInventoryModalOpen,
    openDeleteConfirm,
    deleteInventoryItem,
  } = usePlant();

  if (!selectedInventory) return null;

  const handleEdit = () => {
    if (!selectedInventory) return;
    const item = selectedInventory;
    setSelectedInventory(null);
    setInventoryToEdit(item);
    setIsEditInventoryModalOpen(true);
  };

  const handleDelete = () => {
    if (!selectedInventory) return;
    const item = selectedInventory;
    openDeleteConfirm({
      title: "Discontinue Material SKU",
      message: `Are you sure you want to permanently remove SKU ${item.code} (${item.name}) from the warehouse inventory catalog? This action will remove all stock records.`,
      confirmLabel: "Delete SKU",
      itemType: "SKU",
      itemName: `${item.code} - ${item.name}`,
      onConfirm: () => {
        deleteInventoryItem(item.code);
      },
    });
  };

  const statusVariant =
    selectedInventory.status === "Healthy"
      ? "running"
      : selectedInventory.status === "Low Stock"
      ? "warning"
      : "breakdown";

  const totalValuation = selectedInventory.currentStock * selectedInventory.unitCost;

  return (
    <Drawer
      isOpen={!!selectedInventory}
      onClose={() => setSelectedInventory(null)}
      title={`${selectedInventory.code} - ${selectedInventory.name}`}
      subtitle={`Category: ${selectedInventory.category} • Location: ${selectedInventory.location}`}
      width="md"
    >
      <div className="space-y-6 text-xs font-sans">
        {/* Status Ribbon */}
        <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-200">
          <div className="flex items-center gap-2">
            <span className="text-slate-500 font-mono">Stock Health:</span>
            <Badge variant={statusVariant} dot>
              {selectedInventory.status}
            </Badge>
          </div>
          <span className="font-mono text-slate-500 text-[11px]">
            Restocked: {selectedInventory.lastRestocked}
          </span>
        </div>

        {/* Quantities & Valuation Card */}
        <div className="grid grid-cols-2 gap-3 font-mono">
          <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-xs">
            <span className="text-slate-500 text-[10px] uppercase">Available Stock</span>
            <p className="text-xl font-bold text-slate-900 mt-1">
              {selectedInventory.currentStock.toLocaleString()} {selectedInventory.unit}
            </p>
            <span className="text-[10px] text-slate-400">Min safety: {selectedInventory.minStock} {selectedInventory.unit}</span>
          </div>

          <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-xs">
            <span className="text-slate-500 text-[10px] uppercase">Total Item Valuation</span>
            <p className="text-xl font-bold text-emerald-600 mt-1">
              &#8377;{totalValuation.toLocaleString()}
            </p>
            <span className="text-[10px] text-slate-400">&#8377;{selectedInventory.unitCost.toLocaleString()} / {selectedInventory.unit}</span>
          </div>
        </div>

        {/* Interrelated Production Orders */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-slate-800 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-blue-600" />
              Active Orders Consuming this SKU
            </span>
            <span className="text-[10px] font-mono text-slate-500">
              {(selectedInventory.usedInOrders || []).length} Orders
            </span>
          </div>

          {selectedInventory.usedInOrders && selectedInventory.usedInOrders.length > 0 ? (
            <div className="space-y-2">
              {selectedInventory.usedInOrders.map((ordId) => {
                const ord = orders.find((o) => o.id === ordId);
                return (
                  <div
                    key={ordId}
                    onClick={() => {
                      setSelectedInventory(null);
                      if (ord) setSelectedOrder(ord);
                      else setActiveTab("production");
                    }}
                    className="p-2.5 rounded-lg bg-white border border-slate-200 hover:border-blue-300 hover:bg-blue-50/40 cursor-pointer transition-all flex items-center justify-between"
                  >
                    <div>
                      <span className="font-mono font-bold text-blue-600">{ordId}</span>
                      <p className="text-slate-600 text-[11px] mt-0.5">
                        {ord ? ord.product : "Production Batch"}
                      </p>
                    </div>
                    <span className="text-blue-600 text-xs font-semibold flex items-center gap-1">
                      View <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-slate-500 text-[11px]">
              No active batches currently reserving this SKU. Stored as central buffer.
            </p>
          )}
        </div>

        {/* Material SKU Actions */}
        <div className="space-y-2 pt-2 border-t border-slate-200">
          <Button
            size="sm"
            variant="primary"
            onClick={() => {
              const item = selectedInventory;
              setSelectedInventory(null);
              setStockItemToAdjust(item);
              setIsAdjustStockModalOpen(true);
            }}
            className="w-full text-xs"
          >
            <Edit3 className="w-3.5 h-3.5 mr-1.5" />
            Adjust / Reconcile On-Hand Stock
          </Button>

          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={handleEdit}
              className="flex-1 text-xs bg-white border-slate-300 text-slate-700 hover:bg-slate-50"
            >
              <Edit2 className="w-3.5 h-3.5 mr-1.5" />
              Edit SKU Details
            </Button>

            <Button
              size="sm"
              variant="outline"
              onClick={handleDelete}
              className="flex-1 text-xs bg-rose-50/60 border-rose-200 text-rose-700 hover:bg-rose-100"
            >
              <Trash2 className="w-3.5 h-3.5 mr-1.5" />
              Delete SKU
            </Button>
          </div>
        </div>
      </div>
    </Drawer>
  );
}