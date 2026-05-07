import React from 'react';
import { Navbar } from '@/app/ui/Navbar';
import { Card, CardContent } from '@/app/ui/card';
import { 
  ShieldCheckIcon, 
  EyeIcon, 
  UserGroupIcon, 
  HeartIcon,
  BookOpenIcon,
  LightBulbIcon
} from '@heroicons/react/24/outline';
import Footer from '@/app/ui/Footer'

const values = [
  {
    title: 'Transparency',
    description: 'Every transaction is recorded and verifiable on the blockchain, ensuring complete supply chain visibility.',
    icon: EyeIcon,
    color: 'blue'
  },
  {
    title: 'Security',
    description: 'Patient safety and data integrity are at the core of our platform with military-grade encryption.',
    icon: ShieldCheckIcon,
    color: 'emerald'
  },
  {
    title: 'Innovation',
    description: 'We embrace cutting-edge technologies to solve real-world healthcare challenges effectively.',
    icon: LightBulbIcon,
    color: 'amber'
  },
  {
    title: 'Collaboration',
    description: 'Working with all stakeholders to build a comprehensive and inclusive healthcare ecosystem.',
    icon: UserGroupIcon,
    color: 'purple'
  },
  {
    title: 'Impact',
    description: 'Our mission is to save lives by ensuring authentic medicines reach patients safely and efficiently.',
    icon: HeartIcon,
    color: 'rose'
  }
]

const colorClasses = {
  blue: 'bg-blue-50 text-blue-600 border-blue-100',
  emerald: 'bg-emerald-50 text-emerald-600 border-emerald-100',
  amber: 'bg-amber-50 text-amber-600 border-amber-100',
  purple: 'bg-purple-50 text-purple-600 border-purple-100',
  rose: 'bg-rose-50 text-rose-600 border-rose-100'
}

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      {/* Hero Section */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-white rounded-full px-4 py-2 border border-gray-200 mb-8">
              <BookOpenIcon className="w-4 h-4 text-gray-600" />
              <span className="text-sm font-medium text-gray-600">About Our Mission</span>
            </div>
            
            <h1 className="text-5xl lg:text-7xl font-light text-gray-900 mb-8 leading-tight">
              <span className="font-black">Revolutionizing</span>
              <br />
              <span className="text-gray-500">Healthcare Supply Chain</span>
            </h1>
            
            <p className="text-xl text-gray-600 leading-relaxed max-w-3xl mx-auto mb-12">
              Ayush Samparkh is a comprehensive blockchain-enabled platform ensuring secure, transparent, 
              and efficient pharmaceutical distribution. We're committed to safeguarding medicine 
              integrity from manufacturer to patient across Delhi and beyond.
            </p>
            
            <div className="grid md:grid-cols-3 gap-8 max-w-2xl mx-auto">
              <div className="text-center">
                <div className="text-3xl font-black text-blue-600 mb-2">2023</div>
                <div className="text-sm font-medium text-gray-600">Founded</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-black text-emerald-600 mb-2">500+</div>
                <div className="text-sm font-medium text-gray-600">Partners</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-black text-purple-600 mb-2">15M+</div>
                <div className="text-sm font-medium text-gray-600">Lives Protected</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div className="space-y-8">
                <div>
                  <div className="inline-flex items-center gap-2 bg-gray-50 rounded-full px-4 py-2 border border-gray-200 mb-6">
                    <div className="w-2 h-2 bg-blue-500 rounded-full" />
                    <span className="text-sm font-medium text-gray-600">Our Journey</span>
                  </div>
                  
                  <h2 className="text-4xl font-light text-gray-900 mb-6">
                    <span className="font-black">Built by Healthcare</span>
                    <br />
                    <span className="text-gray-500">and Tech Experts</span>
                  </h2>
                </div>
                
                <div className="space-y-6">
                  <p className="text-lg text-gray-600 leading-relaxed">
                    Founded in 2023, Ayush Samparkh emerged from a critical need to address counterfeit drugs, 
                    supply inefficiencies, and transparency gaps in India's pharmaceutical ecosystem.
                  </p>
                  
                  <p className="text-lg text-gray-600 leading-relaxed">
                    Our founding team of healthcare professionals, blockchain developers, and policy experts 
                    witnessed firsthand how these challenges endangered patient safety and public health.
                  </p>
                  
                  <p className="text-lg text-gray-600 leading-relaxed">
                    Today, we partner with government agencies, hospitals, pharmacies, and manufacturers 
                    to ensure every medicine is tracked, verified, and delivered safely to those who need it most.
                  </p>
                </div>
              </div>
              
              <div className="relative">
                <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-3xl p-12 shadow-xl border border-gray-200">
                  <div className="space-y-8">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center">
                        <ShieldCheckIcon className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <div className="text-lg font-bold text-gray-900">Zero Counterfeits</div>
                        <div className="text-gray-600 text-sm">100% authentic drug guarantee</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center">
                        <EyeIcon className="w-6 h-6 text-emerald-600" />
                      </div>
                      <div>
                        <div className="text-lg font-bold text-gray-900">Full Transparency</div>
                        <div className="text-gray-600 text-sm">Complete supply chain visibility</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-purple-100 rounded-2xl flex items-center justify-center">
                        <UserGroupIcon className="w-6 h-6 text-purple-600" />
                      </div>
                      <div>
                        <div className="text-lg font-bold text-gray-900">Collaborative Network</div>
                        <div className="text-gray-600 text-sm">All stakeholders connected</div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Floating Elements */}
                <div className="absolute -top-4 -right-4 w-20 h-20 bg-blue-50 rounded-2xl rotate-12 opacity-60" />
                <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-emerald-50 rounded-2xl -rotate-12 opacity-60" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-20">
              <div className="inline-flex items-center gap-2 bg-white rounded-full px-4 py-2 border border-gray-200 mb-6">
                <HeartIcon className="w-4 h-4 text-gray-600" />
                <span className="text-sm font-medium text-gray-600">Our Values</span>
              </div>
              
              <h2 className="text-4xl lg:text-5xl font-light text-gray-900 mb-6">
                <span className="font-black">Driven by</span>
                <br />
                <span className="text-gray-500">Core Principles</span>
              </h2>
              
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Our values guide every decision we make and every feature we build, 
                ensuring we stay true to our mission of improving healthcare outcomes.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {values.slice(0, 3).map((value, index) => {
                const Icon = value.icon
                const colorClass = colorClasses[value.color as keyof typeof colorClasses]
                
                return (
                  <Card key={index} className="group bg-white border border-gray-200 hover:border-gray-300 hover:shadow-xl transition-all duration-500 hover:-translate-y-2 rounded-2xl overflow-hidden">
                    <CardContent className="p-8 text-center">
                      <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 border ${colorClass} group-hover:scale-110 transition-transform duration-300`}>
                        <Icon className="w-8 h-8" />
                      </div>
                      
                      <h3 className="text-xl font-bold text-gray-900 mb-4">
                        {value.title}
                      </h3>
                      
                      <p className="text-gray-600 text-sm leading-relaxed">
                        {value.description}
                      </p>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
            
            <div className="grid md:grid-cols-2 gap-6 mt-6 max-w-4xl mx-auto">
              {values.slice(3).map((value, index) => {
                const Icon = value.icon
                const colorClass = colorClasses[value.color as keyof typeof colorClasses]
                
                return (
                  <Card key={index} className="group bg-white border border-gray-200 hover:border-gray-300 hover:shadow-xl transition-all duration-500 hover:-translate-y-2 rounded-2xl overflow-hidden">
                    <CardContent className="p-8 text-center">
                      <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 border ${colorClass} group-hover:scale-110 transition-transform duration-300`}>
                        <Icon className="w-8 h-8" />
                      </div>
                      
                      <h3 className="text-xl font-bold text-gray-900 mb-4">
                        {value.title}
                      </h3>
                      
                      <p className="text-gray-600 text-sm leading-relaxed">
                        {value.description}
                      </p>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-light text-gray-900 mb-6">
              <span className="font-black">Ready to Transform</span>
              <br />
              <span className="text-gray-500">Healthcare Together?</span>
            </h2>
            
            <p className="text-xl text-gray-600 mb-8">
              Join us in building a safer, more transparent pharmaceutical supply chain 
              that protects patients and strengthens healthcare systems.
            </p>
            
            <div className="inline-flex items-center gap-2 bg-gray-900 text-white rounded-full px-8 py-4 hover:bg-gray-800 transition-colors cursor-pointer group">
              <span className="font-medium">Get Started Today</span>
              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}