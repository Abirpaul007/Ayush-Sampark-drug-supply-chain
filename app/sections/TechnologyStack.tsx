'use client'

import { Card, CardContent } from '@/app/ui/card'
import { 
  CubeTransparentIcon,
  ServerIcon,
  ShieldCheckIcon,
  CloudIcon,
  ChartBarIcon,
  DevicePhoneMobileIcon
} from '@heroicons/react/24/outline'

const technologies = [
  {
    category: 'Blockchain',
    title: 'Ethereum & Polygon',
    description: 'Decentralized ledger technology ensuring immutable record keeping and smart contract execution.',
    icon: CubeTransparentIcon,
    color: 'blue'
  },
  {
    category: 'Backend',
    title: 'Node.js & Express',
    description: 'High-performance server infrastructure with scalable microservices architecture.',
    icon: ServerIcon,
    color: 'emerald'
  },
  {
    category: 'Security',
    title: 'Advanced Encryption',
    description: 'Military-grade security protocols with multi-factor authentication and zero-knowledge proofs.',
    icon: ShieldCheckIcon,
    color: 'red'
  },
  {
    category: 'Cloud',
    title: 'AWS & Azure',
    description: 'Multi-cloud deployment strategy ensuring maximum uptime and global accessibility.',
    icon: CloudIcon,
    color: 'orange'
  },
  {
    category: 'Analytics',
    title: 'AI & Machine Learning',
    description: 'Intelligent analytics for predictive insights and automated supply chain optimization.',
    icon: ChartBarIcon,
    color: 'purple'
  },
  {
    category: 'Mobile',
    title: 'Cross-platform Apps',
    description: 'Native mobile applications for iOS and Android with offline capability.',
    icon: DevicePhoneMobileIcon,
    color: 'teal'
  }
]

const colorClasses = {
  blue: 'bg-blue-50 text-blue-600 border-blue-100',
  emerald: 'bg-emerald-50 text-emerald-600 border-emerald-100',
  red: 'bg-red-50 text-red-600 border-red-100',
  orange: 'bg-orange-50 text-orange-600 border-orange-100',
  purple: 'bg-purple-50 text-purple-600 border-purple-100',
  teal: 'bg-teal-50 text-teal-600 border-teal-100'
}

const integrations = [
  {
    name: 'Government Systems',
    description: 'Delhi Health Department integration',
    status: 'Active',
    connections: '25+ Systems'
  },
  {
    name: 'Hospital Networks',
    description: 'Major healthcare provider connections',
    status: 'Active',
    connections: '500+ Hospitals'
  },
  {
    name: 'Pharmacy Chains',
    description: 'Retail pharmacy integrations',
    status: 'Active',
    connections: '2000+ Stores'
  },
  {
    name: 'Distribution Partners',
    description: 'Logistics and supply partners',
    status: 'Active',
    connections: '100+ Partners'
  }
]

export function TechnologyStack() {
  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-20 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-gray-50 rounded-full px-4 py-2 border border-gray-200 mb-6">
            <CubeTransparentIcon className="w-4 h-4 text-gray-600" />
            <span className="text-sm font-medium text-gray-600">Technology Stack</span>
          </div>
          
          <h2 className="text-4xl lg:text-6xl font-light text-gray-900 mb-6 leading-tight">
            <span className="font-black">Built with</span>
            <br />
            <span className="text-gray-500">Modern Technology</span>
          </h2>
          
          <p className="text-xl text-gray-600 leading-relaxed">
            Our platform leverages cutting-edge technologies to deliver 
            enterprise-grade security, scalability, and performance.
          </p>
        </div>

        {/* Technology Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {technologies.map((tech, index) => {
            const Icon = tech.icon
            const colorClass = colorClasses[tech.color as keyof typeof colorClasses]
            
            return (
              <Card key={index} className="group bg-white border border-gray-200 hover:border-gray-300 hover:shadow-xl transition-all duration-500 hover:-translate-y-2 rounded-2xl overflow-hidden">
                <CardContent className="p-8">
                  <div className="flex items-start justify-between mb-6">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border ${colorClass} group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className="w-7 h-7" />
                    </div>
                    <div className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                      {tech.category}
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-gray-700 transition-colors">
                    {tech.title}
                  </h3>
                  
                  <p className="text-gray-600 leading-relaxed text-sm">
                    {tech.description}
                  </p>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Performance Metrics */}
        <div className="bg-gray-50 rounded-3xl p-12 mb-20 border border-gray-200">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-light text-gray-900 mb-4">
              <span className="font-black">Performance</span> Metrics
            </h3>
            <p className="text-gray-600">Real-time system performance and reliability statistics</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center p-6 bg-white rounded-2xl border border-gray-200 group hover:shadow-lg transition-shadow">
              <div className="text-3xl font-black text-blue-600 mb-2 group-hover:scale-110 transition-transform">50K+</div>
              <div className="text-sm font-semibold text-gray-700">Transactions/Second</div>
            </div>
            <div className="text-center p-6 bg-white rounded-2xl border border-gray-200 group hover:shadow-lg transition-shadow">
              <div className="text-3xl font-black text-emerald-600 mb-2 group-hover:scale-110 transition-transform">&lt; 100ms</div>
              <div className="text-sm font-semibold text-gray-700">API Response Time</div>
            </div>
            <div className="text-center p-6 bg-white rounded-2xl border border-gray-200 group hover:shadow-lg transition-shadow">
              <div className="text-3xl font-black text-purple-600 mb-2 group-hover:scale-110 transition-transform">10M+</div>
              <div className="text-sm font-semibold text-gray-700">Data Points/Day</div>
            </div>
            <div className="text-center p-6 bg-white rounded-2xl border border-gray-200 group hover:shadow-lg transition-shadow">
              <div className="text-3xl font-black text-orange-600 mb-2 group-hover:scale-110 transition-transform">99.99%</div>
              <div className="text-sm font-semibold text-gray-700">System Uptime</div>
            </div>
          </div>
        </div>

        {/* System Integrations */}
        <div className="bg-gray-50 rounded-3xl p-12 border border-gray-200">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-light text-gray-900 mb-4">
              <span className="font-black">System</span> Integrations
            </h3>
            <p className="text-gray-600">Seamless connectivity with existing healthcare infrastructure</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            {integrations.map((integration, index) => (
              <div key={index} className="bg-white rounded-2xl p-6 border border-gray-200 hover:shadow-lg transition-shadow group">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-gray-200 transition-colors">
                    <DevicePhoneMobileIcon className="w-6 h-6 text-gray-600" />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="text-lg font-bold text-gray-900">{integration.name}</h4>
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                        <span className="text-xs font-semibold text-emerald-700">{integration.status}</span>
                      </div>
                    </div>
                    <p className="text-gray-600 mb-3 text-sm">{integration.description}</p>
                    <div className="text-sm font-bold text-gray-900">{integration.connections}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Architecture Info */}
        <div className="text-center mt-16">
          <div className="bg-white rounded-3xl p-12 shadow-lg border border-gray-200 max-w-3xl mx-auto">
            <ServerIcon className="w-16 h-16 text-gray-400 mx-auto mb-6" />
            <h3 className="text-2xl font-light text-gray-900 mb-4">
              <span className="font-black">Microservices</span> Architecture
            </h3>
            <p className="text-gray-600 text-lg leading-relaxed">
              Our distributed system architecture ensures maximum scalability, fault tolerance, 
              and maintainability across all components of the supply chain platform.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}