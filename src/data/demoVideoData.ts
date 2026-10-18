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
      "Welcome to AgroPulse — the unified closed-loop ecosystem connecting rural smallholder farmers with urban quick-commerce consumers. Today, Indian farmers lose up to 40% of their produce to supply chain intermediaries, while urban consumers pay hefty markups for produce harvested days ago. AgroPulse completely re-engineers this with three coordinated personas: Krishi Farmer Advisory, the Command Center Operations Engine, and Express 15-minute Farm-to-Doorstep Delivery with our signature 1-Year Harvest Pass.",
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
      "Here in AgroPulse Krishi Mode, smallholders like Narsimha Reddy access vernacular, voice-first intelligence in Telugu, Hindi, or Marathi. When a farmer notices leaf spotting after heavy rain, they snap a leaf photo. AgroPulse's multimodal AI instantly identifies early fungal leaf spot and prescribes a zero-cost organic remedy using fermented sour buttermilk and neem spray, saving ₹2,400 per acre in chemical fungicides. Simultaneously, the farmer can listen aloud to the vernacular advisory powered by Gemini Text-to-Speech.",
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
      "Farmers no longer need to distress-sell during harvest gluts. By depositing their produce into decentralized solar cold godowns, farmers receive an electronic warehouse receipt and an instant 70 to 80 percent cash advance credited to their bank via IMPS. Even better, our investmentShield parametric micro-insurance continuously monitors ISRO satellite radar and IMD rainfall APIs. When unseasonal rainfall exceeds 35 mm/hour or dry spells cross 14 days, payouts trigger automatically without a single paper claim form.",
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
      "Now, let's explore AgroPulse Express for urban consumers, where fresh produce is delivered in under 15 minutes with complete farm-to-doorstep traceability. By scanning the QR traceability passport, customers instantly view the origin farmer profile, exact harvest timestamp, and NABL lab-verified soil mineral report. Even more transformative is our 1-Year Harvest Pass importer: consumers upload past quick-commerce order history, and AgroPulse AI projects annual staple pantry needs, locking wholesale farm-direct prices for 12 months with complete inflation protection and saving over fourteen thousand two hundred rupees a year.",
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
      "Finally, the AgroPulse Command Center unifies the entire closed-loop ecosystem. Urban consumer demand from Harvest Passes feeds directly into our forward supply analytics engine, granting rural farmers guaranteed pre-planting sowing quotas and eliminating crop gluts. Combined with 50-year ERA5 weather reanalysis and ground NGO partnerships with PRADAN, BAIF, and Digital Green, AgroPulse delivers 35% higher net earnings for farmers and 20% lower costs for urban consumers in one sustainable platform.",
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
