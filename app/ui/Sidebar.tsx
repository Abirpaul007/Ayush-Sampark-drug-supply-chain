'use client'

import { useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { cn } from '@/lib/utils'
import {
  Gauge, ShoppingCart, ClipboardList, FileSearch, FileCheck, History, Upload,
  Package, ArrowLeftRight, RotateCcw,Gavel, LineChart, AlertCircle, CalendarClock,
  MessageSquare, FileText, Settings, Users, Network, PackageCheck, Pill,
  BarChart, FileCode, Activity, Bell, Send, Truck, FileUp, FileSignature,ClipboardCheck,
  PackagePlus, ShieldCheck, Stethoscope, Factory, ChevronLeft, ChevronRight
} from 'lucide-react'

// Sidebar items
const sidebarItemsMap: Record<string, { title: string, href: string, icon: any }[]> = {
  ADMIN: [
    { title: 'Dashboard', href: '/dashboard/admin', icon: Gauge },
    { title: 'Hospital Requests', href: '/dashboard/admin/HospitalRequests', icon: ClipboardCheck },
    { title: 'Pharmacy Requests', href: '/dashboard/admin/PharmacyRequests', icon: ShoppingCart },
    { title: 'Supply Chain', href: '/dashboard/admin/SupplyChainTracker', icon: Network },
    { title: 'Inventory', href: '/dashboard/admin/InventoryOverview', icon: PackageCheck }, 
    { title: 'New User Requests', href: '/dashboard/admin/NewUser', icon: Users },
    { title: 'User Management', href: '/dashboard/admin/UserManagement', icon: Users },
    { title: 'Drug Management', href: '/dashboard/admin/DrugManagement', icon: Pill },
    { title: 'Analytics', href: '/dashboard/admin/ReportsAnalytics', icon: BarChart },
    { title: 'Smart Contracts', href: '/dashboard/admin/SmartContractLogs', icon: FileCode },
    { title: 'Performance', href: '/dashboard/admin/PerformanceMonitoring', icon: Activity },
    { title: 'Tender', href: '/dashboard/admin/Prediction-table', icon: Gavel },
    { title: 'Notifications', href: '/dashboard/admin/Notifications', icon: Bell },
    { title: 'Settings', href: '/dashboard/admin/Settings', icon: Settings },
  ],
  HOSPITAL: [
    { title: 'Dashboard', href: '/dashboard/hospital', icon: Gauge },
    { title: 'Order Drugs', href: '/dashboard/hospital/OrderDrugs', icon: ShoppingCart },
    { title: 'My Orders', href: '/dashboard/hospital/MyOrders', icon: ClipboardList },
    { title: 'Track Orders', href: '/dashboard/hospital/TrackOrders', icon: FileSearch },
    { title: 'Confirm Delivery', href: '/dashboard/hospital/ConfirmDelivery', icon: FileCheck },
    { title: 'Usage History', href: '/dashboard/hospital/UsageHistory', icon: History },
    { title: 'Upload Receipt', href: '/dashboard/hospital/UploadReceipt', icon: Upload },
    { title: 'Inventory', href: '/dashboard/hospital/ViewInventory', icon: Package },
    { title: 'Dispense Drugs', href: '/dashboard/hospital/DispenseDrugs', icon: ClipboardList },
    { title: 'Low Stock Alerts', href: '/dashboard/hospital/LowStockAlerts', icon: AlertCircle },
    { title: 'Expiry Logs', href: '/dashboard/hospital/DrugExpiryLogs', icon: CalendarClock },
    { title: 'Feedback & Support', href: '/dashboard/hospital/FeedbackSupport', icon: MessageSquare },
    { title: 'Delivery Log', href: '/dashboard/hospital/DeliveryLog', icon: FileText },
    { title: 'Dispense Logs', href: '/dashboard/hospital/dispenseLogs', icon: Settings },
    
  ],
  PHARMACY: [
    { title: 'Dashboard', href: '/dashboard/pharmacy', icon: Gauge },
    { title: 'Order Drugs', href: '/dashboard/pharmacy/OrderDrugs', icon: ShoppingCart },
    { title: 'My Orders', href: '/dashboard/pharmacy/MyOrders', icon: ClipboardList },
    { title: 'Track Orders', href: '/dashboard/pharmacy/TrackOrders', icon: FileSearch },
    { title: 'Confirm Delivery', href: '/dashboard/pharmacy/ConfirmDelivery', icon: FileCheck },
    { title: 'Inventory', href: '/dashboard/pharmacy/ViewInventory', icon: Package },
    { title: 'Upload POD', href: '/dashboard/pharmacy/InternalTransfers', icon: Upload},
   
    { title: 'Drugs Sold', href: '/dashboard/pharmacy/DrugsSold', icon: ArrowLeftRight },
    { title: 'Consumption Chart', href: '/dashboard/pharmacy/ConsumptionChart', icon: LineChart },
    { title: 'Expiry Alerts', href: '/dashboard/pharmacy/FeedbackAlerts', icon: AlertCircle },
    { title: 'Settings', href: '/dashboard/pharmacy/Settings', icon: Settings },
  ],
  VENDOR: [
    { title: 'Manufacturer Dashboard', href: '/dashboard/vendor/ManufacturerDashboard', icon: Gauge },
    { title: 'Add Medicine', href: '/dashboard/vendor/AddMedicine', icon: PackagePlus },
    { title: 'Update Stock', href: '/dashboard/vendor/UpdateStock', icon: PackagePlus },
    { title: 'Received Orders', href: '/dashboard/vendor/ReceivedOrders', icon: ShoppingCart },
    { title: 'Mark Dispatched', href: '/dashboard/vendor/MarkDispatched', icon: FileCheck },
    { title: 'Dispatch Status', href: '/dashboard/vendor/DispatchStatus', icon: Truck },
    { title: 'Upload Invoice', href: '/dashboard/vendor/UploadInvoice', icon: FileUp },
    { title: 'Recieve POD', href: '/dashboard/vendor/UploadPOD', icon: FileSignature },
    { title: 'Performance Metrics', href: '/dashboard/vendor/PerformanceMetrics', icon: PackagePlus },
    { title: 'Inventory', href: '/dashboard/vendor/Inventory', icon: FileText },
    { title: 'Expiry Logs', href: '/dashboard/vendor/ExpiryLogs', icon: FileText },
  ]
}

export default function Sidebar() {
  const { data: session, status } = useSession()
  const pathname = usePathname()
  const router = useRouter()
  const [isCollapsed, setIsCollapsed] = useState(false)

  if (status === 'loading') {
    return <div className="p-4 text-center text-sm text-gray-500">Loading sidebar...</div>
  }

  const user = session?.user

  if (!user) {
    return <div className="p-4 text-center text-sm text-red-500">No user session found</div>
  }

  const sidebarItems = sidebarItemsMap[user.role] ?? []

  const toggleSidebar = () => setIsCollapsed(!isCollapsed)

  const roleIcons: Record<string, any> = {
    ADMIN: ShieldCheck,
    HOSPITAL: Stethoscope,
    PHARMACY: Pill,
    VENDOR: Factory
  }
  const RoleIcon = roleIcons[user.role]

  return (
    <div className={cn(
      "fixed top-16 left-0 h-[calc(100vh-4rem)] flex flex-col border-r transition-all duration-300 ease-in-out z-40",
      isCollapsed ? "w-20" : "w-64",
      "bg-gradient-to-b from-indigo-50 to-blue-50"
    )}>
      <div className="flex h-14 items-center border-b px-4">
        {isCollapsed ? (
          <div className="flex items-center justify-center w-full">
            <RoleIcon className="h-6 w-6 text-indigo-600" />
          </div>
        ) : (
          <h2 className="text-lg font-semibold text-indigo-800 whitespace-nowrap">
            {user.role} Portal
          </h2>
        )}
      </div>

      <div className="flex-1 overflow-auto py-4">
        <nav className="grid gap-1 px-2">
          {sidebarItems.map((item) => {
            const Icon = item.icon
            return (
              <button
                key={item.href}
                onClick={() => router.push(item.href)}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                  'hover:bg-indigo-100 hover:text-indigo-800',
                  pathname === item.href
                    ? 'bg-indigo-100 text-indigo-800 font-semibold'
                    : 'text-gray-600',
                  isCollapsed ? 'justify-center' : 'justify-start'
                )}
                title={isCollapsed ? item.title : undefined}
              >
                <Icon className={cn("h-5 w-5 flex-shrink-0", pathname === item.href ? "text-indigo-600" : "text-gray-500")} />
                {!isCollapsed && <span className="whitespace-nowrap">{item.title}</span>}
              </button>
            )
          })}
        </nav>
      </div>

      <div className={cn("border-t p-4 transition-all", isCollapsed ? "px-2" : "px-4")}>
        <div className="flex items-center gap-3">
          <div className={cn("flex items-center justify-center rounded-full bg-indigo-100 text-indigo-800 font-medium flex-shrink-0", isCollapsed ? "h-8 w-8 text-xs" : "h-10 w-10 text-sm")}>
            {user.name?.[0]?.toUpperCase()}
          </div>
          {!isCollapsed && (
            <div className="overflow-hidden">
              <p className="text-sm font-medium truncate">{user.name}</p>
              <p className="text-xs text-gray-500 truncate">{user.role}</p>
            </div>
          )}
        </div>
      </div>

      <div className="absolute -right-3 top-1/2 transform -translate-y-1/2 z-10">
        <button onClick={toggleSidebar} className="rounded-full border bg-white p-1 shadow-md hover:bg-gray-100 transition-colors">
          {isCollapsed ? <ChevronRight className="h-4 w-4 text-indigo-600" /> : <ChevronLeft className="h-4 w-4 text-indigo-600" />}
        </button>
      </div>
    </div>
  )
}
