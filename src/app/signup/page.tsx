'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

export default function SignUp() {
  const router = useRouter();

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    router.push('/profile');
  };

  return (
    // Height adjusted to account for the navbar, overflow hidden to trap the floating animations
    <div className="relative flex h-[calc(100vh-88px)] w-full items-center justify-center overflow-hidden bg-red-500 p-4">
      
      {/* Animated Panning Grid Background */}
      <div 
        className="absolute inset-0 z-0 opacity-20 mix-blend-multiply" 
        style={{
          backgroundImage: 'linear-gradient(black 2px, transparent 2px), linear-gradient(90deg, black 2px, transparent 2px)',
          backgroundSize: '40px 40px',
          animation: 'pan 15s linear infinite',
        }}
      >
        <style>{`
          @keyframes pan {
            0% { background-position: 0 0; }
            100% { background-position: 40px 40px; }
          }
        `}</style>
      </div>

      {/* Floating Brutalist Shapes */}
      <motion.div 
        animate={{ rotate: 360 }} 
        transition={{ repeat: Infinity, duration: 25, ease: "linear" }}
        className="absolute -left-12 top-12 z-0 h-48 w-48 border-8 border-black bg-yellow-400"
      />
      <motion.div 
        animate={{ y: [0, -30, 0] }} 
        transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
        className="absolute bottom-12 right-12 z-0 h-40 w-40 rounded-full border-8 border-black bg-blue-600"
      />

      {/* Form Container (Tighter padding to fit exactly on screen) */}
      <div className="relative z-10 w-full max-w-lg border-4 border-black bg-[#f8f8f6] p-6 shadow-[16px_16px_0px_0px_rgba(0,0,0,1)]">
        
        <div className="mb-4">
          <div className="mb-2 inline-block border-2 border-black bg-black px-2 py-1 text-xs font-black uppercase tracking-wider text-white">
            New Recruit
          </div>
          <h1 className="text-3xl font-black uppercase tracking-tight">Join The Batch.</h1>
        </div>

        <form onSubmit={handleSignUp} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="block text-xs font-bold uppercase tracking-wider">First Name</label>
              <input 
                type="text" 
                required
                className="w-full border-4 border-black bg-white px-3 py-2 font-bold outline-none transition-all focus:translate-x-1 focus:-translate-y-1 focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
              />
            </div>
            <div className="space-y-1">
              <label className="block text-xs font-bold uppercase tracking-wider">Last Name</label>
              <input 
                type="text" 
                required
                className="w-full border-4 border-black bg-white px-3 py-2 font-bold outline-none transition-all focus:translate-x-1 focus:-translate-y-1 focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-bold uppercase tracking-wider">Department</label>
            <select className="w-full appearance-none border-4 border-black bg-white px-3 py-2 font-bold outline-none transition-all focus:translate-x-1 focus:-translate-y-1 focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <option>Computer Science</option>
              <option>Software Engineering</option>
              <option>Other...</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-bold uppercase tracking-wider">University Email</label>
            <input 
              type="email"
              required 
              className="w-full border-4 border-black bg-white px-3 py-2 font-bold outline-none transition-all focus:translate-x-1 focus:-translate-y-1 focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-bold uppercase tracking-wider">Password</label>
            <input 
              type="password"
              required 
              className="w-full border-4 border-black bg-white px-3 py-2 font-bold outline-none transition-all focus:translate-x-1 focus:-translate-y-1 focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
            />
          </div>

          <button 
            type="submit" 
            className="mt-2 w-full border-4 border-black bg-yellow-400 px-6 py-4 text-lg font-black uppercase tracking-wider text-black transition-transform hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] active:translate-y-0 active:shadow-none"
          >
            Create Profile
          </button>
        </form>

      </div>
    </div>
  );
}