'use client'

import { Button } from '@/app/ui/button'
import { Card, CardContent } from '@/app/ui/card'
import { useRouter } from 'next/navigation'
import { 
  BuildingOfficeIcon,
  TruckIcon,
  UserGroupIcon,
  ShieldCheckIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline'

const userTypes = [
  {
    type: 'Healthcare Providers',
    title: 'Hospitals & Clinics',
    description: 'Join our network to ensure authentic medicines and streamline your pharmaceutical inventory management.',
    icon: UserGroupIcon,
    benefits: ['Real-time inventory tracking', 'Automated compliance reporting', 'Quality assurance monitoring', 'Integrated ERP systems'],
    ctaText: 'Join Healthcare Network',
    ctaLink: '/register?type=healthcare'
  },
  {
    type: 'Manufacturers',
    title: 'Pharmaceutical Companies',
    description: 'Register your products on our blockchain platform to ensure authenticity and build trust with healthcare providers.',
    icon: BuildingOfficeIcon,
    benefits: ['Blockchain product registration', 'Anti-counterfeiting protection', 'Supply chain visibility', 'Regulatory compliance'],
    ctaText: 'Register Products',
    ctaLink: '/register?type=manufacturer'
  },
  {
    type: 'Distributors',
    title: 'Logistics Partners',
    description: 'Optimize your distribution network with our AI-powered routing and real-time tracking capabilities.',
    icon: TruckIcon,
    benefits: ['GPS route optimization', 'Temperature monitoring', 'Automated documentation', 'Performance analytics'],
    ctaText: 'Become Partner',
    ctaLink: '/register?type=distributor'
  },
  {
    type: 'Government',
    title: 'Regulatory Bodies',
    description: 'Monitor and regulate the pharmaceutical supply chain with comprehensive oversight and control tools.',
    icon: ShieldCheckIcon,
    benefits: ['Real-time monitoring', 'Compliance enforcement', 'Audit trail access', 'Policy implementation'],
    ctaText: 'Access Portal',
    ctaLink: '/register?type=government'
  }
]

export function CTASection() {
  const router = useRouter()

  return (
    <section className="py-24 bg-gray-50">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-20 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-white rounded-full px-4 py-2 border border-gray-200 mb-6">
            <UserGroupIcon className="w-4 h-4 text-gray-600" />
            <span className="text-sm font-medium text-gray-600">Join Our Network</span>
          </div>
          
          <h2 className="text-4xl lg:text-6xl font-light text-gray-900 mb-6 leading-tight">
            <span className="font-black">Ready to Get</span>
            <br />
            <span className="text-gray-500">Started?</span>
          </h2>
          
          <p className="text-xl text-gray-600 leading-relaxed">
            Join thousands of healthcare providers, manufacturers, and distributors 
            who trust our platform for secure pharmaceutical supply chain management.
          </p>
        </div>

        {/* User Type Cards */}
        <div className="grid md:grid-cols-2 gap-8 mb-20">
          {userTypes.map((userType, index) => {
            const Icon = userType.icon
            return (
              <Card key={index} className="group bg-white border border-gray-200 hover:border-gray-300 hover:shadow-xl transition-all duration-500 hover:-translate-y-2 rounded-2xl overflow-hidden">
                <CardContent className="p-8">
                  <div className="flex items-start gap-6">
                    <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:bg-gray-200 transition-colors duration-300">
                      <Icon className="w-8 h-8 text-gray-600" />
                    </div>
                    
                    <div className="flex-1">
                      <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                        {userType.type}
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-gray-700 transition-colors">
                        {userType.title}
                      </h3>
                      <p className="text-gray-600 mb-6 leading-relaxed">
                        {userType.description}
                      </p>
                      
                      <div className="space-y-2 mb-8">
                        {userType.benefits.map((benefit, idx) => (
                          <div key={idx} className="flex items-center gap-2 text-sm text-gray-600">
                            <div className="w-1.5 h-1.5 bg-gray-400 rounded-full flex-shrink-0" />
                            <span>{benefit}</span>
                          </div>
                        ))}
                      </div>
                      
                      <Button 
                        onClick={() => router.push(userType.ctaLink)}
                        className="w-full bg-gray-900 text-white hover:bg-gray-800 transition-all duration-300 group/btn rounded-full"
                      >
                        {userType.ctaText}
                        <ArrowRightIcon className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Main CTA Banner */}
        <div className="bg-white rounded-3xl p-12 shadow-lg border border-gray-200 text-center mb-20">
          <h3 className="text-4xl font-light text-gray-900 mb-6">
            <span className="font-black">Start Your Journey</span> Today
          </h3>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Experience the future of pharmaceutical supply chain management. 
            Join our secure blockchain platform and transform your operations.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg"
              onClick={() => router.push('/sign-in')}
              className="bg-gray-900 text-white hover:bg-gray-800 px-8 py-6 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 group"
            >
              Access Platform
              <ArrowRightIcon className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button 
              size="lg"
              variant="outline"
              onClick={() => router.push('/contact')}
              className="border-2 border-gray-200 text-gray-700 hover:border-gray-900 hover:text-gray-900 px-8 py-6 rounded-full transition-all duration-300"
            >
              Schedule Demo
            </Button>
          </div>
        </div>

        {/* Final Status */}
        <div className="text-center mt-16">
          <div className="inline-flex items-center gap-4 bg-emerald-50 border border-emerald-200 rounded-full px-6 py-3">
            <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse" />
            <span className="text-emerald-800 font-medium">All Systems Operational</span>
            <span className="text-emerald-600 text-sm">Ready to serve you</span>
          </div>
        </div>
      </div>
    </section>
  )
}