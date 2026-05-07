'use client';
import React, { useState } from 'react';
import { FiSearch, FiTruck, FiCheckCircle, FiClock, FiPackage } from 'react-icons/fi';

const mockOrders = [
  { orderId: 'PORD001', drug: 'Paracetamol 500mg', quantity: 60, status: 'Delivered', lastUpdate: '2024-06-01' },
  { orderId: 'PORD002', drug: 'Amoxicillin 250mg', quantity: 30, status: 'In Transit', lastUpdate: '2024-06-03' },
];

const StatusBadge = ({ status }: { status: string }) => {
  const baseClasses = "inline-flex items-center px-3 py-1 rounded-full text-xs font-medium";
  
  if (status === 'Delivered') {
    return (
      <span className={`${baseClasses} bg-green-100 text-green-800`}>
        <FiCheckCircle className="mr-1" /> {status}
      </span>
    );
  }
  if (status === 'In Transit') {
    return (
      <span className={`${baseClasses} bg-blue-100 text-blue-800`}>
        <FiTruck className="mr-1" /> {status}
      </span>
    );
  }
  return (
    <span className={`${baseClasses} bg-yellow-100 text-yellow-800`}>
      <FiClock className="mr-1" /> {status}
    </span>
  );
};

export default function TrackOrdersPage() {
  const [search, setSearch] = useState('');
  const filtered = mockOrders.filter(
    (o) => o.orderId.toLowerCase().includes(search.toLowerCase()) || o.drug.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Track Your Orders</h1>
            <p className="text-gray-600 mt-1">Monitor the status of your pharmacy orders</p>
          </div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="h-5 w-5 text-gray-400" />
            </div>
            <input
              className="pl-10 pr-4 py-2 w-full max-w-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Search by order ID or drug..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order ID
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Drug
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Quantity
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Last Update
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center">
                      <div className="flex flex-col items-center justify-center text-gray-500">
                        <FiPackage className="h-12 w-12 mb-4 text-gray-400" />
                        <p className="text-lg font-medium">No orders found</p>
                        <p className="mt-1">Try adjusting your search query</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filtered.map((o, i) => (
                    <tr key={i} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                        {o.orderId}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {o.drug}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {o.quantity}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <StatusBadge status={o.status} />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(o.lastUpdate).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}