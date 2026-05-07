'use client'

import { Card, CardContent } from '@/app/ui/card'
import { 
  BuildingOfficeIcon,
  TruckIcon,
  BuildingStorefrontIcon,
  UserIcon,
  ArrowRightIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline'

const processSteps = [
  {
    step: 1,
    title: 'Manufacturing',
    subtitle: 'Drug Production',
    description: 'Pharmaceutical companies register each drug batch on the blockchain with complete manufacturing details and quality certifications.',
    icon: BuildingOfficeIcon,
    details: [
      'Batch ID generation',
      'Quality control verification', 
      'Blockchain registration',
      'Regulatory approval'
    ]
  },
  {
    step: 2,
    title: 'Distribution',
    subtitle: 'Secure Transport',
    description: 'Products are tracked in real-time during transportation with GPS monitoring and environmental condition tracking.',
    icon: TruckIcon,
    details: [
      'GPS location tracking',
      'Temperature monitoring',
      'Chain of custody updates',
      'Delivery confirmation'
    ]
  },
  {
    step: 3,
    title: 'Healthcare Facility',
    subtitle: 'Inventory Management',
    description: 'Hospitals and pharmacies receive and verify drug authenticity while maintaining automated inventory systems.',
    icon: BuildingStorefrontIcon,
    details: [
      'QR code verification',
      'Inventory integration',
      'Expiry date tracking',
      'Automated alerts'
    ]
  },
  {
    step: 4,
    title: 'Patient Delivery',
    subtitle: 'Final Verification',
    description: 'Final delivery to patients with complete verification of drug authenticity and proper documentation.',
    icon: UserIcon,
    details: [
      'Patient verification',
      'Drug authentication',
      'Delivery logging',
      'Feedback collection'
    ]
  }
]

export function HowItWorks() {
  return (
    <section className="py-24 bg-gray-50">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-20 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-white rounded-full px-4 py-2 border border-gray-200 mb-6">
            <div className="w-2 h-2 bg-blue-500 rounded-full" />
            <span className="text-sm font-medium text-gray-600">Step by Step</span>
          </div>
          
          <h2 className="text-4xl lg:text-6xl font-light text-gray-900 mb-6 leading-tight">
            <span className="font-black">How It</span>
            <br />
            <span className="text-gray-500">Works</span>
          </h2>
          
          <p className="text-xl text-gray-600 leading-relaxed">
            From manufacturing to patient delivery, every step is secured, 
            tracked, and verified through our blockchain infrastructure.
          </p>
        </div>

        {/* Process Steps */}
        <div className="relative">
          {/* Connection Line - Desktop */}
          <div className="hidden lg:block absolute top-20 left-0 right-0 h-px bg-gray-200 z-0" />
          
          <div className="grid lg:grid-cols-4 gap-8 relative">
            {processSteps.map((step, index) => {
              const Icon = step.icon
              return (
                <div key={index} className="relative">
                  <Card className="bg-white border border-gray-200 hover:border-gray-300 hover:shadow-xl transition-all duration-500 hover:-translate-y-2 rounded-2xl overflow-hidden group">
                    <CardContent className="p-8 text-center relative">
                      {/* Step Number */}
                      <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 bg-white border-2 border-gray-200 rounded-full flex items-center justify-center text-sm font-bold text-gray-600 z-10">
                        {step.step}
                      </div>
                      
                      {/* Icon */}
                      <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-gray-200 transition-colors duration-300">
                        <Icon className="w-8 h-8 text-gray-600" />
                      </div>
                      
                      {/* Content */}
                      <div className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">
                        {step.subtitle}
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-4">{step.title}</h3>
                      <p className="text-gray-600 mb-6 text-sm leading-relaxed">{step.description}</p>
                      
                      {/* Details */}
                      <div className="space-y-2">
                        {step.details.map((detail, idx) => (
                          <div key={idx} className="flex items-center gap-2 text-sm text-gray-600">
                            <div className="w-1.5 h-1.5 bg-gray-400 rounded-full flex-shrink-0" />
                            <span>{detail}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                  
                  {/* Arrow - Desktop */}
                  {index < processSteps.length - 1 && (
                    <div className="hidden lg:block absolute top-20 -right-4 z-10">
                      <div className="w-8 h-8 bg-white border-2 border-gray-200 rounded-full flex items-center justify-center shadow-sm">
                        <ArrowRightIcon className="w-4 h-4 text-gray-400" />
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Benefits Section */}
        <div className="mt-24 bg-white rounded-3xl p-12 shadow-lg border border-gray-200">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h3 className="text-3xl font-light text-gray-900">
                <span className="font-black">End-to-End</span> Transparency
              </h3>
              <p className="text-lg text-gray-600 leading-relaxed">
                Every pharmaceutical product in our network is tracked from the moment 
                it leaves the manufacturing facility until it reaches the patient, 
                ensuring complete visibility and accountability.
              </p>
              
              <div className="grid grid-cols-2 gap-6 pt-4">
                <div className="text-center p-4 bg-gray-50 rounded-xl">
                  <div className="text-2xl font-black text-gray-900 mb-2">100%</div>
                  <div className="text-sm font-medium text-gray-600">Traceability</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-xl">
                  <div className="text-2xl font-black text-gray-900 mb-2">24/7</div>
                  <div className="text-sm font-medium text-gray-600">Monitoring</div>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="bg-gray-50 rounded-2xl p-6">
                <div className="flex items-center gap-4 mb-4">
                  <CheckCircleIcon className="w-6 h-6 text-emerald-600" />
                  <span className="font-semibold text-gray-900">Blockchain Security</span>
                </div>
                <p className="text-gray-600 text-sm">
                  Immutable records ensure data integrity and prevent tampering 
                  throughout the entire supply chain process.
                </p>
              </div>
              
              <div className="bg-gray-50 rounded-2xl p-6">
                <div className="flex items-center gap-4 mb-4">
                  <CheckCircleIcon className="w-6 h-6 text-blue-600" />
                  <span className="font-semibold text-gray-900">Real-time Updates</span>
                </div>
                <p className="text-gray-600 text-sm">
                  Live tracking and instant notifications keep all stakeholders 
                  informed about the status and location of shipments.
                </p>
              </div>
              
              <div className="bg-gray-50 rounded-2xl p-6">
                <div className="flex items-center gap-4 mb-4">
                  <CheckCircleIcon className="w-6 h-6 text-purple-600" />
                  <span className="font-semibold text-gray-900">Automated Compliance</span>
                </div>
                <p className="text-gray-600 text-sm">
                  Built-in regulatory checks ensure all processes meet healthcare 
                  standards and government requirements.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <div className="inline-flex items-center gap-2 bg-gray-900 text-white rounded-full px-6 py-3 hover:bg-gray-800 transition-colors cursor-pointer group">
            <span className="font-medium">Track Your Shipment</span>
            <ArrowRightIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>
    </section>
  )
}