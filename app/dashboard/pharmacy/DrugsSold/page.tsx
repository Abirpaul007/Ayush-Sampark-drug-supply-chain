'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';

interface Medicine {
  medicineId: string;
  medicineName: string;
  totalStock: number;
}

interface SoldRecord {
  medicineId: string;
  medicineName: string;
  quantity: number;
  date: string;
}

interface SoldRecordsResponse {
  data: SoldRecord[];
  total: number;
  page: number;
  totalPages: number;
}

export default function PharmacySoldPage() {
  const { data: session } = useSession();
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [selectedMedicineId, setSelectedMedicineId] = useState('');
  const [quantity, setQuantity] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [soldRecords, setSoldRecords] = useState<SoldRecordsResponse>({
    data: [],
    total: 0,
    page: 1,
    totalPages: 1,
  });
  const [filters, setFilters] = useState({
    medicineId: '',
    startDate: '',
    endDate: '',
  });
  const recordsPerPage = 10; // Increased from 5 to 10

  const buildQueryString = () => {
    const params = new URLSearchParams();
    params.append('page', soldRecords.page.toString());
    params.append('limit', recordsPerPage.toString());
    
    if (filters.medicineId) params.append('medicineId', filters.medicineId);
    if (filters.startDate) params.append('startDate', filters.startDate);
    if (filters.endDate) params.append('endDate', filters.endDate);
    
    return params.toString();
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch inventory
      const inventoryRes = await fetch('/api/pharmacy-inventory');
      if (!inventoryRes.ok) throw new Error('Failed to fetch inventory');
      const inventoryData = await inventoryRes.json();
      
      if (Array.isArray(inventoryData)) {
        setMedicines(inventoryData);
      } else {
        throw new Error('Invalid inventory data format');
      }

      // Fetch sold records with filters and pagination
      const queryString = buildQueryString();
      const soldRes = await fetch(`/api/pharmacy-sold-records?${queryString}`);
      if (!soldRes.ok) throw new Error('Failed to fetch sold records');
      const soldData: SoldRecordsResponse = await soldRes.json();
      setSoldRecords(soldData);
      
    } catch (err) {
      console.error('Error fetching data:', err);
      setMessage({ 
        text: err instanceof Error ? err.message : 'Error loading data',
        type: 'error' 
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [soldRecords.page, filters]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const parsedQty = parseInt(quantity);
    if (!selectedMedicineId || !parsedQty || parsedQty <= 0) {
      setMessage({ 
        text: 'Please select a medicine and enter a valid quantity', 
        type: 'error' 
      });
      return;
    }

    setLoading(true);
    setMessage({ text: '', type: '' });

    try {
      const res = await fetch('/api/pharmacy-sold', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${(session as any)?.accessToken}` 
        },
        body: JSON.stringify({
          medicineId: selectedMedicineId,
          quantity: parsedQty,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit dispense record');
      }

      setMessage({ 
        text: 'Dispense record updated successfully!', 
        type: 'success' 
      });
      setQuantity('');
      setSelectedMedicineId('');
      await fetchData(); // Refresh all data after update
    } catch (err) {
      console.error('Submit error:', err);
      setMessage({ 
        text: err instanceof Error ? err.message : 'An error occurred',
        type: 'error' 
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFilterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSoldRecords(prev => ({ ...prev, page: 1 }));
  };

  const handleResetFilters = () => {
    setFilters({
      medicineId: '',
      startDate: '',
      endDate: '',
    });
    setSoldRecords(prev => ({ ...prev, page: 1 }));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="bg-white rounded-2xl shadow-md p-6 backdrop-blur-sm bg-opacity-90">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-1">
               Dispense Management
              </h1>
              <p className="text-gray-600 font-medium">
                {session?.user?.name ? `Welcome back, ${session.user.name}` : 'Track and manage medicine dispenses'}
              </p>
            </div>
            <div className="mt-4 md:mt-0">
              <div className="flex items-center space-x-2 bg-blue-50 px-4 py-2 rounded-full">
                <div className="h-3 w-3 bg-blue-500 rounded-full"></div>
                <span className="text-sm font-medium text-blue-800">
                  {medicines.length} types of medicines in inventory
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Dispense Form Card */}
        <div className="bg-white rounded-2xl shadow-md overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-blue-500 p-6">
            <h2 className="text-xl font-semibold text-white">
              Record New Dispense
            </h2>
          </div>
          
          <div className="p-6">
            {medicines.length === 0 ? (
              <div className="text-center py-8">
                <div className="mx-auto h-12 w-12 text-gray-400 mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="text-gray-500 font-medium">
                  {loading ? 'Loading medicines...' : 'No medicines available in inventory'}
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Select Medicine
                    </label>
                    <div className="relative">
                      <select
                        className="w-full pl-4 pr-10 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white"
                        value={selectedMedicineId}
                        onChange={(e) => setSelectedMedicineId(e.target.value)}
                        required
                        disabled={loading}
                      >
                        <option value="">Choose a medicine</option>
                        {medicines.map((med) => (
                          <option 
                            key={med.medicineId} 
                            value={med.medicineId}
                            disabled={med.totalStock <= 0}
                          >
                            {med.medicineName} 
                            {med.totalStock <= 0 ? ' (Out of stock)' : ` (${med.totalStock} available)`}
                          </option>
                        ))}
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                        <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Quantity Dispensed
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        placeholder="Enter quantity"
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                        min={1}
                        disabled={loading}
                      />
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        <span className="text-gray-500 text-sm">units</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={loading}
                    className={`py-3 px-6 rounded-xl font-semibold text-white transition-all ${
                      loading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 hover:shadow-md'
                    } flex items-center justify-center space-x-2`}
                  >
                    {loading ? (
                      <>
                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span>Processing...</span>
                      </>
                    ) : (
                      <>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                        </svg>
                        <span>Record Dispense</span>
                      </>
                    )}
                  </button>
                </div>

                {message.text && (
                  <div className={`p-4 rounded-lg ${
                    message.type === 'error' ? 'bg-red-50 text-red-700 border border-red-100' : 'bg-green-50 text-green-700 border border-green-100'
                  }`}>
                    <div className="flex items-start space-x-2">
                      <div className={`flex-shrink-0 ${message.type === 'error' ? 'text-red-500' : 'text-green-500'}`}>
                        {message.type === 'error' ? (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                          </svg>
                        ) : (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                      <div>
                        <p className="font-medium">{message.text}</p>
                      </div>
                    </div>
                  </div>
                )}
              </form>
            )}
          </div>
        </div>

        {/* Dispense Records Card */}
        <div className="bg-white rounded-2xl shadow-md overflow-hidden">
          <div className="bg-gradient-to-r from-gray-800 to-gray-700 p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <h2 className="text-xl font-semibold text-white">
                Dispense History
              </h2>
              <div className="flex items-center space-x-2 mt-4 md:mt-0">
                <span className="text-sm font-medium text-gray-300">
                  {soldRecords.total} total records
                </span>
              </div>
            </div>
          </div>

          <div className="p-6">
            {/* Filter Form */}
            <form onSubmit={handleFilterSubmit} className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Medicine</label>
                <select
                  name="medicineId"
                  value={filters.medicineId}
                  onChange={handleFilterChange}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                >
                  <option value="">All Medicines</option>
                  {medicines.map(med => (
                    <option key={med.medicineId} value={med.medicineId}>
                      {med.medicineName}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">From Date</label>
                <input
                  type="date"
                  name="startDate"
                  value={filters.startDate}
                  onChange={handleFilterChange}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">To Date</label>
                <input
                  type="date"
                  name="endDate"
                  value={filters.endDate}
                  onChange={handleFilterChange}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div className="flex items-end space-x-2">
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                >
                  Apply
                </button>
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
                >
                  Reset
                </button>
              </div>
            </form>

            {/* Pagination Controls - Top */}
            <div className="flex items-center justify-between mb-4">
              <div className="text-sm text-gray-500">
                Showing {(soldRecords.page - 1) * recordsPerPage + 1} to {Math.min(soldRecords.page * recordsPerPage, soldRecords.total)} of {soldRecords.total} records
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => setSoldRecords(prev => ({ ...prev, page: Math.max(prev.page - 1, 1) }))}
                  disabled={soldRecords.page === 1 || loading}
                  className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Previous
                </button>
                <button
                  onClick={() => setSoldRecords(prev => ({ ...prev, page: prev.page + 1 }))}
                  disabled={soldRecords.page >= soldRecords.totalPages || loading}
                  className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Next
                </button>
              </div>
            </div>

            {/* Records Table */}
            <div className="overflow-auto border border-gray-200 rounded-xl">
              {loading && soldRecords.data.length === 0 ? (
                <div className="h-64 flex items-center justify-center">
                  <div className="animate-pulse flex flex-col items-center">
                    <div className="h-12 w-12 bg-gray-200 rounded-full mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                  </div>
                </div>
              ) : soldRecords.data.length === 0 ? (
                <div className="h-64 flex items-center justify-center">
                  <div className="text-center">
                    <div className="mx-auto h-12 w-12 text-gray-400 mb-4">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-1">No records found</h3>
                    <p className="text-gray-500">Try adjusting your filters or record a new dispense</p>
                  </div>
                </div>
              ) : (
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Medicine
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Quantity
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {soldRecords.data.map((record, index) => (
                      <tr key={index} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                              </svg>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{record.medicineName}</div>
                              <div className="text-sm text-gray-500">ID: {record.medicineId}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900 font-medium">{record.quantity}</div>
                          <div className="text-xs text-gray-500">units</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{formatDate(record.date)}</div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            {/* Pagination Controls - Bottom */}
            <div className="flex items-center justify-between mt-4">
              <div className="text-sm text-gray-500">
                Page {soldRecords.page} of {soldRecords.totalPages}
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => setSoldRecords(prev => ({ ...prev, page: Math.max(prev.page - 1, 1) }))}
                  disabled={soldRecords.page === 1 || loading}
                  className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Previous
                </button>
                <button
                  onClick={() => setSoldRecords(prev => ({ ...prev, page: prev.page + 1 }))}
                  disabled={soldRecords.page >= soldRecords.totalPages || loading}
                  className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}