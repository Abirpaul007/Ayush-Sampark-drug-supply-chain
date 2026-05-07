'use client'

import { Button } from '@/app/ui/button'
import { useRouter } from 'next/navigation'
import { ArrowRightIcon, ShieldCheckIcon, EyeIcon, ClockIcon } from '@heroicons/react/24/outline'

export function Hero() {
  const router = useRouter()

  return (
    <section className="relative bg-white min-h-screen flex items-center overflow-hidden">
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgb(0,0,0,0.15)_1px,transparent_0)] [background-size:20px_20px] opacity-[0.02]" />
      
      {/* Floating Geometric Elements */}
      <div className="absolute top-20 left-10 w-2 h-20 bg-gray-100 rotate-45 opacity-30" />
      <div className="absolute top-40 right-16 w-16 h-2 bg-gray-100 opacity-30" />
      <div className="absolute bottom-32 left-1/4 w-3 h-24 bg-gray-100 rotate-12 opacity-30" />
      <div className="absolute bottom-20 right-1/3 w-20 h-3 bg-gray-100 opacity-30" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left Content */}
            <div className="space-y-8">
              {/* Main Heading */}
              <h1 className="text-5xl lg:text-7xl font-light text-gray-900 leading-[1.1] tracking-tight">
                Secure Drug
                <br />
                <span className="font-black">Supply Chain</span>
                <br />
                <span className="text-4xl lg:text-5xl text-gray-500">Ayush Samparkh</span>
              </h1>

              {/* Description */}
              <p className="text-xl text-gray-600 leading-relaxed max-w-lg">
                Blockchain-powered transparency ensuring authentic medicines reach every citizen safely and efficiently.
              </p>

              {/* Action Buttons */}
              <div className="flex items-center gap-4 pt-4">
                <Button 
                  size="lg"
                  onClick={() => router.push('/sign-in')}
                  className="bg-gray-900 text-white hover:bg-gray-800 px-8 py-6 text-base rounded-full transition-all duration-300 shadow-lg hover:shadow-xl group"
                >
                  Access Platform
                  <ArrowRightIcon className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
                
                <Button 
                  variant="outline"
                  size="lg"
                  onClick={() => router.push('/features')}
                  className="border-2 border-gray-200 text-gray-700 hover:border-gray-900 hover:text-gray-900 px-8 py-6 text-base rounded-full transition-all duration-300"
                >
                  Learn More
                </Button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-8 pt-8 border-t border-gray-100">
                <div>
                  <div className="text-2xl font-bold text-gray-900">50+</div>
                  <div className="text-sm text-gray-500">Daily Transactions</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">5+</div>
                  <div className="text-sm text-gray-500">Healthcare Partners</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">99.9%</div>
                  <div className="text-sm text-gray-500">Uptime</div>
                </div>
              </div>
            </div>

            {/* Right Visual */}
            <div className="relative">
              {/* Main Card */}
              <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 p-8 relative z-10">
                <div className="space-y-6">
                  {/* Header */}
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-semibold text-gray-900">Supply Chain Status</h3>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                      <span className="text-sm text-gray-600">Live</span>
                    </div>
                  </div>

                  {/* Features */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <ShieldCheckIcon className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">Blockchain Security</div>
                        <div className="text-xs text-gray-500">100% Tamper-proof Records</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                        <EyeIcon className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">Real-time Tracking</div>
                        <div className="text-xs text-gray-500">End-to-end Visibility</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                      <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                        <ClockIcon className="w-5 h-5 text-purple-600" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">24/7 Monitoring</div>
                        <div className="text-xs text-gray-500">Continuous Surveillance</div>
                      </div>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">System Health</span>
                      <span className="text-gray-900 font-medium">98%</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2">
                      <div className="bg-emerald-500 h-2 rounded-full w-[98%] transition-all duration-1000" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Elements */}
              <div className="absolute -top-6 -right-6 w-24 h-24 bg-blue-50 rounded-2xl rotate-12 opacity-60" />
              <div className="absolute -bottom-6 -left-6 w-20 h-20 bg-emerald-50 rounded-2xl -rotate-12 opacity-60" />
              <div className="absolute top-1/2 -right-8 w-16 h-32 bg-purple-50 rounded-xl rotate-45 opacity-40" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
} 