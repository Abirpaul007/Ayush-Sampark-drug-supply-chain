'use client'

import { useSelector } from 'react-redux'
import { RootState } from '@/lib/store'
import AdminDashboardPage from '@/app/dashboard/admin/AdminDashboard/page'
import HospitalDashboardPage from '@/app/dashboard/hospital/HospitalDashboard/page'
import PharmacyDashboardPage from '@/app/dashboard/pharmacy/PharmacyDashboard/page'
import ManufacturerDashboardPage from '@/app/dashboard/vendor/ManufacturerDashboard/page'

export default function DashboardPage() {
  const { user } = useSelector((state: RootState) => state.auth)

  if (!user) {
    return null
  }

  switch (user.role) {
    case 'ADMIN':
      return <AdminDashboardPage />
    case 'HOSPITAL':
      return <HospitalDashboardPage />
    case 'PHARMACY':
      return <PharmacyDashboardPage />
    case 'VENDOR':
      return <ManufacturerDashboardPage />
    default:
      return null
  }
} 