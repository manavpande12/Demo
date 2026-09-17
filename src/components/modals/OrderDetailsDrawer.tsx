"use client";

import React, { useState, useEffect } from "react";
import { Drawer } from "../ui/drawer";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { usePlant } from "../../context/PlantContext";
import { OrderStatus } from "../../types";
import {
  Boxes,
  Cpu,
  Clock,
  User,
  ShieldAlert,
  ShieldCheck,
  CheckCircle2,
  Play,
  Pause,
  Layers,
  Package,
  ChevronRight,
  Trash2,
} from "lucide-react";

export function OrderDetailsDrawer() {
  const {
    selectedOrder,
    setSelectedOrder,
    updateOrderStatus,
    deleteOrder,
    openDeleteConfirm,
    machines,
    setSelectedMachine,
    inventory,
    setActiveTab,
  } = usePlant();

  const [optimisticStatus, setOptimisticStatus] = useState<OrderStatus | null>(null);

  useEffect(() => {
    if (selectedOrder) {
      setOptimisticStatus(selectedOrder.status);
    }
  }, [selectedOrder?.id, selectedOrder?.status]);

  if (!selectedOrder) return null;

  const currentStatus = optimisticStatus || selectedOrder.status;

  const progress = Math.min(
    100,
    Math.round((selectedOrder.producedQty / selectedOrder.plannedQty) * 100)
  );

  const statusVariant =
    currentStatus === "Completed"
      ? "completed"
      : currentStatus === "In Progress"
      ? "inprogress"
      : currentStatus === "Paused"
      ? "warning"
      : "idle";

  const targetMachine = machines.find(
    (m) => m.id === selectedOrder.machineId || m.code === selectedOrder.machineName
  );

  const handleStatusChange = (newStatus: OrderStatus) => {
    setOptimisticStatus(newStatus);
    updateOrderStatus(selectedOrder.id, newStatus);
  };

  const handleDelete = () => {
    openDeleteConfirm({
      title: `Delete Production Order ${selectedOrder.id}`,
      message: `Are you sure you want to remove ${selectedOrder.product} (${selectedOrder.id}) from the active shop floor queue? This will release machine ${selectedOrder.machineName}.`,
      confirmLabel: "Delete Order",
      onConfirm: () => {
        deleteOrder(selectedOrder.id);
        setSelectedOrder(null);
      },
    });
  };

  return (
    <Drawer
      isOpen={!!selectedOrder}
      onClose={() => setSelectedOrder(null)}
      title={`Work Order ${selectedOrder.id}`}
      subtitle={`Product: ${selectedOrder.product}`}
      width="lg"
    >
      <div className="space-y-6 text-xs font-sans">
        {/* Status & Priority Ribbon */}
        <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-200">
          <div className="flex items-center gap-2">
            <span className="text-slate-500 font-mono">Current Status:</span>
            <Badge variant={statusVariant} dot>
              {currentStatus}
            </Badge>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-slate-500 font-mono">Priority:</span>
            <span
              className={`px-2 py-0.5 rounded-md font-mono font-bold text-[11px] ${
                selectedOrder.priority === "Urgent"
                  ? "bg-rose-50 text-rose-700 border border-rose-200"
                  : selectedOrder.priority === "High"
                  ? "bg-amber-50 text-amber-700 border border-amber-200"
                  : "bg-slate-100 text-slate-700 border border-slate-200"
              }`}
            >
              {selectedOrder.priority}
            </span>
          </div>
        </div>

        {/* Output Progress Gauge */}
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between font-mono">
            <span className="text-slate-600">Batch Output Completion:</span>
            <span className="text-slate-900 font-bold text-sm">{progress}%</span>
          </div>

          <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${
                progress === 100 ? "bg-emerald-500" : "bg-blue-600"
              }`}
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="grid grid-cols-3 gap-2 pt-2 text-center font-mono">
            <div className="p-2 rounded-lg bg-slate-50 border border-slate-200">
              <p className="text-slate-500 text-[10px] uppercase">Planned</p>
              <p className="font-bold text-slate-800 text-sm mt-0.5">
                {selectedOrder.plannedQty.toLocaleString()}
              </p>
            </div>
            <div className="p-2 rounded-lg bg-slate-50 border border-slate-200">
              <p className="text-slate-500 text-[10px] uppercase">Produced</p>
              <p className="font-bold text-emerald-600 text-sm mt-0.5">
                {selectedOrder.producedQty.toLocaleString()}
              </p>
            </div>
            <div className="p-2 rounded-lg bg-slate-50 border border-slate-200">
              <p className="text-slate-500 text-[10px] uppercase">Rejects</p>
              <p className="font-bold text-rose-600 text-sm mt-0.5">
                {selectedOrder.rejectedQty.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        {/* Interrelated Module Connections */}
        <div className="space-y-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200">
          <span className="text-[10px] font-mono uppercase text-slate-500 font-semibold block">
            Interrelated Module Routing & Allocation
          </span>

          {/* Linked Machine */}
          <div className="flex items-center justify-between p-2.5 rounded-lg bg-white border border-slate-200">
            <div className="flex items-center gap-2">
              <Cpu className="w-4 h-4 text-blue-600" />
              <div>
                <p className="font-bold text-slate-800 font-mono">{selectedOrder.machineName}</p>
                <p className="text-[11px] text-slate-500">
                  {targetMachine ? `${targetMachine.department} • ${targetMachine.status}` : "Routing Station"}
                </p>
              </div>
            </div>
            {targetMachine && (
              <Button
                size="xs"
                variant="outline"
                onClick={() => {
                  setSelectedOrder(null);
                  setSelectedMachine(targetMachine);
                }}
                className="bg-white border-slate-300 text-blue-600 hover:bg-slate-50"
              >
                Inspect Machine &rarr;
              </Button>
            )}
          </div>

          {/* Linked Materials in Inventory */}
          {selectedOrder.materialCodes && selectedOrder.materialCodes.length > 0 && (
            <div className="p-2.5 rounded-lg bg-white border border-slate-200 space-y-1.5">
              <div className="flex items-center justify-between text-slate-500 text-[11px]">
                <span className="flex items-center gap-1 font-mono">
                  <Package className="w-3.5 h-3.5 text-amber-600" />
                  Allocated Raw Materials (Inventory)
                </span>
                <button
                  onClick={() => {
                    setSelectedOrder(null);
                    setActiveTab("inventory");
                  }}
                  className="text-blue-600 hover:underline text-[10px] font-semibold"
                >
                  View Inventory &rarr;
                </button>
              </div>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {selectedOrder.materialCodes.map((code) => {
                  const invItem = inventory.find((i) => i.code === code);
                  return (
                    <span
                      key={code}
                      className="px-2 py-0.5 rounded text-[11px] font-mono bg-slate-100 text-slate-700 border border-slate-200 flex items-center gap-1"
                    >
                      <span className="font-bold">{code}</span>
                      {invItem && (
                        <span className="text-slate-500">({invItem.currentStock} {invItem.unit})</span>
                      )}
                    </span>
                  );
                })}
              </div>
            </div>
          )}

          {/* Linked Quality Inspection */}
          <div className="flex items-center justify-between p-2.5 rounded-lg bg-white border border-slate-200">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <div>
                <p className="font-bold text-slate-800 font-mono">{selectedOrder.batchNumber}</p>
                <p className="text-[11px] text-slate-500">
                  {selectedOrder.inspectionId ? `Audit Record: ${selectedOrder.inspectionId}` : "CMM Batch Verified"}
                </p>
              </div>
            </div>
            <Button
              size="xs"
              variant="outline"
              onClick={() => {
                setSelectedOrder(null);
                setActiveTab("quality");
              }}
              className="bg-white border-slate-300 text-emerald-600 hover:bg-slate-50"
            >
              Quality Log &rarr;
            </Button>
          </div>
        </div>

        {/* Schedule & Operational Details */}
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs space-y-3 font-mono">
          <p className="text-slate-500 uppercase text-[10px] tracking-wider font-semibold">
            Execution Timestamps & Parameters
          </p>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <span className="text-slate-400 block text-[10px]">Start Window:</span>
              <span className="text-slate-800 font-bold">{selectedOrder.startTime}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">Target Due Time:</span>
              <span className="text-slate-800 font-bold">{selectedOrder.dueTime}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">Assigned Operator:</span>
              <span className="text-slate-800 font-sans font-medium">{selectedOrder.operator}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">Cycle Time Benchmark:</span>
              <span className="text-slate-800 font-bold">{selectedOrder.cycleTimeSec}s / piece</span>
            </div>
          </div>

          {selectedOrder.notes && (
            <div className="pt-2 border-t border-slate-100 text-slate-600 font-sans text-xs">
              <span className="font-mono text-slate-400 text-[10px] block">Shop Floor Routing Notes:</span>
              {selectedOrder.notes}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="pt-2 space-y-2 border-t border-slate-200">
          <div className="flex items-center gap-2">
            {currentStatus !== "In Progress" && currentStatus !== "Completed" && (
              <Button
                size="sm"
                variant="primary"
                onClick={() => handleStatusChange("In Progress")}
                className="flex-1 text-xs"
              >
                <Play className="w-3.5 h-3.5 mr-1" />
                Resume Production
              </Button>
            )}

            {currentStatus === "In Progress" && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleStatusChange("Paused")}
                className="flex-1 text-xs bg-white border-slate-300 text-slate-700 hover:bg-slate-50"
              >
                <Pause className="w-3.5 h-3.5 mr-1 text-amber-600" />
                Pause Batch
              </Button>
            )}

            {currentStatus !== "Completed" && (
              <Button
                size="sm"
                variant="success"
                onClick={() => handleStatusChange("Completed")}
                className="flex-1 text-xs"
              >
                <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                Mark Completed
              </Button>
            )}
          </div>

          {/* Delete Action */}
          <Button
            size="sm"
            variant="outline"
            onClick={handleDelete}
            className="w-full text-xs bg-rose-50/60 border-rose-200 text-rose-700 hover:bg-rose-100 hover:border-rose-300"
          >
            <Trash2 className="w-3.5 h-3.5 mr-1.5" />
            Delete Production Order
          </Button>
        </div>
      </div>
    </Drawer>
  );
}