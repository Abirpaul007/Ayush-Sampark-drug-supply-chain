'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';

interface PODType {
  _id: string;
  orderId: string;
  podUrl: string;
  uploadedAt: string;
  hospitalName: string;
  organization: string;
  vendorId: string;
  hospitalUserId: string;
  source: 'hospital' | 'pharmacy' | 'unknown';
  role: 'HOSPITAL' | 'PHARMACY' | 'unknown';
}

export default function ManufacturerPodView() {
  const [pods, setPods] = useState<PODType[]>([]);
  const [loading, setLoading] = useState(false);
  const [now, setNow] = useState(new Date());
  const [filter, setFilter] = useState<'all' | 'hospital' | 'pharmacy'>('all');

  useEffect(() => {
    fetchPods();
    const timer = setInterval(() => setNow(new Date()), 30000); // auto-refresh time
    return () => clearInterval(timer);
  }, []);

  const fetchPods = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/get_pods');
      setPods(res.data);
    } catch (err) {
      console.error('Error fetching PODs:', err);
    } finally {
      setLoading(false);
    }
  };

  const getRelativeTime = (uploadedAt: string) => {
    const uploaded = new Date(uploadedAt);
    const diff = Math.floor((now.getTime() - uploaded.getTime()) / 1000);

    if (diff < 10) return 'Just now';
    if (diff < 60) return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;

    return uploaded.toLocaleDateString();
  };

  const filteredPods =
    filter === 'all' ? pods : pods.filter((pod) => pod.source === filter);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto bg-white shadow-lg rounded-xl p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            📦 Manufacturer PODs
          </h1>
          <div className="flex items-center gap-4">
            <select
              value={filter}
              onChange={(e) =>
                setFilter(e.target.value as 'all' | 'hospital' | 'pharmacy')
              }
              className="border rounded-md px-3 py-1 text-sm"
            >
              <option value="all">All</option>
              <option value="hospital">🏥 Hospital</option>
              <option value="pharmacy">🧪 Pharmacy</option>
            </select>
            <button
              onClick={fetchPods}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition disabled:bg-blue-300"
            >
              {loading ? 'Refreshing...' : '🔄 Refresh'}
            </button>
          </div>
        </div>

        {filteredPods.length === 0 ? (
          <p className="text-gray-600">No PODs found for this filter.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-300 rounded-md table-auto">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700 border-b">Order ID</th>
                  <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700 border-b"> Name</th>
                  <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700 border-b">Organization</th>
                  <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700 border-b">Type</th>
                  <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700 border-b">Uploaded</th>
                  <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700 border-b">File</th>
                </tr>
              </thead>
              <tbody>
                {filteredPods.map((pod) => (
                  <tr key={pod._id} className="hover:bg-gray-50 transition">
                    <td className="px-4 py-2 border-b">{pod.orderId}</td>
                    <td className="px-4 py-2 border-b">{pod.hospitalName}</td>
                    <td className="px-4 py-2 border-b">{pod.organization}</td>
                    <td className="px-4 py-2 border-b capitalize text-sm text-gray-700">
                      {pod.source}
                    </td>
                    <td className="px-4 py-2 border-b text-sm text-gray-600">
                      {getRelativeTime(pod.uploadedAt)}
                    </td>
                    <td className="px-4 py-2 border-b">
                      <a
                        href={pod.podUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        📄 View PDF
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
