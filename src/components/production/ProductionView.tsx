"use client";

import React, { useState } from "react";
import {
  Layers,
  Plus,
  Filter,
  Search,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Play,
  Pause,
  ChevronRight,
  TrendingUp,
  Download,
  Trash2,
} from "lucide-react";
import { usePlant } from "../../context/PlantContext";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { downloadCsv } from "../../utils/exportCsv";

export function ProductionView() {
  const {
    orders,
    machines,
    setSelectedOrder,
    setIsNewOrderModalOpen,
    updateOrderStatus,
    deleteOrder,
    openDeleteConfirm,
    showToast,
  } = usePlant();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatusFilter, setSelectedStatusFilter] = useState("All");
  const [selectedMachineFilter, setSelectedMachineFilter] = useState("All");

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.product.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.batchNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.machineName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      selectedStatusFilter === "All" || order.status === selectedStatusFilter;

    const matchesMachine =
      selectedMachineFilter === "All" || order.machineName === selectedMachineFilter;

    return matchesSearch && matchesStatus && matchesMachine;
  });

  const totalPlanned = orders.reduce((sum, o) => sum + o.plannedQty, 0);
  const totalProduced = orders.reduce((sum, o) => sum + o.producedQty, 0);
  const totalRejected = orders.reduce((sum, o) => sum + o.rejectedQty, 0);
  const activeOrdersCount = orders.filter((o) => o.status === "In Progress").length;

  const uniqueMachines = Array.from(new Set(orders.map((o) => o.machineName)));

  const handleExport = () => {
    const headers = [
      "Order ID",
      "Product",
      "Batch Number",
      "Machine",
      "Planned Qty",
      "Produced Qty",
      "Rejected Qty",
      "Status",
      "Priority",
      "Start Time",
      "Due Time",
      "Operator",
    ];
    const rows = filteredOrders.map((o) => [
      o.id,
      o.product,
      o.batchNumber,
      o.machineName,
      o.plannedQty,
      o.producedQty,
      o.rejectedQty,
      o.status,
      o.priority,
      o.startTime,
      o.dueTime,
      o.operator,
    ]);
    downloadCsv(`MFGFlow_Production_Orders_${new Date().toISOString().split("T")[0]}`, headers, rows);
    showToast({
      title: "Export Completed",
      description: `Exported ${filteredOrders.length} production orders to CSV.`,
      type: "success",
    });
  };

  const handleDeleteOrder = (e: React.MouseEvent, orderId: string, product: string, machine: string) => {
    e.stopPropagation();
    openDeleteConfirm({
      title: `Delete Production Order ${orderId}`,
      message: `Are you sure you want to remove ${product} (${orderId}) from the production queue? Assigned station ${machine} will be released.`,
      confirmLabel: "Delete Order",
      onConfirm: () => deleteOrder(orderId),
    });
  };

  const handleTogglePause = (e: React.MouseEvent, orderId: string, currentStatus: string) => {
    e.stopPropagation();
    if (currentStatus === "In Progress") {
      updateOrderStatus(orderId, "Paused");
    } else {
      updateOrderStatus(orderId, "In Progress");
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-blue-600" />
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">Production Operations & Batch Tracking</h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Real-time batch progress tracking, cycle times, machine assignments, and order queue controls
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={handleExport}
            className="text-xs bg-white border-slate-300 text-slate-700 hover:bg-slate-50"
          >
            <Download className="w-3.5 h-3.5" />
            Export CSV
          </Button>

          <Button
            size="sm"
            variant="primary"
            onClick={() => setIsNewOrderModalOpen(true)}
            className="text-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            New Production Order
          </Button>
        </div>
      </div>

      {/* Production KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="p-4 rounded-lg bg-white border border-slate-200 shadow-xs">
          <span className="text-[11px] font-mono text-slate-500 uppercase">Total Orders</span>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-slate-900">{orders.length}</span>
            <span className="text-xs text-blue-600 font-mono">({activeOrdersCount} Active)</span>
          </div>
        </div>

        <div className="p-4 rounded-lg bg-white border border-slate-200 shadow-xs">
          <span className="text-[11px] font-mono text-slate-500 uppercase">Total Planned</span>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-slate-900">
              {totalPlanned.toLocaleString()}
            </span>
            <span className="text-xs text-slate-500">Pcs</span>
          </div>
        </div>

        <div className="p-4 rounded-lg bg-white border border-slate-200 shadow-xs">
          <span className="text-[11px] font-mono text-slate-500 uppercase">Produced Output</span>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-emerald-700">
              {totalProduced.toLocaleString()}
            </span>
            <span className="text-xs text-emerald-600 font-mono">
              ({((totalProduced / Math.max(1, totalPlanned)) * 100).toFixed(1)}%)
            </span>
          </div>
        </div>

        <div className="p-4 rounded-lg bg-white border border-slate-200 shadow-xs">
          <span className="text-[11px] font-mono text-slate-500 uppercase">Scrap / Rejects</span>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-amber-700">
              {totalRejected.toLocaleString()}
            </span>
            <span className="text-xs text-slate-500">
              ({((totalRejected / Math.max(1, totalProduced)) * 100).toFixed(1)}%)
            </span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-white p-3 rounded-lg border border-slate-200 shadow-xs">
        <div className="flex items-center gap-2 flex-1">
          <div className="relative flex-1 max-w-sm">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search by Order ID, Product, or Batch..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-md pl-9 pr-3 py-1.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white"
            />
          </div>

          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="text-xs text-slate-500 hover:text-slate-900"
            >
              Clear
            </button>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <div className="flex items-center gap-1.5 text-xs text-slate-600 font-mono">
            <span>Status:</span>
            <select
              value={selectedStatusFilter}
              onChange={(e) => setSelectedStatusFilter(e.target.value)}
              className="bg-slate-50 border border-slate-300 rounded-md px-2.5 py-1 text-xs text-slate-800 font-semibold focus:outline-none cursor-pointer"
            >
              <option value="All">All Statuses</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
              <option value="Paused">Paused</option>
              <option value="Queued">Queued</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-slate-600 font-mono">
            <span>Machine:</span>
            <select
              value={selectedMachineFilter}
              onChange={(e) => setSelectedMachineFilter(e.target.value)}
              className="bg-slate-50 border border-slate-300 rounded-md px-2.5 py-1 text-xs text-slate-800 font-semibold focus:outline-none cursor-pointer"
            >
              <option value="All">All Machines</option>
              {uniqueMachines.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Production Orders Table */}
      <Card className="border-slate-200 bg-white shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse min-w-[840px]">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-slate-600 font-mono">
                <th className="py-3 px-4 font-semibold">Order ID</th>
                <th className="py-3 px-4 font-semibold">Product &amp; Batch</th>
                <th className="py-3 px-4 font-semibold">Machine</th>
                <th className="py-3 px-4 font-semibold text-right">Planned Qty</th>
                <th className="py-3 px-4 font-semibold text-right">Produced Qty</th>
                <th className="py-3 px-4 font-semibold text-right">Rejected</th>
                <th className="py-3 px-4 font-semibold min-w-[130px]">Progress</th>
                <th className="py-3 px-4 font-semibold">Status</th>
                <th className="py-3 px-4 font-semibold text-right font-mono">Start Time</th>
                <th className="py-3 px-4 font-semibold text-right font-mono">Due Time</th>
                <th className="py-3 px-4 font-semibold text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={11} className="py-12 text-center text-slate-500 font-sans">
                    No production orders match the selected filters.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => {
                  const progress = Math.min(
                    100,
                    Math.round((order.producedQty / order.plannedQty) * 100)
                  );

                  const assignedMachine = machines.find((m) => m.code === order.machineName);
                  const isMachineBroken = assignedMachine?.status === "breakdown";

                  const statusVariant =
                    order.status === "Completed"
                      ? "completed"
                      : order.status === "In Progress"
                      ? "inprogress"
                      : order.status === "Paused"
                      ? "warning"
                      : "idle";

                  return (
                    <tr
                      key={order.id}
                      onClick={() => setSelectedOrder(order)}
                      className="hover:bg-slate-50/80 transition-colors cursor-pointer group"
                    >
                      <td className="py-3 px-4 font-bold text-blue-700 group-hover:underline">
                        {order.id}
                      </td>
                      <td className="py-3 px-4 font-sans">
                        <p className="font-semibold text-slate-900">{order.product}</p>
                        <p className="text-[10px] text-slate-400 font-mono mt-0.5">
                          {order.batchNumber}
                        </p>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1.5">
                          <span className="bg-slate-100 px-2 py-0.5 rounded border border-slate-200 font-bold text-slate-800">
                            {order.machineName}
                          </span>
                          {isMachineBroken && (
                            <span
                              className="text-rose-600 font-bold text-[10px] flex items-center gap-0.5"
                              title="Machine in breakdown stoppage"
                            >
                              <AlertTriangle className="w-3 h-3" /> Stop
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-right text-slate-700 font-medium">
                        {order.plannedQty.toLocaleString()}
                      </td>
                      <td className="py-3 px-4 text-right font-bold text-emerald-700">
                        {order.producedQty.toLocaleString()}
                      </td>
                      <td className="py-3 px-4 text-right font-medium text-amber-700">
                        {order.rejectedQty}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden border border-slate-200">
                            <div
                              className={`h-full rounded-full transition-all ${
                                progress === 100
                                  ? "bg-emerald-600"
                                  : progress > 60
                                  ? "bg-blue-600"
                                  : "bg-amber-500"
                              }`}
                              style={{ width: `${progress}%` }}
                            />
                          </div>
                          <span className="text-[11px] text-slate-600 w-8 text-right shrink-0 font-bold">
                            {progress}%
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant={statusVariant} dot>
                          {order.status}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-right text-slate-500">
                        {order.startTime}
                      </td>
                      <td className="py-3 px-4 text-right text-slate-500">
                        {order.dueTime}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <div className="flex items-center justify-center gap-1">
                          {/* Quick Pause / Resume Action */}
                          {order.status !== "Completed" && (
                            <button
                              onClick={(e) => handleTogglePause(e, order.id, order.status)}
                              className={`p-1.5 rounded transition-colors ${
                                order.status === "In Progress"
                                  ? "text-amber-600 hover:bg-amber-50"
                                  : "text-emerald-600 hover:bg-emerald-50"
                              }`}
                              title={order.status === "In Progress" ? "Pause order" : "Resume order"}
                            >
                              {order.status === "In Progress" ? (
                                <Pause className="w-3.5 h-3.5" />
                              ) : (
                                <Play className="w-3.5 h-3.5" />
                              )}
                            </button>
                          )}

                          {/* Delete Order Action */}
                          <button
                            onClick={(e) => handleDeleteOrder(e, order.id, order.product, order.machineName)}
                            className="text-slate-400 hover:text-rose-600 p-1.5 rounded hover:bg-rose-50 transition-colors"
                            title="Delete production order"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>

                          {/* Open Details Drawer */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedOrder(order);
                            }}
                            className="text-slate-400 hover:text-blue-600 p-1.5 rounded hover:bg-slate-100 transition-colors"
                            title="View order details"
                          >
                            <ChevronRight className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}