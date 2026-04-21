"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Stethoscope, User, ArrowRight, ArrowLeft, Loader2, ShieldCheck } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [role, setRole] = useState<"patient" | "doctor" | "admin" | null>(null);
  const [userId, setUserId] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId.trim()) return;
    
    setIsLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));

      if (role === "patient") {
        localStorage.setItem("nadi_user_id", userId.trim());
        router.push('/patient/dashboard');
      } else if (role === "doctor") {
        localStorage.setItem("nadi_doctor_id", userId.trim());
        router.push('/doctor/panel');
      } else if (role === "admin") {
        localStorage.setItem("nadi_admin_id", userId.trim());
        router.push('/admin/dashboard');
      }
    } catch (err) {
      alert("Terjadi kesalahan koneksi.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-4 font-sans transition-colors duration-300">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden relative"
      >
        <div className="text-center mb-8">
          <motion.div 
            whileHover={{ scale: 1.1, rotate: 10 }}
            className="inline-flex w-16 h-16 bg-teal-600 rounded-2xl items-center justify-center text-white mb-4 shadow-lg shadow-teal-500/30"
          >
            <Heart size={32} fill="currentColor" />
          </motion.div>
          <h1 className="text-3xl font-black dark:text-white italic tracking-tighter">
            NADI<span className="text-teal-600">.</span>
          </h1>
          <p className="text-slate-400 text-sm font-medium mt-2">Sistem Kesehatan Terpadu</p>
        </div>

        <AnimatePresence mode="wait">
          {!role ? (
            <motion.div
              key="role-selection"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="space-y-4"
            >
              <p className="text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Pilih Akses Masuk</p>
              
              <button 
                onClick={() => setRole("patient")}
                className="w-full group flex items-center justify-between p-5 bg-slate-50 dark:bg-slate-950 border-2 border-transparent hover:border-teal-500 dark:hover:border-teal-600 rounded-3xl transition-all"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-teal-100 dark:bg-teal-900/30 text-teal-600 rounded-xl flex items-center justify-center transition-colors">
                    <User size={24} />
                  </div>
                  <div className="text-left">
                    <p className="font-bold dark:text-white">Pasien</p>
                    <p className="text-[10px] text-slate-500 font-medium">Pantau rekam medis & vitalitas</p>
                  </div>
                </div>
                <ArrowRight size={20} className="text-slate-300 group-hover:text-teal-500 transition-colors group-hover:translate-x-1" />
              </button>

              <button 
                onClick={() => setRole("doctor")}
                className="w-full group flex items-center justify-between p-5 bg-slate-50 dark:bg-slate-950 border-2 border-transparent hover:border-blue-500 dark:hover:border-blue-600 rounded-3xl transition-all"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-xl flex items-center justify-center transition-colors">
                    <Stethoscope size={24} />
                  </div>
                  <div className="text-left">
                    <p className="font-bold dark:text-white">Tenaga Medis</p>
                    <p className="text-[10px] text-slate-500 font-medium">Panel monitoring & konsultasi</p>
                  </div>
                </div>
                <ArrowRight size={20} className="text-slate-300 group-hover:text-blue-500 transition-colors group-hover:translate-x-1" />
              </button>

              <button 
                onClick={() => setRole("admin")}
                className="w-full group flex items-center justify-between p-5 bg-slate-50 dark:bg-slate-950 border-2 border-transparent hover:border-rose-500 dark:hover:border-rose-600 rounded-3xl transition-all"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-rose-100 dark:bg-rose-900/30 text-rose-600 rounded-xl flex items-center justify-center transition-colors">
                    <ShieldCheck size={24} />
                  </div>
                  <div className="text-left">
                    <p className="font-bold dark:text-white">Admin Fasilitas</p>
                    <p className="text-[10px] text-slate-500 font-medium">Manajemen antrean & sistem</p>
                  </div>
                </div>
                <ArrowRight size={20} className="text-slate-300 group-hover:text-rose-500 transition-colors group-hover:translate-x-1" />
              </button>
            </motion.div>
          ) : (
            <motion.div
              key="login-form"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.2 }}
            >
              <button 
                onClick={() => { setRole(null); setUserId(""); }}
                className="flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 mb-6 transition-colors"
              >
                <ArrowLeft size={14} /> Kembali
              </button>

              <div className={`p-4 rounded-2xl mb-6 flex items-center gap-3 ${role === 'patient' ? 'bg-teal-50 dark:bg-teal-900/20 text-teal-700 dark:text-teal-300' : role === 'doctor' ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300' : 'bg-rose-50 dark:bg-rose-900/20 text-rose-700 dark:text-rose-300'}`}>
                {role === 'patient' ? <User size={20} /> : role === 'doctor' ? <Stethoscope size={20} /> : <ShieldCheck size={20} />}
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest">Akses Log Masuk</p>
                  <p className="text-sm font-bold">{role === 'patient' ? 'Portal Pasien' : role === 'doctor' ? 'Portal Tenaga Medis' : 'Portal Admin RS'}</p>
                </div>
              </div>

              <form onSubmit={handleLogin} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">
                    ID Pengguna / Username
                  </label>
                  <input 
                    type="text" 
                    placeholder={role === 'patient' ? "Contoh: pasien123" : role === 'doctor' ? "Contoh: dr_ahmad" : "Contoh: admin_rs"}
                    value={userId}
                    onChange={(e) => setUserId(e.target.value)}
                    required
                    className={`w-full px-4 py-4 bg-slate-50 dark:bg-slate-950 border border-transparent dark:border-slate-800 rounded-2xl outline-none focus:ring-2 transition-all dark:text-white ${role === 'patient' ? 'focus:ring-teal-500 focus:border-teal-500' : role === 'doctor' ? 'focus:ring-blue-500 focus:border-blue-500' : 'focus:ring-rose-500 focus:border-rose-500'}`}
                  />
                </div>

                <button 
                  type="submit"
                  disabled={isLoading || !userId.trim()}
                  className={`w-full text-white font-black py-4 rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-70 disabled:active:scale-100 shadow-xl ${role === 'patient' ? 'bg-teal-600 hover:bg-teal-700 shadow-teal-500/20' : role === 'doctor' ? 'bg-blue-600 hover:bg-blue-700 shadow-blue-500/20' : 'bg-rose-600 hover:bg-rose-700 shadow-rose-500/20'}`}
                >
                  {isLoading ? <Loader2 size={20} className="animate-spin" /> : <ArrowRight size={20} />}
                  {isLoading ? "MEMVERIFIKASI..." : "MASUK SEKARANG"}
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mt-8 text-center">
          <p className="text-[10px] text-slate-400 font-medium leading-relaxed">
            Dengan masuk, Anda menyetujui <br/><span className="text-slate-600 dark:text-slate-300 font-bold cursor-pointer hover:underline">Syarat & Ketentuan</span> keamanan data NADI.
          </p>
        </div>
      </motion.div>
    </div>
  );
}