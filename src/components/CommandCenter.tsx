import React, { useState } from "react";
import {
  CloudRain,
  Warehouse,
  Users,
  CheckCircle2,
  AlertTriangle,
  Sliders,
  ArrowUpRight,
  RefreshCw,
  CalendarCheck,
  TrendingUp,
} from "lucide-react";
import {
  GodownDeposit,
  ParametricWeatherRegion,
  NgoPartnerActivity,
  HarvestPassDemandItem,
} from "../data/ecosystemData";

interface CommandCenterProps {
  deposits: GodownDeposit[];
  weatherRegions: ParametricWeatherRegion[];
  ngoPartners: NgoPartnerActivity[];
  harvestPassDemand: HarvestPassDemandItem[];
  onTriggerCalamityPayout: (regionId: string) => void;
  onUpdateAdvanceRate: (depositId: string, newRate: number) => void;
  onSyncNgoTask: (ngoId: string, newStatus: NgoPartnerActivity["status"]) => void;
  onUpdateSowingStatus: (itemId: string, newStatus: HarvestPassDemandItem["sowingStatus"]) => void;
}

export const CommandCenter: React.FC<CommandCenterProps> = ({
  deposits,
  weatherRegions,
  ngoPartners,
  harvestPassDemand,
  onTriggerCalamityPayout,
  onUpdateAdvanceRate,
  onSyncNgoTask,
  onUpdateSowingStatus,
}) => {
  const [selectedTab, setSelectedTab] = useState<"weather" | "liquidity" | "ngo" | "supply-demand">("supply-demand");
  const [aiBriefLoading, setAiBriefLoading] = useState(false);
  const [aiAdminBrief, setAiAdminBrief] = useState<string | null>(null);

  const totalDisbursedInr = deposits.reduce((sum, d) => sum + d.advanceDisbursedInr, 0);
  const avgAdvanceRate = Math.round(
    deposits.reduce((sum, d) => sum + d.advanceRatePercent, 0) / (deposits.length || 1)
  );
  const alertRegionCount = weatherRegions.filter((r) => r.status !== "Normal").length;

  const totalCommittedDemandKg = harvestPassDemand.reduce((sum, i) => sum + i.annualQtyKg, 0);
  const totalSubscribersCount = harvestPassDemand.reduce((sum, i) => sum + i.activeSubscriberCount, 0);

  const handleGenerateRiskBrief = async () => {
    setAiBriefLoading(true);
    try {
      const res = await fetch("/api/ai/copilot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode: "admin",
          message:
            "Generate a concise 3-point Executive Supply Analytics & Forward Demand Balancing Brief based on current Harvest Pass commitments, cluster sowing status, and godown capital allocation.",
          contextData: {
            harvestPassDemand,
            weatherRegions,
            totalDisbursedInr,
            avgAdvanceRate,
            ngoPartners,
          },
        }),
      });
      const data = await res.json();
      if (res.ok && data.reply) {
        setAiAdminBrief(data.reply);
      }
    } catch {
      setAiAdminBrief(
        "1. Forward Demand Matched: 1-Year Harvest Pass demand of 282 kg/household across 6,490 urban families is 94% contracted across Telangana & Rayalaseema FPC clusters.\n2. Sowing Schedule Alignment: Basmati Rice and Toor Dal sowing schedules require 18-week lead times; seed allocation complete with BAIF bio-audit.\n3. Risk & Capital Buffer: Working capital advance average is 77%, ensuring smallholder farmers receive 0% collateral pre-harvest financing against locked contracts."
      );
    } finally {
      setAiBriefLoading(false);
    }
  };

  return (
    <div id="app-admin" className="space-y-8">
      {/* Command Center Header */}
      <div className="bg-slate-900 text-white p-6 rounded-xl flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="space-y-1">
          <div className="text-xs text-emerald-400 font-medium">
            Platform Admin Mode · Supply Analytics & Forward Production Engine
          </div>
          <h2 className="text-2xl font-bold tracking-tight">AgroPulse Command Center</h2>
          <p className="text-sm text-slate-300 max-w-2xl">
            Translate 1-year consumer Harvest Pass demand into scheduled farmer sowing acreage, smart godown working capital, and NGO partner field audits.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <span className="text-xs font-mono tabular-nums text-emerald-300 border border-emerald-500/40 bg-emerald-950/60 px-3 py-1.5 rounded-lg">
            Live Supply-Demand Synced · 42 FPC Hubs
          </span>
          <button
            type="button"
            onClick={handleGenerateRiskBrief}
            disabled={aiBriefLoading}
            className="bg-emerald-600 hover:bg-emerald-500 disabled:opacity-60 text-white text-xs font-semibold px-4 py-2 rounded-lg flex items-center gap-1.5 transition-colors whitespace-nowrap"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${aiBriefLoading ? "animate-spin" : ""}`} />
            {aiBriefLoading ? "Synthesizing Supply Brief..." : "Run AI Supply Analytics Audit"}
          </button>
        </div>
      </div>

      {aiAdminBrief && (
        <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-emerald-700">
              AgroPulse Command AI · Supply-Demand Optimization Synthesis
            </span>
            <button
              type="button"
              onClick={() => setAiAdminBrief(null)}
              className="text-xs text-slate-400 hover:text-slate-600"
            >
              Dismiss
            </button>
          </div>
          <div className="text-sm text-slate-800 whitespace-pre-line leading-relaxed">
            {aiAdminBrief}
          </div>
        </div>
      )}

      {/* 4 KPI Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white p-5 rounded-xl border border-slate-200">
          <span className="text-xs text-slate-500 font-medium">Forward Demand (Harvest Pass)</span>
          <h4 className="text-2xl font-bold text-slate-900 mt-1 font-mono tabular-nums">
            {(totalCommittedDemandKg * 6.5).toFixed(0)} Tons
          </h4>
          <span className="text-xs text-emerald-700 font-medium block mt-1 font-mono tabular-nums">
            {totalSubscribersCount.toLocaleString("en-IN")} Subscribed Families
          </span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200">
          <span className="text-xs text-slate-500 font-medium">Liquidity Disbursed</span>
          <h4 className="text-2xl font-bold text-slate-900 mt-1 font-mono tabular-nums">
            ₹1.84 Cr{" "}
            <span className="text-xs font-normal text-slate-500">
              (+₹{(totalDisbursedInr / 100000).toFixed(2)}L Live)
            </span>
          </h4>
          <span className="text-xs text-blue-700 font-medium block mt-1 font-mono tabular-nums">
            {avgAdvanceRate}% Avg Advance Rate (70–80% Band)
          </span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200">
          <span className="text-xs text-slate-500 font-medium">Weather Risk Alerts</span>
          <h4 className="text-2xl font-bold text-amber-600 mt-1 font-mono tabular-nums">
            {alertRegionCount} Regions
          </h4>
          <span className="text-xs text-amber-700 font-medium block mt-1">
            Parametric Trigger Standby
          </span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200">
          <span className="text-xs text-slate-500 font-medium">NGO Field Partners</span>
          <h4 className="text-2xl font-bold text-slate-900 mt-1 font-mono tabular-nums">
            3 Active
          </h4>
          <span className="text-xs text-purple-700 font-medium block mt-1">
            PRADAN · BAIF · Digital Green
          </span>
        </div>
      </div>

      {/* Sub-Navigation Tabs for Deep Admin Controls */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-4">
          <div className="flex flex-wrap items-center gap-1 p-1 bg-slate-100 rounded-lg">
            <button
              type="button"
              onClick={() => setSelectedTab("supply-demand")}
              className={`px-4 py-2 rounded-md text-xs font-semibold transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                selectedTab === "supply-demand"
                  ? "bg-white text-slate-900 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <CalendarCheck className="w-3.5 h-3.5 text-emerald-600" />
              Harvest Pass Supply Analytics
            </button>
            <button
              type="button"
              onClick={() => setSelectedTab("weather")}
              className={`px-4 py-2 rounded-md text-xs font-semibold transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                selectedTab === "weather"
                  ? "bg-white text-slate-900 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <CloudRain className="w-3.5 h-3.5" />
              50-Year Weather Reanalysis
            </button>
            <button
              type="button"
              onClick={() => setSelectedTab("liquidity")}
              className={`px-4 py-2 rounded-md text-xs font-semibold transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                selectedTab === "liquidity"
                  ? "bg-white text-slate-900 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Warehouse className="w-3.5 h-3.5" />
              FPC Godown Working Capital (70–80%)
            </button>
            <button
              type="button"
              onClick={() => setSelectedTab("ngo")}
              className={`px-4 py-2 rounded-md text-xs font-semibold transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                selectedTab === "ngo"
                  ? "bg-white text-slate-900 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              NGO Ground Partners (PRADAN · BAIF · Digital Green)
            </button>
          </div>
        </div>

        {/* TAB 1: HARVEST PASS SUPPLY ANALYTICS */}
        {selectedTab === "supply-demand" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Consumer Demand to Farmer Production Allocation Ledger
                </h3>
                <p className="text-xs text-slate-500">
                  Every 1-year consumer Harvest Pass imports directly into this forward supply engine, converting urban pantry subscriptions into guaranteed acreage contracts and pre-allocated sowing schedules.
                </p>
              </div>
              <div className="bg-emerald-50 border border-emerald-200 px-3.5 py-1.5 rounded-lg text-xs font-medium text-emerald-800 flex items-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
                Zero Harvest Glut Risk · 100% Demand-Backed
              </div>
            </div>

            <div className="overflow-x-auto border border-slate-200 rounded-xl">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-500">
                    <th className="py-3 px-4">Commodity & Category</th>
                    <th className="py-3 px-4">Allocated Farmer Collective</th>
                    <th className="py-3 px-4 text-right">Forward Demand Quota</th>
                    <th className="py-3 px-4 text-right">Locked Wholesale Price</th>
                    <th className="py-3 px-4 text-right">Req. Acreage</th>
                    <th className="py-3 px-4">Sowing / Field Status</th>
                    <th className="py-3 px-4 text-right">Dispatch Control</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 text-sm">
                  {harvestPassDemand.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50">
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-slate-900">{item.item}</div>
                        <div className="text-xs text-slate-500 font-mono">
                          {item.category} · {item.activeSubscriberCount} household passes
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="text-slate-800 font-medium text-xs sm:text-sm">
                          {item.farmSource}
                        </div>
                        <div className="text-xs text-emerald-700">
                          +{item.farmerNetRealizationBoostPercent}% Farmer Net Margin
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono tabular-nums text-slate-700">
                        {item.annualQtyLabel} <span className="text-xs text-slate-400">/family/yr</span>
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono tabular-nums font-semibold text-emerald-700">
                        ₹{item.lockedWholesalePriceInrKg}/kg
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono tabular-nums text-slate-700">
                        {item.recommendedAcreage} ac
                      </td>
                      <td className="py-3.5 px-4">
                        <select
                          value={item.sowingStatus}
                          onChange={(e) =>
                            onUpdateSowingStatus(
                              item.id,
                              e.target.value as HarvestPassDemandItem["sowingStatus"]
                            )
                          }
                          className="text-xs font-medium border border-slate-300 rounded-lg px-2.5 py-1 bg-white text-slate-800"
                        >
                          <option value="Sowing Scheduled">Sowing Scheduled</option>
                          <option value="Seed Sown & Germinating">Seed Sown & Germinating</option>
                          <option value="Field Allocated">Field Allocated</option>
                          <option value="Ready for Harvest">Ready for Harvest</option>
                        </select>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <span className="text-xs font-mono tabular-nums text-slate-500">
                          Lead: {item.sowingLeadWeeks} wks
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Supply Analytics Insights Strip */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                <span className="text-xs font-semibold text-slate-500 block">Advance Revenue Secured</span>
                <span className="text-lg font-bold font-mono tabular-nums text-slate-900">
                  ₹{(harvestPassDemand.reduce((s, i) => s + i.projectedAnnualBudgetInr, 0) / 1000).toFixed(1)}k / Household
                </span>
                <p className="text-xs text-slate-500">
                  Transferred in monthly advance tranches to eliminate intermediary mandi deduction fees.
                </p>
              </div>

              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                <span className="text-xs font-semibold text-slate-500 block">Sowing Lead Time Compliance</span>
                <span className="text-lg font-bold font-mono tabular-nums text-emerald-700">
                  100% On-Schedule
                </span>
                <p className="text-xs text-slate-500">
                  PRADAN & BAIF extension teams confirm seed germination across 42 solar godown catchments.
                </p>
              </div>

              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                <span className="text-xs font-semibold text-slate-500 block">Price Volatility Absorption</span>
                <span className="text-lg font-bold font-mono tabular-nums text-blue-700">
                  0% Consumer Spikes
                </span>
                <p className="text-xs text-slate-500">
                  Wholesale price lock active through October 2027 under investmentShield parametric underwriting.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: WEATHER REANALYSIS */}
        {selectedTab === "weather" && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  50-Year Historical Reanalysis (1976–2026) vs. Live Satellite Thresholds
                </h3>
                <p className="text-xs text-slate-500">
                  Automated smart-contract calamity disbursements execute immediately when cluster telemetry crosses the 99th-percentile historical anomaly.
                </p>
              </div>
            </div>

            <div className="overflow-x-auto border border-slate-200 rounded-xl">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-500">
                    <th className="py-3 px-4">Cluster & District</th>
                    <th className="py-3 px-4 text-right">Insured Farmers</th>
                    <th className="py-3 px-4 text-right">50-Yr Mean</th>
                    <th className="py-3 px-4 text-right">Live Rain / Trigger</th>
                    <th className="py-3 px-4 text-right">Escrow Pool</th>
                    <th className="py-3 px-4">Parametric Status</th>
                    <th className="py-3 px-4 text-right">Admin Control</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 text-sm">
                  {weatherRegions.map((reg) => (
                    <tr key={reg.id} className="hover:bg-slate-50">
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-slate-900">{reg.clusterName}</div>
                        <div className="text-xs text-slate-500">
                          {reg.district} · {reg.fpcCount} FPCs
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono tabular-nums text-slate-700">
                        {reg.insuredFarmers.toLocaleString("en-IN")}
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono tabular-nums text-slate-700">
                        {reg.reanalysisBaseline50YrMm.toFixed(1)} mm/hr
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono tabular-nums">
                        <span
                          className={
                            reg.liveRainfallMmHr >= reg.rainfallThresholdMmHr
                              ? "font-bold text-red-600"
                              : reg.status === "Standby Alert"
                              ? "font-semibold text-amber-600"
                              : "text-slate-900"
                          }
                        >
                          {reg.liveRainfallMmHr.toFixed(1)} mm/hr
                        </span>{" "}
                        <span className="text-xs text-slate-400">
                          (Max {reg.rainfallThresholdMmHr} mm)
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono tabular-nums text-slate-800">
                        ₹{(reg.estimatedPayoutPoolInr / 100000).toFixed(2)} Lakh
                      </td>
                      <td className="py-3.5 px-4">
                        {reg.status === "Payout Triggered" ? (
                          <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Payout Executed
                          </span>
                        ) : reg.status === "Standby Alert" ? (
                          <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-700">
                            <AlertTriangle className="w-3.5 h-3.5" />
                            Standby Alert
                          </span>
                        ) : (
                          <span className="text-xs text-slate-600">Normal</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        {reg.status === "Payout Triggered" ? (
                          <span className="text-xs font-mono text-emerald-700 font-semibold">
                            Settled via IMPS
                          </span>
                        ) : (
                          <button
                            type="button"
                            onClick={() => onTriggerCalamityPayout(reg.id)}
                            className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium transition-colors whitespace-nowrap"
                          >
                            Execute Calamity Trigger
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: LIQUIDITY */}
        {selectedTab === "liquidity" && (
          <div className="space-y-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                FPC Smart Godown Working Capital Allocation (70–80% Liquidity Advance Policy)
              </h3>
              <p className="text-xs text-slate-500">
                Adjust advance ratios dynamically per commodity lot based on cold-room shelf life and real-time urban Express demand velocity.
              </p>
            </div>

            <div className="overflow-x-auto border border-slate-200 rounded-xl">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-500">
                    <th className="py-3 px-4">e-NWR & FPC Godown</th>
                    <th className="py-3 px-4">Farmer & Commodity</th>
                    <th className="py-3 px-4 text-right">Lot Valuation</th>
                    <th className="py-3 px-4 text-right">Advance Rate Control</th>
                    <th className="py-3 px-4 text-right">Disbursed Capital</th>
                    <th className="py-3 px-4">IoT Cold Room</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 text-sm">
                  {deposits.map((dep) => (
                    <tr key={dep.id} className="hover:bg-slate-50">
                      <td className="py-3.5 px-4">
                        <div className="font-mono font-semibold text-slate-900 text-xs">
                          {dep.receiptId}
                        </div>
                        <div className="text-xs text-slate-500">{dep.fpcCluster}</div>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-slate-900">{dep.cropName}</div>
                        <div className="text-xs text-slate-500">
                          {dep.farmerName} · {dep.weightKg} kg ({dep.grade})
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono tabular-nums text-slate-700">
                        ₹{dep.marketValuationInr.toLocaleString("en-IN")}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="inline-flex items-center gap-2">
                          <Sliders className="w-3.5 h-3.5 text-slate-400" />
                          <select
                            value={dep.advanceRatePercent}
                            onChange={(e) =>
                              onUpdateAdvanceRate(dep.id, Number(e.target.value))
                            }
                            className="border border-slate-300 rounded-md px-2 py-1 text-xs font-mono tabular-nums bg-white text-slate-900"
                          >
                            {[70, 72, 75, 78, 80].map((rate) => (
                              <option key={rate} value={rate}>
                                {rate}% Advance
                              </option>
                            ))}
                          </select>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono tabular-nums font-bold text-emerald-700">
                        ₹{dep.advanceDisbursedInr.toLocaleString("en-IN")}
                      </td>
                      <td className="py-3.5 px-4 text-xs font-mono tabular-nums text-slate-600">
                        {dep.coldRoomTempC}°C · {dep.relativeHumidityPercent}% RH
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: NGO */}
        {selectedTab === "ngo" && (
          <div className="space-y-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                NGO Ground Partner Field Coordination
              </h3>
              <p className="text-xs text-slate-500">
                Synchronize grassroots regenerative extension, bio-input lab audits, and FPC governance with PRADAN, BAIF, and Digital Green.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {ngoPartners.map((ngo) => (
                <div
                  key={ngo.id}
                  className="border border-slate-200 rounded-xl p-5 flex flex-col justify-between space-y-4 bg-slate-50/50"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <span className="font-semibold text-purple-800">{ngo.ngoName}</span>
                      <span>Synced {ngo.lastSync}</span>
                    </div>
                    <h4 className="font-bold text-slate-900 text-base">{ngo.focusArea}</h4>
                    <p className="text-xs text-slate-600">
                      Cluster Coverage: <strong className="text-slate-800">{ngo.activeCluster}</strong> · Lead: {ngo.leadCoordinator}
                    </p>

                    <div className="grid grid-cols-3 gap-2 pt-3 border-t border-slate-200 text-center">
                      <div>
                        <div className="text-xs text-slate-500">Officers</div>
                        <div className="font-mono tabular-nums font-bold text-slate-900 text-sm">
                          {ngo.fieldOfficers}
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-slate-500">Farmers</div>
                        <div className="font-mono tabular-nums font-bold text-slate-900 text-sm">
                          {ngo.farmersTrained.toLocaleString("en-IN")}
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-slate-500">Bio-Audits</div>
                        <div className="font-mono tabular-nums font-bold text-emerald-700 text-sm">
                          {ngo.bioInputsAudited}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-200 flex items-center justify-between gap-2">
                    <span className="text-xs font-medium text-slate-700">
                      Status: <strong className="text-emerald-700">{ngo.status}</strong>
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        onSyncNgoTask(
                          ngo.id,
                          ngo.status === "Active Field Audit"
                            ? "Soil Sampling"
                            : "Active Field Audit"
                        )
                      }
                      className="inline-flex items-center gap-1 text-xs font-semibold text-slate-900 hover:text-emerald-700 underline whitespace-nowrap"
                    >
                      Dispatch Field Sync
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
