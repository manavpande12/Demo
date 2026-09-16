export type ActiveTab =
  | 'dashboard'
  | 'leads'
  | 'customers'
  | 'surveys'
  | 'quotations'
  | 'projects'
  | 'inventory'
  | 'installation'
  | 'monitoring'
  | 'service'
  | 'reports'
  | 'settings';

export type LeadStatus = 'New' | 'Contacted' | 'Survey Scheduled' | 'Proposal Sent' | 'Converted' | 'Lost';
export type LeadSource = 'Direct Walk-in' | 'IndiaMART' | 'Reference' | 'Exhibition/Trade Show' | 'Google Search' | 'Channel Partner';

export interface Lead {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  city: string;
  state: string;
  source: LeadSource;
  capacityKW: number;
  rooftopType: string;
  status: LeadStatus;
  followUpDate: string;
  assignedTo: string;
  estimatedBudget: number;
  notes: string;
  createdAt: string;
}

export type CustomerType = 'Industrial' | 'Commercial' | 'Residential' | 'Institutional';

export interface Customer {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  customerType: CustomerType;
  gstNumber: string;
  discom: string;
  sanctionedLoadKW: number;
  consumerNumber: string;
  totalProjects: number;
  totalCapacityKW: number;
  createdAt: string;
}

export type SurveyStatus = 'Pending' | 'In Progress' | 'Completed' | 'Report Approved';

export interface SiteSurvey {
  id: string;
  surveyNumber: string;
  customerId: string;
  customerName: string;
  company: string;
  siteLocation: string;
  city: string;
  roofType: 'RCC Flat Roof' | 'Metal Shed Sheet' | 'Tile/Sloped' | 'Ground Mount';
  roofAreaSqFt: number;
  shadowFreeAreaSqFt: number;
  monthlyElectricityUnits: number;
  avgMonthlyBill: number;
  recommendedCapacityKW: number;
  estimatedYearlyGenerationKWh: number;
  structureOrientation: string;
  tiltAngle: number;
  surveyDate: string;
  surveyorName: string;
  status: SurveyStatus;
  notes: string;
}

export type QuotationStatus = 'Draft' | 'Sent' | 'Under Review' | 'Accepted' | 'Rejected';

export interface Quotation {
  id: string;
  quotationNumber: string;
  customerId: string;
  customerName: string;
  company: string;
  siteLocation: string;
  systemCapacityKW: number;
  panelBrand: string;
  panelWattage: number;
  panelCount: number;
  inverterBrand: string;
  inverterCapacityKW: number;
  structureType: string;
  panelCost: number;
  inverterCost: number;
  structureCost: number;
  installationCost: number;
  bosAndCablesCost: number;
  liaisoningNetMeteringCost: number;
  discount: number;
  gstRate: number; // e.g. 13.8% composite GST
  subtotal: number;
  totalGST: number;
  grandTotal: number;
  status: QuotationStatus;
  validUntil: string;
  createdAt: string;
  paymentTerms: string;
}

export type ProjectStageName =
  | 'Engineering & Design'
  | 'DISCOM Approvals'
  | 'Material Procurement'
  | 'Civil & Structure'
  | 'Electrical & Panels'
  | 'Testing & CEIG Inspection'
  | 'Net Metering & Commissioning';

export interface ProjectStage {
  id: string;
  name: ProjectStageName | string;
  status: 'completed' | 'in_progress' | 'pending';
  completedDate?: string;
  notes?: string;
}

export type ProjectStatus = 'Active' | 'Under Approval' | 'Installation' | 'Commissioned' | 'On Hold';

export interface Project {
  id: string;
  projectCode: string;
  customerId: string;
  customerName: string;
  company: string;
  location: string;
  city: string;
  capacityKW: number;
  projectType: string;
  status: ProjectStatus;
  progressPercentage: number;
  startDate: string;
  targetCompletionDate: string;
  projectManager: string;
  totalContractValue: number;
  stages: ProjectStage[];
}

export type InventoryCategory =
  | 'Solar Panels'
  | 'Inverters'
  | 'Mounting Structures'
  | 'DC/AC Cables'
  | 'Balance of System'
  | 'Protection & Earthing';

export interface InventoryItem {
  id: string;
  itemCode: string;
  name: string;
  category: InventoryCategory;
  brand: string;
  specifications: string;
  unit: string;
  currentStock: number;
  minStockAlert: number;
  unitPrice: number;
  locationRack: string;
  status: 'In Stock' | 'Low Stock' | 'Out of Stock';
}

export interface InstallationTask {
  id: string;
  title: string;
  category: string;
  completed: boolean;
}

export interface InstallationProject {
  id: string;
  projectId: string;
  projectCode: string;
  customerName: string;
  company: string;
  location: string;
  capacityKW: number;
  teamLead: string;
  contractorName: string;
  teamSize: number;
  currentStage: string;
  progressPercentage: number;
  status: 'On Track' | 'Ahead of Schedule' | 'Delayed' | 'Ready for Inspection';
  checklist: InstallationTask[];
  startDate: string;
  estimatedFinishDate: string;
}

export interface InverterUnit {
  id: string;
  name: string;
  capacityKW: number;
  currentOutputKW: number;
  status: 'Normal' | 'Warning' | 'Fault';
  efficiency: number;
  temperatureC: number;
}

export interface PlantAlert {
  id: string;
  severity: 'Critical' | 'Warning' | 'Info';
  message: string;
  timestamp: string;
  resolved: boolean;
}

export interface MonitoredPlant {
  id: string;
  plantId: string;
  plantName: string;
  customerName: string;
  city: string;
  capacityKW: number;
  currentGenerationKW: number;
  dailyGenerationKWh: number;
  monthlyGenerationMWh: number;
  lifetimeGenerationMWh: number;
  performanceRatio: number; // e.g. 79.4%
  plantHealth: 'Optimal' | 'Warning' | 'Critical';
  co2SavedTons: number;
  inverters: InverterUnit[];
  alerts: PlantAlert[];
  hourlyTrend: { time: string; generationKW: number; solarIrradiance: number }[];
}

export type TicketPriority = 'Critical' | 'High' | 'Medium' | 'Low';
export type TicketStatus = 'Open' | 'Assigned' | 'In Progress' | 'Resolved' | 'Closed';

export interface ServiceTicket {
  id: string;
  ticketNumber: string;
  customerId: string;
  customerName: string;
  company: string;
  plantId: string;
  plantName: string;
  issueTitle: string;
  description: string;
  priority: TicketPriority;
  technician: string;
  status: TicketStatus;
  amcStatus: 'Active AMC' | 'Expiring Soon' | 'Out of Warranty' | 'Complimentary Year 1';
  amcExpiryDate: string;
  createdAt: string;
  resolutionTimeEstimate: string;
  resolutionNotes?: string;
  notes?: string;
}

export interface CompanySettings {
  companyName: string;
  legalName: string;
  tagline: string;
  gstNumber: string;
  panNumber: string;
  email: string;
  phone: string;
  officeAddress: string;
  state: string;
  discoms: string[];
  defaultGstRate: number;
  warrantyYearsPanels: number;
  warrantyYearsInverters: number;
}
