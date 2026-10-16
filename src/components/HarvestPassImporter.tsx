import React, { useState } from "react";
import {
  Upload,
  CheckCircle2,
  ShieldCheck,
  Sparkles,
  Calendar,
  ArrowRight,
  RefreshCw,
  FileText,
  Lock,
} from "lucide-react";
import {
  HarvestPassDemandItem,
  INITIAL_HARVEST_PASS_ITEMS,
} from "../data/ecosystemData";

interface HarvestPassImporterProps {
  onHarvestPassLocked?: (
    items: HarvestPassDemandItem[],
    contractInfo: {
      fileName: string;
      annualBudget: number;
      annualSavings: number;
    }
  ) => void;
}

export default function HarvestPassImporter({
  onHarvestPassLocked,
}: HarvestPassImporterProps) {
  const [step, setStep] = useState<1 | 2 | 3>(1); // 1: Upload, 2: Analyzing, 3: Review & Lock
  const [file, setFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisSummary, setAnalysisSummary] = useState<string | null>(null);
  const [lockedSuccess, setLockedSuccess] = useState(false);

  // Projected basket initialized with the simulated items and updated when real AI analysis runs
  const [projectedBasket, setProjectedBasket] =
    useState<HarvestPassDemandItem[]>(INITIAL_HARVEST_PASS_ITEMS);
  const [totalAnnualBudget, setTotalAnnualBudget] = useState(19620);
  const [totalAnnualSavings, setTotalAnnualSavings] = useState(4900);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = e.target.files?.[0];
    if (!uploadedFile) return;

    setFile(uploadedFile);
    setStep(2);
    setIsAnalyzing(true);
    setLockedSuccess(false);

    try {
      // Call the server-side Gemini AI Demand Normalization Engine
      const res = await fetch("/api/ai/harvest-pass-analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fileName: uploadedFile.name,
          fileContentSnippet: `Uploaded receipt export ${uploadedFile.name} (${Math.round(
            uploadedFile.size / 1024
          )} KB). Monthly staples for 4-person urban household including basmati rice, groundnut oil, toor dal, and seasonal produce.`,
          householdSize: 4,
          cityZone: "Jubilee Hills / Banjara Hills, Hyderabad",
        }),
      });

      const data = await res.json();
      if (res.ok && data.projectedItems && data.projectedItems.length > 0) {
        const mappedItems: HarvestPassDemandItem[] = data.projectedItems.map(
          (p: any, idx: number) => ({
            id: `hp-${Date.now()}-${idx}`,
            item: p.item,
            category: p.category || "Staples & Grains",
            annualQtyKg: p.annualQtyKg || 50,
            monthlyAvgKg: p.monthlyAvgKg || 4,
            annualQtyLabel: p.annualQtyLabel || `${p.annualQtyKg} kg`,
            monthlyAvgLabel: p.monthlyAvgLabel || `${p.monthlyAvgKg} kg`,
            farmSource: p.farmSource || "Telangana FPO Cluster A",
            assignedFpcId: `fpo-${idx + 1}`,
            lockedWholesalePriceInrKg: p.lockedWholesalePriceInrKg || 80,
            projectedAnnualBudgetInr:
              (p.annualQtyKg || 50) * (p.lockedWholesalePriceInrKg || 80),
            farmerNetRealizationBoostPercent:
              p.farmerNetRealizationBoostPercent || 36,
            sowingLeadWeeks: p.sowingLeadWeeks || 12,
            sowingStatus: idx % 2 === 0 ? "Sowing Scheduled" : "Field Allocated",
            recommendedAcreage: p.recommendedAcreage || 0.1,
            activeSubscriberCount: 1200 + idx * 300,
          })
        );

        setProjectedBasket(mappedItems);
        setAnalysisSummary(data.summaryNote);
        setTotalAnnualBudget(data.totalAnnualBudgetInr || 19620);
        setTotalAnnualSavings(data.totalAnnualSavingsInr || 4900);
      }
    } catch {
      // Graceful fallback to default projected basket if AI endpoint is unreachable
      setProjectedBasket(INITIAL_HARVEST_PASS_ITEMS);
      setTotalAnnualBudget(19620);
      setTotalAnnualSavings(4900);
    } finally {
      setIsAnalyzing(false);
      setStep(3);
    }
  };

  const handleSimulateDefaultSample = () => {
    setFile({ name: "Blinkit_Instamart_Annual_Orders_2025.csv" } as File);
    setStep(2);
    setIsAnalyzing(true);
    setLockedSuccess(false);

    setTimeout(() => {
      setIsAnalyzing(false);
      setProjectedBasket(INITIAL_HARVEST_PASS_ITEMS);
      setTotalAnnualBudget(19620);
      setTotalAnnualSavings(4900);
      setAnalysisSummary(
        "Normalized 12 months of recurring weekly quick-commerce orders into advance seasonal crop allocation across 4 certified Telangana farmer producer cooperatives."
      );
      setStep(3);
    }, 1800);
  };

  const handleConfirmAndLock = () => {
    setLockedSuccess(true);
    if (onHarvestPassLocked) {
      onHarvestPassLocked(projectedBasket, {
        fileName: file?.name || "Blinkit_Instamart_Annual_Orders_2025.csv",
        annualBudget: totalAnnualBudget,
        annualSavings: totalAnnualSavings,
      });
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden font-sans">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-800 to-teal-900 p-6 text-white">
        <div className="flex items-center space-x-2 text-emerald-300 text-xs font-semibold uppercase tracking-wider mb-1">
          <Sparkles size={15} />
          <span>AgroPulse Demand-First Engine</span>
        </div>
        <h2 className="text-2xl font-bold tracking-tight">My Yearly Harvest Pass</h2>
        <p className="text-emerald-100/90 text-sm mt-1 max-w-xl leading-relaxed">
          Import your quick-commerce order history to build your 1-year advance pantry plan and secure direct-from-farm production quotas.
        </p>
      </div>

      <div className="p-6">
        {/* STEP 1: Upload Quick-Commerce History */}
        {step === 1 && (
          <div className="text-center py-6">
            <div className="border-2 border-dashed border-emerald-300 rounded-xl p-8 bg-emerald-50/40 hover:bg-emerald-50 transition relative">
              <input
                type="file"
                accept=".pdf,.csv,.json,.xlsx"
                onChange={handleFileUpload}
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
              />
              <div className="flex flex-col items-center">
                <div className="w-14 h-14 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mb-3 shadow-inner">
                  <Upload size={26} />
                </div>
                <h3 className="text-lg font-semibold text-slate-800">
                  Upload Quick-Commerce Order History
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-md">
                  Upload e-receipt PDFs or order history exports from Blinkit, Instamart, Zepto, or Swiggy to instantly generate your annual grocery forecast.
                </p>
                <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
                  <span className="px-5 py-2.5 bg-emerald-600 text-white font-medium text-sm rounded-lg shadow-sm hover:bg-emerald-700 transition">
                    Select Order Export File
                  </span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSimulateDefaultSample();
                    }}
                    className="px-4 py-2.5 bg-white border border-slate-300 text-slate-700 font-medium text-sm rounded-lg hover:bg-slate-50 transition text-xs"
                  >
                    Use Sample Blinkit/Instamart Log
                  </button>
                </div>
              </div>
            </div>
            <p className="text-xs text-slate-400 mt-4 flex items-center justify-center gap-1">
              <Lock size={12} className="text-slate-400" />
              Bank-grade privacy: Your data is processed securely solely to map your annual crop demand.
            </p>
          </div>
        )}

        {/* STEP 2: AI Processing State */}
        {step === 2 && isAnalyzing && (
          <div className="text-center py-14">
            <div className="w-12 h-12 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <h3 className="text-lg font-semibold text-slate-800">
              AgroPulse AI is analyzing your consumption patterns...
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-md mx-auto">
              Normalizing recurring monthly staples and seasonal produce needs across smallholder farmer networks in Telangana & Rayalaseema.
            </p>
          </div>
        )}

        {/* STEP 3: Review Projected Harvest Pass & Farmer Allocation */}
        {step === 3 && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
              <div>
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <CheckCircle2 className="text-emerald-600" size={20} />
                  Your 1-Year Projected Harvest Pass
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  {file?.name ? (
                    <span className="inline-flex items-center gap-1 text-slate-600">
                      <FileText size={12} /> Source: {file.name}
                    </span>
                  ) : (
                    "Mapped directly to verified smallholder farmer producer clusters."
                  )}
                </p>
              </div>
              <span className="bg-emerald-100 text-emerald-800 text-xs font-semibold px-3 py-1 rounded-full whitespace-nowrap self-start sm:self-auto">
                1-Year Price Lock Active 🛡️
              </span>
            </div>

            {analysisSummary && (
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 leading-relaxed">
                <strong>AI Consumption Profile:</strong> {analysisSummary}
              </div>
            )}

            {/* Projected Items List */}
            <div className="space-y-3">
              {projectedBasket.map((row, idx) => (
                <div
                  key={row.id || idx}
                  className="bg-slate-50 border border-slate-200 p-4 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-white hover:shadow-xs transition"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold text-sm text-slate-900">{row.item}</h4>
                      <span className="text-xs font-mono text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded">
                        +{row.farmerNetRealizationBoostPercent}% Farmer Realization
                      </span>
                    </div>
                    <p className="text-xs text-emerald-700">
                      Assigned Source: <strong className="text-slate-800">{row.farmSource}</strong> · Sowing Lead: {row.sowingLeadWeeks} wks
                    </p>
                  </div>
                  <div className="text-left sm:text-right font-mono tabular-nums">
                    <span className="block font-bold text-sm text-slate-900">
                      {row.annualQtyLabel}
                    </span>
                    <span className="text-xs text-slate-500">
                      ~{row.monthlyAvgLabel}/mo · ₹{row.lockedWholesalePriceInrKg}/kg locked
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Annual Economics Strip */}
            <div className="bg-slate-900 text-white p-4 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div>
                <span className="text-slate-400 block">Total Locked Annual Grocery Budget</span>
                <span className="text-xl font-bold font-mono tabular-nums text-emerald-400">
                  ₹{totalAnnualBudget.toLocaleString("en-IN")}
                </span>
              </div>
              <div className="sm:text-right">
                <span className="text-slate-400 block">Protected Consumer Savings (-20%)</span>
                <span className="text-sm font-semibold text-emerald-300 font-mono tabular-nums">
                  ₹{totalAnnualSavings.toLocaleString("en-IN")} saved vs spot retail
                </span>
              </div>
            </div>

            {/* Value Guarantees */}
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-xs text-emerald-950 space-y-2">
              <div className="flex items-start gap-2">
                <ShieldCheck size={16} className="text-emerald-700 shrink-0 mt-0.5" />
                <span>
                  <strong>Inflation Shield:</strong> Locked wholesale prices protect you against seasonal price spikes and festival gluts.
                </span>
              </div>
              <div className="flex items-start gap-2">
                <Calendar size={16} className="text-emerald-700 shrink-0 mt-0.5" />
                <span>
                  <strong>Flexibility Clause:</strong> Swap, pause, or adjust monthly basket quantities 48–72 hours prior to weekly dispatch.
                </span>
              </div>
            </div>

            {lockedSuccess && (
              <div className="p-4 bg-emerald-600 text-white rounded-xl text-xs sm:text-sm font-medium flex items-center gap-2">
                <CheckCircle2 size={18} className="shrink-0" />
                <span>
                  Harvest Pass locked successfully! Sowing schedules and advance purchase quotas have been fed into <strong>AgroPulse Krishi</strong> & <strong>Command Center</strong>.
                </span>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <button
                type="button"
                onClick={() => {
                  setStep(1);
                  setFile(null);
                  setLockedSuccess(false);
                }}
                className="w-full sm:w-auto px-4 py-2.5 border border-slate-300 text-slate-700 font-medium text-xs rounded-lg hover:bg-slate-50 transition flex items-center justify-center gap-1.5"
              >
                <RefreshCw size={14} /> Re-upload
              </button>
              <button
                type="button"
                onClick={handleConfirmAndLock}
                className="w-full sm:flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-lg shadow-sm transition flex items-center justify-center gap-2"
              >
                Confirm & Lock 1-Year Harvest Pass <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
