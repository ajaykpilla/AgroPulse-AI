import demoHeroCoverImg from "../assets/images/demo_video_hero_cover_1792312951901.jpg";
import demoSlide2Img from "../assets/images/demo_slide_scene2_krishi_1792313428195.jpg";
import demoSlide3Img from "../assets/images/demo_slide_scene3_godown_1792313427943.jpg";
import demoSlide4Img from "../assets/images/demo_slide_scene4_express_1792313427497.jpg";

export interface DemoScene {
  id: string;
  timestamp: string;
  durationSec: number;
  title: string;
  persona: "Overview" | "AgroPulse Krishi (Farmer)" | "AgroPulse Express (Consumer)" | "AgroPulse Command Center (Admin)" | "Conclusion & Impact";
  focusTag: string;
  narrationVoiceover: string;
  uiActionPrompt: string;
  targetMode: "krishi" | "admin" | "express";
  keyTakeaways: string[];
  slideImg: string;
}

export const DEMO_VIDEO_COVER_IMG = demoHeroCoverImg;

export const FOUR_MINUTE_DEMO_SCENES: DemoScene[] = [
  {
    id: "scene-1",
    timestamp: "0:00 - 0:45 (45s)",
    durationSec: 45,
    title: "1. The Agritech Broken Loop & AgroPulse Vision",
    persona: "Overview",
    focusTag: "Closed-Loop Agritech & Quick-Commerce",
    narrationVoiceover:
      "Welcome to AgroPulse: the radical, closed-loop ecosystem shattering the broken agriculture paradigm. While rural farmers haemorrhage 40 pct of their yield to middlemen, urban consumers endure inflated costs for stale produce. AgroPulse obliterates this disparity. We integrate three power-platforms: Krishi Farmer Intelligence, the Command Center Operations Engine, and Express 15-minute Farm-to-Doorstep Delivery. This is not just agritech—this is the total restoration of supply chain equity, delivering 20 pct lower consumer costs and 35 pct higher net farmer earnings.",
    uiActionPrompt: "Introducing the 3-Persona Top Navigation switcher and ecosystem metrics.",
    targetMode: "krishi",
    keyTakeaways: [
      "Eliminates 4-5 layers of middlemen",
      "Connects peri-urban solar godowns directly to dark stores",
      "-20% consumer cost with +35% higher farmer realization",
    ],
    slideImg: demoHeroCoverImg,
  },
  {
    id: "scene-2",
    timestamp: "0:45 - 1:40 (55s)",
    durationSec: 55,
    title: "2. AgroPulse Krishi: Multimodal Soil Scan & Voice Advisory",
    persona: "AgroPulse Krishi (Farmer)",
    focusTag: "Zero-Cost Organic Remediation & Voice AI",
    narrationVoiceover:
      "Inside AgroPulse Krishi, we empower smallholders with vernacular, voice-first, high-precision intelligence. When critical threats appear, like leaf spot post-monsoon, our multimodal AI doesn't just detect it—it neutralizes it. We prescribe zero-cost, regenerative remedies—like fermented buttermilk and neem—instantly eliminating synthetic fungicide dependence. This is pure economic liberation, saving Rs.2,400 per acre while certifying fields as organic. This is precision farming, spoken in the farmer’s native language.",
    uiActionPrompt: "Demonstrating the AI Soil & Leaf Scanner with zero-cost remediation and Gemini TTS audio readout.",
    targetMode: "krishi",
    keyTakeaways: [
      "Vernacular dialect voice queries & audio readouts",
      "Zero-cost organic protocols (Jeevamrutham, Buttermilk, Neemastra)",
      "Reduces chemical expenditure to ₹0 while earning certified organic status",
    ],
    slideImg: demoSlide2Img,
  },
  {
    id: "scene-3",
    timestamp: "1:40 - 2:30 (50s)",
    durationSec: 50,
    title: "3. Smart Godowns & investmentShield Satellite Payouts",
    persona: "AgroPulse Krishi (Farmer)",
    focusTag: "70-80% Liquidity Advances & Parametric Weather Shield",
    narrationVoiceover:
      "Distress selling is officially obsolete. We have decentralized the cold chain. Farmers store harvest at peak quality in solar-powered godowns, instantly securing electronic warehouse receipts—and with them, an immediate 80 pct liquidity advance via IMPS. And our protection? Unmatched. investmentShield constantly monitors ISRO satellite telemetry; the moment unseasonal rainfall or drought thresholds are breached, calamity insurance payouts trigger automatically—instantly. No claims. No paperwork. Total financial resilience.",
    uiActionPrompt: "Simulating an automated satellite calamity payout trigger and generating an electronic warehouse receipt with a 78% liquidity advance.",
    targetMode: "krishi",
    keyTakeaways: [
      "Instant 70–80% liquidity advance at 0% collateral",
      "Solar cold chain locks freshness at 4°C–12°C",
      "Automated satellite weather calamity insurance with zero paperwork",
    ],
    slideImg: demoSlide3Img,
  },
  {
    id: "scene-4",
    timestamp: "2:30 - 3:20 (50s)",
    durationSec: 50,
    title: "4. AgroPulse Express & 1-Year Harvest Pass Importer",
    persona: "AgroPulse Express (Consumer)",
    focusTag: "15-Min Delivery SLA & Demand-First Harvest Pass",
    narrationVoiceover:
      "Welcome to AgroPulse Express: the uncompromising standard in quick-commerce. We deliver harvest-fresh produce in under 15 minutes, with total, unassailable traceability. Scan any QR passport to verify the farmer, harvest timestamp, and soil health report. The revolution, however, is our 1-Year Harvest Pass. Our AI analyzes your consumption habits and secures your annual staples at wholesale, farm-direct rates. We protect you from inflation, saving you over Rs.14,200 annually, while guaranteeing farmers a market for their entire yield.",
    uiActionPrompt: "Walking through 15-minute checkout, traceability passport modal, and importing quick-commerce order history in HarvestPassImporter.",
    targetMode: "express",
    keyTakeaways: [
      "14-minute guaranteed delivery from peri-urban dark stores",
      "Complete blockchain traceability passport for every vegetable",
      "Harvest Pass importer transforms historical consumption into 1-year advance contracts",
    ],
    slideImg: demoSlide4Img,
  },
  {
    id: "scene-5",
    timestamp: "3:20 - 4:00 (40s)",
    durationSec: 40,
    title: "5. Command Center Supply Analytics & Ecosystem Impact",
    persona: "AgroPulse Command Center (Admin)",
    focusTag: "Supply Analytics & Forward Production Engine",
    narrationVoiceover:
      "Finally, the AgroPulse Command Center is the cerebral cortex of this entire ecosystem. Urban Harvest Pass demand flows directly into our predictive analytics engine, dictating guaranteed, pre-planting sowing quotas. We have eradicated crop gluts and waste before seeds ever hit the soil. Backed by 50-year climate reanalysis and reinforced by ground partnerships with PRADAN, BAIF, and Digital Green, we have architected a system of permanent prosperity. Fair farmer earnings, affordable urban food, zero waste—the complete systemic solution.",
    uiActionPrompt: "Reviewing the Supply Analytics ledger showing demand quotas allocated to farmer cooperatives and the AI Executive Risk Audit.",
    targetMode: "admin",
    keyTakeaways: [
      "Forward demand fed directly to rural farmer sowing schedules",
      "Working capital buffer & 50-year ERA5 historical weather reanalysis",
      "NGO field verification partnerships ensuring regenerative standards",
    ],
    slideImg: demoHeroCoverImg,
  },
];
