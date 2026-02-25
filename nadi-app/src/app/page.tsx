"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Heart, Activity, ShieldCheck, BrainCircuit, ArrowRight, Stethoscope } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 transition-colors duration-300">
      <nav className="flex items-center justify-between px-6 py-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-teal-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-teal-500/20">
            <Heart size={24} fill="white" />
          </div>
          <span className="text-xl font-black dark:text-white tracking-tighter uppercase">Nadi<span className="text-teal-600">.</span></span>
        </div>
        <div className="flex items-center gap-6">
          <Link href="/login" className="text-sm font-bold text-slate-500 dark:text-slate-400 hover:text-teal-600 transition-colors">Masuk</Link>
          <Link href="/register" className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-2.5 rounded-xl text-sm font-bold transition-all shadow-lg shadow-teal-500/20">Daftar Akun</Link>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 pt-20 pb-32 flex flex-col md:flex-row items-center gap-16">
        <div className="flex-1 space-y-8">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-black text-slate-900 dark:text-white tracking-tight leading-[1.1]"
          >
            Digitalisasi <span className="text-teal-600">Rekam Medis</span> & Pemantauan Diabetes.
          </motion.h1>
          <p className="text-lg text-slate-500 dark:text-slate-400 max-w-xl leading-relaxed font-medium">
            Sistem terpadu untuk pasien dan tenaga medis. Kelola Gula Darah, Insulin, hingga deteksi kesehatan mental berbasis AI.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/register" className="bg-teal-600 hover:bg-teal-700 text-white px-8 py-4 rounded-2xl font-black shadow-xl shadow-teal-500/20 flex items-center justify-center gap-2 transition-all active:scale-95 group">
              Mulai Sekarang <ArrowRight className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}