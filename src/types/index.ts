export type PlantId = "Mumbai Manufacturing Unit" | "Pune Unit" | "Chennai Unit";
export type ShiftId = "A Shift" | "B Shift" | "C Shift";

export type MachineStatus = "running" | "idle" | "breakdown" | "maintenance";

export interface MachineEvent {
  id: string;
  time: string;
  type: "info" | "warning" | "error" | "success";
  message: string;
}

export interface Machine {
  id: string;
  name: string;
  code: string;
  type: "CNC" | "Press" | "Assembly" | "Welding";
  department: string;
  status: MachineStatus;
  temperature: number; // in Celsius
  vibration: number; // in mm/s
  speedRpm: number; // in RPM
  runtimeHours: number;
  runtimeMinutes: number;
  oee: number; // percentage
  productionCount: number;
  availability: number;
  performance: number;
  quality: number;
  operator: string;
  currentOrderId?: string;
  currentOrderProduct?: string;
  activeDowntimeId?: string;
  activeMaintenanceId?: string;
  model: string;
  year: number;
  location: string;
  lastMaintenance: string;
  events: MachineEvent[];
}

export type OrderStatus = "In Progress" | "Completed" | "Queued" | "Paused";
export type PriorityLevel = "Critical" | "Urgent" | "High" | "Medium" | "Low";

export interface ProductionOrder {
  id: string;
  product: string;
  machineId: string;
  machineName: string;
  plannedQty: number;
  producedQty: number;
  rejectedQty: number;
  status: OrderStatus;
  startTime: string;
  dueTime: string;
  priority: PriorityLevel;
  operator: string;
  batchNumber: string;
  materialCodes?: string[];
  inspectionId?: string;
  downtimeId?: string;
  notes?: string;
  cycleTimeSec?: number;
}

export interface PlanningItem {
  id: string;
  orderId: string;
  product: string;
  machineId: string;
  machineName: string;
  plannedQty: number;
  priority: PriorityLevel;
  startDate: string;
  endDate: string;
  shift: ShiftId;
  status: "Scheduled" | "In Progress" | "Completed" | "Pending";
  progressPercent: number;
  line: string;
}

export type DowntimeReason =
  | "Mechanical"
  | "Electrical"
  | "Material Shortage"
  | "Setup"
  | "Operator"
  | "Other";

export interface DowntimeIncident {
  id: string;
  machineId: string;
  machineName: string;
  durationMinutes: number;
  reason: DowntimeReason;
  shift: ShiftId;
  date: string;
  time: string;
  mttrMinutes: number;
  actionTaken: string;
  status: "Resolved" | "Under Investigation" | "Open";
  technician: string;
  affectedOrderId?: string;
  affectedProduct?: string;
  affectedBatchId?: string;
  maintenanceTicketId?: string;
  line?: string;
  notes?: string;
}

export type DefectType =
  | "None"
  | "Dimension Error"
  | "Surface Defect"
  | "Assembly Error"
  | "Material Defect"
  | "Other";

export interface QualityInspection {
  id: string;
  orderId: string;
  machineCode: string;
  machineId?: string;
  product: string;
  batch: string;
  sampleQty: number;
  acceptedQty: number;
  rejectedQty: number;
  defectType: DefectType;
  inspector: string;
  status: "Passed" | "Rejected" | "Conditional";
  date: string;
  shift: ShiftId;
  notes?: string;
}

export type InventoryCategory =
  | "Raw Materials"
  | "Castings"
  | "Bearings & Fasteners"
  | "Electrical"
  | "Consumables"
  | "Finished Goods";

export interface StockTransaction {
  id: string;
  date: string;
  type: "Inward" | "Issued" | "Scrapped" | "Adjustment";
  qty: number;
  reference: string;
  operator: string;
}

export interface InventoryItem {
  code: string;
  name: string;
  category: InventoryCategory;
  currentStock: number;
  minStock: number;
  unit: "Units" | "Pieces" | "Kg" | "Meters" | "Liters";
  location: string;
  status: "Healthy" | "Low Stock" | "Out of Stock";
  unitCost: number; // in INR
  lastRestocked: string;
  usedInOrders: string[];
  transactions: StockTransaction[];
}

export type MaintenanceType = "Preventive" | "Corrective" | "Predictive";
export type MaintenanceStatus = "Scheduled" | "In Progress" | "Overdue" | "Completed";

export interface MaintenanceChecklistTask {
  task: string;
  completed: boolean;
}

export interface MaintenanceWorkOrder {
  id: string;
  machineId: string;
  machineName: string;
  type: MaintenanceType;
  scheduledDate: string;
  technician: string;
  priority: PriorityLevel;
  status: MaintenanceStatus;
  description: string;
  checklist: MaintenanceChecklistTask[];
  durationHours: number;
  impactedLine?: string;
  relatedDowntimeId?: string;
}

export interface PlantAlert {
  id: string;
  title: string;
  description: string;
  severity: "critical" | "warning" | "info";
  timestamp: string;
  machineId?: string;
  orderId?: string;
  category: "Machine" | "Quality" | "Inventory" | "Production";
  read: boolean;
}

export interface SettingsState {
  plantName: string;
  plantCode: string;
  address: string;
  gstin: string;
  timezone: string;
  currency: string;
  targetDailyProduction: number;
  targetOee: number;
  maxScrapRate: number;
  dailyTarget?: number;
  monthlyTarget?: number;
  oeeTarget?: number;
  rejectionTolerance?: number;
  shiftA: { name: string; start: string; end: string };
  shiftB: { name: string; start: string; end: string };
  shiftC: { name: string; start: string; end: string };
  tempThresholdWarn: number;
  tempThresholdCrit: number;
  vibeThresholdWarn: number;
  vibeThresholdCrit: number;
  maxTemperatureThreshold?: number;
  maxVibrationThreshold?: number;
  emailAlerts: boolean;
  smsAlerts: boolean;
  whatsAppAlerts?: boolean;
  autoScheduleMaintenance?: boolean;
}