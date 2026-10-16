import React, { useState } from "react";
import {
  ShoppingBag,
  Clock,
  QrCode,
  CheckCircle2,
  Plus,
  Minus,
  Trash2,
  X,
  UserCheck,
  ThermometerSnowflake,
  Sprout,
  Sparkles,
} from "lucide-react";
import { ExpressProduct, HarvestPassDemandItem } from "../data/ecosystemData";
import HarvestPassImporter from "./HarvestPassImporter";

interface CartItem {
  product: ExpressProduct;
  quantity: number;
}

interface ExpressStorefrontProps {
  products: ExpressProduct[];
  onHarvestPassLocked?: (
    items: HarvestPassDemandItem[],
    contractInfo: {
      fileName: string;
      annualBudget: number;
      annualSavings: number;
    }
  ) => void;
}

export const ExpressStorefront: React.FC<ExpressStorefrontProps> = ({
  products,
  onHarvestPassLocked,
}) => {
  const [activeTab, setActiveTab] = useState<"instant" | "harvest-pass">("instant");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [selectedZone, setSelectedZone] = useState<{ name: string; mins: number }>({
    name: "Jubilee Hills",
    mins: 14,
  });
  const [cart, setCart] = useState<CartItem[]>([
    { product: products[0], quantity: 1 },
  ]);
  const [traceProduct, setTraceProduct] = useState<ExpressProduct | null>(null);
  const [orderConfirmed, setOrderConfirmed] = useState<{
    orderId: string;
    totalPaid: number;
    totalSaved: number;
    farmerShareInr: number;
  } | null>(null);

  const categories = ["All", "Vegetables", "Leafy Greens", "Fruits", "Root & Allium"];

  const filteredProducts =
    selectedCategory === "All"
      ? products
      : products.filter((p) => p.category === selectedCategory);

  const handleAddToCart = (product: ExpressProduct) => {
    setOrderConfirmed(null);
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const handleUpdateQty = (productId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.product.id === productId
            ? { ...item, quantity: Math.max(0, item.quantity + delta) }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const subtotalInr = cart.reduce(
    (sum, item) => sum + item.product.priceInr * item.quantity,
    0
  );
  const mrpTotalInr = cart.reduce(
    (sum, item) => sum + item.product.mrpInr * item.quantity,
    0
  );
  const totalSavedInr = mrpTotalInr - subtotalInr;
  const directFarmerPayoutInr = Math.round(subtotalInr * 0.78);

  const handleInstantCheckout = () => {
    if (cart.length === 0) return;
    setOrderConfirmed({
      orderId: `APX-${Math.floor(10000 + Math.random() * 89999)}`,
      totalPaid: subtotalInr,
      totalSaved: totalSavedInr,
      farmerShareInr: directFarmerPayoutInr,
    });
    setCart([]);
  };

  return (
    <div id="app-express" className="space-y-8">
      {/* Express Top Banner */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2 text-xs text-amber-800 font-medium">
            <span>Urban Consumer Mode · Zero Middlemen</span>
            <span aria-hidden="true">·</span>
            <span>-20% Lower Consumer Price</span>
            <span aria-hidden="true">·</span>
            <span>+35% Higher Farmer Net Realization</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
            AgroPulse Express Storefront & Harvest Pass
          </h2>
          <p className="text-sm text-slate-600 max-w-2xl">
            15-minute quick delivery or lock your 1-year advance household grocery plan with the Harvest Pass Importer to feed guaranteed demand to rural farmers.
          </p>
        </div>

        {/* Mode Selector within Express: 15-Min Quick Commerce vs. 1-Year Harvest Pass */}
        <div className="flex flex-wrap items-center gap-2 bg-slate-100 p-1 rounded-xl shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab("instant")}
            className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === "instant"
                ? "bg-white text-slate-900 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Clock className="w-3.5 h-3.5 text-amber-600" />
            15-Min Instant Delivery
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("harvest-pass")}
            className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === "harvest-pass"
                ? "bg-emerald-700 text-white shadow-xs"
                : "text-emerald-800 hover:text-emerald-950"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            1-Year Harvest Pass Importer
          </button>
        </div>
      </div>

      {/* VIEW 1: 1-YEAR HARVEST PASS IMPORTER */}
      {activeTab === "harvest-pass" ? (
        <div className="max-w-4xl mx-auto space-y-6">
          <HarvestPassImporter onHarvestPassLocked={onHarvestPassLocked} />
        </div>
      ) : (
        /* VIEW 2: 15-MINUTE QUICK-COMMERCE STOREFRONT */
        <div className="space-y-8">
          {/* Live 15-Minute Delivery SLA Selector & Quick Promotion Strip */}
          <div className="bg-amber-50/70 border border-amber-200/80 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs text-amber-900 font-bold font-mono tabular-nums">
                  ⚡ {selectedZone.mins} mins to {selectedZone.name}
                </div>
                <div className="text-xs text-amber-700">
                  Dark Store #03 · Cold Chain Direct from Peri-Urban Godowns
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-600 hidden sm:inline">Delivery Zone:</span>
              <select
                aria-label="Select urban delivery zone"
                value={selectedZone.name}
                onChange={(e) => {
                  const map: Record<string, number> = {
                    "Jubilee Hills": 14,
                    "Banjara Hills": 12,
                    "Gachibowli": 15,
                    "Madhapur": 13,
                  };
                  setSelectedZone({ name: e.target.value, mins: map[e.target.value] || 14 });
                }}
                className="border border-slate-300 rounded-lg px-3 py-1.5 text-xs font-semibold text-slate-800 bg-white"
              >
                <option value="Jubilee Hills">Jubilee Hills (14 mins)</option>
                <option value="Banjara Hills">Banjara Hills (12 mins)</option>
                <option value="Madhapur">Madhapur (13 mins)</option>
                <option value="Gachibowli">Gachibowli (15 mins)</option>
              </select>
            </div>
          </div>

          {/* Category Filter Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-1 p-1 bg-slate-200/70 rounded-lg">
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-md text-xs font-semibold transition-colors whitespace-nowrap ${
                    selectedCategory === cat
                      ? "bg-white text-slate-900 shadow-xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="text-xs text-slate-600">
              Showing <span className="font-mono font-semibold">{filteredProducts.length}</span> farm-traceable lots harvested within the last 9–36 hours
            </div>
          </div>

          {/* Main Storefront Grid + Sticky Cart & Impact Breakdown */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Product Cards Grid */}
            <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className="bg-white rounded-xl border border-slate-200 overflow-hidden flex flex-col justify-between transition-transform duration-150 hover:-translate-y-0.5"
                >
                  <div>
                    <div className="relative h-48 bg-slate-100 overflow-hidden">
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/75 via-black/35 to-transparent p-3 flex items-end justify-between text-white">
                        <span className="text-xs font-medium">
                          {product.verificationTag} · Save {product.savingsPercent}%
                        </span>
                        <span className="text-xs font-mono tabular-nums">
                          Harvested {product.harvestHoursAgo}h ago
                        </span>
                      </div>
                    </div>

                    <div className="p-5 space-y-2.5">
                      <div className="text-xs text-slate-500">
                        {product.category} · {product.weightLabel} · +{product.farmerEarningBoostPercent}% Farmer Net Share
                      </div>

                      <h3 className="font-bold text-slate-900 text-base leading-snug">
                        {product.name}
                      </h3>

                      <p className="text-xs text-slate-600 leading-relaxed">
                        Harvested {product.harvestHoursAgo} hours ago by{" "}
                        <strong className="text-slate-800">{product.farmerName}</strong> ({product.farmerVillage}). {product.subtitle}.
                      </p>

                      <div className="pt-1">
                        <button
                          type="button"
                          onClick={() => setTraceProduct(product)}
                          className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 hover:text-emerald-900 underline"
                        >
                          <QrCode className="w-3.5 h-3.5" />
                          Inspect Farm-to-Doorstep Traceability Passport
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="px-5 pb-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                    <div className="font-mono tabular-nums">
                      <span className="text-xl font-bold text-emerald-700">
                        ₹{product.priceInr}
                      </span>{" "}
                      <span className="text-xs text-slate-400 line-through">
                        ₹{product.mrpInr}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleAddToCart(product)}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap"
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Right Column: Live 15-Min Express Basket & Closed-Loop Economics */}
            <div className="lg:col-span-4 bg-white border border-slate-200 rounded-xl p-5 space-y-5 sticky top-6">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <div className="flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-emerald-700" />
                  <h3 className="font-bold text-slate-900 text-base">
                    Express 15-Min Basket
                  </h3>
                </div>
                <span className="text-xs font-mono tabular-nums text-slate-500">
                  SLA: {selectedZone.mins} mins
                </span>
              </div>

              {orderConfirmed ? (
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 space-y-3">
                  <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    Order {orderConfirmed.orderId} Dispatched!
                  </div>
                  <p className="text-xs text-emerald-900 leading-relaxed">
                    Rider picking up from {selectedZone.name} Dark Store #03. Estimated doorstep arrival in{" "}
                    <strong className="font-mono">{selectedZone.mins} minutes</strong>.
                  </p>
                  <div className="border-t border-emerald-200 pt-2 space-y-1 text-xs font-mono tabular-nums text-emerald-900">
                    <div className="flex justify-between">
                      <span>Total Paid:</span>
                      <span className="font-bold">₹{orderConfirmed.totalPaid}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Consumer Savings (-20%):</span>
                      <span className="font-bold">₹{orderConfirmed.totalSaved}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Credited to FPC Farmers:</span>
                      <span className="font-bold">₹{orderConfirmed.farmerShareInr}</span>
                    </div>
                  </div>
                </div>
              ) : cart.length === 0 ? (
                <div className="py-8 text-center space-y-2">
                  <p className="text-sm font-medium text-slate-700">Your Express basket is empty</p>
                  <p className="text-xs text-slate-500">
                    Add farm-traceable produce to see your 20% savings and direct farmer payout share.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="divide-y divide-slate-200">
                    {cart.map((item) => (
                      <div key={item.product.id} className="py-3 flex items-center justify-between gap-3">
                        <div className="min-w-0">
                          <div className="text-sm font-semibold text-slate-900 truncate">
                            {item.product.name}
                          </div>
                          <div className="text-xs text-slate-500 font-mono tabular-nums">
                            ₹{item.product.priceInr} × {item.quantity} ({item.product.weightLabel})
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5 shrink-0">
                          <button
                            type="button"
                            aria-label="Decrease quantity"
                            onClick={() => handleUpdateQty(item.product.id, -1)}
                            className="w-7 h-7 rounded-md border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-100"
                          >
                            {item.quantity === 1 ? (
                              <Trash2 className="w-3.5 h-3.5 text-red-500" />
                            ) : (
                              <Minus className="w-3.5 h-3.5" />
                            )}
                          </button>
                          <span className="w-6 text-center text-xs font-mono tabular-nums font-semibold">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            aria-label="Increase quantity"
                            onClick={() => handleUpdateQty(item.product.id, 1)}
                            className="w-7 h-7 rounded-md border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-100"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Economic Value Breakdown */}
                  <div className="bg-slate-50 border border-slate-200 rounded-lg p-3.5 space-y-2 text-xs">
                    <div className="font-semibold text-slate-800">
                      Closed-Loop Value Transparency
                    </div>
                    <div className="flex justify-between text-slate-600 font-mono tabular-nums">
                      <span>Traditional Retail MRP:</span>
                      <span className="line-through">₹{mrpTotalInr}</span>
                    </div>
                    <div className="flex justify-between text-emerald-700 font-semibold font-mono tabular-nums">
                      <span>Your Express Savings (~20%):</span>
                      <span>-₹{totalSavedInr}</span>
                    </div>
                    <div className="flex justify-between text-slate-700 font-mono tabular-nums">
                      <span>Direct FPC Farmer Share (+35% boost):</span>
                      <span className="font-semibold">₹{directFarmerPayoutInr}</span>
                    </div>
                    <div className="border-t border-slate-200 pt-2 flex justify-between text-sm font-bold text-slate-900 font-mono tabular-nums">
                      <span>Total Payable (Free 15m Delivery):</span>
                      <span>₹{subtotalInr}</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleInstantCheckout}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2.5 px-4 rounded-lg text-sm transition-colors"
                  >
                    Place 15-Minute Express Order (₹{subtotalInr})
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Farm-to-Doorstep Traceability Modal */}
      {traceProduct && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-xl max-w-xl w-full p-6 space-y-5 shadow-xl">
            <div className="flex items-start justify-between gap-4 border-b border-slate-200 pb-4">
              <div>
                <div className="text-xs font-semibold text-emerald-700">
                  Blockchain & IoT Verified Farm-to-Doorstep Ledger
                </div>
                <h3 className="text-lg font-bold text-slate-900 mt-0.5">
                  {traceProduct.name} ({traceProduct.weightLabel})
                </h3>
              </div>
              <button
                type="button"
                aria-label="Close traceability passport"
                onClick={() => setTraceProduct(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-3.5 space-y-1">
                <div className="flex items-center gap-1.5 font-semibold text-slate-900">
                  <UserCheck className="w-4 h-4 text-emerald-700" />
                  Cultivator & FPC Source
                </div>
                <div className="text-slate-700 font-medium">{traceProduct.farmerName}</div>
                <div className="text-slate-500">{traceProduct.farmerVillage}</div>
                <div className="text-emerald-700 font-medium">{traceProduct.fpcName}</div>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-lg p-3.5 space-y-1">
                <div className="flex items-center gap-1.5 font-semibold text-slate-900">
                  <Clock className="w-4 h-4 text-amber-600" />
                  Harvest & Cold-Chain SLA
                </div>
                <div className="text-slate-700 font-mono tabular-nums">
                  Harvested: {traceProduct.harvestTimestamp} ({traceProduct.harvestHoursAgo}h ago)
                </div>
                <div className="text-slate-500">{traceProduct.godownHubId}</div>
                <div className="text-amber-700 font-medium">
                  Delivery SLA: {selectedZone.mins} mins to {selectedZone.name}
                </div>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-lg p-3.5 space-y-1">
                <div className="flex items-center gap-1.5 font-semibold text-slate-900">
                  <Sprout className="w-4 h-4 text-emerald-700" />
                  AI Soil & Organic Verification
                </div>
                <div className="text-slate-700 font-medium">{traceProduct.soilMineralIndex}</div>
                <div className="text-slate-500">
                  Remediation: {traceProduct.organicProtocolUsed}
                </div>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-lg p-3.5 space-y-1">
                <div className="flex items-center gap-1.5 font-semibold text-slate-900">
                  <ThermometerSnowflake className="w-4 h-4 text-blue-600" />
                  Disintermediated Economics
                </div>
                <div className="text-emerald-700 font-semibold font-mono tabular-nums">
                  Consumer Price: ₹{traceProduct.priceInr} (-{traceProduct.savingsPercent}% vs Retail)
                </div>
                <div className="text-slate-600 font-mono tabular-nums">
                  Farmer Net Earnings: +{traceProduct.farmerEarningBoostPercent}% above Mandi
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setTraceProduct(null)}
                className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-100"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  handleAddToCart(traceProduct);
                  setTraceProduct(null);
                }}
                className="px-4 py-2 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                Add Verified Lot to Basket (₹{traceProduct.priceInr})
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
