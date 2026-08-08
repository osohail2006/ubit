'use client';

import { motion } from 'framer-motion';

const features = [
  {
    id: '01',
    title: 'Teacher Reviews',
    desc: 'Rate teaching, grading, lab grading & friendliness — four honest meters, no fluff.',
    headingColor: 'text-blue-600',
    tagBg: 'bg-blue-600',
  },
  {
    id: '02',
    title: 'Requests Board',
    desc: 'Need notes, a past paper, a carpool buddy, or a recommendation? Post it here.',
    headingColor: 'text-red-500',
    tagBg: 'bg-red-500',
  },
  {
    id: '03',
    title: 'Notes & Past Papers',
    desc: 'A growing archive, sorted by course and year, approved by student admins.',
    headingColor: 'text-yellow-500',
    tagBg: 'bg-yellow-500',
  },
  {
    id: 'GPA',
    title: 'Custom Calculator',
    desc: 'Built strictly for our department credit hours and grading scale. No generic fluff.',
    headingColor: 'text-purple-500',
    tagBg: 'bg-purple-500',
  },
  {
    id: 'MAP',
    title: 'Survival Blueprint',
    desc: 'Pinned locations for emergency photocopying, hidden canteens, and department blocks.',
    headingColor: 'text-emerald-500',
    tagBg: 'bg-emerald-500',
  }
];

export default function FeaturesGridSection() {
  return (
    // min-h-screen keeps it contained to one page height while centering the content
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#fffdf8] px-8 py-16 border-b-4 border-black">
      
      {/* Animated Doodly Notebook Background */}
      <div 
        className="absolute inset-0 z-0 opacity-20"
        style={{
          backgroundImage: 'radial-gradient(#000 2px, transparent 2px)',
          backgroundSize: '30px 30px',
          animation: 'panGrid 20s linear infinite',
        }}
      >
        <style>{`
          @keyframes panGrid {
            0% { background-position: 0 0; }
            100% { background-position: 60px 60px; }
          }
        `}</style>
      </div>

      <div className="relative z-10 w-full max-w-[1200px]">
        {/* flex-wrap and justify-center naturally create the 3 on top, 2 on bottom layout */}
        <div className="flex flex-wrap justify-center gap-10">
          
          {features.map((feature, index) => (
            <motion.div
              key={feature.id}
              // Starts invisible, dropped slightly, and rotated
              initial={{ opacity: 0, y: 60, rotate: index % 2 === 0 ? -3 : 3 }}
              
              // Springs into place when scrolled into view
              whileInView={{ opacity: 1, y: 0, rotate: index % 2 === 0 ? -1 : 1 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ 
                duration: 0.5, 
                delay: index * 0.15, // Sequential stagger
                type: "spring", 
                bounce: 0.3 
              }}
              
              // Hover effect
              whileHover={{ 
                scale: 1.03, 
                rotate: 0, 
                boxShadow: "12px 12px 0px 0px rgba(0,0,0,1)",
                transition: { duration: 0.2 }
              }}
              
              className="flex w-full max-w-[350px] flex-col border-4 border-black bg-white p-8 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]"
            >
              <div className="mb-auto">
                <div className={`mb-6 inline-block border-2 border-black ${feature.tagBg} px-3 py-1 text-lg font-black text-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]`}>
                  {feature.id}
                </div>
              </div>
              
              <h3 className={`mb-4 text-3xl font-black uppercase tracking-tight ${feature.headingColor}`}>
                {feature.title}
              </h3>
              
              <p className="text-lg font-bold leading-relaxed text-gray-800">
                {feature.desc}
              </p>
            </motion.div>
          ))}

        </div>
      </div>
    </section>
  );
}