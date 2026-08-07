import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Compass, Newspaper, X, Play, ExternalLink, Clock, User, Sparkles, Eye, EyeOff } from 'lucide-react';
import { cn } from '../lib/utils';

// --- INTERFACE DEFINITION ---
interface ContentItem {
  id: number;
  title: string;
  category: string;
  image: string;
  description: string;
  author: string;
  readTime: string;
  videoUrl: string;
}

// --- DATA SOURCE ---
const EXPLORE_DATA: ContentItem[] = [
  {
    id: 1,
    title: "Bedah Fenomena & Opini Populer Netizen",
    category: "Sosial",
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80",
    description: "Gerald Vincent membahas fenomena sosial dan tren opini di kalangan netizen Indonesia. Analisis kritis seputar fakta, persepsi publik, dan bagaimana algoritme membentuk cara pandang kita.",
    author: "Gerald Vincent",
    readTime: "3 min watch",
    videoUrl: "https://www.tiktok.com/@geraldvincentt/video/7606952858151390484?is_from_webapp=1&sender_device=pc&web_id=7641373216339215873"
  },
  {
    id: 2,
    title: "Sorotan Berita & Isu Hangat Kumparan",
    category: "Politik",
    image: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=800&q=80",
    description: "Kumparan menyajikan rangkuman peristiwa penting dan dinamika kebijakan masyarakat. Membedah narasi berita utama dari sudut pandang objektif dan berimbang.",
    author: "Kumparan",
    readTime: "2 min watch",
    videoUrl: "https://www.tiktok.com/@kumparan/video/7648514320501984519?is_from_webapp=1&sender_device=pc&web_id=7641373216339215873"
  },
  {
    id: 3,
    title: "Dinamika Kehidupan & Perspektif Missel",
    category: "Edukasi",
    image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80",
    description: "Missel membagikan perspektif menarik seputar pengalaman sosial, relasi antar-individu, dan refleksi gaya hidup generasi muda di era serba digital.",
    author: "Missel Real",
    readTime: "3 min watch",
    videoUrl: "https://www.tiktok.com/@missel.real/video/7519847343512915207?is_from_webapp=1&sender_device=pc&web_id=7641373216339215873"
  },
  {
    id: 4,
    title: "Analisis Ekonomi & Strategi Finansial",
    category: "Ekonomi",
    image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=800&q=80",
    description: "Raymond Chin mengupas tuntas realita ekonomi, bisnis, serta peluang finansial anak muda. Pahami logika di balik keputusan bisnis dan arus keuangan masa depan.",
    author: "Raymond Chin",
    readTime: "4 min watch",
    videoUrl: "https://www.tiktok.com/@raymondchins/video/7628165590825422098?is_from_webapp=1&sender_device=pc&web_id=7641373216339215873"
  },
  {
    id: 5,
    title: "Literasi, Beasiswa & Inspirasi Muda",
    category: "Edukasi",
    image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80",
    description: "Indah Shafira memberikan kiat inspiratif seputar pendidikan, karir global, dan pengembangan diri bagi anak muda Indonesia untuk terus berdaya saing.",
    author: "Indah Shafira",
    readTime: "3 min watch",
    videoUrl: "https://www.tiktok.com/@indahshafira29/video/7655467191873047821?is_from_webapp=1&sender_device=pc&web_id=7641373216339215873"
  },
  {
    id: 6,
    title: "Bedah Tuntas Proyek IKN: Perspektif Netral",
    category: "Sosial",
    image: "https://images.unsplash.com/photo-1596402184320-417e7178b2cd?auto=format&fit=crop&w=800&q=80",
    description: "Jerhemy Nemo mengajak kita melihat lebih dekat perkembangan IKN di Kalimantan. Analisis mendalam mengenai infrastruktur, visi masa depan Indonesia, dan dampaknya pada tatanan sosial.",
    author: "Jerhemy Nemo",
    readTime: "3 min watch",
    videoUrl: "https://www.tiktok.com/@jerhemynemoo/video/7299451337161346309"
  },
  {
    id: 7,
    title: "Kontroversi Makan Bergizi Gratis (MBG)",
    category: "Politik",
    image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80",
    description: "Membahas pro dan kontra program Makan Bergizi Gratis dari sisi anggaran serta efektivitas implementasi distribusi pangan di sekolah-sekolah dasar seluruh Indonesia.",
    author: "Akurat.co",
    readTime: "2 min watch",
    videoUrl: "https://www.tiktok.com/@akuratco/video/7631521627607420178"
  },
  {
    id: 8,
    title: "Dilema Kenaikan Harga BBM",
    category: "Ekonomi",
    image: "https://images.unsplash.com/photo-1527018601619-a508a2be00cd?auto=format&fit=crop&w=800&q=80",
    description: "Pahami mekanisme penetapan harga pasar global dan bagaimana fluktuasi ini berdampak langsung pada daya beli masyarakat Indonesia, subsidi energi, serta tantangan ekonomi.",
    author: "Triasambari",
    readTime: "4 min watch",
    videoUrl: "https://www.tiktok.com/@triasambari/video/7623651630403030290"
  },
  {
    id: 9,
    title: "Demo Penutupan Jurusan Kampus",
    category: "Edukasi",
    image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=800&q=80",
    description: "Aksi protes mahasiswa terkait kebijakan penutupan beberapa jurusan di universitas yang dianggap kurang relevan dengan industri 4.0. Apa alasan di baliknya?",
    author: "BBC Indonesia",
    readTime: "5 min watch",
    videoUrl: "https://www.tiktok.com/@bbcnewsindonesia/video/7634815457232489748"
  },
  {
    id: 10,
    title: "Nasib Driver: Tarif Gojek Turun",
    category: "Ekonomi",
    image: "https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=800&q=80",
    description: "Analisis penurunan tarif ojek online. Bagaimana nasib para pengemudi di tengah persaingan platform yang ketat? Tinjauan mengenai kesejahteraan ekonomi mitra driver.",
    author: "Dunia Neo",
    readTime: "3 min watch",
    videoUrl: "https://www.tiktok.com/@dunia.neo/video/7635179578545196309"
  }
];

const Explore: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Semua');
  const [selectedVideo, setSelectedVideo] = useState<ContentItem | null>(null);
  
  // State untuk mengontrol visibilitas teks di atas video TikTok
  const [showTextOverlay, setShowTextOverlay] = useState(true);

  const categories = ['Semua', 'Sosial', 'Ekonomi', 'Politik', 'Edukasi'];

  const filteredData = EXPLORE_DATA.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.author.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'Semua' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getEmbedUrl = (url: string) => {
    const videoIdMatch = url.match(/\/video\/(\d+)/);
    const videoId = videoIdMatch ? videoIdMatch[1] : '';
    return `https://www.tiktok.com/embed/v2/${videoId}?autoplay=1`;
  };

  // Reset overlay saat ganti video
  useEffect(() => {
    if (selectedVideo) {
      setShowTextOverlay(true);
    }
  }, [selectedVideo]);

  return (
    <div className="max-w-7xl mx-auto min-h-screen pb-24 px-4 sm:px-6 lg:px-8 font-sans">
      
      {/* 1. HERO SECTION */}
      <div className="py-10 md:py-20 space-y-6 md:space-y-10">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-100/50 text-blue-700 rounded-full text-[10px] md:text-xs font-black uppercase tracking-[0.2em] border border-blue-200">
            <Compass size={14} /> Explore Content
          </div>
          <h1 className="text-4xl sm:text-6xl md:text-8xl font-black text-[#031466] tracking-tight leading-[1] md:leading-[0.95]">
            Perluas <span className="text-blue-500 italic">Cakrawala</span> <br className="hidden md:block" /> Digitalmu.
          </h1>
          <p className="text-base md:text-2xl text-[#031466]/60 font-medium max-w-2xl mx-auto italic px-4 leading-relaxed">
            "Analisis kritis terhadap isu-isu terkini untuk membangun daya pikir yang tajam."
          </p>
        </motion.div>

        {/* 2. SEARCH & FILTER */}
        <div className="flex flex-col lg:flex-row gap-4 items-center justify-between bg-white/80 backdrop-blur-md p-4 rounded-[30px] md:rounded-[40px] shadow-2xl border border-white relative z-20">
          <div className="relative w-full lg:flex-1">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input 
              type="text" 
              placeholder="Cari creator/topik (Gerald Vincent, Kumparan, Raymond Chin...)"
              className="w-full pl-16 pr-6 py-4 md:py-5 outline-none font-bold text-[#031466] placeholder:text-slate-300 text-sm md:text-lg bg-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2 overflow-x-auto w-full lg:w-auto scrollbar-hide px-2 pb-2 lg:pb-0 items-center border-t lg:border-t-0 pt-4 lg:pt-0">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={cn(
                  "px-6 py-3.5 rounded-2xl text-[10px] md:text-xs font-black transition-all whitespace-nowrap uppercase tracking-widest",
                  selectedCategory === cat ? "bg-[#031466] text-white shadow-xl scale-105" : "bg-slate-100 text-slate-400 hover:bg-slate-200"
                )}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 3. CONTENT GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
        <AnimatePresence mode='popLayout'>
          {filteredData.map((item, index) => (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ delay: index * 0.05, type: "spring", stiffness: 100 }}
              onClick={() => setSelectedVideo(item)}
              className="group bg-white rounded-[45px] overflow-hidden shadow-xl hover:shadow-[0_30px_60px_-15px_rgba(3,20,102,0.3)] transition-all duration-500 border border-slate-100 cursor-pointer flex flex-col"
            >
              <div className="relative aspect-[4/5] sm:aspect-[3/4] lg:aspect-[4/5] overflow-hidden">
                <img 
                  src={item.image} 
                  alt={item.title} 
                  referrerPolicy="no-referrer" 
                  onError={(e) => {
                    e.currentTarget.src = "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80";
                  }}
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#031466] via-[#031466]/20 to-transparent opacity-90" />
                <div className="absolute bottom-6 left-6 right-6 text-white z-10">
                   <span className="bg-blue-500/90 backdrop-blur-md px-4 py-1.5 rounded-xl text-[9px] md:text-[10px] font-black uppercase mb-3 inline-flex items-center gap-2 shadow-lg">
                    <Sparkles size={12} /> {item.category}
                  </span>
                  <h3 className="text-xl md:text-2xl font-black leading-tight mb-3 line-clamp-2 drop-shadow-md">
                    {item.title}
                  </h3>
                  <div className="flex items-center gap-4 text-[10px] md:text-xs font-bold opacity-90 border-t border-white/20 pt-3">
                    <span className="flex items-center gap-1.5 text-blue-300"><User size={12} /> {item.author}</span>
                    <span className="flex items-center gap-1.5 text-blue-300"><Clock size={12} /> {item.readTime}</span>
                  </div>
                </div>
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 bg-[#031466]/40 backdrop-blur-[4px]">
                  <motion.div whileHover={{ scale: 1.2 }} className="w-20 h-20 bg-white rounded-full flex items-center justify-center text-[#031466] shadow-2xl border-4 border-white/50">
                    <Play fill="currentColor" size={32} className="ml-1.5" />
                  </motion.div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* 4. VIDEO MODAL PLAYER - FULL SCREEN TIKTOK DENGAN CAPTION BISA DI-CLOSE */}
      <AnimatePresence>
        {selectedVideo && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-0 md:p-8 lg:p-12 overflow-hidden bg-black/90 backdrop-blur-sm">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-sm sm:max-w-md md:max-w-lg h-full sm:h-[90vh] bg-black sm:rounded-[40px] overflow-hidden shadow-2xl border border-white/10 mx-auto"
            >
              
              {/* HEADER MODAL PLAYER */}
              <div className="absolute top-4 left-4 z-[120] flex items-center gap-2 bg-black/60 backdrop-blur-md px-3.5 py-2 rounded-full border border-white/20 text-white text-xs font-bold shadow-2xl">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
                <span className="text-[11px] font-black uppercase tracking-wider">{selectedVideo.author}</span>
                <a 
                  href={selectedVideo.videoUrl} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="ml-1 bg-blue-600 hover:bg-blue-500 text-white text-[10px] font-black px-3 py-1 rounded-full flex items-center gap-1 transition-all shadow-md"
                >
                  Buka TikTok <ExternalLink size={10} />
                </a>
              </div>

              {/* TOMBOL CLOSE MODAL UTAMA */}
              <button 
                onClick={() => setSelectedVideo(null)}
                className="absolute top-4 right-4 z-[120] bg-black/60 hover:bg-red-500 backdrop-blur-md p-2.5 rounded-full text-white shadow-2xl transition-colors border border-white/20"
              >
                <X size={24} />
              </button>

              {/* AREA VIDEO (FULL SCREEN) */}
              <div className="absolute inset-0 w-full h-full bg-black z-0">
                <iframe 
                  src={getEmbedUrl(selectedVideo.videoUrl)}
                  className="w-full h-full border-none"
                  allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
                  allowFullScreen
                  referrerPolicy="no-referrer"
                ></iframe>
              </div>

              {/* OVERLAY TEKS (GAYA TIKTOK) BISA DITUTUP/DIBUKA */}
              <div className="absolute bottom-0 left-0 right-0 z-10 pointer-events-none flex flex-col justify-end h-full">
                <AnimatePresence>
                  {showTextOverlay && (
                    <motion.div 
                      initial={{ opacity: 0, y: 50 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 50 }}
                      className="w-full p-4 sm:p-6 bg-gradient-to-t from-black/90 via-black/40 to-transparent pointer-events-auto flex flex-col gap-2"
                    >
                      {/* Badge Kategori */}
                      <div className="mb-1">
                        <span className="bg-blue-600/90 text-white px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest shadow-md">
                          {selectedVideo.category}
                        </span>
                      </div>
                      
                      {/* Author */}
                      <div className="flex items-center gap-2 mb-1">
                        <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white text-sm font-black border border-white/30">
                          {selectedVideo.author[0]}
                        </div>
                        <p className="text-sm font-bold text-white shadow-black drop-shadow-md">
                          @{selectedVideo.author.replace(/\s+/g, '').toLowerCase()}
                        </p>
                      </div>

                      {/* Judul & Deskripsi (Ukuran Kecil) */}
                      <div className="pr-14"> {/* Pr-14 agar tidak nabrak tombol di kanan */}
                        <h2 className="text-base sm:text-lg font-bold text-white leading-snug drop-shadow-md mb-1">
                          {selectedVideo.title}
                        </h2>
                        <p className="text-xs sm:text-sm text-gray-200 line-clamp-3 leading-relaxed drop-shadow-md">
                          {selectedVideo.description}
                        </p>
                        <div className="flex items-center gap-2 mt-2 opacity-80 text-white text-xs">
                          <Clock size={12} /> <span>{selectedVideo.readTime}</span>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* TOMBOL AKSI MELAYANG DI KANAN BAWAH */}
                <div className="absolute bottom-6 right-4 flex flex-col gap-4 pointer-events-auto z-20">
                  {/* Tombol Sembunyikan/Tampilkan Teks */}
                  <button 
                    onClick={() => setShowTextOverlay(!showTextOverlay)}
                    className="w-12 h-12 bg-black/40 backdrop-blur-md rounded-full flex flex-col items-center justify-center text-white border border-white/20 hover:bg-black/60 transition-colors shadow-lg group"
                    title={showTextOverlay ? "Sembunyikan Teks" : "Tampilkan Teks"}
                  >
                    {showTextOverlay ? <EyeOff size={20} /> : <Eye size={20} />}
                    <span className="text-[8px] font-bold mt-0.5">{showTextOverlay ? "Hide" : "Show"}</span>
                  </button>

                  {/* Tombol Buka di Aplikasi TikTok Asli */}
                  <a 
                    href={selectedVideo.videoUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-12 h-12 bg-blue-600/90 backdrop-blur-md rounded-full flex flex-col items-center justify-center text-white border border-white/20 hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/30"
                    title="Buka di TikTok"
                  >
                    <ExternalLink size={18} />
                    <span className="text-[8px] font-bold mt-0.5">TikTok</span>
                  </a>
                </div>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 5. NEWSLETTER SECTION */}
      <div className="mt-16 md:mt-24 bg-[#031466] rounded-[40px] md:rounded-[70px] p-10 md:p-20 text-white relative overflow-hidden shadow-2xl text-center md:text-left border-b-[15px] border-blue-500/30">
        <div className="absolute top-[-30px] right-[-30px] w-56 h-56 md:w-96 md:h-96 bg-blue-400/20 rounded-full blur-[100px] animate-pulse" />
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8 md:gap-12">
          <div className="space-y-4 md:space-y-6 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-5 py-2 bg-white/10 rounded-full text-[10px] font-black uppercase tracking-[0.25em] mx-auto md:mx-0 border border-white/20">
              <Newspaper size={16} /> Digital Literacy Hub
            </div>
            <h2 className="text-3xl sm:text-5xl md:text-7xl font-black leading-[1] tracking-tighter">Terus Update dengan <br /> Isu Terkini.</h2>
            <p className="text-sm sm:text-lg md:text-2xl text-blue-200 font-medium px-4 md:px-0 opacity-80 leading-relaxed">
              Membangun komunitas digital yang cerdas dan kritis bersama <span className="text-white font-black underline underline-offset-4 decoration-blue-400">OutBubble</span> untuk masa depan informasi Indonesia yang lebih sehat.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
};

export default Explore;