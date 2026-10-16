import React, { useState, useRef } from "react";
import {
  Mic,
  MicOff,
  Camera,
  ShieldCheck,
  Volume2,
  Warehouse,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  Upload,
  Plus,
  RefreshCw,
  CalendarCheck,
  TrendingUp,
} from "lucide-react";
import {
  GodownDeposit,
  ParametricWeatherRegion,
  SAMPLE_LEAF_IMAGE,
  HarvestPassDemandItem,
} from "../data/ecosystemData";

interface KrishiPortalProps {
  deposits: GodownDeposit[];
  onAddDeposit: (deposit: GodownDeposit) => void;
  weatherRegions: ParametricWeatherRegion[];
  harvestPassDemand: HarvestPassDemandItem[];
  onTriggerCalamityPayout: (regionId: string) => void;
  onOpenCoPilotWithPrompt: (prompt: string) => void;
}

interface LeafDiagnosisResult {
  conditionName: string;
  severity: string;
  confidencePercent: number;
  symptomsObserved: string[];
  zeroCostRemediation: {
    title: string;
    preparation: string;
    dosageAndSchedule: string;
    estimatedSavingsInr: number;
  }[];
  soilHealthImpact: string;
  vernacularSummary: string;
}

const DEFAULT_DIAGNOSIS: LeafDiagnosisResult = {
  conditionName: "Early Nitrogen Deficiency & Mild Alternaria Leaf Spot",
  severity: "Moderate",
  confidencePercent: 94,
  symptomsObserved: [
    "Interveinal chlorosis (yellowing) on older lower tomato leaves",
    "Small concentric dark brown lesions with yellow halos near leaf margins",
    "Slightly dry topsoil indicating low microbial nitrogen fixation",
  ],
  zeroCostRemediation: [
    {
      title: "Fermented Sour Buttermilk + Copper Vessel Spray",
      preparation:
        "Keep 5 liters of local cow buttermilk in a brass/copper vessel or with a copper coin for 5 days in shade, then dilute 1:10 with water.",
      dosageAndSchedule: "Foliar spray every 5 days in early morning to arrest fungal leaf spot naturally.",
      estimatedSavingsInr: 650,
    },
    {
      title: "Jeevamrutham Root Drench (Microbial Nitrogen Booster)",
      preparation:
        "Ferment 10kg native cow dung, 10L cow urine, 2kg jaggery, 2kg pulse flour, and a handful of bund soil in 200L water for 48 hours.",
      dosageAndSchedule: "Apply 250ml per plant around the root zone with irrigation water twice a month.",
      estimatedSavingsInr: 1200,
    },
    {
      title: "Neemastra Botanical Shield",
      preparation:
        "Crush 5kg fresh neem leaves and neem kernels in 100L water with 5L cow urine and 1kg cow dung; ferment 24 hours and filter through cloth.",
      dosageAndSchedule: "Spray on leaf undersides in evening hours to prevent secondary pest vectors.",
      estimatedSavingsInr: 550,
    },
  ],
  soilHealthImpact:
    "Restores rhizosphere nitrogen-fixing bacteria without synthetic urea, qualifying your harvest for AgroPulse Express 'AI Soil Verified' grade (+35% net price realization).",
  vernacularSummary:
    "Namaskaram Narsimha garu! Your tomato leaf shows mild nitrogen hunger and early leaf spot. Do not buy chemical fungicides—spray 5-day fermented sour buttermilk and apply Jeevamrutham at the roots to save ₹2,400 per acre.",
};

export const KrishiPortal: React.FC<KrishiPortalProps> = ({
  deposits,
  onAddDeposit,
  weatherRegions,
  harvestPassDemand,
  onTriggerCalamityPayout,
}) => {
  // Active focus panel
  const [activeTool, setActiveTool] = useState<"voice" | "scan" | "shield" | "godown" | "demand-analytics">("demand-analytics");

  // Voice Advisory State
  const [selectedDialect, setSelectedDialect] = useState<string>("Telugu + English (Vernacular)");
  const [voiceQuery, setVoiceQuery] = useState<string>(
    "What advance Harvest Pass quotas are locked for Kandi cluster this season? What price is guaranteed for my tomatoes and pulses?"
  );
  const [isListening, setIsListening] = useState(false);
  const [voiceLoading, setVoiceLoading] = useState(false);
  const [voiceResponse, setVoiceResponse] = useState<string>(
    "Namaskaram Narsimha Reddy garu! Good news from urban Express consumers: 2,840 families have locked their 1-Year Harvest Pass for Kandi Eco-Farm Network vegetables. You have a forward guarantee of 180 kg/household at ₹34/kg locked floor price (+35% over spot mandi rate). Your recommended sowing acreage is 0.15 acres. Zero chance of harvest glut!"
  );
  const [ttsPlaying, setTtsPlaying] = useState(false);
  const [voiceError, setVoiceError] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Leaf & Soil Scan State
  const [selectedImage, setSelectedImage] = useState<string>(SAMPLE_LEAF_IMAGE);
  const [cropType, setCropType] = useState<string>("Roma Tomato");
  const [fieldNotes, setFieldNotes] = useState<string>(
    "Lower leaves turning pale yellow with small brown rings after 18mm rain."
  );
  const [scanLoading, setScanLoading] = useState(false);
  const [scanError, setScanError] = useState<string | null>(null);
  const [diagnosis, setDiagnosis] = useState<LeafDiagnosisResult>(DEFAULT_DIAGNOSIS);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // New Godown Deposit Form State
  const [newCropName, setNewCropName] = useState("Hydroponic Roma Tomatoes");
  const [newWeightKg, setNewWeightKg] = useState<number>(500);
  const [newRatePerKg, setNewRatePerKg] = useState<number>(38);
  const [newAdvanceRate, setNewAdvanceRate] = useState<number>(75);
  const [depositSuccessMsg, setDepositSuccessMsg] = useState<string | null>(null);

  // Handle Web Speech Recognition if available
  const handleToggleSpeechInput = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setIsListening(true);
      setTimeout(() => {
        setIsListening(false);
        setVoiceQuery(
          "నా క్లస్టర్‌కు హార్వెస్ట్ పాస్ అడ్వాన్స్ డిమాండ్ ఎంత ఉంది? పంటకు ఖచ్చితమైన ధర వస్తుందా?"
        );
      }, 1200);
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = selectedDialect.includes("Telugu")
      ? "te-IN"
      : selectedDialect.includes("Hindi")
      ? "hi-IN"
      : "en-IN";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    setIsListening(true);
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setVoiceQuery(transcript);
      setIsListening(false);
    };
    recognition.onerror = () => {
      setIsListening(false);
    };
    recognition.onend = () => {
      setIsListening(false);
    };
    recognition.start();
  };

  const handleRunVoiceQuery = async (customPrompt?: string) => {
    const queryToUse = customPrompt || voiceQuery;
    if (!queryToUse.trim()) return;
    setVoiceLoading(true);
    setVoiceError(null);

    try {
      const res = await fetch("/api/ai/copilot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode: "krishi",
          language: selectedDialect,
          message: queryToUse,
          contextData: {
            farmer: "G. Narsimha Reddy (Kandi FPC Cluster)",
            activeDeposits: deposits.slice(0, 2),
            weatherStatus: weatherRegions[0],
            harvestPassDemand,
          },
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to fetch advisory");
      setVoiceResponse(data.reply);
    } catch (err: any) {
      setVoiceError(err.message || "Advisory request failed.");
    } finally {
      setVoiceLoading(false);
    }
  };

  const handlePlayTTS = async (textToSpeak: string) => {
    if (ttsPlaying) {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      window.speechSynthesis?.cancel();
      setTtsPlaying(false);
      return;
    }

    setTtsPlaying(true);
    try {
      const res = await fetch("/api/ai/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: textToSpeak }),
      });
      const data = await res.json();
      if (res.ok && data.audioDataUrl) {
        const audio = new Audio(data.audioDataUrl);
        audioRef.current = audio;
        audio.onended = () => setTtsPlaying(false);
        audio.onerror = () => setTtsPlaying(false);
        await audio.play();
        return;
      }
      throw new Error("Fallback to browser speech");
    } catch {
      if ("speechSynthesis" in window) {
        const utterance = new SpeechSynthesisUtterance(textToSpeak);
        utterance.lang = "en-IN";
        utterance.onend = () => setTtsPlaying(false);
        utterance.onerror = () => setTtsPlaying(false);
        window.speechSynthesis.speak(utterance);
      } else {
        setTtsPlaying(false);
      }
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setSelectedImage(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleRunLeafScan = async () => {
    setScanLoading(true);
    setScanError(null);
    try {
      let base64ToSend = selectedImage;
      let mimeType = "image/jpeg";

      if (!selectedImage.startsWith("data:")) {
        const imgRes = await fetch(selectedImage);
        const blob = await imgRes.blob();
        mimeType = blob.type || "image/jpeg";
        base64ToSend = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.readAsDataURL(blob);
        });
      } else {
        const match = selectedImage.match(/^data:(image\/\w+);base64,/);
        if (match) mimeType = match[1];
      }

      const res = await fetch("/api/ai/leaf-scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imageBase64: base64ToSend,
          mimeType,
          cropName: cropType,
          language: selectedDialect,
          notes: fieldNotes,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Scan failed");
      setDiagnosis(data);
    } catch (err: any) {
      setScanError(err.message || "Could not complete AI leaf scan.");
    } finally {
      setScanLoading(false);
    }
  };

  const handleCreateGodownDeposit = (e: React.FormEvent) => {
    e.preventDefault();
    const marketVal = Math.round(newWeightKg * newRatePerKg);
    const advanceAmt = Math.round((marketVal * newAdvanceRate) / 100);
    const newEntry: GodownDeposit = {
      id: `dep-${Date.now()}`,
      receiptId: `WR-KND-${Math.floor(8900 + Math.random() * 900)}`,
      farmerName: "G. Narsimha Reddy",
      fpcCluster: "Kandi FPC Smart Hub #04",
      cropName: newCropName,
      grade: "Grade A+",
      weightKg: newWeightKg,
      marketValuationInr: marketVal,
      advanceRatePercent: newAdvanceRate,
      advanceDisbursedInr: advanceAmt,
      coldRoomTempC: 11.2,
      relativeHumidityPercent: 89,
      depositTimestamp: "Just now · IoT Weighbridge Verified",
      status: "Locked in Cold Chain",
    };
    onAddDeposit(newEntry);
    setDepositSuccessMsg(
      `Instant liquidity advance of ₹${advanceAmt.toLocaleString("en-IN")} (${newAdvanceRate}%) disbursed via UPI/IMPS against e-NWR ${newEntry.receiptId}.`
    );
    setTimeout(() => setDepositSuccessMsg(null), 6000);
  };

  return (
    <div id="app-krishi" className="space-y-8">
      {/* Portal Header Banner */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs text-emerald-700 font-medium">
            <span>Farmer Mode · Krishi Co-Pilot</span>
            <span aria-hidden="true">·</span>
            <span>Kandi FPC Cluster (Sangareddy)</span>
            <span aria-hidden="true">·</span>
            <span>Member ID: APK-2026-0841</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
            AgroPulse Krishi Portal
          </h2>
          <p className="text-sm text-slate-600 max-w-2xl">
            Real-time urban demand-to-supply analytics, voice-first vernacular advisory, multimodal leaf diagnostics, and automated investmentShield protection.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <div className="bg-emerald-50 border border-emerald-200 rounded-lg px-4 py-2.5 text-right">
            <div className="text-xs text-emerald-800">Harvest Pass Forward Demand Lock</div>
            <div className="text-lg font-bold text-emerald-900 font-mono tabular-nums">
              100% Demand-Backed{" "}
              <span className="text-xs font-normal text-emerald-700">(0% Distress Sell)</span>
            </div>
          </div>
        </div>
      </div>

      {/* 5 Primary Feature Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Card 1: Forward Demand & Supply Analytics */}
        <div
          className={`bg-white p-5 rounded-xl border transition-all flex flex-col justify-between ${
            activeTool === "demand-analytics"
              ? "border-emerald-600 ring-2 ring-emerald-600/15"
              : "border-slate-200 hover:border-slate-300"
          }`}
        >
          <div>
            <div className="w-12 h-12 bg-emerald-100 border border-emerald-300 rounded-lg flex items-center justify-center text-emerald-800 mb-4">
              <CalendarCheck className="w-6 h-6" />
            </div>
            <div className="text-xs text-emerald-700 font-semibold mb-1">
              Guaranteed Purchase Quotas
            </div>
            <h3 className="font-bold text-slate-900 text-sm">Harvest Pass Supply Plan</h3>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
              Urban consumer 1-year demand lists fed into your acreage sowing plan at locked prices.
            </p>
          </div>
          <button
            onClick={() => setActiveTool("demand-analytics")}
            className={`mt-4 w-full py-2 px-3 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap ${
              activeTool === "demand-analytics"
                ? "bg-emerald-700 text-white"
                : "bg-emerald-600 hover:bg-emerald-700 text-white"
            }`}
          >
            View Sowing Quotas
          </button>
        </div>

        {/* Card 2: Voice AI Advisory */}
        <div
          className={`bg-white p-5 rounded-xl border transition-all flex flex-col justify-between ${
            activeTool === "voice"
              ? "border-emerald-600 ring-2 ring-emerald-600/15"
              : "border-slate-200 hover:border-slate-300"
          }`}
        >
          <div>
            <div className="w-12 h-12 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center justify-center text-emerald-700 mb-4">
              <Mic className="w-6 h-6" />
            </div>
            <div className="text-xs text-slate-500 mb-1">
              Telugu · Hindi · Marathi
            </div>
            <h3 className="font-bold text-slate-900 text-sm">Voice AI Advisory</h3>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
              Tap & speak in your local dialect for zero-cost sprays and advance quotas.
            </p>
          </div>
          <button
            onClick={() => setActiveTool("voice")}
            className={`mt-4 w-full py-2 px-3 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap ${
              activeTool === "voice"
                ? "bg-emerald-700 text-white"
                : "bg-emerald-600 hover:bg-emerald-700 text-white"
            }`}
          >
            Start Voice Query
          </button>
        </div>

        {/* Card 3: Multimodal AI Soil & Leaf Scan */}
        <div
          className={`bg-white p-5 rounded-xl border transition-all flex flex-col justify-between ${
            activeTool === "scan"
              ? "border-amber-600 ring-2 ring-amber-600/15"
              : "border-slate-200 hover:border-slate-300"
          }`}
        >
          <div>
            <div className="w-12 h-12 bg-amber-50 border border-amber-200 rounded-lg flex items-center justify-center text-amber-700 mb-4">
              <Camera className="w-6 h-6" />
            </div>
            <div className="text-xs text-slate-500 mb-1">
              Zero-Cost Organic
            </div>
            <h3 className="font-bold text-slate-900 text-sm">AI Soil & Leaf Scan</h3>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
              Upload plant photo for zero-cost organic remediation (Jeevamrutham, Neemastra).
            </p>
          </div>
          <button
            onClick={() => setActiveTool("scan")}
            className={`mt-4 w-full py-2 px-3 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap ${
              activeTool === "scan"
                ? "bg-amber-700 text-white"
                : "bg-amber-600 hover:bg-amber-700 text-white"
            }`}
          >
            Scan Plant Health
          </button>
        </div>

        {/* Card 4: investmentShield Status */}
        <div
          className={`bg-white p-5 rounded-xl border transition-all flex flex-col justify-between ${
            activeTool === "shield"
              ? "border-blue-600 ring-2 ring-blue-600/15"
              : "border-slate-200 hover:border-slate-300"
          }`}
        >
          <div>
            <div className="w-12 h-12 bg-blue-50 border border-blue-200 rounded-lg flex items-center justify-center text-blue-700 mb-4">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div className="text-xs text-emerald-700 font-medium mb-1">
              Satellite Active
            </div>
            <h3 className="font-bold text-slate-900 text-sm">investmentShield</h3>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
              Automated parametric weather payouts triggered by ISRO EOS-04 & IMD radar.
            </p>
          </div>
          <button
            onClick={() => setActiveTool("shield")}
            className={`mt-4 w-full py-2 px-3 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap ${
              activeTool === "shield"
                ? "bg-blue-700 text-white"
                : "bg-blue-600 hover:bg-blue-700 text-white"
            }`}
          >
            View Payouts
          </button>
        </div>

        {/* Card 5: Smart Godown & 70-80% Liquidity Advance */}
        <div
          className={`bg-white p-5 rounded-xl border transition-all flex flex-col justify-between ${
            activeTool === "godown"
              ? "border-emerald-700 ring-2 ring-emerald-700/15"
              : "border-slate-200 hover:border-slate-300"
          }`}
        >
          <div>
            <div className="w-12 h-12 bg-slate-100 border border-slate-200 rounded-lg flex items-center justify-center text-slate-800 mb-4">
              <Warehouse className="w-6 h-6" />
            </div>
            <div className="text-xs text-slate-500 mb-1">
              70–80% Advance
            </div>
            <h3 className="font-bold text-slate-900 text-sm">Smart Godown</h3>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
              Store crop lots in solar cold rooms and get instant cash advances at 0% collateral.
            </p>
          </div>
          <button
            onClick={() => setActiveTool("godown")}
            className={`mt-4 w-full py-2 px-3 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap ${
              activeTool === "godown"
                ? "bg-slate-900 text-white"
                : "bg-slate-800 hover:bg-slate-900 text-white"
            }`}
          >
            Manage Deposits
          </button>
        </div>
      </div>

      {/* Interactive Workspace Area for Selected Krishi Tool */}
      <div className="bg-white border border-slate-200 rounded-xl p-6">
        {/* VIEW A: FORWARD DEMAND-TO-SUPPLY ANALYTICS */}
        {activeTool === "demand-analytics" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
              <div>
                <div className="text-xs font-semibold text-emerald-700 flex items-center gap-1.5">
                  <TrendingUp className="w-3.5 h-3.5" />
                  Live Urban Consumer Demand List Fed to Farmer Clusters
                </div>
                <h3 className="text-xl font-bold text-slate-900 mt-1">
                  Demand-First Crop Allocation & Sowing Schedule
                </h3>
                <p className="text-xs text-slate-600 mt-0.5">
                  Smallholder farmers in your FPC do not need to guess what to sow. Urban consumers have already pre-paid and locked 1-year purchase contracts.
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  handlePlayTTS(
                    "Namaskaram! Urban consumers have locked 1-year purchase passes for rice, pulses, and vegetables. Sowing quotas are guaranteed at 35% higher prices."
                  )
                }
                className="bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold px-3.5 py-2 rounded-lg flex items-center gap-1.5 self-start sm:self-auto transition"
              >
                <Volume2 className="w-4 h-4" />
                Hear Demand Quota Summary
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {harvestPassDemand.map((d) => (
                <div
                  key={d.id}
                  className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3 flex flex-col justify-between"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-500">{d.category}</span>
                      <span className="font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                        +{d.farmerNetRealizationBoostPercent}% Over Mandi
                      </span>
                    </div>
                    <h4 className="font-bold text-slate-900 text-base">{d.item}</h4>
                    <p className="text-xs text-slate-600">
                      Assigned Collective: <strong className="text-slate-800">{d.farmSource}</strong>
                    </p>

                    <div className="pt-2 border-t border-slate-200 space-y-1 text-xs font-mono tabular-nums">
                      <div className="flex justify-between">
                        <span className="text-slate-500">Contracted Demand:</span>
                        <span className="font-bold text-slate-900">{d.annualQtyLabel} / family</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Guaranteed Floor Price:</span>
                        <span className="font-bold text-emerald-700">₹{d.lockedWholesalePriceInrKg}/kg</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Target Acreage:</span>
                        <span className="font-semibold text-slate-800">{d.recommendedAcreage} acres</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Sowing Lead Time:</span>
                        <span className="text-slate-700">{d.sowingLeadWeeks} weeks</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-xs">
                    <span className="text-slate-500">Status:</span>
                    <span className="font-semibold text-emerald-800 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      {d.sowingStatus}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-emerald-950">
              <div className="space-y-0.5">
                <strong>Why Demand-First Farming Works:</strong>
                <p className="text-emerald-800">
                  By matching urban consumer annual grocery budgets before seeds are sown, AgroPulse guarantees 100% crop offtake, 0% middleman commission, and 75% advance working capital upon godown intake.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setActiveTool("godown")}
                className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg font-semibold shrink-0"
              >
                Deposit Lot Against Quota
              </button>
            </div>
          </div>
        )}

        {/* VIEW B: VOICE STUDIO */}
        {activeTool === "voice" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-5 space-y-5">
              <div>
                <div className="text-xs font-medium text-emerald-700">
                  Interactive Vernacular Voice Studio
                </div>
                <h3 className="text-xl font-bold text-slate-900 mt-1">
                  Speak or Type Your Field Question
                </h3>
                <p className="text-sm text-slate-600 mt-1">
                  AgroPulse Krishi AI answers in simple, farmer-friendly language and reads out the solution aloud.
                </p>
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-semibold text-slate-700">
                  Select Dialect / Language Mode
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    "Telugu + English (Vernacular)",
                    "Hindi + English (Kisan)",
                    "Marathi + English",
                    "Simple English",
                  ].map((lang) => (
                    <button
                      key={lang}
                      type="button"
                      onClick={() => setSelectedDialect(lang)}
                      className={`px-3 py-2 rounded-lg text-xs font-medium border text-left transition-colors ${
                        selectedDialect === lang
                          ? "bg-emerald-50 border-emerald-600 text-emerald-900"
                          : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
                      }`}
                    >
                      {lang}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-700">
                    Your Voice / Text Query
                  </label>
                  <button
                    type="button"
                    onClick={handleToggleSpeechInput}
                    className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-md transition-colors ${
                      isListening
                        ? "bg-red-600 text-white"
                        : "bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
                    }`}
                  >
                    {isListening ? (
                      <>
                        <MicOff className="w-3.5 h-3.5" />
                        Listening... Tap to Stop
                      </>
                    ) : (
                      <>
                        <Mic className="w-3.5 h-3.5" />
                        Tap Microphone to Speak
                      </>
                    )}
                  </button>
                </div>
                <textarea
                  rows={4}
                  value={voiceQuery}
                  onChange={(e) => setVoiceQuery(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 focus:border-emerald-600 focus:outline-none"
                  placeholder="Ask about organic pest remedies, soil health, weather payout, or godown advance..."
                />
              </div>

              <div className="space-y-2">
                <div className="text-xs text-slate-500">Quick Vernacular Prompts:</div>
                <div className="flex flex-wrap gap-2">
                  {[
                    "What forward Harvest Pass quotas are locked for Kandi cluster this season?",
                    "How to prepare Jeevamrutham for 1 acre tomatoes?",
                    "When will my Zaheerabad heavy rain insurance payout arrive?",
                  ].map((sample) => (
                    <button
                      key={sample}
                      type="button"
                      onClick={() => {
                        setVoiceQuery(sample);
                        handleRunVoiceQuery(sample);
                      }}
                      className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded-md transition-colors text-left"
                    >
                      {sample}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="button"
                disabled={voiceLoading}
                onClick={() => handleRunVoiceQuery()}
                className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white font-semibold py-2.5 px-4 rounded-lg text-sm flex items-center justify-center gap-2 transition-colors"
              >
                {voiceLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Generating Vernacular Advisory...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Get Instant Krishi AI Guidance
                  </>
                )}
              </button>
            </div>

            <div className="lg:col-span-7 bg-slate-50 border border-slate-200 rounded-xl p-6 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-4">
                <div>
                  <div className="text-xs text-slate-500">
                    AgroPulse Krishi Response · {selectedDialect}
                  </div>
                  <h4 className="text-base font-bold text-slate-900">
                    Verified Zero-Cost Agronomic & Financial Guidance
                  </h4>
                </div>
                <button
                  type="button"
                  onClick={() => handlePlayTTS(voiceResponse)}
                  className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap ${
                    ttsPlaying
                      ? "bg-amber-600 text-white"
                      : "bg-emerald-700 hover:bg-emerald-800 text-white"
                  }`}
                >
                  <Volume2 className="w-4 h-4" />
                  {ttsPlaying ? "Stop Audio Playback" : "Listen Aloud (Gemini TTS)"}
                </button>
              </div>

              {voiceError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700">
                  {voiceError}
                </div>
              )}

              <div className="text-sm text-slate-800 leading-relaxed whitespace-pre-line">
                {voiceResponse}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-3 border-t border-slate-200 text-xs">
                <div>
                  <span className="text-slate-500 block">Chemical Cost Saved</span>
                  <span className="font-bold text-emerald-700 font-mono tabular-nums text-sm">
                    ₹2,400 / acre
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block">Express Price Realization</span>
                  <span className="font-bold text-emerald-700 font-mono tabular-nums text-sm">
                    +35% Over Mandi Rate
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block">NGO Ground Support</span>
                  <span className="font-bold text-slate-900 text-sm">
                    Digital Green & BAIF Bio-Lab
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* VIEW C: LEAF & SOIL SCAN */}
        {activeTool === "scan" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-5 space-y-5">
              <div>
                <div className="text-xs font-medium text-amber-700">
                  Multimodal Vision Diagnostics
                </div>
                <h3 className="text-xl font-bold text-slate-900 mt-1">
                  AI Soil & Leaf Health Scanner
                </h3>
                <p className="text-sm text-slate-600 mt-1">
                  Upload a field photo or analyze the sample tomato leaf to generate a zero-cost organic remediation plan.
                </p>
              </div>

              <div className="relative rounded-xl overflow-hidden border border-slate-200 bg-slate-100 aspect-4/3">
                <img
                  src={selectedImage}
                  alt="Crop leaf sample for AI diagnostics"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-3 right-3 flex gap-2">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="bg-slate-900/90 hover:bg-slate-900 text-white text-xs font-medium px-3 py-1.5 rounded-lg flex items-center gap-1.5 backdrop-blur-xs transition-colors"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    Upload Field Photo
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Crop Variety
                  </label>
                  <input
                    type="text"
                    value={cropType}
                    onChange={(e) => setCropType(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Output Language
                  </label>
                  <select
                    value={selectedDialect}
                    onChange={(e) => setSelectedDialect(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 bg-white"
                  >
                    <option value="Telugu + English (Vernacular)">Telugu + English</option>
                    <option value="Hindi + English (Kisan)">Hindi + English</option>
                    <option value="Simple English">Simple English</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Observed Field Symptoms / Soil Notes
                </label>
                <input
                  type="text"
                  value={fieldNotes}
                  onChange={(e) => setFieldNotes(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900"
                />
              </div>

              <button
                type="button"
                disabled={scanLoading}
                onClick={handleRunLeafScan}
                className="w-full bg-amber-600 hover:bg-amber-700 disabled:opacity-60 text-white font-semibold py-2.5 px-4 rounded-lg text-sm flex items-center justify-center gap-2 transition-colors"
              >
                {scanLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Analyzing Leaf & Soil Microbiome...
                  </>
                ) : (
                  <>
                    <Camera className="w-4 h-4" />
                    Run Multimodal AI Diagnosis
                  </>
                )}
              </button>
            </div>

            <div className="lg:col-span-7 space-y-5">
              {scanError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700">
                  {scanError}
                </div>
              )}

              <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-4">
                <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-200 pb-4">
                  <div>
                    <div className="text-xs text-slate-500">
                      AI Diagnostic Report · Confidence {diagnosis.confidencePercent}% · Severity: {diagnosis.severity}
                    </div>
                    <h4 className="text-lg font-bold text-slate-900 mt-0.5">
                      {diagnosis.conditionName}
                    </h4>
                  </div>
                  <button
                    type="button"
                    onClick={() => handlePlayTTS(diagnosis.vernacularSummary)}
                    className="inline-flex items-center gap-1.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    {ttsPlaying ? "Stop Audio" : "Hear Summary"}
                  </button>
                </div>

                <div className="space-y-1.5">
                  <div className="text-xs font-semibold text-slate-700">
                    Visual Biomarkers Detected:
                  </div>
                  <ul className="space-y-1 text-xs text-slate-600 list-disc list-inside">
                    {diagnosis.symptomsObserved.map((sym, i) => (
                      <li key={i}>{sym}</li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-3 pt-2">
                  <div className="text-xs font-semibold text-emerald-800">
                    Zero-Cost Organic Remediation Protocol (No Synthetic Chemicals):
                  </div>
                  <div className="grid grid-cols-1 gap-3">
                    {diagnosis.zeroCostRemediation.map((step, idx) => (
                      <div
                        key={idx}
                        className="bg-white border border-slate-200 rounded-lg p-4 space-y-1.5"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-bold text-sm text-slate-900">
                            0{idx + 1}. {step.title}
                          </span>
                          <span className="text-xs font-mono tabular-nums text-emerald-700 font-semibold">
                            Saves ₹{step.estimatedSavingsInr}/acre
                          </span>
                        </div>
                        <p className="text-xs text-slate-600">
                          <strong className="text-slate-800">Preparation:</strong> {step.preparation}
                        </p>
                        <p className="text-xs text-slate-600">
                          <strong className="text-slate-800">Application:</strong> {step.dosageAndSchedule}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-600">
                  <span>
                    <strong className="text-slate-900">Traceability Impact:</strong> {diagnosis.soilHealthImpact}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* VIEW D: SATELLITE SHIELD */}
        {activeTool === "shield" && (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-4">
              <div>
                <div className="text-xs font-medium text-blue-700">
                  Automated Parametric Micro-Insurance · ISRO EOS-04 & IMD Grid
                </div>
                <h3 className="text-xl font-bold text-slate-900 mt-1">
                  investmentShield Satellite Telemetry & Direct Payouts
                </h3>
                <p className="text-sm text-slate-600 mt-0.5">
                  When satellite rainfall exceeds 35 mm/hr or dry spells cross 14 days, smart contracts automatically disburse protection payouts to your bank account with zero claim forms.
                </p>
              </div>
              <div className="bg-emerald-50 border border-emerald-200 rounded-lg px-4 py-2.5 shrink-0">
                <div className="text-xs text-emerald-800">Policy #ISH-KND-9042 Status</div>
                <div className="text-sm font-bold text-emerald-900 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Insured · Satellite Active (₹45,000 Cover)
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-xs font-semibold text-slate-500">
                    <th className="py-3 pr-4">Cluster & Satellite Source</th>
                    <th className="py-3 px-4 text-right">50-Yr Baseline</th>
                    <th className="py-3 px-4 text-right">Live Rainfall / Threshold</th>
                    <th className="py-3 px-4 text-right">Dry Spell Days</th>
                    <th className="py-3 px-4 text-right">Soil Moisture</th>
                    <th className="py-3 px-4">Trigger State</th>
                    <th className="py-3 pl-4 text-right">Simulate / Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 text-sm">
                  {weatherRegions.map((reg) => (
                    <tr key={reg.id} className="hover:bg-slate-50">
                      <td className="py-3.5 pr-4">
                        <div className="font-semibold text-slate-900">{reg.clusterName}</div>
                        <div className="text-xs text-slate-500">
                          {reg.district} · {reg.satelliteSource}
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono tabular-nums text-slate-700">
                        {reg.reanalysisBaseline50YrMm.toFixed(1)} mm/hr
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono tabular-nums">
                        <span
                          className={
                            reg.liveRainfallMmHr >= reg.rainfallThresholdMmHr
                              ? "font-bold text-red-600"
                              : reg.liveRainfallMmHr >= 30
                              ? "font-semibold text-amber-600"
                              : "text-slate-900"
                          }
                        >
                          {reg.liveRainfallMmHr.toFixed(1)}
                        </span>{" "}
                        <span className="text-xs text-slate-400">
                          / {reg.rainfallThresholdMmHr.toFixed(0)} mm/hr
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono tabular-nums text-slate-700">
                        {reg.consecutiveDryDays} / {reg.drySpellThresholdDays} d
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono tabular-nums text-slate-700">
                        {reg.soilMoistureIndexPercent}%
                      </td>
                      <td className="py-3.5 px-4">
                        {reg.status === "Payout Triggered" ? (
                          <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Auto-Payout Disbursed
                          </span>
                        ) : reg.status === "Standby Alert" ? (
                          <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-700">
                            <AlertTriangle className="w-3.5 h-3.5" />
                            Parametric Standby
                          </span>
                        ) : (
                          <span className="text-xs text-slate-600">Nominal Safe Band</span>
                        )}
                      </td>
                      <td className="py-3.5 pl-4 text-right">
                        {reg.status === "Payout Triggered" ? (
                          <span className="text-xs font-mono tabular-nums text-emerald-700 font-semibold">
                            ₹12,500 Credited/Farmer
                          </span>
                        ) : (
                          <button
                            type="button"
                            onClick={() => onTriggerCalamityPayout(reg.id)}
                            className="text-xs font-semibold text-blue-700 hover:text-blue-900 underline whitespace-nowrap"
                          >
                            Simulate Threshold Breach
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

        {/* VIEW E: SMART GODOWN */}
        {activeTool === "godown" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-5 space-y-4">
              <div>
                <div className="text-xs font-medium text-emerald-700">
                  Decentralized FPC Cold Storage & Instant Credit
                </div>
                <h3 className="text-xl font-bold text-slate-900 mt-1">
                  Deposit Harvest & Unlock 70–80% Advance
                </h3>
                <p className="text-sm text-slate-600 mt-1">
                  Store graded produce in solar-powered FPC smart godowns. Receive 70–80% instant liquidity while waiting for peak urban Express demand.
                </p>
              </div>

              <form onSubmit={handleCreateGodownDeposit} className="space-y-4 bg-slate-50 p-5 rounded-xl border border-slate-200">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Select Crop Lot for Kandi Smart Hub #04
                  </label>
                  <select
                    value={newCropName}
                    onChange={(e) => {
                      setNewCropName(e.target.value);
                      if (e.target.value.includes("Spinach")) setNewRatePerKg(100);
                      else if (e.target.value.includes("Mango")) setNewRatePerKg(120);
                      else setNewRatePerKg(38);
                    }}
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900"
                  >
                    <option value="Hydroponic Roma Tomatoes">Hydroponic Roma Tomatoes (₹38/kg)</option>
                    <option value="Pesticide-Free Baby Spinach">Pesticide-Free Baby Spinach (₹100/kg)</option>
                    <option value="Carbide-Free Alphonso Mangoes">Carbide-Free Alphonso Mangoes (₹120/kg)</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Net Weight (kg)
                    </label>
                    <input
                      type="number"
                      min={50}
                      max={5000}
                      value={newWeightKg}
                      onChange={(e) => setNewWeightKg(Number(e.target.value) || 0)}
                      className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-mono tabular-nums"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Advance Rate (70%–80%)
                    </label>
                    <input
                      type="number"
                      min={70}
                      max={80}
                      value={newAdvanceRate}
                      onChange={(e) =>
                        setNewAdvanceRate(Math.min(80, Math.max(70, Number(e.target.value) || 75)))
                      }
                      className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-mono tabular-nums"
                    />
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-xs">
                  <span className="text-slate-600">Lot Valuation:</span>
                  <span className="font-mono tabular-nums font-semibold text-slate-900">
                    ₹{(newWeightKg * newRatePerKg).toLocaleString("en-IN")}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="font-semibold text-emerald-900">
                    Instant Bank Transfer ({newAdvanceRate}%):
                  </span>
                  <span className="font-mono tabular-nums font-bold text-emerald-700 text-base">
                    ₹{Math.round((newWeightKg * newRatePerKg * newAdvanceRate) / 100).toLocaleString("en-IN")}
                  </span>
                </div>

                <button
                  type="submit"
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2.5 px-4 rounded-lg text-sm flex items-center justify-center gap-2 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Generate e-NWR & Disburse Advance
                </button>
              </form>

              {depositSuccessMsg && (
                <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-900 font-medium">
                  {depositSuccessMsg}
                </div>
              )}
            </div>

            <div className="lg:col-span-7 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-base font-bold text-slate-900">
                  Active Smart Godown Warehouse Receipts (e-NWR)
                </h4>
                <span className="text-xs text-slate-500 font-mono tabular-nums">
                  {deposits.length} Active Lots
                </span>
              </div>

              <div className="overflow-x-auto border border-slate-200 rounded-xl">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-500">
                      <th className="py-3 px-4">Receipt & Crop</th>
                      <th className="py-3 px-4 text-right">Weight</th>
                      <th className="py-3 px-4 text-right">Valuation</th>
                      <th className="py-3 px-4 text-right">70-80% Advance</th>
                      <th className="py-3 px-4">Cold Chain Telemetry</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 text-sm">
                    {deposits.map((dep) => (
                      <tr key={dep.id} className="hover:bg-slate-50">
                        <td className="py-3 px-4">
                          <div className="font-semibold text-slate-900">
                            {dep.cropName}
                          </div>
                          <div className="text-xs text-slate-500">
                            {dep.receiptId} · {dep.farmerName}
                          </div>
                        </td>
                        <td className="py-3 px-4 text-right font-mono tabular-nums text-slate-700">
                          {dep.weightKg} kg
                        </td>
                        <td className="py-3 px-4 text-right font-mono tabular-nums text-slate-700">
                          ₹{dep.marketValuationInr.toLocaleString("en-IN")}
                        </td>
                        <td className="py-3 px-4 text-right font-mono tabular-nums font-semibold text-emerald-700">
                          ₹{dep.advanceDisbursedInr.toLocaleString("en-IN")}{" "}
                          <span className="text-xs font-normal text-slate-500">
                            ({dep.advanceRatePercent}%)
                          </span>
                        </td>
                        <td className="py-3 px-4 text-xs text-slate-600 font-mono tabular-nums">
                          {dep.coldRoomTempC}°C · {dep.relativeHumidityPercent}% RH · {dep.status}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
