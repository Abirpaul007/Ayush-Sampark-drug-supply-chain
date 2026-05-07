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
          `/api/orderh/fifo-price?medicineId=${selectedMedicine.medicineId}&quantity=${quantity}`
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
      const res = await fetch('/api/orderh', {
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
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Order Medicines</h1>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by name or vendor..."
            className="px-4 py-2 border rounded w-full sm:w-1/2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <div className="flex flex-col w-full sm:w-1/2">
            <label className="text-sm font-medium text-gray-700 mb-1">
              Filter by Price (₹{priceRange[0]} - ₹{priceRange[1]})
            </label>
            <input
              type="range"
              min={0}
              max={10000}
              step={50}
              value={priceRange[1]}
              onChange={(e) =>
                setPriceRange([priceRange[0], parseInt(e.target.value) || 0])
              }
              className="w-full"
            />
          </div>
        </div>

        {/* Medicines Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filtered.map((medicine) => (
            <div
              key={medicine._id}
              className="bg-white rounded-lg shadow p-4 hover:shadow-md transition"
            >
              <img
                src={medicine.productImage || '/placeholder-medicine.jpg'}
                alt={medicine.brandName}
                className="w-full h-40 object-contain bg-gray-100 mb-4"
              />
              <h2 className="text-md font-bold truncate">{medicine.brandName}</h2>
              <p className="text-sm text-gray-500">{medicine.genericName}</p>
              <p className="text-sm text-gray-500">Vendor: {medicine.vendorName}</p>
              <p className="text-green-600 font-semibold mt-1">
                Offer: ₹{medicine.minOfferPrice}
              </p>
              <button
                onClick={() => setSelectedMedicine(medicine)}
                className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 mt-3"
              >
                Add
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Modal for placing order */}
      {selectedMedicine && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-full max-w-3xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setSelectedMedicine(null)}
              className="absolute top-3 right-3 text-gray-600 hover:text-black"
            >
              ✕
            </button>

            <div className="flex flex-col sm:flex-row gap-6">
              <img
                src={selectedMedicine.productImage || '/placeholder-medicine.jpg'}
                alt={selectedMedicine.brandName}
                className="w-48 h-48 object-contain bg-gray-100"
              />
              <div className="flex-1 text-sm">
                <h2 className="text-2xl font-bold mb-2">{selectedMedicine.brandName}</h2>
                <p><b>Generic Name:</b> {selectedMedicine.genericName}</p>
                <p><b>Strength:</b> {selectedMedicine.strength}</p>
                <p><b>Dosage Form:</b> {selectedMedicine.dosageForm}</p>
                <p><b>Manufacturer:</b> {selectedMedicine.vendorName}</p>
                <p><b>Pack Size:</b> {selectedMedicine.packSize}</p>
                <p><b>License No:</b> {selectedMedicine.licenseNumber}</p>
                <p><b>Storage:</b> {selectedMedicine.storageConditions}</p>
                <p><b>Total Stock:</b> {selectedMedicine.totalStock}</p>
                <p><b>Offer Price:</b> ₹{selectedMedicine.minOfferPrice}</p>
                <p><b>Hospital:</b> {hospitalName || 'Loading...'}</p>

                {selectedMedicine.shortDescription && (
                  <div className="mt-4">
                    <p className="text-sm text-blue-600">
                      <b>Short Description:</b> {selectedMedicine.shortDescription}
                    </p>
                  </div>
                )}
                {selectedMedicine.detailedDescription && (
                  <div className="mt-2">
                    <p className="text-sm text-gray-700">
                      <b>Detailed Description:</b> {selectedMedicine.detailedDescription}
                    </p>
                  </div>
                )}

                {totalPrice !== null && (
                  <p className="mt-2 text-md font-semibold">
                    Estimated Total Price: <span className="text-green-700">₹{totalPrice}</span>
                  </p>
                )}
              </div>
            </div>

            <div className="mt-6">
              <label className="block mb-1 font-medium">Delivery Date:</label>
              <input
                type="date"
                value={deliveryDate}
                onChange={(e) => setDeliveryDate(e.target.value)}
                className="w-full border rounded px-3 py-2 mb-3"
              />
              <label className="block mb-1 font-medium">Quantity:</label>
              <input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                className="w-full border rounded px-3 py-2 mb-4"
              />
              <button
                onClick={handlePlaceOrder}
                className="w-full bg-green-600 text-white py-3 rounded hover:bg-green-700"
              >
                Place Order
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
