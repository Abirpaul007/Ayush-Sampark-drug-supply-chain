'use client';

import React, { useState, useEffect, useRef } from 'react';
import * as echarts from 'echarts';
import { signOut } from 'next-auth/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPills, faBell, faUser, faChevronDown, faClock, faTruck, faCheckCircle, faExclamationTriangle, faHourglassHalf, faBoxOpen, faClipboardList, faFileInvoice, faTruckLoading, faClipboardCheck, faUpload, faPenAlt, faTimes, faCalendarAlt, faArrowUp, faEquals, faArrowDown, faChevronLeft, faChevronRight, faUserCircle, faCog, faSignOutAlt, faSearch
} from '@fortawesome/free-solid-svg-icons';

const ManufacturerDashboardPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showDispatchForm, setShowDispatchForm] = useState(false);
  const fileInputInvoiceRef = useRef<HTMLInputElement>(null);
  const fileInputProofRef = useRef<HTMLInputElement>(null);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [detailsError, setDetailsError] = useState('');
  const [orderDetails, setOrderDetails] = useState<any>(null);

  // State for metrics and orders
  const [metrics, setMetrics] = useState({
    pendingOrders: 0,
    shipmentsInTransit: 0,
    deliveriesConfirmed: 0,
    slaBreaches: 0,
  });
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploadMessage, setUploadMessage] = useState('');

  // New state for order stats chart
  const [orderStats, setOrderStats] = useState<{ x: string[]; y: number[]; period: string }>({ x: [], y: [], period: 'monthly' });
  const [orderStatsLoading, setOrderStatsLoading] = useState(false);
  const [orderStatsPeriod, setOrderStatsPeriod] = useState<'monthly' | 'yearly'>('monthly');

  // Initialize charts
  useEffect(() => {
    if (activeTab === 'dashboard') {
      // Delivery Times Chart
      const deliveryTimesChart = echarts.init(document.getElementById('delivery-times-chart'));
      const deliveryTimesOption = {
        animation: false,
        title: {
          text: 'Average Delivery Times',
          left: 'center',
          textStyle: {
            fontSize: 14
          }
        },
        tooltip: {
          trigger: 'axis' as const
        },
        xAxis: {
          type: 'category' as const,
          data: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']
        },
        yAxis: {
          type: 'value' as const,
          name: 'Days'
        },
        series: [{
          data: [3.2, 2.8, 3.5, 2.9, 2.6, 2.4],
          type: 'line',
          smooth: true,
          lineStyle: {
            color: '#2196f3'
          },
          itemStyle: {
            color: '#2196f3'
          }
        }]
      };
      deliveryTimesChart.setOption(deliveryTimesOption);

      // Order Status Distribution Chart
      const orderStatusChart = echarts.init(document.getElementById('order-status-chart'));
      const orderStatusOption = {
        animation: false,
        title: {
          text: 'Order Status Distribution',
          left: 'center',
          textStyle: {
            fontSize: 14
          }
        },
        tooltip: {
          trigger: 'item' as const
        },
        legend: {
          orient: 'vertical' as const,
          left: 'left',
          top: 'middle'
        },
        series: [{
          type: 'pie',
          radius: '70%',
          data: [
            { value: 42, name: 'Pending', itemStyle: { color: '#ff9800' } },
            { value: 18, name: 'In Transit', itemStyle: { color: '#2196f3' } },
            { value: 126, name: 'Delivered', itemStyle: { color: '#4caf50' } },
            { value: 3, name: 'Delayed', itemStyle: { color: '#f44336' } }
          ],
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }]
      };
      orderStatusChart.setOption(orderStatusOption);

      // Handle resize
      const handleResize = () => {
        deliveryTimesChart.resize();
        orderStatusChart.resize();
      };

      window.addEventListener('resize', handleResize);
      return () => {
        window.removeEventListener('resize', handleResize);
        deliveryTimesChart.dispose();
        orderStatusChart.dispose();
      };
    }
  }, [activeTab]);

  // Fetch orders and calculate metrics
  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        // Fetch pending orders
        const resPending = await fetch('/api/vendor-received-orders');
        const pendingOrders = resPending.ok ? await resPending.json() : [];
        // Fetch dispatched orders
        const resDispatched = await fetch('/api/vendor-request-delivery');
        const dispatchedOrders = resDispatched.ok ? await resDispatched.json() : [];
        // Fetch delivered orders
        const resDelivered = await fetch('/api/delivered_orders');
        const deliveredOrders = resDelivered.ok ? await resDelivered.json() : [];

        // Merge and map orders for table
        const allOrders = [
          ...pendingOrders.map((order: any) => ({ ...order, status: 'pending' })),
          ...dispatchedOrders.map((order: any) => ({ ...order, status: 'in-progress' })),
          ...deliveredOrders.map((order: any) => ({ ...order, status: 'completed' })),
        ];
        setOrders(allOrders);

        // Calculate metrics
        setMetrics({
          pendingOrders: pendingOrders.length,
          shipmentsInTransit: dispatchedOrders.length,
          deliveriesConfirmed: deliveredOrders.length,
          slaBreaches: allOrders.filter((o: any) => o.status === 'delayed').length,
        });
      } catch (err) {
        setOrders([]);
        setMetrics({ pendingOrders: 0, shipmentsInTransit: 0, deliveriesConfirmed: 0, slaBreaches: 0 });
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  // Fetch order stats
  useEffect(() => {
    setOrderStatsLoading(true);
    fetch(`/api/vendor-order-stats?period=${orderStatsPeriod}`)
      .then(res => res.json())
      .then(data => {
        setOrderStats(data);
        setOrderStatsLoading(false);
      })
      .catch(() => setOrderStatsLoading(false));
  }, [orderStatsPeriod]);

  // Render the new chart
  useEffect(() => {
    const chartDom = document.getElementById('order-stats-chart');
    if (!chartDom) return;
    const chart = echarts.init(chartDom);
    // @ts-ignore
    chart.setOption({
      animation: false,
      title: {
        text: orderStats.period === 'yearly' ? 'Orders per Year' : 'Orders per Month',
        left: 'center',
        textStyle: { fontSize: 14 }
      },
      tooltip: { trigger: 'axis' },
      xAxis: {
        type: 'category',
        data: orderStats.x,
        name: orderStats.period === 'yearly' ? 'Year' : 'Month',
      },
      yAxis: {
        type: 'value',
        name: 'Orders',
        minInterval: 1,
        min: 0,
        axisLabel: {
          formatter: (value: number) => Math.floor(value),
        },
      },
      series: [{
        data: orderStats.y,
        type: 'bar',
        itemStyle: { color: '#2196f3' },
        label: {
          show: true,
          position: 'top',
          formatter: (params: any) => `${params.value}`,
        },
      }],
    });
    const resizeHandler = () => chart.resize();
    window.addEventListener('resize', resizeHandler);
    return () => {
      window.removeEventListener('resize', resizeHandler);
      chart.dispose();
    };
  }, [orderStats]);

  // Calculate time remaining for next dispatch
  const calculateTimeRemaining = () => {
    const now = new Date();
    const dispatchTime = new Date();
    dispatchTime.setHours(17, 0, 0); // 5:00 PM

    if (now > dispatchTime) {
      dispatchTime.setDate(dispatchTime.getDate() + 1);
    }

    const diffMs = dispatchTime.getTime() - now.getTime();
    const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

    return `${diffHrs}h ${diffMins}m`;
  };

  const [timeRemaining, setTimeRemaining] = useState(calculateTimeRemaining());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining(calculateTimeRemaining());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  const handleInvoiceFileClick = () => {
    if (fileInputInvoiceRef.current) {
      fileInputInvoiceRef.current.click();
    }
  };

  const handleProofFileClick = () => {
    if (fileInputProofRef.current) {
      fileInputProofRef.current.click();
    }
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>, type: string) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      setUploadMessage('');
      const file = files[0];
      const formData = new FormData();
      formData.append('file', file);
      // For demo, use the first order's id as orderId (should be selected by user in real app)
      if (orders.length > 0) {
        formData.append('orderId', orders[0].orderId || orders[0]._id || orders[0].id);
        formData.append('vendorId', ''); // Optionally set vendorId if needed
      }
      try {
        const res = await fetch('/api/upload_pod', {
          method: 'POST',
          body: formData,
        });
        if (res.ok) {
          setUploadMessage('✅ File uploaded successfully!');
        } else {
          setUploadMessage('❌ Upload failed.');
        }
      } catch (err) {
        setUploadMessage('❌ Upload error.');
      }
      event.target.value = '';
    }
  };

  // Helper to fetch order details
  const handleViewDetails = async (orderId: string) => {
    setDetailsModalOpen(true);
    setDetailsLoading(true);
    setDetailsError('');
    setOrderDetails(null);
    try {
      const res = await fetch(`/api/order-details?orderId=${orderId}`);
      if (!res.ok) throw new Error('Failed to fetch order details');
      const data = await res.json();
      setOrderDetails(data);
    } catch (err: any) {
      setDetailsError(err.message || 'Error fetching details');
    } finally {
      setDetailsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <div className="flex flex-1">
        <main className="flex-1 overflow-y-auto bg-gray-50 pl-20 pt-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold text-gray-800">Manufacturer Dashboard</h1>
              <div className="text-sm text-gray-500">
                <FontAwesomeIcon icon={faCalendarAlt} className="mr-2" />
                {new Date().toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </div>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow p-5 border-l-4 border-orange-500">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-3xl font-bold text-gray-800">{metrics.pendingOrders}</div>
                    <div className="text-sm text-gray-500 mt-1">Pending Orders</div>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-orange-100 flex items-center justify-center text-orange-500">
                    <FontAwesomeIcon icon={faClock} className="text-xl" />
                  </div>
                </div>
                <div className="text-xs text-green-600 mt-2 flex items-center">
                  <FontAwesomeIcon icon={faArrowUp} className="mr-1" />
                  <span>12% from last month</span>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-5 border-l-4 border-blue-500">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-3xl font-bold text-gray-800">{metrics.shipmentsInTransit}</div>
                    <div className="text-sm text-gray-500 mt-1">Shipments in Transit</div>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-500">
                    <FontAwesomeIcon icon={faTruck} className="text-xl" />
                  </div>
                </div>
                <div className="text-xs text-blue-600 mt-2 flex items-center">
                  <FontAwesomeIcon icon={faEquals} className="mr-1" />
                  <span>Same as last month</span>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-5 border-l-4 border-green-500">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-3xl font-bold text-gray-800">{metrics.deliveriesConfirmed}</div>
                    <div className="text-sm text-gray-500 mt-1">Deliveries Confirmed</div>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center text-green-500">
                    <FontAwesomeIcon icon={faCheckCircle} className="text-xl" />
                  </div>
                </div>
                <div className="text-xs text-green-600 mt-2 flex items-center">
                  <FontAwesomeIcon icon={faArrowUp} className="mr-1" />
                  <span>8% from last month</span>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-5 border-l-4 border-red-500">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-3xl font-bold text-gray-800">{metrics.slaBreaches}</div>
                    <div className="text-sm text-gray-500 mt-1">SLA Breaches</div>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center text-red-500">
                    <FontAwesomeIcon icon={faExclamationTriangle} className="text-xl" />
                  </div>
                </div>
                <div className="text-xs text-green-600 mt-2 flex items-center">
                  <FontAwesomeIcon icon={faArrowDown} className="mr-1" />
                  <span>2 fewer than last month</span>
                </div>
              </div>
            </div>

            {/* Live Dispatch Timer */}
            <div className="bg-white rounded-lg shadow mb-8">
              <div className="p-5 border-b border-gray-200 flex items-center justify-between">
                <div className="flex items-center">
                  <FontAwesomeIcon icon={faHourglassHalf} className="text-blue-600 mr-3 text-xl" />
                  <h2 className="text-lg font-semibold text-gray-800">Next Dispatch Deadline</h2>
                </div>
                <div className="bg-blue-100 text-blue-800 text-xs font-medium px-3 py-1 rounded-full">
                  Today
                </div>
              </div>
              <div className="p-5 flex flex-col md:flex-row items-center justify-between">
                <div>
                  <div className="text-sm text-gray-500 mb-1">Order #ORD-2025-0642</div>
                  <div className="text-base font-medium">Central Medical Supplies - 500 units of Paracetamol</div>
                  <div className="text-sm text-gray-500 mt-1">Priority: High</div>
                </div>
                <div className="mt-4 md:mt-0 flex flex-col items-center">
                  <div className="text-sm text-gray-500 mb-1">Time Remaining</div>
                  <div className="text-3xl font-bold text-red-600">{timeRemaining}</div>
                  <div className="text-sm text-gray-500 mt-1">Until 5:00 PM</div>
                </div>
                <div className="mt-4 md:mt-0">
                  <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center cursor-pointer whitespace-nowrap">
                    <FontAwesomeIcon icon={faBoxOpen} className="mr-2" />
                    Prepare Shipment
                  </button>
                </div>
              </div>
            </div>

            {/* Order Management */}
            <div className="bg-white rounded-lg shadow mb-8">
              <div className="p-5 border-b border-gray-200 flex items-center justify-between">
                <div className="flex items-center">
                  <FontAwesomeIcon icon={faClipboardList} className="text-blue-600 mr-3 text-xl" />
                  <h2 className="text-lg font-semibold text-gray-800">Recent Orders</h2>
                </div>
                <button className="text-blue-600 hover:text-blue-800 text-sm font-medium cursor-pointer whitespace-nowrap">
                  View All Orders
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Expected Dispatch</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {loading ? (
                      <tr><td colSpan={6} className="text-center py-4">Loading...</td></tr>
                    ) : orders.length === 0 ? (
                      <tr><td colSpan={6} className="text-center py-4">No orders found.</td></tr>
                    ) : (
                      orders.map((order) => (
                        <tr key={order._id || order.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">{order.orderId || order._id || order.id}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              order.status === 'pending' ? 'bg-orange-100 text-orange-800' :
                              order.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                              order.status === 'completed' ? 'bg-green-100 text-green-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              <span className={`h-1.5 w-1.5 rounded-full mr-1.5 ${
                                order.status === 'pending' ? 'bg-orange-500' :
                                order.status === 'in-progress' ? 'bg-blue-500' :
                                order.status === 'completed' ? 'bg-green-500' :
                                'bg-red-500'
                              }`}></span>
                              {order.status === 'pending' ? 'Pending' :
                               order.status === 'in-progress' ? 'In Progress' :
                               order.status === 'completed' ? 'Completed' :
                               'Delayed'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{order.hospitalName || order.customer || '-'}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.orderDate ? new Date(order.orderDate).toLocaleDateString() : '-'}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.deliveryDate ? new Date(order.deliveryDate).toLocaleDateString() : '-'}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            {order.status === 'pending' ? (
                              <div className="flex justify-end space-x-2">
                                <button className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded cursor-pointer whitespace-nowrap" onClick={async () => {
                                  await fetch('/api/vendor-accept-order', {
                                    method: 'POST',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify({ orderId: order._id || order.id }),
                                  });
                                  // Refresh orders
                                  setLoading(true);
                                  setTimeout(() => window.location.reload(), 500);
                                }}>
                                  Accept
                                </button>
                                <button className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded cursor-pointer whitespace-nowrap" onClick={async () => {
                                  await fetch('/api/vendor-reject-order', {
                                    method: 'POST',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify({ _id: order._id || order.id }),
                                  });
                                  // Refresh orders
                                  setLoading(true);
                                  setTimeout(() => window.location.reload(), 500);
                                }}>
                                  Reject
                                </button>
                              </div>
                            ) : (
                              <button
                                className="text-blue-600 hover:text-blue-900 cursor-pointer whitespace-nowrap"
                                onClick={() => handleViewDetails(order.orderId || order._id || order.id)}
                              >
                                View Details
                              </button>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
              <div className="px-6 py-3 flex items-center justify-between border-t border-gray-200">
                <div className="text-sm text-gray-500">
                  Showing 5 of 42 orders
                </div>
                <div className="flex space-x-2">
                  <button className="px-3 py-1 rounded border border-gray-300 text-gray-700 hover:bg-gray-50 cursor-pointer whitespace-nowrap">
                    <FontAwesomeIcon icon={faChevronLeft} />
                  </button>
                  <button className="px-3 py-1 rounded border border-gray-300 bg-blue-600 text-white cursor-pointer whitespace-nowrap">
                    1
                  </button>
                  <button className="px-3 py-1 rounded border border-gray-300 text-gray-700 hover:bg-gray-50 cursor-pointer whitespace-nowrap">
                    2
                  </button>
                  <button className="px-3 py-1 rounded border border-gray-300 text-gray-700 hover:bg-gray-50 cursor-pointer whitespace-nowrap">
                    <FontAwesomeIcon icon={faChevronRight} />
                  </button>
                </div>
              </div>
            </div>

            {/* Performance Monitoring */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow">
                <div className="p-4 border-b border-gray-200">
                  <h3 className="font-medium text-gray-800">Delivery Performance</h3>
                </div>
                <div className="p-4">
                  <div id="delivery-times-chart" className="h-64"></div>
                </div>
              </div>
              {/* REPLACE SLA Compliance chart with new Order Stats chart */}
              <div className="bg-white rounded-lg shadow">
                <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                  <h3 className="font-medium text-gray-800">Order Statistics</h3>
                  <div className="flex gap-2">
                    <button
                      className={`px-2 py-1 rounded text-xs font-medium border ${orderStatsPeriod === 'monthly' ? 'bg-blue-600 text-white' : 'bg-white text-blue-600 border-blue-600'}`}
                      onClick={() => setOrderStatsPeriod('monthly')}
                    >
                      Monthly
                    </button>
                    <button
                      className={`px-2 py-1 rounded text-xs font-medium border ${orderStatsPeriod === 'yearly' ? 'bg-blue-600 text-white' : 'bg-white text-blue-600 border-blue-600'}`}
                      onClick={() => setOrderStatsPeriod('yearly')}
                    >
                      Yearly
                    </button>
                  </div>
                </div>
                <div className="p-4">
                  {orderStatsLoading ? (
                    <div className="h-64 flex items-center justify-center text-gray-400">Loading...</div>
                  ) : (
                    <div id="order-stats-chart" className="h-64"></div>
                  )}
                </div>
              </div>
              {/* Keep Order Status chart as is */}
              <div className="bg-white rounded-lg shadow">
                <div className="p-4 border-b border-gray-200">
                  <h3 className="font-medium text-gray-800">Order Status</h3>
                </div>
                <div className="p-4">
                  <div id="order-status-chart" className="h-64"></div>
                </div>
              </div>
            </div>

            {/* Document Upload Section */}
            <div className="bg-white rounded-lg shadow mb-8">
              <div className="p-5 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-800">Document Management</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-5">
                <div className="border border-dashed border-gray-300 rounded-lg p-4 flex flex-col items-center justify-center">
                  <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-500 mb-3">
                    <FontAwesomeIcon icon={faFileInvoice} className="text-xl" />
                  </div>
                  <h3 className="text-base font-medium text-gray-800 mb-1">Upload Invoice</h3>
                  <p className="text-sm text-gray-500 text-center mb-3">Drag and drop your invoice PDF or image here</p>
                  <input
                    type="file"
                    ref={fileInputInvoiceRef}
                    className="hidden"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => handleFileChange(e, 'invoice')}
                  />
                  <button 
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded cursor-pointer whitespace-nowrap"
                    onClick={handleInvoiceFileClick}
                  >
                    <FontAwesomeIcon icon={faUpload} className="mr-2" />
                    Select File
                  </button>
                  <div className="text-xs text-gray-500 mt-2">Supported: PDF, JPG, PNG</div>
                  {uploadMessage && <div className="text-center text-sm mt-2">{uploadMessage}</div>}
                </div>

                <div className="border border-dashed border-gray-300 rounded-lg p-4 flex flex-col items-center justify-center">
                  <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center text-green-500 mb-3">
                    <FontAwesomeIcon icon={faTruckLoading} className="text-xl" />
                  </div>
                  <h3 className="text-base font-medium text-gray-800 mb-1">Dispatch Form</h3>
                  <p className="text-sm text-gray-500 text-center mb-3">Enter shipping details and tracking information</p>
                  <button 
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded cursor-pointer whitespace-nowrap"
                    onClick={() => setShowDispatchForm(true)}
                  >
                    <FontAwesomeIcon icon={faPenAlt} className="mr-2" />
                    Fill Form
                  </button>
                  <div className="text-xs text-gray-500 mt-2">For orders ready to ship</div>
                </div>

                <div className="border border-dashed border-gray-300 rounded-lg p-4 flex flex-col items-center justify-center">
                  <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center text-purple-500 mb-3">
                    <FontAwesomeIcon icon={faClipboardCheck} className="text-xl" />
                  </div>
                  <h3 className="text-base font-medium text-gray-800 mb-1">Delivery Proof</h3>
                  <p className="text-sm text-gray-500 text-center mb-3">Upload signed delivery confirmation documents</p>
                  <input
                    type="file"
                    ref={fileInputProofRef}
                    className="hidden"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => handleFileChange(e, 'proof')}
                  />
                  <button 
                    className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded cursor-pointer whitespace-nowrap"
                    onClick={handleProofFileClick}
                  >
                    <FontAwesomeIcon icon={faUpload} className="mr-2" />
                    Upload Proof
                  </button>
                  <div className="text-xs text-gray-500 mt-2">Required for completed deliveries</div>
                  {uploadMessage && <div className="text-center text-sm mt-2">{uploadMessage}</div>}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Dispatch Form Modal */}
      {showDispatchForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-5 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-800">Dispatch Form</h2>
              <button 
                className="text-gray-500 hover:text-gray-700 cursor-pointer"
                onClick={() => setShowDispatchForm(false)}
              >
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>
            <div className="p-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Order ID</label>
                  <input 
                    type="text" 
                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    defaultValue="ORD-2025-0642"
                    readOnly
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Customer</label>
                  <input 
                    type="text" 
                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    defaultValue="Central Medical Supplies"
                    readOnly
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Shipping Carrier</label>
                  <select className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm">
                    <option value="">Select a carrier</option>
                    <option value="fedex">FedEx</option>
                    <option value="ups">UPS</option>
                    <option value="dhl">DHL</option>
                    <option value="usps">USPS</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tracking Number</label>
                  <input 
                    type="text" 
                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    placeholder="Enter tracking number"
                  />
                </div>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Shipping Address</label>
                <textarea 
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  rows={3}
                  defaultValue="123 Medical Center Drive, Suite 400, Central City, CA 90210"
                  readOnly
                ></textarea>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Package Weight (kg)</label>
                  <input 
                    type="number" 
                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    placeholder="Enter weight"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Number of Packages</label>
                  <input 
                    type="number" 
                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    placeholder="Enter quantity"
                    defaultValue="1"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Shipping Method</label>
                  <select className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm">
                    <option value="">Select a method</option>
                    <option value="standard">Standard</option>
                    <option value="express">Express</option>
                    <option value="overnight">Overnight</option>
                  </select>
                </div>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Special Instructions</label>
                <textarea 
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  rows={3}
                  placeholder="Enter any special handling instructions"
                ></textarea>
              </div>
              
              <div className="flex items-center mb-4">
                <input 
                  type="checkbox" 
                  id="temperature-controlled" 
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="temperature-controlled" className="ml-2 block text-sm text-gray-700">
                  Temperature-controlled shipping required
                </label>
              </div>
              
              <div className="flex items-center mb-4">
                <input 
                  type="checkbox" 
                  id="fragile" 
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="fragile" className="ml-2 block text-sm text-gray-700">
                  Fragile items included
                </label>
              </div>
            </div>
            <div className="p-5 border-t border-gray-200 flex justify-end space-x-3">
              <button 
                className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50 cursor-pointer whitespace-nowrap"
                onClick={() => setShowDispatchForm(false)}
              >
                Cancel
              </button>
              <button 
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded cursor-pointer whitespace-nowrap"
                onClick={() => {
                  console.log('Dispatch form submitted');
                  setShowDispatchForm(false);
                }}
              >
                Submit Dispatch
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Details Modal */}
      {detailsModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 relative">
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
              onClick={() => setDetailsModalOpen(false)}
            >
              <FontAwesomeIcon icon={faTimes} />
            </button>
            <h2 className="text-xl font-semibold mb-4 text-blue-700">Order Details</h2>
            {detailsLoading ? (
              <div className="text-center py-8 text-gray-500">Loading...</div>
            ) : detailsError ? (
              <div className="text-center py-8 text-red-500">{detailsError}</div>
            ) : orderDetails ? (
              <div className="space-y-3">
                <div><span className="font-medium text-gray-700">Hospital/Pharmacy:</span> {orderDetails.hospitalName}</div>
                <div><span className="font-medium text-gray-700">Medicine ID:</span> {orderDetails.medicineId}</div>
                <div><span className="font-medium text-gray-700">Vendor:</span> {orderDetails.vendorName}</div>
                {/* Add more fields as needed */}
              </div>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
};

export default ManufacturerDashboardPage;