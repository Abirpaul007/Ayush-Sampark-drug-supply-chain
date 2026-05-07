'use client';

import { useEffect, useState } from 'react';

interface Order {
  _id: string;
  orderId: string;
  hospitalName?: string;
  quantity: number;
  medicineId: {
    name: string;
  };
  medicineName: string;
  manufacturerStatus: string;
  orderDate: string;
  deliveryDate: string;
  type: 'Hospital' | 'Pharmacy'; // ✅ Required to send to backend
}

export default function VendorRequestDeliveryPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/vendor-request-delivery');
      const data = await res.json();
      setOrders(data.reverse() || []); // Newest first
    } catch (err) {
      console.error('Failed to fetch orders:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRequestDelivery = async (ordersId: string, type: 'Hospital' | 'Pharmacy') => {
    try {
      const res = await fetch('/api/vendor-request-delivery', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ordersId, type }), // ✅ Sending both order ID and type
      });

      const data = await res.json();
      if (data.success) {
        alert('✅ Requested for delivery.');
        fetchOrders(); // Refresh list
      } else {
        alert(data.error || '❌ Failed to request delivery');
      }
    } catch (err) {
      console.error('Error requesting delivery:', err);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-3xl font-bold mb-6 text-blue-700">Request Delivery</h1>

      {loading ? (
        <div className="text-center text-gray-600">Loading...</div>
      ) : orders.length === 0 ? (
        <p className="text-gray-500">No pending delivery requests.</p>
      ) : (
        <div className="overflow-x-auto bg-white shadow-md rounded-xl border border-gray-200">
          <table className="min-w-full text-sm text-left">
            <thead className="bg-blue-50 text-blue-800 uppercase text-xs">
              <tr>
                <th className="px-4 py-3">Order ID</th>
                <th className="px-4 py-3">Hospital/Pharmacy</th>
                <th className="px-4 py-3">Medicine</th>
                <th className="px-4 py-3">Quantity</th>
                <th className="px-4 py-3">Delivery Date</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="text-gray-800">
              {orders.map((order) => (
                <tr
                  key={order._id}
                  className="border-t even:bg-gray-50 hover:bg-gray-100"
                >
                  <td className="px-4 py-3">{order.orderId}</td>
                  <td className="px-4 py-3">{order.hospitalName || 'Pharmacy'}</td>
                  <td className="px-4 py-3">{order.medicineName}</td>
                  <td className="px-4 py-3">{order.quantity}</td>
                  <td className="px-4 py-3">{order.deliveryDate?.slice(0, 10)}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-block px-2 py-1 text-xs rounded-full ${
                        order.manufacturerStatus === 'Pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-green-100 text-green-800'
                      }`}
                    >
                      {order.manufacturerStatus}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => handleRequestDelivery(order._id, order.type)}
                      className="bg-blue-600 text-white text-xs font-semibold px-3 py-1 rounded-lg hover:bg-blue-700 transition"
                    >
                      Request
                    </button>
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
