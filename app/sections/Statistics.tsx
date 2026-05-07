'use client'

import { Card, CardContent } from '@/app/ui/card'
import { 
  ArrowTrendingUpIcon, 
  UsersIcon, 
  ShieldCheckIcon, 
  ClockIcon,
  BuildingOfficeIcon,
  TruckIcon
} from '@heroicons/react/24/outline'

const stats = [
  {
    value: '2.5M+',
    label: 'Drugs Tracked',
    description: 'Daily pharmaceutical units monitored',
    icon: ArrowTrendingUpIcon,
    color: 'blue'
  },
  {
    value: '500+',
    label: 'Healthcare Partners',
    description: 'Hospitals and clinics connected',
    icon: UsersIcon,
    color: 'emerald'
  },
  {
    value: '99.99%',
    label: 'Security Rate',
    description: 'Zero counterfeit drugs detected',
    icon: ShieldCheckIcon,
    color: 'purple'
  },
  {
    value: '24/7',
    label: 'Monitoring',
    description: 'Continuous system surveillance',
    icon: ClockIcon,
    color: 'orange'
  },
  {
    value: '100+',
    label: 'Distributors',
    description: 'Logistics partners in network',
    icon: TruckIcon,
    color: 'teal'
  },
  {
    value: '15M+',
    label: 'Citizens Protected',
    description: 'Delhi residents benefiting',
    icon: BuildingOfficeIcon,
    color: 'rose'
  }
]

const colorClasses = {
  blue: 'bg-blue-50 text-blue-600 border-blue-100',
  emerald: 'bg-emerald-50 text-emerald-600 border-emerald-100',
  purple: 'bg-purple-50 text-purple-600 border-purple-100',
  orange: 'bg-orange-50 text-orange-600 border-orange-100',
  teal: 'bg-teal-50 text-teal-600 border-teal-100',
  rose: 'bg-rose-50 text-rose-600 border-rose-100'
}

export function Statistics() {
  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-20 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-gray-50 rounded-full px-4 py-2 border border-gray-200 mb-6">
            <ArrowTrendingUpIcon className="w-4 h-4 text-gray-600" />
            <span className="text-sm font-medium text-gray-600">Real-time Impact</span>
          </div>
          
          <h2 className="text-4xl lg:text-6xl font-light text-gray-900 mb-6 leading-tight">
            <span className="font-black">Measurable Results</span>
            <br />
            <span className="text-gray-500">Across Delhi Healthcare</span>
          </h2>
          
          <p className="text-xl text-gray-600 leading-relaxed">
            Our platform delivers tangible improvements in pharmaceutical distribution, 
            safety, and efficiency across the entire healthcare ecosystem.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
          {stats.map((stat, index) => {
            const Icon = stat.icon
            const colorClass = colorClasses[stat.color as keyof typeof colorClasses]
            
            return (
              <Card key={index} className="group bg-white border border-gray-200 hover:border-gray-300 hover:shadow-xl transition-all duration-500 hover:-translate-y-2 rounded-2xl overflow-hidden">
                <CardContent className="p-8 text-center">
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 border ${colorClass} group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-8 h-8" />
                  </div>
                  
                  <div className="text-4xl font-black text-gray-900 mb-2 group-hover:scale-105 transition-transform">
                    {stat.value}
                  </div>
                  
                  <div className="text-xl font-bold text-gray-700 mb-2">
                    {stat.label}
                  </div>
                  
                  <div className="text-gray-600 text-sm">
                    {stat.description}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Impact Metrics */}
        <div className="bg-gray-50 rounded-3xl p-12 border border-gray-200">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <h3 className="text-3xl font-light text-gray-900">
                <span className="font-black">Transforming</span> Healthcare Delivery
              </h3>
              
              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-gray-200">
                  <div>
                    <div className="text-sm font-medium text-gray-700">Counterfeit Drug Prevention</div>
                    <div className="text-xs text-gray-500 mt-1">Complete elimination rate</div>
                  </div>
                  <div className="text-2xl font-black text-emerald-600">100%</div>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-gray-200">
                  <div>
                    <div className="text-sm font-medium text-gray-700">Delivery Time Reduction</div>
                    <div className="text-xs text-gray-500 mt-1">Average improvement</div>
                  </div>
                  <div className="text-2xl font-black text-blue-600">45%</div>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-gray-200">
                  <div>
                    <div className="text-sm font-medium text-gray-700">Cost Savings</div>
                    <div className="text-xs text-gray-500 mt-1">Annual government savings</div>
                  </div>
                  <div className="text-2xl font-black text-purple-600">₹250M</div>
                </div>
              </div>
            </div>
            
            <div className="space-y-6">
              <div className="bg-white rounded-2xl p-8 border border-gray-200 text-center">
                <div className="text-5xl font-black text-gray-900 mb-3">98.7%</div>
                <div className="text-lg font-bold text-gray-700 mb-2">Patient Satisfaction</div>
                <div className="text-gray-600 text-sm">Based on healthcare provider feedback</div>
                
                <div className="mt-6 pt-6 border-t border-gray-100">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">System Reliability</span>
                    <span className="font-bold text-gray-900">99.9%</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2 mt-2">
                    <div className="bg-emerald-500 h-2 rounded-full w-[99.9%] transition-all duration-1000" />
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white rounded-2xl p-6 border border-gray-200 text-center">
                  <div className="text-2xl font-black text-blue-600 mb-2">&lt; 2s</div>
                  <div className="text-sm font-medium text-gray-700">Response Time</div>
                </div>
                <div className="bg-white rounded-2xl p-6 border border-gray-200 text-center">
                  <div className="text-2xl font-black text-emerald-600 mb-2">0</div>
                  <div className="text-sm font-medium text-gray-700">Security Breaches</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Live Status */}
        <div className="text-center mt-16">
          <div className="inline-flex items-center gap-4 bg-emerald-50 border border-emerald-200 rounded-full px-6 py-3">
            <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse" />
            <span className="text-emerald-800 font-medium">System Status: All Operations Normal</span>
            <span className="text-emerald-600 text-sm">Last updated: Just now</span>
          </div>
        </div>
      </div>
    </section>
  )
}