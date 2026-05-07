'use client'

import { Card, CardContent } from '@/app/ui/card'
import { 
  ShieldCheckIcon, 
  EyeIcon, 
  TruckIcon, 
  UserGroupIcon,
  DocumentTextIcon,
  CogIcon,
  ClockIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline'

const features = [
  {
    title: 'Blockchain Security',
    description: 'Immutable ledger technology ensures complete data integrity and prevents unauthorized tampering.',
    icon: ShieldCheckIcon,
    color: 'blue' as const
  },
  {
    title: 'Real-time Visibility',
    description: 'Track every pharmaceutical product with precision from manufacturing to patient delivery.',
    icon: EyeIcon,
    color: 'emerald' as const
  },
  {
    title: 'Smart Logistics',
    description: 'AI-powered supply chain optimization with automated routing and inventory management.',
    icon: TruckIcon,
    color: 'purple' as const
  },
  {
    title: 'Multi-Stakeholder Access',
    description: 'Unified platform connecting hospitals, pharmacies, distributors, and regulatory bodies.',
    icon: UserGroupIcon,
    color: 'orange' as const
  },
  {
    title: 'Automated Compliance',
    description: 'Built-in regulatory reporting and audit trails ensuring full compliance with healthcare standards.',
    icon: DocumentTextIcon,
    color: 'teal' as const
  },
  {
    title: 'Smart Contracts',
    description: 'Self-executing agreements that automate payments and quality verification processes.',
    icon: CogIcon,
    color: 'rose' as const
  },
  {
    title: '24/7 Monitoring',
    description: 'Continuous system surveillance with instant alerts for any anomalies or issues.',
    icon: ClockIcon,
    color: 'indigo' as const
  },
  {
    title: 'Quality Assurance',
    description: 'Comprehensive quality control with temperature monitoring and condition tracking.',
    icon: CheckCircleIcon,
    color: 'amber' as const
  }
]

const colorClasses = {
  blue: 'bg-blue-50 text-blue-600',
  emerald: 'bg-emerald-50 text-emerald-600',
  purple: 'bg-purple-50 text-purple-600',
  orange: 'bg-orange-50 text-orange-600',
  teal: 'bg-teal-50 text-teal-600',
  rose: 'bg-rose-50 text-rose-600',
  indigo: 'bg-indigo-50 text-indigo-600',
  amber: 'bg-amber-50 text-amber-600'
}

export function Features() {
  return (
    <section className="py-24 bg-gray-50">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-20 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-white rounded-full px-4 py-2 border border-gray-200 mb-6">
            <div className="w-2 h-2 bg-gray-400 rounded-full" />
            <span className="text-sm font-medium text-gray-600">Core Features</span>
          </div>
          
          <h2 className="text-4xl lg:text-6xl font-light text-gray-900 mb-6 leading-tight">
            <span className="font-black">Advanced Capabilities</span>
            <br />
            <span className="text-gray-500">for Modern Healthcare</span>
          </h2>
          
          <p className="text-xl text-gray-600 leading-relaxed">
            Our platform delivers enterprise-grade features designed specifically 
            for pharmaceutical supply chain management and regulatory compliance.
          </p>
        </div>
        
        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <Card key={index} className="group bg-white border border-gray-200 hover:border-gray-300 hover:shadow-xl transition-all duration-500 hover:-translate-y-2 rounded-2xl overflow-hidden">
                <CardContent className="p-8">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 ${colorClasses[feature.color]} group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-7 h-7" />
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-gray-700 transition-colors">
                    {feature.title}
                  </h3>
                  
                  <p className="text-gray-600 leading-relaxed text-sm">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Bottom Section */}
        <div className="bg-white rounded-3xl p-12 shadow-lg border border-gray-200">
          <div className="grid lg:grid-cols-3 gap-12 items-center">
            <div className="lg:col-span-2 space-y-6">
              <h3 className="text-3xl font-light text-gray-900">
                <span className="font-black">Trusted by</span> Healthcare Leaders
              </h3>
              <p className="text-lg text-gray-600 leading-relaxed">
                Our platform is actively used by major hospitals, pharmaceutical companies, 
                and government healthcare departments across Delhi, ensuring the highest 
                standards of drug safety and supply chain integrity.
              </p>
              <div className="flex items-center gap-8 pt-4">
                <div>
                  <div className="text-2xl font-bold text-gray-900">500+</div>
                  <div className="text-sm text-gray-500">Healthcare Partners</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">2M+</div>
                  <div className="text-sm text-gray-500">Drugs Tracked Daily</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">99.9%</div>
                  <div className="text-sm text-gray-500">System Reliability</div>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="bg-gray-50 rounded-2xl p-6">
                <div className="flex items-center gap-4 mb-3">
                  <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse" />
                  <span className="text-sm font-medium text-gray-700">System Status</span>
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-2">All Systems Operational</div>
                <div className="text-sm text-gray-600">Last updated: Just now</div>
              </div>
              
              <div className="bg-gray-50 rounded-2xl p-6">
                <div className="text-sm font-medium text-gray-700 mb-2">Security Level</div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div className="bg-emerald-500 h-2 rounded-full w-full" />
                  </div>
                  <span className="text-sm font-bold text-emerald-600">Maximum</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
} 