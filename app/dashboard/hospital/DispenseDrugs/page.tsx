'use client';

import { useEffect, useState } from 'react';

interface Medicine {
  inventoryId: string;       // HospitalInventory._id
  medicineId: string;        // Actual reference to Medicine._id
  medicineName: string;
  totalStock: number;
  lastOrderedDate: string;
}

export default function DispenseDrugsPage() {
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [selectedMedicineId, setSelectedMedicineId] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(0);
  const [recipient, setRecipient] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchInventory = async () => {
      const res = await fetch('/api/hospital-inventory');
      const data = await res.json();
      if (Array.isArray(data)) {
        setMedicines(data);
      } else {
        console.error('Inventory format invalid', data);
      }
    };
    fetchInventory();
  }, []);

  const handleSubmit = async () => {
    setMessage('');

    if (!selectedMedicineId || quantity <= 0 || !recipient.trim()) {
      setMessage('All fields are required.');
      return;
    }

    const res = await fetch('/api/hospital-dispense', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ medicineId: selectedMedicineId, quantity, recipient }),
    });

    const data = await res.json();
    if (res.ok) {
      setMessage('✅ Dispensed successfully!');
      setQuantity(0);
      setRecipient('');
    } else {
      setMessage(data.error || 'Something went wrong.');
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4 text-center text-blue-800">💊 Dispense Drugs</h1>

      <label className="block mb-2 font-medium">Select Medicine</label>
      <select
        value={selectedMedicineId}
        onChange={(e) => setSelectedMedicineId(e.target.value)}
        className="w-full p-2 mb-4 border border-gray-300 rounded"
      >
        <option value="">-- Choose Medicine --</option>
        {medicines.map((med) => (
          <option key={med.inventoryId} value={med.medicineId}>
            {med.medicineName} — {med.totalStock} in stock
          </option>
        ))}
      </select>

      <label className="block mb-2 font-medium">Quantity</label>
      <input
        type="number"
        value={quantity}
        onChange={(e) => setQuantity(Number(e.target.value))}
        placeholder="Enter quantity"
        className="w-full p-2 mb-4 border border-gray-300 rounded"
      />

      <label className="block mb-2 font-medium">Recipient</label>
      <input
        type="text"
        value={recipient}
        onChange={(e) => setRecipient(e.target.value)}
        placeholder="Enter recipient name"
        className="w-full p-2 mb-4 border border-gray-300 rounded"
      />

      <button
        onClick={handleSubmit}
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
      >
        Dispense
      </button>

      {message && (
        <p className="mt-4 text-center text-sm text-red-600 font-medium">{message}</p>
      )}
    </div>
  );
}
