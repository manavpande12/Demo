"use client";

import React, { useState, useEffect } from "react";
import { Search, Cpu, Boxes, Package, ArrowRight, X } from "lucide-react";
import { usePlant } from "../../context/PlantContext";

export function GlobalSearchModal() {
  const {
    isGlobalSearchOpen,
    setIsGlobalSearchOpen,
    machines,
    orders,
    inventory,
    setActiveTab,
    setSelectedMachine,
    setSelectedOrder,
    setSelectedInventory,
  } = usePlant();

  const [query, setQuery] = useState("");

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setIsGlobalSearchOpen(!isGlobalSearchOpen);
      }
      if (e.key === "Escape" && isGlobalSearchOpen) {
        setIsGlobalSearchOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isGlobalSearchOpen, setIsGlobalSearchOpen]);

  if (!isGlobalSearchOpen) return null;

  const q = query.toLowerCase().trim();

  const filteredMachines = machines.filter(
    (m) =>
      m.name.toLowerCase().includes(q) ||
      m.code.toLowerCase().includes(q) ||
      m.department.toLowerCase().includes(q)
  );

  const filteredOrders = orders.filter(
    (o) =>
      o.id.toLowerCase().includes(q) ||
      o.product.toLowerCase().includes(q) ||
      o.machineName.toLowerCase().includes(q)
  );

  const filteredInventory = inventory.filter(
    (i) =>
      i.name.toLowerCase().includes(q) ||
      i.code.toLowerCase().includes(q) ||
      i.category.toLowerCase().includes(q)
  );

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-20 p-3 sm:p-4 animate-in fade-in duration-150">
      <div
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs"
        onClick={() => setIsGlobalSearchOpen(false)}
      />
      <div className="relative w-full max-w-xl rounded-xl border border-slate-200 bg-white text-slate-900 shadow-2xl overflow-hidden z-10 flex flex-col">
        {/* Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-slate-100 gap-3 bg-slate-50/50">
          <Search className="w-5 h-5 text-slate-400 shrink-0" />
          <input
            type="text"
            placeholder="Search machines, work orders, materials, parts..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
            className="flex-1 bg-transparent text-sm text-slate-900 placeholder-slate-400 focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="text-slate-400 hover:text-slate-700 p-1 rounded"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="text-[10px] font-mono bg-white text-slate-500 px-1.5 py-0.5 rounded border border-slate-200 shadow-2xs">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div className="max-h-96 overflow-y-auto p-3 space-y-4">
          {/* Machines */}
          {filteredMachines.length > 0 && (
            <div>
              <p className="text-[10px] font-mono uppercase tracking-wider text-slate-400 px-2 mb-1.5">
                Machines ({filteredMachines.length})
              </p>
              <div className="space-y-1">
                {filteredMachines.slice(0, 4).map((m) => (
                  <button
                    key={m.id}
                    onClick={() => {
                      setSelectedMachine(m);
                      setActiveTab("machines");
                      setIsGlobalSearchOpen(false);
                    }}
                    className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 text-left text-xs transition-colors group"
                  >
                    <div className="flex items-center gap-2.5">
                      <Cpu className="w-4 h-4 text-blue-600" />
                      <span className="font-mono font-bold text-slate-900">{m.code}</span>
                      <span className="text-slate-500 truncate max-w-xs">{m.name}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-slate-400 font-mono">
                      <span>{m.status}</span>
                      <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 text-slate-600 transition-opacity" />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Orders */}
          {filteredOrders.length > 0 && (
            <div>
              <p className="text-[10px] font-mono uppercase tracking-wider text-slate-400 px-2 mb-1.5">
                Production Orders ({filteredOrders.length})
              </p>
              <div className="space-y-1">
                {filteredOrders.slice(0, 4).map((o) => (
                  <button
                    key={o.id}
                    onClick={() => {
                      setSelectedOrder(o);
                      setActiveTab("production");
                      setIsGlobalSearchOpen(false);
                    }}
                    className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 text-left text-xs transition-colors group"
                  >
                    <div className="flex items-center gap-2.5">
                      <Boxes className="w-4 h-4 text-emerald-600" />
                      <span className="font-mono font-bold text-slate-900">{o.id}</span>
                      <span className="text-slate-600 truncate">{o.product}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-slate-400 font-mono">
                      <span>{o.status}</span>
                      <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 text-slate-600 transition-opacity" />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Inventory */}
          {filteredInventory.length > 0 && (
            <div>
              <p className="text-[10px] font-mono uppercase tracking-wider text-slate-400 px-2 mb-1.5">
                Inventory &amp; Materials ({filteredInventory.length})
              </p>
              <div className="space-y-1">
                {filteredInventory.slice(0, 4).map((i) => (
                  <button
                    key={i.code}
                    onClick={() => {
                      setSelectedInventory(i);
                      setActiveTab("inventory");
                      setIsGlobalSearchOpen(false);
                    }}
                    className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 text-left text-xs transition-colors group"
                  >
                    <div className="flex items-center gap-2.5">
                      <Package className="w-4 h-4 text-amber-600" />
                      <span className="font-mono font-bold text-slate-900">{i.code}</span>
                      <span className="text-slate-600 truncate">{i.name}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-slate-400 font-mono">
                      <span>{i.currentStock} {i.unit}</span>
                      <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 text-slate-600 transition-opacity" />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {filteredMachines.length === 0 &&
            filteredOrders.length === 0 &&
            filteredInventory.length === 0 && (
              <div className="py-8 text-center text-slate-400 text-xs">
                No manufacturing assets found matching &ldquo;{query}&rdquo;.
              </div>
            )}
        </div>
      </div>
    </div>
  );
}