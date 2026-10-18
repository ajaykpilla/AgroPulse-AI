import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import { GoogleGenAI, Type } from "@google/genai";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = 3000;

function getGenAI() {
  return new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

const PERSONA_SYSTEM_INSTRUCTIONS: Record<string, string> = {
  krishi: `You are AgroPulse AI operating in AgroPulse Krishi (Farmer Mode).
Your role:
- Deliver voice-friendly, warm, simple, vernacular-accessible agricultural guidance (support English, Hindi, Telugu, and Marathi phrases naturally when requested).
- Analyze soil and leaf health inputs and provide zero-cost organic remediation steps (such as Jeevamrutham, Panchagavya, Neem ark / Neemastra, buttermilk spray, vermicompost, mulching, and trap crops).
- Explain automated investmentShield parametric micro-insurance payouts triggered by satellite weather APIs (IMD gridded data & ISRO EOS-04 Soil Moisture Index / NDVI anomalies, >35mm/hr rainfall excess or >14-day dry spell triggers with instant direct bank transfers).
- Track crop deposits in decentralized FPC smart godowns and explain 70-80% instant liquidity advances at 0% collateral so farmers never have to distress-sell during harvest gluts.
- Interpret aggregated 1-Year Harvest Pass urban consumer demand signals: show farmers exact advance guaranteed purchase quotas, locked forward floor prices, and recommended acreage to sow so they never suffer harvest glut losses.
Keep responses clear, structured, actionable, and empathetic to smallholder farmers.`,

  admin: `You are AgroPulse AI operating in AgroPulse Command Center (Platform Admin Mode).
Your role:
- Monitor 50-year historical weather reanalysis engines (ERA5 / IMD 0.25-degree grid) and automated parametric calamity trigger thresholds across agricultural clusters.
- Manage working capital allocation for Farmer Producer Company (FPC) smart godown liquidity advances (70-80% advance rate against IoT-verified cold chain warehouse receipts, tracking utilization and default risk).
- Coordinate field activities, regenerative organic audits, and farmer onboarding with NGO ground partners (PRADAN, BAIF Development Research Foundation, Digital Green).
- Oversee the Demand-First Sowing Schedule & Forward Production Engine: balance urban Harvest Pass subscription commitments against FPC farmer land parcels, calculating fulfillment confidence and buffer reserves.
Provide data-driven, analytical, precise operational insights with concrete numbers, risk thresholds, and capital efficiency metrics.`,

  express: `You are AgroPulse AI operating in AgroPulse Express (Urban Consumer Mode).
Your role:
- Provide real-time updates on 15-minute fresh produce delivery SLAs from dark stores connected directly to peri-urban FPC smart godowns.
- Showcase complete farm-to-doorstep traceability (individual farmer profile, FPC cluster source, soil mineral verification, zero-pesticide biological remediation log, and exact harvest-to-doorstep hours).
- Power the 1-Year Harvest Pass Importer: analyze past quick-commerce order history (Blinkit, Zepto, Instamart, Swiggy) to project annual household grocery staples and lock 1-year farm-direct wholesale pricing.
- Highlight economic value: -20% lower consumer cost compared to traditional retail chains and +35% higher net farmer earnings by eliminating 4-5 layers of mandi middlemen.
Keep responses crisp, transparent, culinary-friendly, and focused on nutrition, freshness, and fair-trade impact.`,
};

async function startServer() {
  const app = express();
  app.use(express.json({ limit: "15mb" }));

  // 1. Multi-Persona Co-Pilot Chat & Voice Advisory Endpoint
  app.post("/api/ai/copilot", async (req, res) => {
    try {
      const { mode = "krishi", message, language = "English", contextData } = req.body;
      if (!message) {
        res.status(400).json({ error: "Message is required." });
        return;
      }

      const ai = getGenAI();
      const baseInstruction = PERSONA_SYSTEM_INSTRUCTIONS[mode] || PERSONA_SYSTEM_INSTRUCTIONS.krishi;
      const systemInstruction = `${baseInstruction}\nPreferred Language/Dialect style: ${language}.\nCurrent Ecosystem Snapshot: ${JSON.stringify(contextData || {})}`;

      const response = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: message,
        config: {
          systemInstruction,
          temperature: 0.7,
        },
      });

      res.json({
        reply: response.text || "Unable to generate response at this time.",
        mode,
        timestamp: new Date().toISOString(),
      });
    } catch (error: any) {
      console.error("Error in /api/ai/copilot:", error);
      res.status(500).json({
        error: error?.message || "Failed to process AgroPulse AI request.",
      });
    }
  });

  // 2. Multimodal Soil & Leaf Health Scan Endpoint
  app.post("/api/ai/leaf-scan", async (req, res) => {
    try {
      const { imageBase64, mimeType = "image/jpeg", cropName = "Tomato", language = "English", notes = "" } = req.body;
      const ai = getGenAI();

      const parts: any[] = [];
      if (imageBase64) {
        const cleanBase64 = imageBase64.replace(/^data:image\/\w+;base64,/, "");
        parts.push({
          inlineData: {
            mimeType,
            data: cleanBase64,
          },
        });
      }

      parts.push({
        text: `Analyze this ${cropName} plant leaf / soil sample for agricultural diagnostics in ${language}. Additional farmer field notes: "${notes}".
Provide a structured JSON diagnosis including:
- conditionName: Specific condition or nutrient state identified
- severity: "Low", "Moderate", or "High"
- confidencePercent: number between 80 and 99
- symptomsObserved: array of 2-3 clear visual indicators
- zeroCostRemediation: array of 3 step-by-step zero-cost organic home/farm remedies (e.g., Neemastra, Jeevamrutham, sour buttermilk + copper vessel spray, wood ash, Panchagavya) with exact preparation ratios and application schedule
- soilHealthImpact: 1 sentence explaining how this organic protocol improves soil microbiome and qualifies the harvest for AgroPulse Express "AI Soil Verified" premium pricing (+35% farmer realization).
- vernacularSummary: A warm 2-sentence summary suitable for reading aloud to the farmer in ${language}.`,
      });

      const response = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: { parts },
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              conditionName: { type: Type.STRING },
              severity: { type: Type.STRING },
              confidencePercent: { type: Type.INTEGER },
              symptomsObserved: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
              zeroCostRemediation: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    title: { type: Type.STRING },
                    preparation: { type: Type.STRING },
                    dosageAndSchedule: { type: Type.STRING },
                    estimatedSavingsInr: { type: Type.INTEGER },
                  },
                  required: ["title", "preparation", "dosageAndSchedule", "estimatedSavingsInr"],
                },
              },
              soilHealthImpact: { type: Type.STRING },
              vernacularSummary: { type: Type.STRING },
            },
            required: [
              "conditionName",
              "severity",
              "confidencePercent",
              "symptomsObserved",
              "zeroCostRemediation",
              "soilHealthImpact",
              "vernacularSummary",
            ],
          },
        },
      });

      const parsed = JSON.parse(response.text?.trim() || "{}");
      res.json(parsed);
    } catch (error: any) {
      console.error("Error in /api/ai/leaf-scan:", error);
      res.status(500).json({
        error: error?.message || "Failed to analyze leaf and soil scan.",
      });
    }
  });

  // 3. AI Harvest Pass & Demand Normalization Engine
  app.post("/api/ai/harvest-pass-analyze", async (req, res) => {
    try {
      const { fileName, fileContentSnippet, householdSize = 4, cityZone = "Hyderabad" } = req.body;
      const ai = getGenAI();

      const prompt = `You are the AgroPulse AI Demand-First Normalization Engine.
An urban consumer uploaded quick-commerce order logs (File name: "${fileName || "quick_commerce_export.csv"}", snippet: "${fileContentSnippet || "Monthly staple orders of basmati rice, groundnut oil, toor dal, onions, tomatoes"}").
Household size: ${householdSize} people in ${cityZone}.
Generate a comprehensive, realistic 1-year projected pantry basket and map each item to an appropriate Telangana / Andhra FPC farmer cluster.

Return a JSON object with:
- summaryNote: Brief 2-sentence rationale of how recurrent order cadences were normalized into advance annual crop contracts.
- projectedItems: array of 4-5 items with:
    - item: Name of produce/staple
    - category: One of "Staples & Grains", "Cold-Pressed Oils", "Pulses & Dal", "Seasonal Produce", "Spices & Condiments"
    - annualQtyKg: number (e.g. 60, 18, 24, 180)
    - monthlyAvgKg: number (e.g. 5, 1.5, 2, 15)
    - annualQtyLabel: string (e.g. "60 kg", "18 L", "180 kg")
    - monthlyAvgLabel: string (e.g. "5 kg", "1.5 L", "15 kg")
    - farmSource: e.g. "Telangana FPO Cluster A", "Rayalaseema Farmer Collective", "Mahbubnagar Producer Group", "Kandi Eco-Farm Network"
    - lockedWholesalePriceInrKg: number (e.g. 95, 240, 145, 34)
    - farmerNetRealizationBoostPercent: number (between 34 and 45)
    - sowingLeadWeeks: number (weeks needed for farmer to sow and harvest, e.g. 18, 14, 16, 6)
    - recommendedAcreage: number (e.g. 0.12, 0.08, 0.10, 0.15)
- totalAnnualBudgetInr: total price for the year
- totalAnnualSavingsInr: ~20% consumer savings vs quick-commerce spot prices`;

      const response = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              summaryNote: { type: Type.STRING },
              projectedItems: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    item: { type: Type.STRING },
                    category: { type: Type.STRING },
                    annualQtyKg: { type: Type.NUMBER },
                    monthlyAvgKg: { type: Type.NUMBER },
                    annualQtyLabel: { type: Type.STRING },
                    monthlyAvgLabel: { type: Type.STRING },
                    farmSource: { type: Type.STRING },
                    lockedWholesalePriceInrKg: { type: Type.NUMBER },
                    farmerNetRealizationBoostPercent: { type: Type.NUMBER },
                    sowingLeadWeeks: { type: Type.NUMBER },
                    recommendedAcreage: { type: Type.NUMBER },
                  },
                  required: [
                    "item",
                    "category",
                    "annualQtyKg",
                    "monthlyAvgKg",
                    "annualQtyLabel",
                    "monthlyAvgLabel",
                    "farmSource",
                    "lockedWholesalePriceInrKg",
                    "farmerNetRealizationBoostPercent",
                    "sowingLeadWeeks",
                    "recommendedAcreage",
                  ],
                },
              },
              totalAnnualBudgetInr: { type: Type.NUMBER },
              totalAnnualSavingsInr: { type: Type.NUMBER },
            },
            required: ["summaryNote", "projectedItems", "totalAnnualBudgetInr", "totalAnnualSavingsInr"],
          },
        },
      });

      const parsed = JSON.parse(response.text?.trim() || "{}");
      res.json(parsed);
    } catch (error: any) {
      console.error("Error in /api/ai/harvest-pass-analyze:", error);
      res.status(500).json({
        error: error?.message || "Failed to normalize Harvest Pass order history.",
      });
    }
  });

  // 4. Gemini Text-to-Speech (TTS) for Vernacular Voice Advisory
  app.post("/api/ai/tts", async (req, res) => {
    try {
      const { text } = req.body;
      if (!text) {
        res.status(400).json({ error: "Text is required for speech synthesis." });
        return;
      }

      const ai = getGenAI();
      const response = await ai.models.generateContent({
        model: "gemini-3.8-flash-lite-tts",
        contents: [
          {
            role: "user",
            parts: [
              {
                text: text.slice(0, 700),
              },
            ],
          },
        ],
        config: {
          responseModalities: ["AUDIO"],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: "Kore" },
            },
          },
        },
      });

      const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      if (!base64Audio) {
        res.status(500).json({ error: "No audio returned from TTS model." });
        return;
      }

      res.json({
        audioDataUrl: `data:audio/wav;base64,${base64Audio}`,
      });
    } catch (error: any) {
      console.error("Error in /api/ai/tts:", error);
      res.status(500).json({
        error: error?.message || "Speech synthesis failed.",
      });
    }
  });

  // 5. Consolidated 4-Minute Demo Video Download Endpoint
  app.get("/api/download-demo-video", (req, res) => {
    const videoPath = path.join(__dirname, "public", "AgroPulse_Consolidated_4Min_Demo_Walkthrough.mp4");
    if (fs.existsSync(videoPath)) {
      res.setHeader(
        "Content-Disposition",
        'attachment; filename="AgroPulse_Consolidated_4Min_Demo_Walkthrough.mp4"'
      );
      res.setHeader("Content-Type", "video/mp4");
      return res.sendFile(videoPath);
    } else {
      res.status(404).json({
        error: "Consolidated 4-minute video rendering is in progress. Please retry in a few moments.",
      });
    }
  });

  // Static serving for public assets
  app.use(express.static(path.join(__dirname, "public")));

  // Vite middleware for development or static serving for production
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, "dist");
    app.use(express.static(distPath));
    app.get("*all", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`AgroPulse Ecosystem Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
