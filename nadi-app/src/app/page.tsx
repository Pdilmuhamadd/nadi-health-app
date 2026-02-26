"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { 
  Heart, Activity, ShieldCheck, BrainCircuit, 
  ArrowRight, Stethoscope, Smartphone, FileText 
} from "lucide-react";

export default function LandingPage() {
  // Variasi animasi untuk efek staggered (muncul berurutan)
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300 overflow-x-hidden font-sans">
      
      {/* NAVBAR */}
      <nav className="flex items-center justify-between px-6 py-6 max-w-7xl mx-auto sticky top-0 bg-slate-50/80 dark:bg-slate-950/80 backdrop-blur-md z-50">
        <div className="flex items-center gap-2">
          <motion.div 
            whileHover={{ scale: 1.1, rotate: 10 }}
            className="w-10 h-10 bg-teal-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-teal-500/20"
          >
            <Heart size={24} fill="white" />
          </motion.div>
          <span className="text-xl font-black dark:text-white tracking-tighter uppercase italic">
            Nadi<span className="text-teal-600">.</span>
          </span>
        </div>
        <div className="flex items-center gap-6">
          <Link href="/login" className="text-sm font-bold text-slate-500 dark:text-slate-400 hover:text-teal-600 transition-colors">
            Masuk
          </Link>
          <Link href="/patient/register" className="hidden sm:block bg-teal-600 hover:bg-teal-700 text-white px-6 py-2.5 rounded-xl text-sm font-bold transition-all shadow-lg shadow-teal-500/20 active:scale-95">
            Daftar Akun
          </Link>
        </div>
      </nav>

      {/* HERO SECTION */}
      <main className="max-w-7xl mx-auto px-6 pt-12 md:pt-20 pb-20 md:pb-32 flex flex-col md:flex-row items-center gap-12 md:gap-16">
        
        {/* Kolom Kiri: Teks & Tombol */}
        <div className="flex-1 space-y-8 text-center md:text-left z-10">
          <motion.div 
            initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-teal-100 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400 text-[10px] font-black uppercase tracking-widest"
          >
            <Activity size={14} className="animate-pulse" /> AI-Powered Health System
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="text-5xl md:text-6xl lg:text-7xl font-black text-slate-900 dark:text-white tracking-tight leading-[1.1]"
          >
            Digitalisasi <span className="text-teal-600 italic">Rekam Medis</span> & Pemantauan Diabetes.
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
            className="text-lg text-slate-500 dark:text-slate-400 max-w-xl mx-auto md:mx-0 leading-relaxed font-medium"
          >
            Sistem terpadu untuk pasien dan tenaga medis. Kelola Gula Darah, Insulin, hingga deteksi kesehatan mental berbasis AI dengan aman.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 pt-4 justify-center md:justify-start"
          >
            <Link href="/patient/register" className="bg-teal-600 hover:bg-teal-700 text-white px-8 py-4 rounded-2xl font-black shadow-xl shadow-teal-500/20 flex items-center justify-center gap-2 transition-all active:scale-95 group">
              Daftar Pasien <ArrowRight className="group-hover:translate-x-1 transition-transform" />
            </Link>
            {/* Tombol Tenaga Medis diarahkan ke Login agar flow lebih logis */}
            <Link href="/login" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white border-2 border-slate-100 dark:border-slate-800 px-8 py-4 rounded-2xl font-black shadow-lg flex items-center justify-center gap-2 transition-all active:scale-95 hover:border-blue-500 group">
              <Stethoscope size={20} className="text-blue-600 group-hover:scale-110 transition-transform" /> Tenaga Medis
            </Link>
          </motion.div>
        </div>

        {/* Kolom Kanan: Grafis / Decoration */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}
          className="flex-1 w-full relative mt-10 md:mt-0"
        >
          <div className="relative w-full aspect-square max-w-md mx-auto md:max-w-none bg-gradient-to-br from-teal-500/10 to-blue-500/10 rounded-[3rem] border border-white/20 dark:border-slate-800/50 backdrop-blur-3xl p-6 md:p-8 overflow-hidden shadow-2xl">
            {/* Background Glows */}
            <div className="absolute top-10 right-10 w-32 h-32 bg-teal-500/20 blur-3xl rounded-full animate-pulse" />
            <div className="absolute bottom-10 left-10 w-32 h-32 bg-blue-500/20 blur-3xl rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
            
            {/* Grid Kartu Fitur (Animasi Staggered) */}
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              animate="show"
              className="relative z-10 grid grid-cols-2 gap-4 h-full"
            >
               <motion.div variants={itemVariants} className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm p-6 rounded-[2rem] shadow-xl border border-slate-100/50 dark:border-slate-800/50 flex flex-col justify-center items-center text-center space-y-3 hover:-translate-y-2 transition-transform">
                  <div className="p-3 bg-teal-50 dark:bg-teal-900/30 rounded-2xl"><BrainCircuit className="text-teal-600" size={32} /></div>
                  <p className="text-[10px] font-black uppercase tracking-tighter dark:text-white">AI Analysis</p>
               </motion.div>
               <motion.div variants={itemVariants} className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm p-6 rounded-[2rem] shadow-xl border border-slate-100/50 dark:border-slate-800/50 flex flex-col justify-center items-center text-center space-y-3 mt-8 md:mt-12 hover:-translate-y-2 transition-transform">
                  <div className="p-3 bg-blue-50 dark:bg-blue-900/30 rounded-2xl"><Smartphone className="text-blue-600" size={32} /></div>
                  <p className="text-[10px] font-black uppercase tracking-tighter dark:text-white">Mobile Ready</p>
               </motion.div>
               <motion.div variants={itemVariants} className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm p-6 rounded-[2rem] shadow-xl border border-slate-100/50 dark:border-slate-800/50 flex flex-col justify-center items-center text-center space-y-3 -mt-8 md:-mt-12 hover:-translate-y-2 transition-transform">
                  <div className="p-3 bg-rose-50 dark:bg-rose-900/30 rounded-2xl"><FileText className="text-rose-600" size={32} /></div>
                  <p className="text-[10px] font-black uppercase tracking-tighter dark:text-white">PDF Report</p>
               </motion.div>
               <motion.div variants={itemVariants} className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm p-6 rounded-[2rem] shadow-xl border border-slate-100/50 dark:border-slate-800/50 flex flex-col justify-center items-center text-center space-y-3 hover:-translate-y-2 transition-transform">
                  <div className="p-3 bg-amber-50 dark:bg-amber-900/30 rounded-2xl"><ShieldCheck className="text-amber-500" size={32} /></div>
                  <p className="text-[10px] font-black uppercase tracking-tighter dark:text-white">Secure Data</p>
               </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </main>

      {/* FEATURES MINI SECTION */}
      <section className="bg-white dark:bg-slate-900 py-20 border-t border-slate-100 dark:border-slate-800 relative z-10">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12">
          <motion.div whileHover={{ scale: 1.02 }} className="space-y-4 p-6 rounded-3xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
            <h3 className="text-xl font-black dark:text-white italic uppercase tracking-tighter">Monitoring <span className="text-teal-600">Presisi</span></h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed">Pantau gula darah dan tekanan darah secara berkala dengan visualisasi grafik yang intuitif.</p>
          </motion.div>
          <motion.div whileHover={{ scale: 1.02 }} className="space-y-4 p-6 rounded-3xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
            <h3 className="text-xl font-black dark:text-white italic uppercase tracking-tighter">Analisis <span className="text-blue-600">AI</span></h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed">Sistem cerdas yang memberikan peringatan dini jika kondisi kesehatan Anda menunjukkan tanda bahaya.</p>
          </motion.div>
          <motion.div whileHover={{ scale: 1.02 }} className="space-y-4 p-6 rounded-3xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
            <h3 className="text-xl font-black dark:text-white italic uppercase tracking-tighter">Layanan <span className="text-rose-600">SOS</span></h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed">Satu klik untuk mengirimkan sinyal bantuan kepada tenaga medis saat terjadi kondisi darurat.</p>
          </motion.div>
        </div>
      </section>
      
      {/* FOOTER */}
      <footer className="bg-white dark:bg-slate-900 py-8 border-t border-slate-100 dark:border-slate-800 text-center">
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
          &copy; 2026 Nadi Health System
        </p>
      </footer>
    </div>
  );
}