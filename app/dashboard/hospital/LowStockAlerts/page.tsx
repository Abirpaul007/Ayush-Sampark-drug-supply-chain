'use client';

import { useEffect, useState } from 'react';

interface InventoryItem {
  _id: string;
  medicineName: string;
  totalDelivered: number;
}

export default function LowStockPage() {
  const [lowStock, setLowStock] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/hospital-inventory')
      .then(res => res.json())
      .then((data: InventoryItem[]) => {
        const filtered = data.filter(item => item.totalDelivered < 10);
        setLowStock(filtered);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch inventory:', err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Low Stock Medicines</h1>

      {loading ? (
        <p>Loading...</p>
      ) : lowStock.length === 0 ? (
        <p className="text-gray-500">No low stock medicines found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white shadow-md rounded-xl">
            <thead className="bg-red-100">
              <tr className="text-left">
                <th className="py-2 px-4">Medicine Name</th>
                <th className="py-2 px-4">Available Stock</th>
              </tr>
            </thead>
            <tbody>
              {lowStock.map(item => (
                <tr key={item._id} className="border-t">
                  <td className="py-2 px-4">{item.medicineName}</td>
                  <td className="py-2 px-4 text-red-600 font-semibold">{item.totalDelivered}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
