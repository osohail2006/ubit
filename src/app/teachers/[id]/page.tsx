'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// --- REUSABLE BLOCK RATING COMPONENT ---
const RatingBar = ({ label, score, color }: { label: string, score: number, color: string }) => (
  <div className="flex items-center justify-between py-1">
    <span className="w-32 font-mono text-sm font-bold uppercase tracking-wider text-gray-800">
      {label}
    </span>
    <div className="flex gap-1">
      {[...Array(10)].map((_, i) => (
        <div key={i} className={`h-5 w-4 border-2 border-black ${i < score ? color : 'bg-[#fffdf8]'}`} />
      ))}
    </div>
    <span className="w-8 text-right font-mono text-sm font-black">{score.toFixed(1)}</span>
  </div>
);

// --- INTERACTIVE MODAL RATING SELECTOR ---
const ModalRatingSelector = ({ label, score, setScore, color }: any) => (
  <div className="mb-4">
    <div className="mb-2 flex justify-between">
      <label className="font-mono text-xs font-bold uppercase tracking-widest">{label}</label>
      <span className="font-black">{score}/10</span>
    </div>
    <div className="flex gap-1">
      {[...Array(10)].map((_, i) => (
        <button
          key={i}
          type="button"
          onClick={() => setScore(i + 1)}
          className={`h-8 flex-1 border-2 border-black transition-colors ${i < score ? color : 'bg-gray-100 hover:bg-gray-200'}`}
        />
      ))}
    </div>
  </div>
);

export default function TeacherProfilePage() {
  const [isReviewModalOpen, setReviewModalOpen] = useState(false);
  
  // Modal State
  const [teachingScore, setTeachingScore] = useState(5);
  const [gradingScore, setGradingScore] = useState(5);
  const [leniencyScore, setLeniencyScore] = useState(5);
  const [friendlinessScore, setFriendlinessScore] = useState(5);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const availableTags = ['TOUGH GRADER', 'VERY FRIENDLY', 'GOAT', 'CHILLEST', 'HEAVY WORKLOAD', 'EXAMS = SLIDES', 'SKIP CLASSES'];

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) setSelectedTags(selectedTags.filter(t => t !== tag));
    else if (selectedTags.length < 3) setSelectedTags([...selectedTags, tag]);
  };

  return (
    <div className="min-h-screen bg-[#fffdf8] px-4 py-10 font-sans text-black md:px-6 border-b-4 border-black">
      <div className="mx-auto max-w-[1000px]">
        
        {/* TOP HEADER */}
        <div className="mb-8 flex items-start justify-between border-b-4 border-black pb-6">
          <div className="flex gap-6">
            <div className="flex h-20 w-20 items-center justify-center border-4 border-black bg-yellow-400 text-3xl font-black">
              AK
            </div>
            <div>
              <h1 className="text-4xl font-black tracking-tight">Dr. Ayesha Khan</h1>
              <p className="font-mono text-sm font-bold uppercase tracking-widest text-gray-600">
                COMPUTER SCIENCE • 212 REVIEWS
              </p>
            </div>
          </div>
          <div className="border-4 border-black bg-black px-4 py-2 text-3xl font-black text-yellow-400">
            9.1
          </div>
        </div>

        {/* OVERALL METRICS BOX */}
        <div className="mb-8 border-4 border-black bg-white p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <RatingBar label="TEACHING" score={9.0} color="bg-blue-600" />
          <RatingBar label="PAPER GRADING" score={8.2} color="bg-red-500" />
          <RatingBar label="LAB GRADING" score={7.5} color="bg-green-600" />
          <RatingBar label="FRIENDLINESS" score={10.0} color="bg-yellow-400" />
        </div>

        {/* QUICK FACTS */}
        <div className="mb-12">
          <p className="mb-2 font-mono text-xs font-bold uppercase tracking-widest text-gray-500">
            QUICK FACTS • REPORTED BY STUDENTS
          </p>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {['ATTENDANCE: Mandatory', 'EXAMS: 2 Midterms + Final', 'GRADING CURVE: Yes, generous', 'HOMEWORK: Heavy'].map((fact, i) => (
              <div key={i} className="border-2 border-black bg-gray-100 p-3">
                <span className="block font-mono text-[10px] font-bold uppercase text-gray-500">{fact.split(':')[0]}</span>
                <span className="font-bold">{fact.split(':')[1]}</span>
              </div>
            ))}
          </div>
        </div>

        {/* REVIEWS SECTION HEADER */}
        <div className="mb-6 flex items-center justify-between border-b-2 border-black pb-2">
          <p className="font-mono text-xs font-bold uppercase tracking-widest text-gray-500">
            STUDENT REVIEWS
          </p>
          <button 
            onClick={() => setReviewModalOpen(true)}
            className="border-2 border-black bg-yellow-400 px-4 py-1 font-bold uppercase transition-transform hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
          >
            + ADD REVIEW
          </button>
        </div>

        {/* REVIEWS LIST */}
        <div className="space-y-6">
          
          {/* Review 1 */}
          <div className="border-4 border-black bg-white p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
            <div className="mb-4 flex justify-between">
              <div className="flex gap-2">
                <span className="border-2 border-black bg-yellow-400 px-2 py-0.5 font-mono text-[10px] font-bold uppercase">ENGAGING LECTURES</span>
                <span className="border-2 border-black bg-white px-2 py-0.5 font-mono text-[10px] font-bold uppercase">APPROACHABLE</span>
              </div>
              <div className="border-2 border-black bg-black px-2 py-0.5 font-mono text-sm font-black text-yellow-400">9.5</div>
            </div>
            <p className="mb-4 text-lg font-medium text-gray-800">
              Genuinely one of the best CS teachers on campus. Explains recursion like it's nothing. Office hours are actually useful.
            </p>
            <p className="mb-4 font-mono text-xs text-gray-500">Anonymous • Data Structures • Fall 2025 • 14 found helpful</p>
            
            {/* Teacher Reply */}
            <div className="border-l-4 border-black pl-4">
              <p className="font-mono text-[10px] font-bold uppercase tracking-widest">DR. AYESHA KHAN • TEACHER</p>
              <p className="text-sm font-medium text-gray-700">Glad the office hours are helping — bring your algorithm questions early in the week, it's less rushed!</p>
            </div>
          </div>

          {/* View More Button */}
          <div className="flex justify-center pt-4">
            <button className="flex h-12 w-12 items-center justify-center rounded-full border-4 border-black bg-white text-xl transition-transform hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              ↓
            </button>
          </div>

        </div>
      </div>

      {/* --- ADD REVIEW MODAL --- */}
      <AnimatePresence>
        {isReviewModalOpen && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ y: 50 }} animate={{ y: 0 }} exit={{ y: 50 }}
              className="w-full max-w-2xl border-4 border-black bg-[#fffdf8] p-8 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] max-h-[90vh] overflow-y-auto"
            >
              <div className="mb-6 flex items-center justify-between border-b-4 border-black pb-4">
                <h2 className="text-3xl font-black uppercase tracking-tight">Drop Your Review</h2>
                <button onClick={() => setReviewModalOpen(false)} className="text-2xl font-black hover:text-red-500">X</button>
              </div>

              <div className="space-y-6">
                <div>
                  <ModalRatingSelector label="Teaching Skills" score={teachingScore} setScore={setTeachingScore} color="bg-blue-500" />
                  <ModalRatingSelector label="Paper Grading" score={gradingScore} setScore={setGradingScore} color="bg-red-500" />
                  <ModalRatingSelector label="Attendance Leniency" score={leniencyScore} setScore={setLeniencyScore} color="bg-green-500" />
                  <ModalRatingSelector label="Friendliness" score={friendlinessScore} setScore={setFriendlinessScore} color="bg-yellow-400" />
                </div>

                {/* Tags Selector */}
                <div>
                  <label className="mb-2 block font-mono text-xs font-bold uppercase tracking-widest">Select up to 3 tags</label>
                  <div className="flex flex-wrap gap-2">
                    {availableTags.map(tag => (
                      <button
                        key={tag}
                        onClick={() => toggleTag(tag)}
                        className={`border-2 border-black px-3 py-1 font-mono text-xs font-bold uppercase transition-colors ${selectedTags.includes(tag) ? 'bg-black text-white' : 'bg-white hover:bg-gray-100'}`}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Remarks Textarea */}
                <div>
                  <label className="mb-2 block font-mono text-xs font-bold uppercase tracking-widest">Your Remarks</label>
                  <textarea 
                    rows={4}
                    placeholder="Spill the tea. Be honest, but keep it clean..."
                    className="w-full resize-none border-4 border-black bg-white p-4 font-medium outline-none focus:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]"
                  />
                </div>

                <button className="w-full border-4 border-black bg-yellow-400 py-4 text-xl font-black uppercase tracking-wider transition-transform hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
                  Submit Review
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}