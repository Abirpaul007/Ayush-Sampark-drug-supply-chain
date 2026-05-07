'use client';

import { useEffect, useState } from 'react';

interface ExpiryLogEntry {
  _id: string;
  brandName: string;
  genericName: string;
  batchNumber: string;
  expiryDate: string;
  stockQuantity: number;
}

export default function ExpiryLogPage() {
  const [logs, setLogs] = useState<ExpiryLogEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await fetch('/api/vendor-Expiry-Logs');
        const data = await res.json();
        setLogs(data);
      } catch (err) {
        console.error('Error fetching expiry logs:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, []);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">🧾 Expiry Log</h1>

      {loading ? (
        <p>Loading...</p>
      ) : logs.length === 0 ? (
        <p className="text-gray-500">No expired or expiring batches.</p>
      ) : (
        <table className="w-full border border-gray-300 rounded shadow text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 border">Brand</th>
              <th className="p-2 border">Generic</th>
              <th className="p-2 border">Batch No</th>
              <th className="p-2 border">Expiry</th>
              <th className="p-2 border">Remaining Qty</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((entry) => (
              <tr key={entry._id} className="text-center">
                <td className="p-2 border">{entry.brandName}</td>
                <td className="p-2 border">{entry.genericName}</td>
                <td className="p-2 border">{entry.batchNumber}</td>
                <td className="p-2 border text-red-600">
                  {new Date(entry.expiryDate).toLocaleDateString()}
                </td>
                <td className="p-2 border">{entry.stockQuantity}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
