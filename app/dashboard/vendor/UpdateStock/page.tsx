'use client';

import { useState, useEffect } from 'react';
import { Input } from '@/app/ui/input';
import { Button } from '@/app/ui/button';

export default function VendorUpdateStockPage() {
  const [medicines, setMedicines] = useState([]);
  const [form, setForm] = useState({
    medicineId: '',
    batchNumber: '',
    expiryDate: '',
    manufacturingDate: '',
    stockQuantity: '',
    mrp: '',
    offerPrice: '',
  });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch('/api/vendor-medicines')
      .then(res => res.json())
      .then(data => setMedicines(data))
      .catch(() => setMessage('❌ Failed to load medicines.'));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const res = await fetch('/api/vendor-update-stock', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          stockQuantity: parseInt(form.stockQuantity),
          mrp: parseFloat(form.mrp),
          offerPrice: parseFloat(form.offerPrice || form.mrp),
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage('✅ Stock updated successfully!');
        setForm({
          medicineId: '',
          batchNumber: '',
          expiryDate: '',
          manufacturingDate: '',
          stockQuantity: '',
          mrp: '',
          offerPrice: '',
        });
      } else {
        setMessage(`❌ ${data.message}`);
      }
    } catch (err) {
      console.error('Submit error:', err);
      setMessage('❌ Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-3xl mx-auto bg-white shadow-xl rounded-2xl p-8 border border-blue-100">
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-extrabold text-blue-700"> Update Medicine Stock</h1>
          <p className="text-gray-600 mt-2 text-sm">
            Add batch details, expiry dates, and pricing information to keep your stock records up-to-date.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Select Medicine */}
          <div>
            <label className="block font-semibold mb-1 text-gray-700">Select Medicine</label>
            <select
              name="medicineId"
              value={form.medicineId}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="">-- Select --</option>
              {medicines.map((med: any) => (
                <option key={med._id} value={med._id}>
                  {med.brandName} ({med.genericName})
                </option>
              ))}
            </select>
          </div>

          {/* Batch Number */}
          <div>
            <label className="block font-semibold mb-1 text-gray-700">Batch Number</label>
            <Input name="batchNumber" value={form.batchNumber} onChange={handleChange} required />
          </div>

          {/* Expiry Date */}
          <div>
            <label className="block font-semibold mb-1 text-gray-700">Expiry Date</label>
            <Input
              type="date"
              name="expiryDate"
              value={form.expiryDate}
              onChange={handleChange}
              required
            />
          </div>

          {/* Manufacturing Date */}
          <div>
            <label className="block font-semibold mb-1 text-gray-700">Manufacturing Date</label>
            <Input
              type="date"
              name="manufacturingDate"
              value={form.manufacturingDate}
              onChange={handleChange}
              required
            />
          </div>

          {/* Stock Quantity */}
          <div>
            <label className="block font-semibold mb-1 text-gray-700">Stock Quantity</label>
            <Input
              type="number"
              name="stockQuantity"
              value={form.stockQuantity}
              onChange={handleChange}
              required
            />
          </div>

          {/* MRP */}
          <div>
            <label className="block font-semibold mb-1 text-gray-700">MRP</label>
            <Input
              type="number"
              name="mrp"
              value={form.mrp}
              onChange={handleChange}
              required
            />
          </div>

          {/* Offer Price */}
          <div>
            <label className="block font-semibold mb-1 text-gray-700">Offer Price (optional)</label>
            <Input
              type="number"
              name="offerPrice"
              value={form.offerPrice}
              onChange={handleChange}
            />
          </div>

          <div className="pt-4">
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition"
            >
              {loading ? '⏳ Submitting...' : 'Submit'}
            </Button>
          </div>

          {message && (
            <div className="mt-4 text-center font-medium text-sm text-gray-700">
              {message}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
