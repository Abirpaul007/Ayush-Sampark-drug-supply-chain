'use client';
import React, { useState } from 'react';

const mockDrugs = [
  { id: '1', name: 'Paracetamol 500mg' },
  { id: '2', name: 'Amoxicillin 250mg' },
  { id: '3', name: 'Ibuprofen 400mg' },
];
const mockReturns = [
  { drug: 'Paracetamol 500mg', quantity: 10, reason: 'Expired', date: '2024-06-01', status: 'Processed' },
  { drug: 'Ibuprofen 400mg', quantity: 5, reason: 'Damaged', date: '2024-06-03', status: 'Pending' },
];

export default function DrugReturnsPage() {
  const [returns, setReturns] = useState(mockReturns);
  const [selected, setSelected] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [reason, setReason] = useState('');
  const [info, setInfo] = useState('');

  const handleReturn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selected || !reason || quantity < 1) {
      setInfo('Please fill all fields.');
      return;
    }
    setReturns([
      { drug: mockDrugs.find(d => d.id === selected)?.name || '', quantity, reason, date: new Date().toISOString().slice(0, 10), status: 'Pending' },
      ...returns,
    ]);
    setSelected('');
    setQuantity(1);
    setReason('');
    setInfo('Return submitted!');
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Drug Returns</h1>
      <form onSubmit={handleReturn} className="bg-white rounded shadow p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <select className="input" value={selected} onChange={e => setSelected(e.target.value)} required>
            <option value="">Select Drug</option>
            {mockDrugs.map(d => (
              <option key={d.id} value={d.id}>{d.name}</option>
            ))}
          </select>
          <input className="input" type="number" min={1} value={quantity} onChange={e => setQuantity(Number(e.target.value))} placeholder="Quantity" required />
          <input className="input" type="text" value={reason} onChange={e => setReason(e.target.value)} placeholder="Reason" required />
        </div>
        <button className="btn-primary" type="submit">Return</button>
        {info && <div className="mt-4 text-green-600">{info}</div>}
      </form>
      <div className="overflow-x-auto rounded shadow bg-white">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">Drug</th>
              <th className="p-3 text-left">Quantity</th>
              <th className="p-3 text-left">Reason</th>
              <th className="p-3 text-left">Date</th>
              <th className="p-3 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {returns.length === 0 ? (
              <tr><td colSpan={5} className="text-center p-6">No returns found.</td></tr>
            ) : returns.map((r, i) => (
              <tr key={i} className="border-b hover:bg-gray-50">
                <td className="p-3">{r.drug}</td>
                <td className="p-3">{r.quantity}</td>
                <td className="p-3">{r.reason}</td>
                <td className="p-3">{r.date}</td>
                <td className="p-3">{r.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <style jsx>{`
        .input { @apply border rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400; }
        .btn-primary { @apply bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition; }
      `}</style>
    </div>
  );
} 