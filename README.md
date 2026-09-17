<div align="center">

# ☀️ SolarFlow
### Commercial & Industrial (C&I) Solar EPC Business Management System

**An end-to-end turnkey solar EPC platform engineered for Rooftop, Ground Mount, and Institutional solar developers in India.**

[![Next.js](https://img.shields.io/badge/Next.js-14.x-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.x-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Vercel Deployment](https://img.shields.io/badge/Vercel-Production%20Live-black?style=for-the-badge&logo=vercel)](https://solarflow-rouge.vercel.app)
[![Build Status](https://img.shields.io/badge/Build-Passing-success?style=for-the-badge)](https://solarflow-rouge.vercel.app)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

[**🌐 Explore Live Demo**](https://solarflow-rouge.vercel.app) &nbsp;•&nbsp; [**📂 GitHub Repository**](https://github.com/manavpande12/Demo/tree/solarflow) &nbsp;•&nbsp; [**📑 Implementation Docs**](https://github.com/manavpande12/Demo)

</div>

---

## 📌 Executive Overview

**SolarFlow** is a client-ready, turnkey business management platform designed specifically for **Commercial & Industrial (C&I)** and **Rooftop Solar EPC (Engineering, Procurement & Construction)** developers operating under Indian regulatory frameworks.

From initial client inquiry and drone site feasibility surveys, to automated Bill of Quantities (BOQ) quotation generation, DISCOM net metering statutory liaisoning, 7-stage turnkey project erection, and live IoT inverter telemetry monitoring — **SolarFlow** unifies the entire solar asset lifecycle into a unified, high-performance interface.

Built with **Next.js 14 App Router**, **TypeScript**, and **Tailwind CSS**, the entire system runs client-side with rich localized static models simulating real-world Indian utility tariffs, DISCOM guidelines, CEIG electrical inspections, and multi-tier solar warranties.

```
+-----------------------------------------------------------------------------------+
|                                  SolarFlow SHELL                                  |
|  [Capacity: 48.6 MWp Installed]  •  [Pipeline: ₹42.8 Cr]  •  [Active Sites: 18]   |
+---------------------+-------------------------------------------------------------+
| EPC MODULES         | WORKSPACE VIEW CONTAINER                                    |
| • Executive Dash    |  ┌───────────────────────────────────────────────────────┐  |
| • CRM & Inquiries   |  │ KPI Strip: Commissioned MWp • Yield PR • Contract Value│  |
| • Client Profiles   |  ├───────────────────────────────────────────────────────┤  |
| • Site Surveys      |  │ 24h Diurnal Solar Bell Curve (Irradiance vs. kW Yield)│  |
| • BOQ Proposal Gen  |  ├───────────────────────────┬───────────────────────────┤  |
| • Turnkey Projects  |  │ Active Turnkey Milestones │ Sales Pipeline Funnel     │  |
| • Warehouse Stock   |  │ (Design → Erection → Grid)│ (New → Survey → Converted)│  |
| • Safety Compliance |  └───────────────────────────┴───────────────────────────┘  |
| • Plant Telemetry   | CLIENT-FACING PROPOSAL ENGINE                               |
| • AMC Service Desk  | Formal Letterhead Proposals • BOQ Engine • DISCOM Sanctions |
+---------------------+-------------------------------------------------------------+
```

---

## 🌟 Key Differentiators & Industry Specializations

* 🌞 **Automated Solar Feasibility Sizer**: Automatically calculates recommended system capacity ($$\text{kWp}$$), panel count, estimated annual generation yield ($$\text{kWh}$$), and client power bill savings based on shadow-free rooftop area and monthly consumption.
* ⚡ **Itemized Solar BOQ & Quotation Engine**:
  * Tier-1 Solar PV Modules (Waaree, Adani Solar, Vikram Solar, Tata Power).
  * High-efficiency String & Central Inverters (Sungrow, Solis, Growatt).
  * Module Mounting Structures (HDG standing-seam sheet clamps, elevated RCC ballasts).
  * Balance of System (BOS) XLPO DC/AC solar cables, chemical earth pits, and HT/LT switchgear.
  * Turnkey civil foundation, module erection, and structural load testing.
  * DISCOM Net Metering Liaisoning & CEIG Chief Electrical Inspectorate sanction fees.
  * Dynamic GST calculation adhering to Indian Ministry of Finance composite solar EPC tax guidelines ($$13.8\%$$ blended rate).
* 📄 **Printable Formal Proposal Document**: Generates comprehensive, client-facing PDF-ready proposals with legal letterheads, equipment datasheets, milestone payment schedules, and 25-year performance warranties.
* 🏛️ **Indian DISCOM Regulatory Framework**: Pre-configured utility profiles for major Indian power distribution utilities: **MSEDCL** (Maharashtra), **Torrent Power** (Gujarat), **BESCOM** (Karnataka), **PGVCL** (Gujarat), **TSSPDCL** (Telangana), **Tata Power** (Mumbai/Delhi).
* 📡 **Solar Telemetry & Performance Ratio (PR)**: Real-time diurnal generation bell curves, multi-inverter MPPT string metrics, heatsink temperature monitoring, dust soiling alerts, and carbon offset calculations.
* 🦺 **Industrial EHS & Field Safety Checklists**: Torque wrench tightening verification, earth pit resistance audits ($$< 2.0\,\Omega$$), insulation resistance megger tests, and daily Toolbox Talk compliance.

---

## 🚀 Interactive Live Showcase

Experience the fully functional production build online:

| Target | URL | Status |
| :--- | :--- | :--- |
| **Production Live** | [https://solarflow-rouge.vercel.app](https://solarflow-rouge.vercel.app) | ![Vercel](https://img.shields.io/badge/Ready-200_OK-success) |
| **GitHub Branch** | [https://github.com/manavpande12/Demo/tree/solarflow](https://github.com/manavpande12/Demo/tree/solarflow) | ![Branch](https://img.shields.io/badge/Branch-solarflow-orange) |

---

## 🏢 Core Functional Modules

### 1. Executive Dashboard & Solar Yield Analytics
* **Diurnal Bell Curve**: Real-time hourly solar output trajectory comparing inverter generation ($$\text{kW}$$) against solar irradiance ($$\text{W/m}^2$$) from $$06:00$$ to $$18:00$$.
* **High-Impact Metric Strip**: Total Commissioned Capacity ($$48.6\,\text{MWp}$$), Contract Pipeline ($$\text{₹}42.8\,\text{Cr}$$), Active Turnkey Projects ($$18$$ sites), Fleet Performance Ratio ($$81.4\%$$ PR), and Lifetime Carbon Offset ($$52,400\,\text{tCO}_2$$).
* **Pipeline Funnel**: Visual commercial pipeline progression across Inquiry, Feasibility, Proposal Sent, and Converted.
* **Upcoming Field Operations**: Drone aerial surveys, CEIG statutory safety audits, and bi-directional meter synchronization dates.

### 2. Solar Leads & Commercial Pipeline (CRM)
* **Lead Capture**: Record commercial leads with contact info, industry category, rooftop area, and current DISCOM electricity tariff rate.
* **Filter & Search**: Multi-criteria filters by lead qualification status (*New*, *Contacted*, *Survey Scheduled*, *Proposal Sent*, *Converted*) and roof substrate.
* **One-Click Lead Conversion**: Promotes prospective commercial leads directly into registered client utility accounts with connected feasibility studies.

### 3. Client Accounts & DISCOM Utility Profiles
* **Enterprise Client Master**: Comprehensive profiles for Industrial, Commercial, Institutional, and High-Net-Worth Residential clients.
* **Statutory Utility Fields**: Captures **DISCOM Name**, **Sanctioned Contract Demand** ($$\text{kVA / kW}$$), **Consumer Number (CA ID)**, Tariff Category (HT-I Industrial, LT Commercial), and GSTIN.
* **Linked Project Portfolio**: Interactive view showing all past and ongoing solar installations for each client.

### 4. Site Surveys & Feasibility Sizing
* **Rooftop & Ground Survey Capture**: Log total area, shadow-free usable area ($$\text{sq. ft.}$$), structural roof type (Trapezoidal PEB Metal Sheet, RCC Flat Slab, Ground Mount), and azimuth tilt angle.
* **Automated Solar Sizer**:
  * Calculates maximum viable DC capacity ($$\text{kWp}$$) and physical panel footprint.
  * Estimates expected annual electricity generation ($$\text{kWh/year}$$) based on local Global Horizontal Irradiance (GHI).
  * Computes projected annual electricity bill savings based on client grid tariffs.
* **Direct Proposal Dispatch**: Automatically transfers calculated sizing parameters directly into the Quotation Proposal Generator.

### 5. Interactive Turnkey Quotation Engine
* **Dynamic Bill of Quantities (BOQ)**:
  * Select PV module brand, wattage, and total quantity.
  * Configure string inverter models and MPPT channel distribution.
  * Select mounting structure metallurgy (Aluminium rail-less, Hot Dip Galvanized 80-micron steel).
  * Itemized statutory liaisoning and CEIG approval fees.
  * Real-time composite GST calculation ($$13.8\%$$ blended rate).
* **Formal Client Proposal Modal**: Generates executive proposals with company letterhead, client DISCOM profile, technical specifications, financial ROI analysis, payback period, and 25-year linear performance warranty guarantees.

### 6. EPC Projects & Turnkey Milestone Tracker
* **7-Stage Turnkey Project Execution**:
  1. *Engineering & Structural Design*
  2. *DISCOM Net Metering Approval & Grid Feasibility*
  3. *Material Procurement & Site Dispatch*
  4. *Civil Foundations & Structure Erection*
  5. *Electrical Stringing & Inverter Installation*
  6. *Testing, Meggering & CEIG Statutory Inspection*
  7. *Bi-directional Meter Installation & Grid Synchronization*
* **Interactive Project Sliders**: Real-time project progress sliders and individual milestone completion toggles.

### 7. Warehouse & Stock Inventory
* **Material Catalog**: Real-time stock counts across Tier-1 PV Modules, Inverters, ACDB/DCDB junction boxes, XLPO solar cables, Chemical Earth Electrodes, and MC4 Connectors.
* **Stock Adjustments**: Quick `+10` / `-10` physical adjustment buttons and "Add Material" modal.
* **Low-Stock Safety Badges**: Visual alerts when inventory levels fall below safety thresholds.

### 8. Site Execution & Safety Compliance (EHS)
* **Contractor & Engineer Management**: Assign field contractors, site engineers, and installation crew sizes.
* **Interactive Safety Audit Checklist**:
  * Structural torque wrench audit ($$24\,\text{Nm}$$ clamp tightening).
  * Earth pit resistance measurement ($$< 2.0\,\Omega$$ with Megger).
  * DC string polarity and open-circuit voltage ($$V_{\text{oc}}$$) verification.
  * HT/LT breaker interlocks and surge protection devices (SPD).
  * Daily Toolbox Talk (TBT) workforce safety records.

### 9. Solar Telemetry & Plant Health Monitoring
* **Live Inverter Telemetry**: Real-time simulation of Active Power ($$\text{kW}$$), Daily Yield ($$\text{kWh}$$), Total Yield ($$\text{MWh}$$), and Inverter Conversion Efficiency ($$\%$$).
* **Multi-Inverter Telemetry Grid**: Monitor individual string inverters, heatsink temperatures ($$^\circ\text{C}$$), and operational health.
* **IoT Alarm Clearing**: Real-time detection and one-click resolution of dust soiling losses and thermal throttling.

### 10. Service & AMC Maintenance Desk
* **O&M Ticket Management**: Service tickets for post-commissioning maintenance, categorized by urgency (*Critical*, *High*, *Medium*, *Low*).
* **Technician Dispatch**: Assign specialized solar technicians with SLA commitment resolution tracking.
* **AMC Warranty Tracking**: Tracks active Annual Maintenance Contracts (AMC), complimentary warranty periods, and renewals.

### 11. Executive Analytics & Reports
* **Contract Bookings vs. Quotas**: Monthly commercial contract revenue trajectory.
* **Turnkey Milestone Realization**: Billing realization tracking (Advance, Material Dispatch, Structural Erection, Grid Sync).
* **P50 Simulation vs. Actual Generation**: Compares empirical plant yield against solar irradiance P50 engineering benchmarks.

### 12. EPC System Settings
* **Company Legal Profile**: Solar EPC company legal name, corporate office address, PAN, and GSTIN registration.
* **Statutory Tax Rates**: Configurable composite GST percentages and CEIG statutory processing fees.
* **System Preferences**: Currency, measurement units, and automated dispatch simulation toggles.

---

## 💻 Tech Stack & Architecture

| Layer | Technologies | Role in SolarFlow |
| :--- | :--- | :--- |
| **Framework** | Next.js 14 (App Router) | High-performance React framework with server components and client boundary optimization. |
| **Language** | TypeScript 5.x | Comprehensive type definitions for solar sizing models, BOQ items, DISCOM utilities, and telemetry. |
| **Styling** | Tailwind CSS | Utility-first CSS engine with bespoke solar amber and clean green accent palettes. |
| **State Management** | React Context (`SolarFlowContext`) | Centralized client-side state engine managing cross-module mutations with zero lag. |
| **Charts** | Recharts | Responsive diurnal generation bell curves, sales funnels, and revenue charts. |
| **Icons** | Lucide React | High-clarity icons for solar panels, sun irradiance, inverters, meters, and tools. |
| **Hosting** | Vercel Platform | Continuous production deployment on Vercel's global edge infrastructure. |

---

## 🛠️ Installation & Local Development

### Prerequisites
* **Node.js**: `v18.18.0` or higher
* **npm**: `v9.x` or higher

### Step-by-Step Setup

```bash
# 1. Clone the repository and switch to the solarflow branch
git clone https://github.com/manavpande12/Demo.git
cd Demo
git checkout solarflow

# Or if developing directly inside D:\Code\sms:
cd D:\Code\sms

# 2. Install dependencies
npm install

# 3. Launch local development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your web browser.

### Building for Production

```bash
# Verify build and static generation
npm run build

# Run local production server
npm run start
```

---

## 📄 License & Attribution

Developed and maintained by [**Manav Pande**](https://github.com/manavpande12).  
Licensed under the [MIT License](LICENSE).
