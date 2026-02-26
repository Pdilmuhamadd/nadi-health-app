"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Stethoscope, User, ArrowRight } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [role, setRole] = useState<"patient" | "doctor" | null>(null);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 shadow-2xl border border-slate-100 dark:border-slate-800"
      >
        <div className="text-center mb-10">
          <motion.div 
            whileHover={{ scale: 1.1, rotate: 10 }}
            className="inline-flex w-16 h-16 bg-teal-600 rounded-2xl items-center justify-center text-white mb-4 shadow-lg"
          >
            <Heart size={32} fill="currentColor" />
          </motion.div>
          <h1 className="text-3xl font-black dark:text-white italic tracking-tighter">
            NADI<span className="text-teal-600">.</span>
          </h1>
          <p className="text-slate-400 text-sm font-medium mt-2">Pilih akses masuk Anda</p>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {/* Opsi Pasien */}
          <button 
            onClick={() => router.push('/patient/dashboard')}
            className="group flex items-center justify-between p-6 bg-slate-50 dark:bg-slate-950 border-2 border-transparent hover:border-teal-500 rounded-3xl transition-all"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-teal-100 dark:bg-teal-900/30 text-teal-600 rounded-xl flex items-center justify-center">
                <User size={24} />
              </div>
              <div className="text-left">
                <p className="font-bold dark:text-white">Pasien</p>
                <p className="text-xs text-slate-500">Pantau gula darah & kesehatan</p>
              </div>
            </div>
            <ArrowRight className="text-slate-300 group-hover:text-teal-500 transition-colors" />
          </button>

          {/* Opsi Dokter */}
          <button 
            onClick={() => router.push('/doctor/panel')}
            className="group flex items-center justify-between p-6 bg-slate-50 dark:bg-slate-950 border-2 border-transparent hover:border-blue-500 rounded-3xl transition-all"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-xl flex items-center justify-center">
                <Stethoscope size={24} />
              </div>
              <div className="text-left">
                <p className="font-bold dark:text-white">Tenaga Medis</p>
                <p className="text-xs text-slate-500">Panel monitoring pasien</p>
              </div>
            </div>
            <ArrowRight className="text-slate-300 group-hover:text-blue-500 transition-colors" />
          </button>
        </div>

        <p className="text-center mt-8 text-xs text-slate-400 font-medium leading-relaxed">
          Dengan masuk, Anda menyetujui <span className="text-teal-600">Syarat & Ketentuan</span> NADI Health System.
        </p>
      </motion.div>
    </div>
  );
}