"use client";

import { useEffect, useState } from 'react';
import { FiSearch, FiClock, FiCheckCircle, FiAlertTriangle, FiDatabase, FiCalendar, FiBox, FiFilter, FiActivity } from 'react-icons/fi';
import { FaHospital, FaPills } from 'react-icons/fa';

interface Order {
  _id: string;
  orderId: string;
  hospitalName: string;
  type: string;
  medicineName: string;
  quantity: number;
  deliveryDate: string;
  manufacturerStatus: string;
}

export default function HospitalOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<'All' | 'Pending' | 'Delivered'>('All');
  const ordersPerPage = 30; // Show 30 orders per page
  
  const [stats, setStats] = useState({
    pending: 0,
    approvedToday: 0,
    highPriority: 0,
    total: 0,
  });

  useEffect(() => {
    fetch('/api/orderh')
      .then((res) => res.json())
      .then((data) => {
        const ordersData = data || [];
        setOrders(ordersData);
        setFilteredOrders(ordersData);
        calculateStats(ordersData);
      })
      .catch((error) => {
        console.error('Failed to fetch orders:', error);
      });
  }, []);

  useEffect(() => {
    let results = orders.filter(order =>
      order.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.hospitalName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.medicineName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.manufacturerStatus.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Apply status filter
    if (statusFilter !== 'All') {
      results = results.filter(order => order.manufacturerStatus === statusFilter);
    }

    setFilteredOrders(results);
    setCurrentPage(1); // Reset to first page when filters change
  }, [searchTerm, statusFilter, orders]);

  const calculateStats = (data: Order[]) => {
    const today = new Date().toISOString().slice(0, 10);

    const pending = data.filter((order) => order.manufacturerStatus === 'Pending').length;
    const approvedToday = data.filter(
      (order) =>
        order.manufacturerStatus === 'Delivered' &&
        order.deliveryDate?.slice(0, 10) === today
    ).length;
    const highPriority = data.filter((order) => {
      if (!order.deliveryDate) return false;
      const delivery = new Date(order.deliveryDate);
      const diffDays = Math.ceil((delivery.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
      return diffDays <= 3;
    }).length;
    const total = data.length;

    setStats({ pending, approvedToday, highPriority, total });
  };

  const getPriority = (deliveryDate: string) => {
    if (!deliveryDate) return 'Unknown';
    const today = new Date();
    const delivery = new Date(deliveryDate);
    const diffDays = Math.ceil((delivery.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays <= 3) return 'High';
    if (diffDays <= 7) return 'Medium';
    return 'Low';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'Delivered': return 'bg-green-100 text-green-800';
      case 'Rejected': return 'bg-red-100 text-red-800';
      case 'Processing': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'bg-red-100 text-red-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Pagination logic
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);
  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <div className="p-6 md:p-8 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Bridge Header - Modified from original */}
        <div className="bg-gradient-to-r from-red-600 to-blue-600 rounded-xl shadow-md p-6 mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div className="text-white">
              <h1 className="text-2xl md:text-3xl font-bold flex items-center">
                <FaHospital className="mr-3 text-blue-200" />
                Hospital Requests
              </h1>
              <p className="text-blue-100 mt-2">Manage and track all hospital medication requests</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 mt-4 md:mt-0 w-full md:w-auto">
              <div className="relative w-full sm:w-64">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiSearch className="text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search orders..."
                  className="block w-full pl-10 pr-3 py-2 border border-blue-500 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-transparent"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="relative w-full sm:w-48">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiFilter className="text-gray-400" />
                </div>
                <select
                  className="block w-full pl-10 pr-3 py-2 border border-blue-500 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-transparent appearance-none"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as 'All' | 'Pending' | 'Delivered')}
                >
                  <option value="All">All Status</option>
                  <option value="Pending">Pending</option>
                  <option value="Delivered">Delivered</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          <div className="bg-white p-5 rounded-xl shadow-sm border-l-4 border-yellow-400 flex items-start">
            <div className="bg-yellow-100 p-3 rounded-lg mr-4">
              <FiClock className="text-yellow-600 text-xl" />
            </div>
            <div>
              <h2 className="text-sm font-medium text-gray-600">Pending Requests</h2>
              <p className="text-2xl font-bold text-gray-800 mt-1">{stats.pending}</p>
            </div>
          </div>
          <div className="bg-white p-5 rounded-xl shadow-sm border-l-4 border-green-500 flex items-start">
            <div className="bg-green-100 p-3 rounded-lg mr-4">
              <FiCheckCircle className="text-green-600 text-xl" />
            </div>
            <div>
              <h2 className="text-sm font-medium text-gray-600">Approved Today</h2>
              <p className="text-2xl font-bold text-gray-800 mt-1">{stats.approvedToday}</p>
            </div>
          </div>
          <div className="bg-white p-5 rounded-xl shadow-sm border-l-4 border-red-500 flex items-start">
            <div className="bg-red-100 p-3 rounded-lg mr-4">
              <FiAlertTriangle className="text-red-600 text-xl" />
            </div>
            <div>
              <h2 className="text-sm font-medium text-gray-600">High Priority</h2>
              <p className="text-2xl font-bold text-gray-800 mt-1">{stats.highPriority}</p>
            </div>
          </div>
          <div className="bg-white p-5 rounded-xl shadow-sm border-l-4 border-blue-500 flex items-start">
            <div className="bg-blue-100 p-3 rounded-lg mr-4">
              <FiDatabase className="text-blue-600 text-xl" />
            </div>
            <div>
              <h2 className="text-sm font-medium text-gray-600">Total Requests</h2>
              <p className="text-2xl font-bold text-gray-800 mt-1">{stats.total}</p>
            </div>
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-8">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order ID
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="flex items-center">
                      <FaHospital className="mr-2" /> Hospital
                    </div>
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="flex items-center">
                      <FaPills className="mr-2" /> Drug
                    </div>
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Quantity
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="flex items-center">
                      <FiActivity className="mr-2" /> Priority
                    </div>
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="flex items-center">
                      <FiCalendar className="mr-2" /> Delivery Date
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentOrders.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                      No orders found matching your criteria.
                    </td>
                  </tr>
                ) : (
                  currentOrders.map((order) => (
                    <tr key={order._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        #{order.orderId}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {order.hospitalName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex items-center">
                          <FiBox className="mr-2 text-blue-500" />
                          {order.medicineName}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {order.quantity}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getPriorityColor(getPriority(order.deliveryDate))}`}>
                          {getPriority(order.deliveryDate)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(order.manufacturerStatus || 'Pending')}`}>
                          {order.manufacturerStatus || 'Pending'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {order.deliveryDate?.slice(0, 10) || 'N/A'}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        {filteredOrders.length > ordersPerPage && (
          <div className="flex items-center justify-between px-4 py-3 bg-white border-t border-gray-200 sm:px-6 rounded-b-lg">
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing <span className="font-medium">{indexOfFirstOrder + 1}</span> to{' '}
                  <span className="font-medium">
                    {Math.min(indexOfLastOrder, filteredOrders.length)}
                  </span>{' '}
                  of <span className="font-medium">{filteredOrders.length}</span> results
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  <button
                    onClick={() => paginate(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span className="sr-only">Previous</span>
                    &larr;
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
                    <button
                      key={number}
                      onClick={() => paginate(number)}
                      className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${currentPage === number ? 'z-10 bg-blue-50 border-blue-500 text-blue-600' : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'}`}
                    >
                      {number}
                    </button>
                  ))}
                  <button
                    onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span className="sr-only">Next</span>
                    &rarr;
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}