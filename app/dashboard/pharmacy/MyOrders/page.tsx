'use client';

import { useEffect, useState } from 'react';
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '@/app/ui/table';

interface PharmacyOrder {
  _id: string;
  orderId: string;
  medicineName: string;
  quantity: number;
  totalValue: number;
  deliveryDate: string;
  manufacturerStatus: string;
}

export default function PharmacyOrdersPage() {
  const [PharmacyOrders, setPharmacyOrders] = useState<PharmacyOrder[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<PharmacyOrder[]>([]);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const fetchOrders = async () => {
    const res = await fetch('/api/pharmacy-orders');
    const data = await res.json();
    setPharmacyOrders(data);
    setFilteredOrders(data);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleSearch = (value: string) => {
    setSearch(value);
    const lower = value.toLowerCase();
    const filtered = PharmacyOrders.filter(
      (PharmacyOrder) =>
        PharmacyOrder.medicineName.toLowerCase().includes(lower) ||
        PharmacyOrder.orderId.toLowerCase().includes(lower)
    );
    setFilteredOrders(filtered);
    setCurrentPage(1);
  };

  const exportToCSV = () => {
    const csv = [
      ['Order ID', 'Medicine', 'Quantity', 'Total', 'Delivery Date', 'Status'],
      ...filteredOrders.map((PharmacyOrder) => [
        PharmacyOrder.orderId,
        PharmacyOrder.medicineName,
        PharmacyOrder.quantity,
        PharmacyOrder.totalValue,
        PharmacyOrder.deliveryDate,
        PharmacyOrder.manufacturerStatus,
      ]),
    ]
      .map((row) => row.join(','))
      .join('\n');

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'pharmacy_orders.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const displayedOrders = filteredOrders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 px-6 py-8 sm:px-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-white">Medicine Orders</h1>
                <p className="text-blue-100 mt-2">View and manage your pharmacy orders</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1 min-w-[200px]">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    placeholder="Search orders..."
                    value={search}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="pl-10 w-full h-10 rounded-lg border-0 focus:ring-2 focus:ring-blue-200 text-gray-900"
                  />
                </div>
                <button
                  onClick={exportToCSV}
                  className="flex items-center justify-center gap-2 bg-white text-blue-600 hover:bg-blue-50 px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Export
                </button>
              </div>
            </div>
          </div>

          {/* Table Section */}
          <div className="px-6 py-5 sm:px-8">
            <div className="overflow-x-auto rounded-lg border border-gray-200">
              <Table className="min-w-full">
                <TableHeader className="bg-gray-50">
                  <TableRow>
                    <TableHead className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</TableHead>
                    <TableHead className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Medicine</TableHead>
                    <TableHead className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</TableHead>
                    <TableHead className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</TableHead>
                    <TableHead className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Delivery Date</TableHead>
                    <TableHead className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className="bg-white divide-y divide-gray-200">
                  {displayedOrders.length > 0 ? (
                    displayedOrders.map((order) => (
                      <TableRow key={order._id} className="hover:bg-gray-50 transition-colors">
                        <TableCell className="py-4 px-4 whitespace-nowrap text-sm font-mono text-blue-600">
                          {order.orderId}
                        </TableCell>
                        <TableCell className="py-4 px-4 whitespace-nowrap text-sm font-medium text-gray-900 capitalize">
                          {order.medicineName}
                        </TableCell>
                        <TableCell className="py-4 px-4 whitespace-nowrap text-sm text-gray-500">
                          {order.quantity}
                        </TableCell>
                        <TableCell className="py-4 px-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          ₹{order.totalValue.toLocaleString()}
                        </TableCell>
                        <TableCell className="py-4 px-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(order.deliveryDate).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </TableCell>
                        <TableCell className="py-4 px-4 whitespace-nowrap">
                          {order.manufacturerStatus?.toLowerCase() === 'delivered' ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              Delivered
                            </span>
                          ) : order.manufacturerStatus?.toLowerCase() === 'rejected' ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                              Rejected
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                              {order.manufacturerStatus || 'Processing'}
                            </span>
                          )}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="py-8 text-center">
                        <div className="flex flex-col items-center justify-center text-gray-500">
                          <svg className="w-12 h-12 mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                          </svg>
                          <p className="text-lg font-medium">No orders found</p>
                          <p className="mt-1">Try adjusting your search query</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>

            {/* Pagination */}
            {filteredOrders.length > itemsPerPage && (
              <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 px-2">
                <div className="text-sm text-gray-600">
                  Showing <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> to{' '}
                  <span className="font-medium">{Math.min(currentPage * itemsPerPage, filteredOrders.length)}</span> of{' '}
                  <span className="font-medium">{filteredOrders.length}</span> results
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="flex items-center justify-center px-3 py-1.5 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  <div className="flex items-center">
                    <span className="px-3 py-1.5 text-sm text-gray-700">
                      Page {currentPage} of {totalPages}
                    </span>
                  </div>
                  <button
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="flex items-center justify-center px-3 py-1.5 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}