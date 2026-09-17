"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from "react";
import {
  PlantId,
  ShiftId,
  Machine,
  ProductionOrder,
  PlanningItem,
  DowntimeIncident,
  QualityInspection,
  InventoryItem,
  MaintenanceWorkOrder,
  PlantAlert,
  SettingsState,
  OrderStatus,
  MachineStatus,
  PriorityLevel,
  MaintenanceStatus,
} from "../types";
import {
  INITIAL_MACHINES,
  INITIAL_ORDERS,
  INITIAL_PLANNING,
  INITIAL_DOWNTIME,
  INITIAL_INSPECTIONS,
  INITIAL_INVENTORY,
  INITIAL_MAINTENANCE,
  INITIAL_ALERTS,
  INITIAL_SETTINGS,
} from "../data/mockData";

export interface ToastItem {
  id: string;
  title: string;
  description?: string;
  type: "success" | "info" | "warning" | "error";
}

export type ViewTab =
  | "dashboard"
  | "production"
  | "planning"
  | "machines"
  | "downtime"
  | "quality"
  | "inventory"
  | "maintenance"
  | "reports"
  | "settings";

export type {
  InventoryItem,
  Machine,
  ProductionOrder,
  PlanningItem,
  DowntimeIncident,
  QualityInspection,
  MaintenanceWorkOrder,
  PlantAlert,
  SettingsState,
  OrderStatus,
  MachineStatus,
  PriorityLevel,
  MaintenanceStatus,
} from "../types";

export interface DeleteConfirmData {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  itemType?: string;
  itemName?: string;
  onConfirm: () => void;
}

interface PlantContextType {
  // Navigation & Globals
  activeTab: ViewTab;
  setActiveTab: (tab: ViewTab) => void;
  selectedPlant: PlantId;
  setSelectedPlant: (plant: PlantId) => void;
  selectedShift: ShiftId;
  setSelectedShift: (shift: ShiftId) => void;
  selectedDate: string;
  setSelectedDate: (date: string) => void;

  // Responsive Sidebar States
  isSidebarCollapsed: boolean;
  setIsSidebarCollapsed: (collapsed: boolean | ((prev: boolean) => boolean)) => void;
  isMobileSidebarOpen: boolean;
  setIsMobileSidebarOpen: (open: boolean) => void;

  // Live simulation
  isLiveSimulationActive: boolean;
  toggleLiveSimulation: () => void;
  lastTickTime: string;

  // Domain Data
  machines: Machine[];
  orders: ProductionOrder[];
  planning: PlanningItem[];
  downtime: DowntimeIncident[];
  inspections: QualityInspection[];
  inventory: InventoryItem[];
  maintenance: MaintenanceWorkOrder[];
  alerts: PlantAlert[];
  settings: SettingsState;

  // Computed KPIs
  productionToday: number;
  productionTarget: number;
  oee: number;
  oeeDiff: number;
  machineAvailability: number;
  rejectionRate: number;
  downtimeHours: number;
  downtimeMinutes: number;
  activeMachinesCount: number;
  totalMachinesCount: number;
  firstPassYield: number;
  totalInspectionsCount: number;
  totalDefectsCount: number;
  inventoryValueLakhs: number;
  lowStockCount: number;
  outOfStockCount: number;

  // Order Mutations
  addOrder: (order: Omit<ProductionOrder, "id">) => void;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  deleteOrder: (orderId: string) => void;

  // Machine Mutations (Full CRUD)
  addMachine: (machine: Omit<Machine, "id" | "events">) => void;
  updateMachine: (machineId: string, updates: Partial<Machine>) => void;
  deleteMachine: (machineId: string) => void;
  updateMachineStatus: (machineId: string, status: MachineStatus) => void;

  // Planning Mutations
  updatePlanningPriority: (planId: string, priority: PriorityLevel) => void;
  updatePlanningMachine: (planId: string, machineId: string) => void;
  updatePlanningStatus: (planId: string, status: "Scheduled" | "In Progress" | "Completed" | "Pending") => void;

  // Downtime & Quality
  addDowntimeIncident: (incident: Omit<DowntimeIncident, "id">) => void;
  resolveDowntimeIncident: (id: string, actionTaken: string) => void;
  addInspection: (inspection: Omit<QualityInspection, "id">) => void;

  // Inventory Mutations (Full CRUD)
  addInventoryItem: (item: InventoryItem) => void;
  updateInventoryItem: (code: string, updates: Partial<InventoryItem>) => void;
  deleteInventoryItem: (code: string) => void;
  adjustInventoryStock: (code: string, newQty: number, reason: string) => void;

  // Maintenance & Alerts
  addMaintenanceOrder: (order: Omit<MaintenanceWorkOrder, "id">) => void;
  toggleChecklistTask: (workOrderId: string, taskIndex: number) => void;
  updateMaintenanceStatus: (workOrderId: string, status: MaintenanceStatus) => void;
  dismissAlert: (id: string) => void;
  saveSettings: (newSettings: SettingsState) => void;

  // Drawers & Modals
  selectedOrder: ProductionOrder | null;
  setSelectedOrder: (order: ProductionOrder | null) => void;
  selectedMachine: Machine | null;
  setSelectedMachine: (machine: Machine | null) => void;
  selectedInventory: InventoryItem | null;
  setSelectedInventory: (item: InventoryItem | null) => void;

  isNewOrderModalOpen: boolean;
  setIsNewOrderModalOpen: (open: boolean) => void;
  isLogDowntimeModalOpen: boolean;
  setIsLogDowntimeModalOpen: (open: boolean) => void;
  isScheduleMaintenanceModalOpen: boolean;
  setIsScheduleMaintenanceModalOpen: (open: boolean) => void;
  isAdjustStockModalOpen: boolean;
  setIsAdjustStockModalOpen: (open: boolean) => void;
  stockItemToAdjust: InventoryItem | null;
  setStockItemToAdjust: (item: InventoryItem | null) => void;
  isGlobalSearchOpen: boolean;
  setIsGlobalSearchOpen: (open: boolean) => void;

  // Machine Add / Edit Modals
  isNewMachineModalOpen: boolean;
  setIsNewMachineModalOpen: (open: boolean) => void;
  isEditMachineModalOpen: boolean;
  setIsEditMachineModalOpen: (open: boolean) => void;
  machineToEdit: Machine | null;
  setMachineToEdit: (machine: Machine | null) => void;

  // Inventory Add / Edit Modals
  isNewInventoryModalOpen: boolean;
  setIsNewInventoryModalOpen: (open: boolean) => void;
  isEditInventoryModalOpen: boolean;
  setIsEditInventoryModalOpen: (open: boolean) => void;
  inventoryToEdit: InventoryItem | null;
  setInventoryToEdit: (item: InventoryItem | null) => void;

  // Confirmation Dialog
  deleteConfirmState: DeleteConfirmData | null;
  openDeleteConfirm: (data: Omit<DeleteConfirmData, "isOpen">) => void;
  closeDeleteConfirm: () => void;

  reportModalData: { title: string; category: string; summary: string; dataKey: string } | null;
  openReportModal: (data: { title: string; category: string; summary: string; dataKey: string }) => void;
  closeReportModal: () => void;

  // Toasts
  toasts: ToastItem[];
  showToast: (toast: Omit<ToastItem, "id">) => void;
  dismissToast: (id: string) => void;
}

const PlantContext = createContext<PlantContextType | undefined>(undefined);

export function PlantProvider({ children }: { children: React.ReactNode }) {
  // Navigation & Globals
  const [activeTab, setActiveTab] = useState<ViewTab>("dashboard");
  const [selectedPlant, setSelectedPlant] = useState<PlantId>("Mumbai Manufacturing Unit");
  const [selectedShift, setSelectedShift] = useState<ShiftId>("A Shift");
  const [selectedDate, setSelectedDate] = useState<string>("17 September 2026");

  // Responsive Sidebar States
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState<boolean>(false);

  // Live simulation toggle & clock
  const [isLiveSimulationActive, setIsLiveSimulationActive] = useState(true);
  const [lastTickTime, setLastTickTime] = useState("14:32:00");

  const toggleLiveSimulation = useCallback(() => {
    setIsLiveSimulationActive((prev) => !prev);
  }, []);

  // Domain state
  const [machines, setMachines] = useState<Machine[]>(INITIAL_MACHINES);
  const [orders, setOrders] = useState<ProductionOrder[]>(INITIAL_ORDERS);
  const [planning, setPlanning] = useState<PlanningItem[]>(INITIAL_PLANNING);
  const [downtime, setDowntime] = useState<DowntimeIncident[]>(INITIAL_DOWNTIME);
  const [inspections, setInspections] = useState<QualityInspection[]>(INITIAL_INSPECTIONS);
  const [inventory, setInventory] = useState<InventoryItem[]>(INITIAL_INVENTORY);
  const [maintenance, setMaintenance] = useState<MaintenanceWorkOrder[]>(INITIAL_MAINTENANCE);
  const [alerts, setAlerts] = useState<PlantAlert[]>(INITIAL_ALERTS);
  const [settings, setSettings] = useState<SettingsState>(INITIAL_SETTINGS);

  // Drawer and Modal States
  const [selectedOrder, setSelectedOrder] = useState<ProductionOrder | null>(null);
  const [selectedMachine, setSelectedMachine] = useState<Machine | null>(null);
  const [selectedInventory, setSelectedInventory] = useState<InventoryItem | null>(null);

  const [isNewOrderModalOpen, setIsNewOrderModalOpen] = useState(false);
  const [isLogDowntimeModalOpen, setIsLogDowntimeModalOpen] = useState(false);
  const [isScheduleMaintenanceModalOpen, setIsScheduleMaintenanceModalOpen] = useState(false);
  const [isAdjustStockModalOpen, setIsAdjustStockModalOpen] = useState(false);
  const [stockItemToAdjust, setStockItemToAdjust] = useState<InventoryItem | null>(null);
  const [isGlobalSearchOpen, setIsGlobalSearchOpen] = useState(false);

  // Machine Add/Edit States
  const [isNewMachineModalOpen, setIsNewMachineModalOpen] = useState(false);
  const [isEditMachineModalOpen, setIsEditMachineModalOpen] = useState(false);
  const [machineToEdit, setMachineToEdit] = useState<Machine | null>(null);

  // Inventory Add/Edit States
  const [isNewInventoryModalOpen, setIsNewInventoryModalOpen] = useState(false);
  const [isEditInventoryModalOpen, setIsEditInventoryModalOpen] = useState(false);
  const [inventoryToEdit, setInventoryToEdit] = useState<InventoryItem | null>(null);

  // Reusable Delete Confirmation
  const [deleteConfirmState, setDeleteConfirmState] = useState<DeleteConfirmData | null>(null);
  const openDeleteConfirm = useCallback((data: Omit<DeleteConfirmData, "isOpen">) => {
    setDeleteConfirmState({ ...data, isOpen: true });
  }, []);
  const closeDeleteConfirm = useCallback(() => {
    setDeleteConfirmState(null);
  }, []);

  const [reportModalData, setReportModalData] = useState<{
    title: string;
    category: string;
    summary: string;
    dataKey: string;
  } | null>(null);

  // Toasts
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const showToast = useCallback((toast: Omit<ToastItem, "id">) => {
    const id = "toast-" + Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { ...toast, id }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Live simulation tick interval
  useEffect(() => {
    if (!isLiveSimulationActive) return;

    const interval = setInterval(() => {
      const now = new Date();
      const timeStr = now.toTimeString().split(" ")[0];
      setLastTickTime(timeStr);

      const unitsInc = Math.floor(Math.random() * 3) + 1;
      setOrders((prev) =>
        prev.map((o) => {
          if (
            o.status === "In Progress" &&
            o.producedQty < o.plannedQty &&
            (o.id === "MO-10245" || o.id === "MO-10246")
          ) {
            const updated = {
              ...o,
              producedQty: o.producedQty + unitsInc,
            };
            setSelectedOrder((curr) => (curr && curr.id === o.id ? updated : curr));
            return updated;
          }
          return o;
        })
      );

      setMachines((prev) =>
        prev.map((m) => {
          if (m.status !== "running") return m;

          const tempDelta = (Math.random() - 0.5) * 0.6;
          const rpmDelta = Math.floor((Math.random() - 0.5) * 14);
          const vibeDelta = (Math.random() - 0.5) * 0.06;

          const newTemp = Math.round(Math.max(40, Math.min(84, m.temperature + tempDelta)));
          const newRpm = Math.max(900, Math.min(2200, m.speedRpm + rpmDelta));
          const newVibe = Number(Math.max(0.5, Math.min(4.5, m.vibration + vibeDelta)).toFixed(1));

          const updated = {
            ...m,
            temperature: newTemp,
            speedRpm: newRpm,
            vibration: newVibe,
            productionCount: m.productionCount + unitsInc,
          };
          setSelectedMachine((curr) => (curr && curr.id === m.id ? updated : curr));
          return updated;
        })
      );
    }, 6000);

    return () => clearInterval(interval);
  }, [isLiveSimulationActive]);

  // Derived KPIs
  const productionToday = useMemo(() => {
    return orders.reduce((sum, ord) => sum + ord.producedQty, 0);
  }, [orders]);

  const productionTarget = useMemo(() => {
    return orders.reduce((sum, ord) => sum + ord.plannedQty, 0);
  }, [orders]);

  const baseOee = 82.6;
  const simulatedOeeDrift = (productionToday % 5) * 0.2;
  const oee = Number((baseOee + simulatedOeeDrift).toFixed(1));
  const oeeDiff = 4.8;
  const machineAvailability = 91.4;

  const totalProduced = useMemo(() => orders.reduce((a, b) => a + b.producedQty, 0), [orders]);
  const totalRejected = useMemo(() => orders.reduce((a, b) => a + b.rejectedQty, 0), [orders]);
  const rejectionRate = Number(((totalRejected / Math.max(1, totalProduced)) * 100).toFixed(1));

  const activeDowntimeMinutes = useMemo(() => {
    return downtime.filter((d) => d.status !== "Resolved").reduce((a, b) => a + b.durationMinutes, 0);
  }, [downtime]);

  const downtimeHours = Math.floor(activeDowntimeMinutes / 60);
  const downtimeMinutes = activeDowntimeMinutes % 60;

  const totalMachinesCount = machines.length;
  const runningCountInState = machines.filter((m) => m.status === "running").length;
  const activeMachinesCount = runningCountInState;

  const firstPassYield = Number((100 - rejectionRate - 0.9).toFixed(1));
  const totalInspectionsCount = 1248;
  const totalDefectsCount = totalRejected;

  const inventoryValueLakhs = useMemo(() => {
    const totalVal = inventory.reduce((sum, item) => sum + item.currentStock * item.unitCost, 0);
    return Number((totalVal / 100000).toFixed(1));
  }, [inventory]);

  const lowStockCount = useMemo(
    () => inventory.filter((i) => i.status === "Low Stock").length,
    [inventory]
  );
  const outOfStockCount = useMemo(
    () => inventory.filter((i) => i.status === "Out of Stock").length,
    [inventory]
  );

  // ==========================================
  // Order Mutations
  // ==========================================
  const addOrder = useCallback(
    (order: Omit<ProductionOrder, "id">) => {
      const nextId = "MO-" + (10250 + orders.length + 1);
      const newOrder: ProductionOrder = { ...order, id: nextId };
      setOrders((prev) => [newOrder, ...prev]);

      const newPlan: PlanningItem = {
        id: "plan-" + (planning.length + 1),
        orderId: nextId,
        product: order.product,
        machineId: order.machineId,
        machineName: order.machineName,
        plannedQty: order.plannedQty,
        priority: order.priority,
        startDate: "17 Sep " + order.startTime,
        endDate: "17 Sep " + order.dueTime,
        shift: selectedShift,
        status: order.status === "In Progress" ? "In Progress" : "Scheduled",
        progressPercent: Math.round((order.producedQty / order.plannedQty) * 100),
        line: "Machining Bay 1",
      };
      setPlanning((prev) => [newPlan, ...prev]);

      setMachines((prev) =>
        prev.map((m) =>
          m.code === order.machineName
            ? { ...m, currentOrderId: nextId, currentOrderProduct: order.product }
            : m
        )
      );

      showToast({
        title: "Production Order Created",
        description: `Order ${nextId} (${order.product}) assigned to ${order.machineName}.`,
        type: "success",
      });
    },
    [orders.length, planning.length, selectedShift, showToast]
  );

  const updateOrderStatus = useCallback(
    (orderId: string, status: OrderStatus) => {
      // 1. Update in orders array
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status } : o))
      );

      // 2. Synchronously update selectedOrder for instant reactivity in drawer/modal
      setSelectedOrder((prev) =>
        prev && prev.id === orderId ? { ...prev, status } : prev
      );

      // 3. Synchronously update planning item
      setPlanning((prev) =>
        prev.map((p) =>
          p.orderId === orderId
            ? {
                ...p,
                status:
                  status === "In Progress"
                    ? "In Progress"
                    : status === "Completed"
                    ? "Completed"
                    : status === "Paused"
                    ? "Pending"
                    : "Scheduled",
                progressPercent: status === "Completed" ? 100 : p.progressPercent,
              }
            : p
        )
      );

      // If completed, trigger QA inspection record
      if (status === "Completed") {
        const ord = orders.find((o) => o.id === orderId);
        if (ord) {
          const newIns: QualityInspection = {
            id: "INS-" + (4820 + inspections.length + 1),
            orderId: ord.id,
            machineCode: ord.machineName,
            product: ord.product,
            batch: ord.batchNumber,
            sampleQty: Math.min(100, Math.round(ord.plannedQty * 0.1)),
            acceptedQty: Math.min(100, Math.round(ord.plannedQty * 0.1)) - 1,
            rejectedQty: 1,
            defectType: "None",
            inspector: "Nitin Bhor",
            status: "Passed",
            date: "17 Sep 2026",
            shift: selectedShift,
            notes: `Batch ${ord.batchNumber} 100% CMM pass.`,
          };
          setInspections((prev) => [newIns, ...prev]);
        }
      }

      showToast({
        title: "Order Status Updated",
        description: `Order ${orderId} shifted to ${status}.`,
        type: "info",
      });
    },
    [inspections.length, orders, selectedShift, showToast]
  );

  const deleteOrder = useCallback(
    (orderId: string) => {
      setOrders((prev) => prev.filter((o) => o.id !== orderId));
      setPlanning((prev) => prev.filter((p) => p.orderId !== orderId));
      setMachines((prev) =>
        prev.map((m) =>
          m.currentOrderId === orderId
            ? { ...m, currentOrderId: undefined, currentOrderProduct: undefined }
            : m
        )
      );
      setSelectedOrder((prev) => (prev?.id === orderId ? null : prev));
      showToast({
        title: "Order Removed",
        description: `Production order ${orderId} removed from queue.`,
        type: "warning",
      });
    },
    [showToast]
  );

  // ==========================================
  // Machine Mutations (Full CRUD)
  // ==========================================
  const addMachine = useCallback(
    (machineData: Omit<Machine, "id" | "events">) => {
      const nextId = "mach-" + (machines.length + 1);
      const newMachine: Machine = {
        ...machineData,
        id: nextId,
        events: [
          {
            id: "evt-" + Date.now(),
            time: new Date().toTimeString().substring(0, 5),
            type: "info",
            message: `Machine ${machineData.code} commissioned and added to plant fleet.`,
          },
        ],
      };
      setMachines((prev) => [newMachine, ...prev]);
      showToast({
        title: "Machine Commissioned",
        description: `${newMachine.code} (${newMachine.name}) added to ${newMachine.department}.`,
        type: "success",
      });
    },
    [machines.length, showToast]
  );

  const updateMachine = useCallback(
    (machineId: string, updates: Partial<Machine>) => {
      setMachines((prev) =>
        prev.map((m) => {
          if (m.id === machineId || m.code === machineId) {
            return { ...m, ...updates };
          }
          return m;
        })
      );
      setSelectedMachine((prev) =>
        prev && (prev.id === machineId || prev.code === machineId)
          ? { ...prev, ...updates }
          : prev
      );
      showToast({
        title: "Machine Updated",
        description: `Specifications for ${updates.code || machineId} updated.`,
        type: "info",
      });
    },
    [showToast]
  );

  const deleteMachine = useCallback(
    (machineId: string) => {
      let machineCode = machineId;
      setMachines((prev) => {
        const found = prev.find((m) => m.id === machineId || m.code === machineId);
        if (found) machineCode = found.code;
        return prev.filter((m) => m.id !== machineId && m.code !== machineId);
      });
      setSelectedMachine((prev) =>
        prev && (prev.id === machineId || prev.code === machineId) ? null : prev
      );
      showToast({
        title: "Machine Decommissioned",
        description: `Machine ${machineCode} decommissioned from fleet.`,
        type: "warning",
      });
    },
    [showToast]
  );

  const updateMachineStatus = useCallback(
    (machineId: string, status: MachineStatus) => {
      let targetMachineCode = "";

      setMachines((prev) =>
        prev.map((m) => {
          if (m.id === machineId || m.code === machineId) {
            targetMachineCode = m.code;
            const eventMsg = `Machine status transitioned to ${status.toUpperCase()} via Floor Console`;
            return {
              ...m,
              status,
              speedRpm: status === "running" ? 1800 : 0,
              events: [
                {
                  id: "evt-" + Date.now(),
                  time: new Date().toTimeString().substring(0, 5),
                  type: status === "breakdown" ? "error" : status === "running" ? "success" : "info",
                  message: eventMsg,
                },
                ...m.events,
              ],
            };
          }
          return m;
        })
      );

      // If breakdown, pause running order on this machine & raise alert
      if (status === "breakdown") {
        setOrders((prev) =>
          prev.map((o) => {
            if (o.machineName === targetMachineCode && o.status === "In Progress") {
              const updated = {
                ...o,
                status: "Paused" as OrderStatus,
                notes: `Automatically halted due to ${targetMachineCode} breakdown event.`,
              };
              setSelectedOrder((curr) => (curr && curr.id === o.id ? updated : curr));
              return updated;
            }
            return o;
          })
        );

        setAlerts((prev) => [
          {
            id: "alt-" + Date.now(),
            title: `${targetMachineCode} Breakdown`,
            description: `Emergency stoppage triggered on ${targetMachineCode}. Maintenance work order required.`,
            severity: "critical",
            timestamp: new Date().toTimeString().substring(0, 5),
            category: "Machine",
            read: false,
          },
          ...prev,
        ]);
      }

      showToast({
        title: "Machine Status Updated",
        description: `Machine ${machineId} set to ${status.toUpperCase()}.`,
        type: status === "breakdown" ? "error" : "info",
      });
    },
    [showToast]
  );

  // ==========================================
  // Planning Mutations
  // ==========================================
  const updatePlanningPriority = useCallback(
    (planId: string, priority: PriorityLevel) => {
      setPlanning((prev) =>
        prev.map((p) => {
          if (p.id === planId) {
            setOrders((ords) =>
              ords.map((o) => {
                if (o.id === p.orderId) {
                  const updated = { ...o, priority };
                  setSelectedOrder((curr) => (curr && curr.id === o.id ? updated : curr));
                  return updated;
                }
                return o;
              })
            );
            return { ...p, priority };
          }
          return p;
        })
      );
      showToast({
        title: "Priority Level Updated",
        description: `Task set to ${priority} priority.`,
        type: "info",
      });
    },
    [showToast]
  );

  const updatePlanningMachine = useCallback(
    (planId: string, machineId: string) => {
      const foundMachine = machines.find((m) => m.id === machineId || m.code === machineId);
      const machineName = foundMachine ? foundMachine.code : machineId;

      setPlanning((prev) =>
        prev.map((p) => {
          if (p.id === planId) {
            setOrders((ords) =>
              ords.map((o) => {
                if (o.id === p.orderId) {
                  const updated = { ...o, machineId, machineName };
                  setSelectedOrder((curr) => (curr && curr.id === o.id ? updated : curr));
                  return updated;
                }
                return o;
              })
            );
            return { ...p, machineId, machineName };
          }
          return p;
        })
      );

      showToast({
        title: "Machine Reassigned",
        description: `Task shifted to ${machineName}.`,
        type: "success",
      });
    },
    [machines, showToast]
  );

  const updatePlanningStatus = useCallback(
    (planId: string, status: "Scheduled" | "In Progress" | "Completed" | "Pending") => {
      let targetOrderId = "";
      const mappedOrderStatus: OrderStatus =
        status === "In Progress"
          ? "In Progress"
          : status === "Completed"
          ? "Completed"
          : status === "Pending"
          ? "Paused"
          : "Queued";

      setPlanning((prev) =>
        prev.map((p) => {
          if (p.id === planId) {
            targetOrderId = p.orderId;
            return {
              ...p,
              status,
              progressPercent: status === "Completed" ? 100 : p.progressPercent,
            };
          }
          return p;
        })
      );

      if (targetOrderId) {
        setOrders((ords) =>
          ords.map((o) => {
            if (o.id === targetOrderId) {
              const updated = { ...o, status: mappedOrderStatus };
              setSelectedOrder((curr) => (curr && curr.id === o.id ? updated : curr));
              return updated;
            }
            return o;
          })
        );
      }

      showToast({
        title: "Planning Schedule Updated",
        description: `Execution state shifted to ${status}.`,
        type: "info",
      });
    },
    [showToast]
  );

  // ==========================================
  // Downtime & Quality
  // ==========================================
  const addDowntimeIncident = useCallback(
    (incident: Omit<DowntimeIncident, "id">) => {
      const nextId = "DT-" + (800 + downtime.length + 1);
      const newInc: DowntimeIncident = { ...incident, id: nextId };
      setDowntime((prev) => [newInc, ...prev]);

      setMachines((prev) =>
        prev.map((m) =>
          m.code === incident.machineName
            ? { ...m, status: "breakdown", speedRpm: 0, activeDowntimeId: nextId }
            : m
        )
      );

      showToast({
        title: "Downtime Incident Logged",
        description: `${incident.reason} stoppage reported on ${incident.machineName}.`,
        type: "error",
      });
    },
    [downtime.length, showToast]
  );

  const resolveDowntimeIncident = useCallback(
    (id: string, actionTaken: string) => {
      let resolvedMachineId = "";
      setDowntime((prev) =>
        prev.map((d) => {
          if (d.id === id) {
            resolvedMachineId = d.machineId;
            return { ...d, status: "Resolved", actionTaken: actionTaken || d.actionTaken };
          }
          return d;
        })
      );

      if (resolvedMachineId) {
        setMachines((prev) =>
          prev.map((m) =>
            m.id === resolvedMachineId || m.code === resolvedMachineId
              ? { ...m, status: "running", speedRpm: 1800, activeDowntimeId: undefined }
              : m
          )
        );
      }

      showToast({
        title: "Downtime Stoppage Resolved",
        description: `Incident ${id} closed. Machine restored to operational state.`,
        type: "success",
      });
    },
    [showToast]
  );

  const addInspection = useCallback(
    (inspection: Omit<QualityInspection, "id">) => {
      const nextId = "INS-" + (4820 + inspections.length + 1);
      const newRecord: QualityInspection = { ...inspection, id: nextId };
      setInspections((prev) => [newRecord, ...prev]);
      showToast({
        title: "Inspection Logged",
        description: `${nextId} for ${inspection.product} recorded.`,
        type: inspection.status === "Rejected" ? "error" : "success",
      });
    },
    [inspections.length, showToast]
  );

  // ==========================================
  // Inventory Mutations (Full CRUD)
  // ==========================================
  const addInventoryItem = useCallback(
    (item: InventoryItem) => {
      setInventory((prev) => [item, ...prev]);
      showToast({
        title: "Material Added",
        description: `SKU ${item.code} (${item.name}) registered in warehouse.`,
        type: "success",
      });
    },
    [showToast]
  );

  const updateInventoryItem = useCallback(
    (code: string, updates: Partial<InventoryItem>) => {
      setInventory((prev) =>
        prev.map((item) => {
          if (item.code === code) {
            const updated = { ...item, ...updates };
            if (updates.currentStock !== undefined || updates.minStock !== undefined) {
              const stock = updates.currentStock !== undefined ? updates.currentStock : item.currentStock;
              const min = updates.minStock !== undefined ? updates.minStock : item.minStock;
              updated.status = (stock <= 0 ? "Out of Stock" : stock <= min ? "Low Stock" : "Healthy") as "Healthy" | "Low Stock" | "Out of Stock";
            }
            return updated;
          }
          return item;
        })
      );
      setSelectedInventory((prev) =>
        prev && prev.code === code ? { ...prev, ...updates } : prev
      );
      showToast({
        title: "Material Updated",
        description: `SKU ${code} details updated.`,
        type: "info",
      });
    },
    [showToast]
  );

  const deleteInventoryItem = useCallback(
    (code: string) => {
      setInventory((prev) => prev.filter((i) => i.code !== code));
      setSelectedInventory((prev) => (prev?.code === code ? null : prev));
      showToast({
        title: "Material Removed",
        description: `SKU ${code} discontinued and removed from catalog.`,
        type: "warning",
      });
    },
    [showToast]
  );

  const adjustInventoryStock = useCallback(
    (code: string, newQty: number, reason: string) => {
      setInventory((prev) =>
        prev.map((item) => {
          if (item.code === code) {
            const diff = newQty - item.currentStock;
            const status: "Healthy" | "Low Stock" | "Out of Stock" =
              newQty <= 0
                ? "Out of Stock"
                : newQty <= item.minStock
                ? "Low Stock"
                : "Healthy";
            const newTx = {
              id: "t-" + Date.now(),
              date: "17 Sep",
              type: "Adjustment" as const,
              qty: diff,
              reference: reason || "Manual stock reconciliation",
              operator: "Plant Store Manager",
            };
            const updated = {
              ...item,
              currentStock: newQty,
              status,
              transactions: [newTx, ...item.transactions],
            };
            setSelectedInventory((curr) => (curr && curr.code === code ? updated : curr));
            return updated;
          }
          return item;
        })
      );
      showToast({
        title: "Stock Adjusted",
        description: `Material ${code} inventory set to ${newQty}.`,
        type: "success",
      });
    },
    [showToast]
  );

  // ==========================================
  // Maintenance & Settings
  // ==========================================
  const addMaintenanceOrder = useCallback(
    (order: Omit<MaintenanceWorkOrder, "id">) => {
      const nextId = "WO-" + (9025 + maintenance.length + 1);
      const newWO: MaintenanceWorkOrder = { ...order, id: nextId };
      setMaintenance((prev) => [newWO, ...prev]);

      if (order.status === "In Progress") {
        setMachines((prev) =>
          prev.map((m) =>
            m.code === order.machineName
              ? { ...m, status: "maintenance", speedRpm: 0, activeMaintenanceId: nextId }
              : m
          )
        );
      }

      showToast({
        title: "Maintenance Scheduled",
        description: `Work order ${nextId} assigned to ${order.technician}.`,
        type: "success",
      });
    },
    [maintenance.length, showToast]
  );

  const toggleChecklistTask = useCallback(
    (workOrderId: string, taskIndex: number) => {
      setMaintenance((prev) =>
        prev.map((wo) => {
          if (wo.id === workOrderId) {
            const newChecklist = wo.checklist.map((task, idx) =>
              idx === taskIndex ? { ...task, completed: !task.completed } : task
            );
            return { ...wo, checklist: newChecklist };
          }
          return wo;
        })
      );
    },
    []
  );

  const updateMaintenanceStatus = useCallback(
    (workOrderId: string, status: MaintenanceStatus) => {
      let targetMachineCode = "";

      setMaintenance((prev) =>
        prev.map((wo) => {
          if (wo.id === workOrderId) {
            targetMachineCode = wo.machineName;
            return { ...wo, status };
          }
          return wo;
        })
      );

      if (status === "Completed" && targetMachineCode) {
        setMachines((prev) =>
          prev.map((m) =>
            m.code === targetMachineCode
              ? { ...m, status: "running", speedRpm: 1800, activeMaintenanceId: undefined }
              : m
          )
        );
      }

      showToast({
        title: "Maintenance Status Updated",
        description: `Work order ${workOrderId} marked as ${status}.`,
        type: "info",
      });
    },
    [showToast]
  );

  const dismissAlert = useCallback((id: string) => {
    setAlerts((prev) => prev.filter((a) => a.id !== id));
  }, []);

  const saveSettings = useCallback(
    (newSettings: SettingsState) => {
      setSettings(newSettings);
      showToast({
        title: "Configuration Saved",
        description: "Plant parameters, shifts, and alert rules updated.",
        type: "success",
      });
    },
    [showToast]
  );

  const openReportModal = useCallback(
    (data: { title: string; category: string; summary: string; dataKey: string }) => {
      setReportModalData(data);
    },
    []
  );

  const closeReportModal = useCallback(() => {
    setReportModalData(null);
  }, []);

  return (
    <PlantContext.Provider
      value={{
        activeTab,
        setActiveTab,
        selectedPlant,
        setSelectedPlant,
        selectedShift,
        setSelectedShift,
        selectedDate,
        setSelectedDate,

        isSidebarCollapsed,
        setIsSidebarCollapsed,
        isMobileSidebarOpen,
        setIsMobileSidebarOpen,

        isLiveSimulationActive,
        toggleLiveSimulation,
        lastTickTime,

        machines,
        orders,
        planning,
        downtime,
        inspections,
        inventory,
        maintenance,
        alerts,
        settings,

        productionToday,
        productionTarget,
        oee,
        oeeDiff,
        machineAvailability,
        rejectionRate,
        downtimeHours,
        downtimeMinutes,
        activeMachinesCount,
        totalMachinesCount,
        firstPassYield,
        totalInspectionsCount,
        totalDefectsCount,
        inventoryValueLakhs,
        lowStockCount,
        outOfStockCount,

        addOrder,
        updateOrderStatus,
        deleteOrder,

        addMachine,
        updateMachine,
        deleteMachine,
        updateMachineStatus,

        updatePlanningPriority,
        updatePlanningMachine,
        updatePlanningStatus,

        addDowntimeIncident,
        resolveDowntimeIncident,
        addInspection,

        addInventoryItem,
        updateInventoryItem,
        deleteInventoryItem,
        adjustInventoryStock,

        addMaintenanceOrder,
        toggleChecklistTask,
        updateMaintenanceStatus,
        dismissAlert,
        saveSettings,

        selectedOrder,
        setSelectedOrder,
        selectedMachine,
        setSelectedMachine,
        selectedInventory,
        setSelectedInventory,

        isNewOrderModalOpen,
        setIsNewOrderModalOpen,
        isLogDowntimeModalOpen,
        setIsLogDowntimeModalOpen,
        isScheduleMaintenanceModalOpen,
        setIsScheduleMaintenanceModalOpen,
        isAdjustStockModalOpen,
        setIsAdjustStockModalOpen,
        stockItemToAdjust,
        setStockItemToAdjust,
        isGlobalSearchOpen,
        setIsGlobalSearchOpen,

        isNewMachineModalOpen,
        setIsNewMachineModalOpen,
        isEditMachineModalOpen,
        setIsEditMachineModalOpen,
        machineToEdit,
        setMachineToEdit,

        isNewInventoryModalOpen,
        setIsNewInventoryModalOpen,
        isEditInventoryModalOpen,
        setIsEditInventoryModalOpen,
        inventoryToEdit,
        setInventoryToEdit,

        deleteConfirmState,
        openDeleteConfirm,
        closeDeleteConfirm,

        reportModalData,
        openReportModal,
        closeReportModal,

        toasts,
        showToast,
        dismissToast,
      }}
    >
      {children}
    </PlantContext.Provider>
  );
}

export function usePlant() {
  const context = useContext(PlantContext);
  if (!context) {
    throw new Error("usePlant must be used within a PlantProvider");
  }
  return context;
}