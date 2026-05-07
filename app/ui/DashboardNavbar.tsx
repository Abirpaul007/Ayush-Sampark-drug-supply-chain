import React, { useState } from 'react';
import { useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBell, faUser, faChevronDown, faUserCircle, faCog, faSignOutAlt
} from '@fortawesome/free-solid-svg-icons';
import { signOut } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const DashboardNavbar: React.FC = () => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  
  useEffect(() => {
    fetch('/api/profile')
      .then(res => res.json())
      .then(json => {
        setData(json);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);
  
  if (loading) return (
    <div className="p-6 flex items-center justify-center h-16 bg-white border-b border-gray-100">
      {/* Loading placeholder */}
    </div>
  );

  const { user } = data;

  return (
    <header className="fixed top-0 left-0 w-full h-16 bg-white border-b border-gray-100 flex items-center justify-between px-6 z-50">
      <div className="flex items-center">
        <div className="text-xl font-bold text-blue-900">
          <img src="/logo.png" alt="Logo" className="h-15 w-auto" />
        </div>
      </div>
      
      <div className="flex items-center space-x-6">
        <div className="relative">
          <button
            className="relative p-2 rounded-full hover:bg-gray-50 transition-colors duration-200"
            onClick={() => setShowNotifications(!showNotifications)}
          >
            <FontAwesomeIcon icon={faBell} className="text-gray-500" />
            <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
          </button>
          
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-xl border border-gray-100 z-20 overflow-hidden">
              <div className="p-4 border-b border-gray-100 font-medium text-gray-700">Notifications</div>
              <div className="max-h-96 overflow-y-auto">
                <div className="p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors duration-150">
                  <div className="text-sm font-medium text-gray-800">New order received</div>
                  <div className="text-xs text-gray-400 mt-1">10 minutes ago</div>
                </div>
                <div className="p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors duration-150">
                  <div className="text-sm font-medium text-gray-800">Delivery confirmation pending</div>
                  <div className="text-xs text-gray-400 mt-1">2 hours ago</div>
                </div>
                <div className="p-4 hover:bg-gray-50 cursor-pointer transition-colors duration-150">
                  <div className="text-sm font-medium text-gray-800">SLA breach warning</div>
                  <div className="text-xs text-gray-400 mt-1">Yesterday</div>
                </div>
              </div>
              <div className="p-3 text-center text-sm text-blue-500 border-t border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors duration-150">
                View all notifications
              </div>
            </div>
          )}
        </div>
        
        <div className="relative">
          <div
            className="flex items-center space-x-3 cursor-pointer group"
            onClick={() => setShowUserMenu(!showUserMenu)}
          >
            <div className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center text-white">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div className="hidden md:block">
              <div className="text-sm font-medium text-gray-700">{user.name}</div>
              <div className="text-xs text-gray-400">{user.role}</div>
            </div>
            <FontAwesomeIcon 
              icon={faChevronDown} 
              className={`text-gray-400 text-xs transition-transform duration-200 ${showUserMenu ? 'transform rotate-180' : ''}`} 
            />
          </div>
          
          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-100 z-20 overflow-hidden">
              <Link href='/profile' className="p-3 hover:bg-gray-50 cursor-pointer flex items-center space-x-3 transition-colors duration-150">
                <FontAwesomeIcon icon={faUserCircle} className="text-gray-500 w-4" />
                <div className="text-sm text-gray-700">Profile</div>
              </Link>
              <div className="p-3 hover:bg-gray-50 cursor-pointer flex items-center space-x-3 transition-colors duration-150">
                <FontAwesomeIcon icon={faCog} className="text-gray-500 w-4" />
                <span className="text-sm text-gray-700">Settings</span>
              </div>
              <div className="border-t border-gray-100"></div>
              <div 
                className="p-3 hover:bg-gray-50 cursor-pointer flex items-center space-x-3 text-red-500 transition-colors duration-150"
                onClick={() => signOut({ callbackUrl: '/sign-in' })}
              >
                <FontAwesomeIcon icon={faSignOutAlt} className="w-4" />
                <span className="text-sm">Logout</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default DashboardNavbar;