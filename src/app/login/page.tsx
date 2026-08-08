import React from 'react';

export default function Login() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-blue-600 p-8 font-sans selection:bg-black selection:text-yellow-400">
      <div className="w-full max-w-md border-4 border-black bg-[#f8f8f6] p-8 shadow-[16px_16px_0px_0px_rgba(0,0,0,1)]">
        
        <div className="mb-8">
          <div className="mb-4 inline-block border-2 border-black bg-yellow-400 px-2 py-1 text-sm font-black uppercase tracking-wider text-black">
            System Access
          </div>
          <h1 className="text-4xl font-black uppercase tracking-tight">Welcome Back.</h1>
        </div>

        <form className="space-y-6">
          <div className="space-y-2">
            <label className="block text-sm font-bold uppercase tracking-wider">University Email</label>
            <input 
              type="email" 
              placeholder="e.g., student@uok.edu.pk" 
              className="w-full border-4 border-black bg-white px-4 py-3 text-lg font-bold outline-none transition-all focus:translate-x-1 focus:-translate-y-1 focus:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-bold uppercase tracking-wider">Password</label>
            <input 
              type="password" 
              placeholder="••••••••" 
              className="w-full border-4 border-black bg-white px-4 py-3 text-lg font-bold outline-none transition-all focus:translate-x-1 focus:-translate-y-1 focus:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]"
            />
          </div>

          <button 
            type="submit" 
            className="w-full border-4 border-black bg-black px-8 py-4 text-lg font-black uppercase tracking-wider text-white transition-transform hover:-translate-y-1 hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] active:translate-y-0 active:shadow-none"
          >
            Enter Hub &rarr;
          </button>
        </form>

        <div className="mt-8 border-t-4 border-black pt-6 text-center font-bold">
          Don't have an account? <a href="/signup" className="text-blue-600 hover:bg-blue-600 hover:text-white px-1 underline decoration-2 underline-offset-4">Sign Up</a>
        </div>
      </div>
    </div>
  );
}