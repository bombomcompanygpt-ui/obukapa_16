import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Zap, CheckCircle2, Award, RefreshCw, Sparkles, ChevronRight, X, Play, BookOpen, 
  Map as MapIcon, Lock, Trophy, Star, Compass, HelpCircle, Heart, Shield, Trees, 
  Atom, Waves, AlertCircle, Coins, Flame, ChevronLeft
} from 'lucide-react';
import { useStore } from '../lib/store';
import { cn } from '../lib/utils';
import { generateQuestion } from '../lib/quizUtils';

// --- 1. BIOMES DATABASE (DESA BUBUL DISTRICTS) ---
interface Biome {
  name: string;
  description: string;
  subTitle: string;
  themeClass: string;
  bgGradient: string;
  islandGradientStart: string;
  islandGradientEnd: string;
  shoreColor: string;
  rippleColor: string;
  roadColor: string;
  roadCenterColor: string;
  nodeColor: string;
  activeColor: string;
  borderColor: string;
  accentTextColor: string;
  particleColor: string;
  icon: React.ReactNode;
  landmarks: { level: number; label: string; x: number; y: number; icon: string }[];
  sceneryIcons: string[];
  seaOrnaments: { icon: string; x: number; y: number; animate?: string }[];
}

const BIOMES: Biome[] = [
  {
    name: "Dusun Dopamin Feed",
    subTitle: "Wilayah 1 (Level 1 - 100)",
    description: "Lembah hijau tempat benih algoritma pertama kali ditanam. Netizen di sini terjebak dalam siklus candu durasi tonton dan kejar-kejaran status likes.",
    themeClass: "from-emerald-950 via-[#aed581]/90 to-emerald-950",
    bgGradient: "bg-[#e0f7fa] bg-gradient-to-b from-[#80d8ff] via-[#b2dfdb] to-[#e8f5e9]",
    islandGradientStart: "#a1e584",
    islandGradientEnd: "#2e7d32",
    shoreColor: "#ffe082",
    rippleColor: "#b2dfdb",
    roadColor: "#795548",
    roadCenterColor: "#fbc02d",
    nodeColor: "bg-emerald-400 hover:bg-emerald-350 border-emerald-600",
    activeColor: "bg-emerald-500 text-white shadow-emerald-500/50 border-white",
    borderColor: "stroke-emerald-300",
    accentTextColor: "text-emerald-800",
    particleColor: "bg-emerald-400/30",
    icon: <Trees className="w-5 h-5" />,
    landmarks: [
      { level: 1, label: "Gerbang Selamat Datang 🚪", x: 120, y: 350, icon: "🚪" },
      { level: 15, label: "Sawah Dopamin Medsos 🌾", x: 2600, y: 220, icon: "🌾" },
      { level: 45, label: "Kincir Likes & FYP Racun 🎡", x: 8000, y: 480, icon: "🎡" },
      { level: 80, label: "Sumur Ketergantungan Dopamin 💧", x: 14200, y: 200, icon: "💧" }
    ],
    sceneryIcons: ["🌳", "🌲", "🏡", "🌾", "🌻", "🍎", "🛖", "🐄", "🐑", "🐓", "🌻", "🌳", "🏡", "🌳", "🪵", "🐄"],
    seaOrnaments: [
      { icon: "⛵", x: 450, y: 65, animate: "animate-bounce" },
      { icon: "🐋", x: 1250, y: 520, animate: "animate-pulse" },
      { icon: "⛵", x: 3800, y: 55, animate: "animate-bounce" },
      { icon: "🐬", x: 6200, y: 510, animate: "animate-pulse" },
      { icon: "⛵", x: 9500, y: 70, animate: "animate-bounce" },
      { icon: "🐳", x: 13500, y: 520, animate: "animate-pulse" }
    ]
  },
  {
    name: "Lembah Filter Bubble",
    subTitle: "Wilayah 2 (Level 101 - 200)",
    description: "Daerah berkabut tebal yang dikelilingi ribuan gelembung udara transparan. Setiap warga hanya bisa melihat pantulan ketertarikan mereka sendiri.",
    themeClass: "from-cyan-950 via-[#80deea]/90 to-cyan-950",
    bgGradient: "bg-[#e0f7fa] bg-gradient-to-b from-[#b3e5fc] via-[#80deea] to-[#e0f2f1]",
    islandGradientStart: "#80deea",
    islandGradientEnd: "#00acc1",
    shoreColor: "#b2ebf2",
    rippleColor: "#ffffff",
    roadColor: "#006064",
    roadCenterColor: "#e0f7fa",
    nodeColor: "bg-cyan-400 hover:bg-cyan-350 border-cyan-650",
    activeColor: "bg-cyan-500 text-white shadow-cyan-500/50 border-white",
    borderColor: "stroke-cyan-300",
    accentTextColor: "text-cyan-800",
    particleColor: "bg-cyan-400/30",
    icon: <Atom className="w-5 h-5" />,
    landmarks: [
      { level: 105, label: "Kubah Informasi Satu Sisi 🛡️", x: 1000, y: 200, icon: "🛡️" },
      { level: 140, label: "Laboratorium Algoritma Pasif 🧪", x: 7200, y: 460, icon: "🧪" },
      { level: 180, label: "Hutan Gelembung Terisolasi 🌳", x: 14400, y: 220, icon: "🌳" }
    ],
    sceneryIcons: ["🫧", "🔮", "🧪", "🌁", "💠", "🎐", "🧬", "🫧", "🔬", "🛰️", "🛸", "🫧", "💎", "🪞", "🫧"],
    seaOrnaments: [
      { icon: "🛸", x: 750, y: 45, animate: "animate-pulse" },
      { icon: "🫧", x: 2300, y: 515, animate: "animate-bounce" },
      { icon: "🛸", x: 5500, y: 55, animate: "animate-pulse" },
      { icon: "💎", x: 8200, y: 520, animate: "animate-bounce" },
      { icon: "🫧", x: 11000, y: 60, animate: "animate-bounce" },
      { icon: "🛸", x: 14100, y: 530, animate: "animate-pulse" }
    ]
  },
  {
    name: "Puncak Echo Chamber",
    subTitle: "Wilayah 3 (Level 201 - 300)",
    description: "Tebing terjal bersejarah berwarna lembayung purba. Gemuruh suara dan opini baperan di sini memantul tiada henti, membungkam kebenaran luar.",
    themeClass: "from-purple-950 via-[#b39ddb]/90 to-purple-950",
    bgGradient: "bg-[#eedefc] bg-gradient-to-b from-[#311b92]/70 via-[#673ab7]/50 to-[#eedefc]",
    islandGradientStart: "#d1c4e9",
    islandGradientEnd: "#7e57c2",
    shoreColor: "#e1bee7",
    rippleColor: "#ffffff",
    roadColor: "#311b92",
    roadCenterColor: "#ea80fc",
    nodeColor: "bg-purple-400 hover:bg-purple-350 border-purple-600",
    activeColor: "bg-purple-500 text-white shadow-purple-500/50 border-white",
    borderColor: "stroke-purple-300",
    accentTextColor: "text-purple-800",
    particleColor: "bg-purple-400/30",
    icon: <Waves className="w-5 h-5" />,
    landmarks: [
      { level: 210, label: "Gua Pemantul Opini Homogen 🔊", x: 1800, y: 480, icon: "🔊" },
      { level: 250, label: "Kuil Konfirmasi Bias Batin 🏛️", x: 9000, y: 210, icon: "🏛️" },
      { level: 290, label: "Celah Suara Mutlak ⛰️", x: 16200, y: 450, icon: "⛰️" }
    ],
    sceneryIcons: ["🔊", "🏛️", "🏔️", "📢", "🗿", "🕊️", "⛰️", "🔔", "🏛️", "⛰️", "🗣️", "🗿", "🔔", "🦅"],
    seaOrnaments: [
      { icon: "🕊️", x: 800, y: 50, animate: "animate-bounce" },
      { icon: "🐋", x: 3100, y: 520, animate: "animate-pulse" },
      { icon: "🪁", x: 5900, y: 55, animate: "animate-bounce" },
      { icon: "🕊️", x: 8500, y: 512, animate: "animate-pulse" },
      { icon: "🚢", x: 11900, y: 60, animate: "animate-bounce" },
      { icon: "🪁", x: 14700, y: 515, animate: "animate-pulse" }
    ]
  },
  {
    name: "Aliran Polarisasi Sosial",
    subTitle: "Wilayah 4 (Level 301 - 400)",
    description: "Sungai bergemuruh membelah desa menjadi api dan es. Di sini netizen mudah diadu domba, membagi dunia menjadi kubu netizen radikal.",
    themeClass: "from-rose-950 via-[#ffab91]/90 to-rose-950",
    bgGradient: "bg-[#fbe9e7] bg-gradient-to-b from-[#bf360c]/40 via-[#d84315]/30 to-[#fbe9e7]",
    islandGradientStart: "#ffab91",
    islandGradientEnd: "#d84315",
    shoreColor: "#ffccbc",
    rippleColor: "#ffe0b2",
    roadColor: "#212121",
    roadCenterColor: "#ff5252",
    nodeColor: "bg-rose-400 hover:bg-rose-350 border-rose-600",
    activeColor: "bg-rose-500 text-white shadow-rose-500/50 border-white",
    borderColor: "stroke-rose-300",
    accentTextColor: "text-rose-800",
    particleColor: "bg-rose-400/30",
    icon: <Flame className="w-5 h-5" />,
    landmarks: [
      { level: 315, label: "Muara Kubu Cebong-Kampret 🌊", x: 2700, y: 440, icon: "🌊" },
      { level: 350, label: "Jembatan Retak Fragmentasi 🪵", x: 9000, y: 240, icon: "🪵" },
      { level: 385, label: "Ngarai Amarah Komentator 🌋", x: 15300, y: 480, icon: "🌋" }
    ],
    sceneryIcons: ["🌋", "🌊", "🔥", "⚠️", "⚠️", "🚩", "💥", "🚧", "🏮", "⚡", "🏰", "🏯", "⚔️", "🔥", "🌋"],
    seaOrnaments: [
      { icon: "🛶", x: 600, y: 55, animate: "animate-pulse" },
      { icon: "🌋", x: 2100, y: 515, animate: "animate-bounce" },
      { icon: "🛶", x: 4400, y: 45, animate: "animate-pulse" },
      { icon: "🦈", x: 6900, y: 520, animate: "animate-bounce" },
      { icon: "🛶", x: 9900, y: 65, animate: "animate-pulse" },
      { icon: "🌋", x: 13900, y: 510, animate: "animate-bounce" }
    ]
  },
  {
    name: "Kastil Berpikir Kritis",
    subTitle: "Wilayah 5 (Level 401 - 500)",
    description: "Kota melayang megah bersinar keemasan. Inilah pusat kesadaran digital, tempat pahlawan OutBubble memelihara literasi digital murni.",
    themeClass: "from-amber-950 via-[#ffe082]/90 to-amber-950",
    bgGradient: "bg-[#fffde7] bg-gradient-to-b from-[#f57f17]/40 via-[#ffeb3b]/20 to-[#fffde7]",
    islandGradientStart: "#ffe082",
    islandGradientEnd: "#ffb300",
    shoreColor: "#fff9c4",
    rippleColor: "#ffffff",
    roadColor: "#ef6c00",
    roadCenterColor: "#ffffff",
    nodeColor: "bg-amber-400 hover:bg-amber-350 border-amber-600",
    activeColor: "bg-amber-500 text-slate-900 shadow-amber-400/50 border-white",
    borderColor: "stroke-amber-300",
    accentTextColor: "text-amber-800",
    particleColor: "bg-amber-400/30",
    icon: <Award className="w-5 h-5" />,
    landmarks: [
      { level: 410, label: "Menara Verifikasi Fakta 🏰", x: 1800, y: 220, icon: "🏰" },
      { level: 450, label: "Kebun Logika Tanpa Bias 🌸", x: 9000, y: 460, icon: "🌸" },
      { level: 495, label: "Singgasana OutBubble Master 👑", x: 17100, y: 350, icon: "👑" }
    ],
    sceneryIcons: ["🏰", "👑", "📖", "📚", "💫", "🌟", "☄️", "🛡️", "👼", "🪐", "💎", "📜", "🗼", "🏰", "🎋", "🌟"],
    seaOrnaments: [
      { icon: "🎈", x: 650, y: 45, animate: "animate-bounce" },
      { icon: "🕊️", x: 2300, y: 520, animate: "animate-pulse" },
      { icon: "🏰", x: 5200, y: 55, animate: "animate-bounce" },
      { icon: "🎈", x: 8200, y: 515, animate: "animate-pulse" },
      { icon: "🛸", x: 12100, y: 60, animate: "animate-bounce" },
      { icon: "👑", x: 15100, y: 520, animate: "animate-pulse" }
    ]
  }
];

// --- 2. MULTI-LAYER MASCOT ORNAMENT ---
const BubulMascot: React.FC<{ className?: string }> = ({ className }) => (
  <div className={cn("relative flex items-center justify-center", className)}>
    <div className="absolute inset-0 bg-gradient-to-tr from-blue-400 via-emerald-300 to-white rounded-full animate-pulse blur-[1px]" />
    <div className="w-full h-full bg-gradient-to-br from-blue-400 to-indigo-600 rounded-full border border-white/80 shadow-md flex items-center justify-center relative overflow-hidden">
      <div className="absolute top-0.5 left-1 w-1/3 h-1/3 bg-white/40 rounded-full blur-[2px]" />
      <div className="flex gap-1.5 mb-1">
        <div className="w-2.5 h-2.5 bg-[#031466] rounded-full flex items-center justify-center relative">
          <div className="w-1 h-1 bg-white rounded-full absolute top-0.5 left-0.5" />
        </div>
        <div className="w-2.5 h-2.5 bg-[#031466] rounded-full flex items-center justify-center relative">
          <div className="w-1 h-1 bg-white rounded-full absolute top-0.5 left-0.5" />
        </div>
      </div>
    </div>
    <div className="absolute bottom-[20%] left-[20%] w-2 h-1 bg-pink-300/60 rounded-full" />
    <div className="absolute bottom-[20%] right-[20%] w-2 h-1 bg-pink-300/60 rounded-full" />
  </div>
);

// --- 3. MAIN COMPONENT ---
const TesSimulasi: React.FC = () => {
  const { user, addXP, updateProfile } = useStore();
  const currentLevel = user?.level || 1;

  // Track currently selected biome (0 to 4). Defaults to user's biome zone.
  const initialBiomeIndex = Math.min(4, Math.floor((currentLevel - 1) / 100));
  const [activeBiomeIdx, setActiveBiomeIdx] = useState<number>(initialBiomeIndex);
  
  // Quiz play state
  const [selectedPlayLevel, setSelectedPlayLevel] = useState<number | null>(null);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [isQuizFinished, setIsQuizFinished] = useState(false);

  const activeBiome = BIOMES[activeBiomeIdx];
  const mapRef = useRef<HTMLDivElement>(null);

  // Constants for map plotting (Inside each biome, 100 levels)
  const LEVEL_COUNT_PER_BIOME = 100;
  const NODE_SPACING = 180;
  const MAP_HEIGHT = 580;
  const AMPLITUDE = 140;
  const MAP_WIDTH = LEVEL_COUNT_PER_BIOME * NODE_SPACING + 300;

  // Generate 3 unique questions tailored for the selected level
  const questions = useMemo(() => {
    if (!selectedPlayLevel) return [];
    // We generate 3 questions per level to make it punchy, high-pace, and highly game-like.
    return [
      generateQuestion(selectedPlayLevel, 0, 'quiz'),
      generateQuestion(selectedPlayLevel, 1, 'quiz'),
      generateQuestion(selectedPlayLevel, 2, 'quiz')
    ];
  }, [selectedPlayLevel]);

  // Total stars collected (3 stars for each completed level)
  const totalStars = useMemo(() => {
    return Math.max(0, (currentLevel - 1) * 3);
  }, [currentLevel]);

  // Generate dynamic lush decorative models based on current active biome
  const sceneryDecorations = useMemo(() => {
    const items: { x: number; y: number; label: string; sizeClass: string; animateClass?: string }[] = [];
    const b = BIOMES[activeBiomeIdx];
    const count = 100;
    
    // Scan through levels with high density intervals
    for (let i = 0.5; i < count; i += 1.4) {
      const x = i * NODE_SPACING + 150 + (Math.sin(i * 1.8) * 32);
      const base_y = MAP_HEIGHT / 2 + Math.sin(i * 0.7) * AMPLITUDE;
      
      // Placed alternately on the land bank above or below the center road
      const isAbove = Math.round(i * 10) % 20 < 10;
      const offset = isAbove ? -(85 + Math.abs(Math.sin(i * 2.5) * 45)) : (85 + Math.abs(Math.cos(i * 2.5) * 45));
      const y = base_y + offset;
      
      const iconPool = b.sceneryIcons || ["🌳"];
      const label = iconPool[Math.floor((i * 23) % iconPool.length)];
      
      let sizeClass = "text-xl sm:text-2xl";
      let animateClass = "";
      
      if (["🏡", "🏰", "🏯", "🛖", "🌋", "🏛️", "🗼", "🌳", "🍎", "🐄"].includes(label)) {
        sizeClass = "text-3xl sm:text-4xl filter drop-shadow-md";
      }
      
      if (["🔥", "💫", "🫧", "🌟", "☄️"].includes(label)) {
        animateClass = "animate-pulse";
      }
      
      // Avoid overlaps with landmarks
      const isOverlappingLandmark = b.landmarks.some(l => {
        const dist = Math.sqrt(Math.pow(l.x - x, 2) + Math.pow(l.y - y, 2));
        return dist < 125;
      });
      
      if (!isOverlappingLandmark) {
        items.push({ x, y, label, sizeClass, animateClass });
      }
    }
    return items;
  }, [activeBiomeIdx]);

  // Scroll to active position on mount or biome changes
  useEffect(() => {
    if (mapRef.current) {
      // Find where currentLevel lives relative to current biome
      const levelOffset = currentLevel - (activeBiomeIdx * 100);
      if (levelOffset >= 1 && levelOffset <= 100) {
        const xPos = (levelOffset - 1) * NODE_SPACING + 150 - window.innerWidth / 2 + 100;
        mapRef.current.scrollLeft = Math.max(0, xPos);
      } else if (levelOffset < 1) {
        // Scroll to beginning
        mapRef.current.scrollLeft = 0;
      } else {
        // Scroll to end
        mapRef.current.scrollLeft = MAP_WIDTH;
      }
    }
  }, [activeBiomeIdx, currentLevel]);

  // Adjust active biome when level changes to keep user focused
  useEffect(() => {
    const calculatedBiome = Math.min(4, Math.floor((currentLevel - 1) / 100));
    setActiveBiomeIdx(calculatedBiome);
  }, [currentLevel]);

  // Option select handler
  const handleAnswerSelect = (optionIdx: number) => {
    if (selectedAnswer !== null) return;
    setSelectedAnswer(optionIdx);
    setShowExplanation(true);
    if (optionIdx === questions[currentQuestionIdx].correct) {
      setCorrectAnswers(prev => prev + 1);
    }
  };

  // Next step handler during quiz
  const handleNextStep = () => {
    if (currentQuestionIdx < 2) {
      setCurrentQuestionIdx(prev => prev + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    } else {
      setIsQuizFinished(true);
      // Logic: if passed (>= 2 correct of 3 questions)
      if (correctAnswers >= 2 && selectedPlayLevel) {
        // Award XP and advance user level if they completed their highest reached level
        const xpGained = correctAnswers * 20 + 40; // up to 100 XP
        addXP(xpGained);
        if (selectedPlayLevel === currentLevel) {
          updateProfile({ level: Math.min(500, currentLevel + 1) });
        }
      } else {
        addXP(correctAnswers * 5); // Consolation XP
      }
    }
  };

  // Skip or reset state to play another node
  const closeQuizModal = () => {
    setSelectedPlayLevel(null);
    setCurrentQuestionIdx(0);
    setCorrectAnswers(0);
    setSelectedAnswer(null);
    setShowExplanation(false);
    setIsQuizFinished(false);
  };

  const handleLaunchLevel = (level: number) => {
    if (level <= currentLevel) {
      setSelectedPlayLevel(level);
      setCurrentQuestionIdx(0);
      setCorrectAnswers(0);
      setSelectedAnswer(null);
      setShowExplanation(false);
      setIsQuizFinished(false);
    }
  };

  return (
    <div className={cn("min-h-screen text-[#031466] font-sans overflow-x-hidden flex flex-col pb-8 transition-colors duration-500", activeBiome.bgGradient)}>
      {/* HEADER HUD / ADVENTURE METRICS */}
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 pt-6">
        <div className="bg-white/90 backdrop-blur-2xl border-2 border-white shadow-lg p-5 rounded-[28px] flex flex-col lg:flex-row justify-between items-center gap-4 relative z-20">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-700 font-black text-white text-xl flex items-center justify-center shadow-md">
                {currentLevel}
              </div>
              <div className="absolute -bottom-1 -right-1 bg-yellow-400 text-[9px] font-black uppercase text-amber-950 px-1.5 py-0.5 rounded-full shadow border border-white flex items-center gap-0.5">
                <Compass className="w-2.5 h-2.5 animate-spin duration-3000" /> LVL
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-black italic tracking-tight text-[#031466] uppercase">Ksatria OutBubble</h1>
                <span className="bg-amber-100 border border-amber-300 text-amber-800 text-[9px] font-black px-2 py-0.5 rounded-full uppercase">Penyelamat Desa</span>
              </div>
              <p className="text-xs text-slate-500 font-semibold mt-0.5">Berpetualang melintasi <strong className="text-indigo-650">500 Gelembung Informasi</strong></p>
            </div>
          </div>

          {/* TOTAL ADVENTURE STATS */}
          <div className="grid grid-cols-3 gap-2 sm:gap-4 text-center">
            <div className="bg-slate-50 border border-slate-100 rounded-2xl px-3 py-1.5 sm:px-6 flex flex-col justify-center shadow-inner">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Bintang Desa</span>
              <div className="flex items-center justify-center gap-1 mt-0.5">
                <Star className="w-4 h-4 text-yellow-500 fill-yellow-400 font-black" />
                <span className="font-extrabold text-xs sm:text-sm">{totalStars} ✨</span>
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-100 rounded-2xl px-3 py-1.5 sm:px-6 flex flex-col justify-center shadow-inner">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Level Unlocked</span>
              <div className="flex items-center justify-center gap-1 mt-0.5">
                <Trophy className="w-4 h-4 text-amber-600 font-black" />
                <span className="font-extrabold text-xs sm:text-sm text-amber-800">{currentLevel} / 500</span>
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-100 rounded-2xl px-3 py-1.5 sm:px-6 flex flex-col justify-center shadow-inner">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Total XP Rasa</span>
              <div className="flex items-center justify-center gap-1 mt-0.5">
                <Coins className="w-4 h-4 text-emerald-500 font-bold" />
                <span className="font-extrabold text-xs sm:text-sm text-emerald-700">{user?.xp || 0} XP</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* BIOME TELEPORTER (FAST TRAVEL MAP) */}
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 mt-4 z-20">
        <div className="bg-slate-900/10 backdrop-blur-xl p-1.5 rounded-3xl grid grid-cols-2 md:grid-cols-5 gap-1 shadow-inner border border-white/25">
          {BIOMES.map((b, idx) => {
            const isSelected = activeBiomeIdx === idx;
            const isUnlocked = currentLevel >= idx * 100 + 1;
            return (
              <button
                key={idx}
                onClick={() => setActiveBiomeIdx(idx)}
                className={cn(
                  "py-2 sm:py-3 px-3 rounded-2xl text-[11px] font-black uppercase tracking-tight transition-all duration-350 flex items-center justify-center gap-1.5 border relative overflow-hidden active:scale-95",
                  isSelected
                    ? "bg-gradient-to-br from-[#031466] to-indigo-850 text-white shadow-lg border-transparent scale-102"
                    : "bg-white/65 hover:bg-white text-slate-700 border-slate-200"
                )}
              >
                <span className={cn(isSelected ? "text-yellow-400" : "text-slate-400")}>{b.icon}</span>
                <span className="text-center truncate">{b.name.split(" ")[0]}</span>
                {!isUnlocked && (
                  <Lock className="w-3 h-3 text-red-505 absolute top-1 right-1 opacity-60" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* IMMERSIVE MAP DESCRIPTION CARD */}
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 mt-3 z-10">
        <div className="bg-white/70 backdrop-blur-md p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-slate-700">
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="font-black text-xs text-[#031466] uppercase bg-slate-150 px-2 py-0.5 rounded-lg border border-slate-200/50">
                Peta Desa Bubul
              </span>
              <p className="font-bold text-xs uppercase tracking-wider text-slate-400">{activeBiome.subTitle}</p>
            </div>
            <h2 className="text-sm font-extrabold text-[#031466] mt-1">{activeBiome.name}: <span className="font-medium text-slate-600">{activeBiome.description}</span></h2>
          </div>
          <div className="flex items-center gap-1.5 text-[10px] sm:text-xs font-black bg-blue-50/70 border border-blue-200/50 text-[#031466] px-3 py-1.5 rounded-full shadow-inner self-stretch md:self-auto justify-center">
            <HelpCircle className="w-3.5 h-3.5 shrink-0" /> Pecahkan Gelembung dengan Klik Node Hijau/Biru!
          </div>
        </div>
      </div>

      {/* THE IMMERSIVE ROAD MAP VIEWPORT */}
      <div className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 mt-4 relative z-10 flex flex-col">
        <div className={cn(
          "border-[3px] border-white shadow-2xl rounded-[40px] overflow-hidden flex-1 relative flex flex-col min-h-[440px] transition-all duration-1000",
          activeBiome.bgGradient
        )}>
          
          {/* COMPASS ROSE VISUAL */}
          <div className="absolute top-4 left-4 z-45 bg-white/75 backdrop-blur-md rounded-2xl p-2 border border-slate-200/40 shadow-md flex items-center gap-2 pointer-events-none select-none">
            <motion.div 
              animate={{ rotate: 360 }} 
              transition={{ repeat: Infinity, duration: 25, ease: "linear" }}
              className="relative flex items-center justify-center w-8 h-8 rounded-full border border-slate-300"
            >
              <div className="absolute top-0.5 text-[6px] font-black text-red-650">N</div>
              <div className="absolute bottom-0.5 text-[6px] font-black text-slate-700">S</div>
              <div className="w-1 h-6 bg-gradient-to-b from-red-500 via-white to-indigo-900 rounded-full" />
            </motion.div>
            <div className="flex flex-col">
              <span className="text-[7px] font-black text-slate-400 tracking-wider">NAVIGATOR</span>
              <span className="text-[10px] font-black text-[#031466] leading-none uppercase">{activeBiome.name.split(" ")[0]}</span>
            </div>
          </div>

          {/* BACKGROUND SCENERY OVERLAYS */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
            {/* Scenic backdrop color based on active biome */}
            <div className="absolute inset-0 bg-blue-100/5 mix-blend-multiply" />
            
            {/* Floating Clouds Animation */}
            <motion.div 
              animate={{ x: [-120, window.innerWidth + 250] }} 
              transition={{ repeat: Infinity, duration: 32, ease: "linear" }}
              className="absolute top-8 left-0 text-7xl select-none opacity-20 filter blur-[1px]"
            >
              ☁️
            </motion.div>
            <motion.div 
              animate={{ x: [window.innerWidth + 250, -120] }} 
              transition={{ repeat: Infinity, duration: 45, ease: "linear" }}
              className="absolute top-24 right-0 text-8xl select-none opacity-15 filter blur-[2px]"
            >
              ☁️
            </motion.div>
            <motion.div 
              animate={{ y: [0, -15, 0] }}
              transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
              className="absolute bottom-16 right-16 text-6xl select-none opacity-25"
            >
              🫧
            </motion.div>
          </div>

          {/* SCROLLABLE PATH BOARD */}
          <div 
            ref={mapRef} 
            className="flex-1 overflow-x-auto overflow-y-hidden relative z-10 scrollbar-thin select-none py-6 cursor-grab active:cursor-grabbing"
            style={{ scrollBehavior: 'smooth' }}
          >
            <div className="relative animate-fadeIn duration-1000" style={{ width: `${MAP_WIDTH}px`, height: `${MAP_HEIGHT}px` }}>
              
              {/* THE GEOMETRIC ADVENTURE COBBLESTONE WINDING ROAD */}
              <svg className="absolute top-0 left-0 w-full h-full pointer-events-none z-10">
                <defs>
                  <linearGradient id="island-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor={activeBiome.islandGradientStart} />
                    <stop offset="100%" stopColor={activeBiome.islandGradientEnd} />
                  </linearGradient>
                  <linearGradient id="road-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor={activeBiome.roadColor === '#212121' ? '#333333' : '#4e342e'} />
                    <stop offset="50%" stopColor={activeBiome.roadColor} />
                    <stop offset="100%" stopColor={activeBiome.roadColor === '#212121' ? '#111111' : '#3e2723'} />
                  </linearGradient>
                </defs>

                {/* ISLAND SEA FOAM RIPPLE (OUTERMOST FOAM) */}
                <path 
                  d={`M 150,${MAP_HEIGHT / 2} ${Array.from({ length: LEVEL_COUNT_PER_BIOME }).map((_, i) => {
                    const x = i * NODE_SPACING + 150;
                    const y = MAP_HEIGHT / 2 + Math.sin(i * 0.7) * AMPLITUDE;
                    return `L ${x},${y}`;
                  }).join(" ")}`} 
                  fill="none" 
                  stroke={activeBiome.rippleColor} 
                  strokeWidth="380" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  opacity="0.35" 
                />

                {/* ISLAND SAND SHORELINE (MIDDLE BEACH) */}
                <path 
                  d={`M 150,${MAP_HEIGHT / 2} ${Array.from({ length: LEVEL_COUNT_PER_BIOME }).map((_, i) => {
                    const x = i * NODE_SPACING + 150;
                    const y = MAP_HEIGHT / 2 + Math.sin(i * 0.7) * AMPLITUDE;
                    return `L ${x},${y}`;
                  }).join(" ")}`} 
                  fill="none" 
                  stroke={activeBiome.shoreColor} 
                  strokeWidth="350" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  opacity="0.95" 
                />

                {/* ISLAND LAND MASS BODY (INNER LAND GRASS/ROCK) */}
                <path 
                  d={`M 150,${MAP_HEIGHT / 2} ${Array.from({ length: LEVEL_COUNT_PER_BIOME }).map((_, i) => {
                    const x = i * NODE_SPACING + 150;
                    const y = MAP_HEIGHT / 2 + Math.sin(i * 0.7) * AMPLITUDE;
                    return `L ${x},${y}`;
                  }).join(" ")}`} 
                  fill="none" 
                  stroke="url(#island-grad)" 
                  strokeWidth="315" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                />

                {/* MAIN COBBLESTONE WINDING ROAD SHADOW */}
                <path 
                  d={`M 150,${MAP_HEIGHT / 2} ${Array.from({ length: LEVEL_COUNT_PER_BIOME }).map((_, i) => {
                    const x = i * NODE_SPACING + 150;
                    const y = MAP_HEIGHT / 2 + Math.sin(i * 0.7) * AMPLITUDE;
                    return `L ${x},${y}`;
                  }).join(" ")}`} 
                  fill="none" 
                  stroke="#111111" 
                  strokeWidth="42" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  opacity="0.15" 
                />

                {/* COBBLESTONE ROAD MAIN LANE */}
                <path 
                  d={`M 150,${MAP_HEIGHT / 2} ${Array.from({ length: LEVEL_COUNT_PER_BIOME }).map((_, i) => {
                    const x = i * NODE_SPACING + 150;
                    const y = MAP_HEIGHT / 2 + Math.sin(i * 0.7) * AMPLITUDE;
                    return `L ${x},${y}`;
                  }).join(" ")}`} 
                  fill="none" 
                  stroke="url(#road-grad)" 
                  strokeWidth="28" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                />

                {/* Dashed Center Adventure Trail */}
                <path 
                  d={`M 150,${MAP_HEIGHT / 2} ${Array.from({ length: LEVEL_COUNT_PER_BIOME }).map((_, i) => {
                    const x = i * NODE_SPACING + 150;
                    const y = MAP_HEIGHT / 2 + Math.sin(i * 0.7) * AMPLITUDE;
                    return `L ${x},${y}`;
                  }).join(" ")}`} 
                  fill="none" 
                  stroke={activeBiome.roadCenterColor} 
                  strokeWidth="4" 
                  strokeLinecap="round" 
                  strokeDasharray="12 16" 
                  opacity="0.9"
                />
              </svg>

              {/* RENDER DYNAMIC ANIMATED SEA ORNAMENTS IN THE OCEAN */}
              {activeBiome.seaOrnaments && activeBiome.seaOrnaments.map((o, idx) => (
                <motion.div
                  key={`sea-ornament-${idx}`}
                  style={{ left: o.x, top: o.y, transform: 'translate(-50%, -50%)' }}
                  animate={{ 
                    y: [o.y - 6, o.y + 6, o.y - 6],
                    rotate: [-2, 2, -2]
                  }}
                  transition={{ repeat: Infinity, duration: 5 + (idx % 3), ease: "easeInOut" }}
                  className={cn("absolute text-5xl select-none pointer-events-none drop-shadow-md z-5 filter hover:scale-115 transition-transform", o.animate || "")}
                >
                  {o.icon}
                </motion.div>
              ))}

              {/* RENDER BEAUTIFUL LUSH SCENERY DECORATIONS SCATTERED ACROSS THE ISLAND */}
              {sceneryDecorations.map((scenery, idx) => (
                <motion.div 
                  key={`scenery-${idx}`}
                  style={{ left: scenery.x, top: scenery.y }}
                  animate={scenery.animateClass ? { scale: [1, 1.08, 1], rotate: [-2, 2, -2] } : { y: [0, -2, 0] }}
                  transition={{ repeat: Infinity, duration: 4 + (idx % 3), ease: "easeInOut" }}
                  className={cn(
                    "absolute z-12 select-none pointer-events-none transform -translate-x-1/2 -translate-y-1/2 cursor-default transition-all duration-305",
                    scenery.sizeClass
                  )}
                >
                  {scenery.label}
                </motion.div>
              ))}

              {/* RENDER BEAUTIFUL VIBRANT LANDMARKS */}
              {activeBiome.landmarks.map((landmark, idx) => (
                <div 
                  key={`landmark-${idx}`} 
                  className="absolute z-15 flex flex-col items-center pointer-events-none filter drop-shadow-lg"
                  style={{ left: landmark.x, top: landmark.y - 70, transform: 'translate(-50%, -50%)' }}
                >
                  <div className="text-5xl animate-bounce duration-5000">{landmark.icon}</div>
                  <div className="bg-slate-900/90 text-[10px] font-black tracking-tight text-white border border-white/25 px-2.5 py-1 rounded-full whitespace-nowrap mt-1 uppercase">
                    {landmark.label}
                  </div>
                </div>
              ))}

              {/* RENDER LEVEL NODES */}
              {Array.from({ length: LEVEL_COUNT_PER_BIOME }).map((_, i) => {
                const biomeStartLevel = (activeBiomeIdx * 100) + 1;
                const level = biomeStartLevel + i;
                
                const xPos = i * NODE_SPACING + 150; 
                const yPos = MAP_HEIGHT / 2 + Math.sin(i * 0.7) * AMPLITUDE;
                
                const isReached = currentLevel >= level;
                const isCurrent = currentLevel === level;
                const isLocked = !isReached;

                return (
                  <div 
                    key={level} 
                    className="absolute z-30" 
                    style={{ left: xPos, top: yPos, transform: 'translate(-50%, -50%)' }}
                  >
                    <div className="relative flex flex-col items-center">
                      
                      {/* Completed Stars Indicator */}
                      {isReached && !isCurrent && (
                        <div className="absolute -top-7 flex gap-0.5 justify-center w-20 pointer-events-none drop-shadow-md">
                          <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-400 font-bold" />
                          <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-400 font-bold" />
                          <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-400 font-bold" />
                        </div>
                      )}

                      {/* Clickable Node */}
                      <motion.button 
                        whileHover={!isLocked ? { scale: 1.15 } : {}}
                        whileTap={!isLocked ? { scale: 0.92 } : {}}
                        onClick={() => handleLaunchLevel(level)}
                        className={cn(
                          "w-14 h-14 rounded-full border-4 flex items-center justify-center font-black relative shadow-lg transition-all duration-300",
                          isCurrent 
                            ? "bg-gradient-to-tr from-yellow-400 via-amber-300 to-white text-slate-900 border-white ring-4 ring-[#031466]/40 text-lg sm:text-xl h-18 w-18 z-20 animate-pulse duration-1000" 
                            : isReached 
                              ? "bg-gradient-to-tr from-blue-500 to-indigo-600 text-white border-white text-base" 
                              : "bg-[#808b96]/80 text-slate-500 border-slate-350 cursor-not-allowed opacity-80"
                        )}
                      >
                        {isLocked ? (
                          <Lock className="w-4 h-4 text-slate-400" />
                        ) : (
                          level
                        )}
                        
                        {/* Interactive Sparkle Effect on Current Flag */}
                        {isCurrent && (
                          <span className="absolute -top-1.5 -right-1 z-30 bg-[#031466] text-amber-300 text-[8px] font-black px-1.5 py-0.5 rounded-full uppercase border border-white whitespace-nowrap tracking-tighter flex items-center gap-0.5">
                            <Sparkles className="w-2.5 h-2.5 text-yellow-500 animate-pulse" /> MAIN
                          </span>
                        )}
                      </motion.button>

                      {/* Little Bubul mascot sitting on top of current position */}
                      {isCurrent && (
                        <motion.div 
                          animate={{ y: [0, -7, 0] }} 
                          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }} 
                          className="absolute -top-16 pointer-events-none z-40 flex flex-col items-center"
                        >
                          <div className="bg-slate-900/90 text-[8px] font-bold text-white px-2 py-0.5 rounded-md shadow border border-white/20 mb-1 tracking-tight">Kamu di sini</div>
                          <BubulMascot className="w-8 h-8 drop-shadow-xl" />
                        </motion.div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* --- 4. PRETTIFIED INTEGRATED QUIZ DIALOG / MODAL PANEL --- */}
      <AnimatePresence>
        {selectedPlayLevel && questions.length > 0 && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 backdrop-blur-md bg-[#031466]/70"
          >
            {/* Backdrop Closer */}
            <div className="absolute inset-0" onClick={closeQuizModal} />

            {/* Immersive Adventure Quest Book Box */}
            <motion.div 
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              transition={{ type: "spring", stiffness: 350, damping: 24 }}
              className="bg-white rounded-[32px] sm:rounded-[40px] shadow-[0_20px_60px_-10px_rgba(0,0,0,0.5)] border-4 border-slate-100 max-w-2xl w-full relative z-10 overflow-hidden flex flex-col text-[#031466]"
            >
              
              {/* Card Header Info */}
              <div className="bg-gradient-to-r from-[#031466] to-indigo-850 p-6 text-white flex justify-between items-center relative border-b-4 border-yellow-405">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full bg-white/10 flex items-center justify-center text-xl shadow-inner border border-white/10">
                    🏹
                  </div>
                  <div>
                    <h3 className="font-black text-base sm:text-lg italic tracking-tight uppercase flex items-center gap-1.5">
                      Tantangan Level {selectedPlayLevel}
                    </h3>
                    <p className="text-[10px] text-yellow-300 font-black uppercase tracking-wider">{activeBiome.name}</p>
                  </div>
                </div>
                <button 
                  onClick={closeQuizModal}
                  className="p-1.5 bg-white/10 hover:bg-white/20 transition-all rounded-full text-white/80 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Main Dialog Viewports */}
              <div className="p-6 sm:p-8 flex-1 overflow-y-auto">
                <AnimatePresence mode="wait">
                  {!isQuizFinished ? (
                    <motion.div 
                      key={`q-${currentQuestionIdx}`} 
                      initial={{ opacity: 0, x: 20 }} 
                      animate={{ opacity: 1, x: 0 }} 
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-6"
                    >
                      {/* Step trackers */}
                      <div className="flex justify-between items-center text-[10px] font-black uppercase text-slate-400 tracking-wider">
                        <span>SOAL {currentQuestionIdx + 1} DARI 3</span>
                        <span className="text-indigo-650 flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> {correctAnswers} Benar
                        </span>
                      </div>

                      {/* Rich Progress Bar */}
                      <div className="h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-100 shadow-inner">
                        <div 
                          className="h-full bg-gradient-to-r from-[#031466] to-indigo-600 transition-all duration-300" 
                          style={{ width: `${((currentQuestionIdx + 1) / 3) * 100}%` }}
                        />
                      </div>

                      {/* Question Text */}
                      <div className="bg-slate-50 border border-slate-100 p-5 rounded-2xl text-center shadow-inner relative overflow-hidden">
                        <div className="absolute top-1 left-2 text-3xl opacity-10 font-serif select-none">“</div>
                        <p className="text-sm sm:text-base font-extrabold text-slate-800 leading-relaxed text-center">
                          {questions[currentQuestionIdx]?.q}
                        </p>
                      </div>

                      {/* Multi-choice options */}
                      <div className="grid grid-cols-1 gap-2.5">
                        {questions[currentQuestionIdx]?.options.map((opt, optionIdx) => {
                          const isAnswered = selectedAnswer !== null;
                          const isCorrectOpt = optionIdx === questions[currentQuestionIdx].correct;
                          const isSelectedOpt = optionIdx === selectedAnswer;

                          return (
                            <button
                              key={optionIdx}
                              disabled={isAnswered}
                              onClick={() => handleAnswerSelect(optionIdx)}
                              className={cn(
                                "w-full p-4.5 rounded-2xl border-2 text-left text-xs sm:text-sm font-extrabold flex justify-between items-center transition-all",
                                !isAnswered 
                                  ? "bg-white border-slate-200/80 hover:border-indigo-600 hover:bg-indigo-50/40 text-slate-700 active:scale-99" 
                                  : isCorrectOpt
                                    ? "bg-emerald-50 border-emerald-500 text-emerald-800 shadow-inner"
                                    : isSelectedOpt
                                      ? "bg-rose-50 border-rose-500 text-rose-800"
                                      : "bg-white/45 text-slate-400 border-slate-100"
                              )}
                            >
                              <span className="pr-4">{opt}</span>
                              {isAnswered && isCorrectOpt && (
                                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                              )}
                              {isAnswered && isSelectedOpt && !isCorrectOpt && (
                                <X className="w-5 h-5 text-rose-600 shrink-0" />
                              )}
                            </button>
                          );
                        })}
                      </div>

                      {/* Live academia feedback explanation */}
                      {showExplanation && (
                        <motion.div 
                          initial={{ opacity: 0, height: 0 }} 
                          animate={{ opacity: 1, height: 'auto' }}
                          className="p-5 bg-indigo-50 border border-indigo-100 rounded-2xl flex gap-3 text-slate-700 mt-2"
                        >
                          <BubulMascot className="w-10 h-10 shrink-0 drop-shadow shadow-white z-0 mt-0.5" />
                          <div>
                            <span className="bg-[#031466] text-white text-[8px] font-black uppercase px-2 py-0.5 rounded-md shadow tracking-wider">
                              Reasoning Bubul
                            </span>
                            <p className="text-xs sm:text-sm font-semibold text-[#031466] mt-1.5 leading-relaxed italic">
                              "{questions[currentQuestionIdx]?.explanation}"
                            </p>
                            <button
                              onClick={handleNextStep}
                              className="mt-3 bg-[#031466] hover:bg-indigo-850 text-white font-black text-[11px] px-4 py-2 rounded-xl shadow flex items-center gap-1"
                            >
                              {currentQuestionIdx < 2 ? "Lanjut Soal" : "Lihat Hasil"} <ChevronRight className="w-3 h-3" />
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </motion.div>
                  ) : (
                    /* VICTORY LEVEL UPS AND FEEDBACKS */
                    <motion.div 
                      initial={{ scale: 0.95 }} 
                      animate={{ scale: 1 }}
                      className="text-center py-6 flex flex-col items-center space-y-5"
                    >
                      {correctAnswers >= 2 ? (
                        <>
                          {/* PASS ANIMATIONS */}
                          <div className="w-24 h-24 bg-emerald-100 border-4 border-emerald-400 rounded-full flex flex-col items-center justify-center animate-bounce shadow-lg">
                            <Star className="w-12 h-12 text-yellow-500 fill-yellow-400 font-extrabold" />
                          </div>
                          <div className="space-y-1">
                            <span className="bg-yellow-100 border border-yellow-300 text-amber-800 text-[10px] font-black px-3 py-1 rounded-full uppercase">
                              Level Berhasil Dilewati! ⭐⭐⭐
                            </span>
                            <h2 className="text-xl sm:text-2xl font-black italic mt-2 uppercase text-[#031466] tracking-tighter">
                              Bubul Menyala Abangku! 🫧
                            </h2>
                            <p className="text-slate-500 text-xs font-semibold max-w-sm mx-auto leading-relaxed">
                              Kamu membuktikan ketangkasan logika menembus gelembung algoritma di Level {selectedPlayLevel}!
                            </p>
                          </div>
                          
                          {/* Gain Rewards cards */}
                          <div className="bg-[#f8faff] border border-blue-100 p-4 rounded-2xl w-full max-w-xs grid grid-cols-2 gap-2 text-center shadow-inner">
                            <div className="flex flex-col items-center justify-center border-r border-slate-100">
                              <span className="text-[9px] font-black uppercase text-slate-400">XP Diperoleh</span>
                              <span className="text-sm font-black text-emerald-600">+{correctAnswers * 20 + 40} XP 🪙</span>
                            </div>
                            <div className="flex flex-col items-center justify-center">
                              <span className="text-[9px] font-black uppercase text-slate-400">Score Kita</span>
                              <span className="text-sm font-black text-indigo-700">{correctAnswers} / 3 Benar</span>
                            </div>
                          </div>

                          <div className="flex gap-3 justify-center w-full max-w-sm mt-2">
                            <button 
                              onClick={closeQuizModal}
                              className="flex-1 py-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-[#031466] font-black uppercase text-[10px] rounded-xl"
                            >
                              Kembali ke Peta
                            </button>
                            
                            {selectedPlayLevel === currentLevel && currentLevel < 500 && (
                              <button 
                                onClick={() => {
                                  // Advance immediately to next level in modal
                                  const nextLvl = currentLevel + 1;
                                  setSelectedPlayLevel(nextLvl);
                                  setCurrentQuestionIdx(0);
                                  setCorrectAnswers(0);
                                  setSelectedAnswer(null);
                                  setShowExplanation(false);
                                  setIsQuizFinished(false);
                                }}
                                className="flex-1 py-3 bg-gradient-to-r from-emerald-500 to-green-650 text-white font-black uppercase text-[10px] rounded-xl shadow-md"
                              >
                                Lanjut Lvl {currentLevel + 1}
                              </button>
                            )}
                          </div>
                        </>
                      ) : (
                        /* REPLAY / RETRY FEEDBACKS */
                        <>
                          <div className="w-24 h-24 bg-rose-100 border-4 border-rose-400 rounded-full flex flex-col items-center justify-center shadow-lg">
                            <AlertCircle className="w-12 h-12 text-rose-500" />
                          </div>
                          <div className="space-y-1">
                            <span className="bg-rose-100 border border-rose-300 text-rose-800 text-[10px] font-black px-3 py-1 rounded-full uppercase">
                              Butuh Belajar Lagi 📚
                            </span>
                            <h2 className="text-xl sm:text-2xl font-black italic mt-2 uppercase text-rose-950 tracking-tighter">
                              Aduh, Gelembung Masih Kuat!
                            </h2>
                            <p className="text-slate-500 text-xs font-semibold max-w-sm mx-auto leading-relaxed">
                              Kamu butuh menjawab minimal 2 soal dengan benar untuk menetralisir level ini. Yuk, coba ulang atau baca petunjuk materi!
                            </p>
                          </div>

                          <div className="flex gap-3 justify-center w-full max-w-sm mt-3">
                            <button 
                              onClick={closeQuizModal}
                              className="flex-1 py-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-[#031466] font-black uppercase text-[10px] rounded-xl"
                            >
                              Peta Perjalanan
                            </button>
                            
                            <button 
                              onClick={() => {
                                // Try again
                                setCurrentQuestionIdx(0);
                                setCorrectAnswers(0);
                                setSelectedAnswer(null);
                                setShowExplanation(false);
                                setIsQuizFinished(false);
                              }}
                              className="flex-1 py-3 bg-[#031466] hover:bg-indigo-850 text-white font-black uppercase text-[10px] rounded-xl shadow-md"
                            >
                              Main Ulang
                            </button>
                          </div>
                        </>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TesSimulasi;
