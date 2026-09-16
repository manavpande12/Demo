'use client';

import React, { useState } from 'react';
import { useSolarFlow } from '@/context/SolarFlowContext';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { ToastContainer } from '@/components/ui/ToastContainer';

// 12 Modular Views
import { DashboardView } from '@/components/dashboard/DashboardView';
import { LeadsView } from '@/components/leads/LeadsView';
import { AddLeadModal } from '@/components/leads/AddLeadModal';
import { CustomersView } from '@/components/customers/CustomersView';
import { SiteSurveysView } from '@/components/surveys/SiteSurveysView';
import { QuotationsView } from '@/components/quotations/QuotationsView';
import { QuotationBuilderModal } from '@/components/quotations/QuotationBuilderModal';
import { ProjectsView } from '@/components/projects/ProjectsView';
import { InventoryView } from '@/components/inventory/InventoryView';
import { InstallationView } from '@/components/installation/InstallationView';
import { MonitoringView } from '@/components/monitoring/MonitoringView';
import { ServiceView } from '@/components/service/ServiceView';
import { ReportsView } from '@/components/reports/ReportsView';
import { SettingsView } from '@/components/settings/SettingsView';

export default function SolarFlowApp() {
  const { activeTab } = useSolarFlow();

  // Mobile drawer state
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  // Global Quick Action Modals
  const [isAddLeadModalOpen, setIsAddLeadModalOpen] = useState(false);
  const [isQuotationModalOpen, setIsQuotationModalOpen] = useState(false);
  const [quotationParams, setQuotationParams] = useState<{ capacity?: number; customerId?: string }>({});

  const handleOpenQuotationWithParams = (capacity: number, customerId: string) => {
    setQuotationParams({ capacity, customerId });
    setIsQuotationModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Navigation Sidebar */}
      <Sidebar
        isOpenMobile={isMobileNavOpen}
        onCloseMobile={() => setIsMobileNavOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-64">
        {/* Sticky Header */}
        <Header
          onOpenMobileMenu={() => setIsMobileNavOpen(true)}
          onOpenAddLeadModal={() => setIsAddLeadModalOpen(true)}
          onOpenQuotationModal={() => {
            setQuotationParams({});
            setIsQuotationModalOpen(true);
          }}
        />

        {/* Dynamic View Router */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {activeTab === 'dashboard' && (
            <DashboardView
              onOpenAddLead={() => setIsAddLeadModalOpen(true)}
              onOpenQuotation={() => setIsQuotationModalOpen(true)}
            />
          )}

          {activeTab === 'leads' && (
            <LeadsView onOpenAddLead={() => setIsAddLeadModalOpen(true)} />
          )}

          {activeTab === 'customers' && <CustomersView />}

          {activeTab === 'surveys' && (
            <SiteSurveysView onOpenQuotationWithParams={handleOpenQuotationWithParams} />
          )}

          {activeTab === 'quotations' && (
            <QuotationsView
              isCreateModalOpen={isQuotationModalOpen}
              onCloseCreateModal={() => setIsQuotationModalOpen(false)}
              onOpenCreateModal={() => setIsQuotationModalOpen(true)}
              initialCapacity={quotationParams.capacity}
              initialCustomerId={quotationParams.customerId}
            />
          )}

          {activeTab === 'projects' && <ProjectsView />}

          {activeTab === 'inventory' && <InventoryView />}

          {activeTab === 'installation' && <InstallationView />}

          {activeTab === 'monitoring' && <MonitoringView />}

          {activeTab === 'service' && <ServiceView />}

          {activeTab === 'reports' && <ReportsView />}

          {activeTab === 'settings' && <SettingsView />}
        </main>
      </div>

      {/* Global Modals */}
      <AddLeadModal
        isOpen={isAddLeadModalOpen}
        onClose={() => setIsAddLeadModalOpen(false)}
      />

      {/* If quotation modal is triggered from header or other views while not on quotations tab */}
      {activeTab !== 'quotations' && (
        <QuotationBuilderModal
          isOpen={isQuotationModalOpen}
          onClose={() => setIsQuotationModalOpen(false)}
          initialCapacity={quotationParams.capacity}
          initialCustomerId={quotationParams.customerId}
        />
      )}

      {/* Interactive Toast Notifications */}
      <ToastContainer />
    </div>
  );
}
