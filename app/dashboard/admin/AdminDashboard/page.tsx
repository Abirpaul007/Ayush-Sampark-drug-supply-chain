// ./app/dashboard/AdminDashboard.tsx
"use client";

import React, { useEffect, useState, useRef } from "react";
import * as echarts from "echarts";
import { WelcomeBanner } from "./WelcomeBanner";
import { QuickStatsCards } from "./QuickStatsCards";
import { PriorityAlerts } from "./PriorityAlerts";
import { 
  FiDownload, 
  FiFileText, 
  FiPieChart, 
  FiClock, 
  FiTruck, 
  FiAlertCircle,
  FiChevronLeft,
  FiChevronRight,
  FiPrinter,
  FiFile,
  FiFileText as FiFileText2,
  FiDatabase
} from "react-icons/fi";

interface Order {
  orderId: string;
  hospitalName: string;
  medicineName: string;
  manufacturerStatus: string;
}

interface DeliveryStatusData {
  name: string;
  value: number;
}

const AdminDashboard: React.FC = () => {
  const [orderRequests, setOrderRequests] = useState<Order[]>([]);
  const [reportType, setReportType] = useState("Inventory Status");
  const [avgDeliveryData, setAvgDeliveryData] = useState<number[]>([]);
  const [deliveryStatusData, setDeliveryStatusData] = useState<DeliveryStatusData[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const deliveryChartRef = useRef<echarts.ECharts | null>(null);
  const statusChartRef = useRef<echarts.ECharts | null>(null);

  const ORDERS_PER_PAGE = 10;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [ordersRes, chartRes] = await Promise.all([
          fetch("/api/admin-dash-orders"),
          fetch("/api/admin-chart-data")
        ]);
        
        if (!ordersRes.ok || !chartRes.ok) {
          throw new Error('Failed to fetch data');
        }
        
        const ordersData = await ordersRes.json();
        const chartData = await chartRes.json();
        
        if (ordersData.success) {
          setOrderRequests([...ordersData.hospitalOrders, ...ordersData.pharmacyOrders]);
        }
        
        if (chartData.success) {
          setAvgDeliveryData(chartData.avgDeliveryTime);
          setDeliveryStatusData(chartData.deliveryStatus);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
    
    return () => {
      deliveryChartRef.current?.dispose();
      statusChartRef.current?.dispose();
    };
  }, []);

  useEffect(() => {
    if (avgDeliveryData.length > 0 && deliveryStatusData.length > 0) {
      // Initialize or update delivery time chart
      if (!deliveryChartRef.current) {
        deliveryChartRef.current = echarts.init(document.getElementById("delivery-time-chart")!);
      }
      deliveryChartRef.current.setOption({
        tooltip: { trigger: "axis" },
        xAxis: { 
          type: "category", 
          data: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
          axisLabel: { color: "#6B7280" }
        },
        yAxis: { 
          type: "value", 
          name: "Hours",
          nameTextStyle: { color: "#6B7280" },
          axisLabel: { color: "#6B7280" }
        },
        series: [
          {
            type: "line",
            smooth: true,
            data: avgDeliveryData,
            lineStyle: { color: "#1E40AF", width: 3 },
            itemStyle: { color: "#1E40AF" },
            areaStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: 'rgba(30, 64, 175, 0.3)' },
                { offset: 1, color: 'rgba(30, 64, 175, 0.1)' }
              ])
            }
          },
        ],
        grid: {
          left: '10%',
          right: '10%',
          bottom: '15%',
          top: '20%'
        }
      });

      // Initialize or update delivery status chart
      if (!statusChartRef.current) {
        statusChartRef.current = echarts.init(document.getElementById("delays-chart")!);
      }
      statusChartRef.current.setOption({
        tooltip: { 
          trigger: "item",
          formatter: '{a} <br/>{b}: {c} ({d}%)'
        },
        legend: {
          orient: 'horizontal',
          bottom: 0,
          data: deliveryStatusData.map(item => item.name),
          textStyle: { color: "#6B7280" }
        },
        series: [
          {
            name: 'Delivery Status',
            type: "pie",
            radius: ["40%", "70%"],
            data: deliveryStatusData,
            avoidLabelOverlap: true,
            itemStyle: {
              borderRadius: 5,
              borderColor: '#fff',
              borderWidth: 2
            },
            label: { 
              show: false,
              position: 'center'
            },
            emphasis: {
              label: { 
                show: true, 
                fontSize: 14, 
                fontWeight: "bold",
                formatter: '{b}\n{c} ({d}%)'
              },
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            },
            labelLine: {
              show: false
            }
          },
        ],
        color: ['#10B981', '#F59E0B', '#EF4444', '#3B82F6', '#8B5CF6']
      });
    }

    const handleResize = () => {
      deliveryChartRef.current?.resize();
      statusChartRef.current?.resize();
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [avgDeliveryData, deliveryStatusData]);

  const startIndex = (currentPage - 1) * ORDERS_PER_PAGE;
  const currentOrders = orderRequests.slice(startIndex, startIndex + ORDERS_PER_PAGE);
  const totalPages = Math.ceil(orderRequests.length / ORDERS_PER_PAGE);

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return <FiClock className="text-yellow-500 mr-1" />;
      case 'shipped':
        return <FiTruck className="text-blue-500 mr-1" />;
      case 'delivered':
        return <FiFileText className="text-green-500 mr-1" />;
      case 'cancelled':
        return <FiAlertCircle className="text-red-500 mr-1" />;
      default:
        return <FiFileText className="text-gray-500 mr-1" />;
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-500 p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <FiAlertCircle className="h-5 w-5 text-red-500" />
          </div>
          <div className="ml-3">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <main className="pt-0 px-10 pb-8">
      

      <WelcomeBanner />
      <QuickStatsCards />
      <PriorityAlerts />

      {/* Order Requests Table */}
      <div className="bg-white rounded-xl shadow-sm border p-6 mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-800 flex items-center">
            <FiFileText className="mr-2 text-blue-600" />
            Order Requests
          </h2>
          <div className="flex items-center space-x-2">
            <button 
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="p-1 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
            >
              <FiChevronLeft className="text-gray-600" />
            </button>
            <span className="text-sm text-gray-600">
              Page {currentPage} of {totalPages}
            </span>
            <button 
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="p-1 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
            >
              <FiChevronRight className="text-gray-600" />
            </button>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Organization Name</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Medicine</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentOrders.length > 0 ? (
                currentOrders.map((order, i) => (
                  <tr key={i} className="hover:bg-gray-50">
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">{order.orderId}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{order.hospitalName}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{order.medicineName}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center">
                        {getStatusIcon(order.manufacturerStatus)}
                        {order.manufacturerStatus}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-4 py-4 text-center text-sm text-gray-500">
                    No orders found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delivery Chart Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <h3 className="text-sm font-medium text-gray-600 mb-2 flex items-center">
            <FiClock className="mr-2 text-blue-600" />
            Average Delivery Times
          </h3>
          <div id="delivery-time-chart" className="h-64 w-full"></div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <h3 className="text-sm font-medium text-gray-600 mb-2 flex items-center">
            <FiPieChart className="mr-2 text-blue-600" />
            Delivery Status
          </h3>
          <div id="delays-chart" className="h-64 w-full"></div>
        </div>
      </div>

      {/* Report Generator */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800 flex items-center">
            <FiPrinter className="mr-2 text-blue-600" />
            Reports Generator
          </h2>
        </div>
        <div className="p-6">
          <div className="mb-4">
            <label htmlFor="report-type" className="block text-sm font-medium text-gray-700 mb-1">
              Select Report Type
            </label>
            <select
              id="report-type"
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
            >
              <option value="Inventory Status">
                <FiDatabase className="inline mr-2" />
                Inventory Status
              </option>
              <option value="Delivery Performance">
                <FiTruck className="inline mr-2" />
                Delivery Performance
              </option>
              <option value="Hospital Requests">
                <FiFileText2 className="inline mr-2" />
                Hospital Requests
              </option>
              <option value="Pharmacy Orders">
                <FiFileText2 className="inline mr-2" />
                Pharmacy Orders
              </option>
              <option value="Stock Alerts">
                <FiAlertCircle className="inline mr-2" />
                Stock Alerts
              </option>
            </select>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => window.open(`/api/admin-reports?type=${encodeURIComponent(reportType)}&format=pdf`, '_blank')}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              <FiDownload className="mr-2" />
              Download PDF
            </button>
            <button
              onClick={() => window.open(`/api/admin-reports?type=${encodeURIComponent(reportType)}&format=csv`, '_blank')}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
            >
              <FiDownload className="mr-2" />
              Download CSV
            </button>
            <button
              onClick={() => window.open(`/api/admin-reports?type=${encodeURIComponent(reportType)}&format=excel`, '_blank')}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              <FiDownload className="mr-2" />
              Download Excel
            </button>
          </div>
        </div>
      </div>
    </main>
  );
};

export default AdminDashboard;