import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Menu,
  MessageSquare,
  Globe,
  X,
  Star
} from 'lucide-react';
import { useStore } from '../lib/store';
import { cn } from '../lib/utils';

import Sidebar from './Sidebar';
import BubulChat from './BubulChat';
import AuthModal from './AuthModal';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showChat, setShowChat] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const location = useLocation();
  const { user, hasChosenInitialAuth, openAuthModal } = useStore();

  // Auto show welcome gateway on initial page load if not chosen yet
  React.useEffect(() => {
    if (!hasChosenInitialAuth) {
      openAuthModal('welcome');
    }
  }, [hasChosenInitialAuth, openAuthModal]);

  // Detect screen size for responsiveness in Layout
  React.useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) setSidebarOpen(false);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="min-h-screen bg-[#f8faff] flex flex-col md:flex-row font-['Plus_Jakarta_Sans']">
      <AuthModal />
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

      {/* Main Content */}
      <motion.main 
        layout
        animate={{ 
          marginLeft: isMobile ? 0 : (sidebarOpen ? 280 : 88),
          paddingLeft: 0
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="flex-1 min-h-screen relative overflow-x-hidden flex flex-col"
      >
        {/* Mobile Sticky Top Header */}
        <header className="md:hidden sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#b8c9ff]/40 px-4 py-3 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2.5 rounded-2xl bg-blue-50 text-[#031466] hover:bg-blue-100 transition-colors border border-blue-100 shadow-sm active:scale-95"
              aria-label="Buka Menu"
            >
              <Menu size={22} />
            </button>
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-[#031466] rounded-xl flex items-center justify-center text-white shadow-md">
                <Globe size={18} />
              </div>
              <span className="text-lg font-black text-[#031466] uppercase tracking-wider">OutBubble</span>
            </Link>
          </div>

          <Link to="/profile" className="flex items-center gap-1.5 px-3 py-1.5 bg-[#031466] text-white rounded-full text-xs font-black shadow-md border border-white/20 hover:scale-105 transition-transform">
            <Star size={12} className="text-amber-300 fill-amber-300" />
            <span>Lvl {user?.level || 1}</span>
          </Link>
        </header>

        {/* Floating Chatbot Bubul Toggle */}
        <div className="fixed bottom-4 right-4 md:bottom-8 md:right-8 z-50">
          <button 
            onClick={() => setShowChat(!showChat)}
            className="w-14 h-14 md:w-16 md:h-16 bg-[#031466] text-white rounded-full flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95 transition-transform group relative border-2 border-white/30"
            aria-label="Tanya Bubul"
          >
            {showChat ? <X size={24} className="md:w-7 md:h-7" /> : <MessageSquare size={24} className="md:w-7 md:h-7" />}
            <span className="hidden md:block absolute right-full mr-4 bg-white text-[#031466] px-4 py-2 rounded-2xl shadow-xl text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-[#b8c9ff]/30">
              {showChat ? 'Tutup Bubul' : 'Tanya Bubul! 🫧'}
            </span>
          </button>
        </div>

        {/* Chat Overlay */}
        <AnimatePresence>
          {showChat && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-3 sm:p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="w-full max-w-2xl max-h-[92vh] flex flex-col"
              >
                <BubulChat onClose={() => setShowChat(false)} />
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        <div className="p-3 sm:p-5 md:p-8 max-w-7xl mx-auto w-full flex-1">
          {children}
        </div>
      </motion.main>
    </div>
  );
};

export default Layout;
