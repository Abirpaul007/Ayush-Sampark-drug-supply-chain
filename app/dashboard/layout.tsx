'use client'

import { useRouter, usePathname } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { useSelector } from 'react-redux'
import { RootState } from '@/lib/store'
import { useEffect, useState } from 'react'
import Sidebar from '@/app/ui/Sidebar'
import DashboardNavbar from '@/app/ui/DashboardNavbar'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()
  const { data: session, status } = useSession()
  const { user } = useSelector((state: RootState) => state.auth)

  const [verifying, setVerifying] = useState(true)

  useEffect(() => {
    const verifyAccess = async () => {
      if (status === 'loading') return

      if (!session) {
        router.push('/sign-in')
        return
      }

      const user = session.user

      try {
        const res = await fetch('/api/verification/status')
        const data = await res.json()

        if (!res.ok || data.applicationStatus !== 'APPROVED') {
          router.push('/application-status')
          return
        }

        const role = user.role
        const expectedBasePath = `/dashboard/${role.toLowerCase().replace('_staff', '')}`

        if (!pathname.startsWith(expectedBasePath)) {
          router.push(expectedBasePath)
          return
        }

        setVerifying(false)
      } catch (err) {
        console.error('Verification failed:', err)
        router.push('/application-status')
      }
    }

    verifyAccess()
  }, [status, session, pathname, router])

  if (status === 'loading' || verifying || !session?.user) {
    return (
      <div className="p-8 text-center text-sm text-gray-500">
        Loading dashboard...
      </div>
    )
  }

  return (
    <div className="flex flex-col h-screen">
      <DashboardNavbar />
      <div className="flex flex-1 pt-16">
        {/* Sidebar with fixed width */}
        <div className="w-64 shrink-0">
          <Sidebar />
        </div>

        {/* Main content fills the rest */}
        <main className="flex-1 overflow-y-auto p-8 bg-gray-50">
          {children}
        </main>
      </div>
    </div>
  )
}
