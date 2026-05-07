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

  useEffect(() => {
    const fetchDeliveredOrders = async () => {
      try {
        const res = await axios.get('/api/delivered_orders');
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

  const handleUpload = async () => {
    if (!selectedOrder || !receiver || !manufacturer) {
      alert('Please fill all required fields.');
      return;
    }

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

    try {
      setUploading(true);
      await axios.post('/api/upload_pod', formData);
      alert('✅ POD uploaded successfully!');
      setUploadedOrders((prev) => [...prev, selectedOrder.orderId]);
      setSelectedOrder(null);
      setRemarks('');
      setReceiver('');
      setManufacturer('');
      receiverSigRef.current?.clear();
    } catch (err: any) {
      if (err?.response?.status === 409) {
        alert('⚠️ POD already uploaded for this order.');
        setUploadedOrders((prev) => [...prev, selectedOrder.orderId]);
        setSelectedOrder(null);
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
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-gray-100 py-10 px-4">
      <div className="max-w-5xl mx-auto bg-white shadow-xl rounded-2xl p-8">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
          📦 Delivered Orders (POD Upload)
        </h2>

        <div className="overflow-x-auto rounded-lg border border-gray-300 shadow-sm">
          <table className="min-w-full text-sm text-gray-700">
            <thead className="bg-gray-100 text-xs uppercase font-semibold">
              <tr>
                <th className="p-3 text-left">Order ID</th>
                <th className="p-3 text-left">Hospital</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id} className="border-t hover:bg-gray-50 transition">
                  <td className="p-3">{order.orderId}</td>
                  <td className="p-3">{order.hospitalName}</td>
                  <td className="p-3 text-green-600 font-medium">{order.manufacturerStatus}</td>
                  <td className="p-3 text-center">
                    {uploadedOrders.includes(order.orderId) ? (
                      <span className="text-gray-500 text-sm italic">Already Uploaded</span>
                    ) : (
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="text-blue-600 hover:underline text-sm font-semibold"
                      >
                        Generate POD
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {selectedOrder && (
          <div className="mt-8 border-t pt-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-3">
              Selected Order:{' '}
              <span className="text-blue-700">{selectedOrder.orderId}</span> (
              {selectedOrder.hospitalName})
            </h3>

            <div ref={podRef} className="bg-white border p-8 shadow-sm w-[800px] mx-auto">
              <h2 className="text-xl font-bold text-center mb-4">Proof of Delivery (POD)</h2>
              <p><strong>Order ID:</strong> {selectedOrder.orderId}</p>
              <p><strong>Hospital Name:</strong> {selectedOrder.hospitalName}</p>
              <p><strong>Manufacturer Status:</strong> {selectedOrder.manufacturerStatus}</p>
              <p><strong>Date:</strong> {new Date().toLocaleDateString()}</p>

              <label className="block mt-4">
                <strong>Remarks:</strong>
                <textarea
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  placeholder="Any remarks..."
                  className="w-full border mt-1 p-2"
                />
              </label>

              <div className="grid grid-cols-2 gap-4 mt-6">
                <div>
                  <p><strong>Receiver (Hospital)</strong></p>
                  <input
                    type="text"
                    placeholder="Name"
                    className="border w-full p-1 mt-1"
                    value={receiver}
                    onChange={(e) => setReceiver(e.target.value)}
                  />
                  <p className="mt-2">Signature:</p>
                  <SignaturePad
                    ref={receiverSigRef}
                    canvasProps={{
                      width: 250,
                      height: 100,
                      className: 'border rounded bg-white'
                    }}
                  />
                </div>
                <div>
                  <p><strong>Manufacturer</strong></p>
                  <input
                    type="text"
                    placeholder="Name"
                    className="border w-full p-1 mt-1"
                    value={manufacturer}
                    onChange={(e) => setManufacturer(e.target.value)}
                  />
                  <p className="mt-2">Signature: ___________________</p>
                  <p>Date: __ / __ / ____</p>
                </div>
              </div>
            </div>

            <button
              onClick={handleUpload}
              disabled={uploading}
              className="mt-6 bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-md transition disabled:bg-blue-300"
            >
              {uploading ? 'Uploading POD...' : '📤 Upload POD Form'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
