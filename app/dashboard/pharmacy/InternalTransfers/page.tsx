'use client';

import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
const SignaturePad = require('react-signature-canvas').default;

interface OrderType {
  _id: string;
  orderId: string;
  hospitalName: string;
  manufacturerStatus: string;
  vendorId: string;
}

export default function UploadPOD() {
  const [orders, setOrders] = useState<OrderType[]>([]);
  const [uploading, setUploading] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<OrderType | null>(null);
  const [uploadedOrders, setUploadedOrders] = useState<string[]>([]);
  const podRef = useRef<HTMLDivElement>(null);
  const [remarks, setRemarks] = useState('');
  const [receiver, setReceiver] = useState('');
  const [manufacturer, setManufacturer] = useState('');
  const receiverSigRef = useRef<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  useEffect(() => {
    const fetchDeliveredOrders = async () => {
      try {
        const res = await axios.get('/api/delivered_ordersp');
        setOrders(res.data);
      } catch (error) {
        console.error('Error fetching delivered orders:', error);
      }
    };

    const fetchUploadedPODs = async () => {
      try {
        const res = await axios.get('/api/fetch_uploaded_pods');
        const uploaded = res.data.map((pod: any) => pod.orderId);
        setUploadedOrders(uploaded);
      } catch (error) {
        console.error('Error fetching uploaded PODs:', error);
      }
    };

    fetchDeliveredOrders();
    fetchUploadedPODs();
  }, []);

  const handleCreatePOD = (order: OrderType) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedOrder(null);
    setRemarks('');
    setReceiver('');
    setManufacturer('');
    if (receiverSigRef.current) {
      receiverSigRef.current.clear();
    }
  };

  const handleUpload = async () => {
    if (!selectedOrder || !receiver || !manufacturer) {
      alert('Please fill all required fields.');
      return;
    }

    try {
      setUploading(true);
      
      const canvas = await html2canvas(podRef.current!, {
        scrollY: -window.scrollY,
        backgroundColor: '#ffffff',
        windowWidth: podRef.current!.scrollWidth,
        height: podRef.current!.scrollHeight,
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF();
      const pageWidth = pdf.internal.pageSize.getWidth();
      const aspectRatio = canvas.width / canvas.height;
      const pdfWidth = pageWidth - 20;
      const pdfHeight = pdfWidth / aspectRatio;

      pdf.addImage(imgData, 'PNG', 10, 10, pdfWidth, pdfHeight);

      const receiverSigURL = receiverSigRef.current?.getTrimmedCanvas().toDataURL('image/png');
      if (receiverSigURL) {
        pdf.addImage(receiverSigURL, 'PNG', 30, pdfHeight + 20, 60, 30);
      }

      const pdfBlob = pdf.output('blob');

      const formData = new FormData();
      formData.append('file', pdfBlob, `${selectedOrder.orderId}_pod.pdf`);
      formData.append('orderId', selectedOrder.orderId);
      formData.append('hospitalId', selectedOrder.hospitalName);
      formData.append('vendorId', selectedOrder.vendorId);
      formData.append('remarks', remarks);
      formData.append('receiverName', receiver);
      formData.append('manufacturerName', manufacturer);

      await axios.post('/api/upload_podp', formData);
      
      alert('✅ POD uploaded successfully!');
      setUploadedOrders((prev) => [...prev, selectedOrder.orderId]);
      closeModal();
    } catch (err: any) {
      if (err?.response?.status === 409) {
        alert('⚠️ POD already uploaded for this order.');
        setUploadedOrders((prev) => [...prev, selectedOrder.orderId]);
        closeModal();
      } else if (err?.response?.data?.error) {
        alert('❌ Error: ' + err.response.data.error);
      } else {
        alert('❌ Upload failed. Please try again.');
      }
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Blue Header with Rounded Bottom Corners */}
      <header className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-2 rounded-xl mb-4">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div className="mb-4 md:mb-0">
              <h1 className="text-2xl md:text-3xl font-bold text-white">Proof of Delivery</h1>
              <p className="mt-1 text-sm text-blue-100">Manage and upload delivery confirmations</p>
            </div>
            <div className="bg-blue-500 text-white px-4 py-2 rounded-full text-sm font-medium shadow-sm">
              {orders.length} {orders.length === 1 ? 'Order' : 'Orders'}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Orders Card */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8 border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <h2 className="text-xl font-semibold text-gray-800">Delivered Orders</h2>
            <p className="text-sm text-gray-500">Orders ready for POD confirmation</p>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order ID
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Pharmacy
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {orders.length > 0 ? (
                  orders.map((order) => (
                    <tr key={order._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-blue-600">{order.orderId}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{order.hospitalName}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          {order.manufacturerStatus}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
  <div className="flex items-center justify-center">
    {uploadedOrders.includes(order.orderId) ? (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
        <svg className="-ml-0.5 mr-1.5 h-2 w-2 text-blue-400" fill="currentColor" viewBox="0 0 8 8">
          <circle cx="4" cy="4" r="3" />
        </svg>
        POD Uploaded
      </span>
    ) : (
      <button
        onClick={() => handleCreatePOD(order)}
        className="text-blue-600 hover:text-blue-900 hover:underline flex items-center"
      >
        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
        </svg>
        Create POD
      </button>
    )}
  </div>
</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="px-6 py-4 text-center">
                      <div className="text-sm text-gray-500 py-8">
                        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                        </svg>
                        <h3 className="mt-2 text-sm font-medium text-gray-900">No delivered orders</h3>
                        <p className="mt-1 text-sm text-gray-500">Delivered orders will appear here</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* POD Modal */}
        {isModalOpen && selectedOrder && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
              {/* Background overlay */}
              <div 
                className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" 
                onClick={closeModal}
                aria-hidden="true"
              ></div>

              {/* Modal container */}
              <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-5xl sm:w-full">
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold text-gray-800">
                      <span className="text-blue-600">POD Form</span> for Order #{selectedOrder.orderId}
                    </h2>
                    <button
                      onClick={closeModal}
                      className="text-gray-400 hover:text-gray-500 focus:outline-none"
                    >
                      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>

                  {/* POD Form Content */}
                  <div ref={podRef} className="bg-white border border-gray-200 rounded-lg p-8 max-w-4xl mx-auto">
                    <div className="text-center mb-8">
                      <h3 className="text-2xl font-bold text-gray-800">PROOF OF DELIVERY</h3>
                      <div className="w-32 h-1 bg-blue-500 mx-auto mt-2"></div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                      <div className="space-y-2">
                        <p className="font-medium text-gray-700">Order ID:</p>
                        <p className="text-gray-900 font-semibold">{selectedOrder.orderId}</p>
                      </div>
                      <div className="space-y-2">
                        <p className="font-medium text-gray-700">Pharmacy Name:</p>
                        <p className="text-gray-900 font-semibold">{selectedOrder.hospitalName}</p>
                      </div>
                      <div className="space-y-2">
                        <p className="font-medium text-gray-700">Status:</p>
                        <p className="text-gray-900 font-semibold">{selectedOrder.manufacturerStatus}</p>
                      </div>
                      <div className="space-y-2">
                        <p className="font-medium text-gray-700">Delivery Date:</p>
                        <p className="text-gray-900 font-semibold">{new Date().toLocaleDateString()}</p>
                      </div>
                    </div>

                    <div className="mb-8">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Remarks</label>
                      <textarea
                        value={remarks}
                        onChange={(e) => setRemarks(e.target.value)}
                        placeholder="Enter any delivery remarks..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        rows={3}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      {/* Receiver Section */}
                      <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                        <h4 className="text-lg font-medium text-gray-800 mb-4 flex items-center">
                          <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                          </svg>
                          Receiver (Pharmacy)
                        </h4>
                        <div className="mb-4">
                          <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                          <input
                            type="text"
                            value={receiver}
                            onChange={(e) => setReceiver(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Enter receiver name"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Signature *</label>
                          <div className="border border-gray-300 rounded-md p-2 bg-white">
                            <SignaturePad
                              ref={receiverSigRef}
                              canvasProps={{
                                width: 300,
                                height: 120,
                                className: 'w-full bg-white signature-pad'
                              }}
                            />
                          </div>
                          <button 
                            onClick={() => receiverSigRef.current?.clear()}
                            className="mt-2 text-sm text-blue-600 hover:text-blue-800 flex items-center"
                          >
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                            </svg>
                            Clear Signature
                          </button>
                        </div>
                      </div>

                      {/* Manufacturer Section */}
                      <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                        <h4 className="text-lg font-medium text-gray-800 mb-4 flex items-center">
                          <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                          </svg>
                          Manufacturer
                        </h4>
                        <div className="mb-4">
                          <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                          <input
                            type="text"
                            value={manufacturer}
                            onChange={(e) => setManufacturer(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Enter manufacturer name"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Signature</label>
                          <div className="h-32 border border-gray-300 rounded-md flex items-center justify-center text-gray-400 bg-white">
                            (Manufacturer to sign upon receipt)
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Modal Footer */}
                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    onClick={handleUpload}
                    disabled={uploading}
                    className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 ${uploading ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'} text-base font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm`}
                  >
                    {uploading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Uploading...
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                        </svg>
                        Upload POD
                      </>
                    )}
                  </button>
                  <button
                    onClick={closeModal}
                    type="button"
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}




