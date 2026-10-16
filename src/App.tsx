/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { Sparkles } from "lucide-react";
import {
  AppMode,
  INITIAL_GODOWN_DEPOSITS,
  INITIAL_WEATHER_REGIONS,
  INITIAL_NGO_PARTNERS,
  INITIAL_EXPRESS_PRODUCTS,
  INITIAL_HARVEST_PASS_ITEMS,
  GodownDeposit,
  ParametricWeatherRegion,
  NgoPartnerActivity,
  HarvestPassDemandItem,
} from "./data/ecosystemData";
import { KrishiPortal } from "./components/KrishiPortal";
import { CommandCenter } from "./components/CommandCenter";
import { ExpressStorefront } from "./components/ExpressStorefront";
import { CoPilotDrawer } from "./components/CoPilotDrawer";

export default function App() {
  const [activeMode, setActiveMode] = useState<AppMode>("krishi");
  const [deposits, setDeposits] = useState<GodownDeposit[]>(INITIAL_GODOWN_DEPOSITS);
  const [weatherRegions, setWeatherRegions] = useState<ParametricWeatherRegion[]>(
    INITIAL_WEATHER_REGIONS
  );
  const [ngoPartners, setNgoPartners] = useState<NgoPartnerActivity[]>(INITIAL_NGO_PARTNERS);
  const [harvestPassDemand, setHarvestPassDemand] = useState<HarvestPassDemandItem[]>(
    INITIAL_HARVEST_PASS_ITEMS
  );
  const [coPilotOpen, setCoPilotOpen] = useState(false);

  const handleAddDeposit = (newDeposit: GodownDeposit) => {
    setDeposits((prev) => [newDeposit, ...prev]);
  };

  const handleTriggerCalamityPayout = (regionId: string) => {
    setWeatherRegions((prev) =>
      prev.map((reg) =>
        reg.id === regionId
          ? {
              ...reg,
              liveRainfallMmHr: Math.max(reg.liveRainfallMmHr, 38.4),
              status: "Payout Triggered",
              lastUpdated: "Just now · Smart Contract Executed",
            }
          : reg
      )
    );
  };

  const handleUpdateAdvanceRate = (depositId: string, newRate: number) => {
    setDeposits((prev) =>
      prev.map((dep) =>
        dep.id === depositId
          ? {
              ...dep,
              advanceRatePercent: newRate,
              advanceDisbursedInr: Math.round((dep.marketValuationInr * newRate) / 100),
            }
          : dep
      )
    );
  };

  const handleSyncNgoTask = (ngoId: string, newStatus: NgoPartnerActivity["status"]) => {
    setNgoPartners((prev) =>
      prev.map((ngo) =>
        ngo.id === ngoId
          ? {
              ...ngo,
              status: newStatus,
              bioInputsAudited: ngo.bioInputsAudited + 12,
              lastSync: "Just now",
            }
          : ngo
      )
    );
  };

  const handleUpdateSowingStatus = (
    itemId: string,
    newStatus: HarvestPassDemandItem["sowingStatus"]
  ) => {
    setHarvestPassDemand((prev) =>
      prev.map((item) =>
        item.id === itemId
          ? {
              ...item,
              sowingStatus: newStatus,
            }
          : item
      )
    );
  };

  const handleHarvestPassLocked = (
    newItems: HarvestPassDemandItem[]
  ) => {
    // When an urban consumer locks a 1-year harvest pass, feed it directly into the demand list
    // for farmer supply analytics across Krishi and Command Center!
    setHarvestPassDemand(newItems);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-100 text-slate-900">
      {/* Top Navigation Bar following 3-Zone Contract & User Persona Switcher */}
      <header className="bg-emerald-950 text-white border-b border-emerald-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between gap-8">
          {/* Zone 1: Single text element wordmark */}
          <a
            href="#top"
            onClick={(e) => {
              e.preventDefault();
              setActiveMode("krishi");
            }}
            className="text-lg font-bold tracking-tight text-white whitespace-nowrap shrink-0"
          >
            AgroPulse Ecosystem
          </a>

          {/* Zone 2: Persona Navigation Links */}
          <nav
            aria-label="Ecosystem Persona Switcher"
            className="flex items-center gap-2 sm:gap-6 text-sm font-medium"
          >
            <button
              type="button"
              id="btn-krishi"
              onClick={() => setActiveMode("krishi")}
              className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap shrink-0 ${
                activeMode === "krishi"
                  ? "bg-emerald-600 text-white font-semibold"
                  : "text-emerald-200 hover:text-white"
              }`}
            >
              Krishi (Farmer)
            </button>
            <button
              type="button"
              id="btn-admin"
              onClick={() => setActiveMode("admin")}
              className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap shrink-0 ${
                activeMode === "admin"
                  ? "bg-emerald-600 text-white font-semibold"
                  : "text-emerald-200 hover:text-white"
              }`}
            >
              Command Center
            </button>
            <button
              type="button"
              id="btn-express"
              onClick={() => setActiveMode("express")}
              className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap shrink-0 ${
                activeMode === "express"
                  ? "bg-emerald-600 text-white font-semibold"
                  : "text-emerald-200 hover:text-white"
              }`}
            >
              Express (Consumer)
            </button>
          </nav>

          {/* Zone 3: 1 Primary Action */}
          <div className="flex items-center shrink-0">
            <button
              type="button"
              onClick={() => setCoPilotOpen(true)}
              className="px-4 py-2 text-xs font-semibold text-emerald-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              AgroPulse AI Co-Pilot
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-8">
        {activeMode === "krishi" && (
          <KrishiPortal
            deposits={deposits}
            onAddDeposit={handleAddDeposit}
            weatherRegions={weatherRegions}
            harvestPassDemand={harvestPassDemand}
            onTriggerCalamityPayout={handleTriggerCalamityPayout}
            onOpenCoPilotWithPrompt={() => setCoPilotOpen(true)}
          />
        )}

        {activeMode === "admin" && (
          <CommandCenter
            deposits={deposits}
            weatherRegions={weatherRegions}
            ngoPartners={ngoPartners}
            harvestPassDemand={harvestPassDemand}
            onTriggerCalamityPayout={handleTriggerCalamityPayout}
            onUpdateAdvanceRate={handleUpdateAdvanceRate}
            onSyncNgoTask={handleSyncNgoTask}
            onUpdateSowingStatus={handleUpdateSowingStatus}
          />
        )}

        {activeMode === "express" && (
          <ExpressStorefront
            products={INITIAL_EXPRESS_PRODUCTS}
            onHarvestPassLocked={handleHarvestPassLocked}
          />
        )}
      </main>

      {/* Quiet Footer */}
      <footer className="bg-white border-t border-slate-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            AgroPulse Closed-Loop Agritech & Quick-Commerce Ecosystem · Demand-Driven Farmer Production
          </div>
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setActiveMode("krishi")}
              className="hover:text-slate-900"
            >
              Krishi Portal
            </button>
            <span aria-hidden="true">·</span>
            <button
              type="button"
              onClick={() => setActiveMode("admin")}
              className="hover:text-slate-900"
            >
              Command Center
            </button>
            <span aria-hidden="true">·</span>
            <button
              type="button"
              onClick={() => setActiveMode("express")}
              className="hover:text-slate-900"
            >
              Express Storefront
            </button>
          </div>
        </div>
      </footer>

      {/* Multi-Persona AI Co-Pilot Drawer */}
      <CoPilotDrawer
        isOpen={coPilotOpen}
        onClose={() => setCoPilotOpen(false)}
        activeMode={activeMode}
        ecosystemSnapshot={{
          activeMode,
          depositsCount: deposits.length,
          weatherAlerts: weatherRegions.filter((r) => r.status !== "Normal"),
          ngoPartners: ngoPartners.map((n) => n.ngoName),
          harvestPassDemandItems: harvestPassDemand.map((d) => `${d.item} (${d.annualQtyLabel})`),
        }}
      />
    </div>
  );
}
