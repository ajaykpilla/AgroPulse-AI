/**
 * AgroPulse Consolidated 4-Minute Demo Video Generator
 * Produces an exact 240.00-second (4:00 min) 1280x720 MP4 video (H.264 + AAC)
 * 
 * Features:
 * 1. Consolidates the exact voiceover narration from the chapter-wise demo snippets
 *    generated via Gemini Text-to-Speech (with high-grade audio alignment & ambient pad).
 * 2. Renders the actual AgroPulse application UI (top header, 3 tabs, farmer diagnostics,
 *    smart godowns, parametric insurance, 15-min express store, traceability passport,
 *    harvest pass importer, and command center supply analytics).
 * 3. Smooth camera scrolling down through each persona's options and features.
 * 4. Floating HUD with synchronized subtitles and clear Farmer & Customer value creation metrics.
 */

import { execSync } from "child_process";
import fs from "fs";
import path from "path";

const OUTPUT_DIR = "./public";
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

const FINAL_VIDEO_PATH = path.join(OUTPUT_DIR, "AgroPulse_Consolidated_4Min_Demo_Walkthrough.mp4");
const FONT_BOLD = "/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf";
const FONT_REG = "/usr/share/fonts/truetype/liberation/LiberationSans-Regular.ttf";

// Helper to safely load base64 image
function getBase64Img(relPath) {
  try {
    if (fs.existsSync(relPath)) {
      const buf = fs.readFileSync(relPath);
      return `data:image/jpeg;base64,${buf.toString("base64")}`;
    }
  } catch (err) {
    console.warn("Could not read image:", relPath, err.message);
  }
  return "";
}

const imgLeaf = getBase64Img("src/assets/images/sample_tomato_leaf_scan_1791732018407.jpg");
const imgTomatoes = getBase64Img("src/assets/images/product_roma_tomatoes_1791731971325.jpg");
const imgSpinach = getBase64Img("src/assets/images/product_baby_spinach_1791731984724.jpg");
const imgMangoes = getBase64Img("src/assets/images/product_alphonso_mangoes_1791731995390.jpg");
const imgOnions = getBase64Img("src/assets/images/product_red_onions_1791732007720.jpg");
const imgGodown = getBase64Img("src/assets/images/demo_slide_scene3_godown_1792313427943.jpg");
const imgCover = getBase64Img("src/assets/images/demo_video_hero_cover_1792312951901.jpg");

const SCENES = [
  {
    idx: 1,
    title: "1. The Agritech Broken Loop & AgroPulse Vision",
    personaBadge: "AGROPULSE ECOSYSTEM OVERVIEW",
    duration: 45, // 0:00 - 0:45
    timestampRange: "0:00 - 0:45",
    activeTab: "overview",
    spokenVoiceover:
      "Welcome to AgroPulse, the unified closed-loop ecosystem connecting rural smallholder farmers with urban quick-commerce consumers. Today, Indian farmers lose up to forty percent of their produce to supply chain intermediaries, while urban consumers pay hefty markups for produce harvested days ago. AgroPulse completely re-engineers this with three coordinated personas: Krishi Farmer Advisory, the Command Center Operations Engine, and Express fifteen minute Farm to Doorstep Delivery with our signature one-year Harvest Pass. We deliver minus twenty percent lower consumer cost and plus thirty-five percent higher farmer net earnings.",
    subLine1: "Welcome to AgroPulse: the unified ecosystem connecting rural smallholders with urban consumers.",
    subLine2: "Eliminates middlemen: delivering minus 20 pct lower consumer cost and plus 35 pct higher net realization.",
    valueSummary: "Farmer: plus 35 pct Net Income | Consumer: minus 20 pct Cost | 15-Min Solar Freshness",
    freq: 330,
    renderSvg: () => `
<svg width="1280" height="2000" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bgGrad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#021a12"/>
      <stop offset="40%" stop-color="#062d22"/>
      <stop offset="100%" stop-color="#090d16"/>
    </linearGradient>
    <linearGradient id="cardGrad" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#064e3b" stop-opacity="0.85"/>
      <stop offset="100%" stop-color="#022c22" stop-opacity="0.95"/>
    </linearGradient>
  </defs>

  <!-- Full Background -->
  <rect width="100%" height="100%" fill="url(#bgGrad)"/>

  <!-- Top App Navigation Bar -->
  <rect x="0" y="0" width="1280" height="80" fill="#02140e" />
  <line x1="0" y1="80" x2="1280" y2="80" stroke="#059669" stroke-width="2"/>

  <!-- Brand Wordmark -->
  <circle cx="60" cy="40" r="22" fill="#059669"/>
  <path d="M50 48 Q60 26 70 34 Q62 48 50 48 Z" fill="#a7f3d0"/>
  <text x="95" y="44" fill="#ffffff" font-size="26" font-weight="bold" font-family="Liberation Sans">AgroPulse</text>
  <text x="95" y="62" fill="#34d399" font-size="12" font-family="Liberation Sans">Closed-Loop Agritech &amp; Quick-Commerce Ecosystem</text>

  <!-- Top Action Badges -->
  <rect x="680" y="24" width="160" height="34" rx="8" fill="#10b981"/>
  <text x="700" y="46" fill="#022c22" font-size="13" font-weight="bold" font-family="Liberation Sans">▶ 4-Min Demo Video</text>

  <rect x="855" y="24" width="170" height="34" rx="8" fill="#065f46" stroke="#34d399" stroke-width="1"/>
  <text x="875" y="46" fill="#ffffff" font-size="13" font-weight="bold" font-family="Liberation Sans">⬇ Download Video</text>

  <rect x="1040" y="24" width="110" height="34" rx="8" fill="#1e293b"/>
  <text x="1060" y="46" fill="#cbd5e1" font-size="13" font-family="Liberation Sans">📄 Script Deck</text>

  <!-- 3-Tab Version Switcher Bar (Single Frame) -->
  <g transform="translate(40, 100)">
    <rect width="1200" height="74" rx="14" fill="#091410" stroke="#10b981" stroke-width="2"/>
    
    <!-- Tab 1: Krishi -->
    <rect x="8" y="8" width="386" height="58" rx="10" fill="#064e3b" stroke="#34d399" stroke-width="2"/>
    <text x="35" y="34" fill="#ffffff" font-size="16" font-weight="bold" font-family="Liberation Sans">🌱 AgroPulse Krishi</text>
    <text x="35" y="52" fill="#a7f3d0" font-size="12" font-family="Liberation Sans">Farmer: Voice AI • Organic Remediation • 78% Liquidity</text>

    <!-- Tab 2: Command Center -->
    <rect x="406" y="8" width="386" height="58" rx="10" fill="#0f1f1a"/>
    <text x="435" y="34" fill="#94a3b8" font-size="16" font-weight="bold" font-family="Liberation Sans">🏛️ AgroPulse Command Center</text>
    <text x="435" y="52" fill="#64748b" font-size="12" font-family="Liberation Sans">Platform Admin: 50-Yr Weather Engine • Working Capital</text>

    <!-- Tab 3: Express -->
    <rect x="804" y="8" width="386" height="58" rx="10" fill="#0f1f1a"/>
    <text x="835" y="34" fill="#94a3b8" font-size="16" font-weight="bold" font-family="Liberation Sans">⚡ 15-Mins Consumer Express</text>
    <text x="835" y="52" fill="#64748b" font-size="12" font-family="Liberation Sans">Urban Consumer: 14-Min SLA • 1-Year Harvest Pass</text>
  </g>

  <!-- Single-Version Active Notification Banner -->
  <g transform="translate(40, 190)">
    <rect width="1200" height="38" rx="8" fill="#064e3b" fill-opacity="0.5" stroke="#059669" stroke-width="1"/>
    <text x="24" y="24" fill="#6ee7b7" font-size="13" font-family="Liberation Sans">
      🔒 Single Persona Workspace Active: Seamless switching enabled across Farmer, Command Center, and Consumer.
    </text>
  </g>

  <!-- Macro KPI Summary Cards -->
  <g transform="translate(40, 245)">
    <!-- KPI 1 -->
    <rect x="0" y="0" width="285" height="110" rx="12" fill="#062e22" stroke="#10b981" stroke-width="1.5"/>
    <text x="24" y="38" fill="#34d399" font-size="28" font-weight="bold" font-family="Liberation Sans">-20%</text>
    <text x="24" y="65" fill="#ffffff" font-size="15" font-weight="bold" font-family="Liberation Sans">Lower Consumer Cost</text>
    <text x="24" y="88" fill="#94a3b8" font-size="12" font-family="Liberation Sans">Eliminates 4-5 middleman tiers</text>

    <!-- KPI 2 -->
    <rect x="305" y="0" width="285" height="110" rx="12" fill="#062e22" stroke="#10b981" stroke-width="1.5"/>
    <text x="329" y="38" fill="#38bdf8" font-size="28" font-weight="bold" font-family="Liberation Sans">+35%</text>
    <text x="329" y="65" fill="#ffffff" font-size="15" font-weight="bold" font-family="Liberation Sans">Higher Farmer Realization</text>
    <text x="329" y="88" fill="#94a3b8" font-size="12" font-family="Liberation Sans">Direct procurement &amp; cold receipts</text>

    <!-- KPI 3 -->
    <rect x="610" y="0" width="285" height="110" rx="12" fill="#062e22" stroke="#10b981" stroke-width="1.5"/>
    <text x="634" y="38" fill="#f59e0b" font-size="28" font-weight="bold" font-family="Liberation Sans">14 Mins</text>
    <text x="634" y="65" fill="#ffffff" font-size="15" font-weight="bold" font-family="Liberation Sans">Guaranteed SLA Delivery</text>
    <text x="634" y="88" fill="#94a3b8" font-size="12" font-family="Liberation Sans">Hyperlocal dark store network</text>

    <!-- KPI 4 -->
    <rect x="915" y="0" width="285" height="110" rx="12" fill="#062e22" stroke="#10b981" stroke-width="1.5"/>
    <text x="939" y="38" fill="#a7f3d0" font-size="28" font-weight="bold" font-family="Liberation Sans">12 Godowns</text>
    <text x="939" y="65" fill="#ffffff" font-size="15" font-weight="bold" font-family="Liberation Sans">Solar Cold Storage</text>
    <text x="939" y="88" fill="#94a3b8" font-size="12" font-family="Liberation Sans">Decentralized 4°C-12°C buffer</text>
  </g>

  <!-- Closed Loop Architecture Diagram -->
  <g transform="translate(40, 380)">
    <rect width="1200" height="420" rx="16" fill="#071b15" stroke="#1e3a30" stroke-width="2"/>
    <text x="36" y="44" fill="#34d399" font-size="20" font-weight="bold" font-family="Liberation Sans">AgroPulse Closed-Loop Agritech &amp; Quick-Commerce Architecture</text>
    <text x="36" y="70" fill="#94a3b8" font-size="13" font-family="Liberation Sans">Direct end-to-end pipeline connecting rural harvest to urban consumers in under 6 hours</text>

    <!-- Diagram Steps -->
    <!-- Step 1 -->
    <rect x="36" y="105" width="200" height="260" rx="12" fill="#062e22" stroke="#059669" stroke-width="1.5"/>
    <text x="56" y="140" fill="#6ee7b7" font-size="14" font-weight="bold" font-family="Liberation Sans">1. RURAL FARMER</text>
    <text x="56" y="165" fill="#ffffff" font-size="13" font-family="Liberation Sans">• Voice AI in Telugu/Hindi</text>
    <text x="56" y="190" fill="#ffffff" font-size="13" font-family="Liberation Sans">• Zero-cost organic recipe</text>
    <text x="56" y="215" fill="#ffffff" font-size="13" font-family="Liberation Sans">• Multimodal leaf scan</text>
    <text x="56" y="250" fill="#f59e0b" font-size="12" font-weight="bold" font-family="Liberation Sans">Saves ₹2,400/acre</text>
    <rect x="56" y="280" width="160" height="60" rx="8" fill="#02140e"/>
    <text x="68" y="315" fill="#a7f3d0" font-size="12" font-family="Liberation Sans">SBI Bank Linked</text>

    <!-- Arrow 1 -->
    <path d="M 245 235 L 270 235" stroke="#34d399" stroke-width="3" marker-end="url(#arrow)"/>

    <!-- Step 2 -->
    <rect x="280" y="105" width="200" height="260" rx="12" fill="#062e22" stroke="#059669" stroke-width="1.5"/>
    <text x="300" y="140" fill="#6ee7b7" font-size="14" font-weight="bold" font-family="Liberation Sans">2. SOLAR GODOWN</text>
    <text x="300" y="165" fill="#ffffff" font-size="13" font-family="Liberation Sans">• Decentralized 4°C-12°C</text>
    <text x="300" y="190" fill="#ffffff" font-size="13" font-family="Liberation Sans">• e-NWR receipt issued</text>
    <text x="300" y="215" fill="#ffffff" font-size="13" font-family="Liberation Sans">• 78% Liquidity cash</text>
    <text x="300" y="250" fill="#38bdf8" font-size="12" font-weight="bold" font-family="Liberation Sans">0% Distress selling</text>
    <rect x="300" y="280" width="160" height="60" rx="8" fill="#02140e"/>
    <text x="312" y="315" fill="#38bdf8" font-size="12" font-family="Liberation Sans">₹93,600 IMPS advance</text>

    <!-- Arrow 2 -->
    <path d="M 490 235 L 515 235" stroke="#34d399" stroke-width="3"/>

    <!-- Step 3 -->
    <rect x="525" y="105" width="200" height="260" rx="12" fill="#062e22" stroke="#059669" stroke-width="1.5"/>
    <text x="545" y="140" fill="#6ee7b7" font-size="14" font-weight="bold" font-family="Liberation Sans">3. WEATHER SHIELD</text>
    <text x="545" y="165" fill="#ffffff" font-size="13" font-family="Liberation Sans">• ISRO Satellite radar</text>
    <text x="545" y="190" fill="#ffffff" font-size="13" font-family="Liberation Sans">• IMD rainfall telemetry</text>
    <text x="545" y="215" fill="#ffffff" font-size="13" font-family="Liberation Sans">• >35 mm/hr triggers</text>
    <text x="545" y="250" fill="#ec4899" font-size="12" font-weight="bold" font-family="Liberation Sans">Zero paper claim</text>
    <rect x="545" y="280" width="160" height="60" rx="8" fill="#02140e"/>
    <text x="557" y="315" fill="#f472b6" font-size="12" font-family="Liberation Sans">₹18,500 auto-payout</text>

    <!-- Arrow 3 -->
    <path d="M 735 235 L 760 235" stroke="#34d399" stroke-width="3"/>

    <!-- Step 4 -->
    <rect x="770" y="105" width="200" height="260" rx="12" fill="#062e22" stroke="#059669" stroke-width="1.5"/>
    <text x="790" y="140" fill="#6ee7b7" font-size="14" font-weight="bold" font-family="Liberation Sans">4. DARK STORES</text>
    <text x="790" y="165" fill="#ffffff" font-size="13" font-family="Liberation Sans">• Peri-urban hub (1.2 km)</text>
    <text x="790" y="190" fill="#ffffff" font-size="13" font-family="Liberation Sans">• 14-min SLA delivery</text>
    <text x="790" y="215" fill="#ffffff" font-size="13" font-family="Liberation Sans">• QR Farm Traceability</text>
    <text x="790" y="250" fill="#34d399" font-size="12" font-weight="bold" font-family="Liberation Sans">-20% Consumer cost</text>
    <rect x="790" y="280" width="160" height="60" rx="8" fill="#02140e"/>
    <text x="802" y="315" fill="#34d399" font-size="12" font-family="Liberation Sans">Fresh &lt;6 hrs from soil</text>

    <!-- Arrow 4 -->
    <path d="M 980 235 L 1005 235" stroke="#34d399" stroke-width="3"/>

    <!-- Step 5 -->
    <rect x="1015" y="105" width="150" height="260" rx="12" fill="#062e22" stroke="#059669" stroke-width="1.5"/>
    <text x="1025" y="140" fill="#6ee7b7" font-size="13" font-weight="bold" font-family="Liberation Sans">5. HARVEST PASS</text>
    <text x="1025" y="165" fill="#ffffff" font-size="12" font-family="Liberation Sans">• 1-Yr staple locks</text>
    <text x="1025" y="190" fill="#ffffff" font-size="12" font-family="Liberation Sans">• Inflation shield</text>
    <text x="1025" y="215" fill="#ffffff" font-size="12" font-family="Liberation Sans">• Sowing quotas</text>
    <text x="1025" y="250" fill="#f59e0b" font-size="12" font-weight="bold" font-family="Liberation Sans">₹14,200 saved/yr</text>
    <rect x="1025" y="280" width="130" height="60" rx="8" fill="#02140e"/>
    <text x="1035" y="315" fill="#fcd34d" font-size="11" font-family="Liberation Sans">Forward Sowing</text>
  </g>

  <!-- Side-by-Side Persona Value Comparison -->
  <g transform="translate(40, 830)">
    <rect width="585" height="420" rx="14" fill="#05241b" stroke="#10b981" stroke-width="1.5"/>
    <text x="30" y="45" fill="#34d399" font-size="22" font-weight="bold" font-family="Liberation Sans">🌾 Value Delivered to Rural Farmers</text>
    
    <text x="30" y="90" fill="#ffffff" font-size="15" font-family="Liberation Sans">✔ +35% Net Income Realization vs Mandi Middlemen</text>
    <text x="30" y="125" fill="#ffffff" font-size="15" font-family="Liberation Sans">✔ ₹0 Chemical Fungicide Spend via Zero-Cost Buttermilk Spray</text>
    <text x="30" y="160" fill="#ffffff" font-size="15" font-family="Liberation Sans">✔ 70-80% Instant Liquidity Advance on Solar Godown Deposits</text>
    <text x="30" y="195" fill="#ffffff" font-size="15" font-family="Liberation Sans">✔ Automated Satellite Calamity Insurance Payouts (0 Paperwork)</text>
    <text x="30" y="230" fill="#ffffff" font-size="15" font-family="Liberation Sans">✔ Guaranteed Forward Sowing Acreage Quotas from Urban Pass</text>
    <text x="30" y="265" fill="#ffffff" font-size="15" font-family="Liberation Sans">✔ Vernacular Voice Advisory in Telugu, Hindi &amp; Marathi</text>

    <rect x="30" y="305" width="525" height="85" rx="10" fill="#02140e"/>
    <text x="50" y="340" fill="#a7f3d0" font-size="14" font-weight="bold" font-family="Liberation Sans">Empowering 1,420+ Smallholder Farming Families</text>
    <text x="50" y="365" fill="#64748b" font-size="13" font-family="Liberation Sans">Direct FPC partnerships with PRADAN, BAIF, &amp; Digital Green</text>

    <!-- Customer Value Card -->
    <rect x="615" y="0" width="585" height="420" rx="14" fill="#0a192f" stroke="#38bdf8" stroke-width="1.5"/>
    <text x="645" y="45" fill="#38bdf8" font-size="22" font-weight="bold" font-family="Liberation Sans">🛒 Value Delivered to Urban Customers</text>

    <text x="645" y="90" fill="#ffffff" font-size="15" font-family="Liberation Sans">✔ -20% Lower Cost than Blinkit / Zepto / Supermarkets</text>
    <text x="645" y="125" fill="#ffffff" font-size="15" font-family="Liberation Sans">✔ 14-Minute SLA Hyperlocal Doorstep Delivery</text>
    <text x="645" y="160" fill="#ffffff" font-size="15" font-family="Liberation Sans">✔ 100% Farm-to-Fork Traceability (Farmer, Soil &amp; Harvest Time)</text>
    <text x="645" y="195" fill="#ffffff" font-size="15" font-family="Liberation Sans">✔ Produce Harvested &lt;6 Hours Ago (Max Nutrition &amp; Taste)</text>
    <text x="645" y="230" fill="#ffffff" font-size="15" font-family="Liberation Sans">✔ 1-Year Harvest Pass Locks Wholesale Prices against Inflation</text>
    <text x="645" y="265" fill="#ffffff" font-size="15" font-family="Liberation Sans">✔ Certified Zero-Chemical Produce Verified by NABL Labs</text>

    <rect x="645" y="305" width="525" height="85" rx="10" fill="#040d1a"/>
    <text x="665" y="340" fill="#7dd3fc" font-size="14" font-weight="bold" font-family="Liberation Sans">Direct From Soil to Kitchen Counter in Under 6 Hours</text>
    <text x="665" y="365" fill="#64748b" font-size="13" font-family="Liberation Sans">Seamless quick-commerce integration with complete transparency</text>
  </g>

  <!-- Bottom Ecosystem Proof Ledger -->
  <g transform="translate(40, 1280)">
    <rect width="1200" height="340" rx="14" fill="#061c16" stroke="#059669" stroke-width="1.5"/>
    <text x="36" y="44" fill="#ffffff" font-size="20" font-weight="bold" font-family="Liberation Sans">Verified Ecosystem Impact Metrics</text>
    
    <text x="36" y="90" fill="#34d399" font-size="16" font-family="Liberation Sans">• Post-Harvest Loss Reduced: From 40% (National Avg) to under 2.8% in AgroPulse Solar Godowns</text>
    <text x="36" y="130" fill="#38bdf8" font-size="16" font-family="Liberation Sans">• Working Capital Velocity: ₹2.84 Crores deployed with 99.8% recovery via off-take contracts</text>
    <text x="36" y="170" fill="#f59e0b" font-size="16" font-family="Liberation Sans">• Chemical Expenditure: ₹0 spend on synthetic pesticides across 3,200 acres enrolled</text>
    <text x="36" y="210" fill="#ec4899" font-size="16" font-family="Liberation Sans">• Parametric Weather Shield: 42 calamity payouts executed automatically in 2026 monsoon</text>
    <text x="36" y="250" fill="#a7f3d0" font-size="16" font-family="Liberation Sans">• Customer Retention: 92.4% re-order rate with 1-Year Harvest Pass annual subscriptions</text>
  </g>
</svg>
`
  },
  {
    idx: 2,
    title: "2. AgroPulse Krishi: Multimodal Soil Scan & Voice Advisory",
    personaBadge: "AGROPULSE KRISHI (FARMER)",
    duration: 55, // 0:45 - 1:40
    timestampRange: "0:45 - 1:40",
    activeTab: "krishi",
    spokenVoiceover:
      "Here in AgroPulse Krishi Mode, smallholders like Narsimha Reddy access vernacular, voice-first intelligence. When a farmer notices leaf spotting after heavy rain, they snap a leaf photo. AgroPulse multimodal AI instantly identifies early fungal leaf spot and prescribes a zero-cost organic remedy using fermented sour buttermilk and neem spray, saving twenty-four hundred rupees per acre in chemical fungicides. Simultaneously, the farmer can listen aloud to vernacular audio advisory, reducing chemical expenditure to zero rupees while earning certified organic status.",
    subLine1: "AgroPulse Krishi Mode: Vernacular voice-first intelligence in Telugu, Hindi and Marathi for smallholders.",
    subLine2: "Multimodal AI diagnoses leaf diseases instantly, prescribing zero-cost organic recipes saving Rs.2,400 per acre.",
    valueSummary: "Farmer Value: Rs.0 Chemical Spend | Instant Voice AI | Saves Rs.2,400 per acre in Fungicides",
    freq: 392,
    renderSvg: () => `
<svg width="1280" height="2100" xmlns="http://www.w3.org/2000/svg">
  <!-- Background -->
  <rect width="100%" height="100%" fill="#03160e"/>

  <!-- Top App Navigation Bar -->
  <rect x="0" y="0" width="1280" height="80" fill="#02140e" />
  <line x1="0" y1="80" x2="1280" y2="80" stroke="#059669" stroke-width="2"/>
  <circle cx="60" cy="40" r="22" fill="#059669"/>
  <text x="95" y="44" fill="#ffffff" font-size="26" font-weight="bold" font-family="Liberation Sans">AgroPulse</text>
  <text x="95" y="62" fill="#34d399" font-size="12" font-family="Liberation Sans">Krishi Farmer Co-Pilot Workspace</text>

  <!-- 3-Tab Version Switcher Bar (Krishi Active) -->
  <g transform="translate(40, 100)">
    <rect width="1200" height="74" rx="14" fill="#091410" stroke="#10b981" stroke-width="2"/>
    
    <!-- Tab 1: Krishi ACTIVE -->
    <rect x="8" y="8" width="386" height="58" rx="10" fill="#059669" stroke="#6ee7b7" stroke-width="2.5"/>
    <text x="35" y="34" fill="#ffffff" font-size="16" font-weight="bold" font-family="Liberation Sans">🌱 AgroPulse Krishi [ACTIVE]</text>
    <text x="35" y="52" fill="#d1fae5" font-size="12" font-family="Liberation Sans">Farmer: Voice AI • Organic Remediation • 78% Liquidity</text>

    <!-- Tab 2: Command Center -->
    <rect x="406" y="8" width="386" height="58" rx="10" fill="#0f1f1a"/>
    <text x="435" y="34" fill="#64748b" font-size="16" font-family="Liberation Sans">🏛️ AgroPulse Command Center</text>
    <text x="435" y="52" fill="#475569" font-size="12" font-family="Liberation Sans">Platform Admin</text>

    <!-- Tab 3: Express -->
    <rect x="804" y="8" width="386" height="58" rx="10" fill="#0f1f1a"/>
    <text x="835" y="34" fill="#64748b" font-size="16" font-family="Liberation Sans">⚡ 15-Mins Consumer Express</text>
    <text x="835" y="52" fill="#475569" font-size="12" font-family="Liberation Sans">Urban Consumer</text>
  </g>

  <!-- Farmer Profile Header Card -->
  <g transform="translate(40, 195)">
    <rect width="1200" height="110" rx="14" fill="#062e22" stroke="#10b981" stroke-width="1.5"/>
    <circle cx="65" cy="55" r="32" fill="#059669"/>
    <text x="52" y="63" fill="#ffffff" font-size="24" font-weight="bold" font-family="Liberation Sans">NR</text>
    
    <text x="120" y="44" fill="#ffffff" font-size="22" font-weight="bold" font-family="Liberation Sans">Narsimha Reddy — Smallholder Farmer Profile</text>
    <text x="120" y="70" fill="#a7f3d0" font-size="14" font-family="Liberation Sans">Karimnagar Cluster, Telangana • 4.5 Acres Cultivated • Sonalika Wheat &amp; Roma Tomatoes</text>
    <text x="120" y="92" fill="#94a3b8" font-size="13" font-family="Liberation Sans">FPC Affiliation: Karimnagar Rythu Producer Co. • Organic Certification: In Transition (Year 2)</text>

    <!-- Dialect Selector -->
    <rect x="940" y="32" width="220" height="46" rx="8" fill="#02140e" stroke="#34d399" stroke-width="1"/>
    <text x="960" y="58" fill="#34d399" font-size="14" font-weight="bold" font-family="Liberation Sans">🗣️ Language: తెలుగు (Telugu)</text>
  </g>

  <!-- Multimodal Soil & Leaf Diagnostic Scanner Card -->
  <g transform="translate(40, 330)">
    <rect width="1200" height="560" rx="16" fill="#05241b" stroke="#059669" stroke-width="2"/>
    <text x="40" y="45" fill="#34d399" font-size="22" font-weight="bold" font-family="Liberation Sans">🔬 Multimodal AI Soil &amp; Leaf Health Diagnostic Scanner</text>
    <text x="40" y="72" fill="#94a3b8" font-size="14" font-family="Liberation Sans">Instant zero-cost disease classification powered by Gemini Vision &amp; Vernacular TTS Audio</text>

    <!-- Scanned Leaf Image Box -->
    <g transform="translate(40, 100)">
      <rect width="360" height="300" rx="12" fill="#02140e" stroke="#10b981" stroke-width="2"/>
      ${imgLeaf ? `<image href="${imgLeaf}" x="8" y="8" width="344" height="284" preserveAspectRatio="xMidYMid slice" rx="8"/>` : `<rect x="8" y="8" width="344" height="284" fill="#064e3b"/>`}
      
      <rect x="16" y="16" width="160" height="30" rx="6" fill="#dc2626" fill-opacity="0.9"/>
      <text x="26" y="36" fill="#ffffff" font-size="12" font-weight="bold" font-family="Liberation Sans">🚨 LEAF SCAN ACTIVE</text>
    </g>

    <!-- Diagnostics and Organic Remedy Prescription -->
    <g transform="translate(430, 100)">
      <!-- AI Match Badge -->
      <rect width="730" height="60" rx="10" fill="#450a0a" stroke="#ef4444" stroke-width="1.5"/>
      <text x="24" y="32" fill="#fca5a5" font-size="16" font-weight="bold" font-family="Liberation Sans">
        Pathology Detected: Early Fungal Leaf Spot (Alternaria solani) — 88% Confidence
      </text>
      <text x="24" y="50" fill="#fecaca" font-size="12" font-family="Liberation Sans">
        Causative Vector: High humidity (88% RH) post unseasonal precipitation. Chemical Fungicides NOT required!
      </text>

      <!-- Zero-Cost Organic Recipe Box -->
      <g transform="translate(0, 80)">
        <rect width="730" height="280" rx="12" fill="#021f15" stroke="#10b981" stroke-width="2"/>
        <text x="24" y="36" fill="#34d399" font-size="18" font-weight="bold" font-family="Liberation Sans">
          🌿 Prescribed Zero-Cost Organic Remediation Protocol (Subhash Palekar Natural Farming)
        </text>

        <!-- Step 1 -->
        <rect x="24" y="55" width="682" height="60" rx="8" fill="#063828"/>
        <text x="44" y="80" fill="#ffffff" font-size="14" font-weight="bold" font-family="Liberation Sans">
          Step 1: Fermented Sour Buttermilk (పుల్లటి మజ్జిగ / Khaddi Chhach) Spray
        </text>
        <text x="44" y="100" fill="#a7f3d0" font-size="12" font-family="Liberation Sans">
          Mix 5 Liters 4-day fermented sour cow buttermilk with 100L water. Lactic acid bacteria eliminate fungal mycelium.
        </text>

        <!-- Step 2 -->
        <rect x="24" y="125" width="682" height="60" rx="8" fill="#063828"/>
        <text x="44" y="150" fill="#ffffff" font-size="14" font-weight="bold" font-family="Liberation Sans">
          Step 2: Neemastra (వేప కషాయం) Botanical Repellent at Dawn
        </text>
        <text x="44" y="170" fill="#a7f3d0" font-size="12" font-family="Liberation Sans">
          Boil 5kg crushed neem leaves in cow urine slurry; spray within 24 hours to reinforce leaf cuticle resilience.
        </text>

        <!-- Economics & Savings -->
        <g transform="translate(24, 200)">
          <rect width="682" height="64" rx="8" fill="#02140e" stroke="#34d399" stroke-width="1"/>
          <text x="20" y="28" fill="#f59e0b" font-size="14" font-weight="bold" font-family="Liberation Sans">
            💰 Economic Analysis:
          </text>
          <text x="20" y="50" fill="#ffffff" font-size="13" font-family="Liberation Sans">
            Chemical Mancozeb Cost: ₹2,400/acre  →  AgroPulse Organic Protocol: ₹0  |  Net Savings: ₹10,800 total!
          </text>
        </g>
      </g>
    </g>

    <!-- Vernacular Audio Readout Bar -->
    <g transform="translate(40, 480)">
      <rect width="1120" height="58" rx="10" fill="#064e3b" stroke="#34d399" stroke-width="1.5"/>
      <circle cx="35" cy="29" r="18" fill="#10b981"/>
      <text x="26" y="36" fill="#02140e" font-size="18" font-family="Liberation Sans">🔊</text>
      <text x="70" y="34" fill="#ffffff" font-size="15" font-weight="bold" font-family="Liberation Sans">
        వాయిస్ ద్వారా వినండి: పుల్లటి మజ్జిగ ద్రావణం మరియు వేప కషాయం తయారీ విధానం (Listen Aloud in Telugu Audio)
      </text>
      <rect x="940" y="12" width="160" height="34" rx="6" fill="#10b981"/>
      <text x="965" y="34" fill="#02140e" font-size="13" font-weight="bold" font-family="Liberation Sans">▶ Audio Playing</text>
    </g>
  </g>

  <!-- Vernacular Voice Query Assistant Section -->
  <g transform="translate(40, 920)">
    <rect width="1200" height="340" rx="16" fill="#061f18" stroke="#059669" stroke-width="1.5"/>
    <text x="40" y="44" fill="#34d399" font-size="20" font-weight="bold" font-family="Liberation Sans">
      🎙️ Vernacular Voice Advisory (Voice-First Rural AI)
    </text>
    
    <!-- Voice Query Transcript -->
    <rect x="40" y="70" width="1120" height="80" rx="10" fill="#02140e" stroke="#10b981" stroke-width="1"/>
    <text x="65" y="100" fill="#f59e0b" font-size="14" font-weight="bold" font-family="Liberation Sans">
      Farmer Narsimha Reddy (Spoken Telugu): "ఈ వర్షాల తర్వాత ఆకులపై మచ్చలు వచ్చాయి, పంట పాడవుతుందా? ఏం చేయాలి?"
    </text>
    <text x="65" y="126" fill="#94a3b8" font-size="13" font-family="Liberation Sans">
      English Translation: "After these rains, leaves have brown spots. Will my crop be ruined? What should I do?"
    </text>

    <!-- AI Voice Response -->
    <rect x="40" y="170" width="1120" height="130" rx="10" fill="#062e22" stroke="#34d399" stroke-width="1.5"/>
    <text x="65" y="200" fill="#6ee7b7" font-size="14" font-weight="bold" font-family="Liberation Sans">
      AgroPulse Krishi Voice Co-Pilot (Telugu Voice Synthesized):
    </text>
    <text x="65" y="230" fill="#ffffff" font-size="14" font-family="Liberation Sans">
      "నరసింహారెడ్డి గారూ, ఆందోళన చెందవద్దు. ఇది ఎర్లీ ఫంగల్ లీఫ్ స్పాట్ మాత్రమే. ఖరీదైన పురుగుమందులు కొనవలసిన అవసరం లేదు."
    </text>
    <text x="65" y="260" fill="#a7f3d0" font-size="13" font-family="Liberation Sans">
      "మీ ఇంటి వద్ద ఉన్న 5 లీటర్ల పుల్లటి మజ్జిగను 100 లీటర్ల నీటిలో కలిపి పిచికారీ చేయండి. మీ ₹2,400 ఖర్చు ఆదా అవుతుంది."
    </text>
  </g>

  <!-- Farmer Benefits Summary -->
  <g transform="translate(40, 1290)">
    <rect width="1200" height="260" rx="14" fill="#06281e" stroke="#10b981" stroke-width="1.5"/>
    <text x="40" y="44" fill="#ffffff" font-size="20" font-weight="bold" font-family="Liberation Sans">Direct Value Created for Farmer Narsimha Reddy</text>
    
    <text x="40" y="90" fill="#34d399" font-size="16" font-family="Liberation Sans">✔ ₹10,800 Total Chemical Savings achieved across his 4.5 acres farm</text>
    <text x="40" y="130" fill="#38bdf8" font-size="16" font-family="Liberation Sans">✔ 100% Vernacular Literacy Friendly: Complete voice interface in Telugu</text>
    <text x="40" y="170" fill="#f59e0b" font-size="16" font-family="Liberation Sans">✔ Certified Residue-Free Harvest qualifies for +35% AgroPulse Organic Premium</text>
    <text x="40" y="210" fill="#a7f3d0" font-size="16" font-family="Liberation Sans">✔ Direct connection to Smart Godowns prevents distress harvest sales</text>
  </g>
</svg>
`
  },
  {
    idx: 3,
    title: "3. Smart Godowns & investmentShield Satellite Payouts",
    personaBadge: "AGROPULSE KRISHI (FARMER)",
    duration: 50, // 1:40 - 2:30
    timestampRange: "1:40 - 2:30",
    activeTab: "krishi",
    spokenVoiceover:
      "Farmers no longer need to distress-sell during harvest gluts. By depositing their produce into decentralized solar cold godowns, farmers receive an electronic warehouse receipt and an instant seventy to eighty percent cash advance credited to their bank via IMPS. Even better, our investmentShield parametric micro-insurance continuously monitors ISRO satellite radar and IMD rainfall APIs. When unseasonal rainfall exceeds thirty-five millimeters per hour or dry spells cross fourteen days, insurance payouts trigger automatically with zero paperwork.",
    subLine1: "Decentralized Solar Cold Godowns provide electronic warehouse receipts and 78 pct instant liquidity advances.",
    subLine2: "investmentShield monitors satellite radar and rainfall data, automatically triggering calamity payouts.",
    valueSummary: "Farmer Value: 78 pct Cash Advance (Rs.93,600 IMPS) | Zero Distress Sale | Auto Calamity Insurance",
    freq: 440,
    renderSvg: () => `
<svg width="1280" height="2100" xmlns="http://www.w3.org/2000/svg">
  <rect width="100%" height="100%" fill="#03160e"/>

  <!-- Top App Navigation Bar -->
  <rect x="0" y="0" width="1280" height="80" fill="#02140e" />
  <line x1="0" y1="80" x2="1280" y2="80" stroke="#059669" stroke-width="2"/>
  <circle cx="60" cy="40" r="22" fill="#059669"/>
  <text x="95" y="44" fill="#ffffff" font-size="26" font-weight="bold" font-family="Liberation Sans">AgroPulse</text>
  <text x="95" y="62" fill="#34d399" font-size="12" font-family="Liberation Sans">Smart Godown &amp; Parametric Weather Shield</text>

  <!-- 3-Tab Version Switcher Bar (Krishi Active) -->
  <g transform="translate(40, 100)">
    <rect width="1200" height="74" rx="14" fill="#091410" stroke="#10b981" stroke-width="2"/>
    <rect x="8" y="8" width="386" height="58" rx="10" fill="#059669" stroke="#6ee7b7" stroke-width="2.5"/>
    <text x="35" y="34" fill="#ffffff" font-size="16" font-weight="bold" font-family="Liberation Sans">🌱 AgroPulse Krishi [ACTIVE]</text>
    <text x="35" y="52" fill="#d1fae5" font-size="12" font-family="Liberation Sans">Farmer: Voice AI • Organic Remediation • 78% Liquidity</text>

    <rect x="406" y="8" width="386" height="58" rx="10" fill="#0f1f1a"/>
    <text x="435" y="34" fill="#64748b" font-size="16" font-family="Liberation Sans">🏛️ AgroPulse Command Center</text>
    <text x="804" y="8" width="386" height="58" rx="10" fill="#0f1f1a"/>
    <text x="835" y="34" fill="#64748b" font-size="16" font-family="Liberation Sans">⚡ 15-Mins Consumer Express</text>
  </g>

  <!-- Decentralized Smart Cold Godown Section -->
  <g transform="translate(40, 195)">
    <rect width="1200" height="540" rx="16" fill="#05241b" stroke="#059669" stroke-width="2"/>
    <text x="40" y="44" fill="#34d399" font-size="22" font-weight="bold" font-family="Liberation Sans">
      🏢 Decentralized Solar Cold Godown &amp; 78% Liquidity Advance
    </text>
    <text x="40" y="70" fill="#94a3b8" font-size="14" font-family="Liberation Sans">
      Deposit produce at peak harvest; secure e-NWR warehouse receipt and instant cash advance without distress selling.
    </text>

    <!-- Godown IoT Metrics -->
    <g transform="translate(40, 95)">
      <rect x="0" y="0" width="265" height="110" rx="12" fill="#02140e" stroke="#10b981" stroke-width="1.5"/>
      <text x="20" y="35" fill="#a7f3d0" font-size="14" font-family="Liberation Sans">Solar Godown #04</text>
      <text x="20" y="65" fill="#34d399" font-size="26" font-weight="bold" font-family="Liberation Sans">4.2°C</text>
      <text x="20" y="90" fill="#64748b" font-size="12" font-family="Liberation Sans">Optimal Cold Chain (4°C-12°C)</text>

      <rect x="285" y="0" width="265" height="110" rx="12" fill="#02140e" stroke="#10b981" stroke-width="1.5"/>
      <text x="305" y="35" fill="#a7f3d0" font-size="14" font-family="Liberation Sans">Chamber Humidity</text>
      <text x="305" y="65" fill="#38bdf8" font-size="26" font-weight="bold" font-family="Liberation Sans">88% RH</text>
      <text x="305" y="90" fill="#64748b" font-size="12" font-family="Liberation Sans">Zero-dehydration misting</text>

      <rect x="570" y="0" width="265" height="110" rx="12" fill="#02140e" stroke="#10b981" stroke-width="1.5"/>
      <text x="590" y="35" fill="#a7f3d0" font-size="14" font-family="Liberation Sans">Produce Deposited</text>
      <text x="590" y="65" fill="#f59e0b" font-size="26" font-weight="bold" font-family="Liberation Sans">120 Quintals</text>
      <text x="590" y="90" fill="#64748b" font-size="12" font-family="Liberation Sans">Sonalika Grade-A Wheat</text>

      <rect x="855" y="0" width="265" height="110" rx="12" fill="#02140e" stroke="#10b981" stroke-width="1.5"/>
      <text x="875" y="35" fill="#a7f3d0" font-size="14" font-family="Liberation Sans">Solar Rooftop Power</text>
      <text x="875" y="65" fill="#34d399" font-size="26" font-weight="bold" font-family="Liberation Sans">18.5 kW</text>
      <text x="875" y="90" fill="#64748b" font-size="12" font-family="Liberation Sans">100% Off-grid Solar microgrid</text>
    </g>

    <!-- Electronic Warehouse Receipt & 78% Cash Advance Card -->
    <g transform="translate(40, 230)">
      <rect width="1120" height="270" rx="14" fill="#031e16" stroke="#10b981" stroke-width="2"/>
      
      <!-- Left side: e-NWR Details -->
      <g transform="translate(30, 25)">
        <text x="0" y="24" fill="#34d399" font-size="18" font-weight="bold" font-family="Liberation Sans">
          📜 Electronic Negotiable Warehouse Receipt (e-NWR)
        </text>
        <text x="0" y="55" fill="#ffffff" font-size="14" font-family="Liberation Sans">Receipt ID: #NWR-KR-2026-94821</text>
        <text x="0" y="85" fill="#ffffff" font-size="14" font-family="Liberation Sans">Depositor: Narsimha Reddy (Karimnagar FPC)</text>
        <text x="0" y="115" fill="#ffffff" font-size="14" font-family="Liberation Sans">Certified Valuation: ₹1,20,000 (Based on MSP + Quality Grade)</text>
        <text x="0" y="145" fill="#a7f3d0" font-size="14" font-family="Liberation Sans">Cold Chain Lock: Secured in Lot #B-14</text>
        <text x="0" y="175" fill="#64748b" font-size="13" font-family="Liberation Sans">WDRA Certified &amp; Blockchain Timestamped</text>
      </g>

      <!-- Right side: Instant Liquidity Advance -->
      <g transform="translate(560, 25)">
        <rect width="520" height="215" rx="12" fill="#02140e" stroke="#34d399" stroke-width="1.5"/>
        <text x="24" y="32" fill="#38bdf8" font-size="18" font-weight="bold" font-family="Liberation Sans">
          ⚡ 78% Instant Liquidity Advance Disbursed
        </text>
        <text x="24" y="70" fill="#34d399" font-size="36" font-weight="bold" font-family="Liberation Sans">
          ₹93,600
        </text>
        <text x="24" y="105" fill="#ffffff" font-size="14" font-family="Liberation Sans">
          Credited to: State Bank of India (A/c ...4819) via IMPS
        </text>
        <text x="24" y="135" fill="#a7f3d0" font-size="13" font-family="Liberation Sans">
          Transfer Status: Success • Transaction Ref: IMPS-739281940
        </text>
        <text x="24" y="170" fill="#f59e0b" font-size="13" font-weight="bold" font-family="Liberation Sans">
          Distress Sale Averted: Farmer holds wheat until seasonal price rises +32%
        </text>
      </g>
    </g>
  </g>

  <!-- investmentShield Parametric Micro-Insurance Section -->
  <g transform="translate(40, 760)">
    <rect width="1200" height="520" rx="16" fill="#1e1026" stroke="#c084fc" stroke-width="2"/>
    <text x="40" y="44" fill="#e879f9" font-size="22" font-weight="bold" font-family="Liberation Sans">
      🛡️ investmentShield: Automated Satellite Parametric Micro-Insurance
    </text>
    <text x="40" y="70" fill="#e9d5ff" font-size="14" font-family="Liberation Sans">
      Continuous ISRO Radar &amp; IMD Weather Station API monitoring with zero-paperwork automated calamity payouts.
    </text>

    <!-- Radar Telemetry Cards -->
    <g transform="translate(40, 95)">
      <rect x="0" y="0" width="360" height="120" rx="12" fill="#2e1065" stroke="#a855f7" stroke-width="1.5"/>
      <text x="24" y="35" fill="#d8b4fe" font-size="14" font-family="Liberation Sans">Live Radar Telemetry</text>
      <text x="24" y="72" fill="#ec4899" font-size="30" font-weight="bold" font-family="Liberation Sans">38.4 mm/hr</text>
      <text x="24" y="100" fill="#f472b6" font-size="13" font-family="Liberation Sans">Trigger Threshold: &gt; 35.0 mm/hr [EXCEEDED]</text>

      <rect x="380" y="0" width="360" height="120" rx="12" fill="#2e1065" stroke="#a855f7" stroke-width="1.5"/>
      <text x="404" y="35" fill="#d8b4fe" font-size="14" font-family="Liberation Sans">Satellite Data Source</text>
      <text x="404" y="72" fill="#ffffff" font-size="22" font-weight="bold" font-family="Liberation Sans">ISRO Oceansat-3</text>
      <text x="404" y="100" fill="#a7f3d0" font-size="13" font-family="Liberation Sans">Grid Lat 18.438° N, Long 79.128° E</text>

      <rect x="760" y="0" width="360" height="120" rx="12" fill="#2e1065" stroke="#a855f7" stroke-width="1.5"/>
      <text x="784" y="35" fill="#d8b4fe" font-size="14" font-family="Liberation Sans">Automated Claim Status</text>
      <text x="784" y="72" fill="#34d399" font-size="24" font-weight="bold" font-family="Liberation Sans">INSTANT APPROVED</text>
      <text x="784" y="100" fill="#6ee7b7" font-size="13" font-family="Liberation Sans">Zero Paperwork Claim Dispatched</text>
    </g>

    <!-- Calamity Payout Voucher Banner -->
    <g transform="translate(40, 240)">
      <rect width="1120" height="230" rx="14" fill="#3b0764" stroke="#e879f9" stroke-width="2"/>
      <text x="35" y="40" fill="#f5d0fe" font-size="20" font-weight="bold" font-family="Liberation Sans">
        🚨 Unseasonal Cloudburst Event Detected in Karimnagar Mandals
      </text>
      <text x="35" y="75" fill="#ffffff" font-size="15" font-family="Liberation Sans">
        Automated Smart Contract Trigger: Extreme Rainfall Index breached on 18 Oct 2026.
      </text>
      
      <rect x="35" y="100" width="1050" height="100" rx="10" fill="#1e1026" stroke="#c084fc" stroke-width="1.5"/>
      <text x="60" y="135" fill="#e879f9" font-size="14" font-weight="bold" font-family="Liberation Sans">
        Direct Bank Payout Voucher:
      </text>
      <text x="60" y="172" fill="#34d399" font-size="32" font-weight="bold" font-family="Liberation Sans">
        ₹18,500 Disbursed Instantly to Farmer's Bank
      </text>
      <text x="560" y="172" fill="#cbd5e1" font-size="14" font-family="Liberation Sans">
        Zero Loss Adjuster visits • Zero Claim Forms • Credited in under 4 minutes!
      </text>
    </g>
  </g>

  <!-- Summary Card -->
  <g transform="translate(40, 1310)">
    <rect width="1200" height="240" rx="14" fill="#062219" stroke="#10b981" stroke-width="1.5"/>
    <text x="40" y="44" fill="#ffffff" font-size="20" font-weight="bold" font-family="Liberation Sans">Why This Completely Transforms Indian Agriculture</text>
    
    <text x="40" y="90" fill="#34d399" font-size="16" font-family="Liberation Sans">• Liquidity Without Debt: Farmers access 78% immediate cash flow without borrowing from exploitative money lenders</text>
    <text x="40" y="130" fill="#38bdf8" font-size="16" font-family="Liberation Sans">• Climate Risk Elimination: Parametric micro-insurance pays immediately when rain or drought strikes</text>
    <text x="40" y="170" fill="#f59e0b" font-size="16" font-family="Liberation Sans">• Zero Spoilage: Solar cold godowns preserve farm harvest freshness for up to 90 days</text>
  </g>
</svg>
`
  },
  {
    idx: 4,
    title: "4. AgroPulse Express & 1-Year Harvest Pass Importer",
    personaBadge: "AGROPULSE EXPRESS (CONSUMER)",
    duration: 50, // 2:30 - 3:20
    timestampRange: "2:30 - 3:20",
    activeTab: "express",
    spokenVoiceover:
      "Now, let's explore AgroPulse Express for urban consumers, where fresh produce is delivered in under 15 minutes with complete farm-to-doorstep traceability. By scanning the QR traceability passport, customers instantly view the origin farmer profile, exact harvest timestamp, and NABL lab-verified soil mineral report. Even more transformative is our 1-Year Harvest Pass importer: consumers upload past quick-commerce order history, and AgroPulse AI projects annual staple pantry needs, locking wholesale farm-direct prices for 12 months with complete inflation protection and saving over fourteen thousand two hundred rupees a year.",
    subLine1: "AgroPulse Express delivers fresh produce in 14 minutes with complete farm-to-doorstep traceability.",
    subLine2: "1-Year Harvest Pass Importer converts past grocery receipts into 12-month locked wholesale staple subscriptions.",
    valueSummary: "Consumer Value: 14-Min SLA | minus 20 pct Direct Price | QR Farm Passport | Saves Rs.14,200 per Year",
    freq: 523,
    renderSvg: () => `
<svg width="1280" height="2100" xmlns="http://www.w3.org/2000/svg">
  <rect width="100%" height="100%" fill="#06121f"/>

  <!-- Top App Navigation Bar -->
  <rect x="0" y="0" width="1280" height="80" fill="#040c14" />
  <line x1="0" y1="80" x2="1280" y2="80" stroke="#0284c7" stroke-width="2"/>
  <circle cx="60" cy="40" r="22" fill="#0284c7"/>
  <text x="95" y="44" fill="#ffffff" font-size="26" font-weight="bold" font-family="Liberation Sans">AgroPulse Express</text>
  <text x="95" y="62" fill="#38bdf8" font-size="12" font-family="Liberation Sans">15-Min Farm-to-Doorstep Quick Commerce</text>

  <!-- 3-Tab Version Switcher Bar (Express Active) -->
  <g transform="translate(40, 100)">
    <rect width="1200" height="74" rx="14" fill="#091410" stroke="#0284c7" stroke-width="2"/>
    <rect x="8" y="8" width="386" height="58" rx="10" fill="#0f1f1a"/>
    <text x="35" y="34" fill="#64748b" font-size="16" font-family="Liberation Sans">🌱 AgroPulse Krishi</text>

    <rect x="406" y="8" width="386" height="58" rx="10" fill="#0f1f1a"/>
    <text x="435" y="34" fill="#64748b" font-size="16" font-family="Liberation Sans">🏛️ AgroPulse Command Center</text>

    <!-- Tab 3: Express ACTIVE -->
    <rect x="804" y="8" width="386" height="58" rx="10" fill="#0284c7" stroke="#38bdf8" stroke-width="2.5"/>
    <text x="835" y="34" fill="#ffffff" font-size="16" font-weight="bold" font-family="Liberation Sans">⚡ 15-Mins Consumer Express [ACTIVE]</text>
    <text x="835" y="52" fill="#e0f2fe" font-size="12" font-family="Liberation Sans">Urban Consumer: 14-Min SLA • 1-Year Harvest Pass</text>
  </g>

  <!-- 14-Minute Guaranteed SLA Banner -->
  <g transform="translate(40, 195)">
    <rect width="1200" height="70" rx="12" fill="#0c4a6e" stroke="#38bdf8" stroke-width="1.5"/>
    <circle cx="50" cy="35" r="20" fill="#0284c7"/>
    <text x="42" y="42" fill="#ffffff" font-size="20" font-family="Liberation Sans">⚡</text>
    <text x="85" y="34" fill="#ffffff" font-size="18" font-weight="bold" font-family="Liberation Sans">
      14-Minute Guaranteed Farm Fresh Delivery SLA
    </text>
    <text x="85" y="56" fill="#7dd3fc" font-size="13" font-family="Liberation Sans">
      Dispatched from Peri-Urban Dark Store #04 (1.2 km away) • Harvested &lt;6 hours ago from Karimnagar FPC
    </text>
    <rect x="1000" y="16" width="170" height="38" rx="8" fill="#0284c7"/>
    <text x="1025" y="40" fill="#ffffff" font-size="13" font-weight="bold" font-family="Liberation Sans">Order in 11 Mins</text>
  </g>

  <!-- Fresh Produce Storefront (-20% Lower Cost) -->
  <g transform="translate(40, 285)">
    <rect width="1200" height="420" rx="16" fill="#082032" stroke="#0369a1" stroke-width="2"/>
    <text x="40" y="44" fill="#38bdf8" font-size="22" font-weight="bold" font-family="Liberation Sans">
      🥬 Farm-Direct Fresh Produce Catalog (-20% vs Quick-Commerce Markups)
    </text>
    <text x="40" y="70" fill="#94a3b8" font-size="14" font-family="Liberation Sans">
      Zero middlemen markups. Freshly harvested from certified smallholders this morning.
    </text>

    <!-- Product 1: Roma Tomatoes -->
    <g transform="translate(40, 95)">
      <rect width="260" height="295" rx="12" fill="#031626" stroke="#0ea5e9" stroke-width="1.5"/>
      ${imgTomatoes ? `<image href="${imgTomatoes}" x="12" y="12" width="236" height="150" preserveAspectRatio="xMidYMid slice" rx="8"/>` : `<rect x="12" y="12" width="236" height="150" fill="#0c4a6e"/>`}
      <text x="16" y="190" fill="#ffffff" font-size="16" font-weight="bold" font-family="Liberation Sans">Farm-Fresh Roma Tomatoes</text>
      <text x="16" y="215" fill="#34d399" font-size="20" font-weight="bold" font-family="Liberation Sans">₹28 / kg</text>
      <text x="110" y="215" fill="#64748b" font-size="14" text-decoration="line-through" font-family="Liberation Sans">₹36 / kg</text>
      <rect x="175" y="196" width="70" height="24" rx="4" fill="#065f46"/>
      <text x="185" y="213" fill="#6ee7b7" font-size="12" font-weight="bold" font-family="Liberation Sans">-22%</text>
      <text x="16" y="240" fill="#a7f3d0" font-size="12" font-family="Liberation Sans">Harvested: 5:30 AM today</text>
      <rect x="16" y="255" width="228" height="30" rx="6" fill="#0284c7"/>
      <text x="85" y="275" fill="#ffffff" font-size="13" font-weight="bold" font-family="Liberation Sans">View Passport</text>
    </g>

    <!-- Product 2: Baby Spinach -->
    <g transform="translate(325, 95)">
      <rect width="260" height="295" rx="12" fill="#031626" stroke="#0ea5e9" stroke-width="1.5"/>
      ${imgSpinach ? `<image href="${imgSpinach}" x="12" y="12" width="236" height="150" preserveAspectRatio="xMidYMid slice" rx="8"/>` : `<rect x="12" y="12" width="236" height="150" fill="#0c4a6e"/>`}
      <text x="16" y="190" fill="#ffffff" font-size="16" font-weight="bold" font-family="Liberation Sans">Hydroponic Baby Spinach</text>
      <text x="16" y="215" fill="#34d399" font-size="20" font-weight="bold" font-family="Liberation Sans">₹22 / bunch</text>
      <text x="130" y="215" fill="#64748b" font-size="14" text-decoration="line-through" font-family="Liberation Sans">₹30</text>
      <rect x="175" y="196" width="70" height="24" rx="4" fill="#065f46"/>
      <text x="185" y="213" fill="#6ee7b7" font-size="12" font-weight="bold" font-family="Liberation Sans">-26%</text>
      <text x="16" y="240" fill="#a7f3d0" font-size="12" font-family="Liberation Sans">Zero chemical residue</text>
      <rect x="16" y="255" width="228" height="30" rx="6" fill="#0284c7"/>
      <text x="85" y="275" fill="#ffffff" font-size="13" font-weight="bold" font-family="Liberation Sans">View Passport</text>
    </g>

    <!-- Product 3: Alphonso Mangoes -->
    <g transform="translate(610, 95)">
      <rect width="260" height="295" rx="12" fill="#031626" stroke="#0ea5e9" stroke-width="1.5"/>
      ${imgMangoes ? `<image href="${imgMangoes}" x="12" y="12" width="236" height="150" preserveAspectRatio="xMidYMid slice" rx="8"/>` : `<rect x="12" y="12" width="236" height="150" fill="#0c4a6e"/>`}
      <text x="16" y="190" fill="#ffffff" font-size="16" font-weight="bold" font-family="Liberation Sans">Ratnagiri Alphonso Mango</text>
      <text x="16" y="215" fill="#34d399" font-size="20" font-weight="bold" font-family="Liberation Sans">₹180 / kg</text>
      <text x="120" y="215" fill="#64748b" font-size="14" text-decoration="line-through" font-family="Liberation Sans">₹240</text>
      <rect x="175" y="196" width="70" height="24" rx="4" fill="#065f46"/>
      <text x="185" y="213" fill="#6ee7b7" font-size="12" font-weight="bold" font-family="Liberation Sans">-25%</text>
      <text x="16" y="240" fill="#a7f3d0" font-size="12" font-family="Liberation Sans">Naturally tree-ripened</text>
      <rect x="16" y="255" width="228" height="30" rx="6" fill="#0284c7"/>
      <text x="85" y="275" fill="#ffffff" font-size="13" font-weight="bold" font-family="Liberation Sans">View Passport</text>
    </g>

    <!-- Product 4: Red Onions -->
    <g transform="translate(895, 95)">
      <rect width="260" height="295" rx="12" fill="#031626" stroke="#0ea5e9" stroke-width="1.5"/>
      ${imgOnions ? `<image href="${imgOnions}" x="12" y="12" width="236" height="150" preserveAspectRatio="xMidYMid slice" rx="8"/>` : `<rect x="12" y="12" width="236" height="150" fill="#0c4a6e"/>`}
      <text x="16" y="190" fill="#ffffff" font-size="16" font-weight="bold" font-family="Liberation Sans">Nashik Pink Red Onions</text>
      <text x="16" y="215" fill="#34d399" font-size="20" font-weight="bold" font-family="Liberation Sans">₹32 / kg</text>
      <text x="110" y="215" fill="#64748b" font-size="14" text-decoration="line-through" font-family="Liberation Sans">₹40</text>
      <rect x="175" y="196" width="70" height="24" rx="4" fill="#065f46"/>
      <text x="185" y="213" fill="#6ee7b7" font-size="12" font-weight="bold" font-family="Liberation Sans">-20%</text>
      <text x="16" y="240" fill="#a7f3d0" font-size="12" font-family="Liberation Sans">Cured in solar cold air</text>
      <rect x="16" y="255" width="228" height="30" rx="6" fill="#0284c7"/>
      <text x="85" y="275" fill="#ffffff" font-size="13" font-weight="bold" font-family="Liberation Sans">View Passport</text>
    </g>
  </g>

  <!-- Farm-to-Doorstep Blockchain Traceability Passport Modal Preview -->
  <g transform="translate(40, 725)">
    <rect width="1200" height="400" rx="16" fill="#041a29" stroke="#38bdf8" stroke-width="2"/>
    <text x="40" y="44" fill="#38bdf8" font-size="22" font-weight="bold" font-family="Liberation Sans">
      🔍 Farm-to-Doorstep Traceability Passport (QR Verified)
    </text>
    
    <!-- Left Column: Farmer Origin -->
    <g transform="translate(40, 75)">
      <rect width="520" height="290" rx="12" fill="#02101a" stroke="#0ea5e9" stroke-width="1.5"/>
      <text x="24" y="35" fill="#7dd3fc" font-size="18" font-weight="bold" font-family="Liberation Sans">Origin Farmer Identity</text>
      <text x="24" y="70" fill="#ffffff" font-size="15" font-family="Liberation Sans">Farmer: Narsimha Reddy (Karimnagar FPC)</text>
      <text x="24" y="105" fill="#ffffff" font-size="15" font-family="Liberation Sans">Plot: Geotagged Acreage #KR-849 (Telangana)</text>
      <text x="24" y="140" fill="#34d399" font-size="15" font-weight="bold" font-family="Liberation Sans">Harvest Timestamp: 05:30 AM Today (&lt;6 hours ago)</text>
      <text x="24" y="175" fill="#ffffff" font-size="15" font-family="Liberation Sans">Pesticide Residue: 0.00% (Lab NABL Certified)</text>
      <text x="24" y="210" fill="#f59e0b" font-size="15" font-family="Liberation Sans">Soil Minerals: High Potassium &amp; Zinc</text>
      <text x="24" y="245" fill="#64748b" font-size="13" font-family="Liberation Sans">QR Code: Verified by AgroPulse Closed-Loop Chain</text>
    </g>

    <!-- Right Column: Journey Map -->
    <g transform="translate(600, 75)">
      <rect width="560" height="290" rx="12" fill="#02101a" stroke="#0ea5e9" stroke-width="1.5"/>
      <text x="24" y="35" fill="#7dd3fc" font-size="18" font-weight="bold" font-family="Liberation Sans">Transit Route Telemetry</text>
      
      <circle cx="45" cy="80" r="12" fill="#059669"/>
      <text x="75" y="85" fill="#ffffff" font-size="14" font-family="Liberation Sans">05:30 AM: Harvested by farmer Narsimha Reddy</text>

      <circle cx="45" cy="130" r="12" fill="#0284c7"/>
      <text x="75" y="135" fill="#ffffff" font-size="14" font-family="Liberation Sans">06:45 AM: Sorted &amp; Pre-cooled at Solar Godown #04</text>

      <circle cx="45" cy="180" r="12" fill="#0284c7"/>
      <text x="75" y="185" fill="#ffffff" font-size="14" font-family="Liberation Sans">09:15 AM: Arrived at Peri-Urban Dark Store #04</text>

      <circle cx="45" cy="230" r="12" fill="#f59e0b"/>
      <text x="75" y="235" fill="#fcd34d" font-size="14" font-weight="bold" font-family="Liberation Sans">11:00 AM: Dispatched for 14-Minute Doorstep Delivery</text>
    </g>
  </g>

  <!-- 1-Year Harvest Pass Importer Section -->
  <g transform="translate(40, 1150)">
    <rect width="1200" height="420" rx="16" fill="#0f2942" stroke="#38bdf8" stroke-width="2"/>
    <text x="40" y="44" fill="#38bdf8" font-size="22" font-weight="bold" font-family="Liberation Sans">
      🎟️ 1-Year Harvest Pass: AI Order Importer &amp; Inflation Protection
    </text>
    <text x="40" y="70" fill="#94a3b8" font-size="14" font-family="Liberation Sans">
      Upload your past Blinkit / Zepto order receipts; AI projects your family's annual staple needs and locks farm-direct wholesale pricing!
    </text>

    <!-- Upload Box -->
    <rect x="40" y="95" width="450" height="280" rx="12" fill="#041424" stroke="#0ea5e9" stroke-width="1.5"/>
    <text x="65" y="135" fill="#7dd3fc" font-size="16" font-weight="bold" font-family="Liberation Sans">Quick-Commerce History Imported</text>
    <text x="65" y="170" fill="#ffffff" font-size="14" font-family="Liberation Sans">Source: Blinkit &amp; Zepto Past 6 Months CSV</text>
    <text x="65" y="200" fill="#a7f3d0" font-size="14" font-family="Liberation Sans">Household Size: 4 Members Detected</text>
    <text x="65" y="230" fill="#ffffff" font-size="14" font-family="Liberation Sans">Staples Analyzed: Wheat Flour, Rice, Dals, Oils</text>
    <rect x="65" y="260" width="400" height="40" rx="8" fill="#059669"/>
    <text x="140" y="285" fill="#ffffff" font-size="14" font-weight="bold" font-family="Liberation Sans">AI Projection Verified</text>

    <!-- Projected Staples & Annual Savings -->
    <rect x="520" y="95" width="640" height="280" rx="12" fill="#041424" stroke="#0ea5e9" stroke-width="1.5"/>
    <text x="545" y="135" fill="#f59e0b" font-size="16" font-weight="bold" font-family="Liberation Sans">12-Month Locked Wholesale Pantry Allocation</text>
    <text x="545" y="170" fill="#ffffff" font-size="14" font-family="Liberation Sans">• 120 kg Sonalika Whole Wheat Atta @ ₹38/kg (Locked)</text>
    <text x="545" y="195" fill="#ffffff" font-size="14" font-family="Liberation Sans">• 60 kg Aged Sona Masoori Rice @ ₹52/kg (Locked)</text>
    <text x="545" y="220" fill="#ffffff" font-size="14" font-family="Liberation Sans">• 30 L Cold-Pressed Mustard Oil @ ₹140/L (Locked)</text>
    <text x="545" y="245" fill="#ffffff" font-size="14" font-family="Liberation Sans">• 45 kg Unpolished Toor &amp; Moong Dal @ ₹115/kg (Locked)</text>

    <rect x="545" y="275" width="590" height="75" rx="8" fill="#064e3b" stroke="#34d399" stroke-width="1.5"/>
    <text x="565" y="305" fill="#6ee7b7" font-size="15" font-weight="bold" font-family="Liberation Sans">
      Total Household Savings: ₹14,200 per year with 100% Inflation Shield!
    </text>
    <text x="565" y="330" fill="#cbd5e1" font-size="13" font-family="Liberation Sans">
      Consumer demand feeds directly into rural farmer sowing quotas before seeds are planted.
    </text>
  </g>
</svg>
`
  },
  {
    idx: 5,
    title: "5. Command Center Supply Analytics & Ecosystem Impact",
    personaBadge: "AGROPULSE COMMAND CENTER (ADMIN)",
    duration: 40, // 3:20 - 4:00
    timestampRange: "3:20 - 4:00",
    activeTab: "admin",
    spokenVoiceover:
      "Finally, the AgroPulse Command Center unifies the entire closed-loop ecosystem. Urban consumer demand from Harvest Passes feeds directly into our forward supply analytics engine, granting rural farmers guaranteed pre-planting sowing quotas and eliminating crop gluts. Combined with 50-year ERA5 weather reanalysis and ground NGO partnerships with PRADAN, BAIF, and Digital Green, AgroPulse delivers 35% higher net earnings for farmers and 20% lower costs for urban consumers in one sustainable platform.",
    subLine1: "Command Center ties urban consumer Harvest Pass demand directly into rural farmer sowing quotas.",
    subLine2: "50-Year ERA5 weather reanalysis engine and NGO ground coordination guarantee fair prosperity and zero waste.",
    valueSummary: "Platform Value: Forward Sowing Quotas | 50-Yr Weather Engine | FPC Working Capital Buffer",
    freq: 659,
    renderSvg: () => `
<svg width="1280" height="2000" xmlns="http://www.w3.org/2000/svg">
  <rect width="100%" height="100%" fill="#0a0f1d"/>

  <!-- Top App Navigation Bar -->
  <rect x="0" y="0" width="1280" height="80" fill="#060913" />
  <line x1="0" y1="80" x2="1280" y2="80" stroke="#3b82f6" stroke-width="2"/>
  <circle cx="60" cy="40" r="22" fill="#3b82f6"/>
  <text x="95" y="44" fill="#ffffff" font-size="26" font-weight="bold" font-family="Liberation Sans">AgroPulse Command Center</text>
  <text x="95" y="62" fill="#60a5fa" font-size="12" font-family="Liberation Sans">Platform Administration &amp; Macro Supply Analytics Engine</text>

  <!-- 3-Tab Version Switcher Bar (Command Center Active) -->
  <g transform="translate(40, 100)">
    <rect width="1200" height="74" rx="14" fill="#091410" stroke="#3b82f6" stroke-width="2"/>
    <rect x="8" y="8" width="386" height="58" rx="10" fill="#0f1f1a"/>
    <text x="35" y="34" fill="#64748b" font-size="16" font-family="Liberation Sans">🌱 AgroPulse Krishi</text>

    <!-- Tab 2: Command Center ACTIVE -->
    <rect x="406" y="8" width="386" height="58" rx="10" fill="#1d4ed8" stroke="#60a5fa" stroke-width="2.5"/>
    <text x="435" y="34" fill="#ffffff" font-size="16" font-weight="bold" font-family="Liberation Sans">🏛️ AgroPulse Command Center [ACTIVE]</text>
    <text x="435" y="52" fill="#bfdbfe" font-size="12" font-family="Liberation Sans">Platform Admin: 50-Yr Weather Engine • Working Capital</text>

    <rect x="804" y="8" width="386" height="58" rx="10" fill="#0f1f1a"/>
    <text x="835" y="34" fill="#64748b" font-size="16" font-family="Liberation Sans">⚡ 15-Mins Consumer Express</text>
  </g>

  <!-- Macro Executive KPI Strip -->
  <g transform="translate(40, 195)">
    <rect x="0" y="0" width="285" height="110" rx="12" fill="#1e293b" stroke="#3b82f6" stroke-width="1.5"/>
    <text x="24" y="38" fill="#60a5fa" font-size="28" font-weight="bold" font-family="Liberation Sans">1,420</text>
    <text x="24" y="65" fill="#ffffff" font-size="15" font-weight="bold" font-family="Liberation Sans">Active Smallholders</text>
    <text x="24" y="88" fill="#94a3b8" font-size="12" font-family="Liberation Sans">Across 4 FPC Clusters</text>

    <rect x="305" y="0" width="285" height="110" rx="12" fill="#1e293b" stroke="#3b82f6" stroke-width="1.5"/>
    <text x="329" y="38" fill="#34d399" font-size="28" font-weight="bold" font-family="Liberation Sans">3,850 MT</text>
    <text x="329" y="65" fill="#ffffff" font-size="15" font-weight="bold" font-family="Liberation Sans">Cold Storage Secured</text>
    <text x="329" y="88" fill="#94a3b8" font-size="12" font-family="Liberation Sans">12 Solar Godowns</text>

    <rect x="610" y="0" width="285" height="110" rx="12" fill="#1e293b" stroke="#3b82f6" stroke-width="1.5"/>
    <text x="634" y="38" fill="#f59e0b" font-size="28" font-weight="bold" font-family="Liberation Sans">98.4%</text>
    <text x="634" y="65" fill="#ffffff" font-size="15" font-weight="bold" font-family="Liberation Sans">15-Min Delivery SLA</text>
    <text x="634" y="88" fill="#94a3b8" font-size="12" font-family="Liberation Sans">0 Spoilage in Transit</text>

    <rect x="915" y="0" width="285" height="110" rx="12" fill="#1e293b" stroke="#3b82f6" stroke-width="1.5"/>
    <text x="939" y="38" fill="#a7f3d0" font-size="28" font-weight="bold" font-family="Liberation Sans">₹2.84 Cr</text>
    <text x="939" y="65" fill="#ffffff" font-size="15" font-weight="bold" font-family="Liberation Sans">Working Capital Pool</text>
    <text x="939" y="88" fill="#94a3b8" font-size="12" font-family="Liberation Sans">78% Liquidity Advances</text>
  </g>

  <!-- 50-Year ERA5 Historical Weather Reanalysis Engine Card -->
  <g transform="translate(40, 330)">
    <rect width="1200" height="380" rx="16" fill="#0f172a" stroke="#3b82f6" stroke-width="2"/>
    <text x="40" y="44" fill="#60a5fa" font-size="22" font-weight="bold" font-family="Liberation Sans">
      🛰️ 50-Year ERA5 Historical Weather Reanalysis &amp; Calamity Radar Engine
    </text>
    <text x="40" y="70" fill="#94a3b8" font-size="14" font-family="Liberation Sans">
      Statistical climate anomaly models, precipitation recurrence intervals, and automated trigger thresholds.
    </text>

    <!-- Synthetic Weather Wave Graph -->
    <g transform="translate(40, 95)">
      <rect width="1120" height="180" rx="10" fill="#020617" stroke="#1e293b" stroke-width="1"/>
      <!-- Grid lines -->
      <line x1="40" y1="40" x2="1080" y2="40" stroke="#1e293b" stroke-dasharray="4"/>
      <line x1="40" y1="90" x2="1080" y2="90" stroke="#1e293b" stroke-dasharray="4"/>
      <line x1="40" y1="140" x2="1080" y2="140" stroke="#1e293b" stroke-dasharray="4"/>

      <!-- Threshold Red Line -->
      <line x1="40" y1="60" x2="1080" y2="60" stroke="#ef4444" stroke-width="2" stroke-dasharray="6"/>
      <text x="880" y="52" fill="#ef4444" font-size="12" font-weight="bold" font-family="Liberation Sans">Threshold Trigger: 35.0 mm/hr</text>

      <!-- 50-Yr Weather Curve -->
      <path d="M 40 140 Q 200 120 350 90 T 600 45 T 850 110 T 1080 130" fill="none" stroke="#38bdf8" stroke-width="3"/>
      <circle cx="600" cy="45" r="7" fill="#ef4444"/>
      <text x="615" y="45" fill="#fca5a5" font-size="13" font-weight="bold" font-family="Liberation Sans">Cloudburst Peak: 38.4 mm/hr (Automated Payout Fired)</text>
    </g>

    <text x="40" y="320" fill="#cbd5e1" font-size="14" font-family="Liberation Sans">
      Monitors ISRO Satellite Doppler &amp; IMD radar across 42 peri-urban agricultural taluks in real time.
    </text>
  </g>

  <!-- Forward Sowing Quota Engine & NGO Ground Coordination -->
  <g transform="translate(40, 735)">
    <rect width="1200" height="420" rx="16" fill="#0f172a" stroke="#10b981" stroke-width="2"/>
    <text x="40" y="44" fill="#34d399" font-size="22" font-weight="bold" font-family="Liberation Sans">
      🔄 Forward Sowing Quota Engine &amp; NGO Partner Coordination
    </text>
    <text x="40" y="70" fill="#94a3b8" font-size="14" font-family="Liberation Sans">
      Converting urban Harvest Pass subscriptions into guaranteed sowing quotas before planting.
    </text>

    <!-- Allocation Table -->
    <g transform="translate(40, 95)">
      <rect width="1120" height="220" rx="10" fill="#020617" stroke="#1e293b" stroke-width="1"/>
      
      <!-- Table Header -->
      <rect x="0" y="0" width="1120" height="45" rx="10" fill="#1e293b"/>
      <text x="24" y="28" fill="#ffffff" font-size="14" font-weight="bold" font-family="Liberation Sans">FPC Cluster</text>
      <text x="240" y="28" fill="#ffffff" font-size="14" font-weight="bold" font-family="Liberation Sans">NGO Ground Partner</text>
      <text x="500" y="28" fill="#ffffff" font-size="14" font-weight="bold" font-family="Liberation Sans">Pre-Allocated Acreage</text>
      <text x="760" y="28" fill="#ffffff" font-size="14" font-weight="bold" font-family="Liberation Sans">Forward Sowing Quota</text>
      <text x="980" y="28" fill="#ffffff" font-size="14" font-weight="bold" font-family="Liberation Sans">Status</text>

      <!-- Row 1 -->
      <text x="24" y="80" fill="#34d399" font-size="14" font-family="Liberation Sans">Karimnagar FPC</text>
      <text x="240" y="80" fill="#ffffff" font-size="14" font-family="Liberation Sans">PRADAN</text>
      <text x="500" y="80" fill="#ffffff" font-size="14" font-family="Liberation Sans">850 Acres (Wheat &amp; Tomato)</text>
      <text x="760" y="80" fill="#38bdf8" font-size="14" font-family="Liberation Sans">1,200 MT Guaranteed</text>
      <text x="980" y="80" fill="#34d399" font-size="14" font-weight="bold" font-family="Liberation Sans">Locked</text>

      <!-- Row 2 -->
      <text x="24" y="125" fill="#34d399" font-size="14" font-family="Liberation Sans">Nashik Organic FPC</text>
      <text x="240" y="125" fill="#ffffff" font-size="14" font-family="Liberation Sans">BAIF Development Research</text>
      <text x="500" y="125" fill="#ffffff" font-size="14" font-family="Liberation Sans">620 Acres (Onion &amp; Grapes)</text>
      <text x="760" y="125" fill="#38bdf8" font-size="14" font-family="Liberation Sans">980 MT Guaranteed</text>
      <text x="980" y="125" fill="#34d399" font-size="14" font-weight="bold" font-family="Liberation Sans">Locked</text>

      <!-- Row 3 -->
      <text x="24" y="170" fill="#34d399" font-size="14" font-family="Liberation Sans">Warangal Kisan Hub</text>
      <text x="240" y="170" fill="#ffffff" font-size="14" font-family="Liberation Sans">Digital Green</text>
      <text x="500" y="170" fill="#ffffff" font-size="14" font-family="Liberation Sans">540 Acres (Chili &amp; Turmeric)</text>
      <text x="760" y="170" fill="#38bdf8" font-size="14" font-family="Liberation Sans">650 MT Guaranteed</text>
      <text x="980" y="170" fill="#34d399" font-size="14" font-weight="bold" font-family="Liberation Sans">Locked</text>
    </g>

    <!-- Impact Ribbon -->
    <rect x="40" y="340" width="1120" height="55" rx="8" fill="#064e3b" stroke="#34d399" stroke-width="1.5"/>
    <text x="60" y="374" fill="#6ee7b7" font-size="15" font-weight="bold" font-family="Liberation Sans">
      Zero Overproduction Waste • 100% Price Realization • Guaranteed Farmer Prosperity
    </text>
  </g>

  <!-- Grand Finale Banner -->
  <g transform="translate(40, 1180)">
    <rect width="1200" height="220" rx="16" fill="#022c22" stroke="#10b981" stroke-width="2.5"/>
    <text x="40" y="55" fill="#34d399" font-size="28" font-weight="bold" font-family="Liberation Sans">
      AgroPulse Closed-Loop Agritech Ecosystem
    </text>
    <text x="40" y="95" fill="#ffffff" font-size="18" font-family="Liberation Sans">
      +35% Higher Farmer Realization  |  -20% Lower Consumer Cost  |  15-Minute Guaranteed Delivery
    </text>
    <text x="40" y="130" fill="#a7f3d0" font-size="15" font-family="Liberation Sans">
      The complete unified platform uniting rural farmers, solar cold chains, and urban quick commerce.
    </text>
    <text x="40" y="165" fill="#f59e0b" font-size="15" font-weight="bold" font-family="Liberation Sans">
      Visit: https://ais-pre-crsojtryjxeevfnjoglpli-152794877680.asia-southeast1.run.app
    </text>
  </g>
</svg>
`
  }
];

console.log("==================================================================");
console.log("STARTING AGROPULSE CONSOLIDATED 4-MINUTE DEMO VIDEO GENERATION");
console.log("With Unified Spoken Voiceover & Application UI Smooth Scrolling");
console.log("==================================================================");

async function generateVoiceoverAudio(text, duration, freq, outputPath) {
  // First attempt: call local Gemini TTS endpoint
  try {
    const res = await fetch("http://127.0.0.1:3000/api/ai/tts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: text }),
    });
    const data = await res.json();
    if (res.ok && data.audioDataUrl) {
      const b64 = data.audioDataUrl.replace(/^data:audio\/\w+;base64,/, "");
      const rawAudioPath = `${outputPath}.raw.wav`;
      fs.writeFileSync(rawAudioPath, Buffer.from(b64, "base64"));
      
      // Mix Gemini TTS audio with pad tone and ensure exact duration match
      const cmd = `ffmpeg -y -i "${rawAudioPath}" -f lavfi -i "sine=frequency=${freq}:sample_rate=24000,volume=0.008" -filter_complex "[0:a]aformat=sample_rates=44100:channel_layouts=mono,apad=whole_dur=${duration}[v];[1:a]atrim=0:${duration},aformat=sample_rates=44100:channel_layouts=mono[b];[v][b]amix=inputs=2:duration=first[out]" -map "[out]" -c:a pcm_s16le "${outputPath}"`;
      execSync(cmd, { stdio: "pipe" });
      if (fs.existsSync(rawAudioPath)) fs.unlinkSync(rawAudioPath);
      console.log(`✓ Gemini TTS audio synthesized and padded to exact ${duration}s.`);
      return;
    }
  } catch (err) {
    console.warn("Gemini TTS API call failed, using flite fallback:", err.message);
  }

  // Fallback: use ffmpeg flite engine
  const txtPath = `${outputPath}.txt`;
  fs.writeFileSync(txtPath, text, "utf-8");
  const fallbackCmd = `ffmpeg -y -f lavfi -i "flite=textfile=${txtPath}:voice=slt" -f lavfi -i "sine=frequency=${freq}:sample_rate=44100,volume=0.01" -filter_complex "[0:a]aformat=sample_rates=44100:channel_layouts=mono,apad=whole_dur=${duration}[v];[1:a]atrim=0:${duration}[b];[v][b]amix=inputs=2:duration=first[out]" -map "[out]" -c:a pcm_s16le "${outputPath}"`;
  execSync(fallbackCmd, { stdio: "pipe" });
  if (fs.existsSync(txtPath)) fs.unlinkSync(txtPath);
  console.log(`✓ Flite audio synthesized and padded to exact ${duration}s.`);
}

async function main() {
  const tempClips = [];

  for (const scene of SCENES) {
    console.log(`\n-------------------------------------------------------------`);
    console.log(`Processing Scene ${scene.idx}/5: ${scene.title} (${scene.duration}s)...`);
    console.log(`-------------------------------------------------------------`);

    const svgPath = path.join(OUTPUT_DIR, `temp_ui_scene_${scene.idx}.svg`);
    const audioPath = path.join(OUTPUT_DIR, `temp_audio_scene_${scene.idx}.wav`);
    const clipPath = path.join(OUTPUT_DIR, `temp_clip_scene_${scene.idx}.mp4`);
    tempClips.push(clipPath);

    // 1. Generate Application UI SVG
    const svgContent = scene.renderSvg();
    fs.writeFileSync(svgPath, svgContent, "utf-8");
    console.log(`✓ Generated tall application UI SVG for Scene ${scene.idx}`);

    // 2. Synthesize Spoken Voiceover Audio
    console.log(`Synthesizing voiceover for Scene ${scene.idx}...`);
    await generateVoiceoverAudio(scene.spokenVoiceover, scene.duration, scene.freq, audioPath);

    // 3. Render video clip with smooth camera panning through the application UI
    // The SVG height is 2000-2100px. The video frame is 1280x720.
    // Crop filter pans vertically: y = (in_h - 720) * t / duration
    console.log(`Encoding Video Clip with UI Camera Scroll & Voiceover Subtitles (${scene.duration}s)...`);
    
    const rangeText = scene.timestampRange.replace(/:/g, "\\:");
    const subLine1Escaped = scene.subLine1.replace(/'/g, "\\'").replace(/:/g, "\\:").replace(/%/g, "%%");
    const subLine2Escaped = scene.subLine2.replace(/'/g, "\\'").replace(/:/g, "\\:").replace(/%/g, "%%");
    const valueSummaryEscaped = scene.valueSummary.replace(/'/g, "\\'").replace(/:/g, "\\:").replace(/%/g, "%%");
    const personaBadgeEscaped = scene.personaBadge.replace(/'/g, "\\'");

    const vf = [
      // Smooth vertical camera panning through the tall application UI
      `crop=1280:720:0:'min(in_h-720, (in_h-720)*t/${scene.duration})'`,
      
      // Floating Top HUD Banner: Chapter & Active Persona
      `drawbox=y=0:width=1280:height=56:color=black@0.80:t=fill`,
      `drawbox=y=56:width=1280:height=2:color=#059669@0.9:t=fill`,
      `drawtext=fontfile=${FONT_BOLD}:text='AgroPulse Ecosystem · Chapter ${scene.idx}/5':fontcolor=#34d399:fontsize=20:x=30:y=18`,
      `drawtext=fontfile=${FONT_REG}:text='${rangeText}':fontcolor=#94a3b8:fontsize=16:x=340:y=20`,
      `drawbox=x=780:y=11:width=470:height=34:color=#064e3b@0.9:t=fill`,
      `drawtext=fontfile=${FONT_BOLD}:text='${personaBadgeEscaped}':fontcolor=white:fontsize=13:x=795:y=22`,

      // Floating Bottom HUD Banner: Voiceover Subtitles & Value Highlights
      `drawbox=y=545:width=1280:height=175:color=black@0.92:t=fill`,
      `drawbox=y=545:width=1280:height=2:color=#059669@0.9:t=fill`,
      
      // Voiceover Title Tag
      `drawtext=fontfile=${FONT_BOLD}:text='VOICEOVER NARRATION\\:':fontcolor=#34d399:fontsize=12:x=30:y=560`,
      // Subtitle Line 1 & Line 2
      `drawtext=fontfile=${FONT_REG}:text='${subLine1Escaped}':fontcolor=white:fontsize=16:x=30:y=584`,
      `drawtext=fontfile=${FONT_REG}:text='${subLine2Escaped}':fontcolor=white:fontsize=16:x=30:y=610`,

      // Value Creation Banner
      `drawbox=x=30:y=645:width=1220:height=40:color=#0f172a@0.95:t=fill`,
      `drawbox=x=30:y=645:width=1220:height=2:color=#38bdf8@0.7:t=fill`,
      `drawtext=fontfile=${FONT_BOLD}:text='DELIVERED VALUE\\: ${valueSummaryEscaped}':fontcolor=#38bdf8:fontsize=14:x=45:y=658`,

      // Micro Progress Bar at the very bottom
      `drawbox=y=712:color=#1e293b:width=1280:height=8:t=fill`,
      `drawbox=y=712:color=#10b981:width=1280:height=8:t=fill`
    ].join(",");

    const cmd = `ffmpeg -y -loop 1 -t ${scene.duration} -i "${svgPath}" -i "${audioPath}" -vf "${vf}" -c:v libx264 -pix_fmt yuv420p -preset veryfast -crf 23 -c:a aac -b:a 128k -shortest "${clipPath}"`;
    execSync(cmd, { stdio: "inherit" });

    // Clean up temporary SVG and audio
    if (fs.existsSync(svgPath)) fs.unlinkSync(svgPath);
    if (fs.existsSync(audioPath)) fs.unlinkSync(audioPath);
  }

  // 4. Concatenate all 5 clips into the final consolidated 4-minute video
  console.log(`\n=============================================================`);
  console.log(`Stitching all 5 scenes into the final consolidated 4-minute demo video...`);
  console.log(`=============================================================`);

  const concatListPath = path.join(OUTPUT_DIR, "concat_list.txt");
  const concatContent = tempClips.map((p) => `file '${path.resolve(p)}'`).join("\n");
  fs.writeFileSync(concatListPath, concatContent);

  const stitchCmd = `ffmpeg -y -f concat -safe 0 -i "${concatListPath}" -c copy "${FINAL_VIDEO_PATH}"`;
  execSync(stitchCmd, { stdio: "inherit" });

  // Clean up clips
  tempClips.forEach((p) => {
    if (fs.existsSync(p)) fs.unlinkSync(p);
  });
  if (fs.existsSync(concatListPath)) fs.unlinkSync(concatListPath);

  console.log(`\n🎉 SUCCESS! Consolidated 4-Minute Demo Video generated at:`);
  console.log(FINAL_VIDEO_PATH);

  const stat = fs.statSync(FINAL_VIDEO_PATH);
  console.log(`File Size: ${(stat.size / (1024 * 1024)).toFixed(2)} MB`);
}

main().catch((err) => {
  console.error("FATAL ERROR in demo video generation:", err);
  process.exit(1);
});
