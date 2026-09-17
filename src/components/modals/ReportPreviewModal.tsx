"use client";

import React from "react";
import { Modal } from "../ui/modal";
import { Button } from "../ui/button";
import { usePlant } from "../../context/PlantContext";
import { Printer, Download, CheckCircle2, FileText, Factory } from "lucide-react";
import { downloadCsv } from "../../utils/exportCsv";
import { HOURLY_PRODUCTION, DOWNTIME_BY_REASON } from "../../data/mockData";

export function ReportPreviewModal() {
  const {
    reportModalData,
    closeReportModal,
    selectedPlant,
    selectedShift,
    productionToday,
    oee,
    machines,
    orders,
    downtime,
    inspections,
    inventory,
    maintenance,
  } = usePlant();

  if (!reportModalData) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleExport = () => {
    if (reportModalData.dataKey === "production") {
      const headers = ["Time Slot", "Actual Output (Units)", "Target Quota", "Variance"];
      const rows = HOURLY_PRODUCTION.map((h) => [h.time, h.actual, h.target, h.variance]);
      downloadCsv("MFGFlow_Production_Report", headers, rows);
    } else if (reportModalData.dataKey === "machines") {
      const headers = ["Machine Code", "Name", "Status", "OEE %", "Temp (C)", "RPM", "Runtime"];
      const rows = machines.map((m) => [m.code, m.name, m.status, m.oee, m.temperature, m.speedRpm, `${m.runtimeHours}h ${m.runtimeMinutes}m`]);
      downloadCsv("MFGFlow_Machine_Performance_Report", headers, rows);
    } else if (reportModalData.dataKey === "downtime") {
      const headers = ["ID", "Machine", "Duration (Mins)", "Reason", "Status", "Technician"];
      const rows = downtime.map((d) => [d.id, d.machineName, d.durationMinutes, d.reason, d.status, d.technician]);
      downloadCsv("MFGFlow_Downtime_Report", headers, rows);
    } else if (reportModalData.dataKey === "quality") {
      const headers = ["Inspection ID", "Product", "Batch", "Sample Qty", "Accepted", "Rejected", "Inspector"];
      const rows = inspections.map((i) => [i.id, i.product, i.batch, i.sampleQty, i.acceptedQty, i.rejectedQty, i.inspector]);
      downloadCsv("MFGFlow_Quality_Report", headers, rows);
    } else if (reportModalData.dataKey === "inventory") {
      const headers = ["Material Code", "Name", "Stock", "Min", "Unit", "Location", "Unit Cost"];
      const rows = inventory.map((i) => [i.code, i.name, i.currentStock, i.minStock, i.unit, i.location, i.unitCost]);
      downloadCsv("MFGFlow_Inventory_Report", headers, rows);
    } else if (reportModalData.dataKey === "maintenance") {
      const headers = ["WO ID", "Machine", "Type", "Technician", "Status", "Priority"];
      const rows = maintenance.map((m) => [m.id, m.machineName, m.type, m.technician, m.status, m.priority]);
      downloadCsv("MFGFlow_Maintenance_Report", headers, rows);
    } else {
      const headers = ["Shift Metric", "Value"];
      const rows = [
        ["Plant Unit", selectedPlant],
        ["Shift", selectedShift],
        ["Production Today", `${productionToday} Units`],
        ["Fleet OEE", `${oee}%`],
      ];
      downloadCsv("MFGFlow_Shift_Report", headers, rows);
    }
  };

  return (
    <Modal
      isOpen={!!reportModalData}
      onClose={closeReportModal}
      title={reportModalData.title}
      description={`Official Plant Record • Generated on 17 September 2026 • ${selectedPlant}`}
      maxWidth="4xl"
    >
      <div className="space-y-6 text-xs font-sans">
        {/* Printable Report Header */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-blue-100 text-blue-700 border border-blue-200">
              <Factory className="w-5 h-5" />
            </div>
            <div>
              <p className="font-bold text-sm text-slate-900 font-mono">MFGFlow Industrial Audit Record</p>
              <p className="text-slate-500 text-xs">{selectedPlant} &bull; {selectedShift}</p>
            </div>
          </div>
          <div className="text-left sm:text-right font-mono text-[11px] text-slate-500">
            <p>Report Date: <span className="text-slate-800 font-semibold">17-09-2026</span></p>
            <p>Status: <span className="text-emerald-600 font-bold">VERIFIED &bull; SIGNED</span></p>
          </div>
        </div>

        {/* Executive Summary */}
        <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-xs">
          <p className="text-[10px] font-mono uppercase text-slate-500 font-semibold mb-1">
            Executive Summary & KPI Snapshot
          </p>
          <p className="font-mono text-xs text-slate-800 font-medium">
            {reportModalData.summary}
          </p>
        </div>

        {/* Data Preview Table */}
        <div className="border border-slate-200 rounded-xl overflow-hidden shadow-xs">
          <div className="bg-slate-50 px-4 py-2.5 border-b border-slate-200 font-mono font-bold text-slate-700">
            Audit Data Sample
          </div>

          <div className="overflow-x-auto max-h-72">
            {reportModalData.dataKey === "production" && (
              <table className="w-full text-left font-mono text-xs">
                <thead className="bg-slate-100 text-slate-600 border-b border-slate-200">
                  <tr>
                    <th className="p-2.5">Time</th>
                    <th className="p-2.5 text-right">Actual Output</th>
                    <th className="p-2.5 text-right">Target Output</th>
                    <th className="p-2.5 text-right">Variance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {HOURLY_PRODUCTION.map((row) => (
                    <tr key={row.time} className="hover:bg-slate-50/80">
                      <td className="p-2.5 text-slate-800">{row.time}</td>
                      <td className="p-2.5 text-right font-bold text-blue-600">{row.actual}</td>
                      <td className="p-2.5 text-right text-slate-500">{row.target}</td>
                      <td className={`p-2.5 text-right font-bold ${row.variance >= 0 ? "text-emerald-600" : "text-rose-600"}`}>
                        {row.variance > 0 ? `+${row.variance}` : row.variance}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {reportModalData.dataKey === "machines" && (
              <table className="w-full text-left font-mono text-xs">
                <thead className="bg-slate-100 text-slate-600 border-b border-slate-200">
                  <tr>
                    <th className="p-2.5">Code</th>
                    <th className="p-2.5">Status</th>
                    <th className="p-2.5 text-right">OEE</th>
                    <th className="p-2.5 text-right">Temp</th>
                    <th className="p-2.5 text-right">Vibration</th>
                    <th className="p-2.5 text-right">Speed</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {machines.slice(0, 8).map((m) => (
                    <tr key={m.id} className="hover:bg-slate-50/80">
                      <td className="p-2.5 font-bold text-slate-800">{m.code}</td>
                      <td className="p-2.5 uppercase text-[11px] text-slate-600">{m.status}</td>
                      <td className="p-2.5 text-right font-bold text-emerald-600">{m.oee}%</td>
                      <td className="p-2.5 text-right text-slate-700">{m.temperature}&deg;C</td>
                      <td className="p-2.5 text-right text-slate-700">{m.vibration} mm/s</td>
                      <td className="p-2.5 text-right text-slate-700">{m.speedRpm} RPM</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {reportModalData.dataKey === "downtime" && (
              <table className="w-full text-left font-mono text-xs">
                <thead className="bg-slate-100 text-slate-600 border-b border-slate-200">
                  <tr>
                    <th className="p-2.5">ID</th>
                    <th className="p-2.5">Machine</th>
                    <th className="p-2.5 text-right">Duration</th>
                    <th className="p-2.5">Reason</th>
                    <th className="p-2.5">Technician</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {downtime.map((d) => (
                    <tr key={d.id} className="hover:bg-slate-50/80">
                      <td className="p-2.5 font-bold text-rose-600">{d.id}</td>
                      <td className="p-2.5 text-slate-800">{d.machineName}</td>
                      <td className="p-2.5 text-right font-bold text-rose-600">{d.durationMinutes}m</td>
                      <td className="p-2.5 text-slate-600">{d.reason}</td>
                      <td className="p-2.5 text-slate-700">{d.technician}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {reportModalData.dataKey !== "production" &&
              reportModalData.dataKey !== "machines" &&
              reportModalData.dataKey !== "downtime" && (
                <div className="p-4 text-center text-slate-500 font-mono">
                  Full tabular data prepared for ISO-9001 compliance audit export.
                </div>
              )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-3 border-t border-slate-200">
          <Button
            type="button"
            variant="outline"
            onClick={handlePrint}
            className="bg-white border-slate-300 text-slate-700 hover:bg-slate-50 text-xs"
          >
            <Printer className="w-3.5 h-3.5 mr-1" />
            Print Report
          </Button>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={closeReportModal}
              className="bg-white border-slate-300 text-slate-700 hover:bg-slate-50 text-xs"
            >
              Close
            </Button>
            <Button
              type="button"
              variant="primary"
              onClick={handleExport}
              className="text-xs"
            >
              <Download className="w-3.5 h-3.5 mr-1" />
              Download Official CSV
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
}