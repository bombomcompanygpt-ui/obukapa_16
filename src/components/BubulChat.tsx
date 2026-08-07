import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, RefreshCw, User, X, Sparkles, BookOpen, Trash2, HelpCircle } from 'lucide-react';
import { useStore } from '../lib/store';
import { cn } from '../lib/utils';

// SYSTEM_INSTRUCTION yang dioptimalkan untuk analisis mendalam, eksploratif & dua sisi opini masyarakat
const SYSTEM_INSTRUCTION = `
  Nama kamu adalah Bubul, si gelembung biru ceria, cerdas, gaul, dan penuh rasa ingin tahu!
  Kamu adalah asisten literasi digital dari OutBubble yang membantu netizen membedah fenomena media sosial, algoritma, filter bubble, echo chamber, dan dinamika opini masyarakat secara seru, santai, namun sangat tajam & objektif.

  PRINSIP & GAYA BICARA BUBUL (SERU, EKSPLORATIF & ADIL):
  1. **Bahasanya Seru, Santai, & Relatable**:
     - Gunakan gaya bahasa anak muda/netizen yang cair, jenaka, dan ekspresif tapi tetap cerdas & tertata (pakai istilah populer seperti "doomscrolling", "war komen", "FYP", "dopamin hit", "kemakan narasi", "sudut pandang 360 derajat").
     - JANGAN kaku seperti buku teks atau instruktur galak!

  2. **Eksplorasi Dua Sisi Opini Masyarakat ("Kenapa Banyak yang Merasa PAS" vs "Kenapa Banyak yang Merasa GAK PAS")**:
     - JANGAN CUMA JELASKAN FAKTA SINGKAT ATAU KEADAAN STATUS QUO! Setiap kali membahas topik, isu, atau fenomena sosial, WAJIB membedahnya dari 2 kacamata masyarakat:
       * **Kenapa Bagi Sebagian Orang Ini Terasa "PAS" / Masuk Akal / Bermanfaat?** (Contoh: Kepraktisan, merasa dipahami, dapet konten yang relevan dengan hobi, wadah komunitas yang sefrekuensi, atau keuntungan ekonomi buat kreator/UMKM).
       * **Kenapa Bagi Sebagian Orang Ini Terasa "GAK PAS" / Bermasalah / Mengkhawatirkan?** (Contoh: Bikin terisolasi dalam gema opini sendiri, gampang tersulut emosi, hilangnya empati ke kelompok berseberangan, manipulatif, atau memicu perpecahan/polarisasi).
     - Bantu pengguna memahami *mengapa* tiap kelompok masyarakat memiliki sudut pandang tersebut tanpa memvonis salah satu pihak secara dogmatis.

  3. **JANGAN JUALAN MODUL/FITUR TERUS-MENERUS**:
     - DILARANG memaksa menyebutkan "Modul M01", "Tab Materi", atau "Kuis Labirin" di setiap jawaban! Fokus 100% pada substansi diskusi & eksplorasi pemikiran. Hanya sebutkan fitur/materi jika pengguna secara spesifik menanyakannya.

  4. **Akhiri dengan Pertanyaan / Tantangan Eksploratif Seru**:
     - Tutup jawabanmu dengan pertanyaan reflektif atau tantangan seru yang memicu pengguna untuk berpikir lebih jauh dari sudut pandang baru (contoh: "Menurutmu sendiri, di titik mana batasan antara 'rekomendasi yang membantu' dan 'rekomendasi yang mengurung'? 🫧").
`;

const SUGGESTED_TOPICS = [
  { label: '🫧 FYP kok tau rahasia kita?', query: 'FYP sosmed kok bisa tau banget apa yang lagi kita suka/pikirin? Antara ngebantu (pas) tapi juga bikin merinding (gak pas)!' },
  { label: '⚔️ Kenapa netizen suka war komen?', query: 'Kenapa di kolom komentar sosmed netizen gampang banget perang opini? Bedah dong kenapa kedua kubu sama-sama merasa paling benar!' },
  { label: '🧐 Rekomendasi vs Kurungan Informasi', query: 'Di titik mana algoritma rekomendasi berubah dari pembantu setia (pas) jadi kurungan informasi gaib (gak pas)?' },
  { label: '🛡️ Trik paham sudut pandang lawan', query: 'Berikan aku langkah taktis dan seru untuk memahami jalan pikiran kubu sebelah tanpa langsung emosi.' },
  { label: '📱 Nagihnya Doomscrolling', query: 'Kenapa scroll video pendek jam 2 pagi rasanya nagih banget padahal bikin cemas dan capek?' }
];

interface BubulChatProps {
  onClose?: () => void;
}

const BubulMascot: React.FC<{ className?: string }> = ({ className }) => (
  <div className={cn("relative flex items-center justify-center", className)}>
    <div className="absolute inset-0 bg-gradient-to-tr from-blue-400 via-blue-300 to-white rounded-full animate-pulse blur-[2px]" />
    <div className="w-full h-full bg-gradient-to-br from-blue-400/80 to-indigo-500/80 rounded-full border-2 border-white shadow-inner flex items-center justify-center relative overflow-hidden">
      <div className="absolute top-1 left-2 w-1/2 h-1/2 bg-white/30 rounded-full blur-[4px]" />
      <div className="flex gap-2 mb-1">
        <div className="w-3 h-3 bg-[#031466] rounded-full" />
        <div className="w-3 h-3 bg-[#031466] rounded-full" />
      </div>
    </div>
    <div className="absolute bottom-1/4 left-1/4 w-3 h-1.5 bg-pink-300/50 rounded-full blur-[1px]" />
    <div className="absolute bottom-1/4 right-1/4 w-3 h-1.5 bg-pink-300/50 rounded-full blur-[1px]" />
  </div>
);

const BubulChat: React.FC<BubulChatProps> = ({ onClose }) => {
  const { user, chatHistory, setChatHistory } = useStore();
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const isStandalone = !onClose;

  // Auto Scroll ke bawah
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [chatHistory, isTyping]);

  // Pesan Selamat Datang (Greeting) jika kosong
  useEffect(() => {
    if (chatHistory.length === 0) {
      const lastScore = user?.scores?.[user.scores.length - 1]?.score || 0;
      let greeting = "Halo! Aku Bubul si gelembung pintar! Siap mengajakmu membedah fenomena digital dari sudut pandang 360 derajat hari ini? Apa nih isu atau tren di sosmed yang lagi bikin kamu penasaran? 🫧";
      
      if (user?.scores && user.scores.length > 0) {
        greeting = lastScore > 50 
          ? "Skor kepekaan digitalmu kemarin keren banget! Yuk, kita tantang pikiran kita dengan membedah isu sosial yang lebih dinamis hari ini! 🫧" 
          : "Tiap fenomena digital selalu punya dua sisi menarik. Mari kita bedah bareng kenapa ada yang merasa hal itu pas dan kenapa ada yang merasa gak pas! 🫧";
      }
      setChatHistory([{ role: 'bubul', text: greeting }]);
    }
  }, [user, chatHistory.length, setChatHistory]);

  // Algoritma respons lokal super pintar (Smart Local AI Fallback) agar aplikasi 100% fungsional saat di-download atau dipindah ke Vercel
  const getClientFallbackResponse = (userMessage: string): string => {
    const textLower = userMessage.toLowerCase();
    
    if (textLower.includes("filter bubble") || textLower.includes("gelembung") || textLower.includes("linimasa")) {
      return `Seru banget kalau kita bedah **Filter Bubble** dari dua sisi mata uang! Di satu sisi ini bikin nyaman, tapi di sisi lain bisa bikin kita 'buta' suasana.

**Kenapa Banyak Orang Merasa Ini "PAS" & Bermanfaat?**
- **Sangat Efisien & Relevan**: Kita gak perlu buang waktu ngeliat konten yang gak kita sukai. Algoritme menyajikan hobi, musik, dan berita yang pas banget sama selera kita.
- **Rasa Dipahami**: Rasanya seperti punya lini masa impian yang selalu setuju dan sefrekuensi sama kita.

**Tapi, Kenapa Banyak yang Merasa Ini "GAK PAS" & Bermasalah?**
- **Terisolasi dari Realita**: Kita jadi lupa bahwa ada jutaan orang lain yang punya sudut pandang berbeda secara radikal.
- **Gampang Kaget & Syok**: Saat ketemu orang luar di dunia nyata yang beda pendapat, kita cenderung langsung melabeli mereka 'aneh' atau 'salah', padahal linimasa kita saja yang terlalu disaring.

Nah, kalau menurut pengalamanmu sendiri, sejauh mana filter bubble di HP-mu bikin hidup lebih praktis, dan di titik mana dia mulai kerasa 'mengurung'? 🫧`;
    }
    
    if (textLower.includes("fyp") || textLower.includes("ads") || textLower.includes("attention") || textLower.includes("adiktif") || textLower.includes("candu") || textLower.includes("doomscrolling") || textLower.includes("sosmed") || textLower.includes("instagram") || textLower.includes("tiktok")) {
      return `Waduh, isu **FYP dan Doomscrolling** ini emang relate banget sama kehidupan kita sehari-hari! Kenapa ya fenomena ini bisa memicu perdebatan?

**Kenapa Ada yang Menganggap Ini "PAS" / Normal?**
- **Hiburan Murah & Cepat**: Setelah seharian capek sekolah, kuliah, atau kerja, scroll FYP itu hiburan paling gampang buat melepas penat dan cari ide-ide kreatif.
- **Peluang Ekonomi Kreator**: Buat para pembuat konten, algoritme adiktif ini justru berkah karena karya mereka bisa mendadak viral dan menjangkau pembeli dengan presisi tinggi.

**Sisi Lain: Kenapa Banyak yang Merasa "GAK PAS"?**
- **Eksploitasi Waktu & Dopamin**: Desain *infinite scroll* sengaja memanfaatkan celah psikologis otak kita, bikin kita bilang "satu video lagi ah..." sampai gak sadar udah jam 2 pagi.
- **Fokus Menciut**: Daya tahan konsentrasi kita jadi pendek banget karena terbiasa dengan rangsangan visual cepat bertubi-tubi.

Kira-kira, gimana caramu selama ini menyeimbangkan antara menikmati hiburan FYP tanpa merasa 'terjajah' oleh waktu? 🫧`;
    }
    
    if (textLower.includes("echo chamber") || textLower.includes("ruang gema") || textLower.includes("kubu") || textLower.includes("politik") || textLower.includes("berantem") || textLower.includes("debat") || textLower.includes("netizen") || textLower.includes("komentar") || textLower.includes("war")) {
      return `Fenomena **War Komen & Echo Chamber** ini selalu panas buat dibahas! Kenapa sih dua kelompok netizen bisa sama-sama merasa paling benar?

**Kenapa Bagi Kelompok Dalam, Ini Terasa "PAS"?**
- **Rasa Solidaritas & Validasi**: Berkumpul dengan orang-orang yang sependapat memberikan rasa aman, diterima, dan saling menguatkan keyakinan kelompok.
- **Merasa Membela Kebenaran**: Mereka yakin narasi mereka adalah fakta yang harus diperjuangkan demi kebaikan bersama.

**Kenapa Bagi Masyarakat Luas, Ini Terasa "GAK PAS"?**
- **Hilangnya Empati & Dialog**: Karena di dalam 'ruang gema' cuma suara mereka sendiri yang memantul, pendapat orang luar dianggap jahat, bodoh, atau musuh.
- **Memicu Perpecahan Nyata**: Debat di sosmed seringkali terbawa sampai ke kehidupan sehari-hari, bikin hubungan pertemanan atau keluarga jadi renggang.

Pernah gak kamu tiba-tiba sadar kalau akun yang kamu hujat ternyata punya alasan masuk akal dari sudut pandang mereka sendiri? Gimana perasaannya? 🫧`;
    }
    
    if (textLower.includes("bias") || textLower.includes("konfirmasi") || textLower.includes("hoaks") || textLower.includes("percaya") || textLower.includes("fakta")) {
      return `Duh, **Bias Konfirmasi** itu emang refleks alami otak manusia yang unik banget! Mari kita bongkar kenapa ini terjadi:

**Sisi Alami (Kenapa Otak Kita Merasa Ini "PAS"):**
- **Menghemat Energi Otak**: Otak manusia dirancang mencari jalan pintas. Lebih nyaman dan hemat energi kalau kita percaya informasi yang cocok sama apa yang udah kita yakini sebelumnya.
- **Proteksi Diri**: Mengakui kalau kita salah itu secara psikologis rasanya sakit dan gak enak, jadi otak otomatis membela diri.

**Sisi Bahayanya (Kenapa Ini "GAK PAS"):**
- **Gampang Kemakan Hoaks**: Kalau ada berita bohong yang menjelekkan orang yang tidak kita sukai, kita bakal langsung percaya tanpa cek fakta. Sebaliknya, berita benar tentang kebaikan mereka malah kita curigai!
- **Memicu 'Kabut' Realita**: Kita jadi cuma melihat separuh kebenaran yang kita sukai saja.

Gimana trik andalanmu kalau nemu berita yang rasanya 'terlalu pas' sama opinimu? Langsung sebar atau tahan dulu jempolnya? 🫧`;
    }
    
    if (textLower.includes("algoritma") || textLower.includes("cara kerja") || textLower.includes("rekomendasi") || textLower.includes("data") || textLower.includes("tracker") || textLower.includes("privasi")) {
      return `Membahas **Cara Kerja Algoritme** itu ibarat ngeliat cermin digital yang super canggih sekaligus agak misterius!

**Kenapa Pendekatan Algoritme Dipandang "PAS"?**
- **Personal Asisten yang Genius**: Tanpa perlu ngetik panjang, aplikasi udah tahu kita lagi suka resep masakan apa, lagu genre apa, atau barang apa yang mau dibeli.
- **Mendukung UMKM & Komunitas Kecil**: Algoritme membantu konten spesifik menemukan audiens yang tepat di seluruh dunia.

**Kenapa Pendekatan Ini Bikin Banyak Orang Merasa "GAK PAS"?**
- **Privasi Terancam**: Rasanya aneh dan agak nakutkan ketika kita baru omong-omong soal sepatu sama temen, eh 5 menit kemudian iklannya muncul di mana-mana.
- **Komersialisasi Kepribadian**: Kebiasaan dan emosi kita dikemas jadi data untuk dijual ke pengiklan demi keuntungan korporasi.

Menurutmu, apakah pertukaran antara 'kemudahan hidup' dan 'data privasi' ini sepadan? Di mana batas toleransi privasimu? 🫧`;
    }
    
    if (textLower.includes("outbubble") || textLower.includes("fitur") || textLower.includes("menu") || textLower.includes("belajar") || textLower.includes("materi")) {
      return `OutBubble diciptakan buat bantu kamu menembus gelembung informasi dengan cara yang seru dan menyenangkan! 🫧

Di sini kamu bisa mengeksplorasi fenomena media sosial lewat:
- **Perspective Garden (Forum)**: Diskusi opini hangat secara bebas dari berbagai kacamata.
- **Tes & Simulasi**: Jajal kuis interaktif dan simulasi labirin algoritma.
- **Insight Sosial & Refleksi**: Catat jurnal pikiranmu dan pantau tren literasi digital terkini.

Gak usah terburu-buru, nikmati proses belajarnya dengan santai dan kritis! 🫧`;
    }
    
    if (textLower.includes("hi") || textLower.includes("halo") || textLower.includes("hei") || textLower.includes("p ") || textLower.includes("siapa") || textLower.includes("bubul")) {
      return `Halo! Aku Bubul, gelembung asisten virtualmu yang seru, gaul, dan selalu penasaran sama fenomena digital! 🫧

Ada hal menarik atau tren sosmed apa yang lagi kamu amati hari ini? Mau bahas kenapanya, atau mau bedah kenapa netizen pada pro-kontra? Lempar aja pertanyaannya! 🫧`;
    }

    return `Wah, topik yang kamu lempar menarik banget buat dieksplorasi dari berbagai sudut pandang netizen! 🫧

**Jika Dilihat dari Sisi Positifnya ("Kenapa Ada yang Suka/Merasa PAS"):**
- Fenomena digital ini seringkali memberi kemudahan, hiburan instan, serta ruang bagi orang-orang untuk menemukan komunitas yang sefrekuensi tanpa batasan geografis.

**Jika Dilihat dari Sisi Kritisnya ("Kenapa Banyak yang Khawatir/GAK PAS"):**
- Namun, kalau tidak disikapi dengan nalar dingin, hal ini bisa bikin kita terjebak dalam sudut pandang sempit, gampang tersulut emosi, dan kehilangan kemampuan memahami perspektif berbeda.

Menurut pandanganmu sendiri, dari skala 1 sampai 10, seberapa netral linimasa media sosialmu saat ini? Yuk kita bahas lebih jauh! 🫧`;
  };

  const sendQuery = async (userMsg: string) => {
    const newHistory = [...chatHistory, { role: 'user' as const, text: userMsg }];
    setChatHistory(newHistory);
    setIsTyping(true);

    let text = "";
    let fetchedSuccessfully = false;

    // A. LANGKAH 1: Coba hubungi API Gemini langsung lewat client-side jika VITE_GEMINI_API_KEY terkonfigurasi (Vercel/Offline-safe)
    const clientApiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (clientApiKey && clientApiKey !== "MY_GEMINI_API_KEY" && clientApiKey !== "") {
      try {
        console.log("Menghubungi Gemini secara langsung dari client-side...");
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${clientApiKey}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [
              ...newHistory.slice(-8).map(m => ({
                role: m.role === 'bubul' ? 'model' : 'user',
                parts: [{ text: m.text }]
              }))
            ],
            systemInstruction: {
              parts: [{ text: SYSTEM_INSTRUCTION }]
            },
            generationConfig: {
              temperature: 0.7,
            }
          })
        });

        if (response.ok) {
          const data = await response.json();
          if (data.candidates?.[0]?.content?.parts?.[0]?.text) {
            text = data.candidates[0].content.parts[0].text;
            fetchedSuccessfully = true;
            console.log("Respons Gemini direct-client berhasil didapatkan!");
          }
        } else {
          console.warn("Direct-client Gemini fetch gagal. Status:", response.status);
        }
      } catch (err) {
        console.warn("Direct-client Gemini throw error. Mencoba proxy backend...", err);
      }
    }

    // B. LANGKAH 2: Coba hubungi proxy backend Express /api/chat jika direct-client key tidak diset atau gagal
    if (!fetchedSuccessfully) {
      try {
        const recentHistory = newHistory.slice(-10);
        const contents = [
          { role: 'user' as const, parts: [{ text: `SYSTEM INSTRUCTION: ${SYSTEM_INSTRUCTION}` }] },
          ...recentHistory.map(m => ({
            role: m.role === 'bubul' ? 'model' as const : 'user' as const,
            parts: [{ text: m.text }],
          }))
        ];

        const res = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ contents })
        });

        if (res.ok) {
          const data = await res.json();
          if (data.text) {
            text = data.text;
            fetchedSuccessfully = true;
            console.log("Respons via proxy API backend berhasil didapatkan!");
          }
        } else {
          console.warn("Proxy backend chat gagal. Status:", res.status);
        }
      } catch (error) {
        console.warn("Proxy backend server terputus/offline. Mengaktifkan mesin lokal...", error);
      }
    }

    // C. LANGKAH 3: Fallback akhir jika backend 404 / 500 / offline (seperti Vercel murni / download zip)
    if (!fetchedSuccessfully) {
      console.log("Menjalankan Smart Local AI Fallback untuk merespons pertanyaan...");
      text = getClientFallbackResponse(userMsg);
    }

    setChatHistory([...newHistory, { role: 'bubul', text: text }]);
    setIsTyping(false);
  };

  const handleSend = () => {
    if (!input.trim() || isTyping) return;
    const userMsg = input;
    setInput('');
    sendQuery(userMsg);
  };

  const handlePredefined = (text: string) => {
    if (isTyping) return;
    sendQuery(text);
  };

  const handleClearHistory = () => {
    if (window.confirm("Hapus seluruh memori percakapan dengan Bubul? Percakapan baru akan dimulai.")) {
      setChatHistory([]);
    }
  };

  // Render pesan yang diperkuat untuk mendukung heading kustom, bold, dan list yang lebih rapi
  const renderMessage = (text: string) => {
    return text.split('\n').map((line, i) => {
      const trimmedLine = line.trim();
      if (!trimmedLine) return <div key={i} className="h-2" />;

      const isBullet = trimmedLine.startsWith('-');
      // Mengubah **teks** menjadi elemen strong dengan styling khusus agar menonjol secara visual
      const formattedLine = trimmedLine.replace(/\*\*(.*?)\*\*/g, '<strong class="text-[#031466] font-extrabold bg-blue-50/50 px-1 rounded">$1</strong>');
      
      if (isBullet) {
        return (
          <div key={i} className="flex items-start gap-2 ml-2 my-2 text-slate-700 text-xs md:text-sm leading-relaxed">
            <span className="text-blue-500 mt-1.5 shrink-0 text-xs">•</span>
            <span dangerouslySetInnerHTML={{ __html: formattedLine.replace(/^- /, '') }} />
          </div>
        );
      }
      
      return (
        <p key={i} className="mb-2.5 text-slate-700 text-xs md:text-sm font-medium leading-relaxed" dangerouslySetInnerHTML={{ __html: formattedLine }} />
      );
    });
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 30, scale: 0.95 }}
      transition={{ type: "spring", stiffness: 350, damping: 28 }}
      className={cn(
        "w-full flex flex-col bg-white/95 backdrop-blur-2xl rounded-[32px] shadow-[0_25px_80px_-15px_rgba(3,20,102,0.22)] border-2 border-slate-100 relative overflow-hidden transition-all duration-300",
        isStandalone 
          ? "max-w-4xl h-[700px] mx-auto mt-2" 
          : "max-w-[480px] h-[620px]"
      )}
    >
      {/* HEADER */}
      <div className="relative pt-10 pb-4 px-6 bg-gradient-to-b from-blue-50/70 to-transparent flex flex-col items-center border-b border-slate-100/60">
        <motion.div 
          animate={{ y: [-5, 5, -5] }}
          transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
          className="absolute -top-[50px] w-24 h-24 pointer-events-none drop-shadow-2xl"
        >
          <BubulMascot className="w-full h-full" />
        </motion.div>

        {/* Action Buttons in Header */}
        <div className="absolute top-4 right-4 flex items-center gap-1.5 z-10">
          <button 
            onClick={handleClearHistory}
            title="Reset Percakapan"
            disabled={chatHistory.length <= 1 && !isTyping}
            className="p-2 bg-slate-50 hover:bg-slate-100 text-slate-400 hover:text-indigo-600 rounded-full transition-all shadow-sm flex items-center justify-center disabled:opacity-40 disabled:hover:bg-slate-50 disabled:hover:text-slate-400"
          >
            <Trash2 size={16} />
          </button>
          
          {onClose && (
            <button 
              onClick={onClose}
              title="Tutup Chat"
              className="p-2 bg-slate-50 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded-full transition-all shadow-sm flex items-center justify-center"
            >
              <X size={16} strokeWidth={2.5} />
            </button>
          )}
        </div>

        <div className="text-center mt-12">
          <h2 className="text-lg font-black text-[#031466] flex items-center justify-center gap-1.5 tracking-tight">
            Bubul Labirin AI <Sparkles size={15} className="text-yellow-500 fill-yellow-400 animate-pulse animate-duration-1000" />
          </h2>
          <div className="flex items-center justify-center gap-2 mt-1">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-ping shrink-0" />
            <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Koneksi Gemini Aktif</span>
            <span className="text-slate-300">|</span>
            <span className="text-[10px] text-[#031466] font-bold">Memori Aktif ({chatHistory.length} chat)</span>
          </div>
        </div>
      </div>

      {/* AREA PESAN */}
      <div ref={scrollRef} className="flex-1 p-5 overflow-y-auto space-y-4 custom-scrollbar bg-[#f8faff]/50">
        {chatHistory.map((msg, i) => (
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            key={i} 
            className={cn("flex items-end gap-2.5", msg.role === 'user' ? "flex-row-reverse" : "flex-row")}
          >
            {msg.role === 'bubul' ? (
              <BubulMascot className="w-7 h-7 rounded-full shrink-0 shadow-sm" />
            ) : (
              <div className="w-7 h-7 rounded-full bg-[#031466] text-white flex items-center justify-center shrink-0 shadow-sm">
                <User size={12} />
              </div>
            )}

            <div className={cn(
              "max-w-[85%] px-4.5 py-3 shadow-sm transition-all text-xs md:text-sm overflow-hidden", 
              msg.role === 'bubul' 
                ? "bg-white text-slate-800 rounded-[22px] rounded-bl-[6px] border border-slate-100" 
                : "bg-gradient-to-br from-blue-600 to-indigo-750 text-white rounded-[22px] rounded-br-[6px] font-medium"
            )}>
              {msg.role === 'bubul' ? renderMessage(msg.text) : msg.text}
            </div>
          </motion.div>
        ))}
        
        {/* LOADING INDICATOR */}
        <AnimatePresence>
          {isTyping && (
            <motion.div 
              initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9 }}
              className="flex items-center gap-3"
            >
               <BubulMascot className="w-7 h-7 opacity-60 animate-bounce" />
               <div className="px-4 py-2 bg-white rounded-full border border-blue-50/60 flex items-center gap-2 shadow-sm">
                  <RefreshCw size={11} className="animate-spin text-[#031466]" />
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest animate-pulse">Bubul sedang menganalisis...</span>
               </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* TOPIC SUGGESTION CHIPS */}
      <div className="px-5 py-2.5 bg-slate-50 border-t border-slate-100/80">
        <div className="flex items-center gap-1 mb-2">
          <HelpCircle size={12} className="text-[#031466]" />
          <p className="text-[9px] font-black uppercase text-slate-400 tracking-wider">
            Saran Topik Literasi
          </p>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1.5 no-scrollbar scroll-smooth">
          {SUGGESTED_TOPICS.map((topic, i) => (
            <button
              key={i}
              onClick={() => handlePredefined(topic.query)}
              disabled={isTyping}
              className="px-3 py-1.5 bg-white hover:bg-slate-100 border border-slate-200/60 hover:border-[#031466]/40 text-[11px] text-[#031466] font-bold rounded-full shadow-sm whitespace-nowrap transition-all duration-200 active:scale-95 disabled:opacity-50 shrink-0"
            >
              {topic.label}
            </button>
          ))}
        </div>
      </div>

      {/* INPUT AREA */}
      <div className="p-4 bg-white border-t border-slate-100 rounded-b-[32px]">
        <div className="relative flex items-center bg-slate-50/70 border border-slate-200/80 focus-within:border-[#031466] focus-within:bg-white focus-within:shadow-md focus-within:shadow-[#031466]/5 rounded-full transition-all p-1.5">
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            disabled={isTyping}
            placeholder="Tanyakan atau tempel studi kasus media sosial..."
            className="w-full pl-4 pr-12 py-2.5 bg-transparent outline-none text-xs md:text-sm font-semibold text-[#031466] placeholder:text-slate-400 placeholder:font-medium disabled:opacity-50"
          />
          <button 
            onClick={handleSend}
            disabled={!input.trim() || isTyping}
            className="absolute right-2 w-9 h-9 bg-gradient-to-br from-[#031466] to-indigo-600 disabled:from-slate-200 disabled:to-slate-300 disabled:text-slate-400 text-white rounded-full flex items-center justify-center shadow-md active:scale-95 transition-all shrink-0"
          >
            <Send size={14} className="-ml-0.5" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default BubulChat;
