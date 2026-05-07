'use client'

import { useEffect, useState } from 'react'
import {
  UserCircleIcon,
  EnvelopeIcon,
  ShieldCheckIcon,
  BuildingOfficeIcon,
  CalendarIcon,
  ClockIcon,
  IdentificationIcon,
  PhoneIcon,
  BriefcaseIcon,
  DocumentTextIcon,
  CheckBadgeIcon,
  ExclamationTriangleIcon,
  PaperClipIcon,
  XCircleIcon
} from '@heroicons/react/24/outline'

import { useRouter } from 'next/navigation'
import { ArrowLeftIcon } from '@heroicons/react/24/outline'

export default function ProfilePage() {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
   const router = useRouter()

  useEffect(() => {
    fetch('/api/profile')
      .then(res => res.json())
      .then(json => {
        setData(json)
        setLoading(false)
      })
      .catch(err => {
        console.error(err)
        setLoading(false)
      })
  }, [])

  if (loading) return (
    <div className="p-6 flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  )

  if (!data) return (
    <div className="p-6 flex flex-col items-center justify-center h-64 text-red-500">
      <ExclamationTriangleIcon className="h-12 w-12 mb-4" />
      <p className="text-lg">Failed to load profile data</p>
      <button 
        onClick={() => window.location.reload()}
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        Retry
      </button>
    </div>
  )

  const { user, verification } = data
  const isVerified = verification?.applicationStatus === 'APPROVED'

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Profile Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-white">
          <div className="flex items-center space-x-4">
            <UserCircleIcon className="h-16 w-16" />
            <div>
              <h1 className="text-2xl font-bold">{user.name}</h1>
              <p className="flex items-center">
                <EnvelopeIcon className="h-4 w-4 mr-1" />
                {user.email}
              </p>
              <div className="flex items-center mt-1 space-x-2">
                <span className={`px-2 py-1 text-xs rounded-full flex items-center ${
                  isVerified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {isVerified ? (
                    <>
                      <CheckBadgeIcon className="h-3 w-3 mr-1" />
                      Verified Account
                    </>
                  ) : (
                    <>
                      <XCircleIcon className="h-3 w-3 mr-1" />
                      Unverified Account
                    </>
                  )}
                </span>
                <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                  {user.role}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="p-6">
          {/* User Details */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <UserCircleIcon className="h-5 w-5 mr-2 text-blue-600" />
              Personal Information
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-start">
                <div className="bg-blue-100 p-2 rounded-lg mr-3">
                  <BuildingOfficeIcon className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Organization</p>
                  <p className="font-medium">{user.organization || 'Not specified'}</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-blue-100 p-2 rounded-lg mr-3">
                  <ShieldCheckIcon className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Email Verification</p>
                  <p className="font-medium">
                    {user.isEmailVerified ? (
                      <span className="text-green-600 flex items-center">
                        <CheckBadgeIcon className="h-4 w-4 mr-1" />
                        Verified
                      </span>
                    ) : (
                      <span className="text-yellow-600 flex items-center">
                        <XCircleIcon className="h-4 w-4 mr-1" />
                        Pending
                      </span>
                    )}
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-blue-100 p-2 rounded-lg mr-3">
                  <CalendarIcon className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Member Since</p>
                  <p className="font-medium">{new Date(user.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-blue-100 p-2 rounded-lg mr-3">
                  <ClockIcon className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Last Updated</p>
                  <p className="font-medium">{new Date(user.updatedAt).toLocaleString()}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Verification Section */}
          {verification && (
            <div>
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <IdentificationIcon className="h-5 w-5 mr-2 text-blue-600" />
                Professional Verification
              </h2>
              
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-start">
                    <div className="bg-blue-100 p-2 rounded-lg mr-3">
                      <UserCircleIcon className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Full Name</p>
                      <p className="font-medium">{verification.fullName}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="bg-blue-100 p-2 rounded-lg mr-3">
                      <PhoneIcon className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Phone Number</p>
                      <p className="font-medium">{verification.phoneNumber}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="bg-blue-100 p-2 rounded-lg mr-3">
                      <BriefcaseIcon className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Designation</p>
                      <p className="font-medium">{verification.designation}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="bg-blue-100 p-2 rounded-lg mr-3">
                      <DocumentTextIcon className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">License Number</p>
                      <p className="font-medium">{verification.licenseNumber}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="bg-blue-100 p-2 rounded-lg mr-3">
                      <ShieldCheckIcon className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">License Type</p>
                      <p className="font-medium">{verification.licenseType}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="bg-blue-100 p-2 rounded-lg mr-3">
                      <BuildingOfficeIcon className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Issued By</p>
                      <p className="font-medium">{verification.licenseIssuedBy}</p>
                    </div>
                  </div>
                </div>
                
                {/* Status */}
                <div className="mt-4 flex items-center">
                  <div className={`p-2 rounded-lg mr-3 ${
                    verification.applicationStatus === 'approved' ? 'bg-green-100' :
                    verification.applicationStatus === 'rejected' ? 'bg-red-100' : 'bg-yellow-100'
                  }`}>
                    <ShieldCheckIcon className={`h-5 w-5 ${
                      verification.applicationStatus === 'approved' ? 'text-green-600' :
                      verification.applicationStatus === 'rejected' ? 'text-red-600' : 'text-yellow-600'
                    }`} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Verification Status</p>
                    <p className={`font-medium flex items-center ${
                      verification.applicationStatus === 'approved' ? 'text-green-600' :
                      verification.applicationStatus === 'rejected' ? 'text-red-600' : 'text-yellow-600'
                    }`}>
                      {verification.applicationStatus === 'approved' ? (
                        <CheckBadgeIcon className="h-4 w-4 mr-1" />
                      ) : verification.applicationStatus === 'rejected' ? (
                        <XCircleIcon className="h-4 w-4 mr-1" />
                      ) : null}
                      {verification.applicationStatus.charAt(0).toUpperCase() + verification.applicationStatus.slice(1)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Documents */}
              {['idProofUrl', 'licenseCertificateUrl', 'addressProofUrl'].some(field => verification[field]) && (
                <div>
                  <h3 className="text-lg font-semibold mb-3 flex items-center">
                    <PaperClipIcon className="h-5 w-5 mr-2 text-blue-600" />
                    Attached Documents
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {verification.idProofUrl && (
                      <a 
                        href={verification.idProofUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="border rounded-lg p-3 hover:bg-gray-50 transition-colors flex items-center"
                      >
                        <DocumentTextIcon className="h-5 w-5 text-blue-600 mr-2" />
                        <span>ID Proof</span>
                      </a>
                    )}

                    {verification.licenseCertificateUrl && (
                      <a 
                        href={verification.licenseCertificateUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="border rounded-lg p-3 hover:bg-gray-50 transition-colors flex items-center"
                      >
                        <DocumentTextIcon className="h-5 w-5 text-blue-600 mr-2" />
                        <span>License Certificate</span>
                      </a>
                    )}

                    {verification.addressProofUrl && (
                      <a 
                        href={verification.addressProofUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="border rounded-lg p-3 hover:bg-gray-50 transition-colors flex items-center"
                      >
                        <DocumentTextIcon className="h-5 w-5 text-blue-600 mr-2" />
                        <span>Address Proof</span>
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      <button
      onClick={() => router.back()}
      className="flex items-center gap-2 px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md text-sm font-medium"
    >
      <ArrowLeftIcon className="h-5 w-5" />
      Go Back
    </button>
    </div>
  )
}
