'use client';
import React, { useState } from 'react';

const mockBatches = [
  { batch: 'BATCH123', drug: 'Paracetamol 500mg', status: 'Manufactured', lastUpdate: '2024-06-01' },
  { batch: 'BATCH124', drug: 'Amoxicillin 250mg', status: 'Dispatched', lastUpdate: '2024-06-02' },
  { batch: 'BATCH125', drug: 'Ibuprofen 400mg', status: 'In Transit', lastUpdate: '2024-06-03' },
  { batch: 'BATCH126', drug: 'Omeprazole 20mg', status: 'Delivered', lastUpdate: '2024-06-04' },
];

export default function SupplyChainTrackerPage() {
  const [search, setSearch] = useState('');
  const filtered = mockBatches.filter(
    (b) =>
      b.drug.toLowerCase().includes(search.toLowerCase()) ||
      b.batch.toLowerCase().includes(search.toLowerCase())
  );
  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Supply Chain Tracker</h1>
      <div className="mb-4 flex gap-2">
        <input
          className="input w-full max-w-xs"
          placeholder="Search by drug or batch..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>
      <div className="overflow-x-auto rounded shadow bg-white">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">Batch</th>
              <th className="p-3 text-left">Drug</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Last Update</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={4} className="text-center p-6">No batches found.</td></tr>
            ) : filtered.map((b, i) => (
              <tr key={i} className="border-b hover:bg-gray-50">
                <td className="p-3">{b.batch}</td>
                <td className="p-3">{b.drug}</td>
                <td className="p-3">{b.status}</td>
                <td className="p-3">{b.lastUpdate}</td>
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