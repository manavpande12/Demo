<div align="center">

# 🏭 MFGFlow
### Enterprise Manufacturing Production Management System

**A high-precision, client-ready industrial SaaS platform engineered for Discrete & Process Manufacturing plants.**

[![Next.js](https://img.shields.io/badge/Next.js-16.3.5-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.x-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Vercel Deployment](https://img.shields.io/badge/Vercel-Production%20Live-black?style=for-the-badge&logo=vercel)](https://mms-six-rose.vercel.app)
[![Build Status](https://img.shields.io/badge/Build-Passing%20(Turbopack)-success?style=for-the-badge)](https://mms-six-rose.vercel.app)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

[**🌐 Explore Live Demo**](https://mms-six-rose.vercel.app) &nbsp;•&nbsp; [**📂 GitHub Repository**](https://github.com/manavpande12/Demo/tree/mfgflow) &nbsp;•&nbsp; [**📑 Implementation Docs**](https://github.com/manavpande12/Demo)

</div>

---

## 📌 Executive Overview

**MFGFlow** is an industrial-grade Manufacturing Production Management System demo tailored for discrete automotive, precision machining, and metal fabrication facilities. Built from the ground up to present to enterprise manufacturing leadership, plant managers, and operations directors, the application showcases real-time shop floor visibility, machine telemetry monitoring, overall equipment effectiveness (OEE) calculations, stoppage root-cause tracking, CMM quality audits, and warehouse SKU inventory management.

Unlike typical admin templates, **MFGFlow** adopts a strict **Light-Mode Industrial SaaS Design Language** crafted for high-contrast shop floor displays and plant managers' tablets. The entire architecture operates with **zero external backend or database dependencies**, executing all simulations, cross-module data cascades, and full **CRUD mutations** client-side with zero latency.

```
+-----------------------------------------------------------------------------------+
|                                  MFGFlow SHELL                                    |
|  [Plant Switcher: Mumbai / Pune / Chennai]  •  [Shift A / B / C]  •  [Live Sim]   |
+---------------------+-------------------------------------------------------------+
| NAVIGATION RAIL     | WORKSPACE VIEW CONTAINER                                    |
| • Dashboard         |  ┌───────────────────────────────────────────────────────┐  |
| • Production Orders |  │ KPI Metric Strip: Target Trajectory • OEE • Fleet %   │  |
| • Planning (Gantt)  |  ├───────────────────────────────────────────────────────┤  |
| • Machines (CRUD)   |  │ Live Production Trajectory vs. Target Curve           │  |
| • Downtime Analysis |  ├───────────────────────────┬───────────────────────────┤  |
| • Quality Control   |  │ Core Machine Fleet Status │ Real-Time Shop Alerts     │  |
| • Inventory (CRUD)  |  │ (Telemetry Gauges & Logs) │ (Pareto & Event Log)      │  |
| • Maintenance (PM)  |  └───────────────────────────┴───────────────────────────┘  |
| • Executive Reports | CROSS-MODULE DRAWERS & MODALS                               |
| • Settings          | Machine Specs • Order Details • Stock Adjust • Confirm Delete|
+---------------------+-------------------------------------------------------------+
```

---

## 🌟 Key Differentiators & Engineering Highlights

* ⚡ **Zero-Latency Reactive State**: Powered by a unified React Context (`PlantContext`) managing 10 interlinked operational models. Status updates cascade instantaneously across planning Gantts, machine allocations, and order drawers.
* 🕒 **Instant Pause / Resume Reactivity**: Batch pause/resume state mutations reflect in zero milliseconds across backlog tables, Gantt visual bars, and active modal ribbons without requiring drawer reloads.
* 🛠️ **Full Industrial CRUD Operations**:
  * **Machine Fleet**: Commission new shop-floor assets (`+ Add Machine`), edit operational specs/targets (`Edit Specifications`), and decommission obsolete equipment (`Decommission Asset`).
  * **Inventory Catalog**: Register new raw materials/parts (`+ Add Material`), update SKU specifications, conduct physical cycle count reconciliations, and discontinue inactive materials (`Delete SKU`).
  * **Production Work Orders**: Launch new production runs and safely remove cancelled orders with automatic schedule and machine cleanup.
* 🛡️ **Central Hazard Confirmation Modal**: High-safety destructive action dialog (`ConfirmDeleteModal`) equipped with hazard badges, entity identification, and confirmation validation.
* 📊 **Authentic Manufacturing Metrics**: Real-time formulas for **OEE** ($$\text{Availability} \times \text{Performance} \times \text{Quality}$$), hourly shift trajectories, Mean Time to Repair (MTTR), and dynamic total inventory valuation ($$\sum \text{Stock} \times \text{Cost}$$).
* 📱 **Fully Responsive Dual Navigation**: Collapsible desktop sidebar rail (expanded 260px / collapsed 70px with tooltips) paired with a responsive slide-out overlay drawer for tablets and mobile devices.
* 🎨 **100% Industrial Light-Mode Aesthetic**: High-contrast slate color system (`#f8fafc` canvas, `#ffffff` cards, `#0f172a` primary text) with operational status accents (Running `#16a34a`, Warning `#d97706`, Breakdown `#dc2626`, Maintenance `#9333ea`).

---

## 🚀 Interactive Live Showcase

Experience the fully functional production build online:

| Target | URL | Status |
| :--- | :--- | :--- |
| **Production Live** | [https://mms-six-rose.vercel.app](https://mms-six-rose.vercel.app) | ![Vercel](https://img.shields.io/badge/Ready-200_OK-success) |
| **Vercel Deployment** | [https://mms-dzvpjjesv-manav-pandes-projects.vercel.app](https://mms-dzvpjjesv-manav-pandes-projects.vercel.app) | ![Vercel](https://img.shields.io/badge/Production-Active-blue) |
| **GitHub Branch** | [https://github.com/manavpande12/Demo/tree/mfgflow](https://github.com/manavpande12/Demo/tree/mfgflow) | ![Branch](https://img.shields.io/badge/Branch-mfgflow-orange) |

---

## 🏭 Core Functional Modules

### 1. Plant Overview & Executive Dashboard
* **Shift Trajectory Analytics**: Real-time Recharts line/area curves comparing actual hourly parts production against scheduled hourly target quotas for Shift A ($$06:00 - 14:00$$).
* **High-Impact Metric Strip**: Live calculations for Total Production Today, Plant OEE ($$82.6\%$$ with drift simulation), Machine Availability ($$91.4\%$$), Scrap Rate ($$1.9\%$$), Downtime Hours, and Active Fleet Size ($$7 / 10$$ running).
* **Active Station Roster**: Status badges (`RUNNING`, `IDLE`, `BREAKDOWN`), current batch assignments, and one-click drawer inspection for each workstation.
* **Shop-Floor Alert Feed**: Live notification cards categorized by Machine, Inventory, Production, and Quality with priority tags.

### 2. Production Work Orders
* **Manufacturing Order Tracking**: Monitor orders (`MO-10245` through `MO-10252`) detailing product name, SKU code, priority rating, target quantity, produced output, and percentage completion.
* **Interactive Order Details Drawer**:
  * Visual progress bar and units balance.
  * Synchronized machine assignment details with live telemetry link.
  * Direct Bill of Materials (BOM) inventory allocation.
  * CMM Quality Inspection pass/fail indicator.
  * **Instant Action Controls**: Toggle order status (*In Progress* $\leftrightarrow$ *Paused*) with zero latency.
  * **Order Removal**: Safely delete work orders with automated cascade cleanup.
* **New Order Modal**: Form to launch work orders with batch numbers, SKU selection, customer reference, priority, and assigned machining station.

### 3. Production Planning & Visual Gantt Schedule
* **Interactive Gantt Timeline**: Dynamic hourly timeline grid ($$06:00$$ to $$18:00$$) displaying active machine assignments, scheduled job bars, and completion percentages.
* **Instant Pause / Resume Toggle**: Backlog table includes one-click status buttons that immediately update order status, timeline bar colors, and context state.
* **Interactive Scheduling Adjustments**:
  * Inline dropdowns to reassign target machines in real time.
  * Priority shifter (*Urgent*, *High*, *Medium*, *Low*) syncing directly with floor dispatch queues.
  * Filter schedules by Shift (Shift A, Shift B, Shift C) or Line (Machining Bay 1, Stamping Line 2, Sub-Assembly).

### 4. Machine Fleet Management (Full CRUD)
* **Comprehensive Asset Fleet Cards**: Detailed cards for CNCs, Hydraulic Presses, Assembly Lines, and Robotic Welders.
* **Live Sensor Telemetry Simulation**:
  * Real-time Spindle Speed (RPM), Operating Temperature ($$^\circ\text{C}$$), and Vibration ($$\text{mm/s}$$).
  * 60-minute historical telemetry LineCharts with threshold indicators.
  * Runtime accumulator ($$\text{hours} + \text{minutes}$$) since shift commencement.
* **Full Asset CRUD Operations**:
  * **`+ Add Machine` Modal**: Register new assets with Code, Name, Equipment Type, Department, Model, Installation Year, Operator, and Initial Status.
  * **`Edit Specifications` Modal**: Modify machine metadata, assigned bay, operator, and target OEE benchmark.
  * **`Decommission Asset` Action**: Remove obsolete equipment via safety confirmation modal.
  * *Dynamic Fleet Metrics*: Fleet KPI cards update dynamically upon asset addition or removal.

### 5. Downtime & Stoppage Analysis
* **Live Incident Register**: Tracks active and historical line stoppages (e.g. `DT-801` Hydraulic Pressure Loss on Press-202).
* **Pareto Root-Cause Breakdown**: Recharts breakdown chart visualizing stoppage hours across Mechanical, Electrical, Tooling, Material Starvation, and Operator Setup.
* **Mean Time to Repair (MTTR)**: Automatic calculation of average resolution turnaround across incidents.
* **One-Click Stoppage Resolution**: Resolving a downtime incident updates the log, restores the machine to operational status (`RUNNING`), revs spindle speed, and clears active breakdown alerts.

### 6. Quality Assurance & CMM Inspections
* **Inspection Register**: CMM dimensional audits, surface roughness tests, and metallurgical hardness checks.
* **Scrap Rate & Tolerance Gauges**: Dynamic rejection percentage tracking against plant tolerance threshold ($$\le 2.0\%$$).
* **Defect Pareto Classification**: Categorizes defects by type (Dimensional Out-of-Spec, Surface Scratch, Bore Ovality, Burr/Flashing).
* **Cross-Module Batch Link**: Click any inspection to immediately navigate to the producing machine or active production order.

### 7. Material Inventory & Warehouse (Full CRUD)
* **Real-Time SKU Catalog**: Raw materials (Cold Rolled Steel, ADC12 Aluminium, Brass Rods), WIP components, consumables, and spare parts.
* **Full Material CRUD Operations**:
  * **`+ Add Material` Modal**: Register new SKUs with SKU code, category, initial stock, safety minimum, unit, rack location, and unit cost.
  * **`Edit SKU Details` Modal**: Edit material specification, storage bay, reorder thresholds, and unit purchasing price.
  * **`Delete SKU` Action**: Discontinue inventory items with safety confirmation.
  * **Stock Health Auto-Tagger**: Automatic tagging as `Healthy`, `Low Stock`, or `Out of Stock`.
* **Stock Reconciliation Drawer & History**:
  * Cycle count physical adjustment form.
  * Transaction history ledger (PO Inward, Damaged Reject, Cycle Discrepancy, Bay Transfer).
  * Links to active production batches consuming each material.
  * *Dynamic Valuation*: Total inventory valuation ($$\text{₹ Lakhs}$$) dynamically updates on all additions, edits, and stock adjustments.

### 8. Preventive Maintenance (PM)
* **Work Order Management**: Tracks maintenance tickets (`WO-9024`, `WO-9025`) across Emergency Breakdown, Preventive (PM), and Predictive Maintenance.
* **Interactive Maintenance Checklist**: Multi-step technician task checklists (Filter replacement, hydraulic pressure calibration, sensor diagnostic test).
* **Technician Scheduling**: Dispatch work orders to plant engineers with estimated duration and line impact analysis.

### 9. Executive Reports Generator
* **7 Comprehensive Industrial Reports**:
  1. *Daily Production Summary* (Output, Target Variance, Line Efficiency)
  2. *Plant OEE Breakdown* (Availability, Performance, Quality factors)
  3. *Machine Downtime Analysis* (Stoppage logs, Pareto categories, MTTR)
  4. *Quality & Scrap Report* (First Pass Yield, Inspection logs, Scrap value)
  5. *Inventory Valuation & Stock Health* (ABC classification, Reorder alerts)
  6. *Preventive Maintenance Audit* (PM compliance, Technician turnaround)
  7. *Shift Handover Report* (Output by shift, open incidents, operator notes)
* **Export & Preview Engine**: In-modal interactive data table preview and one-click client-side **CSV Export** downloading formatted spreadsheet reports.

### 10. Plant Settings & Industrial Configuration
* **Plant Identity**: Company name, Plant registration code, Physical address, GSTIN tax registration number.
* **Shift Configuration**: Operating hours and shift handover buffer configuration for Shift A, Shift B, and Shift C.
* **Threshold Triggers**: Warning and critical threshold sliders for Machine Temperature ($$65^\circ\text{C} - 80^\circ\text{C}$$) and Vibration ($$2.5\,\text{mm/s} - 4.0\,\text{mm/s}$$).
* **Notification Simulation**: Email, SMS, and WhatsApp alert toggle simulations.

---

## 🔄 Cross-Module Interconnectivity Matrix

Every entity in **MFGFlow** is interconnected to simulate true plant ERP/MES behavior:

| Source Entity | Linked Entities | Operational Behavior |
| :--- | :--- | :--- |
| **Production Order** | Machine, Inventory SKUs, Quality Inspection | Assigning an order reserves machine time; opening order drawer displays consumed raw materials and CMM inspection records. |
| **Machine Asset** | Current Order, Active Downtime, Maintenance Ticket | Machine cards display active order badges, breakdown trip alerts, and scheduled PM work orders. |
| **Downtime Incident** | Machine, Affected Order Batch, Maintenance WO | Breakdown automatically pauses the running order on that machine; resolving downtime restores machine state to `RUNNING`. |
| **Inventory SKU** | Active Production Orders, Safety Stock Alerts | Inventory items list all ongoing batches reserving that material; low-stock status triggers header notifications. |
| **Quality Inspection** | Production Order, Machining Station, Defect Log | Failed inspection flags the specific batch and links back to the producing machine for calibration checks. |
| **Maintenance Ticket** | Target Machine, Downtime Stoppage | Completing maintenance tasks marks the incident resolved and clears error flags from the machine card. |

---

## 💻 Tech Stack & Architecture

| Layer | Technologies | Role in MFGFlow |
| :--- | :--- | :--- |
| **Framework** | Next.js 16.3.5 (App Router, Turbopack) | Modern server-rendered foundation with optimized client boundary bundles. |
| **Language** | TypeScript 5.x | Strict end-to-end typing for all 10 domain entities, state mutations, and component props. |
| **Styling** | Tailwind CSS v4 | High-performance CSS engine powering the bespoke light-mode industrial design system. |
| **State Management** | React Context API (`PlantContext`) | Centralized state engine managing synchronous cross-module state cascades and mutations. |
| **Charts** | Recharts | High-visibility responsive LineCharts, AreaCharts, and BarCharts with custom tooltips. |
| **Icons** | Lucide React | Clean, scalable industrial icons (gauges, machinery, tools, checklists, alerts). |
| **Deployment** | Vercel Platform | Zero-configuration continuous production deployment on Vercel's global edge network. |

---

## 📂 Project Structure

```
D:\Code\mms\
├── public/                     # Static assets and favicons
├── src/
│   ├── app/
│   │   ├── globals.css         # Industrial theme tokens & Tailwind directives
│   │   ├── layout.tsx          # Root metadata, viewport, and HTML structure
│   │   └── page.tsx            # Main application shell & global modal mounting
│   ├── components/
│   │   ├── dashboard/          # Plant Overview, KPI strip, Trajectory chart, Station table
│   │   ├── downtime/           # Stoppage incident table, Pareto chart, MTTR tracker
│   │   ├── inventory/          # SKU warehouse catalog, Stock health badges, Valuation tile
│   │   ├── layout/             # Responsive Sidebar (rail + drawer), Header, Global Search
│   │   ├── machines/           # Fleet grid, Telemetry gauges, Asset actions
│   │   ├── maintenance/        # PM tickets, Technician assignments, Task checklists
│   │   ├── modals/             # 10 dedicated drawers and action dialogs:
│   │   │   ├── AdjustStockModal.tsx        # Stock adjustment & InventoryDetailDrawer
│   │   │   ├── ConfirmDeleteModal.tsx      # Central safety confirmation modal
│   │   │   ├── EditInventoryModal.tsx      # Material SKU modification dialog
│   │   │   ├── EditMachineModal.tsx        # Machine specification edit dialog
│   │   │   ├── LogDowntimeModal.tsx        # Stoppage logging modal
│   │   │   ├── MachineDetailsDrawer.tsx    # Telemetry history & machine actions drawer
│   │   │   ├── NewInventoryModal.tsx       # New material registration dialog
│   │   │   ├── NewMachineModal.tsx         # New machine commissioning dialog
│   │   │   ├── NewOrderModal.tsx           # Production order dispatch dialog
│   │   │   ├── OrderDetailsDrawer.tsx      # Work order drill-down & reactive pause/resume
│   │   │   ├── ReportPreviewModal.tsx      # Report data table modal
│   │   │   └── ScheduleMaintenanceModal.tsx# PM dispatch modal
│   │   ├── planning/           # Visual Gantt schedule timeline, Backlog table
│   │   ├── production/         # Work orders table, Priority badges, Row actions
│   │   ├── quality/            # CMM inspections, Defect classification, Tolerance meter
│   │   ├── reports/            # 7 configurable industrial report cards & CSV generator
│   │   ├── settings/           # Plant parameters, Shift timetables, Trip thresholds
│   │   └── ui/                 # Atomic UI components: Badge, Button, Card, Drawer, Modal, Toast
│   ├── context/
│   │   └── PlantContext.tsx    # Global state provider: full CRUD mutations, simulation timer
│   ├── data/                   # Realistic static manufacturing datasets:
│   │   ├── downtime-quality.ts # Incidents, Defect Pareto benchmarks
│   │   ├── inventory-maintenance.ts# Raw materials, BOM linkages, PM tickets
│   │   ├── machines.ts         # Machine fleet roster & initial sensor telemetry
│   │   ├── mockData.ts         # Central aggregate data barrel export
│   │   └── orders.ts           # Work orders & Gantt scheduling tasks
│   ├── types/
│   │   └── index.ts            # TypeScript interfaces for all plant domain models
│   └── utils/
│       ├── cn.ts               # Class name utility (clsx + twMerge)
│       └── exportCsv.ts        # Client-side CSV report formatter and downloader
├── package.json
└── tsconfig.json
```

---

## 🛠️ Installation & Local Development

### Prerequisites
* **Node.js**: `v18.18.0` or higher (Node.js 20+ / 24+ recommended)
* **npm**: `v9.x` or higher

### Step-by-Step Setup

```bash
# 1. Clone the repository and switch to the mfgflow branch
git clone https://github.com/manavpande12/Demo.git
cd Demo
git checkout mfgflow

# Or if developing directly inside D:\Code\mms:
cd D:\Code\mms

# 2. Install project dependencies
npm install

# 3. Start the Next.js development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your web browser.

### Building for Production

To create an optimized production build and verify TypeScript type checking:

```bash
# Run production build with Next.js Turbopack
npm run build

# Start production server locally on port 3000
npm run start -- -p 3000
```

---

## 🎨 Design System & UI Specifications

* **Color System**:
  * `Canvas Base`: Slate-50 (`#f8fafc`)
  * `Surface Cards`: Pure White (`#ffffff`) with Slate-200 (`#e2e8f0`) borders
  * `Primary Industrial Brand`: Deep Cobalt Blue (`#2563eb`)
  * `Operational Nominal / Running`: Emerald-600 (`#16a34a`)
  * `Operational Standby / Caution`: Amber-600 (`#d97706`)
  * `Breakdown / Critical Stoppage`: Rose-600 (`#dc2626`)
  * `Preventive Maintenance`: Purple-600 (`#9333ea`)
* **Typography**:
  * Headers and UI controls: **Geist Sans**
  * Telemetry values, SKU codes, timestamps, and order identifiers: **Geist Mono**
* **Responsive Breakpoints**:
  * Desktop ($$\ge 1024\text{px}$$): Full sidebar rail with collapse toggle.
  * Tablet & Mobile ($$< 1024\text{px}$$): Overlay slide-out navigation drawer with top bar hamburger control.

---

## 📄 License & Attribution

This project is built and maintained by [**Manav Pande**](https://github.com/manavpande12).  
Licensed under the [MIT License](LICENSE).
