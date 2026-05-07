'use client';

import { useEffect, useState } from 'react';

interface ExpiredBatch {
  _id: string;
  medicineName: string;
  genericName: string;
  batchNumber: string;
  quantity: number;
  expiryDate: string;
}

export default function ExpiryLogsPage() {
  const [logs, setLogs] = useState<ExpiredBatch[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await fetch('/api/hospital-expiry-logs');
        const data = await res.json();
        setLogs(data.expired || []);
      } catch (err) {
        console.error('Failed to fetch expiry logs:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, []);

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-800 text-center">🧾 Expired Batches (Last 6 Months)</h1>

      {loading ? (
        <p className="text-center text-gray-500">Loading...</p>
      ) : logs.length === 0 ? (
        <p className="text-center text-gray-600">No expired batches found.</p>
      ) : (
        <table className="min-w-full bg-white border border-gray-200 rounded-lg overflow-hidden">
          <thead className="bg-gray-100 text-left text-sm font-semibold">
            <tr>
              <th className="py-2 px-4">Medicine</th>
              <th className="py-2 px-4">Batch No.</th>
              <th className="py-2 px-4">Quantity</th>
              <th className="py-2 px-4">Expired On</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log, i) => (
              <tr key={i} className="border-t text-sm">
                <td className="py-2 px-4">
                  <span className="font-semibold text-gray-800">{log.medicineName}</span>
                  <span className="text-gray-500"> ({log.genericName})</span>
                </td>
                <td className="py-2 px-4">{log.batchNumber}</td>
                <td className="py-2 px-4">{log.quantity}</td>
                <td className="py-2 px-4 text-red-600">
                  {new Date(log.expiryDate).toLocaleDateString('en-IN')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
