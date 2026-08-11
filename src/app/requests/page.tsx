'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// --- DUMMY DATA ---
// Woven in some familiar names to test the layout
const initialRequests = [
  {
    id: 1, author: 'M Ahsan', category: 'CARPOOL', title: 'Gulshan drop-off at 4 PM?', 
    urgency: 'HIGH', color: 'bg-blue-400', 
    desc: 'Leaving campus around 4. Need a ride towards Gulshan block 13. Will pitch in for fuel!'
  },
  {
    id: 2, author: 'Maryam Akram', category: 'PROJECT', title: 'Need 1 more for Software Eng project', 
    urgency: 'MEDIUM', color: 'bg-purple-400', 
    desc: 'Building a MERN stack web app. We have the backend sorted, need someone strong with React/Tailwind.'
  },
  {
    id: 3, author: 'Omer', category: 'NOTES', title: 'Automata Theory Midterm Slides', 
    urgency: 'URGENT', color: 'bg-[#ff5733]', 
    desc: 'Does anyone have the exact slides the professor used for the DFA/NFA conversions in week 4? The portal is down.'
  },
  {
    id: 4, author: 'Anonymous', category: 'LOST & FOUND', title: 'Left my hydroflask in Lab 3', 
    urgency: 'LOW', color: 'bg-emerald-400', 
    desc: 'Black bottle with a bunch of GitHub stickers. Please let me know if you grabbed it!'
  },
  {
    id: 5, author: 'Hassan R.', category: 'TUTORING', title: 'Can someone explain Pointers?', 
    urgency: 'MEDIUM', color: 'bg-yellow-400', 
    desc: 'I will buy you lunch at PG if you can sit with me for 30 mins and explain C++ memory allocation.'
  },
];

export default function RequestsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Form State
  const [activeCategory, setActiveCategory] = useState('NOTES');
  const [activeUrgency, setActiveUrgency] = useState('LOW');

  const categories = ['NOTES', 'CARPOOL', 'PROJECT', 'TUTORING', 'LOST & FOUND'];
  const urgencies = ['LOW', 'MEDIUM', 'HIGH', 'URGENT'];

  return (
    <div className="relative min-h-[calc(100vh-80px)] w-full overflow-hidden border-b-4 border-black bg-[#e6ddc5]">
      
      {/* --- ANIMATED BACKGROUND --- */}
      <div 
        className="absolute inset-0 z-0 opacity-20"
        style={{
          backgroundImage: 'radial-gradient(#000 2.5px, transparent 2.5px)',
          backgroundSize: '32px 32px',
          animation: 'panGrid 30s linear infinite',
        }}
      >
        <style>{`
          @keyframes panGrid {
            0% { background-position: 0 0; }
            100% { background-position: -64px -64px; }
          }
        `}</style>
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-6 py-12 md:px-12">
        
        {/* --- HEADER & ADD BUTTON --- */}
        <div className="mb-12 flex flex-col items-start justify-between gap-6 border-b-4 border-black pb-6 md:flex-row md:items-end">
          <div>
            <h1 className="text-5xl font-black uppercase tracking-tight md:text-7xl">
              The <span className="bg-white px-4 py-1 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-black">Board</span>
            </h1>
            <p className="mt-4 font-mono text-sm font-bold uppercase tracking-widest text-gray-800">
              Ask for help. Offer a ride. Find a team.
            </p>
          </div>
          
          <motion.button 
            whileHover={{ y: -4, boxShadow: '8px 8px 0px 0px rgba(0,0,0,1)' }}
            whileTap={{ y: 0, boxShadow: '2px 2px 0px 0px rgba(0,0,0,1)' }}
            onClick={() => setIsModalOpen(true)}
            className="border-4 border-black bg-[#ff5733] px-8 py-4 font-black uppercase tracking-wider text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-colors"
          >
            + New Request
          </motion.button>
        </div>

        {/* --- REQUESTS GRID --- */}
        <motion.div 
          className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
          }}
        >
          {initialRequests.map((req) => (
            <motion.div
              key={req.id}
              variants={{
                hidden: { opacity: 0, y: 40 },
                visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100, damping: 15 } }
              }}
              whileHover={{ y: -6, rotate: 1 }}
              className="flex flex-col justify-between border-4 border-black bg-[#fffdf8] p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-shadow hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]"
            >
              <div>
                <div className="mb-4 flex items-start justify-between gap-2">
                  <span className={`border-2 border-black ${req.color} px-3 py-1 font-mono text-[10px] font-black uppercase tracking-wider text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]`}>
                    {req.category}
                  </span>
                  {req.urgency === 'URGENT' && (
                    <span className="animate-pulse border-2 border-black bg-red-600 px-2 py-1 font-mono text-[10px] font-black uppercase tracking-wider text-white">
                      URGENT
                    </span>
                  )}
                </div>
                
                <h3 className="mb-3 text-2xl font-black leading-tight tracking-tight text-black">
                  {req.title}
                </h3>
                <p className="mb-6 font-medium text-gray-700">
                  {req.desc}
                </p>
              </div>

              <div className="flex items-center gap-3 border-t-4 border-black pt-4">
                <div className={`flex h-10 w-10 shrink-0 items-center justify-center border-2 border-black ${req.color} font-mono font-black text-black`}>
                  {req.author.substring(0, 2).toUpperCase()}
                </div>
                <span className="font-mono text-xs font-bold uppercase tracking-widest text-gray-500">
                  {req.author}
                </span>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* --- ADD REQUEST MODAL (Animated) --- */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ y: '100vh', rotate: 5 }} 
              animate={{ y: 0, rotate: 0 }} 
              exit={{ y: '100vh', rotate: -5 }}
              transition={{ type: 'spring', damping: 20, stiffness: 100 }}
              className="w-full max-w-2xl border-4 border-black bg-[#fffdf8] p-8 shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] max-h-[90vh] overflow-y-auto"
            >
              <div className="mb-8 flex items-center justify-between border-b-4 border-black pb-4">
                <h2 className="text-4xl font-black uppercase tracking-tight">Drop a Request</h2>
                <button 
                  onClick={() => setIsModalOpen(false)} 
                  className="text-3xl font-black transition-transform hover:scale-110 hover:text-[#ff5733]"
                >
                  X
                </button>
              </div>

              <div className="space-y-6">
                
                {/* Title Input */}
                <div>
                  <label className="mb-2 block font-mono text-xs font-bold uppercase tracking-widest">Title (Keep it short)</label>
                  <input 
                    type="text" 
                    placeholder="e.g., Need a ride to Gulshan"
                    className="w-full border-4 border-black bg-white px-4 py-3 font-medium text-black outline-none transition-shadow focus:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]"
                  />
                </div>

                {/* Category Selector */}
                <div>
                  <label className="mb-2 block font-mono text-xs font-bold uppercase tracking-widest">Category</label>
                  <div className="flex flex-wrap gap-3">
                    {categories.map(cat => (
                      <button
                        key={cat}
                        onClick={() => setActiveCategory(cat)}
                        className={`border-2 border-black px-4 py-2 font-mono text-xs font-bold uppercase transition-all ${
                          activeCategory === cat 
                            ? 'bg-blue-400 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] translate-y-[-2px]' 
                            : 'bg-white hover:bg-gray-100'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Urgency Selector */}
                <div>
                  <label className="mb-2 block font-mono text-xs font-bold uppercase tracking-widest">Urgency</label>
                  <div className="flex gap-0 border-4 border-black">
                    {urgencies.map(urg => (
                      <button
                        key={urg}
                        onClick={() => setActiveUrgency(urg)}
                        className={`flex-1 border-r-4 border-black last:border-r-0 py-3 font-mono text-xs font-bold uppercase transition-colors ${
                          activeUrgency === urg 
                            ? urg === 'URGENT' ? 'bg-[#ff5733] text-black' : 'bg-black text-white'
                            : 'bg-white text-gray-500 hover:bg-gray-200'
                        }`}
                      >
                        {urg}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Description Textarea */}
                <div>
                  <label className="mb-2 block font-mono text-xs font-bold uppercase tracking-widest">The Details</label>
                  <textarea 
                    rows={4}
                    placeholder="Provide the specifics..."
                    className="w-full resize-none border-4 border-black bg-white p-4 font-medium outline-none transition-shadow focus:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]"
                  />
                </div>

                {/* Submit Button */}
                <motion.button 
                  whileHover={{ y: -4, boxShadow: '8px 8px 0px 0px rgba(0,0,0,1)' }}
                  whileTap={{ y: 0, boxShadow: '2px 2px 0px 0px rgba(0,0,0,1)' }}
                  className="w-full border-4 border-black bg-emerald-400 py-4 text-2xl font-black uppercase tracking-wider text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-colors"
                >
                  Post to Board
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}