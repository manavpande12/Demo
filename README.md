# SolarFlow ☀️ — Solar EPC & Turnkey Installation Business Management System

A client-ready interactive frontend demonstration platform engineered specifically for **Commercial & Industrial (C&I)** and **Rooftop Solar EPC (Engineering, Procurement & Construction)** companies in India.

Built with **Next.js 14 (App Router)**, **TypeScript**, **Tailwind CSS**, **Recharts**, and **Lucide Icons**.

---

## 🚀 Quick Start

```bash
# 1. Open the project folder
cd D:\Code\sms

# 2. Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

To test production build:
```bash
npm run build
npm run start
```

---

## 🌟 Key Functional Modules

### 1. Executive Dashboard
- **5 High-Impact KPI Cards**: Total Leads, Active Clients, Active Projects, Grid-Commissioned Capacity (MWp), Contract Pipeline Value (₹ Cr).
- **Live Solar Generation Yield Curve**: 24-hour diurnal bell curve displaying inverter output (kW) vs. solar irradiance (W/m²), specific yield, and PR ratio.
- **Sales Inquiry Pipeline Funnel**: Horizontal funnel breakdown by inquiry stage.
- **Active Turnkey Projects**: Progress tracker across design, DISCOM sanction, and erection.
- **Upcoming Field Tasks**: Drone surveys, CEIG safety audits, and bi-directional meter installations.

### 2. Solar Leads & Pipeline Management
- Complete commercial inquiries table with search and multi-criteria filters (Status & Source).
- **Interactive Lead Capture**: Dialog to record contact details, shed/RCC roof type, expected kW, and state.
- **Inline Status Transitions**: Move leads from *New* → *Contacted* → *Survey Scheduled* → *Proposal Sent* → *Converted*.
- **Convert Action**: Automatically promotes lead into a customer record and establishes DISCOM profile.

### 3. Client Accounts & Utility Profiles
- Master accounts for Industrial, Commercial, Institutional, and Residential clients.
- Tracks **DISCOM utility** (MSEDCL, Torrent Power, BESCOM, PGVCL, TSSPDCL, etc.), **Sanctioned Contract Demand (kVA/kW)**, Consumer ID, and GSTIN.
- Detailed drill-down modal showing associated solar projects and historical quotation proposals.

### 4. Site Surveys & Feasibility Sizing
- Records roof specifications: Total Area, Shadow-free Usable Area (sq. ft.), Roof type (PEB Sheet, RCC Flat, Ground Mount).
- **Automated Frontend Solar Sizer**:
  - Automatically calculates recommended kW capacity based on available shadow-free area and monthly electricity consumption.
  - Computes annual estimated generation yield (kWh) and annual tariff savings.
- Direct "Create Proposal" action transferring survey capacity straight into the Quotation Builder.

### 5. Interactive Turnkey Quotation Engine
- **Itemized Bill of Quantities (BOQ)**:
  - Tier-1 Solar PV Modules (Waaree, Adani, Vikram, Tata Power).
  - Multi-MPPT String Inverters (Sungrow, Growatt, Solis).
  - Module Mounting Structures (MMS) (HDG rail-less standing seam, elevated RCC structures).
  - Balance of System (BOS), XLPO DC/AC cabling, chemical earthing, and switchgear.
  - Turnkey Erection & Civil installation charges.
  - DISCOM Net Metering Liaisoning & CEIG Statutory Approval fees.
  - Dynamic commercial discounts & Composite Solar EPC GST rate calculation (13.8%).
- **Print / PDF Proposal Modal**: Client-ready formal proposal document formatted with company letterhead, equipment specifications, payment terms, and 25-year warranty schedules.

### 6. EPC Projects & Milestone Execution
- Turnkey lifecycle stages:
  1. *Engineering & Design*
  2. *DISCOM Approvals & Grid Feasibility*
  3. *Material Procurement*
  4. *Civil & Structure Erection*
  5. *Electrical & Stringing*
  6. *Testing & CEIG Electrical Inspection*
  7. *Net Metering & Commissioning*
- Interactive progress slider and individual milestone status toggles.

### 7. Warehouse & Stock Inventory
- Real-time stock counts across Solar Panels, Inverters, Structures, DC Cables, Chemical Earthing, and MC4 Connectors.
- Low-stock threshold alerts with danger badges.
- Quick **+10 / -10 adjustment buttons** and "Add Material Item" modal.

### 8. Site Execution & Safety Checklists
- Project contractor assignment, field engineer tracking, and team size.
- **Interactive Safety & Quality Checklist**: Torque audits, pull-out tests, earthing pit resistance (< 2 Ohms), DC string conduit routing, and HT/LT interlocks.
- Toolbox talk safety compliance records.

### 9. Solar Telemetry & Plant Health Monitoring
- **Visual telemetry simulation**: Active power (kW), daily yield (kWh), monthly yield (MWh), lifetime generation, performance ratio (PR %), and CO₂ carbon offset.
- Multi-inverter individual telemetry: Inverter capacity, current output, conversion efficiency (%), and heatsink operating temperature (°C).
- Interactive alert management: Dust soiling warnings, thermal throttling notifications with one-click resolution.

### 10. Service & AMC Maintenance Desk
- Turnkey post-commissioning O&M ticket tracking.
- Categorized by priority (*Critical*, *High*, *Medium*, *Low*), technician assignment, and SLA commitments.
- Tracks AMC warranty status (*Active AMC*, *Complimentary Year 1*, *Expiring Soon*).

### 11. Executive Analytics & Reports
- **Sales & Pipeline Report**: Monthly contract bookings vs. target in ₹ Lakhs.
- **Milestone Audit**: Turnkey progress against schedules.
- **Solar Generation Yields**: Actual generation curve vs. P50 simulation benchmark.
- **O&M SLA Report**: Mean Time to Repair (MTTR) and customer retention metrics.
- **Revenue Realization**: Milestone-based billing (Advance, Dispatch, Erection, Sync).

### 12. System Settings & Customization
- Configurable EPC legal profile, GSTIN, PAN, and corporate address.
- Default statutory tax rates and equipment warranty terms.
- Notification dispatch simulation preferences.

---

## 💻 Tech Architecture

- **Framework**: Next.js 14 (App Router)
- **State Management**: React Context (`SolarFlowContext`) with localized React state
- **Styling**: Tailwind CSS (with bespoke `solar` and `eco` color accents)
- **Charts**: Recharts (AreaChart, BarChart, LineChart)
- **Icons**: Lucide React
- **Data**: Static mock datasets localized to Indian Solar C&I EPC business norms
