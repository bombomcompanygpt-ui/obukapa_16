import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion'; // We'll fix Framer Motion import
import { X, LogIn, UserPlus, Globe, Sparkles, CheckCircle, ShieldCheck, ArrowRight, Lock, Key } from 'lucide-react';
import { useStore } from '../lib/store';

const AVATAR_SEEDS = ['Felix', 'Anika', 'Buster', 'Daisy', 'Jack', 'Leo', 'Milo', 'Zoe'];

export const AuthModal: React.FC = () => {
  const {
    authModalOpen,
    authModalMode,
    authModalReason,
    closeAuthModal,
    openAuthModal,
    setHasChosenInitialAuth,
    loginUser,
    registerUser,
    user
  } = useStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState('Felix');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!authModalOpen) return null;

  const handleContinueAsGuest = () => {
    setHasChosenInitialAuth(true);
    closeAuthModal();
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setErrorMsg('Harap isi email dan kata sandi Anda.');
      return;
    }
    setErrorMsg('');
    loginUser(email.trim(), password);
    setSuccessMsg('Berhasil masuk! Selamat datang kembali.');
    setTimeout(() => {
      setSuccessMsg('');
      closeAuthModal();
    }, 1000);
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !email.trim() || !password.trim()) {
      setErrorMsg('Harap lengkapi nama, email, dan kata sandi.');
      return;
    }
    setErrorMsg('');
    const avatarUrl = `https://api.dicebear.com/7.x/avataaars/svg?seed=${selectedAvatar}`;
    registerUser(username.trim(), email.trim(), avatarUrl);
    setSuccessMsg('Akun berhasil dibuat! Anda siap beraktivitas.');
    setTimeout(() => {
      setSuccessMsg('');
      closeAuthModal();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-[#031466]/70 backdrop-blur-md overflow-y-auto font-['Plus_Jakarta_Sans']">
      <div 
        className="relative w-full max-w-lg bg-white rounded-[32px] sm:rounded-[40px] shadow-2xl border-4 border-white overflow-hidden my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header decoration */}
        <div className="bg-gradient-to-r from-[#031466] via-[#052199] to-blue-600 p-6 sm:p-8 text-white relative overflow-hidden">
          <div className="absolute top-[-40px] right-[-40px] w-48 h-48 bg-blue-400/20 rounded-full blur-2xl pointer-events-none" />
          
          <button
            onClick={handleContinueAsGuest}
            className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors cursor-pointer"
            aria-label="Tutup"
          >
            <X size={20} />
          </button>

          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center text-white border border-white/20 shadow-md">
              <Globe size={22} className="text-blue-300" />
            </div>
            <span className="text-sm font-black tracking-widest uppercase text-blue-200">OutBubble Platform</span>
          </div>

          <h3 className="text-2xl sm:text-3xl font-black text-white leading-tight">
            {authModalMode === 'welcome' && 'Selamat Datang! 🫧'}
            {authModalMode === 'login' && 'Masuk ke Akun 🔑'}
            {authModalMode === 'register' && 'Daftar Akun Baru ✨'}
          </h3>
          <p className="text-xs sm:text-sm text-blue-100 font-medium mt-1">
            {authModalMode === 'welcome' && 'Pilih metode untuk menjelajahi platform edukasi literasi digital.'}
            {authModalMode === 'login' && 'Masuk untuk menyimpan progress refleksi & memposting diskusi.'}
            {authModalMode === 'register' && 'Buat profil baru untuk bergabung dengan komunitas OutBubble.'}
          </p>

          {/* Reason Notification Banner if prompted by posting attempt */}
          {authModalReason && (
            <div className="mt-4 p-3 bg-amber-400/20 border border-amber-300/40 rounded-2xl flex items-start gap-2 text-amber-100 text-xs font-bold animate-pulse">
              <Lock size={16} className="shrink-0 mt-0.5 text-amber-300" />
              <span>{authModalReason}</span>
            </div>
          )}
        </div>

        <div className="p-6 sm:p-8 space-y-6">
          {/* WELCOME GATEWAY MODE */}
          {authModalMode === 'welcome' && (
            <div className="space-y-4">
              <p className="text-slate-600 text-sm font-medium text-center">
                Silakan pilih opsi akses yang Anda inginkan di bawah ini:
              </p>

              <div className="space-y-3 pt-2">
                {/* 1. Akses Web Tanpa Akun */}
                <button
                  onClick={handleContinueAsGuest}
                  className="w-full group p-4 sm:p-5 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-2xl font-black text-base shadow-lg hover:shadow-emerald-200 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-between border border-emerald-400 cursor-pointer"
                >
                  <div className="flex items-center gap-3.5 text-left">
                    <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center shrink-0">
                      <Globe size={22} className="text-white" />
                    </div>
                    <div>
                      <h4 className="font-extrabold text-sm sm:text-base leading-tight">Akses Web Tanpa Akun</h4>
                      <p className="text-[11px] text-emerald-100 font-normal">Langsung jelajahi materi, tes, & artikel secara gratis</p>
                    </div>
                  </div>
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform shrink-0" />
                </button>

                {/* 2. Masuk / Login */}
                <button
                  onClick={() => openAuthModal('login')}
                  className="w-full group p-4 sm:p-5 bg-blue-50 hover:bg-blue-100 text-[#031466] border-2 border-blue-200 rounded-2xl font-black text-base shadow-sm hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-between cursor-pointer"
                >
                  <div className="flex items-center gap-3.5 text-left">
                    <div className="w-10 h-10 bg-[#031466] text-white rounded-xl flex items-center justify-center shrink-0 shadow-md">
                      <LogIn size={20} />
                    </div>
                    <div>
                      <h4 className="font-extrabold text-sm sm:text-base leading-tight text-[#031466]">Masuk ke Akun</h4>
                      <p className="text-[11px] text-slate-500 font-normal">Sudah memiliki akun terdaftar sebelumnya</p>
                    </div>
                  </div>
                  <ArrowRight size={20} className="text-[#031466] group-hover:translate-x-1 transition-transform shrink-0" />
                </button>

                {/* 3. Daftar Akun Baru */}
                <button
                  onClick={() => openAuthModal('register')}
                  className="w-full group p-4 sm:p-5 bg-slate-900 hover:bg-black text-white rounded-2xl font-black text-base shadow-md hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-between cursor-pointer"
                >
                  <div className="flex items-center gap-3.5 text-left">
                    <div className="w-10 h-10 bg-orange-500 text-white rounded-xl flex items-center justify-center shrink-0 shadow-md">
                      <UserPlus size={20} />
                    </div>
                    <div>
                      <h4 className="font-extrabold text-sm sm:text-base leading-tight">Daftar Akun Baru</h4>
                      <p className="text-[11px] text-slate-300 font-normal">Buat akun untuk aktif diskusi & jurnal refleksi</p>
                    </div>
                  </div>
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform shrink-0" />
                </button>
              </div>

              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 text-slate-500 text-[11px] flex items-center gap-2">
                <ShieldCheck size={16} className="text-emerald-500 shrink-0" />
                <span>Tanpa akun, Anda tetap dapat membaca semua materi, mengikuti tes simulasi, dan menyimak diskusi publik.</span>
              </div>
            </div>
          )}

          {/* LOGIN & REGISTER MODE */}
          {(authModalMode === 'login' || authModalMode === 'register') && (
            <div className="space-y-5">
              {/* Mode Toggle Tabs */}
              <div className="flex bg-slate-100 p-1 rounded-2xl border border-slate-200">
                <button
                  type="button"
                  onClick={() => { setErrorMsg(''); openAuthModal('login', authModalReason); }}
                  className={`flex-1 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 cursor-pointer ${
                    authModalMode === 'login' 
                      ? 'bg-[#031466] text-white shadow-md' 
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <LogIn size={16} /> Masuk
                </button>
                <button
                  type="button"
                  onClick={() => { setErrorMsg(''); openAuthModal('register', authModalReason); }}
                  className={`flex-1 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 cursor-pointer ${
                    authModalMode === 'register' 
                      ? 'bg-[#031466] text-white shadow-md' 
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <UserPlus size={16} /> Daftar
                </button>
              </div>

              {errorMsg && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-2xl text-rose-600 text-xs font-bold text-center">
                  {errorMsg}
                </div>
              )}

              {successMsg && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-700 text-xs font-bold flex items-center justify-center gap-2">
                  <CheckCircle size={16} /> {successMsg}
                </div>
              )}

              {/* LOGIN FORM */}
              {authModalMode === 'login' && (
                <form onSubmit={handleLoginSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-black uppercase text-slate-500 mb-1.5">Email</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="contoh: nama@email.com"
                      className="w-full p-3.5 rounded-2xl bg-slate-50 border border-slate-200 focus:border-[#031466] focus:bg-white outline-none font-medium text-sm transition-all text-slate-800"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-black uppercase text-slate-500 mb-1.5">Kata Sandi</label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Masukkan kata sandi"
                      className="w-full p-3.5 rounded-2xl bg-slate-50 border border-slate-200 focus:border-[#031466] focus:bg-white outline-none font-medium text-sm transition-all text-slate-800"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-4 bg-[#031466] hover:bg-blue-900 text-white font-bold rounded-2xl shadow-xl hover:scale-[1.01] active:scale-95 transition-all text-sm flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <LogIn size={18} /> Masuk Sekarang
                  </button>
                </form>
              )}

              {/* REGISTER FORM */}
              {authModalMode === 'register' && (
                <form onSubmit={handleRegisterSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-black uppercase text-slate-500 mb-1.5">Nama Lengkap / Username</label>
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="Nama panggilan atau alias"
                      className="w-full p-3.5 rounded-2xl bg-slate-50 border border-slate-200 focus:border-[#031466] focus:bg-white outline-none font-medium text-sm transition-all text-slate-800"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-black uppercase text-slate-500 mb-1.5">Email</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="contoh: user@email.com"
                      className="w-full p-3.5 rounded-2xl bg-slate-50 border border-slate-200 focus:border-[#031466] focus:bg-white outline-none font-medium text-sm transition-all text-slate-800"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-black uppercase text-slate-500 mb-1.5">Kata Sandi</label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Minimal 6 karakter"
                      className="w-full p-3.5 rounded-2xl bg-slate-50 border border-slate-200 focus:border-[#031466] focus:bg-white outline-none font-medium text-sm transition-all text-slate-800"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-black uppercase text-slate-500 mb-2">Pilih Avatar Profil</label>
                    <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
                      {AVATAR_SEEDS.map((seed) => {
                        const url = `https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}`;
                        const isSelected = selectedAvatar === seed;
                        return (
                          <button
                            key={seed}
                            type="button"
                            onClick={() => setSelectedAvatar(seed)}
                            className={`w-12 h-12 rounded-2xl border-2 p-1 shrink-0 transition-all cursor-pointer ${
                              isSelected ? 'border-[#031466] bg-blue-50 scale-110 shadow-md' : 'border-slate-200 bg-slate-50 hover:border-slate-300'
                            }`}
                          >
                            <img src={url} alt={seed} className="w-full h-full rounded-xl object-cover" />
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-4 bg-[#031466] hover:bg-blue-900 text-white font-bold rounded-2xl shadow-xl hover:scale-[1.01] active:scale-95 transition-all text-sm flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <UserPlus size={18} /> Buat Akun Baru
                  </button>
                </form>
              )}

              {/* Alternative Guest Action Button */}
              <div className="pt-2 border-t border-slate-100 text-center">
                <button
                  type="button"
                  onClick={handleContinueAsGuest}
                  className="text-xs font-bold text-slate-500 hover:text-[#031466] underline transition-colors cursor-pointer py-1"
                >
                  Lanjutkan Jelajah Tanpa Akun (Mode Tamu) &rarr;
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
