"use client";

import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faPills, 
  faHospitalUser, 
  faExclamationTriangle, 
  faTruck, 
  faArrowUp 
} from '@fortawesome/free-solid-svg-icons';

export const QuickStatsCards: React.FC = () => {
  const [totalInventory, setTotalInventory] = useState(0);
  const [pendingRequests, setPendingRequests] = useState(0);
  const [lowStockAlerts, setLowStockAlerts] = useState(0);
  const [todaysDeliveries, setTodaysDeliveries] = useState(0);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch Inventory
        const inventoryRes = await fetch('/api/admin-inventory');
        const inventoryData = await inventoryRes.json();

        if (inventoryData.success && Array.isArray(inventoryData.inventory)) {
          setTotalInventory(inventoryData.inventory.length);

          const lowStock = inventoryData.inventory.filter(
            (item: any) => item.stockQuantity < 10
          );
          setLowStockAlerts(lowStock.length);
        }

        // Fetch Orders
        const ordersRes = await fetch('/api/admin-orders');
        const ordersData = await ordersRes.json();

        if (ordersData.success && Array.isArray(ordersData.orders)) {
          const pending = ordersData.orders.filter(
            (order: any) => order.manufacturerStatus === 'Pending'
          );
          setPendingRequests(pending.length);

          const today = new Date().toISOString().split('T')[0];
          const deliveredToday = ordersData.orders.filter((order: any) => {
            const updatedDate = new Date(order.updatedAt).toISOString().split('T')[0];
            return order.manufacturerStatus === 'Delivered' && updatedDate === today;
          });
          setTodaysDeliveries(deliveredToday.length);
        }
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <StatCard
        title="Total Drugs in Inventory"
        value={totalInventory}
        icon={<FontAwesomeIcon icon={faPills} className="text-blue-600" />}
        iconBg="bg-blue-100"
        trend="+12%"
        trendColor="text-green-500"
        comparisonText="from last month"
        progressColor="bg-blue-600"
        progressWidth="75%"
      />
      <StatCard
        title="Pending Hospital Requests"
        value={pendingRequests}
        icon={<FontAwesomeIcon icon={faHospitalUser} className="text-yellow-600" />}
        iconBg="bg-yellow-100"
        trend="+8%"
        trendColor="text-red-500"
        comparisonText="from yesterday"
        progressColor="bg-yellow-500"
        progressWidth="65%"
      />
      <StatCard
        title="Low Stock Alerts"
        value={lowStockAlerts}
        icon={<FontAwesomeIcon icon={faExclamationTriangle} className="text-red-600" />}
        iconBg="bg-red-100"
        trend="+5%"
        trendColor="text-red-500"
        comparisonText="from last week"
        progressColor="bg-red-500"
        progressWidth="35%"
      />
      <StatCard
        title="Today's Deliveries"
        value={todaysDeliveries}
        icon={<FontAwesomeIcon icon={faTruck} className="text-green-600" />}
        iconBg="bg-green-100"
        trend="+15%"
        trendColor="text-green-500"
        comparisonText="from yesterday"
        progressColor="bg-green-500"
        progressWidth="85%"
      />
    </div>
  );
};

const StatCard = ({
  title,
  value,
  icon,
  iconBg,
  trend,
  trendColor,
  comparisonText,
  progressColor,
  progressWidth,
}: {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  iconBg: string;
  trend: string;
  trendColor: string;
  comparisonText: string;
  progressColor: string;
  progressWidth: string;
}) => (
  <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition duration-200">
    <div className="flex justify-between items-start mb-4">
      <div>
        <p className="text-gray-500 text-sm">{title}</p>
        <h3 className="text-3xl font-bold text-gray-800 mt-1">{value}</h3>
      </div>
      <div className={`h-10 w-10 rounded-full ${iconBg} flex items-center justify-center`}>
        {icon}
      </div>
    </div>
    <div className="flex items-center">
      <span className={`${trendColor} flex items-center text-sm font-medium`}>
        <FontAwesomeIcon icon={faArrowUp} className="mr-1" /> {trend}
      </span>
      <span className="text-gray-400 text-sm ml-2">{comparisonText}</span>
    </div>
    <div className="h-2 w-full bg-gray-100 rounded-full mt-4">
      <div className={`h-2 ${progressColor} rounded-full`} style={{ width: progressWidth }}></div>
    </div>
  </div>
);