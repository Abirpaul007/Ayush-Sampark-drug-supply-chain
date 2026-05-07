'use client';
import React, { useState } from 'react';

const mockOrders = [
  { orderId: 'ORD001', drug: 'Paracetamol 500mg', quantity: 100, status: 'Delivered', lastUpdate: '2024-06-01' },
  { orderId: 'ORD002', drug: 'Amoxicillin 250mg', quantity: 50, status: 'In Transit', lastUpdate: '2024-06-03' },
  { orderId: 'ORD003', drug: 'Ibuprofen 400mg', quantity: 75, status: 'Pending', lastUpdate: '2024-06-04' },
];

export default function TrackOrdersPage() {
  const [search, setSearch] = useState('');
  const filtered = mockOrders.filter(
    (o) =>
      o.orderId.toLowerCase().includes(search.toLowerCase()) ||
      o.drug.toLowerCase().includes(search.toLowerCase())
  );
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Track Orders</h1>
      <div className="mb-4 flex gap-2">
        <input
          className="input w-full max-w-xs"
          placeholder="Search by order ID or drug..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>
      <div className="overflow-x-auto rounded shadow bg-white">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">Order ID</th>
              <th className="p-3 text-left">Drug</th>
              <th className="p-3 text-left">Quantity</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Last Update</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={5} className="text-center p-6">No orders found.</td></tr>
            ) : filtered.map((o, i) => (
              <tr key={i} className="border-b hover:bg-gray-50">
                <td className="p-3">{o.orderId}</td>
                <td className="p-3">{o.drug}</td>
                <td className="p-3">{o.quantity}</td>
                <td className="p-3">{o.status}</td>
                <td className="p-3">{o.lastUpdate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <style jsx>{`
        .input { @apply border rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400; }
      `}</style>
    </div>
  );
} 