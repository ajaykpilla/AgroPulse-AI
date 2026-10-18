import React, { useState, useEffect, useRef } from "react";
import {
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Volume2,
  VolumeX,
  X,
  CheckCircle2,
  Download,
  Clock,
  Video,
  Layers,
  ChevronRight,
  Maximize2,
  RefreshCw,
  FileText,
} from "lucide-react";
import {
  FOUR_MINUTE_DEMO_SCENES,
  DemoScene,
} from "../data/demoVideoData";
import { AppMode } from "../data/ecosystemData";
import {
  exportDemoVideoFile,
  triggerFileDownload,
  exportDemoScriptPackage,
  downloadConsolidatedDemoVideo,
} from "../utils/videoExporter";

interface DemoVideoPlayerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToPersona: (mode: AppMode) => void;
}

export const DemoVideoPlayerModal: React.FC<DemoVideoPlayerModalProps> = ({
  isOpen,
  onClose,
  onNavigateToPersona,
}) => {
  const [currentSceneIdx, setCurrentSceneIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [elapsedSec, setElapsedSec] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Download video generation state
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [exportStatusText, setExportStatusText] = useState("");
  const [downloadReadyUrl, setDownloadReadyUrl] = useState<string | null>(null);

  const totalDurationSec = FOUR_MINUTE_DEMO_SCENES.reduce(
    (acc, s) => acc + s.durationSec,
    0
  ); // 240 seconds (4:00 minutes)

  const activeScene: DemoScene = FOUR_MINUTE_DEMO_SCENES[currentSceneIdx];
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Sync mode in parent app when scene changes
  useEffect(() => {
    if (isOpen) {
      onNavigateToPersona(activeScene.targetMode);
    }
  }, [currentSceneIdx, isOpen]);

  // Timer loop for simulation playback
  useEffect(() => {
    let interval: any = null;
    if (isPlaying) {
      interval = setInterval(() => {
        setElapsedSec((prev) => {
          if (prev >= totalDurationSec) {
            setIsPlaying(false);
            return totalDurationSec;
          }

          let accumulated = 0;
          for (let i = 0; i < FOUR_MINUTE_DEMO_SCENES.length; i++) {
            accumulated += FOUR_MINUTE_DEMO_SCENES[i].durationSec;
            if (prev + 1 < accumulated) {
              if (currentSceneIdx !== i) setCurrentSceneIdx(i);
              break;
            }
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, totalDurationSec, currentSceneIdx]);

  // Audio voiceover trigger
  const playCurrentSceneAudio = async () => {
    if (isMuted) return;
    setIsSpeaking(true);

    const useFallback = (reason: string) => {
      console.warn(`TTS ${reason}, falling back to Web Speech API.`);
      if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(activeScene.narrationVoiceover);
        utterance.lang = "en-IN";
        utterance.rate = 1.05;
        utterance.onend = () => setIsSpeaking(false);
        utterance.onerror = () => setIsSpeaking(false);
        window.speechSynthesis.speak(utterance);
      } else {
        setIsSpeaking(false);
      }
    };

    try {
      const res = await fetch("/api/ai/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: activeScene.narrationVoiceover,
        }),
      });

      if (res.status === 429) {
        useFallback("quota exceeded (429)");
        return;
      }

      const data = await res.json();
      if (res.ok && data.audioDataUrl) {
        if (audioRef.current) {
          audioRef.current.pause();
        }
        const audio = new Audio(data.audioDataUrl);
        audioRef.current = audio;
        audio.onended = () => setIsSpeaking(false);
        audio.onerror = () => setIsSpeaking(false);
        await audio.play();
        return;
      }
      throw new Error(data.error || "Speech synthesis failed");
    } catch (err) {
      useFallback("request failed");
    }
  };

  const handleTogglePlay = () => {
    const nextState = !isPlaying;
    setIsPlaying(nextState);
    if (nextState && !isMuted) {
      playCurrentSceneAudio();
    } else {
      if (audioRef.current) audioRef.current.pause();
      window.speechSynthesis?.cancel();
      setIsSpeaking(false);
    }
  };

  const handleSelectScene = (index: number) => {
    setCurrentSceneIdx(index);
    let startSec = 0;
    for (let i = 0; i < index; i++) {
      startSec += FOUR_MINUTE_DEMO_SCENES[i].durationSec;
    }
    setElapsedSec(startSec);
    if (isPlaying && !isMuted) {
      setTimeout(() => playCurrentSceneAudio(), 200);
    }
  };

  const handleNextScene = () => {
    if (currentSceneIdx < FOUR_MINUTE_DEMO_SCENES.length - 1) {
      handleSelectScene(currentSceneIdx + 1);
    }
  };

  const handlePrevScene = () => {
    if (currentSceneIdx > 0) {
      handleSelectScene(currentSceneIdx - 1);
    }
  };

  const handleClose = () => {
    setIsPlaying(false);
    if (audioRef.current) audioRef.current.pause();
    window.speechSynthesis?.cancel();
    onClose();
  };

  // Consolidated 4-Minute Video Download Handler
  const handleDownloadVideo = async () => {
    if (isExporting) return;
    setIsExporting(true);
    setExportProgress(0);
    setExportStatusText("Accessing consolidated 4-minute demo video...");

    try {
      await downloadConsolidatedDemoVideo((pct, status) => {
        setExportProgress(pct);
        setExportStatusText(status);
      });
      setDownloadReadyUrl("/api/download-demo-video");
    } catch (err: any) {
      console.error("Video export failed:", err);
      setExportStatusText(err?.message || "Failed to download video file.");
    } finally {
      setIsExporting(false);
    }
  };

  if (!isOpen) return null;

  const formatMinSec = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  const progressPercent = Math.min(100, (elapsedSec / totalDurationSec) * 100);

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 text-white rounded-2xl max-w-5xl w-full overflow-hidden shadow-2xl flex flex-col my-auto">
        {/* Modal Top Bar */}
        <div className="px-6 py-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center shrink-0">
              <Video className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
                  AgroPulse 4-Minute Interactive Video Walkthrough
                </span>
                <span className="text-xs text-slate-500 font-mono">
                  {activeScene.timestamp}
                </span>
              </div>
              <h3 className="text-sm sm:text-base font-bold text-white tracking-tight">
                {activeScene.title}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* DOWNLOAD CONSOLIDATED 4-MIN DEMO VIDEO BUTTON */}
            <button
              type="button"
              disabled={isExporting}
              onClick={handleDownloadVideo}
              className="text-xs bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white px-3.5 py-1.5 rounded-lg flex items-center gap-1.5 font-semibold transition shadow-sm whitespace-nowrap"
              title="Download consolidated full 4-minute demo walkthrough video (.mp4)"
            >
              {isExporting ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Processing ({exportProgress}%)...</span>
                </>
              ) : (
                <>
                  <Download className="w-3.5 h-3.5" />
                  <span>Download 4-Min Video (.mp4)</span>
                </>
              )}
            </button>

            {/* DOWNLOAD SCRIPT & STORYBOARD BUTTON */}
            <button
              type="button"
              onClick={exportDemoScriptPackage}
              className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white px-3 py-1.5 rounded-lg border border-slate-700 hidden sm:flex items-center gap-1.5 transition whitespace-nowrap"
              title="Download full 4-minute presentation transcript and storyboard"
            >
              <FileText className="w-3.5 h-3.5 text-emerald-400" />
              <span>Script (.md)</span>
            </button>

            <button
              type="button"
              onClick={() => onNavigateToPersona(activeScene.targetMode)}
              className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white px-3 py-1.5 rounded-lg border border-slate-700 hidden sm:flex items-center gap-1.5 transition"
            >
              <Maximize2 className="w-3.5 h-3.5" />
              <span>Explore Screen</span>
            </button>
            <button
              type="button"
              aria-label="Close demo player"
              onClick={handleClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Video Rendering Progress Banner if active */}
        {isExporting && (
          <div className="bg-emerald-950/90 border-b border-emerald-800 px-6 py-2.5 flex items-center justify-between text-xs text-emerald-200">
            <span className="flex items-center gap-2">
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-emerald-400" />
              {exportStatusText}
            </span>
            <span className="font-mono tabular-nums font-bold text-emerald-400">
              {exportProgress}%
            </span>
          </div>
        )}

        {downloadReadyUrl && !isExporting && (
          <div className="bg-emerald-900/40 border-b border-emerald-700/60 px-6 py-2 flex items-center justify-between text-xs text-emerald-300">
            <span className="flex items-center gap-2 font-medium">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              Video downloaded to your device! You can also re-download directly:
            </span>
            <a
              href={downloadReadyUrl}
              download="AgroPulse_4Min_Walkthrough_Demo.webm"
              className="font-bold underline text-white hover:text-emerald-200"
            >
              Click here to save again
            </a>
          </div>
        )}

        {/* Video Screen Simulation & Cinematic Stage */}
        <div className="relative aspect-16/9 bg-slate-950 overflow-hidden flex flex-col justify-end">
          <img
            src={activeScene.slideImg}
            alt={activeScene.title}
            referrerPolicy="no-referrer"
            className="absolute inset-0 w-full h-full object-cover opacity-45 transition-opacity duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent"></div>

          {/* Center Stage Presentation Overlay */}
          <div className="relative z-10 p-6 sm:p-8 space-y-4 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="bg-emerald-500 text-slate-950 text-xs font-bold px-2.5 py-0.5 rounded-md uppercase tracking-wider">
                {activeScene.persona}
              </span>
              <span className="text-xs font-medium text-emerald-300 bg-emerald-950/80 border border-emerald-500/30 px-2.5 py-0.5 rounded-md">
                {activeScene.focusTag}
              </span>
            </div>

            <h2 className="text-xl sm:text-3xl font-extrabold text-white tracking-tight leading-snug">
              {activeScene.title}
            </h2>

            {/* Live Narration Voiceover Display */}
            <div className="bg-slate-900/85 border border-slate-700/80 p-4 rounded-xl backdrop-blur-md space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="flex items-center gap-1.5 font-medium text-emerald-400">
                  <Volume2 className={`w-3.5 h-3.5 ${isSpeaking ? "animate-pulse" : ""}`} />
                  AI Voiceover Narration:
                </span>
                <span className="font-mono text-slate-400">
                  {formatMinSec(elapsedSec)} / {formatMinSec(totalDurationSec)}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-sans">
                "{activeScene.narrationVoiceover}"
              </p>
            </div>

            {/* Key Value Delivery Takeaways */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
              {activeScene.keyTakeaways.map((point, idx) => (
                <div
                  key={idx}
                  className="bg-slate-950/70 border border-slate-800 p-2.5 rounded-lg flex items-start gap-2 text-slate-300"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{point}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Video Scrub / Progress Bar */}
          <div className="relative z-10 px-6 py-2">
            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden cursor-pointer">
              <div
                className="bg-emerald-500 h-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>
          </div>

          {/* Media Player Control Bar */}
          <div className="relative z-10 px-6 py-3 bg-slate-950/90 border-t border-slate-800 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleTogglePlay}
                className="w-10 h-10 rounded-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 flex items-center justify-center font-bold shadow-lg transition"
              >
                {isPlaying ? (
                  <Pause className="w-5 h-5 fill-slate-950" />
                ) : (
                  <Play className="w-5 h-5 fill-slate-950 ml-0.5" />
                )}
              </button>

              <button
                type="button"
                onClick={handlePrevScene}
                disabled={currentSceneIdx === 0}
                className="p-2 rounded-lg text-slate-400 hover:text-white disabled:opacity-40"
              >
                <SkipBack className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={handleNextScene}
                disabled={currentSceneIdx === FOUR_MINUTE_DEMO_SCENES.length - 1}
                className="p-2 rounded-lg text-slate-400 hover:text-white disabled:opacity-40"
              >
                <SkipForward className="w-4 h-4" />
              </button>

              <span className="text-xs font-mono tabular-nums text-slate-300">
                {formatMinSec(elapsedSec)} <span className="text-slate-500">/ 4:00</span>
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setIsMuted(!isMuted);
                  if (!isMuted) {
                    if (audioRef.current) audioRef.current.pause();
                    window.speechSynthesis?.cancel();
                    setIsSpeaking(false);
                  } else {
                    playCurrentSceneAudio();
                  }
                }}
                className={`p-2 rounded-lg border text-xs font-semibold flex items-center gap-1.5 transition ${
                  isMuted
                    ? "bg-red-950/60 border-red-800 text-red-300"
                    : "bg-slate-800 border-slate-700 text-slate-300 hover:text-white"
                }`}
              >
                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                <span className="hidden sm:inline">
                  {isMuted ? "Audio Muted" : isSpeaking ? "Voiceover Playing" : "Voiceover Active"}
                </span>
              </button>

              <button
                type="button"
                onClick={() => onNavigateToPersona(activeScene.targetMode)}
                className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition"
              >
                Explore This Persona Screen
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* 5-Scene Chapter Timeline & Storyboard Selector */}
        <div className="p-5 bg-slate-950 border-t border-slate-800 space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-emerald-400" />
              Video Chapter Index (5 Scenes · 4:00 Total Run Time)
            </span>
            <span>Click any chapter to jump and hear voiceover</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-5 gap-2.5">
            {FOUR_MINUTE_DEMO_SCENES.map((scene, i) => {
              const isSelected = i === currentSceneIdx;
              return (
                <button
                  key={scene.id}
                  type="button"
                  onClick={() => handleSelectScene(i)}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    isSelected
                      ? "bg-slate-800/90 border-emerald-500 shadow-md ring-1 ring-emerald-500/40"
                      : "bg-slate-900/60 border-slate-800 hover:bg-slate-800/50 hover:border-slate-700"
                  }`}
                >
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                    <span className="font-mono">{scene.timestamp.split(" ")[0]}</span>
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded font-medium ${
                        isSelected
                          ? "bg-emerald-500 text-slate-950 font-bold"
                          : "bg-slate-800 text-slate-400"
                      }`}
                    >
                      {scene.durationSec}s
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-white line-clamp-2 leading-tight">
                    {scene.title}
                  </h4>
                  <div className="mt-2 flex items-center text-[11px] text-emerald-400 font-medium">
                    <span>{scene.persona.split(" ")[0]}</span>
                    <ChevronRight className="w-3 h-3 ml-auto" />
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
