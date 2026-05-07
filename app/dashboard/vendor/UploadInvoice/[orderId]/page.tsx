"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { InvoicePDF } from "@/app/ui/InvoicePDF";

interface Invoice {
  invoiceNumber: string;
  generatedAt: string;
  vendor: { name: string; email: string };
  order: {
    orderId: string;
    hospital: string;
    medicineName: string;
    quantity: number;
    pricePerUnit: number;
    total: number;
  };
  type: string;
}

export default function UploadInvoiceDetailPage({ params }: { params: { orderId: string } }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = params.orderId;
  const type = searchParams.get("type") as "hospital" | "pharmacy";

  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showDownload, setShowDownload] = useState(false);

  // Fetch order details for display (before invoice generation)
  const [orderDetails, setOrderDetails] = useState<any>(null);
  useEffect(() => {
    async function fetchOrderDetails() {
      setError("");
      setLoading(true);
      try {
        const endpoint =
          type === "hospital"
            ? `/api/vendor-invoice/${orderId}`
            : `/api/vendor-invoice-pharmacy/${orderId}`;
        const res = await fetch(endpoint);
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);
        setOrderDetails(data.order);
      } catch (err: any) {
        setError(err.message || "Failed to fetch order details");
      } finally {
        setLoading(false);
      }
    }
    fetchOrderDetails();
  }, [orderId, type]);

  const handleGenerateInvoice = async () => {
    setError("");
    setLoading(true);
    try {
      const endpoint =
        type === "hospital"
          ? `/api/vendor-invoice/${orderId}`
          : `/api/vendor-invoice-pharmacy/${orderId}`;
      const res = await fetch(endpoint);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setInvoice({ ...data, type });
      setShowDownload(true);
    } catch (err: any) {
      setError(err.message || "Error generating invoice.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-white shadow-xl rounded-xl p-6">
        <button
          className="mb-4 text-blue-600 hover:underline"
          onClick={() => router.back()}
        >
          ← Back
        </button>
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Invoice Details</h1>
        {error && <p className="text-red-600 mb-4 text-sm">{error}</p>}
        {loading && <div className="mb-4 text-gray-500">Loading...</div>}
        {orderDetails && (
          <div className="mb-6">
            <div className="mb-2"><b>Order ID:</b> {orderDetails.orderId}</div>
            <div className="mb-2"><b>Hospital/Pharmacy:</b> {orderDetails.hospital}</div>
            <div className="mb-2"><b>Medicine Name:</b> {orderDetails.medicineName}</div>
            <div className="mb-2"><b>Quantity:</b> {orderDetails.quantity}</div>
            <div className="mb-2"><b>Price Per Unit:</b> ₹{orderDetails.pricePerUnit}</div>
            <div className="mb-2"><b>Total:</b> ₹{orderDetails.total}</div>
          </div>
        )}
        {!showDownload ? (
          <button
            className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded shadow text-lg font-semibold"
            onClick={handleGenerateInvoice}
            disabled={loading}
          >
            Generate Invoice
          </button>
        ) : (
          <PDFDownloadLink
            document={<InvoicePDF invoice={invoice!} />}
            fileName={`${invoice!.invoiceNumber}.pdf`}
            className="w-full block text-center py-2 px-4 bg-green-600 hover:bg-green-700 text-white rounded shadow text-lg font-semibold mt-4"
          >
            Download PDF
          </PDFDownloadLink>
        )}
      </div>
    </div>
  );
} 