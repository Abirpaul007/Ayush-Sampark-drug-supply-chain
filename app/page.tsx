import { Navbar } from '@/app/ui/Navbar'
import { Hero } from '@/app/sections/Hero'
import { Statistics } from '@/app/sections/Statistics'
import { Features } from '@/app/sections/Features'
import { HowItWorks } from '@/app/sections/HowItWorks'
import { CTASection } from '@/app/sections/CTASection'
import Footer from '@/app/ui/Footer'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main>
        <Hero />
        <Statistics />
        <Features />
        <HowItWorks />
        <CTASection />
      </main>
      <Footer />
    </div>
  )
}