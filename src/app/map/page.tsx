'use client';

import React, { useState } from 'react';

// --- DIRECTORY DATA ---
const locations = [
  { id: 'ubit', name: 'UBIT / CS DEPT', color: 'bg-blue-500', type: 'ACADEMIC' },
  { id: 'library', name: 'MAHMUD HUSAIN LIBRARY', color: 'bg-yellow-400', type: 'RESOURCE' },
  { id: 'pg', name: 'PREM GALI (PG)', color: 'bg-emerald-500', type: 'FOOD' },
  { id: 'admin', name: 'ADMIN BLOCK', color: 'bg-[#ff5733]', type: 'ADMIN' },
  { id: 'gate-silver', name: 'SILVER JUBILEE GATE', color: 'bg-gray-400', type: 'EXIT' },
  { id: 'masjid', name: 'JAMIA MASJID', color: 'bg-white', type: 'FACILITY' },
];

export default function MapPage() {
  const [activePin, setActivePin] = useState<string | null>(null);

  return (
    <div className="flex h-[calc(100vh-80px)] w-full overflow-hidden bg-[#fffdf8] border-b-4 border-black">
      
      {/* --- LEGEND / DIRECTORY SIDEBAR --- */}
      <div className="hidden w-80 shrink-0 flex-col overflow-y-auto border-r-4 border-black bg-[#e6ddc5] md:flex">
        <div className="p-6">
          <div className="mb-6 border-b-4 border-black pb-4">
            <h2 className="text-3xl font-black uppercase tracking-tight">KU Grid</h2>
            <p className="mt-1 font-mono text-xs font-bold uppercase tracking-widest text-gray-600">
              Survival Blueprint
            </p>
          </div>

          <div className="space-y-4">
            {locations.map((loc) => (
              <button
                key={loc.id}
                onMouseEnter={() => setActivePin(loc.id)}
                onMouseLeave={() => setActivePin(null)}
                className="group w-full text-left transition-transform hover:-translate-y-1"
              >
                <div className={`flex items-center gap-3 border-4 border-black bg-white p-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-colors ${activePin === loc.id ? 'bg-gray-100' : ''}`}>
                  {/* Color Key Block */}
                  <div className={`h-6 w-6 shrink-0 border-2 border-black ${loc.color} shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]`} />
                  
                  <div className="overflow-hidden">
                    <h3 className="truncate font-sans text-sm font-black uppercase tracking-tight text-black">
                      {loc.name}
                    </h3>
                    <p className="font-mono text-[10px] font-bold uppercase tracking-widest text-gray-500">
                      [{loc.type}]
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* --- MAP CANVAS AREA --- */}
      <div className="relative flex flex-1 flex-col items-center justify-center bg-[#fffdf8]">
        
        {/* Animated Blueprint Grid Background */}
        <div 
          className="absolute inset-0 z-0 opacity-30"
          style={{
            backgroundImage: 'linear-gradient(#000 2px, transparent 2px), linear-gradient(90deg, #000 2px, transparent 2px)',
            backgroundSize: '40px 40px',
          }}
        />

        {/* Placeholder for the actual map integration */}
        <div className="relative z-10 flex flex-col items-center border-4 border-black bg-white p-8 text-center shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]">
          <div className="mb-4 h-16 w-16 animate-bounce border-4 border-black bg-yellow-400 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]" />
          <h2 className="text-3xl font-black uppercase tracking-tight">Map Module Offline</h2>
          <p className="mt-2 max-w-sm font-mono text-sm font-bold uppercase tracking-widest text-gray-600">
            Interactive coordinates pending. Awaiting integration with Mapbox or custom SVG vector map.
          </p>
        </div>

        {/* Floating Crosshair overlay for aesthetic */}
        <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center opacity-10">
          <div className="h-full w-1 bg-black" />
          <div className="absolute h-1 w-full bg-black" />
        </div>

      </div>
    </div>
  );
}