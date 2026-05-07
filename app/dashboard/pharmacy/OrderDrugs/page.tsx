'use client';

import { useEffect, useState } from 'react';

interface MedicineTile {
  _id: string;
  medicineId: string;
  vendorId: string;
  brandName: string;
  genericName: string;
  vendorName: string;
  minOfferPrice: number;
  totalStock: number;
  mrp: number;
  productImage?: string;
  description?: string;
  shortDescription?: string;
  detailedDescription?: string;
  strength?: string;
  form?: string;
  dosageForm?: string;
  manufacturer?: string;
  packSize?: string;
  licenseNumber?: string;
  storageConditions?: string;
}

export default function OrderPage() {
  const [medicines, setMedicines] = useState<MedicineTile[]>([]);
  const [filtered, setFiltered] = useState<MedicineTile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedMedicine, setSelectedMedicine] = useState<MedicineTile | null>(null);
  const [hospitalName, setHospitalName] = useState<string | null>(null);
  const [deliveryDate, setDeliveryDate] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [totalPrice, setTotalPrice] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000]);

  useEffect(() => {
    const fetchHospitalName = async () => {
      try {
        const res = await fetch('/api/auth/session');
        const data = await res.json();
        setHospitalName(data?.user?.name || '');
      } catch (error) {
        console.error('Failed to fetch hospital name:', error);
      }
    };
    fetchHospitalName();
  }, []);

  useEffect(() => {
    fetch('/api/medicines/public')
      .then((res) => res.json())
      .then((data) => {
        setMedicines(data);
        setFiltered(data);
        setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    if (!selectedMedicine || quantity <= 0) {
      setTotalPrice(null);
      return;
    }

    const fetchPrice = async () => {
      try {
        const res = await fetch(
          `/api/orderp/fifo-price?medicineId=${selectedMedicine.medicineId}&quantity=${quantity}`
        );
        const data = await res.json();
        if (res.ok) {
          setTotalPrice(data.totalPrice);
        } else {
          setTotalPrice(null);
        }
      } catch (err) {
        setTotalPrice(null);
      }
    };

    fetchPrice();
  }, [quantity, selectedMedicine]);

  useEffect(() => {
    const lower = searchTerm.toLowerCase();
    const [min, max] = priceRange;

    const filteredList = medicines.filter(
      (m) =>
        (m.brandName.toLowerCase().includes(lower) ||
          m.genericName.toLowerCase().includes(lower) ||
          m.vendorName.toLowerCase().includes(lower)) &&
        m.minOfferPrice >= min &&
        m.minOfferPrice <= max
    );
    setFiltered(filteredList);
  }, [searchTerm, priceRange, medicines]);

  const handlePlaceOrder = async () => {
    if (!selectedMedicine || !hospitalName?.trim() || !deliveryDate || quantity <= 0) {
      alert('Please fill all fields correctly.');
      return;
    }

    const payload = {
      medicineId: selectedMedicine.medicineId,
      vendorId: selectedMedicine.vendorId,
      hospitalName,
      deliveryDate,
      quantity,
    };

    try {
      const res = await fetch('/api/orderp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const result = await res.json();
      if (res.ok) {
        alert('Order placed successfully!');
        setSelectedMedicine(null);
        setDeliveryDate('');
        setQuantity(1);
        setTotalPrice(null);
      } else {
        alert(result.error || 'Failed to place order');
      }
    } catch (error) {
      console.error('Order error:', error);
      alert('An error occurred while placing the order.');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-white">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600 mb-4"></div>
          <p className="text-gray-600">Loading medicines...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      {/* Blue Header Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-8 px-4  rounded-t-xl sm:px-6 lg:px-8 shadow-md">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div>
              <h1 className="text-3xl font-bold">Order Medicines</h1>
              <p className="text-blue-100 mt-1">Browse and order from available stock</p>
            </div>
          </div>
        </div>
      </div>

      <div className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Filters */}
          <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Search Medicines</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search by name, generic or vendor..."
                    className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Price Range: ₹{priceRange[0]} - ₹{priceRange[1]}
                </label>
                <div className="flex items-center space-x-4">
                  <input
                    type="range"
                    min={0}
                    max={10000}
                    step={50}
                    value={priceRange[1]}
                    onChange={(e) =>
                      setPriceRange([priceRange[0], parseInt(e.target.value) || 0])
                    }
                    className="w-full h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <span className="text-sm text-gray-600 min-w-[80px]">₹{priceRange[1]}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Medicines Grid */}
          {filtered.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filtered.map((medicine) => (
                <div
                  key={medicine._id}
                  className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-all duration-200 border border-gray-100"
                >
                  <div className="h-48 bg-gray-50 flex items-center justify-center p-4">
                    <img
                      src={medicine.productImage || '/placeholder-medicine.jpg'}
                      alt={medicine.brandName}
                      className="h-full w-full object-contain"
                    />
                  </div>
                  <div className="p-5">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold text-gray-900 truncate">{medicine.brandName}</h3>
                        <p className="text-sm text-gray-500 mt-1">{medicine.genericName}</p>
                      </div>
                      <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                        {medicine.totalStock} in stock
                      </span>
                    </div>
                    <div className="mt-3 flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-500">Vendor: {medicine.vendorName}</p>
                        <p className="text-lg font-bold text-green-600 mt-1">₹{medicine.minOfferPrice}</p>
                      </div>
                      <button
                        onClick={() => setSelectedMedicine(medicine)}
                        className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-300 transition-colors"
                      >
                        Order
                        <svg className="w-4 h-4 ml-2" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                          <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm p-12 text-center">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="mt-2 text-lg font-medium text-gray-900">No medicines found</h3>
              <p className="mt-1 text-sm text-gray-500">Try adjusting your search or filter criteria</p>
            </div>
          )}

          {/* Order Modal */}
          {selectedMedicine && (
            <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                  <div className="flex justify-between items-start">
                    <h2 className="text-2xl font-bold text-gray-900">{selectedMedicine.brandName}</h2>
                    <button
                      onClick={() => setSelectedMedicine(null)}
                      className="text-gray-400 hover:text-gray-500"
                    >
                      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>

                  <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="bg-gray-50 rounded-lg p-4 flex items-center justify-center">
                      <img
                        src={selectedMedicine.productImage || '/placeholder-medicine.jpg'}
                        alt={selectedMedicine.brandName}
                        className="h-64 object-contain"
                      />
                    </div>

                    <div>
                      <div className="space-y-4">
                        <div>
                          <h3 className="text-lg font-medium text-gray-900">Details</h3>
                          <div className="mt-2 grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <p className="text-gray-500">Generic Name</p>
                              <p className="font-medium">{selectedMedicine.genericName}</p>
                            </div>
                            <div>
                              <p className="text-gray-500">Strength</p>
                              <p className="font-medium">{selectedMedicine.strength || '-'}</p>
                            </div>
                            <div>
                              <p className="text-gray-500">Form</p>
                              <p className="font-medium">{selectedMedicine.dosageForm || '-'}</p>
                            </div>
                            <div>
                              <p className="text-gray-500">Manufacturer</p>
                              <p className="font-medium">{selectedMedicine.vendorName}</p>
                            </div>
                            <div>
                              <p className="text-gray-500">Pack Size</p>
                              <p className="font-medium">{selectedMedicine.packSize || '-'}</p>
                            </div>
                            <div>
                              <p className="text-gray-500">License No</p>
                              <p className="font-medium">{selectedMedicine.licenseNumber || '-'}</p>
                            </div>
                          </div>
                        </div>

                        {selectedMedicine.shortDescription && (
                          <div>
                            <h3 className="text-lg font-medium text-gray-900">Description</h3>
                            <p className="mt-2 text-sm text-gray-600">{selectedMedicine.shortDescription}</p>
                          </div>
                        )}

                        <div className="border-t border-gray-200 pt-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label htmlFor="delivery-date" className="block text-sm font-medium text-gray-700 mb-1">
                                Delivery Date
                              </label>
                              <input
                                type="date"
                                id="delivery-date"
                                value={deliveryDate}
                                onChange={(e) => setDeliveryDate(e.target.value)}
                                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2"
                              />
                            </div>
                            <div>
                              <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1">
                                Quantity
                              </label>
                              <input
                                type="number"
                                id="quantity"
                                min="1"
                                value={quantity}
                                onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2"
                              />
                            </div>
                          </div>
                        </div>

                        {totalPrice !== null && (
                          <div className="bg-blue-50 p-4 rounded-lg">
                            <div className="flex justify-between items-center">
                              <span className="font-medium text-gray-700">Total Price</span>
                              <span className="text-2xl font-bold text-blue-600">₹{totalPrice}</span>
                            </div>
                            <p className="text-xs text-gray-500 mt-1">Inclusive of all taxes</p>
                          </div>
                        )}

                        <button
                          onClick={handlePlaceOrder}
                          disabled={!deliveryDate || quantity <= 0}
                          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg shadow-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Place Order
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}