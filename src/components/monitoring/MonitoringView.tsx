'use client';

import React from 'react';
import { useSolarFlow } from '@/context/SolarFlowContext';
import { Badge } from '@/components/ui/Badge';
import { formatCapacity, formatINR } from '@/utils/formatters';
import {
  Activity,
  Sun,
  Zap,
  Gauge,
  AlertTriangle,
  CheckCircle2,
  Thermometer,
  ShieldCheck,
  Cpu,
  ArrowUpRight,
  TrendingUp,
  CloudSun,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

export const MonitoringView: React.FC = () => {
  const {
    monitoredPlants,
    selectedPlantId,
    setSelectedPlantId,
    resolveAlert,
  } = useSolarFlow();

  const plant = monitoredPlants.find((p) => p.id === selectedPlantId) || monitoredPlants[0];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              Solar Telemetry & Plant Health
            </h2>
            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
              Live Simulation
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time generation telemetry, inverter operating temperatures & performance ratio (PR)
          </p>
        </div>

        {/* Plant Switcher */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-500">Select Plant:</span>
          <select
            value={plant.id}
            onChange={(e) => setSelectedPlantId(e.target.value)}
            className="px-3 py-2 text-xs font-bold border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none bg-white text-slate-800 shadow-xs"
          >
            {monitoredPlants.map((p) => (
              <option key={p.id} value={p.id}>
                {p.plantName} ({p.capacityKW} kW)
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Instantaneous Power */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Live Active Power</span>
            <div className="p-2 rounded-xl bg-amber-50 text-amber-600">
              <Zap className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {plant.currentGenerationKW}
            </span>
            <span className="text-xs font-bold text-amber-600 ml-1">kW</span>
            <span className="text-[11px] text-slate-400 block mt-0.5">
              of {plant.capacityKW} kWp Rated
            </span>
          </div>
          <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
            <span className="text-slate-500">Capacity Utilization</span>
            <span className="font-bold text-slate-800">
              {Math.round((plant.currentGenerationKW / plant.capacityKW) * 100)}%
            </span>
          </div>
        </div>

        {/* Today's Generation */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Daily Generation</span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
              <Sun className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {plant.dailyGenerationKWh.toLocaleString('en-IN')}
            </span>
            <span className="text-xs font-bold text-emerald-600 ml-1">kWh (Units)</span>
            <span className="text-[11px] text-slate-400 block mt-0.5">
              ~₹{(plant.dailyGenerationKWh * 8.5).toFixed(0)} electricity saved
            </span>
          </div>
          <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
            <span className="text-slate-500">Specific Yield</span>
            <span className="font-bold text-emerald-600">
              {(plant.dailyGenerationKWh / plant.capacityKW).toFixed(2)} kWh/kWp
            </span>
          </div>
        </div>

        {/* Performance Ratio (PR) */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Performance Ratio (PR)</span>
            <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
              <Gauge className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {plant.performanceRatio}%
            </span>
            <span className="text-[11px] text-slate-400 block mt-0.5">
              Target Benchmark: 78.0%
            </span>
          </div>
          <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
            <span className="text-slate-500">Plant Status</span>
            <Badge
              size="sm"
              variant={
                plant.plantHealth === 'Optimal'
                  ? 'success'
                  : plant.plantHealth === 'Warning'
                  ? 'warning'
                  : 'danger'
              }
            >
              {plant.plantHealth}
            </Badge>
          </div>
        </div>

        {/* Environmental / Lifetime */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Lifetime Carbon Offset</span>
            <div className="p-2 rounded-xl bg-teal-50 text-teal-600">
              <CloudSun className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {plant.co2SavedTons}
            </span>
            <span className="text-xs font-bold text-teal-600 ml-1">Tons CO₂</span>
            <span className="text-[11px] text-slate-400 block mt-0.5">
              Lifetime: {plant.lifetimeGenerationMWh} MWh
            </span>
          </div>
          <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
            <span className="text-slate-500">Trees Equivalent</span>
            <span className="font-bold text-teal-700">
              ~{Math.round(plant.co2SavedTons * 45)} mature trees
            </span>
          </div>
        </div>
      </div>

      {/* Hourly Generation Curve */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Sun className="w-4 h-4 text-amber-500" />
              Diurnal Solar Generation vs. Solar Irradiance
            </h3>
            <p className="text-xs text-slate-500">
              Synchronized 15-minute telemetry intervals & pyranometer readings
            </p>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <span className="flex items-center gap-1 text-slate-600 font-medium">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
              Inverter Output (kW)
            </span>
            <span className="flex items-center gap-1 text-slate-600 font-medium">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-300" />
              Irradiation (W/m²)
            </span>
          </div>
        </div>

        <div className="h-64 sm:h-80 w-full mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={plant.hourlyTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="monGen" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="time" stroke="#94a3b8" fontSize={11} tickLine={false} />
              <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
              <Tooltip
                formatter={(val: number, name: string) => [
                  name === 'generationKW' ? `${val} kW` : `${val} W/m²`,
                  name === 'generationKW' ? 'Power' : 'Irradiance',
                ]}
                contentStyle={{ backgroundColor: '#0f172a', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
              />
              <Area
                type="monotone"
                dataKey="generationKW"
                stroke="#f59e0b"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#monGen)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Inverter Status & Live Telemetry Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Inverter Units Performance */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Cpu className="w-4 h-4 text-solar-600" />
                String Inverter Status & Efficiency
              </h3>
              <p className="text-xs text-slate-500">
                {plant.inverters.length} grid-tied multi-MPPT inverters active
              </p>
            </div>
            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">
              All Connected
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
            {plant.inverters.map((inv) => (
              <div
                key={inv.id}
                className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition-colors space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 text-xs truncate">
                    {inv.name}
                  </span>
                  <Badge
                    size="sm"
                    variant={inv.status === 'Normal' ? 'success' : 'warning'}
                  >
                    {inv.status}
                  </Badge>
                </div>

                <div>
                  <div className="flex justify-between text-xs text-slate-500 mb-1">
                    <span>Current Output</span>
                    <span className="font-bold text-amber-600">{inv.currentOutputKW} kW</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                    <div
                      className="bg-amber-500 h-full rounded-full"
                      style={{ width: `${(inv.currentOutputKW / inv.capacityKW) * 100}%` }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px] pt-2 border-t border-slate-200/70">
                  <div>
                    <span className="text-slate-400 block">Efficiency</span>
                    <span className="font-bold text-slate-800">{inv.efficiency}%</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Temperature</span>
                    <span
                      className={`font-bold flex items-center gap-0.5 ${
                        inv.temperatureC > 50 ? 'text-rose-600' : 'text-slate-800'
                      }`}
                    >
                      <Thermometer className="w-3 h-3" />
                      {inv.temperatureC}°C
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Telemetry Alerts */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900">Telemetry Alerts</h3>
                <p className="text-xs text-slate-500">Automated diagnostic alerts</p>
              </div>
              <AlertTriangle className="w-4 h-4 text-amber-500" />
            </div>

            <div className="space-y-3 mt-3">
              {plant.alerts.length === 0 ? (
                <div className="text-center py-8 text-xs text-slate-400">
                  No alerts recorded. Plant running cleanly.
                </div>
              ) : (
                plant.alerts.map((alert) => (
                  <div
                    key={alert.id}
                    className={`p-3 rounded-xl border transition-all ${
                      alert.resolved
                        ? 'bg-white opacity-50 border-slate-200'
                        : alert.severity === 'Critical'
                        ? 'bg-rose-50/70 border-rose-200'
                        : 'bg-amber-50/70 border-amber-200'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span
                        className={`text-[10px] font-bold uppercase px-1.5 py-0.5 rounded ${
                          alert.severity === 'Critical'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {alert.severity}
                      </span>
                      <span className="text-[10px] text-slate-400">{alert.timestamp}</span>
                    </div>

                    <p className="text-xs text-slate-800 font-medium mt-1.5 leading-relaxed">
                      {alert.message}
                    </p>

                    {!alert.resolved && (
                      <div className="mt-2 text-right">
                        <button
                          onClick={() => resolveAlert(plant.id, alert.id)}
                          className="text-[11px] font-bold text-solar-700 hover:underline inline-flex items-center gap-1"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Acknowledge / Clear
                        </button>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 text-center">
            <span className="text-xs text-slate-400">
              Automatic polling simulation active &bull; Every 60s
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
