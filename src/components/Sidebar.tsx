import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Home, 
  BookOpen, 
  Zap, 
  Compass, 
  Menu, 
  LogOut,
  Globe,
  ChevronLeft,
  PenTool,
  MessageCircle,
  TrendingUp,
  User as UserIcon,
  X,
  Sparkles
} from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { cn } from '../lib/utils';
import { useStore } from '../lib/store';

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, setIsOpen }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, openAuthModal, logoutUser } = useStore();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsMobile(true);
        setIsOpen(false); 
      } else {
        setIsMobile(false);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [setIsOpen]);

  const navItems = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'Materi', path: '/materi', icon: BookOpen },
    { name: 'Tes & Simulasi', path: '/tes', icon: Zap },
    { name: 'Explore Content', path: '/explore', icon: Compass },
    { name: 'Refleksi', path: '/refleksi', icon: PenTool },
    { name: 'Diskusi', path: '/forum', icon: MessageCircle },
    { name: 'Insight Sosial', path: '/insight', icon: TrendingUp },
    { name: 'Status Saya', path: '/profile', icon: UserIcon },
  ];

  const handleMenuClick = () => {
    if (isMobile) setIsOpen(false);
  };

  return (
    <>
      {/* MOBILE FLOATING BUTTON */}
      <AnimatePresence>
        {isMobile && !isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 left-6 z-[100] w-16 h-16 bg-[#031466] text-white rounded-full flex items-center justify-center shadow-2xl border-4 border-white/20"
          >
            <Globe className="w-7 h-7" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* OVERLAY */}
      <AnimatePresence>
        {isMobile && isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-[#031466]/60 backdrop-blur-sm z-[80]"
          />
        )}
      </AnimatePresence>

      <motion.aside
        layout
        initial={false}
        animate={{ 
          width: isMobile ? (isOpen ? 280 : 0) : (isOpen ? 280 : 88),
          x: isMobile ? (isOpen ? 16 : -320) : 0,
          y: isMobile ? (isOpen ? -16 : 0) : 0,
          height: isMobile ? 'calc(100% - 32px)' : '100vh'
        }}
        className={cn(
          "bg-white/90 backdrop-blur-2xl border border-[#b8c9ff]/30 flex flex-col fixed left-0 top-0 z-[90] transition-all duration-300",
          isMobile ? "rounded-[35px] shadow-2xl overflow-hidden" : "h-screen border-r shadow-lg"
        )}
      >
        {/* HEADER */}
        <div className={cn("p-6 flex items-center justify-between", !isOpen && !isMobile && "justify-center")}>
          {(isOpen || isMobile) ? (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#031466] rounded-xl flex items-center justify-center text-white shadow-lg">
                <Globe size={24} />
              </div>
              <span className="text-xl font-black text-[#031466] uppercase">OutBubble</span>
            </div>
          ) : (
            <div className="w-12 h-12 bg-[#031466] rounded-2xl flex items-center justify-center cursor-pointer" onClick={() => setIsOpen(true)}>
              <Globe className="text-white w-6 h-6" />
            </div>
          )}

          {isMobile ? (
            <button 
              onClick={() => setIsOpen(false)} 
              className="p-2 rounded-xl text-slate-500 hover:bg-slate-100 transition-colors"
              aria-label="Tutup Menu"
            >
              <X size={22} />
            </button>
          ) : (
            <button onClick={() => setIsOpen(!isOpen)} className={cn("p-2 rounded-xl text-[#031466]/40 hover:bg-blue-50 transition-all", !isOpen && "absolute -right-4 top-8 bg-white border shadow-md p-1.5 rounded-full")}>
              {isOpen ? <Menu size={20} /> : <ChevronLeft size={16} className="rotate-180" />}
            </button>
          )}
        </div>

        {/* NAVIGATION */}
        <nav className="flex-1 px-4 py-4 space-y-2 overflow-y-auto no-scrollbar">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={handleMenuClick}
                className={cn(
                  "group flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all font-bold",
                  isActive ? "bg-[#031466] text-white shadow-md" : "text-slate-500 hover:bg-blue-50",
                  !isOpen && !isMobile && "justify-center px-0"
                )}
              >
                <item.icon className={cn("w-5 h-5 shrink-0", isActive && "animate-pulse")} />
                {(isOpen || isMobile) && <span className="text-sm">{item.name}</span>}
              </Link>
            );
          })}
        </nav>

        {/* FOOTER - USER AUTH STATUS */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/50">
          {/* User Account Bar */}
          <div className={cn(
            "bg-white border border-slate-200 p-3 rounded-[22px] shadow-sm flex items-center justify-between gap-2",
            !isOpen && !isMobile && "flex-col p-2"
          )}>
            <div className="flex items-center gap-2.5 overflow-hidden">
              {user?.photoUrl && (user.photoUrl.startsWith('http') || user.photoUrl.startsWith('/')) ? (
                <img
                  src={user.photoUrl}
                  alt="Profile"
                  className="w-8 h-8 rounded-full border border-slate-200 bg-slate-100 shrink-0 object-cover"
                />
              ) : (
                <div className="w-8 h-8 rounded-full border border-slate-200 bg-blue-100 flex items-center justify-center text-sm shrink-0">
                  {user?.photoUrl || '🫧'}
                </div>
              )}

              {(isOpen || isMobile) && (
                <div className="overflow-hidden text-left">
                  <h5 className="text-xs font-black text-[#031466] truncate">{user?.username || 'Tamu OutBubble'}</h5>
                  <p className="text-[10px] text-slate-400 font-bold truncate">
                    {user?.isGuest ? '🫧 Mode Tamu' : (user?.email || 'Akun Terdaftar')}
                  </p>
                </div>
              )}
            </div>

            {(isOpen || isMobile) ? (
              user?.isGuest ? (
                <button
                  onClick={() => openAuthModal('welcome')}
                  className="px-3 py-1.5 bg-[#031466] text-white rounded-xl text-[11px] font-black hover:bg-blue-900 transition-colors shadow-sm shrink-0 cursor-pointer"
                >
                  Masuk / Daftar
                </button>
              ) : (
                <button
                  onClick={logoutUser}
                  className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
                  title="Keluar Akun"
                >
                  <LogOut size={16} />
                </button>
              )
            ) : null}
          </div>
        </div>
      </motion.aside>
    </>
  );
};

export default Sidebar;