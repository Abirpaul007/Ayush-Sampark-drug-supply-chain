"use client";

import { useState } from "react";
import { 
  MapPin, 
  Pill, 
  TrendingUp, 
  Calendar, 
  AlertCircle, 
  CheckCircle2,
  BarChart3,
  Package,
  Sparkles
} from "lucide-react";

const REGIONS = [
  "Kolkata","Delhi","Mumbai","Chennai",
  "Bengaluru","Hyderabad","Pune","Ahmedabad"
];

const DRUGS = [
  "Paracetamol 500mg","Amoxicillin 250mg","Azithromycin 500mg",
  "Cetirizine 10mg","Clopidogrel","Metformin 500mg",
  "Insulin Injection","Aspirin 75mg","Pantoprazole 40mg",
  "Ibuprofen 400mg","Vitamin C Tablets","Omeprazole",
  "Doxycycline 100mg","Salbutamol Inhaler","Losartan 50mg"
];

interface PredictionResult {
  annual_demand: number;
  tender_quantity: number;
  monthly_forecast: number[];
  confidence: number;
}

export default function TenderPredictionPage() {
  const [region, setRegion] = useState("");
  const [drug, setDrug] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [error, setError] = useState("");

  const handlePredict = async () => {
    if (!region || !drug) {
      setError("Please select both region and drug");
      return;
    }

    setError("");
    setLoading(true);
    setResult(null);

    try {
      // 1️⃣ Get last 12 months history
      const historyRes = await fetch(
        `/api/tender-predict-table?region=${region}&drug=${drug}`
      );
      const { history } = await historyRes.json();

      if (!history || history.length < 12) {
        throw new Error("Insufficient historical data (min 12 months required)");
      }

      // 2️⃣ Call FastAPI
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_FASTAPI_URL}/predict-tender`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            region,
            drug,
            history,
            year: new Date().getFullYear(),
            month: new Date().getMonth() + 1,
          }),
        }
      );

      const data = await res.json();
      setResult(data);
    } catch (err: any) {
      setError(err.message || "Prediction failed");
    } finally {
      setLoading(false);
    }
  };

  const getMonthName = (index) => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return months[index];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6 flex justify-center items-center">
      <div className="w-full max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl shadow-lg mb-4">
            <BarChart3 className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Drug Tender Prediction
          </h1>
          <p className="text-gray-600">AI-powered demand forecasting for pharmaceutical procurement</p>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          {/* Input Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Region Select */}
            <div className="relative">
              <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                <MapPin className="w-4 h-4 mr-2 text-blue-600" />
                Select Region
              </label>
              <div className="relative">
                <select
                  value={region}
                  onChange={(e) => setRegion(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg p-3 pl-10 appearance-none bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all cursor-pointer hover:border-gray-400"
                >
                  <option value="">Choose a region...</option>
                  {REGIONS.map((r) => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* Drug Select */}
            <div className="relative">
              <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                <Pill className="w-4 h-4 mr-2 text-purple-600" />
                Select Drug
              </label>
              <div className="relative">
                <select
                  value={drug}
                  onChange={(e) => setDrug(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg p-3 pl-10 appearance-none bg-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all cursor-pointer hover:border-gray-400"
                >
                  <option value="">Choose a drug...</option>
                  {DRUGS.map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
                <Pill className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Predict Button */}
          <button
            onClick={handlePredict}
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 group"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Analyzing Data...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 group-hover:scale-110 transition-transform" />
                <span>Predict Demand</span>
              </>
            )}
          </button>

          {/* Error Message */}
          {error && (
            <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          )}

          {/* Results Section */}
          {result && (
            <div className="mt-8 space-y-6 animate-fadeIn">
              {/* Success Header */}
              <div className="flex items-center space-x-2 text-green-700">
                <CheckCircle2 className="w-6 h-6" />
                <h2 className="text-xl font-semibold">Prediction Complete</h2>
              </div>

              {/* Key Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Annual Demand */}
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-5 border border-blue-200">
                  <div className="flex items-center justify-between mb-2">
                    <TrendingUp className="w-5 h-5 text-blue-600" />
                    <span className="text-xs font-medium text-blue-700 bg-blue-200 px-2 py-1 rounded-full">
                      Annual
                    </span>
                  </div>
                  <p className="text-sm text-blue-700 mb-1">Annual Demand</p>
                  <p className="text-3xl font-bold text-blue-900">
                    {result.annual_demand.toLocaleString()}
                  </p>
                  <p className="text-xs text-blue-600 mt-1">units/year</p>
                </div>

                {/* Tender Quantity */}
                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-5 border border-green-200">
                  <div className="flex items-center justify-between mb-2">
                    <Package className="w-5 h-5 text-green-600" />
                    <span className="text-xs font-medium text-green-700 bg-green-200 px-2 py-1 rounded-full">
                      Recommended
                    </span>
                  </div>
                  <p className="text-sm text-green-700 mb-1">Tender Quantity</p>
                  <p className="text-3xl font-bold text-green-900">
                    {result.tender_quantity.toLocaleString()}
                  </p>
                  <p className="text-xs text-green-600 mt-1">units to procure</p>
                </div>

                {/* Confidence */}
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-5 border border-purple-200">
                  <div className="flex items-center justify-between mb-2">
                    <BarChart3 className="w-5 h-5 text-purple-600" />
                    <span className="text-xs font-medium text-purple-700 bg-purple-200 px-2 py-1 rounded-full">
                      Accuracy
                    </span>
                  </div>
                  <p className="text-sm text-purple-700 mb-1">Confidence</p>
                  <p className="text-3xl font-bold text-purple-900">
                    {(result.confidence * 100).toFixed(1)}%
                  </p>
                  <div className="w-full bg-purple-200 rounded-full h-2 mt-2">
                    <div 
                      className="bg-purple-600 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${result.confidence * 100}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Monthly Forecast */}
              <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                <div className="flex items-center space-x-2 mb-4">
                  <Calendar className="w-5 h-5 text-gray-700" />
                  <h3 className="text-lg font-semibold text-gray-800">Monthly Forecast</h3>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                  {result.monthly_forecast.map((value, index) => (
                    <div
                      key={index}
                      className="bg-white rounded-lg p-3 border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all"
                    >
                      <p className="text-xs font-medium text-gray-500 mb-1">
                        {getMonthName(index)}
                      </p>
                      <p className="text-lg font-bold text-gray-800">
                        {value.toLocaleString()}
                      </p>
                      <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
                        <div 
                          className="bg-gradient-to-r from-blue-500 to-indigo-500 h-1.5 rounded-full"
                          style={{ width: `${(value / Math.max(...result.monthly_forecast)) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <p className="text-center text-gray-500 text-sm mt-6">
          Powered by AI-driven forecasting algorithms
        </p>
      </div>
    </div>
  );
}