

'use client';

import { useEffect, useState } from 'react';

interface DispenseSummaryItem {
  _id: string;
  medicine: {
    brandName: string;
    genericName: string;
  };
  quantity: number;
  recipient: string;
  value: number;
  dispensedAt: string;
}

export default function DispenseSummaryPage() {
  const [summary, setSummary] = useState<DispenseSummaryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const res = await fetch('/api/hospital-dispense-logs');
        const data = await res.json();
        setSummary(data.summary || []);
      } catch (error) {
        console.error('Error fetching dispense summary:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Dispense Summary</h1>

      {loading ? (
        <p>Loading...</p>
      ) : summary.length === 0 ? (
        <p>No records found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-200">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="px-4 py-2 border">#</th>
                <th className="px-4 py-2 border">Brand</th>
                <th className="px-4 py-2 border">Generic</th>
                <th className="px-4 py-2 border">Quantity</th>
                <th className="px-4 py-2 border">Recipient</th>
                <th className="px-4 py-2 border">Dispensed At</th>
              </tr>
            </thead>
            <tbody>
              {summary.map((item, index) => (
                <tr key={item._id} className="hover:bg-gray-50">
                  <td className="px-4 py-2 border">{index + 1}</td>
                  <td className="px-4 py-2 border">{item.medicine.brandName}</td>
                  <td className="px-4 py-2 border">{item.medicine.genericName}</td>
                  <td className="px-4 py-2 border">{item.quantity}</td>
                  <td className="px-4 py-2 border">{item.recipient}</td>
                  <td className="px-4 py-2 border">
                    {new Date(item.dispensedAt).toLocaleString()}
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
