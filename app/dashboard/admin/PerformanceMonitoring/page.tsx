'use client';

import React, { useEffect, useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer, Cell
} from 'recharts';
import { FiActivity   } from 'react-icons/fi';
export default function PerformanceMonitoringPage() {
  const [filter, setFilter] = useState<'weekly' | 'monthly' | 'yearly'>('monthly');
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState({
    totalOrders: 0,
    avgDeliveryTime: '0',
    fulfillmentRate: '0%',
    lowStockIncidents: 0,
    expiredDrugs: 0,
  });
  const [chartsData, setChartsData] = useState({
    vendorOrders: [],
    topDrugs: [],
    topHospitals: [],
    topPharmacies: [],
  });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/admin-performance-metrics?filter=${filter}`);
        if (!res.ok) throw new Error('Failed to fetch data');
        const data = await res.json();
        setMetrics(data.metrics);
        setChartsData(data.charts);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [filter]);

  const colors = ['#6366F1', '#8B5CF6', '#EC4899', '#F43F5E', '#F59E0B'];

  if (loading) {
    return (
      <div className="p-6 max-w-7xl mx-auto flex justify-center items-center h-[80vh]">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-12 w-12 bg-blue-100 rounded-full mb-4"></div>
          <div className="h-4 bg-gray-100 rounded w-32 mb-2"></div>
          <div className="h-4 bg-gray-100 rounded w-48"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      <div className="bg-gradient-to-r from-red-600 to-blue-600 rounded-xl shadow-lg p-6 mb-8 dark:from-gray-800 dark:to-gray-900">
  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
    <div>
      <h1 className="text-2xl sm:text-3xl font-bold text-white dark:text-gray-100 flex items-center">
        <FiActivity className="mr-3 text-white dark:text-blue-300" />
        Performance Dashboard
      </h1>
      <p className="text-gray-100 dark:text-gray-300 mt-1">
        Key metrics and analytics for system performance
      </p>
    </div>
    
    <div className="relative w-full md:w-auto">
      <select
        value={filter}
        onChange={(e) => setFilter(e.target.value as any)}
        className="appearance-none bg-white dark:bg-gray-800 bg-opacity-90 dark:bg-opacity-90 border border-blue-300 dark:border-gray-600 rounded-lg px-4 py-2 pr-8 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent dark:focus:ring-blue-500 text-sm font-medium text-gray-700 dark:text-gray-300 w-full"
      >
        <option value="weekly">Weekly</option>
        <option value="monthly">Monthly</option>
        <option value="yearly">Yearly</option>
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-blue-500 dark:text-blue-400">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>
  </div>
</div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
        <MetricCard 
          label="Orders Processed" 
          value={metrics.totalOrders} 
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          } 
          trend="up" 
          change="12%" 
        />
        <MetricCard 
          label="Avg. Delivery Time" 
          value={`${metrics.avgDeliveryTime} hrs`} 
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          } 
          trend="down" 
          change="8%" 
        />
        <MetricCard 
          label="Fulfillment Rate" 
          value={metrics.fulfillmentRate} 
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
          } 
          trend="up" 
          change="2%" 
        />
        <MetricCard 
          label="Low Stock Incidents" 
          value={metrics.lowStockIncidents} 
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          } 
          trend="down" 
          change="10%" 
        />
        <MetricCard 
          label="Expired Drugs" 
          value={metrics.expiredDrugs} 
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          } 
          trend="up" 
          change="5%" 
        />
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Performance Analytics</h2>
          <div className="flex space-x-2">
            <button className="px-3 py-1 text-sm font-medium rounded-lg bg-blue-50 dark:bg-gray-700 text-blue-600 dark:text-blue-400">
              Export
            </button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ChartCard 
            title="Vendors with Highest Orders" 
            data={chartsData.vendorOrders} 
            dataKey="vendor" 
            valueKey="orders" 
            color={colors[0]} 
          />
          <ChartCard 
            title="Top Ordered Drugs" 
            data={chartsData.topDrugs} 
            dataKey="medicine" 
            valueKey="count" 
            color={colors[1]} 
          />
          <ChartCard 
            title="Top Ordering Hospitals" 
            data={chartsData.topHospitals} 
            dataKey="hospital" 
            valueKey="orders" 
            color={colors[2]} 
          />
          <ChartCard 
            title="Top Ordering Pharmacies" 
            data={chartsData.topPharmacies} 
            dataKey="pharmacy" 
            valueKey="orders" 
            color={colors[3]} 
          />
        </div>
      </div>
    </div>
  );
}

function MetricCard({ label, value, icon, trend, change }: {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  trend: 'up' | 'down';
  change: string;
}) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-5 flex flex-col hover:shadow-md transition-shadow duration-200">
      <div className="flex justify-between items-start">
        <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-blue-50 dark:bg-gray-700 text-blue-600 dark:text-blue-400">
          {icon}
        </div>
        <span className={`inline-flex items-center text-xs font-medium px-2 py-1 rounded-full ${trend === 'up' ? 'bg-green-50 text-green-600 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400'}`}>
          {trend === 'up' ? (
            <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7" />
            </svg>
          ) : (
            <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          )}
          {change}
        </span>
      </div>
      <div className="mt-4">
        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">{label}</h3>
        <p className="text-2xl font-semibold text-gray-900 dark:text-white mt-1">{value}</p>
      </div>
    </div>
  );
}

function ChartCard({ title, data, dataKey, valueKey, color }: {
  title: string;
  data: any[];
  dataKey: string;
  valueKey: string;
  color: string;
}) {
  return (
    <div className="bg-gray-50 dark:bg-gray-700/30 rounded-lg p-4 border border-gray-100 dark:border-gray-700 hover:shadow-sm transition-shadow duration-200">
      <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">{title}</h3>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={data} layout="vertical" margin={{ left: 30 }}>
          <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E5E7EB" strokeOpacity={0.2} />
          <XAxis 
            type="number" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#6B7280', fontSize: 12 }} 
          />
          <YAxis 
            dataKey={dataKey} 
            type="category" 
            width={80} 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#6B7280', fontSize: 12 }} 
          />
          <Tooltip 
            contentStyle={{
              backgroundColor: 'white',
              borderRadius: '0.5rem',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              border: 'none',
            }}
          />
          <Bar dataKey={valueKey} radius={[0, 4, 4, 0]}>
            {data.map((_, i) => (
              <Cell 
                key={i} 
                fill={color} 
                opacity={0.85} 
                strokeWidth={0}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}