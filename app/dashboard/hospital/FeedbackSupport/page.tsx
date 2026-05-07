'use client';
import React, { useState } from 'react';

const mockFeedbacks = [
  { subject: 'Late Delivery', date: '2024-06-01', status: 'Resolved', response: 'We apologize for the delay.' },
  { subject: 'Damaged Packaging', date: '2024-06-03', status: 'Pending', response: '' },
];

export default function FeedbackSupportPage() {
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [feedbacks, setFeedbacks] = useState(mockFeedbacks);
  const [info, setInfo] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject || !message) {
      setInfo('Please fill all fields.');
      return;
    }
    setFeedbacks([
      { subject, date: new Date().toISOString().slice(0, 10), status: 'Pending', response: '' },
      ...feedbacks,
    ]);
    setSubject('');
    setMessage('');
    setInfo('Feedback submitted!');
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Feedback & Support</h1>
      <form onSubmit={handleSubmit} className="bg-white rounded shadow p-6 mb-8">
        <div className="mb-4">
          <input className="input" type="text" value={subject} onChange={e => setSubject(e.target.value)} placeholder="Subject" required />
        </div>
        <div className="mb-4">
          <textarea className="input" value={message} onChange={e => setMessage(e.target.value)} placeholder="Message" rows={4} required />
        </div>
        <button className="btn-primary" type="submit">Submit</button>
        {info && <div className="mt-4 text-green-600">{info}</div>}
      </form>
      <div className="overflow-x-auto rounded shadow bg-white">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">Subject</th>
              <th className="p-3 text-left">Date</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Response</th>
            </tr>
          </thead>
          <tbody>
            {feedbacks.length === 0 ? (
              <tr><td colSpan={4} className="text-center p-6">No feedbacks found.</td></tr>
            ) : feedbacks.map((f, i) => (
              <tr key={i} className="border-b hover:bg-gray-50">
                <td className="p-3">{f.subject}</td>
                <td className="p-3">{f.date}</td>
                <td className="p-3">{f.status}</td>
                <td className="p-3">{f.response || '-'}</td>
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