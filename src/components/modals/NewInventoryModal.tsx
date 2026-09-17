"use client";

import React, { useState } from "react";
import { Modal } from "../ui/modal";
import { Button } from "../ui/button";
import { usePlant } from "../../context/PlantContext";
import { InventoryCategory } from "../../types";

export function NewInventoryModal() {
  const { isNewInventoryModalOpen, setIsNewInventoryModalOpen, addInventoryItem } = usePlant();

  const [code, setCode] = useState("STL-PLT-501");
  const [name, setName] = useState("Cold Rolled Steel Plate 12mm");
  const [category, setCategory] = useState<InventoryCategory>("Raw Materials");
  const [currentStock, setCurrentStock] = useState(250);
  const [minStock, setMinStock] = useState(80);
  const [unit, setUnit] = useState<"Units" | "Pieces" | "Kg" | "Meters" | "Liters">("Pieces");
  const [location, setLocation] = useState("Bay A - Rack 08");
  const [unitCost, setUnitCost] = useState(1450);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const stock = Number(currentStock);
    const min = Number(minStock);
    const status = stock <= 0 ? "Out of Stock" : stock <= min ? "Low Stock" : "Healthy";

    addInventoryItem({
      code: code.trim().toUpperCase(),
      name: name.trim(),
      category,
      currentStock: stock,
      minStock: min,
      unit,
      location: location.trim(),
      unitCost: Number(unitCost),
      status,
      lastRestocked: "17 Sep 2026",
      usedInOrders: [],
      transactions: [
        {
          id: "tx-" + Date.now(),
          date: "17 Sep",
          type: "Inward",
          qty: stock,
          reference: "Initial catalog inward receipt",
          operator: "Inventory Controller",
        },
      ],
    });

    setIsNewInventoryModalOpen(false);
  };

  const categories: InventoryCategory[] = [
    "Raw Materials",
    "Castings",
    "Bearings & Fasteners",
    "Electrical",
    "Consumables",
    "Finished Goods",
  ];

  return (
    <Modal
      isOpen={isNewInventoryModalOpen}
      onClose={() => setIsNewInventoryModalOpen(false)}
      title="Add New Inventory Material / Part"
      description="Register a raw material SKU, purchased part, or consumable item into warehouse stock"
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs font-sans">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-slate-600 font-mono mb-1">Material SKU Code</label>
            <input
              type="text"
              required
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 font-mono font-bold focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-slate-600 font-mono mb-1">Inventory Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as InventoryCategory)}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-slate-600 font-mono mb-1">Material Name & Specification</label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-slate-600 font-mono mb-1">Initial On-Hand Stock</label>
            <input
              type="number"
              min={0}
              required
              value={currentStock}
              onChange={(e) => setCurrentStock(Number(e.target.value))}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 font-mono focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-slate-600 font-mono mb-1">Safety Min Stock Limit</label>
            <input
              type="number"
              min={0}
              required
              value={minStock}
              onChange={(e) => setMinStock(Number(e.target.value))}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 font-mono focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-slate-600 font-mono mb-1">Unit of Measure</label>
            <select
              value={unit}
              onChange={(e) => setUnit(e.target.value as any)}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-800 font-mono focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="Pieces">Pieces</option>
              <option value="Units">Units</option>
              <option value="Kg">Kg</option>
              <option value="Meters">Meters</option>
              <option value="Liters">Liters</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-slate-600 font-mono mb-1">Warehouse Storage Bay / Rack</label>
            <input
              type="text"
              required
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-slate-600 font-mono mb-1">Unit Purchase Cost (INR)</label>
            <input
              type="number"
              min={1}
              required
              value={unitCost}
              onChange={(e) => setUnitCost(Number(e.target.value))}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 font-mono focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
          <Button
            type="button"
            variant="outline"
            onClick={() => setIsNewInventoryModalOpen(false)}
            className="text-xs bg-white border-slate-300 text-slate-700 hover:bg-slate-50"
          >
            Cancel
          </Button>
          <Button type="submit" variant="primary" className="text-xs">
            Register Material SKU
          </Button>
        </div>
      </form>
    </Modal>
  );
}
