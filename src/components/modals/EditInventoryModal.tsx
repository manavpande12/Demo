"use client";

import React, { useState, useEffect } from "react";
import { Modal } from "../ui/modal";
import { Button } from "../ui/button";
import { usePlant } from "../../context/PlantContext";
import { InventoryCategory } from "../../types";

export function EditInventoryModal() {
  const {
    isEditInventoryModalOpen,
    setIsEditInventoryModalOpen,
    inventoryToEdit,
    setInventoryToEdit,
    updateInventoryItem,
  } = usePlant();

  const [name, setName] = useState("");
  const [category, setCategory] = useState<InventoryCategory>("Raw Materials");
  const [minStock, setMinStock] = useState(0);
  const [unit, setUnit] = useState<"Units" | "Pieces" | "Kg" | "Meters" | "Liters">("Pieces");
  const [location, setLocation] = useState("");
  const [unitCost, setUnitCost] = useState(0);

  useEffect(() => {
    if (inventoryToEdit) {
      setName(inventoryToEdit.name);
      setCategory(inventoryToEdit.category);
      setMinStock(inventoryToEdit.minStock);
      setUnit(inventoryToEdit.unit);
      setLocation(inventoryToEdit.location);
      setUnitCost(inventoryToEdit.unitCost);
    }
  }, [inventoryToEdit]);

  if (!inventoryToEdit) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateInventoryItem(inventoryToEdit.code, {
      name: name.trim(),
      category,
      minStock: Number(minStock),
      unit,
      location: location.trim(),
      unitCost: Number(unitCost),
    });
    setIsEditInventoryModalOpen(false);
    setInventoryToEdit(null);
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
      isOpen={isEditInventoryModalOpen}
      onClose={() => {
        setIsEditInventoryModalOpen(false);
        setInventoryToEdit(null);
      }}
      title={`Edit Material SKU: ${inventoryToEdit.code}`}
      description="Update specification, safety reorder limit, storage bay, and unit cost"
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs font-sans">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-slate-600 font-mono mb-1">SKU Code (Read Only)</label>
            <input
              type="text"
              disabled
              value={inventoryToEdit.code}
              className="w-full bg-slate-100 border border-slate-300 rounded-lg px-3 py-2 text-slate-500 font-mono font-bold cursor-not-allowed"
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
            <label className="block text-slate-600 font-mono mb-1">Safety Min Stock</label>
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

          <div>
            <label className="block text-slate-600 font-mono mb-1">Unit Cost (INR)</label>
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

        <div>
          <label className="block text-slate-600 font-mono mb-1">Warehouse Storage Location</label>
          <input
            type="text"
            required
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              setIsEditInventoryModalOpen(false);
              setInventoryToEdit(null);
            }}
            className="text-xs bg-white border-slate-300 text-slate-700 hover:bg-slate-50"
          >
            Cancel
          </Button>
          <Button type="submit" variant="primary" className="text-xs">
            Save SKU Details
          </Button>
        </div>
      </form>
    </Modal>
  );
}
