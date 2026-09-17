"use client";

import React, { useState } from "react";
import { Modal } from "../ui/modal";
import { Button } from "../ui/button";
import { usePlant } from "../../context/PlantContext";
import { MachineStatus } from "../../types";

export function NewMachineModal() {
  const { isNewMachineModalOpen, setIsNewMachineModalOpen, addMachine } = usePlant();

  const [code, setCode] = useState("CNC-105");
  const [name, setName] = useState("5-Axis High Precision VMC");
  const [type, setType] = useState<"CNC" | "Press" | "Assembly" | "Welding">("CNC");
  const [department, setDepartment] = useState("Machining Bay 1");
  const [model, setModel] = useState("DMG MORI DMU 50");
  const [year, setYear] = useState(2024);
  const [operator, setOperator] = useState("Suresh Mane");
  const [location, setLocation] = useState("Bay 1 - Station 05");
  const [status, setStatus] = useState<MachineStatus>("idle");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addMachine({
      code: code.trim().toUpperCase(),
      name: name.trim(),
      type,
      department,
      model,
      year: Number(year),
      operator: operator.trim(),
      location,
      status,
      temperature: 42,
      vibration: 0.8,
      speedRpm: status === "running" ? 1800 : 0,
      runtimeHours: 0,
      runtimeMinutes: 0,
      oee: 88,
      productionCount: 0,
      availability: 95,
      performance: 92,
      quality: 98,
      lastMaintenance: "17 Sep 2026",
    });
    setIsNewMachineModalOpen(false);
  };

  return (
    <Modal
      isOpen={isNewMachineModalOpen}
      onClose={() => setIsNewMachineModalOpen(false)}
      title="Commission New Machine Asset"
      description="Register a new industrial CNC, stamping press, or assembly cell into the plant fleet"
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs font-sans">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-slate-600 font-mono mb-1">Asset Code (e.g. CNC-105)</label>
            <input
              type="text"
              required
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 font-mono font-bold focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-slate-600 font-mono mb-1">Machine Class / Type</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as any)}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-800 font-mono focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="CNC">CNC Machining</option>
              <option value="Press">Stamping Press</option>
              <option value="Assembly">Assembly Cell</option>
              <option value="Welding">Welding Robot</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-slate-600 font-mono mb-1">Machine Description / Name</label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-slate-600 font-mono mb-1">Plant Department / Bay</label>
            <select
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="Machining Bay 1">Machining Bay 1</option>
              <option value="Press Shop">Press Shop</option>
              <option value="Assembly Wing">Assembly Wing</option>
              <option value="Fabrication Bay">Fabrication Bay</option>
            </select>
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
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-slate-600 font-mono mb-1">Make & Model</label>
            <input
              type="text"
              required
              value={model}
              onChange={(e) => setModel(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-slate-600 font-mono mb-1">Year</label>
            <input
              type="number"
              min={2000}
              max={2030}
              required
              value={year}
              onChange={(e) => setYear(Number(e.target.value))}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-800 font-mono focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-slate-600 font-mono mb-1">Initial Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as MachineStatus)}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-800 font-mono focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="idle">Idle (Standby)</option>
              <option value="running">Running (Online)</option>
            </select>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
          <Button
            type="button"
            variant="outline"
            onClick={() => setIsNewMachineModalOpen(false)}
            className="text-xs bg-white border-slate-300 text-slate-700 hover:bg-slate-50"
          >
            Cancel
          </Button>
          <Button type="submit" variant="primary" className="text-xs">
            Commission Asset
          </Button>
        </div>
      </form>
    </Modal>
  );
}
