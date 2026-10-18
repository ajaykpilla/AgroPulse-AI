/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import {
  Sparkles,
  Video,
  Download,
  FileText,
  RefreshCw,
  CheckCircle2,
  Sprout,
  ShieldAlert,
  ChevronRight,
} from "lucide-react";
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
import { DemoVideoPlayerModal } from "./components/DemoVideoPlayerModal";
import {
  exportDemoVideoFile,
  triggerFileDownload,
  exportDemoScriptPackage,
  downloadConsolidatedDemoVideo,
} from "./utils/videoExporter";

export default function App() {
  // STRICT SINGLE-VERSION STATE: Only 1 version active at any time
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
  const [demoVideoOpen, setDemoVideoOpen] = useState(false);

  // Direct Video Download State from Header
  const [isExportingVideo, setIsExportingVideo] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [exportStatusText, setExportStatusText] = useState("");
  const [downloadSuccessNotice, setDownloadSuccessNotice] = useState<string | null>(null);

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

  const handleHarvestPassLocked = (newItems: HarvestPassDemandItem[]) => {
    setHarvestPassDemand(newItems);
  };

  // Direct header video downloader for the consolidated 4-minute demo video
  const handleDirectDownloadVideo = async () => {
    if (isExportingVideo) return;
    setIsExportingVideo(true);
    setExportProgress(0);
    setExportStatusText("Accessing consolidated 4-minute demo video...");
    setDownloadSuccessNotice(null);

    try {
      const fileName = await downloadConsolidatedDemoVideo((pct, status) => {
        setExportProgress(pct);
        setExportStatusText(status);
      });
      setDownloadSuccessNotice(`Downloaded ${fileName} — Complete Consolidated 4-Minute Walkthrough Video`);
    } catch (err: any) {
      console.error("Direct video download failed:", err);
      setExportStatusText(err?.message || "Failed to download video file.");
    } finally {
      setIsExportingVideo(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-100 text-slate-900 font-sans">
      {/* 
        LINE 1: HEADER
        Branding as "AgroPulse" and prominent 4-Min Demo Walkthrough Video with direct download
      */}
      <header className="bg-emerald-950 text-white border-b border-emerald-900 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-3.5 flex flex-wrap items-center justify-between gap-3 sm:gap-6">
          {/* Brand Wordmark: AgroPulse */}
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-400 shadow-inner">
              <Sprout className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xl sm:text-2xl font-black tracking-tight text-white">
                AgroPulse
              </span>
              <span className="hidden md:inline-block ml-2 text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-900/80 text-emerald-300 border border-emerald-700/60">
                Closed-Loop Agritech Ecosystem
              </span>
            </div>
          </div>

          {/* Header Action Controls: 4-Min Demo Walkthrough Video + Direct Download + AI Co-Pilot */}
          <div className="flex items-center gap-2 sm:gap-2.5 ml-auto">
            {/* 4 Min Demo Video Walkthrough CTA Button */}
            <button
              type="button"
              onClick={() => setDemoVideoOpen(true)}
              className="px-3.5 py-2 text-xs sm:text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 rounded-lg transition-all shadow-sm flex items-center gap-2 cursor-pointer border border-emerald-400/30"
              title="Watch full 4-minute interactive solution walkthrough"
            >
              <div className="w-2 h-2 rounded-full bg-emerald-300 animate-pulse" />
              <Video className="w-4 h-4 text-emerald-200" />
              <span>4-Min Demo Video</span>
            </button>

            {/* Direct Download Consolidated 4-Minute Video (.mp4) */}
            <button
              type="button"
              disabled={isExportingVideo}
              onClick={handleDirectDownloadVideo}
              className="px-3 py-2 text-xs font-medium text-emerald-100 hover:text-white bg-emerald-900/80 hover:bg-emerald-800 border border-emerald-700/70 rounded-lg transition flex items-center gap-1.5 disabled:opacity-60 cursor-pointer shadow-xs"
              title="Download consolidated full 4-minute demo walkthrough video (.mp4)"
            >
              {isExportingVideo ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin text-emerald-300" />
                  <span className="hidden sm:inline">Processing {exportProgress}%</span>
                  <span className="sm:hidden">{exportProgress}%</span>
                </>
              ) : (
                <>
                  <Download className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="hidden sm:inline">Download 4-Min Video (.mp4)</span>
                  <span className="sm:hidden">4-Min Video</span>
                </>
              )}
            </button>

            {/* Download Script (.md) */}
            <button
              type="button"
              onClick={exportDemoScriptPackage}
              className="hidden lg:flex items-center gap-1.5 px-2.5 py-2 text-xs font-medium text-emerald-200 hover:text-white bg-emerald-900/50 hover:bg-emerald-800 border border-emerald-800/80 rounded-lg transition"
              title="Download presentation pitch deck script & scene storyboard (.md)"
            >
              <FileText className="w-3.5 h-3.5 text-emerald-400" />
              <span>Script</span>
            </button>

            {/* AgroPulse AI Co-Pilot trigger */}
            <button
              type="button"
              onClick={() => setCoPilotOpen(true)}
              className="px-3 py-2 text-xs font-semibold text-emerald-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg transition-colors flex items-center gap-1.5 shadow-sm"
              title="Open AgroPulse Multi-Persona AI Co-Pilot"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">AI Co-Pilot</span>
            </button>
          </div>
        </div>

        {/* Real-time Video Render Notification Banner */}
        {isExportingVideo && (
          <div className="bg-emerald-900 border-t border-emerald-800 px-4 sm:px-6 py-2 flex items-center justify-between text-xs text-emerald-200 animate-fadeIn">
            <div className="flex items-center gap-2">
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-emerald-400" />
              <span>{exportStatusText}</span>
            </div>
            <div className="font-mono font-bold text-emerald-300">{exportProgress}%</div>
          </div>
        )}

        {downloadSuccessNotice && !isExportingVideo && (
          <div className="bg-emerald-900/90 border-t border-emerald-700 px-4 sm:px-6 py-2 flex items-center justify-between text-xs text-emerald-200">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{downloadSuccessNotice}</span>
            </div>
            <button
              type="button"
              onClick={() => setDownloadSuccessNotice(null)}
              className="text-emerald-400 hover:text-white underline text-xs ml-4"
            >
              Dismiss
            </button>
          </div>
        )}
      </header>

      {/* 
        LINE 2: 3 TABS IN A SINGLE FRAME
        Enforces: "Though at any point of time a user can have only 1 version of the application. 
        Either farmer or command center or Consumer using express portal."
        Compatible to mobile and Desktop.
      */}
      <section className="bg-slate-900 border-b border-slate-800 text-white shadow-inner">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 sm:py-3">
          {/* THE SINGLE FRAME CONTAINER */}
          <div className="bg-slate-950/80 p-1.5 rounded-xl sm:rounded-2xl border border-emerald-900/40 shadow-sm flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2">
            
            {/* The 3 Version Tabs inside the Single Frame */}
            <div
              role="tablist"
              aria-label="AgroPulse Ecosystem Version Switcher"
              className="grid grid-cols-1 sm:grid-cols-3 gap-1.5 w-full flex-1"
            >
              {/* Tab 1: Krishi Farmer Version */}
              <button
                type="button"
                role="tab"
                id="btn-krishi"
                aria-selected={activeMode === "krishi"}
                onClick={() => setActiveMode("krishi")}
                className={`flex items-center justify-center sm:justify-start gap-2.5 px-3.5 py-2.5 rounded-lg text-xs sm:text-sm font-medium transition-all text-left ${
                  activeMode === "krishi"
                    ? "bg-emerald-600 text-white font-bold shadow-md ring-1 ring-emerald-400/50"
                    : "text-slate-300 hover:text-white hover:bg-slate-800/80"
                }`}
              >
                <span className="text-base sm:text-lg">🌾</span>
                <div className="flex flex-col min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="truncate">Krishi (Farmer Version)</span>
                    {activeMode === "krishi" && (
                      <span className="w-1.5 h-1.5 rounded-full bg-white shrink-0" />
                    )}
                  </div>
                  <span
                    className={`text-[10px] hidden sm:block truncate ${
                      activeMode === "krishi" ? "text-emerald-100" : "text-slate-400"
                    }`}
                  >
                    Voice AI, Leaf Scan & Parametric Shield
                  </span>
                </div>
              </button>

              {/* Tab 2: Command Center Version */}
              <button
                type="button"
                role="tab"
                id="btn-admin"
                aria-selected={activeMode === "admin"}
                onClick={() => setActiveMode("admin")}
                className={`flex items-center justify-center sm:justify-start gap-2.5 px-3.5 py-2.5 rounded-lg text-xs sm:text-sm font-medium transition-all text-left ${
                  activeMode === "admin"
                    ? "bg-emerald-600 text-white font-bold shadow-md ring-1 ring-emerald-400/50"
                    : "text-slate-300 hover:text-white hover:bg-slate-800/80"
                }`}
              >
                <span className="text-base sm:text-lg">⚙️</span>
                <div className="flex flex-col min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="truncate">Command Center Version</span>
                    {activeMode === "admin" && (
                      <span className="w-1.5 h-1.5 rounded-full bg-white shrink-0" />
                    )}
                  </div>
                  <span
                    className={`text-[10px] hidden sm:block truncate ${
                      activeMode === "admin" ? "text-emerald-100" : "text-slate-400"
                    }`}
                  >
                    Supply Analytics, Godowns & Weather
                  </span>
                </div>
              </button>

              {/* Tab 3: 15-Mins Consumer Express Version */}
              <button
                type="button"
                role="tab"
                id="btn-express"
                aria-selected={activeMode === "express"}
                onClick={() => setActiveMode("express")}
                className={`flex items-center justify-center sm:justify-start gap-2.5 px-3.5 py-2.5 rounded-lg text-xs sm:text-sm font-medium transition-all text-left ${
                  activeMode === "express"
                    ? "bg-emerald-600 text-white font-bold shadow-md ring-1 ring-emerald-400/50"
                    : "text-slate-300 hover:text-white hover:bg-slate-800/80"
                }`}
              >
                <span className="text-base sm:text-lg">⚡</span>
                <div className="flex flex-col min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="truncate">15-Mins Consumer Express Version</span>
                    {activeMode === "express" && (
                      <span className="w-1.5 h-1.5 rounded-full bg-white shrink-0" />
                    )}
                  </div>
                  <span
                    className={`text-[10px] hidden sm:block truncate ${
                      activeMode === "express" ? "text-emerald-100" : "text-slate-400"
                    }`}
                  >
                    15-Min Delivery & 1-Yr Harvest Pass
                  </span>
                </div>
              </button>
            </div>

            {/* Single Version Active Badge Indicator */}
            <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-[11px] text-slate-300 whitespace-nowrap shrink-0">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>
                Active Mode:{" "}
                <strong className="text-white">
                  {activeMode === "krishi"
                    ? "Farmer Portal"
                    : activeMode === "admin"
                    ? "Command Center"
                    : "15-Min Consumer Express"}
                </strong>
              </span>
            </div>
          </div>

          {/* Context Explanatory Pill for Single-Persona Rendering */}
          <div className="flex items-center justify-between mt-2 px-1 text-[11px] text-slate-400">
            <span className="flex items-center gap-1.5">
              <span>Single-Version Enforced:</span>
              <span className="text-emerald-400 font-medium">
                {activeMode === "krishi" && "🌾 You are viewing the Farmer Version (advisory, diagnostics, warehouse receipts)."}
                {activeMode === "admin" && "⚙️ You are viewing the Command Center Version (macro oversight, supply analytics, weather)."}
                {activeMode === "express" && "⚡ You are viewing the 15-Mins Consumer Express Version (quick-commerce, harvest pass)."}
              </span>
            </span>
            <button
              type="button"
              onClick={() => setDemoVideoOpen(true)}
              className="text-emerald-400 hover:underline hidden md:inline-flex items-center gap-1"
            >
              <span>See how the 3 versions connect</span>
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </section>

      {/* 
        MAIN CONTENT VIEWPORT:
        Strictly renders ONLY ONE single version of the application at a time!
      */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {activeMode === "krishi" && (
          <div className="animate-fadeIn">
            <KrishiPortal
              deposits={deposits}
              onAddDeposit={handleAddDeposit}
              weatherRegions={weatherRegions}
              harvestPassDemand={harvestPassDemand}
              onTriggerCalamityPayout={handleTriggerCalamityPayout}
              onOpenCoPilotWithPrompt={() => setCoPilotOpen(true)}
            />
          </div>
        )}

        {activeMode === "admin" && (
          <div className="animate-fadeIn">
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
          </div>
        )}

        {activeMode === "express" && (
          <div className="animate-fadeIn">
            <ExpressStorefront
              products={INITIAL_EXPRESS_PRODUCTS}
              onHarvestPassLocked={handleHarvestPassLocked}
            />
          </div>
        )}
      </main>

      {/* Quiet Footer */}
      <footer className="bg-white border-t border-slate-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            AgroPulse Closed-Loop Agritech & Quick-Commerce Ecosystem · Single-Version Active:{" "}
            <strong className="text-slate-700 capitalize">{activeMode} Version</strong>
          </div>
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setDemoVideoOpen(true)}
              className="text-emerald-700 font-semibold hover:underline flex items-center gap-1"
            >
              <Video className="w-3 h-3" />
              Watch 4-Min Demo Tour
            </button>
            <span aria-hidden="true">·</span>
            <button
              type="button"
              onClick={handleDirectDownloadVideo}
              disabled={isExportingVideo}
              className="text-emerald-700 font-semibold hover:underline flex items-center gap-1"
            >
              <Download className="w-3 h-3" />
              Download Demo Video
            </button>
            <span aria-hidden="true">·</span>
            <button
              type="button"
              onClick={() => setActiveMode("krishi")}
              className={`hover:text-slate-900 ${activeMode === "krishi" ? "font-bold text-emerald-800" : ""}`}
            >
              Krishi Farmer
            </button>
            <span aria-hidden="true">·</span>
            <button
              type="button"
              onClick={() => setActiveMode("admin")}
              className={`hover:text-slate-900 ${activeMode === "admin" ? "font-bold text-emerald-800" : ""}`}
            >
              Command Center
            </button>
            <span aria-hidden="true">·</span>
            <button
              type="button"
              onClick={() => setActiveMode("express")}
              className={`hover:text-slate-900 ${activeMode === "express" ? "font-bold text-emerald-800" : ""}`}
            >
              15-Mins Express
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

      {/* 4-Minute Interactive Demo Video Walkthrough Modal */}
      <DemoVideoPlayerModal
        isOpen={demoVideoOpen}
        onClose={() => setDemoVideoOpen(false)}
        onNavigateToPersona={(mode) => setActiveMode(mode)}
      />
    </div>
  );
}
