"use client";

import React from "react";
import {
  FileSpreadsheet,
  Download,
  Eye,
  BarChart3,
  Calendar,
  Layers,
  Cpu,
  Clock,
  ShieldCheck,
  Package,
  Wrench,
  ChevronRight,
} from "lucide-react";
import { usePlant } from "../../context/PlantContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../ui/card";
import { Button } from "../ui/button";
import { downloadCsv } from "../../utils/exportCsv";
import { HOURLY_PRODUCTION, DOWNTIME_BY_REASON, QUALITY_TREND_7DAYS } from "../../data/mockData";

export function ReportsView() {
  const {
    openReportModal,
    orders,
    machines,
    downtime,
    inspections,
    inventory,
    maintenance,
    productionToday,
    oee,
    rejectionRate,
    inventoryValueLakhs,
    lowStockCount,
    showToast,
  } = usePlant();

  const runningMachines = machines.filter((m) => m.status === "running").length;
  const activeOrders = orders.filter((o) => o.status === "In Progress").length;
  const totalDowntimeMins = downtime.reduce((sum, d) => sum + d.durationMinutes, 0);

  const reportsList = [
    {
      id: "rep-1",
      title: "Daily Production Report",
      subtitle: "Hourly piece output, planned vs actual variance, batch status",
      icon: BarChart3,
      iconColor: "text-blue-600 bg-blue-50 border-blue-200",
      dataKey: "production",
      summary: `Total Output: ${productionToday.toLocaleString()} Units | 84.2% Quota Achievement | ${activeOrders} Active Batches`,
      exportAction: () => {
        const headers = ["Hour", "Actual Output (Units)", "Target Output (Units)", "Variance"];
        const rows = HOURLY_PRODUCTION.map((h) => [h.time, h.actual, h.target, h.variance]);
        downloadCsv("MFGFlow_Daily_Production_Report_17Sep2026", headers, rows);
      },
    },
    {
      id: "rep-2",
      title: "Machine Performance & OEE Report",
      subtitle: "Fleet availability, operational speeds, thermal and vibration indices",
      icon: Cpu,
      iconColor: "text-emerald-600 bg-emerald-50 border-emerald-200",
      dataKey: "machines",
      summary: `Fleet OEE: ${oee}% | Availability: 91.4% | ${runningMachines} of ${machines.length} Machines Running Nominal`,
      exportAction: () => {
        const headers = ["Machine Code", "Name", "Status", "OEE %", "Temp (C)", "Vibration (mm/s)", "RPM", "Runtime"];
        const rows = machines.map((m) => [
          m.code,
          m.name,
          m.status,
          m.oee,
          m.temperature,
          m.vibration,
          m.speedRpm,
          `${m.runtimeHours}h ${m.runtimeMinutes}m`,
        ]);
        downloadCsv("MFGFlow_Machine_Performance_OEE_17Sep2026", headers, rows);
      },
    },
    {
      id: "rep-3",
      title: "Downtime & Stoppage Analysis",
      subtitle: "Root cause Pareto breakdown, MTTR metrics, unresolved breakdowns",
      icon: Clock,
      iconColor: "text-rose-600 bg-rose-50 border-rose-200",
      dataKey: "downtime",
      summary: `Total Stoppages: ${Math.floor(totalDowntimeMins / 60)}h ${totalDowntimeMins % 60}m | ${downtime.length} Logged Incidents`,
      exportAction: () => {
        const headers = ["Incident ID", "Machine", "Duration (Mins)", "Reason", "Shift", "MTTR (Mins)", "Technician", "Status"];
        const rows = downtime.map((d) => [
          d.id,
          d.machineName,
          d.durationMinutes,
          d.reason,
          d.shift,
          d.mttrMinutes,
          d.technician,
          d.status,
        ]);
        downloadCsv("MFGFlow_Downtime_Analysis_17Sep2026", headers, rows);
      },
    },
    {
      id: "rep-4",
      title: "Quality & Rejection Report",
      subtitle: "First Pass Yield (FPY), dimensional defect Pareto, CMM sign-offs",
      icon: ShieldCheck,
      iconColor: "text-amber-600 bg-amber-50 border-amber-200",
      dataKey: "quality",
      summary: `FPY: 96.8% | Rejection Rate: ${rejectionRate}% | ${inspections.length} Audit Inspections Recorded`,
      exportAction: () => {
        const headers = ["Inspection ID", "Product", "Batch", "Sample Qty", "Accepted", "Rejected", "Defect Type", "Inspector", "Status"];
        const rows = inspections.map((i) => [
          i.id,
          i.product,
          i.batch,
          i.sampleQty,
          i.acceptedQty,
          i.rejectedQty,
          i.defectType,
          i.inspector,
          i.status,
        ]);
        downloadCsv("MFGFlow_Quality_Audit_Report_17Sep2026", headers, rows);
      },
    },
    {
      id: "rep-5",
      title: "Inventory Valuation & Stock Report",
      subtitle: "Raw material stocks, reorder buffers, stock turnover value",
      icon: Package,
      iconColor: "text-indigo-600 bg-indigo-50 border-indigo-200",
      dataKey: "inventory",
      summary: `Stock Value: INR ${inventoryValueLakhs} Lakhs | ${lowStockCount} Low Stock Warnings | ${inventory.length} SKUs`,
      exportAction: () => {
        const headers = ["Material Code", "Name", "Category", "Current Stock", "Min Stock", "Unit", "Unit Cost (INR)", "Valuation (INR)"];
        const rows = inventory.map((i) => [
          i.code,
          i.name,
          i.category,
          i.currentStock,
          i.minStock,
          i.unit,
          i.unitCost,
          i.currentStock * i.unitCost,
        ]);
        downloadCsv("MFGFlow_Inventory_Valuation_17Sep2026", headers, rows);
      },
    },
    {
      id: "rep-6",
      title: "Maintenance & PM Audit Report",
      subtitle: "Preventive maintenance schedules, checklist completion, technician hours",
      icon: Wrench,
      iconColor: "text-purple-600 bg-purple-50 border-purple-200",
      dataKey: "maintenance",
      summary: `${maintenance.length} Active PM Work Orders | Checklist Verification Complete`,
      exportAction: () => {
        const headers = ["Work Order", "Machine", "Type", "Scheduled Date", "Technician", "Priority", "Status", "Duration (Hrs)"];
        const rows = maintenance.map((m) => [
          m.id,
          m.machineName,
          m.type,
          m.scheduledDate,
          m.technician,
          m.priority,
          m.status,
          m.durationHours,
        ]);
        downloadCsv("MFGFlow_Maintenance_PM_Audit_17Sep2026", headers, rows);
      },
    },
    {
      id: "rep-7",
      title: "Shift Handover Summary Report",
      subtitle: "Shift A operational log for oncoming Shift B supervisor and plant manager",
      icon: Layers,
      iconColor: "text-sky-600 bg-sky-50 border-sky-200",
      dataKey: "shift",
      summary: `Shift: A Shift (06:00-14:00) | Handover lead: Ramesh Pawar | Pending WO: Press-202 repair`,
      exportAction: () => {
        const headers = ["Shift Metric", "Shift A Value", "Shift B Target", "Status / Notes"];
        const rows = [
          ["Shift Duration", "06:00 - 14:00", "14:00 - 22:00", "Handover completed on time"],
          ["Gross Production", `${productionToday} Units`, "9,500 Units", "84.2% of target"],
          ["Active Breakdowns", "Press-202 (Ram Cylinder)", "None planned", "Technician Vikram Patil on-site"],
          ["Critical Shortages", "ADC12 Aluminium Casting", "Delivery scheduled 16:30", "Buffer low"],
          ["Quality FPY", "96.8%", "97.0%", "Nominal"],
        ];
        downloadCsv("MFGFlow_Shift_A_Handover_17Sep2026", headers, rows);
      },
    },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5 text-blue-600" />
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">Plant Reports & Analytics</h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Standard manufacturing regulatory audit reports, shift summaries, and CSV data exports
          </p>
        </div>
      </div>

      {/* Report Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {reportsList.map((report) => {
          const Icon = report.icon;

          return (
            <Card
              key={report.id}
              className="border-slate-200 bg-white hover:border-blue-400 transition-all shadow-xs flex flex-col justify-between"
            >
              <CardContent className="p-5 space-y-4">
                <div className="flex items-start gap-3">
                  <div className={`p-2.5 rounded-xl border shrink-0 ${report.iconColor}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 font-sans">{report.title}</h3>
                    <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                      {report.subtitle}
                    </p>
                  </div>
                </div>

                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/80 font-mono text-[11px] text-slate-700">
                  {report.summary}
                </div>

                <div className="pt-2 flex items-center justify-between gap-2 border-t border-slate-100">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() =>
                      openReportModal({
                        title: report.title,
                        category: "Plant Operational Audit",
                        summary: report.summary,
                        dataKey: report.dataKey,
                      })
                    }
                    className="flex-1 text-xs bg-white border-slate-300 text-slate-700 hover:bg-slate-50"
                  >
                    <Eye className="w-3.5 h-3.5 text-slate-500" />
                    Preview
                  </Button>

                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => {
                      report.exportAction();
                      showToast({
                        title: "Export Started",
                        description: `Downloading ${report.title} as CSV.`,
                        type: "success",
                      });
                    }}
                    className="flex-1 text-xs"
                  >
                    <Download className="w-3.5 h-3.5 text-blue-600" />
                    Export CSV
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}