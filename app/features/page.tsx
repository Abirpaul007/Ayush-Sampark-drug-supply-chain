import { Features } from '@/app/sections/Features';
import React from 'react';
import { Navbar } from '@/app/ui/Navbar';
import Footer from '@/app/ui/Footer'

export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main className="pt-24 pb-16 px-4 max-w-6xl mx-auto">
        <Features />
      </main>
      <Footer />
    </div>
  );
} 