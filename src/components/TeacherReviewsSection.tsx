'use client';

import React from 'react';
import Link from 'next/link';

// --- DATA MODEL (Matched strictly to the 2-column layout) ---
const teachers = [
  {
    id: 1, initials: 'AK', name: 'Dr. Ayesha Khan', department: 'COMPUTER SCIENCE', overall: 9.1,
    metrics: [
      { label: 'TEACHING', score: 9.0, color: 'bg-blue-500' }, 
      { label: 'GRADING', score: 8.2, color: 'bg-red-500' }, 
      { label: 'VIBE', score: 10.0, color: 'bg-emerald-400' }
    ],
    tags: ['AMAZING LECTURES', 'STRICT ATTENDANCE'], 
    avatarBg: 'bg-yellow-400', 
    scoreColor: 'text-yellow-400'
  },
  {
    id: 2, initials: 'HB', name: 'Mr. Hamza Butt', department: 'BUSINESS STUDIES', overall: 6.3,
    metrics: [
      { label: 'TEACHING', score: 5.4, color: 'bg-blue-500' }, 
      { label: 'GRADING', score: 4.1, color: 'bg-red-500' }, 
      { label: 'VIBE', score: 9.0, color: 'bg-emerald-400' }
    ],
    tags: ['TOUGH GRADER', 'CHILL GUY'], 
    avatarBg: 'bg-[#ff5733]',
    scoreColor: 'text-[#ff5733]'
  },
  {
    id: 3, initials: 'SA', name: 'Ms. Sana Ali', department: 'SOFTWARE ENGINEERING', overall: 8.5,
    metrics: [
      { label: 'TEACHING', score: 8.0, color: 'bg-blue-500' }, 
      { label: 'GRADING', score: 9.0, color: 'bg-red-500' }, 
      { label: 'VIBE', score: 8.0, color: 'bg-emerald-400' }
    ],
    tags: ['FAIR', 'PUNCTUAL'], 
    avatarBg: 'bg-blue-400',
    scoreColor: 'text-blue-400'
  },
  {
    id: 4, initials: 'RJ', name: 'Dr. Raza Jaffery', department: 'COMPUTER SCIENCE', overall: 4.2,
    metrics: [
      { label: 'TEACHING', score: 4.0, color: 'bg-blue-500' }, 
      { label: 'GRADING', score: 3.5, color: 'bg-red-500' }, 
      { label: 'VIBE', score: 4.0, color: 'bg-emerald-400' }
    ],
    tags: ['BORING', 'HARD EXAMS'], 
    avatarBg: 'bg-red-400',
    scoreColor: 'text-red-400'
  }
];

// --- CONTINUOUS PROGRESS BAR ---
const ProgressBar = ({ label, score, color }: { label: string, score: number | null, color: string }) => {
  const percentage = score !== null ? (score / 10) * 100 : 0;

  return (
    <div className="flex w-full items-center justify-between py-2">
      <span className="w-24 shrink-0 font-mono text-xs font-bold uppercase tracking-wider text-black sm:text-sm">
        {label}
      </span>
      
      <div className="mx-4 flex h-3 flex-1 items-center border-2 border-black bg-white">
        <div 
          className={`h-full border-r-2 border-black ${color}`} 
          style={{ width: `${percentage}%` }}
        />
      </div>

      <span className="w-8 shrink-0 text-right font-mono text-sm font-black text-black">
        {score === null ? '-' : score.toFixed(1)}
      </span>
    </div>
  );
};

export default function TeacherReviewsSection() {
  return (
    <section className="min-h-screen w-full bg-[#fffdf8] px-4 py-12 font-sans text-black md:px-8 border-b-4 border-black">
      <div className="mx-auto max-w-5xl"> 
        
        {/* HEADER */}
        <div className="mb-12 flex flex-col items-start gap-4">
          <div>
            <h2 className="flex flex-wrap items-center gap-3 text-5xl font-black uppercase tracking-tight md:text-6xl">
              <span>RATE THEM</span>
              <span className="bg-[#ff5733] px-4 py-1 text-black">HONESTLY.</span>
            </h2>
            <span className="mt-4 block font-mono text-sm font-bold tracking-widest text-black">
              143 TEACHERS RATED
            </span>
          </div>
          
          <button className="mt-4 border-4 border-black bg-emerald-300 px-6 py-4 font-black uppercase tracking-wider shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-transform hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
            + Add Missing Teacher
          </button>
        </div>

        {/* 2-COLUMN GRID */}
        <div className="grid w-full grid-cols-1 gap-8 md:grid-cols-2">
          {teachers.map((teacher) => (
            <Link 
              key={teacher.id} 
              href={`/teachers/${teacher.id}`} 
              className="flex w-full flex-col border-4 border-black bg-white p-6 shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] transition-transform hover:-translate-y-1 hover:shadow-[14px_14px_0px_0px_rgba(0,0,0,1)]"
            >
              
              {/* Card Header */}
              <div className="mb-6 flex items-start justify-between gap-3 border-b-4 border-black pb-4">
                <div className="flex items-center gap-4 overflow-hidden">
                  <div className={`flex h-16 w-16 shrink-0 items-center justify-center border-4 border-black ${teacher.avatarBg} text-2xl font-black uppercase`}>
                    {teacher.initials}
                  </div>
                  <div className="min-w-0">
                    <h3 className="truncate text-2xl font-black tracking-tight">{teacher.name}</h3>
                    <p className="truncate font-mono text-sm font-bold uppercase tracking-widest text-gray-500">
                      {teacher.department}
                    </p>
                  </div>
                </div>

                <div className={`rotate-3 shrink-0 border-4 border-black bg-black px-3 py-2 text-2xl font-black ${teacher.scoreColor}`}>
                  {teacher.overall.toFixed(1)}
                </div>
              </div>

              {/* Progress Bars Section */}
              <div className="mb-6 flex w-full flex-col space-y-1">
                {teacher.metrics.map((metric, index) => (
                  <ProgressBar 
                    key={index} 
                    label={metric.label} 
                    score={metric.score} 
                    color={metric.color} 
                  />
                ))}
              </div>

              {/* Tags Container */}
              <div className="mt-auto pt-4 border-t-2 border-black">
                <div className="flex flex-wrap gap-2">
                  {teacher.tags.map((tag, index) => (
                    <span 
                      key={index} 
                      className="border-2 border-black bg-[#fffdf8] px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-wider text-black sm:text-xs"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

            </Link>
          ))}
        </div>

      </div>
    </section>
  );
}