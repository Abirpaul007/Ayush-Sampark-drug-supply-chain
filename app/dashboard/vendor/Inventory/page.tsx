'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { saveAs } from 'file-saver';
import { CSVLink } from 'react-csv';
import dayjs from 'dayjs';

interface Medicine {
  _id: string;
  brandName: string;
  genericName: string;
  totalStock: number;
  minOfferPrice: number;
  batches: Batch[];
}

interface Batch {
  _id: string;
  batchNumber: string;
  expiryDate: string;
  manufacturingDate: string;
  stockQuantity: number;
  mrp: number;
  offerPrice: number;
}

export default function ViewInventoryPage() {
  const [inventory, setInventory] = useState<Medicine[]>([]);
  const [openDetails, setOpenDetails] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetch('/api/vendor-inventory')
      .then(res => res.json())
      .then(data => setInventory(data));
  }, []);

  const filteredInventory = inventory.filter((med) =>
    med.brandName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    med.genericName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const headers = [
    { label: 'Medicine', key: 'medicine' },
    { label: 'Batch Number', key: 'batchNumber' },
    { label: 'MFG', key: 'manufacturingDate' },
    { label: 'EXP', key: 'expiryDate' },
    { label: 'Stock', key: 'stockQuantity' },
    { label: 'MRP', key: 'mrp' },
    { label: 'Offer Price', key: 'offerPrice' },
  ];

  const csvData = inventory.flatMap((med) =>
    med.batches.map((batch) => ({
      medicine: `${med.brandName} (${med.genericName})`,
      batchNumber: batch.batchNumber,
      manufacturingDate: batch.manufacturingDate,
      expiryDate: batch.expiryDate,
      stockQuantity: batch.stockQuantity,
      mrp: batch.mrp,
      offerPrice: batch.offerPrice,
    }))
  );

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-4xl font-bold text-blue-700 mb-6 text-center"> My Inventory</h1>

      <div className="flex items-center justify-between mb-4">
        <input
          type="text"
          placeholder="Search medicines..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full max-w-md border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <CSVLink
          headers={headers}
          data={csvData}
          filename="inventory.csv"
          className="ml-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Export CSV
        </CSVLink>
      </div>

      {filteredInventory.length === 0 ? (
        <p className="text-center text-gray-500">No inventory found.</p>
      ) : (
        <div className="space-y-6">
          {filteredInventory.map(med => (
            <motion.div
              key={med._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="border border-gray-200 rounded-2xl p-6 shadow-md bg-white hover:shadow-lg transition-all duration-300"
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-semibold text-blue-800">
                    {med.brandName}{' '}
                    <span className="text-gray-500 text-lg">({med.genericName})</span>
                  </h2>
                  <p className="mt-1 text-sm text-gray-600">
                    Total Stock: <strong>{med.totalStock}</strong> | Starting at ₹{med.minOfferPrice}
                  </p>
                </div>
                <button
                  onClick={() => setOpenDetails(openDetails === med._id ? null : med._id)}
                  className="bg-blue-600 text-white px-5 py-2 rounded-xl hover:bg-blue-700 transition"
                >
                  {openDetails === med._id ? 'Hide Details' : 'View Details'}
                </button>
              </div>

              <AnimatePresence>
                {openDetails === med._id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.4 }}
                    className="mt-4 overflow-hidden"
                  >
                    <h3 className="font-medium mb-2 text-gray-800">Batch Details:</h3>
                    <div className="overflow-auto">
                      <table className="w-full text-sm border border-gray-200 rounded-xl overflow-hidden">
                        <thead>
                          <tr className="bg-blue-50 text-blue-700">
                            <th className="px-4 py-2 text-left">Batch No.</th>
                            <th className="px-4 py-2 text-left">MFG</th>
                            <th className="px-4 py-2 text-left">EXP</th>
                            <th className="px-4 py-2 text-right">Stock</th>
                            <th className="px-4 py-2 text-right">MRP</th>
                            <th className="px-4 py-2 text-right">Offer</th>
                            <th className="px-4 py-2 text-center">Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {med.batches.map((batch, idx) => {
                            const isExpiringSoon = dayjs(batch.expiryDate).diff(dayjs(), 'day') < 30;
                            const isLowStock = batch.stockQuantity < 10;

                            return (
                              <tr key={batch._id} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                <td className="px-4 py-2">{batch.batchNumber}</td>
                                <td className="px-4 py-2">{new Date(batch.manufacturingDate).toLocaleDateString()}</td>
                                <td className={`px-4 py-2 ${isExpiringSoon ? 'text-red-600 font-medium' : ''}`}>{new Date(batch.expiryDate).toLocaleDateString()}</td>
                                <td className={`px-4 py-2 text-right ${isLowStock ? 'text-red-600 font-medium' : ''}`}>{batch.stockQuantity}</td>
                                <td className="px-4 py-2 text-right">₹{batch.mrp}</td>
                                <td className="px-4 py-2 text-right">₹{batch.offerPrice}</td>
                                <td className="px-4 py-2 text-center">
                                  {isExpiringSoon && (
                                    <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full mr-1">Expiring Soon</span>
                                  )}
                                  {isLowStock && (
                                    <span className="bg-red-100 text-red-700 text-xs px-2 py-1 rounded-full">Low Stock</span>
                                  )}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
