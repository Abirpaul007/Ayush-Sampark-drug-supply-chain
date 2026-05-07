'use client';

import { useEffect, useState } from 'react';

interface DeliveryLog {
  _id: string;
  medicineName: string;
  quantity: number;
  price: number;
  totalValue: number;
  hospitalName: string;
  deliveryDate: string;
  manufacturerStatus: string;
}

export default function DeliveryLogsPage() {
  const [logs, setLogs] = useState<DeliveryLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/hospital-delivery-logs')
      .then((res) => res.json())
      .then((data) => {
        setLogs(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to fetch delivery logs:', err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Delivery Logs</h1>

      {loading ? (
        <p>Loading...</p>
      ) : logs.length === 0 ? (
        <p className="text-gray-500">No delivery records found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white shadow-md rounded-xl">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-2 px-4 text-left">Medicine</th>
                <th className="py-2 px-4 text-left">Quantity</th>
                <th className="py-2 px-4 text-left">Price</th>
                <th className="py-2 px-4 text-left">Total</th>
                <th className="py-2 px-4 text-left">Hospital</th>
                <th className="py-2 px-4 text-left">Delivered On</th>
                <th className="py-2 px-4 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr key={log._id} className="border-t hover:bg-gray-50">
                  <td className="py-2 px-4">{log.medicineName}</td>
                  <td className="py-2 px-4">{log.quantity}</td>
                  <td className="py-2 px-4">₹{log.price.toFixed(2)}</td>
                  <td className="py-2 px-4">₹{log.totalValue.toFixed(2)}</td>
                  <td className="py-2 px-4">{log.hospitalName || '—'}</td>
                  <td className="py-2 px-4">
                    {log.deliveryDate ? new Date(log.deliveryDate).toLocaleDateString() : '—'}
                  </td>
                  <td className="py-2 px-4 capitalize">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        log.manufacturerStatus === 'delivered'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-yellow-100 text-yellow-700'
                      }`}
                    >
                      {log.manufacturerStatus}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
