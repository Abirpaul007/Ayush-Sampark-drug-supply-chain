'use client';

import { useEffect, useMemo, useState } from 'react';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { InvoicePDF } from '@/app/ui/InvoicePDF';
import Link from 'next/link';

type OrderType = 'hospital' | 'pharmacy';

interface Order {
  orderId: string;
  medicineName: string;
  hospitalName: string;
  quantity: number;
  manufacturerStatus: string;
  type: OrderType;
}

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
  type: OrderType;
}

const ITEMS_PER_PAGE = 10;

export default function VendorInvoicesPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [invoiceMap, setInvoiceMap] = useState<{ [orderId: string]: Invoice }>({});
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState<'all' | OrderType>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<keyof Order>('orderId');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  useEffect(() => {
    const fetchAllOrders = async () => {
      try {
        const [hospitalRes, pharmacyRes] = await Promise.all([
          fetch('/api/vendor-invoice'),
          fetch('/api/vendor-invoice-pharmacy'),
        ]);

        const hospitalOrders = await hospitalRes.json();
        const pharmacyOrders = await pharmacyRes.json();

        const taggedHospitalOrders = hospitalOrders.map((o: any) => ({ ...o, type: 'hospital' }));
        const taggedPharmacyOrders = pharmacyOrders.map((o: any) => ({ ...o, type: 'pharmacy' }));

        const combined = [...taggedHospitalOrders, ...taggedPharmacyOrders].reverse();
        setOrders(combined);
      } catch (err) {
        setError('Failed to load orders.');
      }

      const saved = localStorage.getItem('generatedInvoices');
      if (saved) {
        setInvoiceMap(JSON.parse(saved));
      }
    };

    fetchAllOrders();
  }, []);

  const handleGenerateInvoice = async (orderId: string, type: OrderType) => {
    setError('');
    try {
      const endpoint =
        type === 'hospital'
          ? `/api/vendor-invoice/${orderId}`
          : `/api/vendor-invoice-pharmacy/${orderId}`;

      const res = await fetch(endpoint);
      const data = await res.json();

      if (!res.ok) throw new Error(data.error);

      const updatedMap = { ...invoiceMap, [orderId]: { ...data, type } };
      setInvoiceMap(updatedMap);
      localStorage.setItem('generatedInvoices', JSON.stringify(updatedMap));
    } catch (err: any) {
      setError(err.message || 'Error generating invoice.');
    }
  };

  const filteredOrders = useMemo(() => {
    return orders
      .filter(o => {
        const matchesSearch =
          o.medicineName.toLowerCase().includes(search.toLowerCase()) ||
          o.hospitalName.toLowerCase().includes(search.toLowerCase());
        const matchesType = filterType === 'all' || o.type === filterType;
        return matchesSearch && matchesType;
      })
      .sort((a, b) => {
        const aVal = a[sortField];
        const bVal = b[sortField];
        if (typeof aVal === 'string') {
          return sortOrder === 'asc'
            ? aVal.localeCompare(bVal as string)
            : (bVal as string).localeCompare(aVal);
        }
        return sortOrder === 'asc'
          ? (aVal as number) - (bVal as number)
          : (bVal as number) - (aVal as number);
      });
  }, [orders, search, sortField, sortOrder, filterType]);

  const totalPages = Math.ceil(filteredOrders.length / ITEMS_PER_PAGE);
  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleSort = (field: keyof Order) => {
    if (sortField === field) {
      setSortOrder(prev => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="bg-white shadow-xl rounded-xl p-6">
        <h1 className="text-4xl font-extrabold text-gray-800 mb-4">Orders Invoice</h1>

        {error && <p className="text-red-600 mb-4 text-sm">{error}</p>}

        {/* Search + Filter */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-4">
          <input
            type="text"
            placeholder="Search medicine or hospital..."
            className="w-full md:max-w-md px-4 py-2 border border-gray-300 rounded shadow-sm focus:outline-none focus:ring focus:border-blue-400"
            value={search}
            onChange={e => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
          />
          <select
            value={filterType}
            onChange={e => {
              setFilterType(e.target.value as any);
              setCurrentPage(1);
            }}
            className="px-4 py-2 border border-gray-300 rounded shadow-sm"
          >
            <option value="all">All</option>
            <option value="hospital">Hospital</option>
            <option value="pharmacy">Pharmacy</option>
          </select>
        </div>

        <div className="overflow-x-auto rounded-md">
          <table className="min-w-full text-sm text-left">
            <thead>
              <tr className="bg-gray-100 text-gray-600">
                {['orderId', 'medicineName', 'Name', 'quantity', 'type'].map((field, idx) => (
                  <th
                    key={idx}
                    className="p-3 cursor-pointer select-none"
                    onClick={() => handleSort(field as keyof Order)}
                  >
                    {field.charAt(0).toUpperCase() + field.slice(1)}{' '}
                    {sortField === field && (sortOrder === 'asc' ? '↑' : '↓')}
                  </th>
                ))}
                <th className="p-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {paginatedOrders.map(o => (
                <tr key={o.orderId} className="hover:bg-gray-50 transition duration-200">
                  <td className="p-3">{o.orderId}</td>
                  <td className="p-3">{o.medicineName}</td>
                  <td className="p-3">{o.hospitalName}</td>
                  <td className="p-3">{o.quantity}</td>
                  <td className="p-3 capitalize">{o.type}</td>
                  <td className="p-3 text-center">
                    {invoiceMap[o.orderId] ? (
                      <PDFDownloadLink
                        document={<InvoicePDF invoice={invoiceMap[o.orderId]} />}
                        fileName={`${invoiceMap[o.orderId].invoiceNumber}.pdf`}
                        className="inline-block px-4 py-1 text-white bg-green-600 hover:bg-green-700 rounded shadow transition"
                      >
                        Download PDF
                      </PDFDownloadLink>
                    ) : (
                      <Link
                        href={`/dashboard/vendor/UploadInvoice/${o.orderId}?type=${o.type}`}
                        className="inline-block px-4 py-1 text-white bg-blue-600 hover:bg-blue-700 rounded shadow transition"
                      >
                        Generate Invoice
                      </Link>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex justify-between items-center mt-6">
          <span className="text-sm text-gray-500">
            Page {currentPage} of {totalPages}
          </span>
          <div className="space-x-2">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
              className="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded disabled:opacity-50"
            >
              Previous
            </button>
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
              className="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
