import React from 'react';

export default function UserProfile() {
  return (
    <div className="min-h-screen bg-[#f8f8f6] p-8 font-sans text-black selection:bg-black selection:text-yellow-400 md:p-16">
      <div className="mx-auto max-w-5xl space-y-12">
        
        {/* Massive Profile Header */}
        <div className="flex flex-col border-4 border-black bg-yellow-400 p-8 shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] md:flex-row md:items-center md:gap-8">
          <div className="mb-6 flex h-32 w-32 shrink-0 items-center justify-center border-4 border-black bg-black text-6xl font-black text-white md:mb-0">
            OS
          </div>
          <div>
            <div className="mb-2 inline-block border-2 border-black bg-[#f8f8f6] px-2 py-0.5 text-xs font-black uppercase tracking-widest text-black">
              Verified Student
            </div>
            <h1 className="mb-2 text-5xl font-black uppercase tracking-tight md:text-7xl">
              Omer Sohail
            </h1>
            <p className="text-xl font-bold uppercase tracking-wider">
              Computer Science • UoK UBIT
            </p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div className="border-4 border-black bg-emerald-500 p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] text-white">
            <h3 className="mb-1 text-sm font-black uppercase tracking-wider">Notes Uploaded</h3>
            <p className="text-5xl font-black">12</p>
          </div>
          <div className="border-4 border-black bg-blue-600 p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] text-white">
            <h3 className="mb-1 text-sm font-black uppercase tracking-wider">Active Requests</h3>
            <p className="text-5xl font-black">03</p>
          </div>
          <div className="border-4 border-black bg-red-500 p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] text-white">
            <h3 className="mb-1 text-sm font-black uppercase tracking-wider">Teacher Ratings</h3>
            <p className="text-5xl font-black">08</p>
          </div>
        </div>

        {/* Recent Activity Feed */}
        <div>
          <h2 className="mb-6 text-3xl font-black uppercase tracking-tight">Recent Activity</h2>
          <div className="space-y-4">
            
            <div className="flex items-center justify-between border-4 border-black bg-white p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <div className="flex items-center gap-4">
                <span className="border-2 border-black bg-yellow-400 px-2 py-1 text-xs font-black uppercase">Upload</span>
                <span className="font-bold">Operating Systems Midterm Past Paper</span>
              </div>
              <span className="font-bold text-gray-500 text-sm">2 days ago</span>
            </div>

            <div className="flex items-center justify-between border-4 border-black bg-white p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <div className="flex items-center gap-4">
                <span className="border-2 border-black bg-blue-600 px-2 py-1 text-xs font-black uppercase text-white">Request</span>
                <span className="font-bold">Looking for a project partner for Web Dev</span>
              </div>
              <span className="font-bold text-gray-500 text-sm">5 days ago</span>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}