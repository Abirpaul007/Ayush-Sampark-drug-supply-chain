'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/app/ui/button'
import { Input } from '@/app/ui/input'
import { Card, CardContent } from '@/app/ui/card'
import { Navbar } from '@/app/ui/Navbar'
import { 
  UserCircleIcon,
  EnvelopeIcon,
  BuildingOfficeIcon,
  EyeIcon,
  EyeSlashIcon,
  UserGroupIcon,
  LockClosedIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline'
import Link from 'next/link'

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'HOSPITAL',
    organization: '',
  })

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      setIsLoading(false)
      return
    }

    try {
      const response = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: formData.role,
          organization: formData.organization,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        router.push(`/verify-otp/${encodeURIComponent(formData.email)}`)
      } else {
        setError(data.message || 'Registration failed')
      }
    } catch (err) {
      setError('An error occurred during registration')
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="flex items-center justify-center min-h-screen py-24 px-6">
        <div className="w-full max-w-lg">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 bg-white rounded-full px-4 py-2 border border-gray-200 mb-6">
              <UserCircleIcon className="w-4 h-4 text-gray-600" />
              <span className="text-sm font-medium text-gray-600">Join Our Platform</span>
            </div>
            
            <h1 className="text-4xl font-light text-gray-900 mb-4">
              <span className="font-black">Create</span>
              <br />
              <span className="text-gray-500 text-2xl">Your Account</span>
            </h1>
            
            <p className="text-gray-600">
              Join the Ayush Samparkh platform and help secure the pharmaceutical supply chain
            </p>
          </div>

          {/* Registration Form */}
          <Card className="bg-white border border-gray-200 shadow-lg rounded-2xl overflow-hidden">
            <CardContent className="p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-semibold text-gray-900 mb-2">
                      Full Name
                    </label>
                    <div className="relative">
                      <UserCircleIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <Input
                        id="name"
                        name="name"
                        type="text"
                        placeholder="John Doe"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="pl-10 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-semibold text-gray-900 mb-2">
                      Email Address
                    </label>
                    <div className="relative">
                      <EnvelopeIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="your@email.com"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="pl-10 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label htmlFor="organization" className="block text-sm font-semibold text-gray-900 mb-2">
                    Organization Name
                  </label>
                  <div className="relative">
                    <BuildingOfficeIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                      id="organization"
                      name="organization"
                      type="text"
                      placeholder="Organization name"
                      value={formData.organization}
                      onChange={handleChange}
                      required
                      className="pl-10 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="role" className="block text-sm font-semibold text-gray-900 mb-2">
                    Organization Type
                  </label>
                  <div className="relative">
                    <UserGroupIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <select
                      id="role"
                      name="role"
                      value={formData.role}
                      onChange={handleChange}
                      className="w-full pl-10 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all bg-white"
                      required
                    >
                      <option value="HOSPITAL">Hospital</option>
                      <option value="PHARMACY">Pharmacy</option>
                      <option value="VENDOR">Vendor</option>
                    </select>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="password" className="block text-sm font-semibold text-gray-900 mb-2">
                      Password
                    </label>
                    <div className="relative">
                      <LockClosedIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <Input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        className="pl-10 pr-10 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        onClick={togglePasswordVisibility}
                      >
                        {showPassword ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-900 mb-2">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <LockClosedIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <Input
                        id="confirmPassword"
                        name="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required
                        className="pl-10 pr-10 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        onClick={toggleConfirmPasswordVisibility}
                      >
                        {showConfirmPassword ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>
                </div>

                {error && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
                    <p className="text-red-700 text-sm font-medium">{error}</p>
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full bg-gray-900 text-white hover:bg-gray-800 py-4 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Creating Account...
                    </>
                  ) : (
                    <>
                      Create Account
                      <ArrowRightIcon className="w-4 h-4" />
                    </>
                  )}
                </Button>
              </form>

              <div className="mt-8 pt-6 border-t border-gray-200 text-center">
                <p className="text-sm text-gray-600">
                  Already have an account?{' '}
                  <Link
                    href="/sign-in"
                    className="font-semibold text-gray-900 hover:text-gray-700 transition-colors"
                  >
                    Sign In
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
