"use client";
import { signOut } from "next-auth/react";
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/ui/card";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/app/ui/table";
import Link from "next/link";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Legend,
} from "recharts";
import { Menu, Transition } from "@headlessui/react";
import { Fragment } from "react";
import {
  ChevronDownIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  UserIcon,
  CogIcon,
  ArrowRightIcon,
  ArrowLeftIcon,
  MagnifyingGlassIcon, // replaces SearchIcon
  ArrowRightIcon as ArrowRightIcon24,
  ArrowLeftIcon as ArrowLeftIcon24,
} from "@heroicons/react/24/outline";
import { PowerIcon } from "@heroicons/react/24/solid"; // Use solid icon for logout

// ... (keep all your existing interfaces)

interface Stat {
  medicineId: string;
  brandName: string;
  totalSold: number;
  totalStock: number;
}

interface HospitalOrder {
  _id: string;
  orderId: string;
  medicineName: string;
  quantity: number;
  deliveryDate: string;
  manufacturerStatus: string;
}

interface DailyUsage {
  brandName: string;
  date: string;
  sold: number;
}

export default function HospitalDashboard() {
  const [searchTerm, setSearchTerm] = useState("");
  const [medicines, setMedicines] = useState<Stat[]>([]);
  const [recentOrders, setRecentOrders] = useState<HospitalOrder[]>([]);
  const [totalMedicines, setTotalMedicines] = useState(0);
  const [lowStockCount, setLowStockCount] = useState(0);
  const [criticalCount, setCriticalCount] = useState(0);
  const [inventoryValue, setInventoryValue] = useState(0);
  const [todaySalesValue, setTodaySold] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);
  const [pendingOrders, setPendingOrders] = useState(0);
  const [dailyUsageData, setDailyUsageData] = useState<DailyUsage[]>([]);
  const [unconfirmedPODs, setUnconfirmedPODs] = useState<number>(0);
  const [feedbackText, setFeedbackText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");
  const trackRef = useRef<HTMLDivElement>(null);
  const [sliderPos, setSliderPos] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  const getUrgency = (stock: number) => {
    if (stock === 0) return "Critical";
    if (stock > 0 && stock < 10) return "Low";
    if (stock < 20) return "Medium";
    return "High";
  };

  const urgencyColors = {
    Critical: "bg-red-600",
    Low: "bg-orange-500",
    Medium: "bg-yellow-400",
    High: "bg-green-500",
  };

  const urgencyTextColors = {
    Critical: "text-red-600",
    Low: "text-orange-500",
    Medium: "text-yellow-500",
    High: "text-green-500",
  };

  const urgencyTips = {
    Critical: "Out of stock: Urgent restocking required.",
    Low: "Critical: Immediate attention needed.",
    Medium: "Monitor: Stock is getting low.",
    High: "Healthy: Stock is sufficient.",
  };

  useEffect(() => {
    axios.get("/api/hospital-consumption").then((res) => {
      setMedicines(res.data);
      setTotalMedicines(res.data.length);
      const critical = res.data.filter(
        (m: Stat) => getUrgency(m.totalStock) === "Critical"
      );
      const low = res.data.filter(
        (m: Stat) => getUrgency(m.totalStock) === "Low"
      );
      setCriticalCount(critical.length);
      setLowStockCount(low.length);
    });

    axios.get("/api/hospital-orders").then((res) => {
      const allOrders: HospitalOrder[] = res.data;
      setTotalOrders(allOrders.length);
      const pending = allOrders.filter(
        (o) =>
          !o.manufacturerStatus ||
          o.manufacturerStatus.toLowerCase() === "pending"
      );
      setPendingOrders(pending.length);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const todayOrders = allOrders.filter((order) => {
        const deliveryDate = new Date(order.deliveryDate);
        return (
          deliveryDate >= today &&
          deliveryDate < new Date(today.getTime() + 24 * 60 * 60 * 1000)
        );
      });
      setRecentOrders(todayOrders);
    });

    fetch("/api/hospital-inventory-value")
      .then(async (res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch inventory value");
        }
        const data = await res.json();
        console.log("Inventory API response", data);
        setInventoryValue(data.totalInventoryValue || 0);
      })
      .catch((err) => {
        console.error("Inventory value error", err);
      });

    axios.get("/api/hospital-today-sold-value").then((res) => {
      setTodaySold(res.data.totalTodayValue || 0);
    });

    axios.get("/api/hospital-daily-usage").then((res) => {
      const data: DailyUsage[] = res.data;
      const today = new Date();
      const tenDaysAgo = new Date();
      tenDaysAgo.setDate(today.getDate() - 9);
      const filtered = data.filter(({ date }) => {
        const d = new Date(date);
        return d >= tenDaysAgo && d <= today;
      });
      setDailyUsageData(filtered);
    });

    const fetchPODConfirmation = async () => {
      try {
        const [ordersRes, podsRes] = await Promise.all([
          axios.get("/api/hospital-orders"),
          axios.get("/api/fetch_uploaded_pods"),
        ]);
        const deliveredOrders = ordersRes.data.filter(
          (o: any) => o.manufacturerStatus === "Delivered"
        );
        const uploadedOrderIds = podsRes.data.map((p: any) => p.orderId);
        const missingPODs = deliveredOrders.filter(
          (o: any) => !uploadedOrderIds.includes(o.orderId)
        );
        setUnconfirmedPODs(missingPODs.length);
      } catch (err) {
        console.error("Error fetching POD confirmations", err);
      }
    };

    fetchPODConfirmation();
  }, []);
  const totalPages = Math.ceil(recentOrders.length / itemsPerPage);
  const paginatedOrders = recentOrders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleMouseDown = (e: React.MouseEvent) => {
    const move = (event: MouseEvent) => {
      if (!trackRef.current) return;
      const rect = trackRef.current.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const ratio = x / rect.width;
      if (ratio <= 0.25) setSliderPos(0);
      else if (ratio <= 0.5) setSliderPos(1);
      else if (ratio <= 0.75) setSliderPos(2);
      else setSliderPos(3);
    };
    const stop = () => {
      document.removeEventListener("mousemove", move);
      document.removeEventListener("mouseup", stop);
    };
    document.addEventListener("mousemove", move);
    document.addEventListener("mouseup", stop);
  };

  const urgencyLevel = ["Critical", "Low", "Medium", "High"][sliderPos];
  const filteredBySearch = medicines.filter((med) =>
    med.brandName.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const displayedMeds = searchTerm
    ? filteredBySearch
    : medicines.filter((m) => getUrgency(m.totalStock) === urgencyLevel);

  const groupedData = Object.values(
    dailyUsageData.reduce(
      (acc, { brandName, date, sold }) => {
        acc[date] = acc[date] || { date };
        acc[date][brandName] = sold;
        return acc;
      },
      {} as Record<string, Record<string, any>>
    )
  ).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const allBrands = [...new Set(dailyUsageData.map((d) => d.brandName))];
  const topDrugs = Object.values(
    dailyUsageData.reduce(
      (acc, { brandName, sold }) => {
        if (!acc[brandName]) acc[brandName] = { brandName, sold: 0 };
        acc[brandName].sold += sold;
        return acc;
      },
      {} as Record<string, { brandName: string; sold: number }>
    )
  )
    .sort((a, b) => b.sold - a.sold)
    .slice(0, 5);

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-6">
        {/* Dashboard Header */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800">
            Dashboard Overview
          </h2>
          <p className="text-gray-500">
            Monitor your pharmacy operations at a glance
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          {[
            {
              title: " Types of  Medicines",
              value: totalMedicines,
              change: "+12%",
              trend: "up",
              icon: "💊",
              bg: "bg-blue-50",
              text: "text-blue-600",
            },
            {
              title: "Critical Alerts",
              value: criticalCount,
              change: "+5%",
              trend: "up",
              icon: "⚠️",
              bg: "bg-red-50",
              text: "text-red-600",
            },
            {
              title: "Low Stock Items",
              value: lowStockCount,
              change: "+3%",
              trend: "up",
              icon: "📉",
              bg: "bg-orange-50",
              text: "text-orange-600",
            },
            {
              title: "Inventory Value",
              value: `₹${inventoryValue.toFixed(2)}`,
              change: "+8%",
              trend: "up",
              icon: "💰",
              bg: "bg-green-50",
              text: "text-green-600",
            },
            {
              title: "Pending Orders",
              value: pendingOrders,
              change: "-2%",
              trend: "down",
              icon: "📦",
              bg: "bg-orange-50",
              text: "text-orange-600",
            },
            {
              title: "Total Orders",
              value: totalOrders,
              change: "+7%",
              trend: "up",
              icon: "🧾",
              bg: "bg-yellow-50",
              text: "text-yellow-600",
            },
            {
              title: "Unconfirmed PODs",
              value: unconfirmedPODs,
              change: "+2%",
              trend: "up",
              icon: "📄",
              bg: "bg-green-50",
              text: "text-green-600",
            },
            {
              title: "Today's Sold",
              value: `₹${todaySalesValue.toFixed(2)}`,
              change: "+4%",
              trend: "up",
              icon: "📈",
              bg: "bg-blue-50",
              text: "text-blue-600",
            },
          ].map((stat, i) => (
            <div
              key={i}
              className={`${stat.bg} rounded-xl p-5 shadow-xs border border-gray-100 hover:shadow-sm transition-shadow`}
            >
              <div className="flex justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    {stat.title}
                  </p>
                  <p className={`text-2xl font-bold mt-1 ${stat.text}`}>
                    {stat.value}
                  </p>
                </div>
                <div className="text-2xl">{stat.icon}</div>
              </div>
              <div
                className={`mt-3 flex items-center text-xs font-medium ${stat.trend === "up" ? "text-green-600" : "text-red-600"}`}
              >
                {stat.trend === "up" ? (
                  <ArrowUpIcon className="h-3 w-3 mr-1" />
                ) : (
                  <ArrowDownIcon className="h-3 w-3 mr-1" />
                )}
                <span>{stat.change} from last month</span>
              </div>
            </div>
          ))}
        </div>

        {/* Main Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Drug Request Card */}
          <div className="lg:col-span-1 bg-white rounded-xl p-6 shadow-xs border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-800">
                Inventory Status
              </h3>
            </div>

            <div className="mb-6">
              <div className="text-sm text-gray-600 mb-4 bg-blue-50 p-3 rounded-lg border border-blue-100">
                <span className="font-medium text-blue-600">Tip:</span>{" "}
                {urgencyTips[urgencyLevel as keyof typeof urgencyTips]}
              </div>

              <div className="mb-5">
                <div className="flex justify-between text-xs px-2 mb-1 text-gray-500">
                  <span>Critical</span>
                  <span>Low</span>
                  <span>Medium</span>
                  <span>High</span>
                </div>
                <div
                  ref={trackRef}
                  className="relative h-2 bg-gray-200 rounded-full cursor-pointer"
                >
                  <div
                    className={`absolute h-2 rounded-full ${urgencyColors[urgencyLevel as keyof typeof urgencyColors]}`}
                    style={{
                      width: `${(sliderPos / 3) * 100}%`,
                      transition: "width 0.2s ease",
                    }}
                  />
                  <div
                    className="absolute -top-1.5 w-5 h-5 bg-white border-2 border-gray-300 rounded-full shadow-sm cursor-pointer transition-all duration-200 hover:shadow-md"
                    style={{
                      left: `${(sliderPos / 3) * 100}%`,
                      transform: "translate(-50%, 0)",
                    }}
                    onMouseDown={handleMouseDown}
                  />
                </div>
              </div>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search drug..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full border border-gray-300 pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="space-y-3 max-h-96 overflow-y-auto pr-2 custom-scroll">
              {displayedMeds.map((med) => {
                const urgency = getUrgency(med.totalStock);
                return (
                  <div
                    key={med.medicineId}
                    className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition hover:shadow-xs"
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium text-gray-800">
                          {med.brandName}
                        </p>
                        <div className="flex items-center space-x-2 text-sm text-gray-600 mt-1">
                          <span>Stock: {med.totalStock}</span>
                          <span
                            className={`text-xs font-medium px-2 py-0.5 rounded-full ${urgencyTextColors[urgency]} bg-opacity-10 ${urgencyColors[urgency]}`}
                          >
                            {urgency}
                          </span>
                        </div>
                      </div>
                      <Link href="/pharmacy/orderdrugs">
                        <button className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-lg text-sm transition flex items-center shadow-xs hover:shadow-sm">
                          Order
                          <ArrowRightIcon className="h-4 w-4 ml-1" />
                        </button>
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Recent Orders and Analytics */}
          <div className="lg:col-span-2 space-y-6">
            {/* Recent Orders */}
            <div className="bg-white rounded-xl p-6 shadow-xs border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-800">
                  Recent Orders
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Order ID
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Medicine
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Qty
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {paginatedOrders.map((order) => (
                      <tr key={order._id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                          {order.orderId}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                          {order.medicineName}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                          {order.quantity}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm">
                          <span
                            className={`px-2 py-1 rounded-full text-xs ${
                              order.manufacturerStatus === "Delivered"
                                ? "bg-green-100 text-green-800"
                                : order.manufacturerStatus === "Pending"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-blue-100 text-blue-800"
                            }`}
                          >
                            {order.manufacturerStatus || "Pending"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="flex justify-between items-center mt-4">
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(prev - 1, 1))
                    }
                    disabled={currentPage === 1}
                    className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg disabled:opacity-50 flex items-center"
                  >
                    <ArrowLeftIcon className="h-4 w-4 mr-1" />
                    Previous
                  </button>
                  <span className="text-sm text-gray-600">
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                    }
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg disabled:opacity-50 flex items-center"
                  >
                    Next
                    <ArrowRightIcon className="h-4 w-4 ml-1" />
                  </button>
                </div>
              </div>
            </div>

            {/* Analytics */}
            <div className="bg-white rounded-xl p-6 shadow-xs border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-800">
                  Drug Analytics
                </h3>
                <div className="text-sm text-blue-600">Last 10 days</div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={groupedData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                      <XAxis dataKey="date" stroke="#6b7280" />
                      <YAxis stroke="#6b7280" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "white",
                          borderColor: "#e5e7eb",
                          color: "#1f2937",
                          borderRadius: "0.5rem",
                          boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
                          borderWidth: "1px",
                        }}
                      />
                      <Legend />
                      {allBrands.map((drug, index) => (
                        <Line
                          key={drug}
                          type="monotone"
                          dataKey={drug}
                          stroke={
                            [
                              "#3b82f6",
                              "#10b981",
                              "#f59e0b",
                              "#ef4444",
                              "#6366f1",
                            ][index % 5]
                          }
                          strokeWidth={2}
                          dot={{ r: 3 }}
                          activeDot={{ r: 5 }}
                        />
                      ))}
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={topDrugs}
                      layout="vertical"
                      margin={{ top: 15, right: 20, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                      <XAxis type="number" stroke="#6b7280" />
                      <YAxis
                        dataKey="brandName"
                        type="category"
                        width={80}
                        stroke="#6b7280"
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "white",
                          borderColor: "#e5e7eb",
                          color: "#1f2937",
                          borderRadius: "0.5rem",
                          boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
                          borderWidth: "1px",
                        }}
                      />
                      <Bar
                        dataKey="sold"
                        fill="#3b82f6"
                        radius={[0, 2, 2, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Feedback Section */}
        <div className="bg-white rounded-xl p-6 shadow-xs border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Send Feedback
          </h3>
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              if (!feedbackText.trim()) return;
              setSubmitting(true);
              try {
                await axios.post("/api/pharmacy/feedback", {
                  message: feedbackText,
                });
                setFeedbackText("");
                setSubmitStatus("success");
              } catch (err) {
                console.error("Error submitting feedback", err);
                setSubmitStatus("error");
              } finally {
                setSubmitting(false);
              }
            }}
          >
            <textarea
              value={feedbackText}
              onChange={(e) => setFeedbackText(e.target.value)}
              rows={4}
              placeholder="Enter your feedback or concern..."
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <div className="mt-4 flex items-center">
              <button
                type="submit"
                disabled={submitting}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition disabled:opacity-50 flex items-center shadow-xs hover:shadow-sm"
              >
                {submitting ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Sending...
                  </>
                ) : (
                  "Send Feedback"
                )}
              </button>
              {submitStatus === "success" && (
                <span className="ml-3 text-green-600 text-sm flex items-center">
                  <svg
                    className="h-4 w-4 mr-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  Feedback sent successfully!
                </span>
              )}
              {submitStatus === "error" && (
                <span className="ml-3 text-red-600 text-sm flex items-center">
                  <svg
                    className="h-4 w-4 mr-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                  Failed to send feedback. Please try again.
                </span>
              )}
            </div>
          </form>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-6 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <p className="text-sm text-gray-500">
                © {new Date().getFullYear()} PharmaTrack. All rights reserved.
              </p>
            </div>
            <div className="flex space-x-6">
              <a href="#" className="text-sm text-gray-500 hover:text-gray-700">
                Terms
              </a>
              <a href="#" className="text-sm text-gray-500 hover:text-gray-700">
                Privacy
              </a>
              <a href="#" className="text-sm text-gray-500 hover:text-gray-700">
                Contact
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
