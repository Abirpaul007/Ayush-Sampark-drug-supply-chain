"use client";

import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBell,
  faCapsules,
  faAmbulance,
  faTruck,
  faExclamationCircle,
  faChevronRight,
  faChevronUp
} from '@fortawesome/free-solid-svg-icons';

interface Alert {
  type: string;
  title: string;
  message: string;
  level: "Urgent" | "Priority" | "Normal";
}

export const PriorityAlerts: React.FC = () => {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const res = await fetch("/api/admin-priority-alerts");
        const data = await res.json();
        if (data.success) {
          setAlerts(data.alerts);
        }
      } catch (error) {
        console.error("Failed to fetch alerts", error);
      }
    };

    fetchAlerts();
  }, []);

  const getIcon = (type: string) => {
    switch (type) {
      case "Stock":
        return <FontAwesomeIcon icon={faCapsules} className="text-red-500 text-sm" />;
      case "Request":
        return <FontAwesomeIcon icon={faAmbulance} className="text-blue-500 text-sm" />;
      case "Delivery":
        return <FontAwesomeIcon icon={faTruck} className="text-green-500 text-sm" />;
      default:
        return <FontAwesomeIcon icon={faExclamationCircle} className="text-gray-500 text-sm" />;
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case "Urgent":
        return "bg-red-100 text-red-800";
      case "Priority":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-yellow-100 text-yellow-800";
    }
  };

  const getIconBg = (type: string) => {
    switch (type) {
      case "Stock":
        return "bg-red-100";
      case "Request":
        return "bg-blue-100";
      case "Delivery":
        return "bg-green-100";
      default:
        return "bg-gray-100";
    }
  };

  const visibleAlerts = showAll ? alerts : alerts.slice(0, 3);

  return (
    <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 mb-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className="h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center mr-4">
            <FontAwesomeIcon icon={faBell} className="text-orange-500" />
          </div>
          <div>
            <h3 className="font-medium text-orange-800">Priority Alerts</h3>
            <p className="text-orange-600 text-sm">
              {alerts.length === 0
                ? "No critical alerts at this moment"
                : `${alerts.length} critical alert${alerts.length > 1 ? "s" : ""} require your immediate attention`}
            </p>
          </div>
        </div>

        {alerts.length > 1 && (
          <button
            onClick={() => setShowAll(prev => !prev)}
            className="bg-white text-orange-600 border border-orange-200 px-4 py-2 rounded-lg text-sm font-medium hover:bg-orange-100 transition duration-200 cursor-pointer !rounded-button whitespace-nowrap flex items-center"
          >
            {showAll ? "Close" : "View All Alerts"}
            <FontAwesomeIcon
              icon={showAll ? faChevronUp : faChevronRight}
              className="ml-1 text-xs"
            />
          </button>
        )}
      </div>

      {visibleAlerts.length > 0 && (
        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          {visibleAlerts.map((alert, index) => (
            <div
              key={index}
              className="bg-white rounded-lg p-3 border border-orange-200 flex items-center"
            >
              <div className={`h-8 w-8 rounded-full ${getIconBg(alert.type)} flex items-center justify-center mr-3`}>
                {getIcon(alert.type)}
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <p className="text-sm font-medium text-gray-800">{alert.title}</p>
                  <span className={`${getLevelColor(alert.level)} text-xs px-2 py-1 rounded-full`}>
                    {alert.level}
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-1">{alert.message}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
