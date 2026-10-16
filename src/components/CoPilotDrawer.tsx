import React, { useState } from "react";
import { X, Send, Sparkles, Volume2, RefreshCw } from "lucide-react";
import { AppMode } from "../data/ecosystemData";

interface CoPilotDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  activeMode: AppMode;
  ecosystemSnapshot: any;
}

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  text: string;
  mode: AppMode;
}

const MODE_LABELS: Record<AppMode, { title: string; subtitle: string; prompts: string[] }> = {
  krishi: {
    title: "AgroPulse Krishi Co-Pilot (Farmer Mode)",
    subtitle: "Vernacular voice-friendly guidance, zero-cost organic remediation & investmentShield",
    prompts: [
      "Give me a zero-cost organic spray for leaf curl in chillies and tomatoes.",
      "How does ISRO satellite rainfall trigger my investmentShield payout automatically?",
      "If I deposit 1,000 kg of Grade A onions in Kandi Smart Godown, how much 75% cash advance do I get today?",
    ],
  },
  admin: {
    title: "AgroPulse Command Co-Pilot (Platform Admin Mode)",
    subtitle: "50-year weather reanalysis, FPC godown capital allocation & NGO field coordination",
    prompts: [
      "Analyze current parametric trigger exposure in Zaheerabad and Warangal clusters.",
      "How should we allocate ₹50 Lakh working capital across Kandi and Chevella smart godowns?",
      "Coordinate a joint field audit plan for PRADAN, BAIF, and Digital Green this week.",
    ],
  },
  express: {
    title: "AgroPulse Express Co-Pilot (Urban Consumer Mode)",
    subtitle: "15-minute delivery SLA, farm-to-doorstep traceability & -20% consumer / +35% farmer economics",
    prompts: [
      "Trace the harvest timestamp and organic soil protocol of G. Narsimha Reddy's Roma Tomatoes.",
      "How does AgroPulse Express deliver in 14 minutes while paying farmers 35% more and charging consumers 20% less?",
      "Which items in the storefront were verified with zero-chemical biological inputs today?",
    ],
  },
};

export const CoPilotDrawer: React.FC<CoPilotDrawerProps> = ({
  isOpen,
  onClose,
  activeMode,
  ecosystemSnapshot,
}) => {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [speakingId, setSpeakingId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome-1",
      role: "assistant",
      mode: "krishi",
      text: "Welcome to AgroPulse AI! I am your multi-persona co-pilot. Switch between Krishi (Farmer), Command Center (Admin), or Express (Consumer) at any time and ask me anything about zero-cost organic diagnostics, satellite micro-insurance, smart godown advances, or 15-minute farm-to-doorstep traceability.",
    },
  ]);

  if (!isOpen) return null;

  const currentMeta = MODE_LABELS[activeMode];

  const handleSendMessage = async (promptText?: string) => {
    const textToSend = (promptText ?? input).trim();
    if (!textToSend || loading) return;

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      role: "user",
      text: textToSend,
      mode: activeMode,
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/ai/copilot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode: activeMode,
          message: textToSend,
          contextData: ecosystemSnapshot,
        }),
      });
      const data = await res.json();
      const replyText =
        res.ok && data.reply
          ? data.reply
          : "Unable to reach AgroPulse AI service right now. Please try again.";

      setMessages((prev) => [
        ...prev,
        {
          id: `a-${Date.now()}`,
          role: "assistant",
          text: replyText,
          mode: activeMode,
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: `a-${Date.now()}`,
          role: "assistant",
          text: "Network error communicating with AgroPulse AI server.",
          mode: activeMode,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSpeakMessage = async (msg: ChatMessage) => {
    if (speakingId === msg.id) {
      window.speechSynthesis?.cancel();
      setSpeakingId(null);
      return;
    }
    setSpeakingId(msg.id);
    try {
      const res = await fetch("/api/ai/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: msg.text }),
      });
      const data = await res.json();
      if (res.ok && data.audioDataUrl) {
        const audio = new Audio(data.audioDataUrl);
        audio.onended = () => setSpeakingId(null);
        audio.onerror = () => setSpeakingId(null);
        await audio.play();
        return;
      }
      throw new Error("Fallback TTS");
    } catch {
      if ("speechSynthesis" in window) {
        const u = new SpeechSynthesisUtterance(msg.text);
        u.lang = "en-IN";
        u.onend = () => setSpeakingId(null);
        u.onerror = () => setSpeakingId(null);
        window.speechSynthesis.speak(u);
      } else {
        setSpeakingId(null);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex justify-end">
      <div className="bg-white w-full max-w-lg h-full flex flex-col border-l border-slate-200 shadow-2xl">
        {/* Drawer Header */}
        <div className="p-5 bg-emerald-950 text-white flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-1.5 text-xs text-emerald-300 font-medium">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Active Persona: {activeMode.toUpperCase()}</span>
            </div>
            <h3 className="text-base font-bold mt-0.5">{currentMeta.title}</h3>
            <p className="text-xs text-emerald-200/80 mt-0.5">{currentMeta.subtitle}</p>
          </div>
          <button
            type="button"
            aria-label="Close AI Co-Pilot"
            onClick={onClose}
            className="p-1.5 rounded-lg text-emerald-200 hover:text-white hover:bg-emerald-900"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Suggested Persona Prompts */}
        <div className="px-5 py-3 bg-slate-50 border-b border-slate-200 space-y-2">
          <div className="text-xs font-semibold text-slate-500">
            Suggested {activeMode === "krishi" ? "Farmer" : activeMode === "admin" ? "Command Center" : "Consumer"} Prompts:
          </div>
          <div className="flex flex-col gap-1.5">
            {currentMeta.prompts.map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => handleSendMessage(p)}
                className="text-left text-xs bg-white hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 rounded-lg px-3 py-1.5 text-slate-700 transition-colors"
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* Messages Feed */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex flex-col ${
                m.role === "user" ? "items-end" : "items-start"
              }`}
            >
              <div
                className={`max-w-[90%] rounded-xl p-4 text-sm leading-relaxed whitespace-pre-line ${
                  m.role === "user"
                    ? "bg-emerald-700 text-white"
                    : "bg-slate-100 text-slate-900 border border-slate-200"
                }`}
              >
                {m.text}
              </div>
              {m.role === "assistant" && (
                <button
                  type="button"
                  onClick={() => handleSpeakMessage(m)}
                  className="mt-1 inline-flex items-center gap-1 text-xs text-slate-500 hover:text-emerald-700"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  {speakingId === m.id ? "Stop Reading" : "Read Aloud"}
                </button>
              )}
            </div>
          ))}
          {loading && (
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-emerald-600" />
              AgroPulse AI ({activeMode}) is analyzing...
            </div>
          )}
        </div>

        {/* Input Box */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="p-4 border-t border-slate-200 bg-white flex items-center gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={`Ask AgroPulse AI in ${activeMode} mode...`}
            className="flex-1 rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 focus:border-emerald-600 focus:outline-none"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white px-4 py-2.5 rounded-lg text-sm font-semibold flex items-center gap-1.5 transition-colors shrink-0"
          >
            <Send className="w-4 h-4" />
            Send
          </button>
        </form>
      </div>
    </div>
  );
};
