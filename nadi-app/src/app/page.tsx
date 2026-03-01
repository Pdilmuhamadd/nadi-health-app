"use client";

import React from "react";
import Link from "next/link";
import { motion, Variants } from "framer-motion";
import { 
  HeartPulse, 
  ActivitySquare, 
  ShieldCheck, 
  ArrowRight, 
  Phone,
  Clock,
  UserPlus,
  Stethoscope
} from "lucide-react";

export default function LandingPage() {
  const fadeUp: Variants = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
  };

  const staggerContainer: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50 font-sans selection:bg-teal-500 selection:text-white overflow-hidden">
      
      {/* TOP BAR (Kesan Klinis) */}
      <div className="bg-slate-900 dark:bg-black text-white px-6 py-2 hidden md:block">
        <div className="max-w-7xl mx-auto flex justify-between items-center text-xs font-medium tracking-wide">
          <div className="flex items-center gap-4 text-slate-300">
            <span className="flex items-center gap-1.5"><Clock size={14} className="text-teal-500"/> Layanan AI 24/7 Aktif</span>
            <span className="flex items-center gap-1.5"><ShieldCheck size={14} className="text-teal-500"/> Data Medis Terenkripsi</span>
          </div>
          <div className="flex items-center gap-2 text-slate-300">
            <Phone size={14} className="text-teal-500" /> Darurat: <span className="font-bold text-white">119</span>
          </div>
        </div>
      </div>

      {/* NAVBAR (Dibersihkan, hanya fokus untuk Login) */}
      <nav className="border-b border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-950/90 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-teal-600 rounded-lg flex items-center justify-center text-white shadow-md">
              <HeartPulse size={24} />
            </div>
            <div>
              <span className="text-2xl font-black tracking-tighter uppercase leading-none block">NADI</span>
              <span className="text-[9px] font-bold text-teal-600 uppercase tracking-widest leading-none block mt-0.5">Health System</span>
            </div>
          </div>
          
          <div>
            <Link href="/login" className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-900 dark:text-white px-6 py-2.5 rounded-full text-sm font-bold transition-all">
              Masuk Portal <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </nav>

      {/* HERO SECTION */}
      <main className="max-w-7xl mx-auto px-6 pt-16 pb-24 md:pt-24 md:pb-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* Kiri: Tipografi & CTA Tunggal yang Jelas */}
          <motion.div 
            variants={staggerContainer} initial="hidden" animate="show"
            className="space-y-8"
          >
            <motion.div variants={fadeUp} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 text-xs font-bold uppercase tracking-widest border border-blue-100 dark:border-blue-800/30">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </span>
              Platform Medis Terpercaya
            </motion.div>
            
            <motion.h1 variants={fadeUp} className="text-5xl md:text-6xl lg:text-[5rem] font-black tracking-tighter leading-[1.05] text-slate-900 dark:text-white">
              Satu Aplikasi,<br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-blue-600">
                Sejuta Solusi Sehat.
              </span>
            </motion.h1>
            
            <motion.p variants={fadeUp} className="text-lg md:text-xl text-slate-500 dark:text-slate-400 leading-relaxed max-w-lg font-medium">
              NADI menghubungkan pasien dengan rekam medis presisi, pemantauan AI real-time, dan akses instan ke tenaga kesehatan.
            </motion.p>
            
            <motion.div variants={fadeUp} className="pt-4 space-y-4">
              {/* Primary CTA: Daftar Pasien */}
              <Link href="/patient/register" className="bg-teal-600 hover:bg-teal-700 text-white px-8 py-4 rounded-2xl font-black flex items-center justify-center gap-3 transition-all shadow-xl shadow-teal-500/20 active:scale-95 w-fit group">
                <UserPlus size={20} />
                Daftar Sebagai Pasien
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform ml-2" />
              </Link>
              
              {/* Secondary CTA: Daftar Dokter */}
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400 pl-2">
                Anda seorang tenaga medis? <Link href="/doctor/register" className="text-blue-600 dark:text-blue-400 font-bold hover:underline flex items-center gap-1 inline-flex"><Stethoscope size={14}/> Bergabung di sini</Link>
              </p>
            </motion.div>
          </motion.div>

          {/* Kanan: Clinical Dashboard Abstract */}
          <motion.div 
            initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7, delay: 0.2 }}
            className="relative lg:h-[600px] flex items-center justify-center"
          >
            {/* Dekorasi Background */}
            <div className="absolute inset-0 bg-gradient-to-tr from-slate-100 to-slate-50 dark:from-slate-900 dark:to-slate-950 rounded-[3rem] transform rotate-3"></div>
            
            <div className="relative w-full max-w-md space-y-6 z-10">
              {/* Card 1: Vitals */}
              <motion.div whileHover={{ y: -5 }} className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-800 flex items-center gap-6">
                <div className="w-16 h-16 bg-rose-50 dark:bg-rose-900/20 rounded-xl flex items-center justify-center text-rose-500">
                  <ActivitySquare size={32} />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Gula Darah Stabil</p>
                  <p className="text-3xl font-black text-slate-900 dark:text-white mt-1">112 <span className="text-sm font-medium text-slate-400">mg/dL</span></p>
                </div>
              </motion.div>
              
              {/* Card 2: AI Status */}
              <motion.div whileHover={{ y: -5 }} className="bg-teal-600 p-6 rounded-2xl shadow-xl shadow-teal-500/20 text-white flex items-center gap-6 ml-8">
                <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center">
                  <HeartPulse size={32} />
                </div>
                <div>
                  <p className="text-xs font-bold text-teal-100 uppercase tracking-widest">Analisis Sistem AI</p>
                  <p className="text-2xl font-black mt-1">Normal & Terkontrol</p>
                </div>
              </motion.div>

              {/* Card 3: Doctor Note */}
              <motion.div whileHover={{ y: -5 }} className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center text-blue-600 font-bold text-xs">DR</div>
                  <p className="text-sm font-bold text-slate-900 dark:text-white">Pesan Dokter Masuk</p>
                </div>
                <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium">"Hasil pantauan grafik mingguan baik. Tetap pertahankan dosis insulin saat ini."</p>
                </div>
              </motion.div>
            </div>
          </motion.div>

        </div>
      </main>

      {/* FOOTER */}
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 py-8">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
            &copy; 2026 Nadi Health System
          </p>
          <div className="flex gap-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            <Link href="#" className="hover:text-teal-600 transition-colors">Privasi</Link>
            <Link href="#" className="hover:text-teal-600 transition-colors">Syarat & Ketentuan</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}