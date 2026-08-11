'use client';

import React, { useState } from 'react';

// --- DUMMY DATA ---
const rooms = [
  { id: 'campus-wide', name: '# CAMPUS WIDE', active: true, unread: 0 },
  { id: 'batch-2027', name: '# BATCH 2027', active: false, unread: 3 },
  { id: 'cs-dept', name: '# CS DEPT', active: false, unread: 12 },
  { id: 'alumni-lounge', name: '# ALUMNI LOUNGE', active: false, unread: 0 },
  { id: 'confessions', name: '# CONFESSIONS', active: false, unread: 1 },
];

const messages = [
  { 
    id: 1, sender: 'HIRA R.', avatar: 'HR', profileColor: 'bg-[#ff5733]', // Example of passing a dynamic color
    time: '10:42 AM', text: 'anyone else\'s WiFi in the library down rn?', 
    reactions: [{ emoji: '👍', count: 3 }, { emoji: '😂', count: 1 }], isSelf: false 
  },
  { 
    id: 2, sender: 'ANONYMOUS', avatar: '?', profileColor: 'bg-gray-400', 
    time: '10:44 AM', text: 'campus-wide, IT said "soon" 30 mins ago', 
    reactions: [], isSelf: false 
  },
  { 
    id: 3, sender: 'ZAINAB A.', avatar: 'ZA', profileColor: 'bg-blue-500', 
    time: '10:47 AM', text: 'Dr. Khan pushed the deadline to Monday btw', 
    reactions: [{ emoji: '🙏', count: 6 }], isSelf: false 
  },
  { 
    id: 4, sender: 'YOU', avatar: 'YOU', profileColor: 'bg-yellow-400', 
    time: '10:48 AM', text: 'I literally have not started the assignment.', 
    reactions: [], isSelf: true 
  },
];

export default function ChatPage() {
  const [isAnon, setIsAnon] = useState(false);

  return (
    // Height fills screen minus the navbar
    <div className="flex h-[calc(100vh-80px)] w-full overflow-hidden bg-[#fffdf8] border-b-4 border-black">
      
      {/* --- SIDEBAR --- */}
      <div className="hidden w-64 shrink-0 flex-col justify-between border-r-4 border-black bg-[#e6ddc5] md:flex">
        <div className="p-6">
          <h3 className="mb-4 font-mono text-xs font-bold uppercase tracking-widest text-gray-600">
            Rooms
          </h3>
          <ul className="space-y-3">
            {rooms.map((room) => (
              <li key={room.id}>
                <button
                  className={`flex w-full items-center justify-between px-3 py-2 font-mono text-sm font-bold uppercase transition-colors ${
                    room.active
                      ? 'bg-black text-yellow-400 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]'
                      : 'text-black hover:bg-white hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]'
                  }`}
                >
                  <span>{room.name}</span>
                  {/* Unread Notification Pill */}
                  {room.unread > 0 && (
                    <span className="flex h-6 w-6 items-center justify-center border-2 border-black bg-[#ff5733] text-[10px] text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                      {room.unread}
                    </span>
                  )}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* --- MAIN CHAT AREA --- */}
      <div className="flex flex-1 flex-col">
        
        

        {/* Messages Feed */}
        <div className="flex-1 overflow-y-auto p-6 bg-[#fffdf8]">
          
          {/* Today Divider */}
          <div className="mb-8 flex items-center justify-center gap-4">
            <div className="h-0.5 flex-1 bg-gray-200" />
            <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-gray-400">TODAY</span>
            <div className="h-0.5 flex-1 bg-gray-200" />
          </div>

          <div className="space-y-8">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.isSelf ? 'justify-end' : 'justify-start'}`}>
                
                <div className={`flex max-w-[85%] md:max-w-[70%] gap-4 ${msg.isSelf ? 'flex-row-reverse' : 'flex-row'}`}>
                  
                  {/* Avatar Box (Uses dynamic profileColor) */}
                  <div className={`flex h-12 w-12 shrink-0 items-center justify-center border-2 border-black ${msg.profileColor} font-mono font-black text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]`}>
                    {msg.avatar}
                  </div>
                  
                  {/* Message Content */}
                  <div className={`flex flex-col ${msg.isSelf ? 'items-end' : 'items-start'}`}>
                    <div className="mb-1 flex items-center gap-2 font-mono text-[10px] font-bold uppercase tracking-widest text-gray-500">
                      <span className="text-black">{msg.sender}</span>
                      <span>{msg.time}</span>
                    </div>
                    
                    <div className="border-2 border-black bg-white px-4 py-3 font-medium text-gray-900 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                      {msg.text}
                    </div>

                    {/* Reactions */}
                    {msg.reactions.length > 0 && (
                      <div className={`mt-2 flex gap-2 ${msg.isSelf ? 'justify-end' : 'justify-start'}`}>
                        {msg.reactions.map((react, i) => (
                          <button key={i} className="flex items-center gap-1 border-2 border-black bg-white px-2 py-0.5 text-xs font-bold transition-transform hover:-translate-y-0.5 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                            <span>{react.emoji}</span>
                            <span>{react.count}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                </div>
              </div>
            ))}

            {/* Typing Indicator */}
            <div className="flex items-center gap-4 pt-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center border-2 border-black bg-purple-400 font-mono font-black text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                O
              </div>
              <div className="border-2 border-black bg-white px-4 py-3 font-black tracking-widest shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <span className="animate-pulse">. . .</span>
              </div>
            </div>

          </div>
        </div>

        {/* --- INPUT AREA --- */}
        <div className="border-t-4 border-black bg-[#fffdf8] p-4 md:p-6">
          <div className="flex items-center gap-4">
            
            {/* Custom Anon Toggle */}
            <button 
              onClick={() => setIsAnon(!isAnon)}
              className={`flex shrink-0 items-center gap-2 border-2 border-black px-3 py-3 transition-colors shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] ${isAnon ? 'bg-[#ff5733] text-black' : 'bg-white text-gray-400 hover:bg-gray-100'}`}
            >
              <span className="font-mono text-xs font-black uppercase tracking-widest">
                🎭 ANON
              </span>
            </button>

            {/* Text Input Field */}
            <input 
              type="text" 
              placeholder="Message #Campus Wide..." 
              className="flex-1 border-2 border-black bg-white px-4 py-3 font-medium text-black outline-none transition-shadow focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
            />

            {/* Re-designed Green Send Button */}
            <button className="shrink-0 border-2 border-black bg-emerald-500 px-8 py-3 font-black text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-transform hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] active:translate-y-0 active:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              SEND
            </button>
            
          </div>
        </div>
        
      </div>
    </div>
  );
}