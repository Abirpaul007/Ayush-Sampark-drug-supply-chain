import React from 'react';
import { Navbar } from '@/app/ui/Navbar';
import { Card, CardContent } from '@/app/ui/card';
import { Button } from '@/app/ui/button';
import { 
  PhoneIcon,
  EnvelopeIcon,
  MapPinIcon,
  ChatBubbleLeftRightIcon,
  ClockIcon,
  QuestionMarkCircleIcon,
  UserGroupIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline';
import Footer from '@/app/ui/Footer'

const contactMethods = [
  {
    title: 'Phone Support',
    value: '+91-11-2345-6789',
    description: '24/7 technical assistance',
    icon: PhoneIcon,
    color: 'blue',
    action: 'Call Now'
  },
  {
    title: 'Email Support',
    value: 'support@delhiayushsamparkh.gov.in',
    description: 'Response within 2 hours',
    icon: EnvelopeIcon,
    color: 'emerald',
    action: 'Send Email'
  },
  {
    title: 'Live Chat',
    value: 'Available 24/7',
    description: 'Instant support chat',
    icon: ChatBubbleLeftRightIcon,
    color: 'purple',
    action: 'Start Chat'
  },
]

const faqs = [
  {
    question: 'How do I track my drug shipment?',
    answer: 'Log in to your dashboard and navigate to the "Track Shipments" section for real-time updates with GPS precision and delivery status.'
  },
  {
    question: 'Who can use the Ayush Samparkh platform?',
    answer: 'Our platform serves government agencies, hospitals, pharmacies, pharmaceutical manufacturers, and distributors in the healthcare supply chain.'
  },
  {
    question: 'How secure is the blockchain data?',
    answer: 'All data is secured using military-grade encryption, smart contracts, and distributed blockchain technology with zero single points of failure.'
  },
  {
    question: 'How do I become a platform partner?',
    answer: 'Contact us through the form below or email our partnership team to discuss integration opportunities and onboarding processes.'
  },
  {
    question: 'What are the system requirements?',
    answer: 'Our platform is web-based and works on any modern browser. Mobile apps are available for iOS and Android devices.'
  },
  {
    question: 'How long does onboarding take?',
    answer: 'Typical onboarding ranges from 1-2 weeks depending on your organization size and integration complexity requirements.'
  }
]

const colorClasses = {
  blue: 'bg-blue-50 text-blue-600 border-blue-100',
  emerald: 'bg-emerald-50 text-emerald-600 border-emerald-100',
  purple: 'bg-purple-50 text-purple-600 border-purple-100',
  orange: 'bg-orange-50 text-orange-600 border-orange-100'
}

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      {/* Hero Section */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-white rounded-full px-4 py-2 border border-gray-200 mb-8">
              <ChatBubbleLeftRightIcon className="w-4 h-4 text-gray-600" />
              <span className="text-sm font-medium text-gray-600">Get in Touch</span>
            </div>
            
            <h1 className="text-5xl lg:text-7xl font-light text-gray-900 mb-8 leading-tight">
              <span className="font-black">We're Here</span>
              <br />
              <span className="text-gray-500">to Help</span>
            </h1>
            
            <p className="text-xl text-gray-600 leading-relaxed max-w-3xl mx-auto mb-12">
              Have questions about our blockchain platform? Need technical support? 
              Want to discuss partnership opportunities? Our team is ready to assist you 24/7.
            </p>
            
            <div className="grid md:grid-cols-3 gap-8 max-w-2xl mx-auto">
              <div className="text-center">
                <div className="text-3xl font-black text-blue-600 mb-2">&lt; 12hr</div>
                <div className="text-sm font-medium text-gray-600">Response Time</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-black text-emerald-600 mb-2">24/7</div>
                <div className="text-sm font-medium text-gray-600">Support Available</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-black text-purple-600 mb-2">500+</div>
                <div className="text-sm font-medium text-gray-600">Happy Partners</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Methods */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-20">
              <div className="inline-flex items-center gap-2 bg-gray-50 rounded-full px-4 py-2 border border-gray-200 mb-6">
                <PhoneIcon className="w-4 h-4 text-gray-600" />
                <span className="text-sm font-medium text-gray-600">Contact Methods</span>
              </div>
              
              <h2 className="text-4xl lg:text-5xl font-light text-gray-900 mb-6">
                <span className="font-black">Multiple Ways</span>
                <br />
                <span className="text-gray-500">to Reach Us</span>
              </h2>
              
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Choose the most convenient way to connect with our team. 
                We're committed to providing prompt, helpful assistance.
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6 mb-20 max-w-4xl mx-auto">
              {contactMethods.map((method, index) => {
                const Icon = method.icon
                const colorClass = colorClasses[method.color as keyof typeof colorClasses]
                
                return (
                  <Card key={index} className="group bg-white border border-gray-200 hover:border-gray-300 hover:shadow-xl transition-all duration-500 hover:-translate-y-2 rounded-2xl overflow-hidden">
                    <CardContent className="p-8 text-center">
                      <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 border ${colorClass} group-hover:scale-110 transition-transform duration-300`}>
                        <Icon className="w-8 h-8" />
                      </div>
                      
                      <h3 className="text-xl font-bold text-gray-900 mb-2">
                        {method.title}
                      </h3>
                      
                      <div className="text-gray-900 font-semibold mb-2 text-sm">
                        {method.value}
                      </div>
                      
                      <div className="text-gray-600 text-xs mb-6">
                        {method.description}
                      </div>
                      
                      <Button 
                        size="sm" 
                        className="w-full bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors rounded-full"
                      >
                        {method.action}
                      </Button>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <div className="mb-8">
              <div className="inline-flex items-center gap-2 bg-white rounded-full px-4 py-2 border border-gray-200 mb-6">
                <EnvelopeIcon className="w-4 h-4 text-gray-600" />
                <span className="text-sm font-medium text-gray-600">Send Message</span>
              </div>
              
              <h2 className="text-4xl lg:text-5xl font-light text-gray-900 mb-6 text-center">
                <span className="font-black">Drop Us</span>
                <br />
                <span className="text-gray-500">a Line</span>
              </h2>
              
              <p className="text-xl text-gray-600 leading-relaxed text-center max-w-3xl mx-auto">
                Fill out the form below and we'll get back to you within 2 hours during business hours.
              </p>
            </div>
            
            <Card className="bg-white border border-gray-200 shadow-lg rounded-2xl overflow-hidden max-w-2xl mx-auto">
              <CardContent className="p-8">
                <form className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-semibold text-gray-900 mb-2">
                        Full Name
                      </label>
                      <input 
                        type="text" 
                        id="name" 
                        name="name" 
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all" 
                        placeholder="Your full name" 
                        required 
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="email" className="block text-sm font-semibold text-gray-900 mb-2">
                        Email Address
                      </label>
                      <input 
                        type="email" 
                        id="email" 
                        name="email" 
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all" 
                        placeholder="you@company.com" 
                        required 
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="organization" className="block text-sm font-semibold text-gray-900 mb-2">
                      Organization
                    </label>
                    <input 
                      type="text" 
                      id="organization" 
                      name="organization" 
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all" 
                      placeholder="Hospital, Pharmacy, or Company name" 
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="subject" className="block text-sm font-semibold text-gray-900 mb-2">
                      Subject
                    </label>
                    <select 
                      id="subject" 
                      name="subject" 
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
                      required
                    >
                      <option value="">Select a subject</option>
                      <option value="technical-support">Technical Support</option>
                      <option value="partnership">Partnership Inquiry</option>
                      <option value="onboarding">Platform Onboarding</option>
                      <option value="billing">Billing Questions</option>
                      <option value="general">General Inquiry</option>
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="message" className="block text-sm font-semibold text-gray-900 mb-2">
                      Message
                    </label>
                    <textarea 
                      id="message" 
                      name="message" 
                      rows={6}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all resize-none" 
                      placeholder="Tell us how we can help you..."
                      required 
                    />
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full bg-gray-900 text-white hover:bg-gray-800 py-4 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl"
                  >
                    Send Message
                    <EnvelopeIcon className="w-5 h-5 ml-2" />
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-20">
              <div className="inline-flex items-center gap-2 bg-gray-50 rounded-full px-4 py-2 border border-gray-200 mb-6">
                <QuestionMarkCircleIcon className="w-4 h-4 text-gray-600" />
                <span className="text-sm font-medium text-gray-600">Frequently Asked</span>
              </div>
              
              <h2 className="text-4xl lg:text-5xl font-light text-gray-900 mb-6">
                <span className="font-black">Common</span>
                <br />
                <span className="text-gray-500">Questions</span>
              </h2>
              
              <p className="text-xl text-gray-600">
                Find answers to the most frequently asked questions about our platform.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              {faqs.map((faq, index) => (
                <Card key={index} className="group bg-white border border-gray-200 hover:border-gray-300 hover:shadow-lg transition-all duration-300 rounded-2xl overflow-hidden">
                  <CardContent className="p-8">
                    <h3 className="text-lg font-bold text-gray-900 mb-4 group-hover:text-gray-700 transition-colors">
                      {faq.question}
                    </h3>
                    <p className="text-gray-600 leading-relaxed text-sm">
                      {faq.answer}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            <div className="text-center mt-12">
              <p className="text-gray-600 mb-4">Still have questions?</p>
              <Button className="bg-gray-900 text-white hover:bg-gray-800 px-8 py-3 rounded-full">
                Contact Support Team
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
} 