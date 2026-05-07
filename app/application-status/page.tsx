'use client'

import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Button } from '@/app/ui/button'

// Status type
type AppStatus = 'PENDING' | 'APPROVED' | 'REJECTED'

// Core layout components
const Card = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <div className={`rounded-lg border border-gray-200 bg-white shadow ${className}`}>{children}</div>
)

const CardHeader = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <div className={`border-b border-gray-100 px-8 py-6 ${className}`}>{children}</div>
)

const CardTitle = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <h2 className={`text-xl font-semibold text-gray-900 ${className}`}>{children}</h2>
)

const CardContent = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <div className={`px-8 py-6 ${className}`}>{children}</div>
)

const CardFooter = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <div className={`border-t border-gray-100 bg-gray-50 px-8 py-4 ${className}`}>{children}</div>
)

// Status badge component
const Badge = ({ children, variant = 'default' }: { children: React.ReactNode; variant?: 'default' | 'pending' | 'approved' | 'rejected' }) => {
  const cls = {
    default: 'bg-gray-100 text-gray-800',
    pending: 'bg-amber-50 text-amber-800 border border-amber-200',
    approved: 'bg-emerald-50 text-emerald-800 border border-emerald-200',
    rejected: 'bg-red-50 text-red-800 border border-red-200',
  }
  return (
    <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${cls[variant]}`}>
      {children}
    </span>
  )
}

// Icons
const Icons = {
  user: () => (
    <svg className="h-5 w-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  ),
  mail: () => (
    <svg className="h-5 w-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  ),
  phone: () => (
    <svg className="h-5 w-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
    </svg>
  ),
  briefcase: () => (
    <svg className="h-5 w-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  ),
  document: () => (
    <svg className="h-5 w-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  ),
  externalLink: () => (
    <svg className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
    </svg>
  ),
  clock: () => (
    <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  alertCircle: () => (
    <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  logout: () => (
    <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
    </svg>
  ),
  personal: () => (
    <svg className="h-5 w-5 text-blue-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  ),
  professional: () => (
    <svg className="h-5 w-5 text-blue-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  ),
  license: () => (
    <svg className="h-5 w-5 text-blue-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
  ),
  documents: () => (
    <svg className="h-5 w-5 text-blue-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  ),
}

// Skeleton loader
const Skeleton = ({ className = '' }: { className?: string }) => (
  <div className={`animate-pulse rounded bg-gray-100 ${className}`} />
)

export default function ApplicationStatusPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [appStatus, setAppStatus] = useState<AppStatus | null>(null)
  const [loading, setLoading] = useState(true)
  const [verificationData, setVerificationData] = useState<any>(null)

  useEffect(() => {
    if (status === 'loading') return
    if (!session) return router.push('/sign-in')

    fetch('/api/verification/status')
      .then(res => res.json().then(data => ({ ok: res.ok, status: res.status, data })))
      .then(({ ok, status, data }) => {
        if (ok) {
          setAppStatus(data.applicationStatus)
          setVerificationData(data)
          if (data.applicationStatus === 'APPROVED') {
            const role = session.user.role?.toLowerCase() || ''
            router.push(`/dashboard/${role}`)
          }
        } else if (status === 404) {
          router.push('/apply-verification')
        } else {
          setAppStatus(null)
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [session, status, router])

  const variant = appStatus === 'PENDING' ? 'pending' : appStatus === 'APPROVED' ? 'approved' : appStatus === 'REJECTED' ? 'rejected' : 'default'

  const fileLink = (url?: string, label = 'View document') =>
    url ? (
      <button onClick={() => window.open(url, '_blank')} className="inline-flex items-center text-blue-600 hover:text-blue-800 text-sm font-medium">
        <Icons.externalLink />
        {label}
      </button>
    ) : (
      <span className="text-gray-400 text-sm">Not provided</span>
    )

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
        <Card className="w-full max-w-4xl">
          <CardHeader><Skeleton className="h-7 w-48" /></CardHeader>
          <CardContent className="space-y-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="flex justify-between">
                <Skeleton className="h-4 w-32" /><Skeleton className="h-4 w-48" />
              </div>
            ))}
          </CardContent>
          <CardFooter className="flex justify-end"><Skeleton className="h-9 w-24" /></CardFooter>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-4xl">
        <CardHeader className="bg-white">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Verification Status</CardTitle>
              <p className="text-sm text-gray-500">Review your application details and status</p>
            </div>
            <Badge variant={variant}>{appStatus || 'UNKNOWN'}</Badge>
          </div>
        </CardHeader>

        <CardContent className="grid gap-8 md:grid-cols-2">
          {/* Left */}
          <div className="space-y-6">
            {/* Personal Info */}
            <Section title="Personal Information" rows={[
              ['Full Name', session?.user?.name, <Icons.user />],
              ['Email', session?.user?.email, <Icons.mail />],
              ['Phone', verificationData?.phoneNumber, <Icons.phone />],
            ]} />

            {/* Professional Details */}
            <Section title="Professional Details" rows={[
              ['Role', session?.user?.role, <Icons.briefcase />],
              ['Designation', verificationData?.designation, <Icons.briefcase />],
              ['Organization', verificationData?.organization, <Icons.briefcase />],
            ]} />
          </div>

          {/* Right */}
          <div className="space-y-6">
            {/* License Info */}
            <Section title="License Information" rows={[
              ['License Number', verificationData?.licenseNumber, <Icons.document />],
              ['License Type', verificationData?.licenseType, <Icons.document />],
              ['Issued By', verificationData?.licenseIssuedBy, <Icons.document />],
            ]} />

            {/* Documents */}
            <SectionCustom title="Supporting Documents" rows={[
              ['Government ID', fileLink(verificationData?.idProofUrl), <Icons.document />],
              ['License Certificate', fileLink(verificationData?.licenseCertificateUrl), <Icons.document />],
              ['Address Proof', fileLink(verificationData?.addressProofUrl), <Icons.document />],
            ]} />
          </div>
        </CardContent>

        <CardFooter className="flex flex-col sm:flex-row sm:justify-between items-center gap-4">
          {appStatus === 'PENDING' && (
            <p className="flex items-center text-sm text-amber-600">
              <Icons.clock />
              Your application is under review. We'll notify you once processed.
            </p>
          )}
          {appStatus === 'REJECTED' && (
            <p className="flex items-center text-sm text-red-600">
              <Icons.alertCircle />
              Your application was rejected. Please contact support.
            </p>
          )}
          <Button variant="outline" onClick={() => signOut({ callbackUrl: '/sign-in' })}>
            <Icons.logout />
            Sign Out
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

// Reusable section component with icons
function Section({ title, rows }: { title: string; rows: (string | React.ReactNode | undefined)[][] }) {
  const iconMap: Record<string, React.ReactNode> = {
    'Personal Information': <Icons.personal />,
    'Professional Details': <Icons.professional />,
    'License Information': <Icons.license />,
    'Supporting Documents': <Icons.documents />,
  }

  return (
    <div>
      <div className="flex items-center mb-4">
        <div className="mr-2">
          {iconMap[title]}
        </div>
        <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-500">{title}</h3>
      </div>
      <div className="space-y-4">
        {rows.map(([label, value, icon], i) => (
          <div key={i} className="flex items-start">
            <div className="flex-shrink-0 mt-0.5 mr-3">
              {icon}
            </div>
            <div className="flex-1 flex justify-between">
              <span className="text-sm font-medium text-gray-500">{label}</span>
              <span className="text-sm font-medium text-gray-900 text-right">{value || '—'}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function SectionCustom({ title, rows }: { title: string; rows: (string | React.ReactNode)[][] }) {
  const iconMap: Record<string, React.ReactNode> = {
    'Personal Information': <Icons.personal />,
    'Professional Details': <Icons.professional />,
    'License Information': <Icons.license />,
    'Supporting Documents': <Icons.documents />,
  }

  return (
    <div>
      <div className="flex items-center mb-4">
        <div className="mr-2">
          {iconMap[title]}
        </div>
        <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-500">{title}</h3>
      </div>
      <div className="space-y-4">
        {rows.map(([label, node, icon], i) => (
          <div key={i} className="flex items-start">
            <div className="flex-shrink-0 mt-0.5 mr-3">
              {icon}
            </div>
            <div className="flex-1 flex justify-between">
              <span className="text-sm font-medium text-gray-500">{label}</span>
              <div>{node}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}