'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
  PieChart, Pie, Cell, Legend,
  LineChart, Line
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/ui/card';
import { Input } from '@/app/ui/input';
import { Search, Download, Activity, Package, AlertCircle, BellOff } from 'lucide-react';

interface Stat {
  medicineId: string;
  brandName: string;
  totalSold: number;
  totalStock: number;
}

const COLORS = ['#3B82F6', '#6366F1', '#10B981', '#EC4899', '#F59E0B'];

export default function ConsumptionChartPage() {
  const [data, setData] = useState<Stat[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    axios.get('/api/pharm_consumption')
      .then((res) => {
        setData(res.data);
      })
      .catch((err) => console.error('Error loading data:', err));
  }, []);

  const filteredData = data.filter((item) =>
    item.brandName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleExport = () => {
    const csvRows = [
      ['Medicine ID', 'Brand Name', 'Total Sold', 'Total Stock'],
      ...filteredData.map(item => [
        item.medicineId,
        item.brandName,
        item.totalSold,
        item.totalStock
      ])
    ];
    const csvContent = csvRows.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', 'pharmacy_consumption.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const totalSold = filteredData.reduce((acc, med) => acc + med.totalSold, 0);
  const totalStock = filteredData.reduce((acc, med) => acc + med.totalStock, 0);

  const pieData = [
    { name: 'Total Sold', value: totalSold },
    { name: 'In Stock', value: totalStock },
  ];

  const topSelling = [...filteredData].sort((a, b) => b.totalSold - a.totalSold).slice(0, 5);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Blue Header with Rounded Corners */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-xl shadow-lg pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="text-white">
              <h1 className="text-2xl md:text-3xl font-bold">Pharmacy Analytics Dashboard</h1>
              <p className="text-blue-100 mt-1">Track medicine consumption and inventory in real-time</p>
            </div>
            <div className="flex gap-3 w-full md:w-auto">
              <div className="relative flex-1 md:w-72">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search medicines..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 bg-white/90 backdrop-blur-sm border-transparent focus:border-white focus:ring-1 focus:ring-white shadow-sm"
                />
              </div>
              <button
                onClick={handleExport}
                className="flex items-center gap-2 bg-white/90 hover:bg-white text-blue-600 px-4 py-2 rounded-lg border border-white/20 shadow-sm transition-all duration-200 hover:shadow-md"
              >
                <Download className="h-4 w-4" />
                <span>Export</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Dashboard Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <Package className="h-5 w-5 text-gray-500" />
                <CardTitle className="text-sm font-medium text-gray-500">Total Medicines</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{filteredData.length}</div>
            </CardContent>
          </Card>

          <Card className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-blue-500" />
                <CardTitle className="text-sm font-medium text-gray-500">Total Sold</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{totalSold}</div>
            </CardContent>
          </Card>

          <Card className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-amber-500" />
                <CardTitle className="text-sm font-medium text-gray-500">Low Stock</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-amber-500">
                {filteredData.filter(med => med.totalStock < 10 && med.totalStock > 0).length}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <BellOff className="h-5 w-5 text-red-500" />
                <CardTitle className="text-sm font-medium text-gray-500">Out of Stock</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-500">
                {filteredData.filter(med => med.totalStock === 0).length}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <Card className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-800">Sales vs Inventory</CardTitle>
            </CardHeader>
            <CardContent className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={filteredData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="brandName" 
                    tick={{ fontSize: 12 }} 
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis 
                    tick={{ fontSize: 12 }} 
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      borderRadius: '8px', 
                      boxShadow: '0 4px 20px rgba(0,0,0,0.12)',
                      border: '1px solid #e5e7eb'
                    }} 
                  />
                  <Legend />
                  <Bar 
                    dataKey="totalSold" 
                    name="Sold" 
                    fill="#3B82F6" 
                    radius={[4, 4, 0, 0]} 
                  />
                  <Bar 
                    dataKey="totalStock" 
                    name="In Stock" 
                    fill="#10B981" 
                    radius={[4, 4, 0, 0]} 
                  />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-800">Inventory Distribution</CardTitle>
            </CardHeader>
            <CardContent className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={2}
                    label={({ name, percent }) => `${name}: ${((percent || 0) * 100).toFixed(0)}%`}
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value) => [value, 'Units']} 
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      borderRadius: '8px', 
                      boxShadow: '0 4px 20px rgba(0,0,0,0.12)',
                      border: '1px solid #e5e7eb'
                    }} 
                  />
                  <Legend 
                    layout="horizontal" 
                    verticalAlign="bottom" 
                    align="center"
                  />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Charts Row 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <Card className="lg:col-span-2 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-800">Sales Trend</CardTitle>
            </CardHeader>
            <CardContent className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={filteredData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="brandName" 
                    tick={{ fontSize: 12 }} 
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis 
                    tick={{ fontSize: 12 }} 
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      borderRadius: '8px', 
                      boxShadow: '0 4px 20px rgba(0,0,0,0.12)',
                      border: '1px solid #e5e7eb'
                    }} 
                  />
                  <Line 
                    type="monotone" 
                    dataKey="totalSold" 
                    stroke="#3B82F6" 
                    strokeWidth={2} 
                    dot={{ r: 4 }} 
                    activeDot={{ r: 6 }} 
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-800">Top Selling Medicines</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topSelling.map((item, index) => (
                  <div key={item.medicineId} className="flex items-center p-2 hover:bg-gray-50 rounded-lg transition-colors">
                    <div className={`flex-shrink-0 h-10 w-10 rounded-lg flex items-center justify-center 
                      ${index === 0 ? 'bg-gradient-to-br from-blue-100 to-blue-50 text-blue-600 border border-blue-200' : 
                        index === 1 ? 'bg-gradient-to-br from-purple-100 to-purple-50 text-purple-600 border border-purple-200' : 
                        index === 2 ? 'bg-gradient-to-br from-emerald-100 to-emerald-50 text-emerald-600 border border-emerald-200' : 
                        'bg-gradient-to-br from-gray-100 to-gray-50 text-gray-600 border border-gray-200'}`}>
                      <span className="font-medium">{index + 1}</span>
                    </div>
                    <div className="ml-4 flex-1 min-w-0">
                      <div className="text-sm font-medium text-gray-900 truncate">{item.brandName}</div>
                      <div className="text-xs text-gray-500">Sold: {item.totalSold} | Stock: {item.totalStock}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Inventory Table */}
        <Card className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden mb-8">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-800">Medicine Inventory</CardTitle>
          </CardHeader>
          <CardContent className="px-0">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-blue-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Medicine</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sold</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">In Stock</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredData.map((med) => (
                    <tr key={med.medicineId} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{med.brandName}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{med.totalSold}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{med.totalStock}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                          ${med.totalStock === 0 ? 'bg-red-50 text-red-700 border border-red-100' : 
                            med.totalStock < 10 ? 'bg-amber-50 text-amber-700 border border-amber-100' : 
                            'bg-green-50 text-green-700 border border-green-100'}`}>
                          {med.totalStock === 0 ? 'Out of Stock' : 
                           med.totalStock < 10 ? 'Low Stock' : 'In Stock'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}