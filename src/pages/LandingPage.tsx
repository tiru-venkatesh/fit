import React from 'react';
import { Navbar } from '../components/Navbar';
import { HeroSection } from '../components/HeroSection';
import { FeatureSection } from '../components/FeatureSection';
import { PricingSection } from '../components/PricingSection';
import { Footer } from '../components/Footer';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-transparent text-white flex flex-col justify-between">
      <Navbar />
      <main className="flex-grow">
        <HeroSection />
        <FeatureSection />
        <PricingSection />
      </main>
      <Footer />
    </div>
  );
}
