import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Book, ChevronLeft, ChevronRight, Award, Star, Zap,
  History, X, Calendar, Trophy, MousePointer2,
  ClipboardCheck, Rocket, MessageSquare, PenTool
} from 'lucide-react';
import { useStore } from '../lib/store';
import { cn } from '../lib/utils';

const AVATAR_SEEDS = [
  'Felix', 'Aria', 'Mason', 'Zoe', 'Leo', 'Maya', 'Brian', 'Caleb', 'Alexander', 'Sophia', 'Lucas', 'Oliver'
];

const EMOJIS = [
  "😀","😊","😍","😗","😚","🤗","🫡","😑","😶‍🌫️","😁","😃","😆","😋","😘","😙","☺️","🤩","🤨","😶","😄","😉","😎","🥰","🙂","😏","😮","😯","🥱","😜","😲","😤","😇","🥸","🤠","🙂‍↕️","🤫","🤭","🧐","🫣","🫢","🤓"
];

const Profile: React.FC = () => {
  const { user, reflections, updateProfile, topics, quizResults } = useStore();
  const [isOpen, setIsOpen] = useState(false);
  const [isEmojiModalOpen, setIsEmojiModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);

  if (!user) return null;

  // --- LOGIKA REAL-TIME AGGREGATOR ---
  const stats = useMemo(() => {
    const results = quizResults || [];
    return {
      preTests: results.filter(r => r.type === 'pre').length,
      postTests: results.filter(r => r.type === 'post').length,
      levelQuizzes: results.filter(r => r.type === 'quiz' && r.score >= 80).length,
      totalQuizzes: results.length,
      averageScore: results.length 
        ? Math.round(results.reduce((acc, curr) => acc + curr.score, 0) / results.length) 
        : 0
    };
  }, [quizResults]);

  const calculatedXP = useMemo(() => {
    return (stats.totalQuizzes * 50) + ((reflections?.length || 0) * 20) + ((topics?.length || 0) * 10);
  }, [stats.totalQuizzes, reflections, topics]);

  const handleSelectEmoji = (emoji: string) => {
    updateProfile({ photoUrl: emoji });
    setIsEmojiModalOpen(false);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 md:space-y-10 py-6 md:py-8 px-4 sm:px-6 lg:px-8 font-sans">
      
      {/* --- PROFILE HEADER (Responsive) --- */}
      <section className="p-5 sm:p-8 md:p-14 rounded-[30px] sm:rounded-[40px] md:rounded-[60px] shadow-2xl border-4 border-white relative overflow-hidden bg-gradient-to-br from-[#031466] via-[#052199] to-orange-500">
        <div className="absolute top-[-50px] right-[-50px] w-64 h-64 md:w-80 md:h-80 bg-orange-400/20 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col md:flex-row items-center gap-6 md:gap-12 relative z-10">
          {/* Avatar Area */}
          <div className="relative group shrink-0">
            <motion.div 
              whileHover={{ scale: 1.05 }}
              onClick={() => setIsEmojiModalOpen(true)}
              className="w-28 h-28 sm:w-36 sm:h-36 md:w-44 md:h-44 rounded-[30px] sm:rounded-[40px] md:rounded-[50px] border-4 md:border-8 border-white/20 bg-white/10 backdrop-blur-md flex items-center justify-center text-5xl sm:text-7xl md:text-8xl shadow-2xl cursor-pointer hover:border-orange-400 transition-all overflow-hidden"
            >
              {user.photoUrl && (user.photoUrl.startsWith('http') || user.photoUrl.startsWith('/')) ? (
                <img src={user.photoUrl} alt={user.username} className="w-full h-full object-cover" />
              ) : (
                <span>{user.photoUrl || "😊"}</span>
              )}
            </motion.div>
            <div className="absolute -bottom-2 -right-2 p-2 md:p-3 bg-orange-500 text-white rounded-xl md:rounded-2xl shadow-lg animate-bounce pointer-events-none">
              <MousePointer2 size={16} className="md:w-5 md:h-5" />
            </div>
          </div>

          {/* User Info Area */}
          <div className="flex-1 text-center md:text-left space-y-3 md:space-y-4 w-full">
            <div className="flex flex-col md:flex-row items-center md:justify-start gap-3 md:gap-4">
              <h1 className="text-2xl sm:text-4xl md:text-5xl font-black text-white tracking-tight">
                {user.username || 'Tamu OutBubble'}
              </h1>
              {user.isGuest ? (
                <span className="px-3.5 py-1 bg-amber-400/20 text-amber-200 border border-amber-300/40 rounded-full text-xs font-black uppercase">
                  Mode Tamu
                </span>
              ) : (
                <span className="px-3.5 py-1 bg-emerald-400/20 text-emerald-200 border border-emerald-300/40 rounded-full text-xs font-black uppercase">
                  Anggota Resmi 🛡️
                </span>
              )}
            </div>
            
            <p className="text-lg md:text-2xl text-blue-100 font-bold italic">"{user.bio || 'Digital Literacy Explorer'}"</p>
            
            <div className="flex flex-wrap gap-3 pt-3 md:pt-4 justify-center md:justify-start">
               <span className="flex items-center gap-2 md:gap-3 px-5 py-2.5 md:px-6 md:py-3 bg-orange-500 text-white rounded-[20px] md:rounded-[25px] font-black text-sm md:text-lg shadow-xl border-2 border-white/20">
                 <Star size={18} className="md:w-5 md:h-5" fill="currentColor"/> Level {user.level}
               </span>
               <span className="flex items-center gap-2 md:gap-3 px-5 py-2.5 md:px-6 md:py-3 bg-white text-[#031466] rounded-[20px] md:rounded-[25px] font-black text-sm md:text-lg shadow-xl border-2 border-[#031466]/10">
                 <Zap size={18} className="md:w-5 md:h-5 text-blue-600" fill="currentColor"/> {calculatedXP} XP
               </span>
            </div>
          </div>
        </div>
      </section>

      {/* --- MAIN CONTENT GRID --- */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 md:gap-8">
        
        {/* PROGRESS JOURNAL SECTION */}
        <section className="lg:col-span-3 flex flex-col items-center justify-center bg-white rounded-[40px] md:rounded-[60px] p-6 md:p-12 border-4 border-slate-100 relative min-h-[400px] md:min-h-[450px] shadow-xl shadow-blue-900/5">
          <AnimatePresence mode="wait">
            {!isOpen ? (
              <motion.div 
                key="closed" 
                initial={{ scale: 0.8, opacity: 0 }} 
                animate={{ scale: 1, opacity: 1 }} 
                exit={{ scale: 1.1, opacity: 0 }} 
                onClick={() => setIsOpen(true)} 
                className="group cursor-pointer flex flex-col items-center gap-5 md:gap-6 w-full h-full justify-center"
              >
                <div className="relative w-32 h-44 md:w-40 md:h-56 bg-[#031466] rounded-r-2xl md:rounded-r-3xl rounded-l-md shadow-[10px_10px_30px_rgba(0,0,0,0.3)] md:shadow-[20px_20px_60px_rgba(0,0,0,0.3)] transition-all group-hover:-rotate-6 group-hover:scale-110 duration-500 border-l-8 border-blue-900">
                  <div className="absolute left-3 md:left-4 top-0 bottom-0 w-1 bg-white/10" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Book size={48} className="md:w-16 md:h-16 text-orange-400 opacity-90" />
                  </div>
                </div>
                <div className="text-center px-4">
                  <h3 className="text-xl md:text-2xl font-black text-[#031466] uppercase tracking-tighter">The Progress Journal</h3>
                  <p className="text-xs md:text-sm text-slate-400 font-bold uppercase mt-1">Klik untuk lihat refleksi</p>
                </div>
              </motion.div>
            ) : (
              <motion.div 
                key="opened" 
                initial={{ scale: 0.9, opacity: 0 }} 
                animate={{ scale: 1, opacity: 1 }} 
                className="absolute inset-0 z-20 bg-[#fdfaf1] rounded-[40px] md:rounded-[60px] shadow-2xl border-l-[12px] md:border-l-[20px] border-[#031466] flex flex-col overflow-hidden"
              >
                {/* Journal Header */}
                <div className="p-5 md:p-8 border-b border-slate-200 flex justify-between items-center bg-white/50 backdrop-blur-sm">
                  <div className="flex items-center gap-2 md:gap-3 text-[#031466] font-black uppercase text-xs md:text-sm tracking-[0.1em] md:tracking-[0.2em]">
                    <Book size={18} className="md:w-5 md:h-5 text-orange-500" /> Jurnal Saya
                  </div>
                  <button onClick={() => setIsOpen(false)} className="p-2 md:p-3 bg-red-50 hover:bg-red-100 text-red-500 rounded-xl md:rounded-2xl transition-all">
                    <X size={20} className="md:w-6 md:h-6" />
                  </button>
                </div>

                {/* Journal Content */}
                <div className="flex-1 p-6 md:p-14 relative overflow-y-auto custom-scrollbar">
                  <div className="absolute inset-0 opacity-[0.15] pointer-events-none" style={{ backgroundImage: 'linear-gradient(#031466 1px, transparent 1px)', backgroundSize: '100% 2rem' }} />
                  <AnimatePresence mode="wait">
                    {reflections && reflections.length > 0 ? (
                      <motion.div key={currentPage} initial={{ x: 50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -50, opacity: 0 }} className="relative z-10 space-y-6 md:space-y-8">
                        <div className="flex items-center gap-2 md:gap-3 text-orange-600 font-black text-xs md:text-sm uppercase bg-orange-50 w-fit px-3 py-1.5 md:px-4 md:py-2 rounded-full border border-orange-100">
                          <Calendar size={14} className="md:w-4 md:h-4" /> {reflections[currentPage].date}
                        </div>
                        <h4 className="text-xl md:text-3xl font-black text-[#031466] leading-tight italic bg-white/40 p-4 rounded-2xl backdrop-blur-sm">
                          "{reflections[currentPage].question}"
                        </h4>
                        <p className="text-base md:text-xl text-slate-700 leading-relaxed md:leading-[2.5rem] font-serif py-2 md:py-4 border-l-4 border-orange-300 pl-4 md:pl-6 bg-white/30 rounded-r-2xl">
                          {reflections[currentPage].answer}
                        </p>
                      </motion.div>
                    ) : (
                      <div className="h-full flex flex-col items-center justify-center text-center text-slate-400 italic font-bold text-sm md:text-base px-4">
                        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4"><PenTool className="text-slate-300"/></div>
                        Belum ada catatan refleksi.<br/> Selesaikan materi untuk mengisi jurnal!
                      </div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Journal Footer (Pagination) */}
                <div className="p-4 md:p-8 bg-white/90 backdrop-blur-md border-t border-slate-200 flex items-center justify-between">
                  <span className="text-xs md:text-sm font-black text-[#031466]/40 uppercase bg-slate-100 px-3 py-1 rounded-lg">Hal {currentPage + 1}/{reflections?.length || 1}</span>
                  <div className="flex gap-2 md:gap-4">
                    <button onClick={() => setCurrentPage(p => Math.max(0, p - 1))} disabled={currentPage === 0} className="p-3 md:p-4 rounded-xl md:rounded-2xl bg-[#031466] text-white disabled:opacity-20 shadow-lg md:shadow-xl hover:bg-orange-500 transition-colors active:scale-95">
                      <ChevronLeft size={20} className="md:w-6 md:h-6" />
                    </button>
                    <button onClick={() => setCurrentPage(p => Math.min((reflections?.length || 1) - 1, p + 1))} disabled={!reflections || currentPage === reflections.length - 1} className="p-3 md:p-4 rounded-xl md:rounded-2xl bg-[#031466] text-white disabled:opacity-20 shadow-lg md:shadow-xl hover:bg-orange-500 transition-colors active:scale-95">
                      <ChevronRight size={20} className="md:w-6 md:h-6" />
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </section>

        {/* --- SIDEBAR STATS & ACTIVITY --- */}
        <div className="lg:col-span-2 space-y-6 md:space-y-8">
          
          {/* Status Akademik */}
          <section className="bg-gradient-to-br from-orange-400 to-orange-600 p-6 md:p-10 rounded-[35px] md:rounded-[50px] shadow-xl md:shadow-2xl text-white relative overflow-hidden group">
            <div className="absolute bottom-[-20px] right-[-20px] opacity-20 group-hover:scale-110 transition-transform duration-700">
               <Trophy size={120} className="md:w-[150px] md:h-[150px]" />
            </div>
            <h3 className="text-xl md:text-2xl font-black mb-6 flex items-center gap-2 md:gap-3 uppercase tracking-tighter">
              <Award size={24} className="md:w-8 md:h-8" /> Prestasi
            </h3>
            <div className="bg-white/20 backdrop-blur-md p-6 md:p-8 rounded-[30px] md:rounded-[40px] border-2 border-white/30 text-center relative z-10 shadow-inner">
              <p className="text-xs md:text-sm font-black uppercase tracking-widest mb-1 md:mb-2 opacity-90 text-orange-50">Skor Rata-Rata</p>
              <div className="text-6xl md:text-7xl font-black italic mb-3 md:mb-4 drop-shadow-md text-white">{stats.averageScore}</div>
              <div className="bg-white text-orange-600 px-4 py-1.5 md:px-6 md:py-2 rounded-full font-black text-xs md:text-sm inline-block shadow-lg uppercase tracking-wider">
                {stats.averageScore >= 80 ? "Master Thinker" : stats.averageScore >= 50 ? "Bubble Explorer" : "Novice Learner"}
              </div>
            </div>
          </section>

          {/* Aktivitas Live */}
          <section className="bg-[#031466] p-6 md:p-10 rounded-[35px] md:rounded-[50px] shadow-xl md:shadow-2xl text-white border-b-[8px] md:border-b-[12px] border-orange-500 relative overflow-hidden">
             <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-bl-full pointer-events-none" />
             <h3 className="text-xl md:text-2xl font-black mb-6 flex items-center gap-2 md:gap-3 uppercase tracking-tighter relative z-10">
               <History size={24} className="md:w-7 md:h-7 text-orange-400" /> Ringkasan
             </h3>
             <div className="space-y-3 md:space-y-4 relative z-10">
                
                <div className="bg-white/5 hover:bg-white/10 p-3.5 md:p-4 rounded-2xl md:rounded-3xl flex justify-between items-center border border-white/10 transition-colors">
                   <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-500/20 rounded-xl"><MessageSquare size={16} className="text-blue-400" /></div>
                      <span className="text-blue-100 font-bold uppercase text-[9px] md:text-[10px] tracking-wider">Diskusi Forum</span>
                   </div>
                   <span className="text-lg md:text-xl font-black italic">{topics?.length || 0}</span>
                </div>

                <div className="bg-white/5 hover:bg-white/10 p-3.5 md:p-4 rounded-2xl md:rounded-3xl flex justify-between items-center border border-white/10 transition-colors">
                   <div className="flex items-center gap-3">
                      <div className="p-2 bg-orange-500/20 rounded-xl"><Rocket size={16} className="text-orange-400" /></div>
                      <span className="text-blue-100 font-bold uppercase text-[9px] md:text-[10px] tracking-wider">Kuis Diselesaikan</span>
                   </div>
                   <span className="text-lg md:text-xl font-black italic">{stats.levelQuizzes}</span>
                </div>

                <div className="bg-white/5 hover:bg-white/10 p-3.5 md:p-4 rounded-2xl md:rounded-3xl flex justify-between items-center border border-white/10 transition-colors">
                   <div className="flex items-center gap-3">
                      <div className="p-2 bg-green-500/20 rounded-xl"><ClipboardCheck size={16} className="text-green-400" /></div>
                      <span className="text-blue-100 font-bold uppercase text-[9px] md:text-[10px] tracking-wider">Pre/Post Test</span>
                   </div>
                   <span className="text-lg md:text-xl font-black italic">{stats.preTests + stats.postTests}</span>
                </div>

             </div>
          </section>
        </div>
      </div>

      {/* --- MODAL EMOJI SELECTOR (Responsive Grid) --- */}
      <AnimatePresence>
        {isEmojiModalOpen && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 sm:p-6 bg-[#031466]/80 backdrop-blur-sm">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsEmojiModalOpen(false)} className="absolute inset-0" />
            <motion.div 
              initial={{ scale: 0.9, y: 20, opacity: 0 }} 
              animate={{ scale: 1, y: 0, opacity: 1 }} 
              exit={{ scale: 0.9, y: 20, opacity: 0 }}
              className="bg-white w-full max-w-2xl p-6 md:p-10 rounded-[40px] md:rounded-[60px] relative z-10 shadow-2xl border-[6px] md:border-[10px] border-orange-500 flex flex-col max-h-[85vh]"
            >
               <div className="flex justify-between items-center mb-6 md:mb-8 shrink-0">
                  <div>
                    <h3 className="text-2xl md:text-3xl font-black text-[#031466] italic uppercase tracking-tighter">Pilih Foto Profile</h3>
                    <p className="text-xs text-slate-400 font-bold mt-1">Pilih karakter Avatar atau Emoji kesukaanmu</p>
                  </div>
                  <button onClick={() => setIsEmojiModalOpen(false)} className="p-2 md:p-3 bg-slate-100 rounded-xl md:rounded-2xl hover:bg-red-50 hover:text-red-500 transition-all">
                    <X size={20} className="md:w-6 md:h-6" />
                  </button>
               </div>
               
               <div className="overflow-y-auto space-y-6 p-2 md:p-4 custom-scrollbar rounded-3xl bg-slate-50 border border-slate-100 flex-1">
                  <div>
                    <p className="text-xs font-black text-[#031466] uppercase tracking-wider mb-3">Karakter Avatar</p>
                    <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
                      {AVATAR_SEEDS.map((seed) => {
                        const avatarUrl = `https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}`;
                        return (
                          <button
                            key={seed}
                            onClick={() => {
                              updateProfile({ photoUrl: avatarUrl });
                              setIsEmojiModalOpen(false);
                            }}
                            className="aspect-square rounded-2xl bg-white border-2 border-slate-200 hover:border-orange-500 p-1.5 shadow-sm hover:scale-105 transition-all flex items-center justify-center cursor-pointer overflow-hidden"
                          >
                            <img src={avatarUrl} alt={seed} className="w-full h-full object-cover rounded-xl" />
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <p className="text-xs font-black text-[#031466] uppercase tracking-wider mb-3">Persona Emoji</p>
                    <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2 md:gap-3">
                      {EMOJIS.map((emoji, idx) => (
                        <button 
                          key={idx} 
                          onClick={() => handleSelectEmoji(emoji)} 
                          className="text-3xl md:text-4xl aspect-square flex items-center justify-center bg-white shadow-sm hover:bg-orange-100 border border-transparent hover:border-orange-300 rounded-2xl transition-all hover:scale-110 active:scale-95 cursor-pointer"
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                  </div>
               </div>
               
               <p className="mt-6 md:mt-8 text-center text-[#031466]/40 font-bold uppercase text-[10px] md:text-xs tracking-widest shrink-0 bg-slate-50 py-2 rounded-lg">
                 Gratis ganti kapan saja! ✨
               </p>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Profile;