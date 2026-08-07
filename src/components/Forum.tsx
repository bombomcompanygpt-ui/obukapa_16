import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageCircle, Heart, Trash2, X, Send, Image as ImageIcon, 
  MousePointer2, Sparkles, Shield, Compass, Smile, Search, 
  HelpCircle, Repeat2, Filter, Flame, Share2, AlertCircle,
  Eye, Award, CheckCircle2, TrendingUp, Info, Zap
} from 'lucide-react';
import { useStore } from '../lib/store';
import { cn } from '../lib/utils';

// Curious Pseudonyms for high-quality Indonesian cyber discussions
const PSEUDONYMS = [
  "Bebas_Gelembung 🫧",
  "Pendeteksi_Bias 🧠",
  "Ksatria_Nalar 🛡️",
  "Socrates_Digital 🔬",
  "Penembak_Hoaks 🎯",
  "Logika_Murni ⚖️",
  "Skeptis_Mapan 🔍",
  "Pecah_Opini ✨",
  "Anti_EchoChamber 📢",
  "Sobat_Sadar 💡",
  "Akademis_Kritis 🎓",
  "Komentator_Arif 🌟"
];

const Forum: React.FC = () => {
  const { topics, addTopic, toggleLikeTopic, deleteTopic, user, addReply, deleteReply, repostTopic, openAuthModal } = useStore();
  
  // Real-time server-side topics state
  const [serverTopics, setServerTopics] = useState<any[]>([]);
  const [useLocalStoreOnly, setUseLocalStoreOnly] = useState(false);
  const [activeLensFilter, setActiveLensFilter] = useState<string>('Semua');
  const [searchQuery, setSearchQuery] = useState('');
  
  const [newPost, setNewPost] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedLens, setSelectedLens] = useState<string>('Opini');
  const [expandedTopicId, setExpandedTopicId] = useState<string | null>(null);
  
  // Anonymous posting config
  const [customPseudonym, setCustomPseudonym] = useState(PSEUDONYMS[0]);
  const [useRealName, setUseRealName] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  
  // Connection stream & Visitor stats state
  const [sseActive, setSseActive] = useState(false);
  const [onlineCount, setOnlineCount] = useState<number>(1);
  const [totalVisitors, setTotalVisitors] = useState<number>(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sound FX and notification state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    // Generate or get unique visitor ID
    let vid = localStorage.getItem('outbubble_visitor_id');
    if (!vid) {
      vid = `vid-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
      localStorage.setItem('outbubble_visitor_id', vid);
    }

    // Check if session visit was logged
    const isNewVisit = !sessionStorage.getItem('outbubble_session_logged');
    if (isNewVisit) {
      sessionStorage.setItem('outbubble_session_logged', 'true');
    }

    // Ping visitor heartbeat & update stats
    const pingVisitor = () => {
      fetch("/api/forum/ping", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ visitorId: vid, isNewVisit: isNewVisit && !totalVisitors })
      })
        .then(res => res.json())
        .then(data => {
          if (data.onlineCount !== undefined) setOnlineCount(data.onlineCount);
          if (data.totalVisitors !== undefined) setTotalVisitors(data.totalVisitors);
        })
        .catch(() => {});
    };

    const fetchTopics = () => {
      fetch("/api/forum/topics")
        .then(res => {
          if (!res.ok) throw new Error("Could not fetch server topics");
          return res.json();
        })
        .then(data => {
          if (Array.isArray(data)) {
            setServerTopics(data);
          }
          setUseLocalStoreOnly(false);
          setSseActive(true);
        })
        .catch(err => {
          console.warn("REST API topics unavailable. Falling back to Zustand local database:", err);
          setUseLocalStoreOnly(true);
          setSseActive(false);
        });

      pingVisitor();
    };

    // 1. Initial fetch & ping
    fetchTopics();

    // 2. Start polling interval every 3 seconds for live discussions & visitor count updates
    const pollingInterval = setInterval(() => {
      fetchTopics();
    }, 3000);

    return () => {
      if (pollingInterval) {
        clearInterval(pollingInterval);
      }
    };
  }, []);

  // Show live toast helper
  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2800);
  };

  // Play natural UI pop sound
  const playPopSound = () => {
    try {
      if (typeof window !== 'undefined') {
        const audio = new Audio("https://assets.mixkit.co/active_storage/sfx/2568/2568-400.wav");
        audio.volume = 0.25;
        audio.play().catch(() => {});
      }
    } catch (e) {
      console.log("Sound play error", e);
    }
  };

  // Roll a new random handle
  const rollPseudonym = () => {
    const fresh = PSEUDONYMS[Math.floor(Math.random() * PSEUDONYMS.length)];
    setCustomPseudonym(fresh);
    playPopSound();
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 1500 * 1024) {
        triggerToast("Ukuran foto max 1.5MB biar load kencang!");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
        triggerToast("Foto berhasil dimuat! 📸");
      };
      reader.readAsDataURL(file);
    }
  };

  // Publish post
  const handlePost = async () => {
    if (user?.isGuest || !user || user.id === 'user-guest') {
      openAuthModal('login', 'Silakan Masuk atau Daftar terlebih dahulu untuk memposting di Diskusi.');
      return;
    }

    if (!newPost.trim() && !imagePreview) return;
    
    const authorName = useRealName 
      ? (user?.username || "Pengguna OutBubble") 
      : customPseudonym;

    const topicId = `t-${Date.now()}`;
    const topicData = {
      id: topicId,
      title: "",
      authorName: authorName,
      authorId: user?.id || "uid-guest",
      authorAvatar: user?.photoUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${authorName.replace(/\s+/g, '')}`,
      content: newPost,
      image: imagePreview || undefined,
      lens: selectedLens,
    };

    playPopSound();

    try {
      // Always target the active REST server database first so that other online people see the post immediately!
      const response = await fetch("/api/forum/topics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(topicData)
      });
      if (!response.ok) throw new Error("REST API return error status");
      const savedTopic = await response.json();
      setServerTopics(prev => [savedTopic, ...prev]);
      triggerToast("Diskusi berhasil diletupkan secara Live! 🫧");
    } catch (err) {
      console.warn("REST API Post failed. Saving to local state fallback:", err);
      addTopic({
        ...topicData,
        likes: 0,
        replies: [],
        createdAt: new Date().toISOString()
      });
      triggerToast("Letupan tersimpan di penyimpanan lokal!");
    }

    setNewPost('');
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Trigger Like API
  const handleLike = async (topicId: string, isLiked: boolean) => {
    playPopSound();

    // Optimistic UI updates
    setServerTopics(prev => prev.map(t => {
      if (t.id === topicId) {
        return {
          ...t,
          likes: isLiked ? Math.max(0, t.likes - 1) : t.likes + 1,
          isLikedByLocalClient: !isLiked
        };
      }
      return t;
    }));

    try {
      await fetch(`/api/forum/topics/${topicId}/like`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isLikedByMe: isLiked })
      });
    } catch (err) {
      console.error("API Like failed, falling back to Zustand local", err);
    }
    toggleLikeTopic(topicId);
  };

  // Trigger Repost API
  const handleRepost = async (topicId: string) => {
    playPopSound();
    triggerToast("Pemikiran berhasil di-repost! 🔄");
    
    setServerTopics(prev => prev.map(t => {
      if (t.id === topicId) {
        return { ...t, repostsCount: (t.repostsCount || 0) + 1 };
      }
      return t;
    }));

    try {
      await fetch(`/api/forum/topics/${topicId}/repost`, {
        method: "POST"
      });
    } catch (err) {
      console.error("API Repost failed, calling store fallback", err);
    }
    repostTopic(topicId);
  };

  // Trigger Delete API
  const handleDelete = async (topicId: string) => {
    if (!window.confirm("Hapus letupan diskusi ini?")) return;
    playPopSound();
    triggerToast("Postingan diskusi dihapus!");

    setServerTopics(prev => prev.filter(t => t.id !== topicId));

    try {
      await fetch(`/api/forum/topics/${topicId}`, {
        method: "DELETE"
      });
    } catch (err) {
      console.error("API Delete failed, falling back", err);
    }
    deleteTopic(topicId);
  };

  // Send Reply API
  const handleSendReply = async (topicId: string, replyText: string) => {
    if (user?.isGuest || !user || user.id === 'user-guest') {
      openAuthModal('login', 'Silakan Masuk atau Daftar terlebih dahulu untuk membalas diskusi.');
      return;
    }

    if (!replyText.trim()) return;
    playPopSound();

    const nameToUse = useRealName 
      ? (user?.username || "Pengguna OutBubble") 
      : customPseudonym;

    const replyData = {
      id: `r-${Date.now()}`,
      authorName: nameToUse,
      content: replyText,
      createdAt: new Date().toISOString(),
      avatarSeed: nameToUse.replace(/\s+/g, '')
    };

    // Optimistic UI updates
    setServerTopics(prev => prev.map(t => {
      if (t.id === topicId) {
        const list = t.replies || [];
        return {
          ...t,
          replies: [replyData, ...list],
          repliesCount: list.length + 1
        };
      }
      return t;
    }));

    try {
      await fetch(`/api/forum/topics/${topicId}/replies`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reply: replyData })
      });
      triggerToast("Balasan terkirim lurus ke gelembung! 💬");
    } catch (err) {
      console.error("API reply failed, falling back to Zustand", err);
    }
    addReply(topicId, replyData);
  };

  // Send static emojis
  const insertEmoji = (emoji: string) => {
    setNewPost(prev => prev + emoji);
    playPopSound();
  };

  // Determine active list (Prioritize live Firestore server topics when online)
  const activeTopics = (!useLocalStoreOnly && sseActive) ? serverTopics : topics;

  // Filter & Search computation
  const filteredTopics = activeTopics.filter(t => {
    const matchesLens = activeLensFilter === 'Semua' || t.lens?.toLowerCase() === activeLensFilter.toLowerCase();
    const matchesSearch = searchQuery.trim() === '' || 
      t.content.toLowerCase().includes(searchQuery.toLowerCase()) || 
      t.authorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (t.lens && t.lens.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesLens && matchesSearch;
  });

  // Curated Hot Trends Indonesia for Digital Literacy
  const POPULAR_TRENDS = [
    { tag: "#BiasKonfirmasi", label: "Bias Konfirmasi" },
    { tag: "#FilterBubble", label: "Filter Bubble" },
    { tag: "#BuzzerPolitik", label: "Buzzer Politik" },
    { tag: "#DetoksMedsos", label: "Detoks Medsos" },
    { tag: "#SaringSebelumSharing", label: "Cek Fakta" }
  ];

  return (
    <div className="min-h-screen bg-slate-50 pb-32 relative overflow-x-hidden font-sans">
      {/* Light Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none opacity-80" />
      
      {/* Visual background gradient bubbles */}
      <div className="absolute top-20 right-0 w-96 h-96 bg-blue-100/30 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-40 left-0 w-96 h-96 bg-rose-100/20 rounded-full blur-[120px] pointer-events-none" />

      {/* Floating Live Toast Alert */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div 
            initial={{ opacity: 0, y: -50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            className="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-[#031466] text-white px-6 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 border border-white/10"
          >
            <div className="w-2.5 h-2.5 bg-emerald-400 rounded-full animate-ping" />
            <span className="text-xs md:text-sm font-bold tracking-tight">{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto px-4 md:px-6 relative z-10 pt-10">
        
        {/* --- PREMIUM HEADER HEADER --- */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12 border-b border-slate-200 pb-8">
          <div className="text-center md:text-left space-y-1">
            <div className="flex items-center justify-center md:justify-start gap-2 text-blue-500 font-bold text-xs uppercase tracking-widest">
              <Sparkles size={14} className="animate-spin text-blue-500 duration-1000" />
              <span>Ruang Opini Bebas & Terbuka</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-[#031466] tracking-tighter uppercase leading-none">
              PERSPECTIVE <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">GARDEN</span>
            </h1>
            <p className="text-xs md:text-sm text-slate-500 font-bold uppercase tracking-widest">
              Tuliskan pemikiran kritis secara bebas. Suaramu nyata dan instan.
            </p>
          </div>

          {/* SSE Network Status & Visitor Stats Panel */}
          <div className="flex flex-wrap items-center justify-center md:justify-end gap-3 bg-white border border-slate-200 shadow-sm rounded-3xl p-3 px-5">
            <div className="flex items-center gap-2">
              <div className="relative flex h-3 w-3">
                <span className={cn(
                  "animate-ping absolute inline-flex h-full w-full rounded-full opacity-75",
                  sseActive ? "bg-emerald-400" : (useLocalStoreOnly ? "bg-rose-400" : "bg-sky-400")
                )} />
                <span className={cn(
                  "relative inline-flex rounded-full h-3 w-3",
                  sseActive ? "bg-emerald-500" : (useLocalStoreOnly ? "bg-rose-500" : "bg-sky-500")
                )} />
              </div>
              
              <div className="text-left">
                <p className="text-[9px] font-black uppercase text-slate-400 leading-none">Status Database</p>
                <h5 className="text-[11px] font-black text-[#031466] mt-0.5">
                  {sseActive ? "FIRESTORE SYNC" : "LOCAL MODE"}
                </h5>
              </div>
            </div>

            <div className="h-6 w-px bg-slate-200" />

            <div className="text-left">
              <p className="text-[9px] font-black uppercase text-slate-400 leading-none">Total Pengunjung</p>
              <h5 className="text-[11px] font-black text-[#031466] mt-0.5 flex items-center gap-1">
                <Eye size={12} className="text-indigo-500" />
                <span>{totalVisitors}</span> <span className="text-[9px] font-bold text-slate-400">akses</span>
              </h5>
            </div>

            <div className="h-6 w-px bg-slate-200" />

            <div className="text-left">
              <p className="text-[9px] font-black uppercase text-slate-400 leading-none">Warga Online</p>
              <h5 className="text-[11px] font-black text-emerald-600 mt-0.5 flex items-center gap-1">
                <Zap size={12} className="text-emerald-500 fill-emerald-500" />
                <span>{onlineCount}</span> <span className="text-[9px] font-bold text-slate-400">aktif</span>
              </h5>
            </div>
          </div>
        </div>

        {/* --- MAIN CORE GRID 2-COLUMNS Layout --- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT: Feed, Post Editor, Search (Col 8) */}
          <div className="col-span-1 lg:col-span-8 space-y-8 text-left">
            
            {/* --- PREMIUM POST CREATOR PANELS --- */}
            <div className="bg-white border border-slate-200 rounded-[30px] md:rounded-[40px] p-6 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 left-0 w-2 h-full bg-[#031466]" />

              {user?.isGuest && (
                <div className="mb-4 p-3.5 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2 text-[#031466] font-bold">
                    <Info size={16} className="text-blue-600 shrink-0" />
                    <span>Mode Tamu: Anda dapat membaca semua diskusi. Masuk/Daftar untuk membuat postingan baru.</span>
                  </div>
                  <button
                    onClick={() => openAuthModal('login', 'Silakan Masuk atau Daftar terlebih dahulu untuk memposting di Diskusi.')}
                    className="px-3 py-1.5 bg-[#031466] text-white rounded-xl font-bold hover:bg-blue-900 transition-colors shrink-0 shadow-sm cursor-pointer"
                  >
                    Masuk / Daftar
                  </button>
                </div>
              )}

              <div className="flex items-start gap-4">
                {/* Dynamic Avatar Wrapper */}
                <div className="w-12 h-12 rounded-full border-2 border-slate-200 shadow-sm shrink-0 overflow-hidden bg-gradient-to-tr from-blue-500/10 to-indigo-500/20 flex items-center justify-center relative">
                  <img 
                    src={user?.photoUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${customPseudonym.replace(/\s+/g, '')}`} 
                    alt="avatar" 
                    className="w-full h-full object-cover" 
                  />
                </div>

                <div className="flex-1 space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-black text-slate-800">
                        {useRealName ? (user?.username || "Sobat OutBubble") : customPseudonym}
                      </span>
                      <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 p-1 px-2.5 rounded-full">
                        {useRealName ? "Nama Asli" : "Samaran Aktif"}
                      </span>
                    </div>

                    {/* Anonymous Pseudonym Selector Toggle */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={rollPseudonym}
                        disabled={useRealName}
                        className={cn(
                          "text-[10px] font-bold px-3 py-1.5 rounded-xl border transition-all uppercase tracking-wider flex items-center gap-1.5",
                          useRealName 
                            ? "bg-slate-50 text-slate-300 border-slate-100 cursor-not-allowed"
                            : "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100 active:scale-95"
                        )}
                      >
                        <Repeat2 size={12} className="animate-spin duration-1000" />
                        <span>Acak Samaran</span>
                      </button>

                      <button
                        onClick={() => setUseRealName(!useRealName)}
                        className={cn(
                          "text-[10px] font-bold px-3 py-1.5 rounded-xl border transition-all uppercase tracking-wider",
                          useRealName 
                            ? "bg-indigo-600 text-white border-indigo-600" 
                            : "bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200"
                        )}
                      >
                        {useRealName ? "Gunakan Samaran" : "Gunakan Nama Asli"}
                      </button>
                    </div>
                  </div>

                  {/* Main input area */}
                  <div className="relative">
                    <textarea
                      value={newPost}
                      onChange={(e) => {
                        setNewPost(e.target.value);
                      }}
                      placeholder="Bagikan pandanganmu... (Mari kita diskusikan filter bubble, bias konfirmasi, atau algoritma jahat hari ini!)"
                      className="w-full text-base md:text-lg bg-slate-50/50 p-4 rounded-2xl outline-none focus:bg-white resize-none border border-slate-200/60 focus:border-blue-500 font-medium min-h-[110px] text-slate-800 placeholder:text-slate-400 transition-colors"
                    />
                    
                    {/* Character limit feedback */}
                    <div className="absolute bottom-3 right-4 flex items-center gap-2">
                      <span className="text-[10px] font-bold text-slate-400">{newPost.length} karakter</span>
                    </div>
                  </div>

                  {/* Image Preview Window */}
                  <AnimatePresence>
                    {imagePreview && (
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }} 
                        animate={{ opacity: 1, scale: 1 }} 
                        exit={{ opacity: 0, scale: 0.9 }} 
                        className="relative inline-block mt-2 border border-slate-200 rounded-2xl overflow-hidden p-1.5 bg-slate-100 shadow-md group"
                      >
                        <img src={imagePreview} className="w-36 h-28 object-cover rounded-xl" alt="letupan attachment" />
                        <button 
                          onClick={() => setImagePreview(null)} 
                          className="absolute -top-2.5 -right-2.5 bg-red-600 text-white rounded-full p-1.5 shadow-lg hover:bg-red-700 hover:scale-105 transition-transform"
                        >
                          <X size={14} />
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Quick-select emojis list toolbar */}
                  <div className="flex flex-wrap items-center gap-1.5 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    <span className="text-[9px] font-black uppercase text-slate-400 mr-2 tracking-wider flex items-center gap-1"><Smile size={12} /> Emoji Cepat:</span>
                    {["🫧", "🧠", "🛡️", "🧐", "😭", "⚖️", "🔍", "🕵️", "🔥", "📢", "🎓", "🚀"].map(emoji => (
                      <button 
                        key={emoji}
                        onClick={() => insertEmoji(emoji)} 
                        className="p-1 hover:bg-white rounded-lg transition-colors text-base hover:scale-125 duration-200"
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>

                  {/* Action Bars for categories and posting */}
                  <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-100">
                    {/* Lens Category Radio Group */}
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider mr-1">Tipe Post:</span>
                      {['Fakta', 'Opini', 'Kritik', 'Harapan'].map((lens) => (
                        <button
                          key={lens}
                          onClick={() => setSelectedLens(lens)}
                          className={cn(
                            "px-4 py-1.5 rounded-xl text-xs font-bold border transition-all",
                            selectedLens === lens 
                              ? cn(
                                  lens === 'Fakta' && "bg-emerald-500 text-white border-emerald-500 shadow-sm",
                                  lens === 'Opini' && "bg-amber-500 text-white border-amber-500 shadow-sm",
                                  lens === 'Kritik' && "bg-rose-500 text-white border-rose-500 shadow-sm",
                                  lens === 'Harapan' && "bg-cyan-500 text-white border-cyan-500 shadow-sm"
                                )
                              : "bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200"
                          )}
                        >
                          {lens === 'Fakta' && "🟢 Fakta"}
                          {lens === 'Opini' && "🟡 Opini"}
                          {lens === 'Kritik' && "🔴 Kritik"}
                          {lens === 'Harapan' && "🔵 Harapan"}
                        </button>
                      ))}
                    </div>

                    <div className="flex items-center gap-2 w-full md:w-auto justify-end">
                      <button 
                        onClick={() => fileInputRef.current?.click()}
                        className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-xs shadow-sm transition-all flex items-center gap-1.5"
                      >
                        <ImageIcon size={14} />
                        <span>SISIPKAN FOTO</span>
                      </button>
                      <input type="file" ref={fileInputRef} hidden accept=".jpg,.jpeg,.png" onChange={handleImageChange} />
                      
                      <button 
                        onClick={handlePost}
                        disabled={!newPost.trim() && !imagePreview}
                        className="px-8 py-3 bg-[#031466] text-white rounded-xl font-black text-xs shadow-md hover:scale-[1.03] active:scale-95 disabled:opacity-30 disabled:pointer-events-none transition-all uppercase tracking-wider flex items-center gap-2"
                      >
                        <span>Letupkan!</span>
                        <Send size={12} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* --- TIMELINE DISCUSSIONS FILTER STATS BAR --- */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white/60 border border-slate-200 rounded-2xl p-4">
              <div className="flex items-center gap-2">
                <Filter size={14} className="text-slate-500" />
                <span className="text-xs font-bold text-slate-500">Filter Aktif:</span>
                <span className="bg-[#031466] text-white text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider">{activeLensFilter}</span>
              </div>
              
              <div className="text-xs font-bold text-slate-500">
                Menampilkan <span className="text-[#031466] font-black">{filteredTopics.length}</span> diskusi terletup
              </div>
            </div>

            {/* --- LIST DISKUSI TEMELINE FEED --- */}
            <div className="space-y-6">
              <AnimatePresence mode="popLayout">
                {filteredTopics.length === 0 ? (
                  <motion.div 
                    initial={{ opacity: 0, y: 15 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    exit={{ opacity: 0, y: -15 }}
                    className="bg-white border border-slate-150 p-12 rounded-[30px] text-center text-slate-400 space-y-3"
                  >
                    <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-xl">🔍</div>
                    <div className="space-y-1">
                      <h4 className="text-slate-700 font-bold">Diskusi Tidak Ditemukan</h4>
                      <p className="text-xs max-w-sm mx-auto font-medium">Bantu kami mewarnai taman pemikiran dengan menjadi orang pertama yang meresmikan topik tentang kata kunci ini!</p>
                    </div>
                  </motion.div>
                ) : (
                  filteredTopics.map((topic, i) => (
                    <motion.div
                      layout
                      initial={{ opacity: 0, y: 25 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.35, ease: "easeOut" }}
                      key={topic.id}
                      className="bg-white border border-slate-200 hover:border-slate-300 rounded-[28px] md:rounded-[36px] p-6 md:p-8 shadow-md hover:shadow-xl transition-all duration-300 relative text-left"
                    >
                      {/* Interactive Lens Decorative Side Glow Line */}
                      <div className={cn(
                        "absolute top-0 bottom-0 left-0 w-1.5 rounded-l-full",
                        topic.lens === 'Fakta' && "bg-emerald-500",
                        topic.lens === 'Opini' && "bg-amber-500",
                        topic.lens === 'Kritik' && "bg-rose-500",
                        topic.lens === 'Harapan' && "bg-cyan-500"
                      )} />

                      <div className="pl-2">
                        {/* Feed Card Header */}
                        <div className="flex items-center justify-between gap-4 mb-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full border border-slate-200 overflow-hidden bg-slate-100 shrink-0">
                              <img 
                                src={topic.authorAvatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${(topic.authorName || 'Samaran').replace(/\s+/g, '')}`} 
                                alt="author avatar" 
                                className="w-full h-full object-cover" 
                              />
                            </div>
                            <div>
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <h4 className="text-sm font-bold text-slate-800 leading-tight">{topic.authorName}</h4>
                                <span className="text-[10px] text-slate-400 font-medium">@{topic.authorName.split(' ')[0].toLowerCase()}</span>
                              </div>
                              <p className="text-[10px] font-semibold text-slate-400 mt-0.5">
                                {topic.createdAt ? new Date(topic.createdAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) : "Baru saja"} • {topic.lens || "Opini"}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            {/* Lens Category Badge Tag */}
                            <span className={cn(
                              "text-[8px] md:text-[9px] font-black uppercase tracking-wider p-1 px-3 rounded-full border",
                              topic.lens === 'Fakta' && "bg-emerald-50 text-emerald-600 border-emerald-200/50",
                              topic.lens === 'Opini' && "bg-amber-50 text-amber-600 border-amber-200/50",
                              topic.lens === 'Kritik' && "bg-rose-50 text-rose-600 border-rose-200/50",
                              topic.lens === 'Harapan' && "bg-cyan-50 text-cyan-600 border-cyan-200/50"
                            )}>
                              {topic.lens || "Opini"}
                            </span>

                            {/* Author Delete capabilities */}
                            {(user?.id === topic.authorId || topic.authorId === "uid-guest") && (
                              <button 
                                onClick={() => handleDelete(topic.id)}
                                className="text-slate-300 hover:text-red-500 p-1.5 hover:bg-slate-50 rounded-lg transition-colors"
                              >
                                <Trash2 size={14} />
                              </button>
                            )}
                          </div>
                        </div>

                        {/* Feed Card Description (Justified with clean structure) */}
                        <div className="space-y-4">
                          <p className="text-slate-700 font-medium leading-relaxed text-sm md:text-base text-justify md:text-left break-words">
                            "{topic.content}"
                          </p>

                          {/* Attaching photos */}
                          {topic.image && (
                            <div className="rounded-2xl overflow-hidden border border-slate-200 max-h-96 w-full shadow-inner relative group bg-black">
                              <img 
                                src={topic.image} 
                                referrerPolicy="no-referrer"
                                className="w-full h-full max-h-96 object-cover opacity-90 transition-transform duration-700 group-hover:scale-[1.02]" 
                                alt="letupan diskusi visual" 
                              />
                            </div>
                          )}
                        </div>

                        {/* Interactive Social Media Toolbar Panel */}
                        <div className="flex items-center justify-between mt-6 pt-5 border-t border-slate-100">
                          <div className="flex items-center gap-6">
                            
                            {/* Like Heart triggers */}
                            <button
                              onClick={() => handleLike(topic.id, topic.isLikedByLocalClient)}
                              className={cn(
                                "flex items-center gap-2 py-1 px-3 rounded-xl text-xs font-black transition-all",
                                topic.isLikedByLocalClient 
                                  ? "text-rose-600 bg-rose-50 border border-rose-200/20 scale-105" 
                                  : "text-slate-400 hover:text-rose-500 hover:bg-slate-50"
                              )}
                            >
                              <Heart size={16} fill={topic.isLikedByLocalClient ? "currentColor" : "none"} />
                              <span>{topic.likes || 0}</span>
                            </button>

                            {/* Reply Trigger drawer */}
                            <button
                              onClick={() => setExpandedTopicId(expandedTopicId === topic.id ? null : topic.id)}
                              className={cn(
                                "flex items-center gap-2 py-1 px-3 rounded-xl text-xs font-black transition-all",
                                expandedTopicId === topic.id 
                                  ? "text-blue-600 bg-blue-50 border border-blue-200/20" 
                                  : "text-slate-400 hover:text-blue-500 hover:bg-slate-50"
                              )}
                            >
                              <MessageCircle size={16} />
                              <span>{topic.replies?.length || 0}</span>
                            </button>

                            {/* Repost triggers */}
                            <button
                              onClick={() => handleRepost(topic.id)}
                              className="flex items-center gap-2 py-1 px-3 rounded-xl text-xs font-black text-slate-400 hover:text-indigo-500 hover:bg-slate-50 transition-all hover:scale-105"
                            >
                              <Repeat2 size={16} />
                              <span>{topic.repostsCount || 0}</span>
                            </button>
                          </div>

                          {/* Expansion Guide */}
                          <button
                            onClick={() => setExpandedTopicId(expandedTopicId === topic.id ? null : topic.id)}
                            className="text-xs font-bold text-slate-400 hover:text-blue-600 flex items-center gap-1"
                          >
                            <span>{expandedTopicId === topic.id ? "Tutup utas" : "Tulis balasan"}</span>
                            <motion.span animate={{ rotate: expandedTopicId === topic.id ? 180 : 0 }}>▼</motion.span>
                          </button>
                        </div>

                        {/* CONNECTING THREADS INLINE EXPANDED REPLIES PANEL */}
                        <AnimatePresence>
                          {expandedTopicId === topic.id && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.3 }}
                              className="overflow-hidden"
                            >
                              <div className="mt-6 pt-6 border-t border-slate-100 flex gap-4">
                                
                                {/* Structural Threads Guideline elements */}
                                <div className="flex flex-col items-center shrink-0">
                                  <div className="w-8 h-8 rounded-full border border-slate-100 bg-indigo-50 flex items-center justify-center font-bold text-[10px] text-indigo-600 font-mono">r</div>
                                  <div className="w-0.5 flex-1 bg-slate-100 mt-2 my-1" />
                                </div>

                                <div className="flex-1 space-y-4 text-left">
                                  
                                  {/* Inline replies list */}
                                  <div className="space-y-4">
                                    {(!topic.replies || topic.replies.length === 0) ? (
                                      <p className="text-xs italic text-slate-400 py-2">Belum ada tanggapan di utas ini. Letupan pertama Anda dihargai!</p>
                                    ) : (
                                      topic.replies.map((reply: any) => (
                                        <div key={reply.id} className="bg-slate-50 p-4 rounded-2xl border border-white hover:bg-slate-100/80 transition-colors">
                                          <div className="flex items-center justify-between gap-4 mb-2">
                                            <div className="flex items-center gap-2">
                                              <span className="text-xs font-black text-slate-800">{reply.authorName}</span>
                                              <span className="text-[10px] text-slate-400 font-medium">@{reply.authorName.split(' ')[0].toLowerCase()}</span>
                                            </div>
                                            <span className="text-[8px] font-bold text-slate-400 uppercase">
                                              {reply.createdAt ? new Date(reply.createdAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) : "Baru"}
                                            </span>
                                          </div>
                                          <p className="text-xs md:text-sm font-semibold text-slate-700 leading-relaxed text-justify">{reply.content}</p>
                                        </div>
                                      ))
                                    )}
                                  </div>

                                  {/* Instant reply send form */}
                                  <div className="bg-slate-50/50 p-2 rounded-2xl border border-slate-100 flex items-center gap-2">
                                    <input 
                                      placeholder="Masukkan jawaban rasional pencegah bias..."
                                      className="flex-grow bg-transparent text-xs font-semibold px-4 py-3 outline-none text-slate-800 placeholder:text-slate-400"
                                      onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                          const el = e.currentTarget;
                                          handleSendReply(topic.id, el.value);
                                          el.value = '';
                                        }
                                      }}
                                    />
                                    <button 
                                      onClick={(e) => {
                                        const inputEl = e.currentTarget.previousElementSibling as HTMLInputElement;
                                        if (inputEl && inputEl.value.trim()) {
                                          handleSendReply(topic.id, inputEl.value);
                                          inputEl.value = '';
                                        }
                                      }}
                                      className="bg-[#031466] text-white p-2.5 rounded-xl hover:scale-105 active:scale-95 shadow-sm hover:bg-blue-900 transition-all shrink-0"
                                    >
                                      <Send size={14} />
                                    </button>
                                  </div>

                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>

                      </div>
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </div>

          </div>

          {/* RIGHT SIDEBAR PANEL: Filter Category, Trends, Healthy Rules (Col 4) */}
          <div className="col-span-1 lg:col-span-4 space-y-8 text-left">
            
            {/* Search Input widget */}
            <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm space-y-3">
              <h4 className="text-sm font-black text-[#031466] uppercase tracking-wider flex items-center gap-2">
                <Search size={14} className="text-blue-500" />
                <span>Cari Diskusi</span>
              </h4>
              <div className="relative">
                <input 
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Ketik topik, materi, buzzer..."
                  className="w-full text-xs font-bold leading-normal bg-slate-50 p-3.5 pl-11 rounded-xl outline-none border border-slate-200 focus:bg-white text-slate-800 placeholder:text-slate-400"
                />
                <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                {searchQuery && (
                  <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-rose-500">
                    <X size={14} />
                  </button>
                )}
              </div>
            </div>

            {/* Live Filter Navigator Menu */}
            <div className="bg-white border border-slate-200 rounded-[30px] p-6 shadow-sm space-y-4">
              <h4 className="text-sm font-black text-[#031466] uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-3">
                <Compass size={14} className="text-blue-500" />
                <span>Jelajahi Lensa</span>
              </h4>
              <div className="flex flex-col gap-2">
                {['Semua', 'Fakta', 'Opini', 'Kritik', 'Harapan'].map(lens => {
                  const count = lens === 'Semua' 
                    ? activeTopics.length 
                    : activeTopics.filter(t => t.lens?.toLowerCase() === lens.toLowerCase()).length;

                  return (
                    <button
                      key={lens}
                      onClick={() => {
                        setActiveLensFilter(lens);
                        playPopSound();
                      }}
                      className={cn(
                        "w-full flex items-center justify-between p-3.5 rounded-2xl text-xs font-bold transition-all relative pl-5",
                        activeLensFilter === lens 
                          ? "bg-blue-50/50 border border-blue-200 text-[#031466] scale-[1.02]" 
                          : "hover:bg-slate-50 text-slate-600 border border-transparent"
                      )}
                    >
                      {activeLensFilter === lens && <div className="absolute left-1.5 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-blue-500 rounded-full" />}
                      <span>
                        {lens === 'Semua' && "🌐 Semua Letupan"}
                        {lens === 'Fakta' && "🟢 Fakta Empiris"}
                        {lens === 'Opini' && "🟡 Opini Subaktif"}
                        {lens === 'Kritik' && "🔴 Kritik Tajam"}
                        {lens === 'Harapan' && "🔵 Harapan Kolaboratif"}
                      </span>
                      <span className={cn(
                        "text-[10px] font-black px-2.5 py-0.5 rounded-full border",
                        activeLensFilter === lens ? "bg-[#031466] text-white border-[#031466]" : "bg-slate-100 text-slate-500 border-slate-200"
                      )}>{count}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Local curated hash trends Indonesian bubble issues */}
            <div className="bg-white border border-slate-200 rounded-[30px] p-6 shadow-sm space-y-4">
              <h4 className="text-sm font-black text-[#031466] uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-3">
                <Flame size={14} className="text-red-500 animate-pulse" />
                <span>Isu Hangat Pekan Ini</span>
              </h4>
              <div className="space-y-3">
                {POPULAR_TRENDS.map((item, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setSearchQuery(item.label);
                      playPopSound();
                      triggerToast(`Menyaring tag: ${item.tag}`);
                    }}
                    className="w-full text-left p-3 pt-1 rounded-xl hover:bg-slate-50/80 transition-all flex justify-between items-center group cursor-pointer border border-transparent hover:border-slate-100"
                  >
                    <div>
                      <p className="text-[9px] font-extrabold text-[#031466] uppercase tracking-widest">Trending #{index+1}</p>
                      <h5 className="text-xs font-extrabold text-slate-800 mt-1 flex items-center gap-1">
                        {item.tag}
                      </h5>
                    </div>
                    <span className="text-[10px] font-bold text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">Letupkan →</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Healthy Discussion guidelines */}
            <div className="bg-indigo-950 text-indigo-100 rounded-[30px] p-6 shadow-md relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />
              <Shield size={24} className="text-amber-400 mb-4" />
              
              <div className="space-y-3">
                <h4 className="text-xs font-black uppercase text-amber-400 tracking-wider">Etika Memecah Gelembung</h4>
                <p className="text-[11px] leading-relaxed text-indigo-200">
                  Untuk menjaga agar <strong>Perspective Garden</strong> tetap sehat, mohon ikuti etika komunikasi berikut:
                </p>
                <ul className="list-none space-y-2 text-[10px] leading-relaxed text-indigo-300">
                  <li className="flex gap-2 items-start">
                    <span className="text-amber-400">⚡</span>
                    <span><strong>Saring Sebelum Sharing:</strong> Pastikan menyisipkan bukti jika merupakan berita Fakta.</span>
                  </li>
                  <li className="flex gap-2 items-start">
                    <span className="text-amber-400">⚡</span>
                    <span><strong>No Ad Hominem:</strong> Berdebat pada objek/topik opininya secara rasional, bukan menyerang pribadi orangnya.</span>
                  </li>
                  <li className="flex gap-2 items-start">
                    <span className="text-amber-400">⚡</span>
                    <span><strong>Hargai Perbedaan:</strong> Taman yang indah terdiri dari bunga berwarna-warni, pun pikiran yang kaya akan sudut pandang.</span>
                  </li>
                </ul>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};

export default Forum;
