"use client";

import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts";

interface Medicine {
  _id: string;
  brandName: string;
  totalStock: number;
}

interface OrderStatusData {
  name: string;
  value: number;
}

export default function PerformanceMatrix() {
  const [inventoryData, setInventoryData] = useState<Medicine[]>([]);
  const [orderStatusData, setOrderStatusData] = useState<OrderStatusData[]>([]);

  useEffect(() => {
    fetch("/api/vendor-inventory")
      .then((res) => res.json())
      .then((data) => {
        const simplified = data.map((med: any) => ({
          _id: med._id,
          brandName: med.brandName,
          totalStock: med.totalStock,
        }));
        setInventoryData(simplified);
      })
      .catch((err) => console.error("Failed to load inventory data", err));

    const fetchOrders = async () => {
      try {
        const resPending = await fetch("/api/vendor-received-orders");
        const pendingOrders = resPending.ok ? await resPending.json() : [];

        const resDispatched = await fetch("/api/vendor-request-delivery");
        const dispatchedOrders = resDispatched.ok ? await resDispatched.json() : [];

        const resDelivered = await fetch("/api/vendor-invoice");
        const deliveredOrders = resDelivered.ok ? await resDelivered.json() : [];

        setOrderStatusData([
          { name: "Pending", value: pendingOrders.length },
          { name: "Dispatched", value: dispatchedOrders.length },
          { name: "Delivered", value: deliveredOrders.length },
        ]);
      } catch (err) {
        console.error("Failed to fetch orders", err);
      }
    };

    fetchOrders();
  }, []);

  const COLORS = ["#fbbf24", "#818cf8", "#34d399"];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-indigo-50 p-6">
      <h1 className="text-4xl md:text-5xl font-extrabold text-center text-indigo-700 mb-12 drop-shadow-sm tracking-tight">
         Performance Matrix
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Stock Levels */}
        <div className="bg-white/70 backdrop-blur-md shadow-2xl border border-blue-200 rounded-3xl p-8 transition hover:scale-[1.01] duration-300 ease-in-out">
          <h2 className="text-xl md:text-2xl font-bold text-blue-800 mb-6 border-b border-blue-200 pb-2">
             Stock Levels by Medicine
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={inventoryData} margin={{ top: 10, right: 20, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="4 4" stroke="#d1d5db" />
              <XAxis dataKey="brandName" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip contentStyle={{ fontSize: "14px", borderRadius: "8px" }} />
              <Legend wrapperStyle={{ fontSize: "14px" }} />
              <Bar dataKey="totalStock" fill="#6366f1" radius={[10, 10, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Order Status */}
        <div className="bg-white/70 backdrop-blur-md shadow-2xl border border-blue-200 rounded-3xl p-8 transition hover:scale-[1.01] duration-300 ease-in-out">
          <h2 className="text-xl md:text-2xl font-bold text-blue-800 mb-6 border-b border-blue-200 pb-2">
             Order Status Overview
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={orderStatusData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                labelLine={false}
                label={({ name, percent }) => `${name} (${((percent || 0) * 100).toFixed(0)}%)`}
              >
                {orderStatusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ fontSize: "14px", borderRadius: "8px" }} />
              <Legend wrapperStyle={{ fontSize: "14px" }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
