import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Send, CheckCircle2, Sparkles } from 'lucide-react';
import { useStore } from '../lib/store';

const QUESTIONS = [
  "Apakah kamu pernah merasa marah hanya karena membaca sebuah judul berita tanpa melihat isinya?",
  "Berapa kali kamu mengecek kebenaran sebuah informasi sebelum membagikannya hari ini?",
  "Apakah ada opini yang kamu baca hari ini yang membuatmu merasa tidak nyaman? Mengapa?",
  "Jika hari ini kamu melihat berita hoax, apakah kamu punya keberanian untuk menegurnya?",
  "Apakah media sosial membuatmu merasa lebih terhubung atau justru lebih merasa terasing hari ini?",
  "Sebutkan satu hal positif yang kamu pelajari dari internet hari ini.",
  "Apakah kamu merasa terjebak dalam 'echo chamber' (hanya mendengar apa yang ingin kamu dengar) hari ini?",
  "Bagaimana perasaanmu setelah menghabiskan waktu di media sosial selama satu jam terakhir?",
  "Apakah kamu sempat membandingkan hidupmu dengan apa yang kamu lihat di layar hari ini?",
  "Seberapa sering kamu merasa perlu untuk segera berkomentar pada isu yang sedang viral?",
  "Adakah informasi yang kamu terima hari ini yang mengubah sudut pandangmu terhadap sesuatu?",
  "Apakah kamu merasa gadget-mu mengalihkanmu dari interaksi dunia nyata yang penting hari ini?",
  "Apa satu kata yang menggambarkan 'suasana hati digital'-mu sepanjang hari ini?",
  "Jika kamu menghapus satu aplikasi hari ini, mana yang akan membuat hidupmu lebih tenang?",
  "Pernahkah kamu merasa 'FOMO' (takut tertinggal) saat melihat update orang lain hari ini?",
  "Apakah kamu sudah memberikan apresiasi (like/comment positif) pada karya orang lain hari ini?",
  "Seberapa yakin kamu bahwa data pribadimu aman dengan aktivitas internetmu hari ini?",
  "Apakah kamu menggunakan logika atau emosi saat membalas pesan yang provokatif hari ini?",
  "Apa batasan (screen time) yang berhasil atau gagal kamu terapkan hari ini?",
  "Jika internet mati total besok, apa hal pertama yang akan kamu lakukan untuk tetap produktif?"
];

const Refleksi: React.FC = () => {
  const { updateBadge, addXP, completeChallenge, addReflection, user, openAuthModal } = useStore();
  const [answer, setAnswer] = useState('');
  const [rating, setRating] = useState(50);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Logika untuk mengganti pertanyaan setiap hari secara otomatis
  const dailyQuestion = useMemo(() => {
    const today = new Date();
    // Mendapatkan angka unik berdasarkan tanggal (Day of Year)
    const start = new Date(today.getFullYear(), 0, 0);
    const diff = today.getTime() - start.getTime();
    const oneDay = 1000 * 60 * 60 * 24;
    const dayOfYear = Math.floor(diff / oneDay);
    
    // Menggunakan modulo agar indeks selalu di dalam rentang 0-19
    return QUESTIONS[dayOfYear % QUESTIONS.length];
  }, []);

  const handleSubmit = () => {
    if (user?.isGuest || !user || user.id === 'user-guest') {
      openAuthModal('login', 'Silakan Masuk atau Daftar terlebih dahulu untuk menyimpan Refleksi.');
      return;
    }

    if (!answer.trim()) return;
    
    addReflection({
      id: Date.now(),
      date: new Date().toLocaleDateString('id-ID'),
      question: dailyQuestion,
      answer: answer,
      moodLevel: rating
    });

    setIsSubmitted(true);
    updateBadge('critical-thinker', 20);
    addXP(50);
    completeChallenge('c4');
  };

  return (
    <div className="relative min-h-[80vh] flex items-center justify-center p-4 overflow-hidden">
      {/* Visual Elemen: Floating Bubbles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            animate={{ y: [0, -30, 0], x: [0, 15, 0] }}
            transition={{ duration: 10 + i, repeat: Infinity, ease: "easeInOut" }}
            className="absolute rounded-full bg-blue-400/10 blur-3xl"
            style={{
              width: `${150 + i * 50}px`,
              height: `${150 + i * 50}px`,
              left: `${i * 20}%`,
              top: `${i * 15}%`,
            }}
          />
        ))}
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative z-10 w-full max-w-3xl"
      >
        {!isSubmitted ? (
          <div className="bg-white/40 backdrop-blur-2xl p-5 sm:p-10 md:p-16 rounded-[32px] sm:rounded-[60px] border border-white/60 shadow-2xl space-y-6 sm:space-y-10">
            <div className="text-center space-y-4">
              <div className="flex justify-center mb-2">
                <span className="bg-[#031466]/10 text-[#031466] px-4 py-1.5 sm:px-6 sm:py-2 rounded-full text-[10px] sm:text-xs font-black tracking-widest uppercase flex items-center gap-2">
                  <Sparkles size={14} /> Deep Dive Hari Ini
                </span>
              </div>
              <h3 className="text-xl sm:text-3xl md:text-4xl font-bold text-[#031466] leading-tight px-2">
                "{dailyQuestion}"
              </h3>
            </div>

            {/* Self-Rating Slider */}
            <div className="space-y-4 sm:space-y-6">
              <div className="flex justify-between text-[#031466] font-bold text-[10px] sm:text-xs uppercase tracking-widest px-2">
                <span>Tenang</span>
                <span>Terjebak Emosi</span>
              </div>
              <div className="relative h-12 flex items-center group">
                <input 
                  type="range" 
                  value={rating} 
                  onChange={(e) => setRating(parseInt(e.target.value))}
                  className="w-full h-3 bg-white/50 rounded-full appearance-none cursor-pointer accent-[#031466] border border-white/80 shadow-inner" 
                />
                <motion.div 
                  animate={{ left: `${rating}%` }}
                  className="absolute w-10 h-10 bg-[#031466] rounded-full border-4 border-white shadow-2xl pointer-events-none -ml-5"
                  style={{ position: 'absolute' }}
                />
              </div>
            </div>

            {/* Glassmorphism Input */}
            <textarea
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="Gunakan momen ini untuk jujur pada diri sendiri..."
              className="w-full h-44 sm:h-56 p-4 sm:p-8 rounded-[24px] sm:rounded-[40px] bg-white/60 border-2 border-white/80 focus:border-[#031466] outline-none transition-all font-medium text-base sm:text-lg text-[#031466] resize-none shadow-xl placeholder:text-[#031466]/30"
            />

            <div className="flex flex-col md:flex-row items-center justify-between gap-4 sm:gap-6">
              <p className="text-xs sm:text-sm text-[#031466]/50 font-medium italic text-center md:text-left">
                Refleksi ini akan tersimpan dalam "The Progress Journal" pribadimu.
              </p>
              <button
                onClick={handleSubmit}
                disabled={!answer.trim()}
                className="w-full md:w-auto bg-[#031466] text-white flex items-center justify-center gap-3 px-8 sm:px-12 py-4 sm:py-5 rounded-full font-bold shadow-2xl hover:scale-105 transition-transform disabled:opacity-50 cursor-pointer"
              >
                <Send size={20} /> Simpan ke Jurnal
              </button>
            </div>
          </div>
        ) : (
          <motion.div 
            initial={{ y: 20 }} animate={{ y: 0 }}
            className="bg-white/80 backdrop-blur-xl p-6 sm:p-12 md:p-16 rounded-[32px] sm:rounded-[60px] text-center space-y-6 sm:space-y-8 border border-white"
          >
            <div className="w-16 h-16 sm:w-24 sm:h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto shadow-2xl shadow-green-200">
              <CheckCircle2 className="text-white" size={36} />
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl sm:text-4xl font-bold text-[#031466]">Satu Langkah Lebih Bijak!</h3>
              <p className="text-base sm:text-xl text-[#031466]/60 font-medium italic">"Mengenal diri sendiri adalah awal dari segala kebijaksanaan."</p>
            </div>
            <button 
              onClick={() => { setIsSubmitted(false); setAnswer(''); }}
              className="px-8 sm:px-10 py-3.5 sm:py-4 bg-[#031466] text-white rounded-full font-bold hover:shadow-lg transition-all cursor-pointer text-sm sm:text-base"
            >
              Tulis Refleksi Lain
            </button>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default Refleksi;
