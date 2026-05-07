'use client';

import { useState, useEffect, useMemo } from 'react';
import { FiSearch, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import {  FaPills } from 'react-icons/fa';

interface Medicine {
  _id: string;
  brandName: string;
  genericName: string;
  form: string;
  strength: string;
  vendorName: string;
  totalStock: number;
  mrp: number;
  minOfferPrice: number;
}

export default function OrderPage() {
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 30;

  const stats = useMemo(() => {
    const totalDrugs = medicines.length;
    const totalStock = medicines.reduce((sum, med) => sum + (med.totalStock || 0), 0);
    const lowStock = medicines.filter(med => (med.totalStock || 0) < 100).length;

    return {
      totalDrugs,
      totalStock,
      lowStock,
    };
  }, [medicines]);

  useEffect(() => {
    fetch('/api/medicines/public')
      .then(res => res.json())
      .then(data => {
        setMedicines(data);
        setIsLoading(false);
      })
      .catch(error => {
        console.error('Error fetching medicines:', error);
        setIsLoading(false);
      });
  }, []);

  const filteredMedicines = useMemo(() => {
    return medicines.filter(med => 
      med.brandName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      med.genericName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      med.vendorName?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [medicines, searchTerm]);

  const paginatedMedicines = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredMedicines.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredMedicines, currentPage]);

  const totalPages = Math.ceil(filteredMedicines.length / itemsPerPage);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-gradient-to-r from-red-600 to-indigo-600 rounded-xl shadow-lg p-6 mb-8">
  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
    <div>
      <h1 className="text-2xl md:text-3xl font-bold text-white flex items-center">
        <FaPills className="mr-3 text-blue-200" />
        Medicine Inventory
      </h1>
      <p className="text-blue-100 mt-1">Manage and track your medicine stock</p>
    </div>
    
    <div className="relative w-full md:w-80">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <FiSearch className="text-grey-200" />
      </div>
      <input
        type="text"
        className="block w-full pl-10 pr-3 py-2 border border-blue-400 rounded-lg bg-white bg-opacity-90 shadow-sm focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent placeholder-grey-300"
        placeholder="Search medicines..."
        value={searchTerm}
        onChange={(e) => {
          setSearchTerm(e.target.value);
          setCurrentPage(1);
        }}
      />
    </div>
  </div>
</div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Medicines</p>
                <p className="text-2xl font-semibold text-gray-900 mt-1">{stats.totalDrugs}</p>
              </div>
              <div className="p-3 rounded-lg bg-blue-50 text-blue-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Stock</p>
                <p className="text-2xl font-semibold text-gray-900 mt-1">{stats.totalStock}</p>
              </div>
              <div className="p-3 rounded-lg bg-green-50 text-green-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                </svg>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Low Stock (&lt;100)</p>
                <p className="text-2xl font-semibold text-gray-900 mt-1">{stats.lowStock}</p>
              </div>
              <div className="p-3 rounded-lg bg-yellow-50 text-yellow-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Medicine Table */}
        <div className="bg-white shadow-sm rounded-xl border border-gray-100 overflow-hidden mb-6">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Brand Name
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Generic Name
                  </th>
                  
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Strength
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Vendor
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Stock
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    MRP
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Offer Price
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {paginatedMedicines.map((medicine) => (
                  <tr key={medicine._id} className="hover:bg-gray-50 transition-colors duration-150">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {medicine.brandName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {medicine.genericName}
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {medicine.strength}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {medicine.vendorName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${medicine.totalStock > 100 ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                        {medicine.totalStock}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      ₹{medicine.mrp}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                      ₹{medicine.minOfferPrice}
                    </td>
                  </tr>
                ))}
                {paginatedMedicines.length === 0 && (
                  <tr>
                    <td colSpan={8} className="px-6 py-8 text-center text-gray-500">
                      No medicines found matching your search.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        {filteredMedicines.length > itemsPerPage && (
          <div className="flex items-center justify-between px-4 py-3 bg-white border-t border-gray-200 sm:px-6 rounded-b-lg">
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> to{' '}
                  <span className="font-medium">{Math.min(currentPage * itemsPerPage, filteredMedicines.length)}</span> of{' '}
                  <span className="font-medium">{filteredMedicines.length}</span> results
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium 
                      ${currentPage === 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-50'}`}
                  >
                    <span className="sr-only">Previous</span>
                    <FiChevronLeft className="h-5 w-5" aria-hidden="true" />
                  </button>
                  
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }
                    
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium 
                          ${currentPage === pageNum ? 'z-10 bg-blue-50 border-blue-500 text-blue-600' : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'}`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                  
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium 
                      ${currentPage === totalPages ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-50'}`}
                  >
                    <span className="sr-only">Next</span>
                    <FiChevronRight className="h-5 w-5" aria-hidden="true" />
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}