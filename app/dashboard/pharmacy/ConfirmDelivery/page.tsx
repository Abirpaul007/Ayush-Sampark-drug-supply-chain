'use client';

import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import ConnectWallet from '@/app/components/ConnectWallet/page';

// Import ABI with explicit typing
import DeliveredOrdersABI from '@/contracts/DeliveredOrders.json';

interface Order {
  _id: string;
  orderId: string;
  medicineName: string;
  quantity: number;
  deliveryDate: string;
  manufacturerStatus: string;
  totalValue: number;
}

const CONTRACT_ADDRESS = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512"; // Replace with actual deployed address

export default function TrackOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/pharmacy-out-for-delivery');
      const data = await res.json();
      setOrders(data.orders || []);
      setFilteredOrders(data.orders || []);
    } catch (err) {
      console.error('Failed to fetch orders', err);
    }
    setLoading(false);
  };

  const markAsDelivered = async (orderId: string) => {
    try {
      const res = await fetch('/api/pharmacy-mark-delivered', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId }),
      });

      const data = await res.json();

      if (!res.ok) {
        console.error('❌ hospital-mark-delivered error:', data);
        alert(data.error || 'Failed to update order');
        return;
      }

      alert('✅ Order marked as Delivered');

      const extra = await fetch(`/api/order-detailsp?orderId=${orderId}`);
      if (!extra.ok) {
        const errData = await extra.json();
        throw new Error(errData.error || 'Error fetching order details');
      }

      const { hospitalName, medicineId, vendorId, vendorName } = await extra.json();
      const order = orders.find((o) => o.orderId === orderId);
      if (!order) return;

      if ((window as any).ethereum) {
        const provider = new ethers.BrowserProvider((window as any).ethereum);
        const signer = await provider.getSigner();
        const contract = new ethers.Contract(CONTRACT_ADDRESS, DeliveredOrdersABI, signer);

        const tx = await contract.addDeliveredOrder(
          order.orderId,
          hospitalName,
          medicineId,
          order.medicineName,
          order.quantity,
          vendorId,
          vendorName
        );

        await tx.wait();
        alert("📜 Order saved to blockchain!");
        fetchOrders();
      } else {
        alert("Please install MetaMask to record delivery on blockchain.");
      }
    } catch (err: any) {
      console.error('Update failed ❌', err);
      alert(`❌ Failed to update order: ${err.message || err}`);
    }
  };

  const handleSearch = (value: string) => {
    setSearch(value);
    const lower = value.toLowerCase();
    const filtered = orders.filter(
      (o) =>
        o.medicineName.toLowerCase().includes(lower) ||
        o.orderId.toLowerCase().includes(lower)
    );
    setFilteredOrders(filtered);
    setCurrentPage(1);
  };

  const exportToCSV = () => {
    const csv = [
      ['Order ID', 'Medicine Name', 'Quantity', 'Delivery Date', 'Total Value'],
      ...filteredOrders.map((o) => [
        o.orderId,
        o.medicineName,
        o.quantity,
        new Date(o.deliveryDate).toLocaleDateString(),
        o.totalValue,
      ]),
    ]
      .map((row) => row.join(','))
      .join('\n');

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'orders.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const displayedOrders = filteredOrders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-xl shadow-lg mb-8 p-6 text-white">
          <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-white">Order Tracking Dashboard</h1>
              <p className="mt-2 text-sm text-gray-200">Monitor and manage incoming pharmaceutical deliveries</p>
            </div>
          <div className="flex flex-col space-y-3 sm:flex-row sm:space-y-0 sm:space-x-3">
            <ConnectWallet />
            <div className="relative">
              <input
                type="text"
                placeholder="Search orders..."
                value={search}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-10 pr-4 py-2 w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
            <button
              onClick={exportToCSV}
              className="flex items-center justify-center px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <svg className="h-5 w-5 mr-2 text-grey-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Export
            </button>
          </div>
        </div>
        </div>

        {/* Main Content */}
        <div className="bg-white shadow-xl rounded-xl overflow-hidden">
          {loading ? (
            <div className="p-12 flex flex-col items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
              <p className="text-gray-600">Loading order data...</p>
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="p-12 text-center">
              <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <h3 className="mt-4 text-lg font-medium text-gray-900">No orders found</h3>
              <p className="mt-1 text-sm text-gray-500">Try adjusting your search or check back later.</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Order ID
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Medicine
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Quantity
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Delivery Date
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Value
                      </th>
                      <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {displayedOrders.map((order) => (
                      <tr key={order._id} className="hover:bg-gray-50 transition-colors duration-150">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 font-mono">
                          {order.orderId}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                              <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                              </svg>
                            </div>
                            {order.medicineName}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            {order.quantity} units
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(order.deliveryDate).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          ₹{order.totalValue.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            order.manufacturerStatus === 'Delivered' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {order.manufacturerStatus}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                          <button
                            onClick={() => markAsDelivered(order.orderId)}
                            className="text-blue-600 hover:text-blue-900 bg-blue-50 hover:bg-blue-100 px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
                          >
                            Confirm Delivery
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="bg-gray-50 px-6 py-3 flex items-center justify-between border-t border-gray-200">
                <div className="flex-1 flex justify-between items-center sm:hidden">
                  <button
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                  >
                    Previous
                  </button>
                  <span className="text-sm text-gray-700">
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-gray-700">
                      Showing <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> to{' '}
                      <span className="font-medium">{Math.min(currentPage * itemsPerPage, filteredOrders.length)}</span> of{' '}
                      <span className="font-medium">{filteredOrders.length}</span> results
                    </p>
                  </div>
                  <div>
                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                      <button
                        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                      >
                        <span className="sr-only">Previous</span>
                        <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                          <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </button>
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                            currentPage === page
                              ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                              : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                          }`}
                        >
                          {page}
                        </button>
                      ))}
                      <button
                        onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                      >
                        <span className="sr-only">Next</span>
                        <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                          <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </nav>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}