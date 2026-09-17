"use client";

import React, { useState } from "react";
import { Modal } from "../ui/modal";
import { Button } from "../ui/button";
import { usePlant } from "../../context/PlantContext";
import { DowntimeReason } from "../../types";

export function LogDowntimeModal() {
  const {
    isLogDowntimeModalOpen,
    setIsLogDowntimeModalOpen,
    machines,
    addDowntimeIncident,
    selectedShift,
  } = usePlant();

  const [machineCode, setMachineCode] = useState("CNC-104");
  const [durationMinutes, setDurationMinutes] = useState(45);
  const [reason, setReason] = useState<DowntimeReason>("Mechanical");
  const [technician, setTechnician] = useState("Vikram Patil");
  const [notes, setNotes] = useState("Tool holder vibration trip detected. Realigning turret spindle.");
  const [actionTaken, setActionTaken] = useState("Inspected bearing play and retightened collet.");
  const [status, setStatus] = useState<"Resolved" | "Open" | "Under Investigation">("Open");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const foundMachine = machines.find((m) => m.code === machineCode) || machines[0];

    addDowntimeIncident({
      machineId: foundMachine.id,
      machineName: foundMachine.code,
      durationMinutes: Number(durationMinutes),
      reason,
      shift: selectedShift,
      date: "17 Sep 2026",
      time: new Date().toTimeString().substring(0, 5),
      mttrMinutes: Math.round(Number(durationMinutes) * 0.8),
      actionTaken,
      status,
      technician,
      notes,
    });

    setIsLogDowntimeModalOpen(false);
  };

  return (
    <Modal
      isOpen={isLogDowntimeModalOpen}
      onClose={() => setIsLogDowntimeModalOpen(false)}
      title="Log Downtime / Breakdown Incident"
      description="Record an unexpected machine stoppage, setup overrun, or tooling failure"
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs font-sans">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-slate-600 font-mono mb-1">Affected Machine</label>
            <select
              value={machineCode}
              onChange={(e) => setMachineCode(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-800 font-mono focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              {machines.map((m) => (
                <option key={m.code} value={m.code}>
                  {m.code} ({m.type})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-slate-600 font-mono mb-1">Stoppage Duration (Mins)</label>
            <input
              type="number"
              min={1}
              required
              value={durationMinutes}
              onChange={(e) => setDurationMinutes(Number(e.target.value))}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-800 font-mono focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-slate-600 font-mono mb-1">Reason Category</label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value as DowntimeReason)}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-800 font-mono focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="Mechanical">Mechanical</option>
              <option value="Electrical">Electrical</option>
              <option value="Material Shortage">Material Shortage</option>
              <option value="Setup">Setup</option>
              <option value="Operator">Operator</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-600 font-mono mb-1">Initial Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as any)}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-800 font-mono focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="Open">Open (Breakdown active)</option>
              <option value="Under Investigation">Under Investigation</option>
              <option value="Resolved">Resolved (Cleared)</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-slate-600 font-mono mb-1">Attending Maintenance Technician</label>
          <input
            type="text"
            required
            value={technician}
            onChange={(e) => setTechnician(e.target.value)}
            className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-slate-600 font-mono mb-1">Root Cause Symptoms & Observation</label>
          <textarea
            rows={2}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-slate-600 font-mono mb-1">Corrective Action Taken</label>
          <textarea
            rows={2}
            value={actionTaken}
            onChange={(e) => setActionTaken(e.target.value)}
            className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
          <Button
            type="button"
            variant="outline"
            onClick={() => setIsLogDowntimeModalOpen(false)}
            className="bg-white border-slate-300 text-slate-700 hover:bg-slate-50"
          >
            Cancel
          </Button>
          <Button type="submit" variant="danger">
            Record Incident
          </Button>
        </div>
      </form>
    </Modal>
  );
}