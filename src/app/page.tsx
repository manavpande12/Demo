"use client";

import React from "react";
import { PlantProvider, usePlant } from "../context/PlantContext";
import { Sidebar } from "../components/layout/Sidebar";
import { Header } from "../components/layout/Header";
import { GlobalSearchModal } from "../components/layout/GlobalSearchModal";
import { ToastContainer } from "../components/ui/toast";

// Core 10 Views
import { DashboardView } from "../components/dashboard/DashboardView";
import { ProductionView } from "../components/production/ProductionView";
import { PlanningView } from "../components/planning/PlanningView";
import { MachinesView } from "../components/machines/MachinesView";
import { DowntimeView } from "../components/downtime/DowntimeView";
import { QualityView } from "../components/quality/QualityView";
import { InventoryView } from "../components/inventory/InventoryView";
import { MaintenanceView } from "../components/maintenance/MaintenanceView";
import { ReportsView } from "../components/reports/ReportsView";
import { SettingsView } from "../components/settings/SettingsView";

// Modals and Drawers
import { NewOrderModal } from "../components/modals/NewOrderModal";
import { OrderDetailsDrawer } from "../components/modals/OrderDetailsDrawer";
import { MachineDetailsDrawer } from "../components/modals/MachineDetailsDrawer";
import { LogDowntimeModal } from "../components/modals/LogDowntimeModal";
import { ScheduleMaintenanceModal } from "../components/modals/ScheduleMaintenanceModal";
import { AdjustStockModal, InventoryDetailDrawer } from "../components/modals/AdjustStockModal";
import { ReportPreviewModal } from "../components/modals/ReportPreviewModal";
import { NewMachineModal } from "../components/modals/NewMachineModal";
import { EditMachineModal } from "../components/modals/EditMachineModal";
import { NewInventoryModal } from "../components/modals/NewInventoryModal";
import { EditInventoryModal } from "../components/modals/EditInventoryModal";
import { ConfirmDeleteModal } from "../components/modals/ConfirmDeleteModal";

function MFGFlowShell() {
  const { activeTab } = usePlant();

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-50 text-slate-900 font-sans antialiased">
      {/* Left Navigation Sidebar (Desktop Collapsible + Mobile Overlay Drawer) */}
      <Sidebar />

      {/* Main Content Pane */}
      <div className="flex flex-col flex-1 min-w-0 h-full overflow-hidden">
        {/* Top Header Bar */}
        <Header />

        {/* Scrollable View Container */}
        <main className="flex-1 overflow-y-auto p-3 sm:p-5 lg:p-6 bg-slate-100/60">
          <div className="max-w-7xl mx-auto pb-12">
            {activeTab === "dashboard" && <DashboardView />}
            {activeTab === "production" && <ProductionView />}
            {activeTab === "planning" && <PlanningView />}
            {activeTab === "machines" && <MachinesView />}
            {activeTab === "downtime" && <DowntimeView />}
            {activeTab === "quality" && <QualityView />}
            {activeTab === "inventory" && <InventoryView />}
            {activeTab === "maintenance" && <MaintenanceView />}
            {activeTab === "reports" && <ReportsView />}
            {activeTab === "settings" && <SettingsView />}
          </div>
        </main>
      </div>

      {/* Global Modals & Drawers */}
      <NewOrderModal />
      <OrderDetailsDrawer />
      <MachineDetailsDrawer />
      <NewMachineModal />
      <EditMachineModal />
      <LogDowntimeModal />
      <ScheduleMaintenanceModal />
      <AdjustStockModal />
      <InventoryDetailDrawer />
      <NewInventoryModal />
      <EditInventoryModal />
      <ConfirmDeleteModal />
      <ReportPreviewModal />
      <GlobalSearchModal />
      <ToastContainer />
    </div>
  );
}

export default function Home() {
  return (
    <PlantProvider>
      <MFGFlowShell />
    </PlantProvider>
  );
}