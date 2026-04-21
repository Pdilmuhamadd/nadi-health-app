"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { 
  HeartPulse, Activity, ShieldCheck, ArrowRight, 
  Phone, Clock, UserPlus, Stethoscope, FileText, Lock
} from "lucide-react";

export default function LandingPage() {
  const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  const stagger = {
    hidden: { opacity: 0 },
    show: { transition: { staggerChildren: 0.1 } }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-slate-950 text-slate-900 dark:text-slate-50 font-sans selection:bg-blue-500 selection:text-white">
      
      {/* EMERGENCY BAR */}
      <div className="bg-rose-600 text-white px-6 py-2 md:py-2.5">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center text-[10px] md:text-xs font-bold tracking-widest uppercase gap-2">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5"><Clock size={14}/> Layanan Medis 24 Jam</span>
            <span className="hidden sm:flex items-center gap-1.5"><ShieldCheck size={14}/> Standar Kemenkes RI</span>
          </div>
          <div className="flex items-center gap-2 bg-rose-700 px-3 py-1 rounded-full">
            <Phone size={14} /> IGD & Darurat: <span className="font-black text-sm">119</span>
          </div>
        </div>
      </div>

      {/* NAVBAR */}
      <nav className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white">
              <HeartPulse size={24} />
            </div>
            <div>
              <span className="text-xl font-black tracking-tight text-slate-900 dark:text-white block">NADI<span className="text-blue-600">.</span></span>
              <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest block -mt-0.5">Sistem Kesehatan Terpadu</span>
            </div>
          </div>
          
          <div className="hidden md:flex items-center gap-8 text-sm font-bold text-slate-600 dark:text-slate-300">
            <Link href="#" className="hover:text-blue-600 transition-colors">Layanan</Link>
            <Link href="#" className="hover:text-blue-600 transition-colors">Tenaga Medis</Link>
            <Link href="#" className="hover:text-blue-600 transition-colors">Fasilitas</Link>
          </div>

          <div>
            <Link href="/login" className="flex items-center gap-2 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/30 dark:hover:bg-blue-900/50 text-blue-700 dark:text-blue-400 px-6 py-2.5 rounded-full text-sm font-bold transition-all border border-blue-100 dark:border-blue-800">
              Masuk Portal <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </nav>

      {/* HERO SECTION */}
      <main className="max-w-7xl mx-auto px-6 pt-12 pb-20 md:pt-20 md:pb-28 relative">
        <div className="absolute inset-0 z-0 opacity-[0.03] dark:opacity-[0.05]" style={{ backgroundImage: "radial-gradient(#2563eb 1px, transparent 1px)", backgroundSize: "32px 32px" }}></div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center relative z-10">
          
          <motion.div variants={stagger} initial="hidden" animate="show" className="lg:col-span-7 space-y-6 md:space-y-8">
            <motion.div variants={fadeUp} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[10px] font-bold uppercase tracking-widest border border-slate-200 dark:border-slate-700">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              Platform Rekam Medis Digital
            </motion.div>
            
            <motion.h1 variants={fadeUp} className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight leading-[1.15] text-slate-900 dark:text-white">
              Layanan Kesehatan yang <span className="text-blue-600">Memahami Anda.</span>
            </motion.h1>
            
            <motion.p variants={fadeUp} className="text-base md:text-lg text-slate-600 dark:text-slate-400 leading-relaxed max-w-xl font-medium">
              NADI menghadirkan ekosistem kesehatan transparan tanpa antrean fisik. Akses rekam medis, konsultasi dokter, dan pantauan vitalitas real-time hanya dengan NIK KTP Anda.
            </motion.p>
            
            <motion.div variants={fadeUp} className="pt-4 flex flex-col sm:flex-row items-start sm:items-center gap-4">
              {/* LINK DIPERBAIKI MENGARAH KE /register */}
              <Link href="/register" className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-500/20 active:scale-95">
                <UserPlus size={20} />
                Daftar Akun Baru
              </Link>
              {/* LINK DIPERBAIKI MENGARAH KE /login */}
              <Link href="/login" className="w-full sm:w-auto bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 px-8 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all active:scale-95">
                <Stethoscope size={20} className="text-slate-400" />
                Masuk Portal NADI
              </Link>
            </motion.div>
          </motion.div>

          {/* Value Proposition Grid */}
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.7, delay: 0.2 }} className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none hover:-translate-y-1 transition-transform">
              <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/20 rounded-xl flex items-center justify-center text-blue-600 mb-4"><FileText size={24} /></div>
              <h3 className="font-bold text-slate-900 dark:text-white mb-2">Zero-Tech Patient</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">Pasien tidak perlu mengunduh aplikasi. Semua data terintegrasi langsung via NIK di fasilitas kesehatan.</p>
            </div>
            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none hover:-translate-y-1 transition-transform sm:mt-8">
              <div className="w-12 h-12 bg-teal-50 dark:bg-teal-900/20 rounded-xl flex items-center justify-center text-teal-600 mb-4"><Activity size={24} /></div>
              <h3 className="font-bold text-slate-900 dark:text-white mb-2">Analisis AI Real-time</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">Sistem mendeteksi anomali pada gula darah & tensi secara otomatis untuk peringatan dini.</p>
            </div>
            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none hover:-translate-y-1 transition-transform sm:-mt-8">
              <div className="w-12 h-12 bg-rose-50 dark:bg-rose-900/20 rounded-xl flex items-center justify-center text-rose-600 mb-4"><HeartPulse size={24} /></div>
              <h3 className="font-bold text-slate-900 dark:text-white mb-2">Antrean Transparan</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">Menghapus silo data. Jadwal dokter dan sisa antrean disinkronkan secara presisi dan terbuka.</p>
            </div>
            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none hover:-translate-y-1 transition-transform">
              <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center justify-center text-slate-600 dark:text-slate-300 mb-4"><Lock size={24} /></div>
              <h3 className="font-bold text-slate-900 dark:text-white mb-2">Privasi Terjamin</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">Rekam medis dikunci dengan enkripsi berstandar industri medis modern.</p>
            </div>
          </motion.div>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="bg-white dark:bg-slate-950 py-8 border-t border-slate-200 dark:border-slate-800 mt-12">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
            &copy; 2026 NADI Health System. Seluruh hak cipta dilindungi.
          </p>
        </div>
      </footer>
    </div>
  );
}