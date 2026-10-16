import romaTomatoesImg from "../assets/images/product_roma_tomatoes_1791731971325.jpg";
import babySpinachImg from "../assets/images/product_baby_spinach_1791731984724.jpg";
import alphonsoMangoesImg from "../assets/images/product_alphonso_mangoes_1791731995390.jpg";
import redOnionsImg from "../assets/images/product_red_onions_1791732007720.jpg";
import sampleLeafScanImg from "../assets/images/sample_tomato_leaf_scan_1791732018407.jpg";

export type AppMode = "krishi" | "admin" | "express";

export interface GodownDeposit {
  id: string;
  receiptId: string;
  farmerName: string;
  fpcCluster: string;
  cropName: string;
  grade: "Grade A+" | "Grade A";
  weightKg: number;
  marketValuationInr: number;
  advanceRatePercent: number;
  advanceDisbursedInr: number;
  coldRoomTempC: number;
  relativeHumidityPercent: number;
  depositTimestamp: string;
  status: "Locked in Cold Chain" | "Allocated to Dark Store" | "Settled";
}

export interface ParametricWeatherRegion {
  id: string;
  clusterName: string;
  district: string;
  fpcCount: number;
  insuredFarmers: number;
  reanalysisBaseline50YrMm: number;
  liveRainfallMmHr: number;
  rainfallThresholdMmHr: number;
  consecutiveDryDays: number;
  drySpellThresholdDays: number;
  soilMoistureIndexPercent: number;
  satelliteSource: string;
  status: "Normal" | "Standby Alert" | "Payout Triggered";
  estimatedPayoutPoolInr: number;
  lastUpdated: string;
}

export interface NgoPartnerActivity {
  id: string;
  ngoName: "PRADAN" | "BAIF" | "Digital Green";
  focusArea: string;
  activeCluster: string;
  fieldOfficers: number;
  farmersTrained: number;
  bioInputsAudited: number;
  completionRatePercent: number;
  leadCoordinator: string;
  lastSync: string;
  status: "Active Field Audit" | "Video Advisory Live" | "Soil Sampling";
}

export interface ExpressProduct {
  id: string;
  name: string;
  subtitle: string;
  category: "Vegetables" | "Leafy Greens" | "Fruits" | "Root & Allium";
  weightLabel: string;
  priceInr: number;
  mrpInr: number;
  savingsPercent: number;
  farmerEarningBoostPercent: number;
  imageUrl: string;
  verificationTag: "Direct FPC Source" | "AI Soil Verified";
  harvestHoursAgo: number;
  harvestTimestamp: string;
  farmerName: string;
  farmerVillage: string;
  fpcName: string;
  godownHubId: string;
  soilMineralIndex: string;
  organicProtocolUsed: string;
  coldChainTransitTemp: string;
  darkStoreSlaMins: number;
  stockAvailable: number;
}

// -------------------------------------------------------------
// HARVEST PASS & DEMAND-FIRST SUPPLY ANALYTICS TYPES
// -------------------------------------------------------------
export interface HarvestPassDemandItem {
  id: string;
  item: string;
  category: "Staples & Grains" | "Cold-Pressed Oils" | "Pulses & Dal" | "Seasonal Produce" | "Spices & Condiments";
  annualQtyKg: number;
  monthlyAvgKg: number;
  annualQtyLabel: string;
  monthlyAvgLabel: string;
  farmSource: string;
  assignedFpcId: string;
  lockedWholesalePriceInrKg: number;
  projectedAnnualBudgetInr: number;
  farmerNetRealizationBoostPercent: number;
  sowingLeadWeeks: number;
  sowingStatus: "Sowing Scheduled" | "Seed Sown & Germinating" | "Field Allocated" | "Ready for Harvest";
  recommendedAcreage: number;
  activeSubscriberCount: number;
}

export interface HarvestPassContract {
  id: string;
  consumerName: string;
  cityZone: string;
  householdSize: number;
  passStatus: "Draft" | "Locked & Active" | "Dispatched This Week";
  createdTimestamp: string;
  lockedUntilDate: string;
  totalAnnualKg: number;
  totalAnnualBudgetInr: number;
  totalAnnualSavingsInr: number;
  sourceFileUsed?: string;
  items: HarvestPassDemandItem[];
}

export const SAMPLE_LEAF_IMAGE = sampleLeafScanImg;

export const INITIAL_GODOWN_DEPOSITS: GodownDeposit[] = [
  {
    id: "dep-1",
    receiptId: "WR-KND-8841",
    farmerName: "G. Narsimha Reddy",
    fpcCluster: "Kandi FPC Smart Hub #04",
    cropName: "Hydroponic Roma Tomatoes",
    grade: "Grade A+",
    weightKg: 850,
    marketValuationInr: 32300,
    advanceRatePercent: 78,
    advanceDisbursedInr: 25194,
    coldRoomTempC: 11.4,
    relativeHumidityPercent: 88,
    depositTimestamp: "2026-10-10 14:20 IST",
    status: "Allocated to Dark Store",
  },
  {
    id: "dep-2",
    receiptId: "WR-CHV-8849",
    farmerName: "K. Padmavathi",
    fpcCluster: "Chevella Greens Godown #11",
    cropName: "Pesticide-Free Baby Spinach",
    grade: "Grade A+",
    weightKg: 420,
    marketValuationInr: 42000,
    advanceRatePercent: 75,
    advanceDisbursedInr: 31500,
    coldRoomTempC: 4.2,
    relativeHumidityPercent: 94,
    depositTimestamp: "2026-10-11 04:15 IST",
    status: "Locked in Cold Chain",
  },
  {
    id: "dep-3",
    receiptId: "WR-MDK-8852",
    farmerName: "M. Mallesh Yadav",
    fpcCluster: "Medak Allium Solar Cold Hub #07",
    cropName: "Heirloom Red Onions & Garlic",
    grade: "Grade A",
    weightKg: 1600,
    marketValuationInr: 67200,
    advanceRatePercent: 75,
    advanceDisbursedInr: 50400,
    coldRoomTempC: 14.8,
    relativeHumidityPercent: 68,
    depositTimestamp: "2026-10-09 17:40 IST",
    status: "Locked in Cold Chain",
  },
  {
    id: "dep-4",
    receiptId: "WR-ZHB-8860",
    farmerName: "B. Venkataiah",
    fpcCluster: "Zaheerabad Orchard Hub #19",
    cropName: "Carbide-Free Alphonso Mangoes",
    grade: "Grade A+",
    weightKg: 640,
    marketValuationInr: 76800,
    advanceRatePercent: 80,
    advanceDisbursedInr: 61440,
    coldRoomTempC: 12.6,
    relativeHumidityPercent: 85,
    depositTimestamp: "2026-10-10 09:30 IST",
    status: "Allocated to Dark Store",
  },
];

export const INITIAL_WEATHER_REGIONS: ParametricWeatherRegion[] = [
  {
    id: "reg-kandi",
    clusterName: "Kandi Peri-Urban Cluster",
    district: "Sangareddy, Telangana",
    fpcCount: 12,
    insuredFarmers: 1840,
    reanalysisBaseline50YrMm: 14.2,
    liveRainfallMmHr: 18.5,
    rainfallThresholdMmHr: 35.0,
    consecutiveDryDays: 2,
    drySpellThresholdDays: 14,
    soilMoistureIndexPercent: 74,
    satelliteSource: "ISRO EOS-04 SAR + IMD 0.25° Grid",
    status: "Normal",
    estimatedPayoutPoolInr: 1450000,
    lastUpdated: "10 mins ago",
  },
  {
    id: "reg-zaheerabad",
    clusterName: "Zaheerabad Rainfed Belt",
    district: "Sangareddy West",
    fpcCount: 11,
    insuredFarmers: 2190,
    reanalysisBaseline50YrMm: 16.0,
    liveRainfallMmHr: 32.8,
    rainfallThresholdMmHr: 35.0,
    consecutiveDryDays: 0,
    drySpellThresholdDays: 14,
    soilMoistureIndexPercent: 89,
    satelliteSource: "ISRO EOS-04 SAR + ERA5 Reanalysis",
    status: "Standby Alert",
    estimatedPayoutPoolInr: 2190000,
    lastUpdated: "2 mins ago",
  },
  {
    id: "reg-warangal",
    clusterName: "Warangal East Cotton & Veg",
    district: "Warangal, Telangana",
    fpcCount: 10,
    insuredFarmers: 1620,
    reanalysisBaseline50YrMm: 12.8,
    liveRainfallMmHr: 2.1,
    rainfallThresholdMmHr: 35.0,
    consecutiveDryDays: 13,
    drySpellThresholdDays: 14,
    soilMoistureIndexPercent: 28,
    satelliteSource: "NASA SMAP + IMD Gridded API",
    status: "Standby Alert",
    estimatedPayoutPoolInr: 1296000,
    lastUpdated: "4 mins ago",
  },
  {
    id: "reg-chevella",
    clusterName: "Chevella Hydro-Organic Zone",
    district: "Ranga Reddy, Telangana",
    fpcCount: 9,
    insuredFarmers: 1490,
    reanalysisBaseline50YrMm: 13.5,
    liveRainfallMmHr: 9.4,
    rainfallThresholdMmHr: 35.0,
    consecutiveDryDays: 4,
    drySpellThresholdDays: 14,
    soilMoistureIndexPercent: 68,
    satelliteSource: "ISRO EOS-04 SAR + IMD 0.25° Grid",
    status: "Normal",
    estimatedPayoutPoolInr: 1120000,
    lastUpdated: "6 mins ago",
  },
];

export const INITIAL_NGO_PARTNERS: NgoPartnerActivity[] = [
  {
    id: "ngo-pradan",
    ngoName: "PRADAN",
    focusArea: "FPC Governance & Decentralized Godown Liquidity",
    activeCluster: "Kandi & Zaheerabad Clusters",
    fieldOfficers: 34,
    farmersTrained: 2840,
    bioInputsAudited: 612,
    completionRatePercent: 94,
    leadCoordinator: "Ananya Deshmukh",
    lastSync: "18 mins ago",
    status: "Active Field Audit",
  },
  {
    id: "ngo-baif",
    ngoName: "BAIF",
    focusArea: "Soil Microbiome Restoration & Jeevamrutham Bio-Labs",
    activeCluster: "Chevella & Medak Clusters",
    fieldOfficers: 28,
    farmersTrained: 2150,
    bioInputsAudited: 540,
    completionRatePercent: 89,
    leadCoordinator: "Dr. Rajeshwar Rao",
    lastSync: "32 mins ago",
    status: "Soil Sampling",
  },
  {
    id: "ngo-digital-green",
    ngoName: "Digital Green",
    focusArea: "Peer-to-Peer Vernacular Video Extension & AI Leaf Scan",
    activeCluster: "All 42 FPC Godown Hubs",
    fieldOfficers: 41,
    farmersTrained: 4620,
    bioInputsAudited: 890,
    completionRatePercent: 97,
    leadCoordinator: "Srinivasulu K.",
    lastSync: "5 mins ago",
    status: "Video Advisory Live",
  },
];

export const INITIAL_EXPRESS_PRODUCTS: ExpressProduct[] = [
  {
    id: "prod-roma-tomatoes",
    name: "Fresh Hydroponic Roma Tomatoes",
    subtitle: "Vine-ripened, lycopene-rich, zero chemical residue",
    category: "Vegetables",
    weightLabel: "500g",
    priceInr: 38,
    mrpInr: 48,
    savingsPercent: 20,
    farmerEarningBoostPercent: 35,
    imageUrl: romaTomatoesImg,
    verificationTag: "Direct FPC Source",
    harvestHoursAgo: 18,
    harvestTimestamp: "Yesterday, 14:00 IST",
    farmerName: "G. Narsimha Reddy",
    farmerVillage: "Kandi Cluster, Sangareddy",
    fpcName: "Kandi Rythu Producer Co.",
    godownHubId: "Smart Godown #04 (11.4°C)",
    soilMineralIndex: "Brix 6.4 · Organic Carbon 1.28%",
    organicProtocolUsed: "Neemastra & Fermented Buttermilk Foliar Spray",
    coldChainTransitTemp: "11.4°C Reefers to Jubilee Hills Dark Store",
    darkStoreSlaMins: 14,
    stockAvailable: 48,
  },
  {
    id: "prod-baby-spinach",
    name: "Pesticide-Free Baby Spinach",
    subtitle: "Zero chemical residue, certified organic mineral index",
    category: "Leafy Greens",
    weightLabel: "250g",
    priceInr: 25,
    mrpInr: 32,
    savingsPercent: 20,
    farmerEarningBoostPercent: 36,
    imageUrl: babySpinachImg,
    verificationTag: "AI Soil Verified",
    harvestHoursAgo: 9,
    harvestTimestamp: "Today, 05:30 IST",
    farmerName: "K. Padmavathi",
    farmerVillage: "Chevella Cluster, Ranga Reddy",
    fpcName: "Chevella Mahila FPC",
    godownHubId: "Smart Godown #11 (4.2°C)",
    soilMineralIndex: "Iron 3.4mg/100g · Nitrate-Safe Verified",
    organicProtocolUsed: "Jeevamrutham Root Drench & Sticky Traps",
    coldChainTransitTemp: "4.2°C Hydro-Cooled Chain",
    darkStoreSlaMins: 12,
    stockAvailable: 34,
  },
  {
    id: "prod-alphonso-mangoes",
    name: "Carbide-Free Banganapalli & Alphonso",
    subtitle: "Tree-ripened in straw boxes, natural aroma & high Brix",
    category: "Fruits",
    weightLabel: "1 kg (3-4 pcs)",
    priceInr: 144,
    mrpInr: 180,
    savingsPercent: 20,
    farmerEarningBoostPercent: 38,
    imageUrl: alphonsoMangoesImg,
    verificationTag: "Direct FPC Source",
    harvestHoursAgo: 22,
    harvestTimestamp: "Yesterday, 10:15 IST",
    farmerName: "B. Venkataiah",
    farmerVillage: "Zaheerabad Orchard Belt",
    fpcName: "Deccan Natural Orchards FPC",
    godownHubId: "Smart Godown #19 (12.6°C)",
    soilMineralIndex: "Brix 19.2 · Potassium Enriched Mulch",
    organicProtocolUsed: "Panchagavya & Pheromone Fruit-Fly Traps",
    coldChainTransitTemp: "12.6°C Ethylene-Regulated Chamber",
    darkStoreSlaMins: 14,
    stockAvailable: 26,
  },
  {
    id: "prod-red-onions",
    name: "Heirloom Red Onions & Purple Garlic",
    subtitle: "Solar-cured for high pungency and allicin content",
    category: "Root & Allium",
    weightLabel: "1 kg Combo",
    priceInr: 42,
    mrpInr: 53,
    savingsPercent: 20,
    farmerEarningBoostPercent: 34,
    imageUrl: redOnionsImg,
    verificationTag: "AI Soil Verified",
    harvestHoursAgo: 36,
    harvestTimestamp: "2 days ago, 16:40 IST",
    farmerName: "M. Mallesh Yadav",
    farmerVillage: "Medak Allium Cluster",
    fpcName: "Medak Suryashakti FPC",
    godownHubId: "Smart Godown #07 (14.8°C)",
    soilMineralIndex: "Sulfur Index Optimal · Organic Carbon 1.15%",
    organicProtocolUsed: "Trichoderma Viride & Wood Ash Soil Application",
    coldChainTransitTemp: "14.8°C Low-Humidity Ventilated Crate",
    darkStoreSlaMins: 14,
    stockAvailable: 65,
  },
];

// Baseline Initial Harvest Pass Demand Items
export const INITIAL_HARVEST_PASS_ITEMS: HarvestPassDemandItem[] = [
  {
    id: "hp-1",
    item: "Organic Basmati Rice (Staple)",
    category: "Staples & Grains",
    annualQtyKg: 60,
    monthlyAvgKg: 5,
    annualQtyLabel: "60 kg",
    monthlyAvgLabel: "5 kg",
    farmSource: "Telangana FPO Cluster A",
    assignedFpcId: "fpo-tg-a",
    lockedWholesalePriceInrKg: 95,
    projectedAnnualBudgetInr: 5700,
    farmerNetRealizationBoostPercent: 38,
    sowingLeadWeeks: 18,
    sowingStatus: "Seed Sown & Germinating",
    recommendedAcreage: 0.12,
    activeSubscriberCount: 1420,
  },
  {
    id: "hp-2",
    item: "Cold-Pressed Groundnut Oil",
    category: "Cold-Pressed Oils",
    annualQtyKg: 18,
    monthlyAvgKg: 1.5,
    annualQtyLabel: "18 L",
    monthlyAvgLabel: "1.5 L",
    farmSource: "Rayalaseema Farmer Collective",
    assignedFpcId: "fpo-rayala-b",
    lockedWholesalePriceInrKg: 240,
    projectedAnnualBudgetInr: 4320,
    farmerNetRealizationBoostPercent: 36,
    sowingLeadWeeks: 14,
    sowingStatus: "Field Allocated",
    recommendedAcreage: 0.08,
    activeSubscriberCount: 980,
  },
  {
    id: "hp-3",
    item: "Toor Dal & Native Pulses",
    category: "Pulses & Dal",
    annualQtyKg: 24,
    monthlyAvgKg: 2,
    annualQtyLabel: "24 kg",
    monthlyAvgLabel: "2 kg",
    farmSource: "Mahbubnagar Producer Group",
    assignedFpcId: "fpo-mbnr-c",
    lockedWholesalePriceInrKg: 145,
    projectedAnnualBudgetInr: 3480,
    farmerNetRealizationBoostPercent: 42,
    sowingLeadWeeks: 16,
    sowingStatus: "Sowing Scheduled",
    recommendedAcreage: 0.1,
    activeSubscriberCount: 1250,
  },
  {
    id: "hp-4",
    item: "Seasonal Veggies (Onion/Potato/Tomatoes)",
    category: "Seasonal Produce",
    annualQtyKg: 180,
    monthlyAvgKg: 15,
    annualQtyLabel: "180 kg",
    monthlyAvgLabel: "15 kg",
    farmSource: "Kandi Eco-Farm Network",
    assignedFpcId: "fpo-kandi-04",
    lockedWholesalePriceInrKg: 34,
    projectedAnnualBudgetInr: 6120,
    farmerNetRealizationBoostPercent: 35,
    sowingLeadWeeks: 6,
    sowingStatus: "Ready for Harvest",
    recommendedAcreage: 0.15,
    activeSubscriberCount: 2840,
  },
];

export const INITIAL_HARVEST_PASS_CONTRACT: HarvestPassContract = {
  id: "HP-2026-HYD-9182",
  consumerName: "Urban Consumer Cohort (Jubilee / Banjara)",
  cityZone: "Hyderabad Peri-Urban Delivery Corridor",
  householdSize: 4,
  passStatus: "Locked & Active",
  createdTimestamp: "2026-10-10",
  lockedUntilDate: "October 2027 (1-Year Lock)",
  totalAnnualKg: 282,
  totalAnnualBudgetInr: 19620,
  totalAnnualSavingsInr: 4900,
  sourceFileUsed: "Blinkit_Instamart_Swiggy_OrderHistory_2025_2026.csv",
  items: INITIAL_HARVEST_PASS_ITEMS,
};
