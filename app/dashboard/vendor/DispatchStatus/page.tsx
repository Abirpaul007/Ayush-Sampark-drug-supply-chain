'use client';
import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTruck, faClock, faCheckCircle } from '@fortawesome/free-solid-svg-icons';

const mockDispatches = [
  { orderId: 'VORD001', drug: 'Paracetamol 500mg', quantity: 200, status: 'Dispatched', date: '2024-06-01' },
  { orderId: 'VORD002', drug: 'Amoxicillin 250mg', quantity: 150, status: 'Pending', date: '2024-06-03' },
];

export default function DispatchStatusPage() {
  const [search, setSearch] = useState('');
  const filtered = mockDispatches.filter(
    (d) => d.orderId.toLowerCase().includes(search.toLowerCase()) || d.drug.toLowerCase().includes(search.toLowerCase())
  );
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Dispatch Status</h1>
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
              <th className="p-3 text-left">Date</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={5} className="text-center p-6">No dispatches found.</td></tr>
            ) : filtered.map((d, i) => (
              <tr key={i} className="border-b hover:bg-gray-50">
                <td className="p-3">{d.orderId}</td>
                <td className="p-3">{d.drug}</td>
                <td className="p-3">{d.quantity}</td>
                <td className="p-3">
                  {d.status === 'Dispatched' && <FontAwesomeIcon icon={faTruck} className="text-blue-600 mr-1" />}
                  {d.status === 'Pending' && <FontAwesomeIcon icon={faClock} className="text-orange-500 mr-1" />}
                  {d.status === 'Delivered' && <FontAwesomeIcon icon={faCheckCircle} className="text-green-600 mr-1" />}
                  {d.status}
                </td>
                <td className="p-3">{d.date}</td>
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