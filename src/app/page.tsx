import React from 'react';
import Link from 'next/link';
import FeaturesGridSection from '../components/FeaturesGridSection'; 

export default function CampusHubLanding() {
  return (
    <div className="min-h-screen bg-[#f8f8f6] font-sans text-black selection:bg-black selection:text-yellow-400">
      
    

      {/* Hero Section */}
      <header className="border-b-4 border-black bg-yellow-400 px-8 py-20">
        <div className="max-w-4xl">
          <div className="mb-6 inline-block border-2 border-black bg-[#f8f8f6] px-3 py-1 text-sm font-bold uppercase tracking-wider">
            Run by students • Since there's no official one
          </div>
          <h1 className="mb-6 text-6xl font-black uppercase leading-[1.1] tracking-tight md:text-7xl">
            The campus has no website. So we made one.
          </h1>
          <p className="mb-10 max-w-2xl text-lg font-medium leading-relaxed">
            Rate teachers honestly, trade notes and past papers, ask for help, 
            and talk to your batch — all in one scrappy, student-built corner of the internet.
          </p>
          <div className="flex flex-wrap gap-6">
            
            {/* Next.js Link component routing to the /signup page */}
            <Link 
              href="/signup" 
              className="inline-block border-4 border-black bg-black px-8 py-4 text-sm font-bold uppercase tracking-wider text-white transition-transform hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] active:translate-y-0 active:shadow-none"
            >
              Create Profile &rarr;
            </Link>
            
            <button className="border-4 border-black bg-[#f8f8f6] px-8 py-4 text-sm font-bold uppercase tracking-wider text-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-transform hover:-translate-y-1 hover:shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] active:translate-y-0 active:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              Browse Teachers
            </button>
          </div>
        </div>
      </header>

      {/* The 5-Item Kinetic Scroll Section Component */}
      <FeaturesGridSection />

    </div>
  );
}