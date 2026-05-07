'use client';

import { useEffect, useState } from 'react';
import { Package, AlertCircle, CheckCircle, Loader2, Box } from 'lucide-react';

interface InventoryItem {
  medicineId: string;
  medicineName: string;
  totalStock: number;
  lastOrderedDate: string;
}

export default function PharmacyInventoryPage() {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/pharmacy-inventory')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setInventory(data);
        } else {
          console.error('Invalid inventory format', data);
        }
      })
      .catch(err => {
        console.error('Inventory fetch failed:', err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <div className="p-4 min-h-screen bg-gray-50">
      {/* Blue Header Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-6 rounded-xl mb-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold">Pharmacy Inventory</h1>
              <p className="text-blue-100">Detailed view of all inventory entities</p>
            </div>
            
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto">
        {/* Inventory Table Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {loading ? (
            <div className="p-8 flex flex-col items-center justify-center">
              <Loader2 className="w-10 h-10 text-gray-400 animate-spin mb-4" />
              <p className="text-gray-600">Loading inventory data...</p>
            </div>
          ) : inventory.length === 0 ? (
            <div className="p-8 text-center">
              <Box className="h-16 w-16 mx-auto text-gray-400" strokeWidth={1.5} />
              <h3 className="mt-4 text-lg font-medium text-gray-900">No inventory items found</h3>
              <p className="mt-1 text-gray-500">Add items to start managing your pharmacy inventory</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Medicine ID
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Medicine Name
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Stock Level
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Last Ordered
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {inventory.map((item) => (
                      <tr key={item.medicineId} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-500">
                          {item.medicineId}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {item.medicineName}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            item.totalStock < 10 ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                          }`}>
                            {item.totalStock} units
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(item.lastOrderedDate).toLocaleDateString('en-IN')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {item.totalStock < 10 ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                              <AlertCircle className="h-3.5 w-3.5" />
                              Low Stock
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              <CheckCircle className="h-3.5 w-3.5" />
                              In Stock
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="text-sm text-gray-500">
                    Showing <span className="font-medium">{inventory.length}</span> items
                  </div>
                  <div className="flex gap-2">
                    <button className="px-3 py-1 border rounded-md hover:bg-gray-100 text-gray-700">
                      Previous
                    </button>
                    <button className="px-3 py-1 border rounded-md bg-blue-600 text-white">
                      1
                    </button>
                    <button className="px-3 py-1 border rounded-md hover:bg-gray-100 text-gray-700">
                      Next
                    </button>
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