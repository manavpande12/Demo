"use client";

import React, { useState, useEffect } from "react";
import { Modal } from "../ui/modal";
import { Button } from "../ui/button";
import { usePlant } from "../../context/PlantContext";

export function EditMachineModal() {
  const {
    isEditMachineModalOpen,
    setIsEditMachineModalOpen,
    machineToEdit,
    setMachineToEdit,
    updateMachine,
  } = usePlant();

  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [department, setDepartment] = useState("Machining Bay 1");
  const [operator, setOperator] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState(2024);
  const [location, setLocation] = useState("");
  const [oee, setOee] = useState(85);

  useEffect(() => {
    if (machineToEdit) {
      setCode(machineToEdit.code);
      setName(machineToEdit.name);
      setDepartment(machineToEdit.department);
      setOperator(machineToEdit.operator);
      setModel(machineToEdit.model);
      setYear(machineToEdit.year);
      setLocation(machineToEdit.location);
      setOee(machineToEdit.oee);
    }
  }, [machineToEdit]);

  if (!machineToEdit) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateMachine(machineToEdit.id, {
      code: code.trim().toUpperCase(),
      name: name.trim(),
      department,
      operator: operator.trim(),
      model,
      year: Number(year),
      location,
      oee: Number(oee),
    });
    setIsEditMachineModalOpen(false);
    setMachineToEdit(null);
  };

  return (
    <Modal
      isOpen={isEditMachineModalOpen}
      onClose={() => {
        setIsEditMachineModalOpen(false);
        setMachineToEdit(null);
      }}
      title={`Edit Machine: ${machineToEdit.code}`}
      description="Modify machine configuration, assigned operator, and routing department"
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs font-sans">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-slate-600 font-mono mb-1">Asset Code</label>
            <input
              type="text"
              required
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 font-mono font-bold focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-slate-600 font-mono mb-1">Target OEE Benchmark (%)</label>
            <input
              type="number"
              min={1}
              max={100}
              required
              value={oee}
              onChange={(e) => setOee(Number(e.target.value))}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 font-mono focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-slate-600 font-mono mb-1">Machine Name / Station</label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-slate-600 font-mono mb-1">Department</label>
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
            <label className="block text-slate-600 font-mono mb-1">Assigned Operator</label>
            <input
              type="text"
              required
              value={operator}
              onChange={(e) => setOperator(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-slate-600 font-mono mb-1">Model</label>
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
            <label className="block text-slate-600 font-mono mb-1">Location</label>
            <input
              type="text"
              required
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              setIsEditMachineModalOpen(false);
              setMachineToEdit(null);
            }}
            className="text-xs bg-white border-slate-300 text-slate-700 hover:bg-slate-50"
          >
            Cancel
          </Button>
          <Button type="submit" variant="primary" className="text-xs">
            Save Specifications
          </Button>
        </div>
      </form>
    </Modal>
  );
}
