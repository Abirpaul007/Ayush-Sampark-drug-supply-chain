'use client';

import { useEffect, useState } from 'react';

export default function PharmacySoldPage() {
  const [medicines, setMedicines] = useState<any[]>([]);
  const [selectedMedicineId, setSelectedMedicineId] = useState('');
  const [quantity, setQuantity] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    async function fetchInventory() {
      const res = await fetch('/api/pharmacy-inventory');
      const data = await res.json();
      if(Array.isArray(data)){
        setMedicines(data);
      }else{
        console.error('Inventory format invalid', data);
      }
    }

    fetchInventory();
  }, []);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (!selectedMedicineId || !quantity) return;

    setLoading(true);
    setMessage('');

    try {
      const res = await fetch('/api/pharmacy-sold', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ medicineId: selectedMedicineId, quantity:parseInt(quantity) }),
      });

      setMessage('Dispense record updated!');
      setQuantity('');
    } catch (err: any) {
      setMessage(err.response?.data?.error || 'Failed to submit.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow">
      <h2 className="text-xl font-semibold mb-4">Daily Dispense Entry (Pharmacy)</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <select
          className="w-full border px-3 py-2 rounded"
          value={selectedMedicineId}
          onChange={(e) => setSelectedMedicineId(e.target.value)}
        >
          <option value="">Select Medicine</option>
          {medicines.map((med) => (
            <option key={med.medicineId} value={med.medicineId}>
              {med.medicineName} (Stock: {med.totalStock})
            </option>
          ))}
        </select>

        <input
          type="number"
          placeholder="Quantity Sold"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          className="w-full border px-3 py-2 rounded"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          {loading ? 'Submitting...' : 'Submit'}
        </button>

        {message && <p className="text-sm text-center text-gray-700">{message}</p>}
      </form>
    </div>
  );
}
