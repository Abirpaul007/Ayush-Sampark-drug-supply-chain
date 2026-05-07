"use client";

import React, { useEffect, useState } from 'react';
import { signOut } from 'next-auth/react';
import { 
  FiAlertTriangle, 
  FiCalendar, 
  FiLogOut, 
  FiBell,
  FiArrowRight,
  FiUser
} from 'react-icons/fi';


export const WelcomeBanner: React.FC = () => {
  const [alertCount, setAlertCount] = useState(0);

  const today = new Date();
  const formattedDate = today.toLocaleDateString("en-US", {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });


  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const res = await fetch('/api/admin-priority-alerts');
        const data = await res.json();

        if (data.success) {

          setAlertCount(data.alerts?.length || 0);

        }
      } catch (err) {
        console.error("Failed to fetch alerts:", err);
      }
    };

    fetchAlerts();
  }, []);

  return (
    <div className="mb-8 bg-gradient-to-r from-blue-800 to-blue-600 rounded-xl overflow-hidden shadow-lg relative">
      <div className="flex flex-col md:flex-row">
        <div className="p-8 md:w-1/2">
          <div className="flex items-center mb-4">
            <FiUser className="text-white text-2xl mr-2" />
            <h2 className="text-2xl font-bold text-white">
              Welcome back, Admin!
            </h2>
          </div>
          
          <div className="flex items-center text-blue-100 mb-6">
            <FiCalendar className="mr-2" />
            <span>Today is {formattedDate}</span>
          </div>
          
          <div className="flex items-center mb-6">
            <div className="flex items-center bg-blue-900/30 px-3 py-1 rounded-full mr-4">
              <FiAlertTriangle className="text-yellow-300 mr-2" />
              <span className="text-white font-medium">
                {alertCount} critical alert{alertCount !== 1 ? 's' : ''}
              </span>
            </div>
          </div>
          
          <button className="flex items-center bg-white text-blue-800 px-6 py-2 rounded-lg font-medium shadow-md hover:bg-blue-50 transition duration-200 cursor-pointer whitespace-nowrap">
            <FiBell className="mr-2" />
            View Alerts
            <FiArrowRight className="ml-2" />
          </button>
        </div>

        <div className="md:w-1/2 relative h-64 md:h-auto overflow-hidden bg-blue-700">
          {/* Optional decorative elements or illustration could go here */}
          <div className="absolute inset-0 flex items-center justify-center opacity-20">
            <FiUser className="text-white text-9xl" />
          </div>
        </div>
      </div>

    </div>
  );
};

