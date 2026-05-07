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

interface Order {
  _id: string;
  orderId: string;
  medicineName: string;
  quantity: number;
  totalValue: number;
  deliveryDate: string;
  manufacturerStatus: string;
}

export default function HospitalOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const fetchOrders = async () => {
    const res = await fetch('/api/hospital-orders');
    const data = await res.json();
    setOrders(data);
    setFilteredOrders(data);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleSearch = (value: string) => {
    setSearch(value);
    const lower = value.toLowerCase();
    const filtered = orders.filter(
      (order) =>
        order.medicineName.toLowerCase().includes(lower) ||
        order.orderId.toLowerCase().includes(lower)
    );
    setFilteredOrders(filtered);
    setCurrentPage(1);
  };

  const exportToCSV = () => {
    const csv = [
      ['Order ID', 'Medicine', 'Quantity', 'Total', 'Delivery Date', 'Status'],
      ...filteredOrders.map((order) => [
        order.orderId,
        order.medicineName,
        order.quantity,
        order.totalValue,
        order.deliveryDate,
        order.manufacturerStatus,
      ]),
    ]
      .map((row) => row.join(','))
      .join('\n');

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'hospital_orders.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const displayedOrders = filteredOrders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div
      className="min-h-screen py-10 px-6 sm:px-10"
      style={{ background: 'linear-gradient(rgb(222, 243, 248) 50%)' }}
    >
      <div className="max-w-7xl mx-auto bg-white shadow-xl rounded-xl p-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
          <h1 className="text-4xl font-bold text-gray-800 text-center sm:text-left">
            My Medicine Orders
          </h1>

          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Search by medicine/order ID..."
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={exportToCSV}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow text-sm"
            >
              Export CSV
            </button>
          </div>
        </div>

        <div className="overflow-x-auto rounded-md">
          <Table className="min-w-full text-sm">
            <TableHeader className="bg-blue-50 text-gray-700">
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Medicine</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Delivery Date</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {displayedOrders.map((order) => (
                <TableRow key={order._id} className="hover:bg-gray-50 transition-all">
                  <TableCell className="font-mono text-xs">{order.orderId}</TableCell>
                  <TableCell className="capitalize">{order.medicineName}</TableCell>
                  <TableCell>{order.quantity}</TableCell>
                  <TableCell>₹{order.totalValue}</TableCell>
                  <TableCell>
                    {new Date(order.deliveryDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    {order.manufacturerStatus?.toLowerCase() === 'delivered' ? (
                      <span className="inline-block border border-green-500 text-green-700 bg-green-50 px-3 py-1 rounded-full text-xs font-semibold">
                        Delivered
                      </span>
                    ) : order.manufacturerStatus?.toLowerCase() === 'rejected' ? (
                      <span className="inline-block border border-red-500 text-red-700 bg-red-50 px-3 py-1 rounded-full text-xs font-semibold">
                        Rejected
                      </span>
                    ) : (
                      <span className="inline-block border border-yellow-400 text-yellow-700 bg-yellow-50 px-3 py-1 rounded-full text-xs font-semibold">
                        {order.manufacturerStatus || 'Processing'}
                      </span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        {filteredOrders.length > itemsPerPage && (
          <div className="mt-6 flex justify-between items-center text-sm text-gray-600">
            <span>
              Showing {Math.min((currentPage - 1) * itemsPerPage + 1, filteredOrders.length)}–
              {Math.min(currentPage * itemsPerPage, filteredOrders.length)} of {filteredOrders.length}
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 border rounded disabled:opacity-50"
              >
                ⬅ Prev
              </button>
              <button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 border rounded disabled:opacity-50"
              >
                Next ➡
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
