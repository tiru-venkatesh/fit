import React, { useState } from 'react';
import { Navbar } from '../components/Navbar';
import { PricingSection } from '../components/PricingSection';
import { Sidebar } from '../components/Sidebar';
import { MobileSidebar } from '../components/MobileSidebar';

export default function PricingPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-transparent text-white flex flex-col justify-between">
      <Navbar onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      <MobileSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-grow flex">
        <Sidebar />

        <main className="flex-1 px-4 py-8 sm:px-6 lg:px-8 md:pl-72 animate-fade-in duration-300">
          <div className="max-w-5xl mx-auto">
            <PricingSection />
          </div>
        </main>
      </div>
    </div>
  );
}
