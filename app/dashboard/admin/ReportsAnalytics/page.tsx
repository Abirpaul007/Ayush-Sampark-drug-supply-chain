'use client';

import { useState, useEffect } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, ResponsiveContainer, Legend
} from 'recharts';
import { saveAs } from 'file-saver';
import { FiBarChart2 } from 'react-icons/fi';

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

export default function ReportsAnalytics() {
  const [summary, setSummary] = useState({
    monthlySales: 0,
    totalOrders: 0,
    inventoryValue: 0,
    expiredDrugs: 0,
  });

  type PieDataItem = { name: string; value: number };
  type BarDataItem = { name: string; sales: number };

  const [pieData, setPieData] = useState<PieDataItem[]>([]);
  const [barData, setBarData] = useState<BarDataItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/admin_analytics');
        const data = await res.json();
        setSummary({
          monthlySales: data.monthlySales,
          totalOrders: data.totalOrders,
          inventoryValue: data.inventoryValue,
          expiredDrugs: data.expiredDrugs,
        });
        setPieData(data.orderStatusDistribution || []);
        setBarData(data.monthlySalesTrend || []);
      } catch (error) {
        console.error('Failed to fetch analytics data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const exportToCSV = () => {
    const csvRows = [
      ['Metric', 'Value'],
      ['Monthly Sales', summary.monthlySales],
      ['Total Orders', summary.totalOrders],
      ['Inventory Value', summary.inventoryValue],
      ['Expired Drugs', summary.expiredDrugs],
      [],
      ['Order Status', 'Count'],
      ...((pieData && Array.isArray(pieData)) ? pieData.map(item => [item.name, item.value]) : []),
      [],
      ['Month', 'Sales'],
      ...((barData && Array.isArray(barData)) ? barData.map(item => [item.name, item.sales]) : [])
    ];

    const validRows = csvRows.filter(row => Array.isArray(row));
    const csvString = validRows.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, 'admin_analytics_report.csv');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-10 flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-12 w-12 bg-blue-200 rounded-full mb-4"></div>
          <div className="h-4 bg-blue-200 rounded w-32"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-600 to-blue-600 rounded-xl shadow-lg p-6 mb-8">
  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
    <div>
      <h1 className="text-2xl sm:text-3xl font-bold text-white flex items-center">
        <FiBarChart2 className="mr-3 text-indigo-200" />
        Reports & Analytics
      </h1>
      <p className="text-indigo-100 mt-1 text-sm">Track and analyze your pharmacy performance</p>
    </div>
    
    <button
      onClick={exportToCSV}
      className="inline-flex items-center gap-2 bg-white bg-opacity-90 hover:bg-opacity-100 text-indigo-700 font-medium py-2 px-4 border border-indigo-300 rounded-lg shadow-sm transition-all duration-200 hover:shadow-md hover:border-indigo-400"
    >
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
      </svg>
      Export CSV
    </button>
  </div>
</div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { title: 'Monthly Sales', value: `₹${summary.monthlySales.toLocaleString()}`, icon: '💰', trend: 'up', change: '12% from last month' },
            { title: 'Total Orders', value: summary.totalOrders, icon: '📦', trend: 'up', change: '5% from last month' },
            { title: 'Inventory Value', value: `₹${summary.inventoryValue.toLocaleString()}`, icon: '📊', trend: 'neutral', change: '3% from last month' },
            { title: 'Expired Drugs', value: summary.expiredDrugs, icon: '⚠️', trend: 'down', change: '8% from last month' }
          ].map((card, index) => (
            <div key={index} className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
              <div className="flex items-center justify-between">
                <div className="text-2xl">{card.icon}</div>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  card.trend === 'up' ? 'bg-green-100 text-green-800' : 
                  card.trend === 'down' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'
                }`}>
                  {card.change}
                </span>
              </div>
              <h3 className="text-sm font-medium text-gray-500 mt-3">{card.title}</h3>
              <p className="text-2xl font-semibold mt-1 text-gray-900">{card.value}</p>
            </div>
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Order Status Distribution */}
          <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Order Status Distribution</h2>
              <div className="flex space-x-2">
                <button className="p-1 rounded hover:bg-gray-100">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    innerRadius={40}
                    label={({ name, percent }) => `${name}: ${((percent || 0) * 100).toFixed(0)}%`}
                    labelLine={false}
                  >
                    {pieData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value: number) => [value, 'Orders']}
                    contentStyle={{
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                      border: 'none'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Monthly Sales Trend */}
          <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Monthly Sales Trend</h2>
              <select className="text-sm border border-gray-200 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option>Last 6 Months</option>
                <option>Last 12 Months</option>
                <option>This Year</option>
              </select>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData}>
                  <XAxis 
                    dataKey="name" 
                    tick={{ fontSize: 12 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis 
                    tick={{ fontSize: 12 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip 
                    contentStyle={{
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                      border: 'none'
                    }}
                    formatter={(value: number) => [`₹${value.toLocaleString()}`, 'Sales']}
                    labelFormatter={(label) => `Month: ${label}`}
                  />
                  <Bar 
                    dataKey="sales" 
                    radius={[4, 4, 0, 0]} 
                    style={{
                      fill: 'url(#salesGradient)',
                    }}
                  >
                    <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.8}/>
                      <stop offset="100%" stopColor="#3b82f6" stopOpacity={0.2}/>
                    </linearGradient>
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}