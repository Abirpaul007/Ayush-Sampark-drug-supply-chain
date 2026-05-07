'use client'

import React, { useEffect, useState } from 'react'
import { BrowserProvider, Contract } from 'ethers'
import {
  ExternalLinkIcon, HospitalIcon, PackageIcon, PillIcon, ClockIcon,
  FactoryIcon, TagIcon, HashIcon, Loader2Icon, SearchIcon
} from 'lucide-react'
import { FiFileText ,FiPackage,FiSearch } from 'react-icons/fi';

declare global {
  interface Window {
    ethereum?: any
  }
}

const CONTRACT_ADDRESS = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";

const CONTRACT_ABI = [
  {
    anonymous: false,
    inputs: [
      { indexed: false, internalType: 'string', name: 'orderId', type: 'string' },
      { indexed: false, internalType: 'string', name: 'hospitalName', type: 'string' },
      { indexed: false, internalType: 'string', name: 'medicineId', type: 'string' },
      { indexed: false, internalType: 'string', name: 'medicineName', type: 'string' },
      { indexed: false, internalType: 'uint256', name: 'quantity', type: 'uint256' },
      { indexed: false, internalType: 'string', name: 'vendorId', type: 'string' },
      { indexed: false, internalType: 'string', name: 'vendorName', type: 'string' },
      { indexed: false, internalType: 'uint256', name: 'timestamp', type: 'uint256' },
    ],
    name: 'OrderDelivered',
    type: 'event',
  },
]

interface DeliveredOrder {
  orderId: string
  hospitalName: string
  medicineId: string
  medicineName: string
  quantity: string
  vendorId: string
  vendorName: string
  timestamp: string
  txHash: string
}

export default function SmartContractLogs() {
  const [orders, setOrders] = useState<DeliveredOrder[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    const fetchLogs = async () => {
      if (typeof window === 'undefined' || !window.ethereum) {
        setError('Please install MetaMask to use this feature.')
        setLoading(false)
        return
      }

      try {
        await window.ethereum.request({ method: 'eth_requestAccounts' })

        const provider = new BrowserProvider(window.ethereum)
        const contract = new Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider)

        const logs = await contract.queryFilter('OrderDelivered')

        const parsedLogs: DeliveredOrder[] = logs.map((log) => {
          const args = (log as any).args
          return {
            orderId: args.orderId,
            hospitalName: args.hospitalName,
            medicineId: args.medicineId,
            medicineName: args.medicineName,
            quantity: args.quantity.toString(),
            vendorId: args.vendorId,
            vendorName: args.vendorName,
            timestamp: new Date(Number(args.timestamp) * 1000).toLocaleString(),
            txHash: log.transactionHash,
          }
        })

        setOrders(parsedLogs)
      } catch (err) {
        console.error('Error fetching logs:', err)
        setError('Failed to fetch blockchain logs. Please try again.')
      } finally {
        setLoading(false)
      }
    }

    fetchLogs()
  }, [])

  const filteredOrders = orders.filter((order) =>
    order.orderId.toLowerCase().includes(searchQuery.toLowerCase()) ||
    order.medicineName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    order.hospitalName.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="bg-gradient-to-r from-red-600 to-blue-600 rounded-xl shadow-lg p-6 mb-8 dark:from-gray-800 dark:to-gray-900">
  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
    <div>
      <h1 className="text-2xl sm:text-3xl font-bold text-white dark:text-gray-100 flex items-center">
        <FiPackage className="mr-3 text-blue dark:text-blue-300" />
        Delivered Orders
      </h1>
      <p className="text-blue-100 dark:text-gray-300 mt-1">Blockchain transaction logs</p>
    </div>
    
    <div className="flex flex-col sm:flex-row items-center gap-3">
      <div className="relative w-full sm:w-80">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <FiSearch className="text-blue-800 dark:text-blue-400" />
        </div>
        <input
          type="text"
          placeholder="Search by Order ID, Medicine, Hospital..."
          className="block w-full pl-10 pr-4 py-2 rounded-lg border border-blue-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent dark:focus:ring-blue-500"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      
      <div className="bg-blue-100 dark:bg-blue-900/80 text-blue-800 dark:text-blue-200 px-4 py-2 rounded-lg border border-blue-200 dark:border-blue-800">
        <p className="text-sm font-medium flex items-center">
          <FiFileText className="mr-2" />
          Contract: {CONTRACT_ADDRESS.slice(0, 6)}...{CONTRACT_ADDRESS.slice(-4)}
        </p>
      </div>
    </div>
  </div>
</div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-12">
          <Loader2Icon className="h-8 w-8 animate-spin text-blue-500 mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Loading blockchain logs...</p>
        </div>
      ) : error ? (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <p className="text-red-600 dark:text-red-400 font-medium">{error}</p>
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-8 text-center">
          <PackageIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">No matching orders found</h3>
          <p className="mt-1 text-gray-600 dark:text-gray-400">Try a different search term.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredOrders.map((order, index) => (
            <div key={index} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
                        <PackageIcon className="h-4 w-4 mr-1" />
                        Order #{order.orderId}
                      </span>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {order.timestamp}
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">{order.medicineName}</h3>
                  </div>
                  <a
                    href={`https://sepolia.etherscan.io/tx/${order.txHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                  >
                    View on Etherscan <ExternalLinkIcon className="h-4 w-4 ml-1" />
                  </a>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <div className="iconbox">
                        <HospitalIcon className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                      </div>
                      <div>
                        <p className="label">Healthcare Organization</p>
                        <p className="value">{order.hospitalName}</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="iconbox">
                        <PillIcon className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                      </div>
                      <div>
                        <p className="label">Medicine</p>
                        <p className="value">{order.medicineName} (ID: {order.medicineId})</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-start">
                      <div className="iconbox">
                        <FactoryIcon className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                      </div>
                      <div>
                        <p className="label">Vendor</p>
                        <p className="value">{order.vendorName} (ID: {order.vendorId})</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="iconbox">
                        <TagIcon className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                      </div>
                      <div>
                        <p className="label">Quantity</p>
                        <p className="value">{order.quantity} units</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center">
                    <HashIcon className="h-5 w-5 text-gray-400 mr-2" />
                    <span className="text-sm font-mono text-gray-500 dark:text-gray-400 truncate">
                      {order.txHash}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
