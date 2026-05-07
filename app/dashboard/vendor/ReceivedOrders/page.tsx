'use client';

import { useEffect, useState } from 'react';

interface DispatchedBatch {
  batchId: string;
  batchNumber: string;
  expiryDate: string;
  quantity: number;
  price: number;
}

interface Order {
  _id: string;
  orderId: string;
  medicineName: string;
  quantity: number;
  totalValue: number;
  hospitalName: string;
  deliveryDate: string;
  orderDate: string;
  manufacturerStatus: string;
  dispatchedBatches: DispatchedBatch[];
  type: 'Hospital' | 'Pharmacy';
}

export default function ReceivedOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredType, setFilteredType] = useState<'All' | 'Hospital' | 'Pharmacy'>('All');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchOrders() {
      try {
        const [hospitalRes, pharmacyRes] = await Promise.all([
          fetch('/api/vendor-received-orderh'),
          fetch('/api/vendor-received-orderp'),
        ]);

        const hospitalOrders: Order[] = await hospitalRes.json();
        const pharmacyOrders: Order[] = await pharmacyRes.json();

        const taggedHospitalOrders = hospitalOrders.map((order) => ({
          ...order,
          type: 'Hospital' as const,
        }));

        const taggedPharmacyOrders = pharmacyOrders.map((order) => ({
          ...order,
          type: 'Pharmacy' as const,
        }));

        const combined = [...taggedHospitalOrders, ...taggedPharmacyOrders].sort(
          (a, b) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime()
        );

        setOrders(combined);
      } catch (err) {
        console.error('Error fetching orders:', err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchOrders();
  }, []);

  const handleAccept = async (mongoId: string, type: 'Hospital' | 'Pharmacy') => {
    const endpoint =
      type === 'Hospital' ? '/api/vendor-accept-orderh' : '/api/vendor-accept-orderp';

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId: mongoId }),
      });

      const data = await res.json();
      if (res.ok) {
        alert('Order accepted and dispatched successfully.');
        setOrders((prev) => prev.filter((order) => order._id !== mongoId));
      } else {
        alert(data.error || 'Failed to accept order.');
      }
    } catch (error) {
      console.error('Accept error:', error);
      alert('Error accepting order.');
    }
  };

  const handleReject = async (_id: string, type: 'Hospital' | 'Pharmacy') => {
    const endpoint =
      type === 'Hospital' ? '/api/vendor-reject-orderh' : '/api/vendor-reject-orderp';

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ _id }),
      });

      const data = await res.json();
      if (res.ok) {
        alert('Order rejected successfully.');
        setOrders((prev) => prev.filter((order) => order._id !== _id));
      } else {
        alert(data.error || 'Failed to reject order.');
      }
    } catch (error) {
      console.error('Reject error:', error);
      alert('Error rejecting order.');
    }
  };

  const filteredOrders =
    filteredType === 'All'
      ? orders
      : orders.filter((order) => order.type === filteredType);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-3xl font-bold mb-6 text-blue-700">Received Orders</h1>

      {/* Filter Tabs */}
      <div className="flex gap-4 mb-4">
        {['All', 'Hospital', 'Pharmacy'].map((type) => (
          <button
            key={type}
            onClick={() => setFilteredType(type as 'All' | 'Hospital' | 'Pharmacy')}
            className={`px-4 py-2 rounded-full text-sm font-medium border ${
              filteredType === type
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-white text-blue-700 border-blue-300 hover:bg-blue-50'
            }`}
          >
            {type}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center min-h-[200px]">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : filteredOrders.length === 0 ? (
        <p className="text-gray-600">No pending orders.</p>
      ) : (
        <div className="overflow-x-auto bg-white shadow-md rounded-xl border border-gray-200">
          <table className="min-w-full text-sm text-left">
            <thead className="bg-blue-50 text-blue-800 uppercase text-xs">
              <tr>
                <th className="px-4 py-3">Order ID</th>
                <th className="px-4 py-3">Medicine</th>
                <th className="px-4 py-3">From</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Qty</th>
                <th className="px-4 py-3">Price</th>
                <th className="px-4 py-3">Delivery</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="text-gray-800">
              {filteredOrders.map((order) => (
                <tr
                  key={order._id}
                  className="border-t even:bg-gray-50 hover:bg-gray-100"
                >
                  <td className="px-4 py-3 font-medium">{order.orderId}</td>
                  <td className="px-4 py-3">{order.medicineName}</td>
                  <td className="px-4 py-3">{order.hospitalName}</td>
                  <td className="px-4 py-3">{order.type}</td>
                  <td className="px-4 py-3">{order.quantity}</td>
                  <td className="px-4 py-3">₹{order.totalValue}</td>
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
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => handleAccept(order._id, order.type)}
                        className="bg-green-100 text-green-800 text-xs font-semibold px-3 py-1 rounded-lg hover:bg-green-200 border border-green-300"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => handleReject(order._id, order.type)}
                        className="bg-red-100 text-red-700 text-xs font-semibold px-3 py-1 rounded-lg hover:bg-red-200 border border-red-300"
                      >
                        Reject
                      </button>
                    </div>
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
