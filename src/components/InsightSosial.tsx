import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ExternalLink, Bookmark, Share2, FileText, Newspaper, Clapperboard, 
  ChevronRight, Play, X, Eye, EyeOff, Clock, User, Sparkles, 
  UploadCloud, Link as LinkIcon, Send, Image as ImageIcon, Video, FileCheck,
  CheckCircle2, Loader2, AlertCircle, Mail
} from 'lucide-react';
import { cn } from '../lib/utils';
import { useStore } from '../lib/store';

import jurnalBannerImg from '../assets/images/jurnal_banner_1780059610529.png';
import beritaBannerImg from '../assets/images/berita_banner_1780059627337.png';
import tiktokBannerImg from '../assets/images/tiktok_banner_1780059643772.png';

// Fallback high-quality images for production robustness
const INSIGHT_FALLBACK_IMAGES: Record<string, string> = {
  [jurnalBannerImg]: "/images/jurnal_banner_1780059610529.png",
  [beritaBannerImg]: "/images/berita_banner_1780059627337.png",
  [tiktokBannerImg]: "/images/tiktok_banner_1780059643772.png",
};

// --- INTERFACE DEFINITION ---
interface ContentItem {
  id: string;
  title: string;
  source: string;
  image: string;
  desc: string;
  link: string;
}

// --- DATA SOURCE LENGKAP ---
const CONTENT_DATA: Record<string, ContentItem[]> = {
  jurnal: [
    { id: 'j1', title: 'Echo Chambers on Social Media: A Systematic Review', source: 'Review of Communication Research', image: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&w=800&q=80', desc: 'Tinjauan komprehensif (2021) tentang keberadaan echo chamber lintas platform.', link: 'https://doi.org/10.12840/ISSN.2255-4165.028' },
    { id: 'j2', title: 'Through the Newsfeed Glass: Rethinking Filter Bubbles', source: 'PubMed Central', image: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=800&q=80', desc: 'Membahas bagaimana komunitas terisolasi mengancam kapasitas debat demokratis.', link: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC8923337/' },
    { id: 'j3', title: 'A Systematic Review of Echo Chamber Research (2025)', source: 'Springer', image: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=800&q=80', desc: 'Mensintesis 129 penelitian tentang bias regional, politik, dan budaya.', link: 'https://link.springer.com/article/10.1007/s42001-025-00381-z' },
    { id: 'j4', title: 'Trap of Social Media Algorithms: Impact on Youth', source: 'MDPI Social Sciences', image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=800&q=80', desc: 'Analisis 30 studi (2015–2025) tentang penguatan identitas kaum muda.', link: 'https://www.mdpi.com/2075-4698/15/11/301' },
    { id: 'j5', title: 'Social Media-Induced Polarisation', source: 'Wiley Online Library', image: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=800&q=80', desc: 'Fragmentasi sosio-kultural yang diperburuk oleh kurasi algoritmik platform.', link: 'https://onlinelibrary.wiley.com/doi/full/10.1111/isj.12525' },
    { id: 'j6', title: 'Fragmentation in the Platformized Public Sphere', source: 'OJCMT', image: 'https://images.unsplash.com/photo-1557200134-90327ee9fafa?auto=format&fit=crop&w=800&q=80', desc: 'Menyoroti peran unik platform non-algoritmik seperti WhatsApp.', link: 'https://www.ojcmt.net/download/social-media-fragmentation-and-polarization-in-the-platformized-public-sphere-making-the-case-for-18142.pdf' },
    { id: 'j7', title: 'Shifts in U.S. Social Media Use (2020–2024)', source: 'arXiv', image: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=800&q=80', desc: 'Data ANES tentang menyusutnya ruang publik online yang inklusif.', link: 'https://arxiv.org/abs/2510.25417' },
    { id: 'j8', title: 'Echo Chambers & Polarisation: Literature Review', source: 'Reuters Institute', image: 'https://images.unsplash.com/photo-1495020689067-958852a7765e?auto=format&fit=crop&w=800&q=80', desc: 'Mengevaluasi bukti empiris ukuran echo chamber di berbagai negara.', link: 'https://reutersinstitute.politics.ox.ac.uk/echo-chambers-filter-bubbles-and-polarisation-literature-review' },
    { id: 'j9', title: 'The Chat-Chamber Effect: AI Hallucination', source: 'SAGE Journals', image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=800&q=80', desc: 'Potensi LLM memicu efek media baru di persimpangan filter bubble.', link: 'https://journals.sagepub.com/doi/10.1177/20539517241306345' }
  ],
  berita: [
    { id: 'b1', title: 'Echo Chamber: Alasan Sulit Lepas dari Hoaks', source: 'Kompas.com', image: 'https://images.unsplash.com/photo-1588681664899-f142ff2dc9b1?auto=format&fit=crop&w=800&q=80', desc: 'Algoritma tidak peduli benar/salah, hanya peduli minat pengguna.', link: 'https://www.kompas.com/cekfakta/read/2022/01/08/073100182/echo-chamber-dan-filter-bubble-alasan-sulit-lepas-dari-jeratan-hoaks' },
    { id: 'b2', title: 'Filter Bubble & Ruang Digital Keluarga', source: 'Kompas.com', image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=800&q=80', desc: 'Bagaimana gelembung informasi memengaruhi kepedulian sosial.', link: 'https://www.kompas.com/tren/read/2022/11/04/135403465/filter-bubble-echo-chamber-dan-ruang-digital-sehat-keluarga' },
    { id: 'b3', title: 'Bahaya Echo Chamber di Pilpres 2024', source: 'Riau Pos', image: 'https://images.unsplash.com/photo-1540910419892-4a36d2c3266c?auto=format&fit=crop&w=800&q=80', desc: 'Informasi mentah yang memperkuat polarisasi masyarakat.', link: 'https://riaupos.co/opini/15/01/2024/178225/bahaya-filter-bubble-dan-echo-chamber-di-media-sosial/' },
    { id: 'b4', title: 'Hindari Karakter "Merasa Benar Sendiri"', source: 'Warta Ekonomi', image: 'https://images.unsplash.com/photo-1551836022-424c89e90c75?auto=format&fit=crop&w=800&q=80', desc: 'Efek suara sependapat yang mengelilingi kita di media sosial.', link: 'https://wartaekonomi.co.id/read535849/hindari-echo-chamber-dan-filter-bubble-di-media-sosial' },
    { id: 'b5', title: 'Seberapa Bahaya Algoritma Mengurung Kita?', source: 'GNFI', image: 'https://images.unsplash.com/photo-1493612276216-ee3925520721?auto=format&fit=crop&w=800&q=80', desc: 'Dampak literasi digital dan risiko radikalisasi pada anak.', link: 'https://www.goodnewsfromindonesia.id/2024/11/28/mengenal-filter-bubble-seberapa-bahaya-algoritma-media-sosial-mengurung-kita' },
    { id: 'b6', title: 'Echo Chamber: Cara Kerja & Dampaknya', source: 'Digital Citizenship ID', image: 'https://images.unsplash.com/photo-1516321497487-e288fb19713f?auto=format&fit=crop&w=800&q=80', desc: 'Distorsi kebenaran hingga penurunan literasi digital.', link: 'https://digitalcitizenship.id/pengetahuan-dasar/echo-chamber-filter-bubble' },
    { id: 'b7', title: 'Algoritma Penarik Opini & Demokrasi', source: 'Kumparan', image: 'https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?auto=format&fit=crop&w=800&q=80', desc: 'Kesehatan demokrasi membutuhkan pertukaran pikiran terbuka.', link: 'https://kumparan.com/wulan-dariii/algoritma-penarik-opini-bagaimana-filter-bubble-merusak-demokrasi-27BCOSmfxlM' },
    { id: 'b8', title: 'Breaking Echo Chamber using Regulation', source: 'Nature', image: 'https://images.unsplash.com/photo-1507925921958-8a62f3d1a50d?auto=format&fit=crop&w=800&q=80', desc: 'Analisis matematis apakah regulasi bisa memecah gelembung informasi.', link: 'https://www.nature.com/articles/s41598-023-50850-6' },
    { id: 'b9', title: 'Mapping the New Social Landscape 2026', source: 'Pulsar Platform', image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=800&q=80', desc: 'Lanskap media sosial yang semakin terfragmentasi berbasis identitas.', link: 'https://www.pulsarplatform.com/blog/2026/the-great-fragmentation-mapping-the-new-social-landscape-2026' },
    { id: 'b10', title: 'Ideological Fragmentation: Echo Platforms', source: 'arXiv', image: 'https://images.unsplash.com/photo-1614850523296-d8c1af93d400?auto=format&fit=crop&w=800&q=80', desc: 'Menganalisis 126 juta URL sebagai ceruk ideologis homogen.', link: 'https://arxiv.org/pdf/2411.16826' },
    { id: 'b11', title: 'Reuters: Literature Review on Polarisation', source: 'Reuters', image: 'https://images.unsplash.com/photo-1524273532652-320d3663a89e?auto=format&fit=crop&w=800&q=80', desc: 'Evaluasi bukti empiris mengenai echo chamber lintas negara.', link: 'https://reutersinstitute.politics.ox.ac.uk/echo-chambers-filter-bubbles-and-polarisation-literature-review' }
  ],
  tiktok: [
    { id: 't-gerald', title: 'Bedah Fenomena & Opini Populer Netizen', source: '@geraldvincentt', image: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?auto=format&fit=crop&w=800&q=80', desc: 'Analisis kritis seputar fakta, persepsi publik, dan fenomena sosial.', link: 'https://www.tiktok.com/@geraldvincentt/video/7606952858151390484?is_from_webapp=1&sender_device=pc&web_id=7641373216339215873' },
    { id: 't-kumparan', title: 'Sorotan Berita & Isu Hangat Kumparan', source: '@kumparan', image: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=800&q=80', desc: 'Rangkuman peristiwa penting dan dinamika kebijakan masyarakat.', link: 'https://www.tiktok.com/@kumparan/video/7648514320501984519?is_from_webapp=1&sender_device=pc&web_id=7641373216339215873' },
    { id: 't-missel', title: 'Dinamika Kehidupan & Perspektif Missel', source: '@missel.real', image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=800&q=80', desc: 'Perspektif menarik seputar relasi sosial dan gaya hidup digital.', link: 'https://www.tiktok.com/@missel.real/video/7519847343512915207?is_from_webapp=1&sender_device=pc&web_id=7641373216339215873' },
    { id: 't-raymond', title: 'Analisis Ekonomi & Strategi Finansial', source: '@raymondchins', image: 'https://images.unsplash.com/photo-1527018601619-a508a2be00cd?auto=format&fit=crop&w=800&q=80', desc: 'Realita ekonomi, bisnis, serta peluang finansial anak muda.', link: 'https://www.tiktok.com/@raymondchins/video/7628165590825422098?is_from_webapp=1&sender_device=pc&web_id=7641373216339215873' },
    { id: 't-indah', title: 'Literasi, Beasiswa & Inspirasi Muda', source: '@indahshafira29', image: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=800&q=80', desc: 'Kiat inspiratif seputar pendidikan dan karir global.', link: 'https://www.tiktok.com/@indahshafira29/video/7655467191873047821?is_from_webapp=1&sender_device=pc&web_id=7641373216339215873' },
    { id: 't1', title: 'Literasi Digital BSSN', source: '@bssnri', image: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?auto=format&fit=crop&w=800&q=80', desc: 'Keamanan siber dan filter bubble di Indonesia.', link: 'https://www.tiktok.com/@bssnri/video/7221458910765534490' },
    { id: 't2', title: 'Thinking Powers: Algorithm', source: '@thinkingpowers', image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=800&q=80', desc: 'Bagaimana cara kerja algoritma memengaruhi pikiran.', link: 'https://www.tiktok.com/@thinkingpowers/video/7349210914589101355' },
    { id: 't3', title: 'Tiziana: Social Media Bubbles', source: '@tiiiziana', image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80', desc: 'Edukasi singkat seputar ruang gema digital.', link: 'https://www.tiktok.com/@tiiiziana/video/7521275540121095446' },
  ]
};

const TAB_INFOS: Record<string, { banner: string; text: string; action: string; badge: string; color: string }> = {
  jurnal: {
    banner: jurnalBannerImg,
    badge: "Metodologi Ilmiah",
    color: "from-purple-500/10 to-indigo-500/5 border-purple-200 text-purple-700",
    text: "Kumpulan karya ilmiah & literatur akademik tepercaya dari peneliti global yang membuktikan efek sistematis algoritma media sosial, gelembung informasi (filter bubble), dan polarisasi opini publik secara empiris.",
    action: "Gunakan data ilmiah ini sebagai dasar akademis logis untuk meruntuhkan bias batin."
  },
  berita: {
    banner: beritaBannerImg,
    badge: "Liputan Jurnalistik",
    color: "from-blue-500/10 to-cyan-500/5 border-blue-200 text-blue-700",
    text: "Ulasan pers nasional dan liputan jurnalistik terkemuka mengenai dinamika sosial nyata, ancaman polarisasi pemilu, penyebaran hoaks, serta gerakan masyarakat sipil Indonesia melawan isolasi informasi.",
    action: "Amati bagaimana teori ruang gema terwujud dalam perdebatan dan diskursus sosial sehari-hari."
  },
  tiktok: {
    banner: tiktokBannerImg,
    badge: "Edukasi Visual Cepat",
    color: "from-pink-500/10 to-rose-500/5 border-pink-200 text-pink-700",
    text: "Video edukasi interaktif pilihan dari kreator konten cerdas dan instansi resmi yang membongkar trik psikologis algoritma, perangkap dopamin, serta tips lincah ber-literasi digital di media sosial.",
    action: "Tonton video edukasi kilat berdurasi pendek untuk mendapatkan ringkasan praktis instan."
  }
};

const InsightSosial: React.FC = () => {
  const { user, toggleBookmark } = useStore();
  const [activeTab, setActiveTab] = useState<'jurnal' | 'berita' | 'tiktok'>('jurnal');
  
  // State untuk TikTok Fullscreen Modal
  const [selectedTiktokVideo, setSelectedTiktokVideo] = useState<ContentItem | null>(null);
  const [showTextOverlay, setShowTextOverlay] = useState(true);

  // State untuk Submit Content Modal
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [submitType, setSubmitType] = useState<'link' | 'file'>('link');
  const [submitInputUrl, setSubmitInputUrl] = useState('');
  const [submitDesc, setSubmitDesc] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState('');
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'loading' | 'success'>('idle');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const tabs = [
    { id: 'jurnal', label: 'Jurnal Penelitian', icon: FileText, color: 'text-purple-600', bg: 'bg-purple-100' },
    { id: 'berita', label: 'Berita & Opini', icon: Newspaper, color: 'text-blue-600', bg: 'bg-blue-100' },
    { id: 'tiktok', label: 'Edukasi TikTok', icon: Clapperboard, color: 'text-pink-600', bg: 'bg-pink-100' },
  ];

  // Helper untuk mendapatkan Embed ID TikTok (Autoplay)
  const getEmbedUrl = (url: string) => {
    const videoIdMatch = url.match(/\/video\/(\d+)/);
    const videoId = videoIdMatch ? videoIdMatch[1] : '';
    if (!videoId) return "";
    return `https://www.tiktok.com/embed/v2/${videoId}?autoplay=1`;
  };

  // Reset overlay saat ganti video
  useEffect(() => {
    if (selectedTiktokVideo) {
      setShowTextOverlay(true);
    }
  }, [selectedTiktokVideo]);

  // Handler Kirim Email via API (FormSubmit) agar otomatis tanpa buka aplikasi email
  const handleSubmitContent = async () => {
    setSubmitError('');
    
    // 1. Validasi Input agar Form tidak kosong
    if (submitType === 'link' && !submitInputUrl.trim()) {
      setSubmitError('Hei! Kamu belum mengisi URL Link-nya nih.');
      return;
    }
    if (submitType === 'file' && !selectedFile) {
      setSubmitError('Ops! Jangan lupa pilih file yang ingin diunggah ya.');
      return;
    }
    if (!submitDesc.trim()) {
      setSubmitError('Tolong isi sedikit deskripsi agar kami paham konteks kontenmu.');
      return;
    }

    // 2. Animasi Loading
    setSubmitStatus('loading');

    // 3. Proses Pengiriman via AJAX (FormSubmit.co)
    try {
      const formData = new FormData();
      // Subject Email
      formData.append("_subject", "Kontribusi Konten Baru - OutBubble");
      // Mencegah redirect halaman
      formData.append("_captcha", "false"); 
      
      // Isi Data
      formData.append("Tipe Kontribusi", submitType.toUpperCase());
      formData.append("Deskripsi / Alasan", submitDesc);
      
      if (submitType === 'link') {
        formData.append("URL Link", submitInputUrl);
      } else if (selectedFile) {
        formData.append("attachment", selectedFile);
      }

      // Kirim Data ke API
      const response = await fetch("https://formsubmit.co/ajax/bombomcompanygpt@gmail.com", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        setSubmitStatus('success');
        
        // Reset Modal setelah 4 detik
        setTimeout(() => {
          setIsSubmitModalOpen(false);
          setSubmitStatus('idle');
          setSubmitInputUrl('');
          setSubmitDesc('');
          setSelectedFile(null);
          setFilePreview(null);
        }, 4000);
      } else {
        setSubmitStatus('idle');
        setSubmitError('Gagal mengirim ke server. Pastikan internet Anda stabil.');
      }
    } catch (error) {
      setSubmitStatus('idle');
      setSubmitError('Terjadi kesalahan jaringan. Coba beberapa saat lagi.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-12 py-12 px-4 font-sans sm:px-6 lg:px-8 selection:bg-blue-200">
      
      {/* HEADER SECTION */}
      <div className="text-center space-y-4 mb-12 md:mb-16">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h2 className="text-5xl sm:text-6xl md:text-7xl font-black text-[#031466] tracking-tighter leading-tight">
            INSIGHT <span className="text-blue-500 italic font-serif">SOSIAL</span>
          </h2>
          <p className="text-[#031466]/60 text-lg md:text-xl font-medium mt-4 max-w-2xl mx-auto px-4">
            Data empiris, berita terkini, dan konten edukasi untuk membantumu menembus gelembung informasi.
          </p>
        </motion.div>
      </div>

      {/* NAVIGATION TABS */}
      <div className="flex flex-wrap justify-center gap-3 md:gap-6 mb-12">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={cn(
              "flex items-center gap-2 md:gap-3 px-6 py-3 md:px-10 md:py-5 rounded-full md:rounded-[2rem] font-black text-[10px] md:text-xs uppercase tracking-[0.2em] transition-all duration-300",
              activeTab === tab.id 
                ? `${tab.bg} ${tab.color} scale-105 md:scale-110 shadow-xl ring-2 ring-current` 
                : "bg-white text-slate-400 hover:bg-slate-50 border border-slate-100"
            )}
          >
            <tab.icon size={18} className="md:w-5 md:h-5" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* CONTENT GRID */}
      <div className="min-h-[600px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-10"
          >
            {/* ILLUSTRATED SECTION BANNER CARD */}
            <div className={cn(
              "bg-gradient-to-br border rounded-[40px] p-6 sm:p-8 md:p-10 flex flex-col md:flex-row items-center gap-6 md:gap-10 shadow-lg relative overflow-hidden",
              TAB_INFOS[activeTab].color
            )}>
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808005_1px,transparent_1px),linear-gradient(to_bottom,#80808005_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none opacity-50" />
              
              <div className="w-full md:w-[320px] lg:w-[400px] aspect-[16/9] rounded-[30px] overflow-hidden shadow-md shrink-0 border border-slate-200/40 relative z-10">
                <img 
                  src={TAB_INFOS[activeTab].banner} 
                  alt={activeTab} 
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    const fallback = INSIGHT_FALLBACK_IMAGES[TAB_INFOS[activeTab].banner] || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80";
                    e.currentTarget.src = fallback;
                  }}
                  className="w-full h-full object-cover" 
                />
              </div>
              <div className="flex-1 space-y-3 relative z-10 text-left">
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-white/80 border border-slate-200/50 rounded-xl text-[9px] md:text-[10px] font-black uppercase tracking-wider shadow-sm text-slate-600">
                  <Sparkles size={12} className="text-amber-500 animate-pulse" /> {TAB_INFOS[activeTab].badge}
                </span>
                <h3 className="text-xl md:text-3xl font-black text-[#031466] tracking-tight uppercase leading-none mt-1">
                  Eksplorasi {activeTab === 'jurnal' ? 'Jurnal Ilmiah' : activeTab === 'berita' ? 'Berita & Opini Publik' : 'Edukasi Konten Kreatif'}
                </h3>
                <p className="text-xs md:text-sm lg:text-base text-slate-600 font-medium leading-relaxed">
                  {TAB_INFOS[activeTab].text}
                </p>
                <div className="pt-2 text-[10px] md:text-xs font-bold text-slate-500 italic bg-white/30 backdrop-blur-sm p-3 rounded-2xl border border-white/40 flex items-center gap-2">
                  <span className="text-blue-500 text-sm">💡</span> {TAB_INFOS[activeTab].action}
                </div>
              </div>
            </div>

            {/* THE LIST OF GRID CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
              {CONTENT_DATA[activeTab].map((item) => {
                const isTikTok = activeTab === 'tiktok';

                return (
                  <motion.div 
                    whileHover={{ y: -8 }}
                    key={item.id} 
                    className="group bg-white rounded-[35px] md:rounded-[45px] overflow-hidden border border-slate-100 shadow-xl hover:shadow-[0_30px_60px_-15px_rgba(3,20,102,0.3)] transition-all flex flex-col cursor-pointer"
                    onClick={() => isTikTok ? setSelectedTiktokVideo(item) : window.open(item.link, '_blank')}
                  >
                    {/* THUMBNAIL PREVIEW */}
                    <div className="relative aspect-[4/5] sm:aspect-auto sm:h-72 md:h-80 overflow-hidden shrink-0 bg-black">
                      <img 
                        src={item.image} 
                        referrerPolicy="no-referrer"
                        onError={(e) => {
                          e.currentTarget.src = "https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=800&q=80";
                        }}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-90" 
                        alt={item.title} 
                      />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#031466]/90 via-[#031466]/20 to-transparent" />
                    
                    <div className="absolute top-5 left-5 bg-white/95 backdrop-blur-sm px-4 py-1.5 rounded-full text-[9px] md:text-[10px] font-black text-[#031466] uppercase tracking-widest shadow-lg">
                      {item.source}
                    </div>

                    {isTikTok && (
                      <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-all duration-500 bg-[#031466]/40 backdrop-blur-sm">
                        <div className="w-16 h-16 md:w-20 md:h-20 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/40 shadow-2xl hover:scale-110 transition-transform">
                          <Play className="text-white fill-white ml-1.5" size={32} />
                        </div>
                        <span className="text-white font-black text-[9px] md:text-[10px] uppercase tracking-widest bg-black/60 px-4 py-1.5 rounded-full shadow-lg">
                          Tonton Video
                        </span>
                      </div>
                    )}
                  </div>

                  {/* INFO KONTEN BAWAH */}
                  <div className="p-6 md:p-8 flex-1 flex flex-col justify-between bg-white relative z-10">
                    <div className="space-y-3 md:space-y-4">
                      <h3 className="text-lg md:text-2xl font-black text-[#031466] leading-tight line-clamp-2">
                        {item.title}
                      </h3>
                      <p className="text-sm md:text-base text-slate-500 font-medium leading-relaxed italic line-clamp-2 md:line-clamp-3">
                        {item.desc}
                      </p>
                    </div>
                    
                    <div className="flex items-center justify-between pt-5 mt-5 border-t border-slate-100">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation(); 
                          window.open(item.link, '_blank');
                        }}
                        className="flex items-center gap-2 font-black text-[9px] md:text-[10px] uppercase tracking-[0.2em] text-blue-600 hover:text-blue-800 transition-colors"
                      >
                        {isTikTok ? 'Buka di App' : 'Baca Jurnal'} <ExternalLink size={14} />
                      </button>
                      
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleBookmark(item.id);
                        }}
                        className={cn(
                          "p-3 md:p-4 rounded-xl md:rounded-2xl transition-all shadow-sm",
                          user?.bookmarks.includes(item.id) 
                            ? "bg-blue-600 text-white shadow-blue-600/30" 
                            : "bg-slate-50 text-slate-400 hover:bg-slate-100 border border-slate-200"
                        )}
                      >
                        <Bookmark size={18} fill={user?.bookmarks.includes(item.id) ? "white" : "none"} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* --- MODAL TIKTOK PLAYER FULL SCREEN GAYA TIKTOK ASLI --- */}
      <AnimatePresence>
        {selectedTiktokVideo && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-0 md:p-8 lg:p-12 overflow-hidden bg-black/95 backdrop-blur-md">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-sm sm:max-w-md md:max-w-lg h-full sm:h-[90vh] bg-black sm:rounded-[40px] overflow-hidden shadow-2xl border border-white/10 mx-auto"
            >
              
              <button 
                onClick={() => setSelectedTiktokVideo(null)}
                className="absolute top-4 right-4 z-[120] bg-black/40 hover:bg-red-500 backdrop-blur-md p-2.5 rounded-full text-white shadow-2xl transition-colors border border-white/20"
              >
                <X size={24} />
              </button>

              <div className="absolute inset-0 w-full h-full bg-black z-0 flex items-center justify-center">
                <iframe 
                  src={getEmbedUrl(selectedTiktokVideo.link)}
                  className="w-full h-full border-none"
                  allow="autoplay; encrypted-media; fullscreen"
                  allowFullScreen
                  referrerPolicy="no-referrer"
                  sandbox="allow-scripts allow-same-origin allow-popups allow-presentation"
                  title={selectedTiktokVideo.title}
                ></iframe>
              </div>

              <div className="absolute bottom-0 left-0 right-0 z-10 pointer-events-none flex flex-col justify-end h-full">
                <AnimatePresence>
                  {showTextOverlay && (
                    <motion.div 
                      initial={{ opacity: 0, y: 50 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 50 }}
                      className="w-full p-4 sm:p-6 bg-gradient-to-t from-black/90 via-black/40 to-transparent pointer-events-auto flex flex-col gap-2 pb-8 sm:pb-10"
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <div className="w-8 h-8 rounded-full bg-blue-600/80 flex items-center justify-center text-white text-xs font-black border border-white/20 shadow-lg">
                          <User size={14} />
                        </div>
                        <p className="text-sm font-bold text-white shadow-black drop-shadow-md">
                          {selectedTiktokVideo.source}
                        </p>
                      </div>

                      <div className="pr-16">
                        <h2 className="text-sm sm:text-base font-bold text-white leading-snug drop-shadow-md mb-1.5">
                          {selectedTiktokVideo.title}
                        </h2>
                        <p className="text-xs sm:text-sm text-gray-200 line-clamp-3 leading-relaxed drop-shadow-md font-medium">
                          {selectedTiktokVideo.desc}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="absolute bottom-6 sm:bottom-8 right-4 flex flex-col gap-4 pointer-events-auto z-20">
                  <button 
                    onClick={() => setShowTextOverlay(!showTextOverlay)}
                    className="w-12 h-12 bg-black/40 backdrop-blur-md rounded-full flex flex-col items-center justify-center text-white border border-white/20 hover:bg-black/60 transition-colors shadow-lg group"
                    title={showTextOverlay ? "Sembunyikan Teks" : "Tampilkan Teks"}
                  >
                    {showTextOverlay ? <EyeOff size={20} /> : <Eye size={20} />}
                    <span className="text-[8px] font-bold mt-0.5">{showTextOverlay ? "Hide" : "Show"}</span>
                  </button>

                  <a 
                    href={selectedTiktokVideo.link} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-12 h-12 bg-blue-600/90 backdrop-blur-md rounded-full flex flex-col items-center justify-center text-white border border-white/20 hover:bg-blue-700 transition-colors shadow-lg"
                    title="Buka di TikTok"
                  >
                    <ExternalLink size={18} />
                    <span className="text-[8px] font-bold mt-0.5">App</span>
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* --- SUBMISSION CTA SECTION --- */}
      <div className="mt-12 bg-[#031466] p-10 md:p-16 lg:p-20 rounded-[40px] md:rounded-[70px] text-center space-y-6 text-white relative overflow-hidden shadow-2xl transition-transform hover:scale-[1.01] duration-500">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
        <div className="absolute bottom-[-50px] right-[-50px] w-64 h-64 bg-blue-500/20 rounded-full blur-[100px] animate-pulse" />
        
        <h3 className="text-3xl md:text-5xl lg:text-6xl font-black italic tracking-tighter uppercase relative z-10">
          Kontribusi Komunitas
        </h3>
        <p className="text-blue-200/90 max-w-2xl mx-auto text-sm md:text-lg font-medium leading-relaxed relative z-10">
          Menemukan artikel riset, berita, atau video edukasi yang mencerahkan? Bagikan konten Anda dan bantu pengguna lain menembus gelembung informasi.
        </p>
        <button 
          onClick={() => {
            setSubmitStatus('idle');
            setSubmitError('');
            setSelectedFile(null);
            setFilePreview(null);
            setSubmitDesc('');
            setSubmitInputUrl('');
            setIsSubmitModalOpen(true);
          }}
          className="relative z-10 mt-8 bg-gradient-to-r from-blue-500 to-cyan-400 hover:from-blue-400 hover:to-cyan-300 text-white px-10 py-5 md:px-14 md:py-6 rounded-full font-black uppercase tracking-[0.2em] text-xs md:text-sm shadow-[0_10px_30px_rgba(59,130,246,0.5)] hover:shadow-[0_15px_40px_rgba(59,130,246,0.7)] hover:-translate-y-1 transition-all duration-300"
        >
          <span className="flex items-center justify-center gap-2">
            <Mail size={20} /> Kirim Konten Sekarang
          </span>
        </button>
      </div>

      {/* --- MODAL PENGIRIMAN KONTEN (DENGAN API FORMSUBMIT OTOMATIS) --- */}
      <AnimatePresence>
        {isSubmitModalOpen && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 sm:p-6 md:p-10">
            {/* Overlay */}
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => submitStatus !== 'loading' && setIsSubmitModalOpen(false)}
              className="absolute inset-0 bg-[#031466]/90 backdrop-blur-xl"
            />

            {/* Form Container */}
            <motion.div 
              initial={{ scale: 0.9, y: 50, opacity: 0 }} animate={{ scale: 1, y: 0, opacity: 1 }} exit={{ scale: 0.9, y: 50, opacity: 0 }}
              className="relative bg-white w-full max-w-2xl rounded-[40px] md:rounded-[50px] overflow-hidden shadow-[0_30px_60px_rgba(0,0,0,0.5)] border-[8px] border-white/20 p-6 md:p-10 flex flex-col"
            >
              {submitStatus !== 'loading' && (
                <button 
                  onClick={() => setIsSubmitModalOpen(false)}
                  className="absolute top-6 right-6 p-3 bg-slate-100 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all z-50"
                >
                  <X size={20} strokeWidth={3} />
                </button>
              )}

              {/* JIKA STATUS SUCCESS (ANIMASI CENTANG HIJAU) */}
              {submitStatus === 'success' ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} 
                  className="flex flex-col items-center justify-center py-10 text-center space-y-6"
                >
                  <motion.div 
                    initial={{ scale: 0 }} animate={{ scale: 1, rotate: 360 }} transition={{ type: "spring", stiffness: 200, damping: 20 }}
                    className="w-32 h-32 bg-green-100 text-green-500 rounded-full flex items-center justify-center mb-2 shadow-inner"
                  >
                    <CheckCircle2 size={64} strokeWidth={2.5} />
                  </motion.div>
                  <h3 className="text-3xl md:text-4xl font-black text-[#031466] uppercase italic tracking-tight">Sukses Terkirim!</h3>
                  <div className="bg-blue-50 p-6 rounded-3xl border border-blue-100 max-w-sm">
                    <p className="text-slate-600 font-medium text-sm leading-relaxed">
                      Kontribusi kamu telah berhasil dikirim ke <strong className="text-[#031466]">Tim OutBubble</strong> secara otomatis.
                      Terima kasih atas partisipasimu!
                    </p>
                  </div>
                </motion.div>
              ) : (
                /* FORM INPUT NORMAL */
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col w-full h-full">
                  <div className="mb-8 pr-12">
                    <h3 className="text-3xl md:text-4xl font-black text-[#031466] tracking-tighter uppercase italic flex items-center gap-3">
                      <Sparkles className="text-blue-500" /> Kirim Konten
                    </h3>
                    <p className="text-sm text-slate-500 font-medium mt-2">Pilih format pengiriman yang kamu inginkan.</p>
                  </div>

                  {/* Toggle Tipe Konten */}
                  <div className="flex bg-slate-100 p-1.5 rounded-full mb-6 relative shadow-inner">
                    <button 
                      onClick={() => { setSubmitType('link'); setSubmitError(''); }}
                      className={cn("flex-1 py-3.5 rounded-full text-sm font-black flex items-center justify-center gap-2 transition-all z-10", submitType === 'link' ? "text-white drop-shadow-md" : "text-slate-400")}
                    >
                      <LinkIcon size={18} /> Link URL
                    </button>
                    <button 
                      onClick={() => { setSubmitType('file'); setSubmitError(''); }}
                      className={cn("flex-1 py-3.5 rounded-full text-sm font-black flex items-center justify-center gap-2 transition-all z-10", submitType === 'file' ? "text-white drop-shadow-md" : "text-slate-400")}
                    >
                      <UploadCloud size={18} /> Upload File
                    </button>
                    
                    {/* Animated Toggle Background */}
                    <motion.div 
                      className="absolute top-1.5 bottom-1.5 w-[calc(50%-6px)] bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full shadow-lg z-0"
                      animate={{ left: submitType === 'link' ? '6px' : 'calc(50% + 0px)' }}
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  </div>

                  <div className="space-y-5">
                    {/* Input Sesuai Tipe */}
                    <AnimatePresence mode="wait">
                      {submitType === 'link' ? (
                        <motion.div key="link" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
                          <label className="block text-xs font-black uppercase tracking-widest text-[#031466]/50 mb-2 pl-2">URL Konten</label>
                          <input 
                            type="url" 
                            value={submitInputUrl}
                            onChange={(e) => { setSubmitInputUrl(e.target.value); setSubmitError(''); }}
                            placeholder="Contoh: https://tiktok.com/..." 
                            className="w-full bg-slate-50 border-2 border-slate-200 focus:border-blue-500 focus:bg-white rounded-2xl px-6 py-4 outline-none font-bold text-[#031466] shadow-sm transition-all"
                          />
                        </motion.div>
                      ) : (
                        <motion.div key="file" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                          <label className="block text-xs font-black uppercase tracking-widest text-[#031466]/50 mb-2 pl-2">Upload File (Maks 10MB)</label>
                          
                          <div 
                            className={cn("w-full bg-slate-50 border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-3", selectedFile ? "border-blue-500 bg-blue-50/50" : "border-slate-300 hover:border-blue-400 hover:bg-slate-100")}
                            onClick={() => fileInputRef.current?.click()}
                          >
                            {selectedFile ? (
                              <div className="flex flex-col items-center text-blue-600">
                                {filePreview ? (
                                  <div className="relative w-40 h-28 rounded-xl overflow-hidden border border-blue-200/60 mb-2 shadow-sm bg-white">
                                    <img src={filePreview} className="w-full h-full object-cover" alt="upload preview" />
                                  </div>
                                ) : (
                                  <FileCheck size={48} className="mb-3 drop-shadow-sm" />
                                )}
                                <p className="font-bold text-sm truncate max-w-full px-4">{selectedFile.name}</p>
                                <p className="text-xs text-blue-400 mt-1 font-medium">Klik untuk mengganti file</p>
                              </div>
                            ) : (
                              <>
                                <div className="flex gap-3 text-slate-400 mb-2">
                                  <FileText size={28} /> <ImageIcon size={28} /> <Video size={28} />
                                </div>
                                <p className="font-bold text-[#031466] text-sm">Klik di sini untuk memilih file</p>
                                <p className="text-xs text-slate-400 font-medium">Format: PDF, JPG, PNG, MP4</p>
                              </>
                            )}
                            <input 
                              type="file" 
                              ref={fileInputRef} 
                              className="hidden" 
                              accept=".pdf,.jpg,.jpeg,.png,.mp4"
                              onChange={(e) => {
                                if (e.target.files && e.target.files.length > 0) {
                                  const file = e.target.files[0];
                                  setSelectedFile(file);
                                  setSubmitError('');
                                  if (file.type.startsWith('image/')) {
                                    const reader = new FileReader();
                                    reader.onloadend = () => {
                                      setFilePreview(reader.result as string);
                                    };
                                    reader.readAsDataURL(file);
                                  } else {
                                    setFilePreview(null);
                                  }
                                }
                              }}
                            />
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Input Deskripsi */}
                    <div>
                      <label className="block text-xs font-black uppercase tracking-widest text-[#031466]/50 mb-2 pl-2">Deskripsi Singkat</label>
                      <textarea 
                        value={submitDesc}
                        onChange={(e) => { setSubmitDesc(e.target.value); setSubmitError(''); }}
                        placeholder="Mengapa konten ini pantas dibagikan ke pengguna lain?" 
                        className="w-full bg-slate-50 border-2 border-slate-200 focus:border-blue-500 focus:bg-white rounded-2xl px-6 py-4 outline-none font-medium text-[#031466] shadow-sm transition-all min-h-[120px] resize-none"
                      />
                    </div>
                    
                    {/* Error Message Display */}
                    <AnimatePresence>
                      {submitError && (
                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="text-red-600 text-sm font-bold flex items-center gap-3 bg-red-100 p-4 rounded-xl border border-red-200 shadow-sm">
                          <AlertCircle size={18} className="shrink-0" /> {submitError}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Tombol Aksi Pengiriman (Menggunakan API Latar Belakang) */}
                  <div className="mt-8 pt-6 border-t border-slate-100">
                    <button 
                      onClick={handleSubmitContent}
                      disabled={submitStatus === 'loading'}
                      className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white py-5 rounded-[20px] font-black uppercase tracking-widest text-sm flex items-center justify-center gap-3 shadow-[0_10px_20px_rgba(37,99,235,0.3)] transition-all active:scale-95 disabled:opacity-70 disabled:scale-100"
                    >
                      {submitStatus === 'loading' ? (
                        <><Loader2 size={20} className="animate-spin" /> Sedang Mengirim...</>
                      ) : (
                        <><Send size={20} /> Kirim Sekarang Otomatis</>
                      )}
                    </button>
                  </div>
                </motion.div>
              )}

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default InsightSosial;