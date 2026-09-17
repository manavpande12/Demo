"use client";

import React, { useState } from "react";
import { Modal } from "../ui/modal";
import { Button } from "../ui/button";
import { usePlant } from "../../context/PlantContext";
import { PriorityLevel } from "../../types";

export function NewOrderModal() {
  const { isNewOrderModalOpen, setIsNewOrderModalOpen, machines, addOrder } = usePlant();

  const [product, setProduct] = useState("Motor Housing");
  const [machineCode, setMachineCode] = useState("CNC-101");
  const [plannedQty, setPlannedQty] = useState(1500);
  const [startTime, setStartTime] = useState("08:00");
  const [dueTime, setDueTime] = useState("16:00");
  const [priority, setPriority] = useState<PriorityLevel>("High");
  const [operator, setOperator] = useState("Ramesh Pawar");
  const [notes, setNotes] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const foundMachine = machines.find((m) => m.code === machineCode) || machines[0];

    addOrder({
      product,
      machineId: foundMachine.id,
      machineName: foundMachine.code,
      plannedQty: Number(plannedQty),
      producedQty: 0,
      rejectedQty: 0,
      status: "In Progress",
      startTime,
      dueTime,
      priority,
      operator,
      batchNumber: `BAT-${product.substring(0, 2).toUpperCase()}-2026-09X`,
      materialCodes: ["CST-AL-101", "SEAL-KIT-HYD"],
      cycleTimeSec: 30,
      notes,
    });

    setIsNewOrderModalOpen(false);
  };

  const productOptions = [
    "Motor Housing",
    "Gear Assembly",
    "Steel Bracket",
    "Aluminium Cover",
    "Shaft Assembly",
    "Control Panel",
    "Pump Housing",
    "Chassis Sub-frame",
  ];

  return (
    <Modal
      isOpen={isNewOrderModalOpen}
      onClose={() => setIsNewOrderModalOpen(false)}
      title="Create New Production Order"
      description="Queue a new manufacturing batch on the shop floor routing table"
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs font-sans">
        <div>
          <label className="block text-slate-600 font-mono mb-1">Product Specification</label>
          <select
            value={product}
            onChange={(e) => setProduct(e.target.value)}
            className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            {productOptions.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-slate-600 font-mono mb-1">Assigned Machine</label>
            <select
              value={machineCode}
              onChange={(e) => setMachineCode(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-800 font-mono focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              {machines.map((m) => (
                <option key={m.code} value={m.code}>
                  {m.code} ({m.department.split(" ")[0]})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-slate-600 font-mono mb-1">Planned Quantity</label>
            <input
              type="number"
              min={1}
              required
              value={plannedQty}
              onChange={(e) => setPlannedQty(Number(e.target.value))}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-800 font-mono focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-slate-600 font-mono mb-1">Start Window</label>
            <input
              type="text"
              required
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-800 font-mono focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-slate-600 font-mono mb-1">Due Deadline</label>
            <input
              type="text"
              required
              value={dueTime}
              onChange={(e) => setDueTime(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-800 font-mono focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-slate-600 font-mono mb-1">Priority</label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as PriorityLevel)}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-800 font-mono focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
              <option value="Urgent">Urgent</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-slate-600 font-mono mb-1">Assigned Lead Operator</label>
          <input
            type="text"
            required
            value={operator}
            onChange={(e) => setOperator(e.target.value)}
            className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-slate-600 font-mono mb-1">Production Notes & Tolerances</label>
          <textarea
            rows={2}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Special fixture setup, cutting fluid requirements..."
            className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
          <Button
            type="button"
            variant="outline"
            onClick={() => setIsNewOrderModalOpen(false)}
            className="bg-white border-slate-300 text-slate-700 hover:bg-slate-50"
          >
            Cancel
          </Button>
          <Button type="submit" variant="primary">
            Launch Work Order
          </Button>
        </div>
      </form>
    </Modal>
  );
}