"use client";

import React, { useState } from "react";
import { Modal } from "../ui/modal";
import { Button } from "../ui/button";
import { usePlant } from "../../context/PlantContext";
import { MaintenanceType, PriorityLevel } from "../../types";

export function ScheduleMaintenanceModal() {
  const {
    isScheduleMaintenanceModalOpen,
    setIsScheduleMaintenanceModalOpen,
    machines,
    addMaintenanceOrder,
  } = usePlant();

  const [machineCode, setMachineCode] = useState("CNC-102");
  const [type, setType] = useState<MaintenanceType>("Preventive");
  const [scheduledDate, setScheduledDate] = useState("18 Sep 2026");
  const [technician, setTechnician] = useState("Rajesh Sharma");
  const [priority, setPriority] = useState<PriorityLevel>("High");
  const [description, setDescription] = useState("Quarterly spindle alignment, guide rail greasing, and coolant filter wash.");
  const [durationHours, setDurationHours] = useState(2.5);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const foundMachine = machines.find((m) => m.code === machineCode) || machines[0];

    addMaintenanceOrder({
      machineId: foundMachine.id,
      machineName: foundMachine.code,
      type,
      scheduledDate,
      technician,
      priority,
      status: "Scheduled",
      description,
      durationHours: Number(durationHours),
      checklist: [
        { task: "Check hydraulic fluid levels & pressure", completed: false },
        { task: "Lubricate linear axes and bearings", completed: false },
        { task: "Verify safety limit switches & interlocks", completed: false },
        { task: "Spindle vibration test run", completed: false },
      ],
    });

    setIsScheduleMaintenanceModalOpen(false);
  };

  return (
    <Modal
      isOpen={isScheduleMaintenanceModalOpen}
      onClose={() => setIsScheduleMaintenanceModalOpen(false)}
      title="Schedule Machine Maintenance"
      description="Create a work order for preventive, corrective, or predictive servicing"
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs font-sans">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-slate-600 font-mono mb-1">Target Machine</label>
            <select
              value={machineCode}
              onChange={(e) => setMachineCode(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-800 font-mono focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              {machines.map((m) => (
                <option key={m.code} value={m.code}>
                  {m.code} ({m.name.split(" ")[0]})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-slate-600 font-mono mb-1">Maintenance Type</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as MaintenanceType)}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-800 font-mono focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="Preventive">Preventive (PM)</option>
              <option value="Corrective">Corrective</option>
              <option value="Predictive">Predictive (PdM)</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-slate-600 font-mono mb-1">Assigned Technician</label>
            <input
              type="text"
              required
              value={technician}
              onChange={(e) => setTechnician(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-slate-600 font-mono mb-1">Scheduled Date</label>
            <input
              type="text"
              required
              value={scheduledDate}
              onChange={(e) => setScheduledDate(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-800 font-mono focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-slate-600 font-mono mb-1">Priority Level</label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as PriorityLevel)}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-800 font-mono focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
              <option value="Critical">Critical</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-600 font-mono mb-1">Est. Duration (Hours)</label>
            <input
              type="number"
              step="0.5"
              min="0.5"
              required
              value={durationHours}
              onChange={(e) => setDurationHours(Number(e.target.value))}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-800 font-mono focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-slate-600 font-mono mb-1">Maintenance Scope & Procedure</label>
          <textarea
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
          <Button
            type="button"
            variant="outline"
            onClick={() => setIsScheduleMaintenanceModalOpen(false)}
            className="bg-white border-slate-300 text-slate-700 hover:bg-slate-50"
          >
            Cancel
          </Button>
          <Button type="submit" variant="primary">
            Schedule Work Order
          </Button>
        </div>
      </form>
    </Modal>
  );
}