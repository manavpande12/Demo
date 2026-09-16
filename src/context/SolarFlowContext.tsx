'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  ActiveTab,
  Lead,
  LeadStatus,
  Customer,
  SiteSurvey,
  SurveyStatus,
  Quotation,
  QuotationStatus,
  Project,
  ProjectStage,
  InventoryItem,
  InstallationProject,
  MonitoredPlant,
  ServiceTicket,
  TicketStatus,
  CompanySettings,
} from '@/types';
import {
  initialCompanySettings,
  initialCustomers,
  initialInstallations,
  initialInventory,
  initialLeads,
  initialMonitoredPlants,
  initialProjects,
  initialQuotations,
  initialServiceTickets,
  initialSurveys,
} from '@/data/mockData';

interface ToastNotification {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  title: string;
  message?: string;
}

interface SolarFlowContextType {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;

  // Leads
  leads: Lead[];
  addLead: (lead: Omit<Lead, 'id' | 'createdAt'>) => void;
  updateLeadStatus: (id: string, status: LeadStatus) => void;
  convertLeadToCustomer: (leadId: string) => void;

  // Customers
  customers: Customer[];
  addCustomer: (customer: Omit<Customer, 'id' | 'createdAt' | 'totalProjects' | 'totalCapacityKW'>) => void;
  selectedCustomerId: string | null;
  setSelectedCustomerId: (id: string | null) => void;

  // Surveys
  surveys: SiteSurvey[];
  addSurvey: (survey: Omit<SiteSurvey, 'id' | 'surveyNumber'>) => void;
  updateSurveyStatus: (id: string, status: SurveyStatus) => void;

  // Quotations
  quotations: Quotation[];
  addQuotation: (quotation: Omit<Quotation, 'id' | 'quotationNumber' | 'createdAt'>) => void;
  updateQuotationStatus: (id: string, status: QuotationStatus) => void;
  activeQuotationForPrint: Quotation | null;
  setActiveQuotationForPrint: (quotation: Quotation | null) => void;

  // Projects
  projects: Project[];
  addProject: (project: Omit<Project, 'id' | 'projectCode' | 'progressPercentage'> & { customProjectCode?: string }) => void;
  updateProject: (projectId: string, projectData: Partial<Project>) => void;
  deleteProject: (projectId: string) => void;
  updateProjectProgress: (projectId: string, progress: number) => void;
  toggleProjectStage: (projectId: string, stageId: string, status: 'completed' | 'in_progress' | 'pending') => void;
  addProjectStage: (projectId: string, stageName: string, notes?: string) => void;
  updateProjectStage: (projectId: string, stageId: string, stageData: Partial<ProjectStage>) => void;
  deleteProjectStage: (projectId: string, stageId: string) => void;
  selectedProjectId: string | null;
  setSelectedProjectId: (id: string | null) => void;

  // Inventory
  inventory: InventoryItem[];
  adjustStock: (itemId: string, change: number) => void;
  addInventoryItem: (item: Omit<InventoryItem, 'id' | 'status'>) => void;

  // Installation
  installations: InstallationProject[];
  toggleInstallationTask: (instId: string, taskId: string) => void;
  updateInstallationStatus: (instId: string, status: InstallationProject['status']) => void;

  // Monitoring
  monitoredPlants: MonitoredPlant[];
  selectedPlantId: string;
  setSelectedPlantId: (id: string) => void;
  resolveAlert: (plantId: string, alertId: string) => void;

  // Service & AMC
  serviceTickets: ServiceTicket[];
  addServiceTicket: (ticket: Omit<ServiceTicket, 'id' | 'ticketNumber' | 'createdAt'>) => void;
  updateTicketStatus: (ticketId: string, status: TicketStatus, resolutionNotes?: string) => void;

  // Settings
  companySettings: CompanySettings;
  updateCompanySettings: (settings: Partial<CompanySettings>) => void;

  // Toast
  toasts: ToastNotification[];
  addToast: (toast: Omit<ToastNotification, 'id'>) => void;
  removeToast: (id: string) => void;
}

const SolarFlowContext = createContext<SolarFlowContextType | undefined>(undefined);

export const SolarFlowProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');

  const [leads, setLeads] = useState<Lead[]>(initialLeads);
  const [customers, setCustomers] = useState<Customer[]>(initialCustomers);
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);

  const [surveys, setSurveys] = useState<SiteSurvey[]>(initialSurveys);
  const [quotations, setQuotations] = useState<Quotation[]>(initialQuotations);
  const [activeQuotationForPrint, setActiveQuotationForPrint] = useState<Quotation | null>(null);

  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);

  const [inventory, setInventory] = useState<InventoryItem[]>(initialInventory);
  const [installations, setInstallations] = useState<InstallationProject[]>(initialInstallations);

  const [monitoredPlants, setMonitoredPlants] = useState<MonitoredPlant[]>(initialMonitoredPlants);
  const [selectedPlantId, setSelectedPlantId] = useState<string>('mon-01');

  const [serviceTickets, setServiceTickets] = useState<ServiceTicket[]>(initialServiceTickets);
  const [companySettings, setCompanySettings] = useState<CompanySettings>(initialCompanySettings);

  const [toasts, setToasts] = useState<ToastNotification[]>([]);

  const addToast = (toast: Omit<ToastNotification, 'id'>) => {
    const id = 'toast-' + Math.random().toString(36).substr(2, 9);
    setToasts((prev) => [...prev, { ...toast, id }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Lead Actions
  const addLead = (leadData: Omit<Lead, 'id' | 'createdAt'>) => {
    const newLead: Lead = {
      ...leadData,
      id: `lead-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setLeads((prev) => [newLead, ...prev]);
    addToast({
      type: 'success',
      title: 'Lead Captured',
      message: `Lead for ${newLead.company || newLead.name} added successfully!`,
    });
  };

  const updateLeadStatus = (id: string, status: LeadStatus) => {
    setLeads((prev) =>
      prev.map((l) => (l.id === id ? { ...l, status } : l))
    );
    addToast({
      type: 'info',
      title: 'Lead Status Updated',
      message: `Status updated to "${status}"`,
    });
  };

  const convertLeadToCustomer = (leadId: string) => {
    const lead = leads.find((l) => l.id === leadId);
    if (!lead) return;

    // Check if customer already exists
    const existing = customers.find((c) => c.company.toLowerCase() === lead.company.toLowerCase());
    if (existing) {
      updateLeadStatus(leadId, 'Converted');
      addToast({
        type: 'info',
        title: 'Lead Linked',
        message: `${lead.company} already exists in customers directory.`,
      });
      return;
    }

    const newCust: Customer = {
      id: `cust-${Date.now()}`,
      name: lead.name,
      company: lead.company,
      email: lead.email,
      phone: lead.phone,
      address: `${lead.city}, ${lead.state}`,
      city: lead.city,
      state: lead.state,
      customerType: 'Industrial',
      gstNumber: '24AA' + Math.random().toString(36).substring(2, 8).toUpperCase() + '1Z9',
      discom: 'Torrent Power',
      sanctionedLoadKW: Math.round(lead.capacityKW * 1.2),
      consumerNumber: Math.floor(10000000000 + Math.random() * 90000000000).toString(),
      totalProjects: 0,
      totalCapacityKW: lead.capacityKW,
      createdAt: new Date().toISOString().split('T')[0],
    };

    setCustomers((prev) => [newCust, ...prev]);
    updateLeadStatus(leadId, 'Converted');
    addToast({
      type: 'success',
      title: 'Lead Converted to Customer!',
      message: `${newCust.company} is now added to the Customers list.`,
    });
  };

  // Customers
  const addCustomer = (customerData: Omit<Customer, 'id' | 'createdAt' | 'totalProjects' | 'totalCapacityKW'>) => {
    const newCust: Customer = {
      ...customerData,
      id: `cust-${Date.now()}`,
      totalProjects: 0,
      totalCapacityKW: 0,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setCustomers((prev) => [newCust, ...prev]);
    addToast({
      type: 'success',
      title: 'Customer Added',
      message: `${newCust.company} onboarded successfully!`,
    });
  };

  // Surveys
  const addSurvey = (surveyData: Omit<SiteSurvey, 'id' | 'surveyNumber'>) => {
    const surveyCount = surveys.length + 90;
    const newSurvey: SiteSurvey = {
      ...surveyData,
      id: `surv-${Date.now()}`,
      surveyNumber: `SRV-2026-${String(surveyCount).padStart(3, '0')}`,
    };
    setSurveys((prev) => [newSurvey, ...prev]);
    addToast({
      type: 'success',
      title: 'Survey Recorded',
      message: `Site survey ${newSurvey.surveyNumber} saved with ${newSurvey.recommendedCapacityKW} kW sizing!`,
    });
  };

  const updateSurveyStatus = (id: string, status: SurveyStatus) => {
    setSurveys((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status } : s))
    );
    addToast({
      type: 'info',
      title: 'Survey Status Changed',
      message: `Survey status changed to ${status}`,
    });
  };

  // Quotations
  const addQuotation = (quotationData: Omit<Quotation, 'id' | 'quotationNumber' | 'createdAt'>) => {
    const quoteCount = quotations.length + 107;
    const newQuotation: Quotation = {
      ...quotationData,
      id: `quot-${Date.now()}`,
      quotationNumber: `QT-2026-${String(quoteCount).padStart(3, '0')}`,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setQuotations((prev) => [newQuotation, ...prev]);
    addToast({
      type: 'success',
      title: 'Quotation Created!',
      message: `Quotation ${newQuotation.quotationNumber} (₹${(newQuotation.grandTotal / 100000).toFixed(2)} Lakhs) generated.`,
    });
  };

  const updateQuotationStatus = (id: string, status: QuotationStatus) => {
    setQuotations((prev) =>
      prev.map((q) => (q.id === id ? { ...q, status } : q))
    );
    addToast({
      type: 'info',
      title: 'Quotation Updated',
      message: `Status marked as "${status}"`,
    });
  };

  // Projects
  const addProject = (projectData: Omit<Project, 'id' | 'projectCode' | 'progressPercentage'> & { customProjectCode?: string }) => {
    const nextNum = projects.length + 1;
    const projectCode = projectData.customProjectCode || `SF-PRJ-2026-0${nextNum}`;

    const defaultStages: ProjectStage[] = [
      { id: `stg-${Date.now()}-1`, name: 'Engineering & Design', status: 'completed', completedDate: projectData.startDate, notes: 'System 3D layout, shadow analysis & MMS drawings finalized' },
      { id: `stg-${Date.now()}-2`, name: 'DISCOM Approvals', status: 'in_progress', notes: 'Filing for net metering feasibility and transformer loading sanction' },
      { id: `stg-${Date.now()}-3`, name: 'Material Procurement', status: 'pending', notes: 'Tier-1 modules and multi-MPPT inverters dispatch from warehouse' },
      { id: `stg-${Date.now()}-4`, name: 'Civil & Structure', status: 'pending', notes: 'Rooftop mounting structure installation, torque audits & pull-out tests' },
      { id: `stg-${Date.now()}-5`, name: 'Electrical & Panels', status: 'pending', notes: 'PV module mounting, DC/AC cabling, DCDB/ACDB, earthing & lightning protection' },
      { id: `stg-${Date.now()}-6`, name: 'Testing & CEIG Inspection', status: 'pending', notes: 'Pre-commissioning tests, insulation resistance & statutory electrical inspector safety clearance' },
      { id: `stg-${Date.now()}-7`, name: 'Net Metering & Commissioning', status: 'pending', notes: 'Bi-directional TOD meter synchronization to grid feeder' },
    ];

    const stages: ProjectStage[] = projectData.stages && projectData.stages.length > 0 ? projectData.stages : defaultStages;
    const completedCount = stages.filter((s) => s.status === 'completed').length;
    const progressPercentage = Math.round((completedCount / stages.length) * 100);

    const newProject: Project = {
      ...projectData,
      id: `prj-${Date.now()}`,
      projectCode,
      progressPercentage,
      stages,
    };

    setProjects((prev) => [newProject, ...prev]);

    // Update customer total projects & capacity if customer exists
    if (projectData.customerId) {
      setCustomers((prev) =>
        prev.map((c) => {
          if (c.id === projectData.customerId) {
            return {
              ...c,
              totalProjects: (c.totalProjects || 0) + 1,
              totalCapacityKW: (c.totalCapacityKW || 0) + projectData.capacityKW,
            };
          }
          return c;
        })
      );
    }

    addToast({
      type: 'success',
      title: 'Project Created!',
      message: `Project ${newProject.projectCode} for ${newProject.company} (${newProject.capacityKW} kW) initialized.`,
    });
  };

  const updateProject = (projectId: string, projectData: Partial<Project>) => {
    setProjects((prev) =>
      prev.map((p) => {
        if (p.id !== projectId) return p;
        return { ...p, ...projectData };
      })
    );
    addToast({
      type: 'info',
      title: 'Project Updated',
      message: 'Project details have been updated.',
    });
  };

  const deleteProject = (projectId: string) => {
    const p = projects.find((prj) => prj.id === projectId);
    setProjects((prev) => prev.filter((prj) => prj.id !== projectId));
    if (selectedProjectId === projectId) {
      setSelectedProjectId(null);
    }
    addToast({
      type: 'info',
      title: 'Project Removed',
      message: `Project ${p?.projectCode || ''} removed.`,
    });
  };

  const updateProjectProgress = (projectId: string, progress: number) => {
    setProjects((prev) =>
      prev.map((p) => {
        if (p.id !== projectId) return p;
        const validProgress = Math.min(100, Math.max(0, progress));
        const status = validProgress === 100 ? 'Commissioned' : p.status === 'Commissioned' ? 'Installation' : p.status;
        return { ...p, progressPercentage: validProgress, status };
      })
    );
    addToast({
      type: 'info',
      title: 'Project Progress Saved',
      message: `Updated to ${progress}% completion`,
    });
  };

  const toggleProjectStage = (projectId: string, stageId: string, status: 'completed' | 'in_progress' | 'pending') => {
    setProjects((prev) =>
      prev.map((p) => {
        if (p.id !== projectId) return p;
        const updatedStages = p.stages.map((st) =>
          st.id === stageId
            ? {
                ...st,
                status,
                completedDate: status === 'completed' ? new Date().toISOString().split('T')[0] : undefined,
              }
            : st
        );
        const completedCount = updatedStages.filter((s) => s.status === 'completed').length;
        const calculatedProgress = updatedStages.length > 0 ? Math.round((completedCount / updatedStages.length) * 100) : 0;
        return {
          ...p,
          stages: updatedStages,
          progressPercentage: calculatedProgress,
          status: calculatedProgress === 100 ? 'Commissioned' : p.status,
        };
      })
    );
    addToast({
      type: 'success',
      title: 'Milestone Updated',
      message: 'Stage progress updated.',
    });
  };

  const addProjectStage = (projectId: string, stageName: string, notes?: string) => {
    setProjects((prev) =>
      prev.map((p) => {
        if (p.id !== projectId) return p;
        const newStage: ProjectStage = {
          id: `stg-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
          name: stageName,
          status: 'pending',
          notes: notes || '',
        };
        const updatedStages = [...p.stages, newStage];
        const completedCount = updatedStages.filter((s) => s.status === 'completed').length;
        const calculatedProgress = Math.round((completedCount / updatedStages.length) * 100);
        return {
          ...p,
          stages: updatedStages,
          progressPercentage: calculatedProgress,
        };
      })
    );
    addToast({
      type: 'success',
      title: 'Stage Added',
      message: `Stage "${stageName}" added to project.`,
    });
  };

  const updateProjectStage = (projectId: string, stageId: string, stageData: Partial<ProjectStage>) => {
    setProjects((prev) =>
      prev.map((p) => {
        if (p.id !== projectId) return p;
        const updatedStages = p.stages.map((st) => {
          if (st.id !== stageId) return st;
          return {
            ...st,
            ...stageData,
            completedDate:
              stageData.status === 'completed'
                ? st.completedDate || new Date().toISOString().split('T')[0]
                : stageData.status
                ? undefined
                : st.completedDate,
          };
        });
        const completedCount = updatedStages.filter((s) => s.status === 'completed').length;
        const calculatedProgress = updatedStages.length > 0 ? Math.round((completedCount / updatedStages.length) * 100) : 0;
        return {
          ...p,
          stages: updatedStages,
          progressPercentage: calculatedProgress,
          status: calculatedProgress === 100 ? 'Commissioned' : p.status,
        };
      })
    );
    addToast({
      type: 'info',
      title: 'Stage Updated',
      message: 'Stage details have been saved.',
    });
  };

  const deleteProjectStage = (projectId: string, stageId: string) => {
    setProjects((prev) =>
      prev.map((p) => {
        if (p.id !== projectId) return p;
        const updatedStages = p.stages.filter((st) => st.id !== stageId);
        const completedCount = updatedStages.filter((s) => s.status === 'completed').length;
        const calculatedProgress = updatedStages.length > 0 ? Math.round((completedCount / updatedStages.length) * 100) : 0;
        return {
          ...p,
          stages: updatedStages,
          progressPercentage: calculatedProgress,
        };
      })
    );
    addToast({
      type: 'info',
      title: 'Stage Removed',
      message: 'Project stage deleted.',
    });
  };

  // Inventory
  const adjustStock = (itemId: string, change: number) => {
    setInventory((prev) =>
      prev.map((item) => {
        if (item.id !== itemId) return item;
        const newStock = Math.max(0, item.currentStock + change);
        let status: 'In Stock' | 'Low Stock' | 'Out of Stock' = 'In Stock';
        if (newStock === 0) status = 'Out of Stock';
        else if (newStock <= item.minStockAlert) status = 'Low Stock';
        return {
          ...item,
          currentStock: newStock,
          status,
        };
      })
    );
    addToast({
      type: 'info',
      title: 'Stock Adjusted',
      message: `Stock level modified by ${change > 0 ? '+' : ''}${change}`,
    });
  };

  const addInventoryItem = (itemData: Omit<InventoryItem, 'id' | 'status'>) => {
    const status: 'In Stock' | 'Low Stock' | 'Out of Stock' =
      itemData.currentStock === 0
        ? 'Out of Stock'
        : itemData.currentStock <= itemData.minStockAlert
        ? 'Low Stock'
        : 'In Stock';
    const newItem: InventoryItem = {
      ...itemData,
      id: `inv-${Date.now()}`,
      status,
    };
    setInventory((prev) => [newItem, ...prev]);
    addToast({
      type: 'success',
      title: 'Inventory Item Added',
      message: `${newItem.name} registered into warehouse.`,
    });
  };

  // Installation
  const toggleInstallationTask = (instId: string, taskId: string) => {
    setInstallations((prev) =>
      prev.map((inst) => {
        if (inst.id !== instId) return inst;
        const updatedChecklist = inst.checklist.map((task) =>
          task.id === taskId ? { ...task, completed: !task.completed } : task
        );
        const done = updatedChecklist.filter((c) => c.completed).length;
        const progress = Math.round((done / updatedChecklist.length) * 100);
        return {
          ...inst,
          checklist: updatedChecklist,
          progressPercentage: progress,
          status: progress === 100 ? 'Ready for Inspection' : inst.status,
        };
      })
    );
  };

  const updateInstallationStatus = (instId: string, status: InstallationProject['status']) => {
    setInstallations((prev) =>
      prev.map((inst) => (inst.id === instId ? { ...inst, status } : inst))
    );
    addToast({
      type: 'info',
      title: 'Installation Status Changed',
      message: `Status: ${status}`,
    });
  };

  // Monitoring
  const resolveAlert = (plantId: string, alertId: string) => {
    setMonitoredPlants((prev) =>
      prev.map((plant) => {
        if (plant.id !== plantId) return plant;
        return {
          ...plant,
          alerts: plant.alerts.map((a) => (a.id === alertId ? { ...a, resolved: true } : a)),
        };
      })
    );
    addToast({
      type: 'success',
      title: 'Alert Acknowledged',
      message: 'Telemetry alert marked as resolved.',
    });
  };

  // Service
  const addServiceTicket = (ticketData: Omit<ServiceTicket, 'id' | 'ticketNumber' | 'createdAt'>) => {
    const count = serviceTickets.length + 53;
    const newTicket: ServiceTicket = {
      ...ticketData,
      id: `tkt-${Date.now()}`,
      ticketNumber: `TKT-2026-${String(count).padStart(3, '0')}`,
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
    };
    setServiceTickets((prev) => [newTicket, ...prev]);
    addToast({
      type: 'success',
      title: 'Service Ticket Raised',
      message: `Ticket ${newTicket.ticketNumber} assigned to ${newTicket.technician}`,
    });
  };

  const updateTicketStatus = (ticketId: string, status: TicketStatus, resolutionNotes?: string) => {
    setServiceTickets((prev) =>
      prev.map((t) =>
        t.id === ticketId
          ? {
              ...t,
              status,
              ...(resolutionNotes ? { resolutionNotes } : {}),
            }
          : t
      )
    );
    addToast({
      type: 'info',
      title: 'Ticket Updated',
      message: `Ticket marked as ${status}`,
    });
  };

  // Settings
  const updateCompanySettings = (settings: Partial<CompanySettings>) => {
    setCompanySettings((prev) => ({ ...prev, ...settings }));
    addToast({
      type: 'success',
      title: 'Settings Saved',
      message: 'Company profile and preferences updated.',
    });
  };

  return (
    <SolarFlowContext.Provider
      value={{
        activeTab,
        setActiveTab,
        leads,
        addLead,
        updateLeadStatus,
        convertLeadToCustomer,
        customers,
        addCustomer,
        selectedCustomerId,
        setSelectedCustomerId,
        surveys,
        addSurvey,
        updateSurveyStatus,
        quotations,
        addQuotation,
        updateQuotationStatus,
        activeQuotationForPrint,
        setActiveQuotationForPrint,
        projects,
        addProject,
        updateProject,
        deleteProject,
        updateProjectProgress,
        toggleProjectStage,
        addProjectStage,
        updateProjectStage,
        deleteProjectStage,
        selectedProjectId,
        setSelectedProjectId,
        inventory,
        adjustStock,
        addInventoryItem,
        installations,
        toggleInstallationTask,
        updateInstallationStatus,
        monitoredPlants,
        selectedPlantId,
        setSelectedPlantId,
        resolveAlert,
        serviceTickets,
        addServiceTicket,
        updateTicketStatus,
        companySettings,
        updateCompanySettings,
        toasts,
        addToast,
        removeToast,
      }}
    >
      {children}
    </SolarFlowContext.Provider>
  );
};

export const useSolarFlow = () => {
  const context = useContext(SolarFlowContext);
  if (!context) {
    throw new Error('useSolarFlow must be used within a SolarFlowProvider');
  }
  return context;
};
