"use client";

import React, { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { Sun, Moon, Heart, User, Stethoscope, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function RegisterPage() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [role, setRole] = useState<"patient" | "doctor">("patient");

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-4 transition-colors duration-300">
      {/* Theme Toggle */}
      <button 
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        className="fixed top-5 right-5 p-3 rounded-full bg-white dark:bg-slate-800 shadow-md border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-yellow-400 z-50 transition-all"
      >
        {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
      </button>

      <div className="w-full max-w-lg">
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 bg-rose-600 rounded-xl flex items-center justify-center shadow-lg mb-4">
            <Heart className="text-white w-6 h-6 fill-current" />
          </div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Gabung di NADI<span className="text-rose-600">.</span>
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Pilih peran Anda untuk memulai</p>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 rounded-[2.5rem] shadow-xl">
          {/* Role Selection */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            <button 
              onClick={() => setRole("patient")}
              className={`flex flex-col items-center gap-3 p-4 rounded-2xl border-2 transition-all ${
                role === "patient" 
                ? "border-rose-600 bg-rose-50 dark:bg-rose-900/10" 
                : "border-slate-100 dark:border-slate-800 hover:border-slate-200"
              }`}
            >
              <User className={role === "patient" ? "text-rose-600" : "text-slate-400"} size={24} />
              <span className={`text-xs font-bold uppercase tracking-widest ${role === "patient" ? "text-rose-600" : "text-slate-400"}`}>Pasien</span>
            </button>

            <button 
              onClick={() => setRole("doctor")}
              className={`flex flex-col items-center gap-3 p-4 rounded-2xl border-2 transition-all ${
                role === "doctor" 
                ? "border-rose-600 bg-rose-50 dark:bg-rose-900/10" 
                : "border-slate-100 dark:border-slate-800 hover:border-slate-200"
              }`}
            >
              <Stethoscope className={role === "doctor" ? "text-rose-600" : "text-slate-400"} size={24} />
              <span className={`text-xs font-bold uppercase tracking-widest ${role === "doctor" ? "text-rose-600" : "text-slate-400"}`}>Dokter</span>
            </button>
          </div>

          <form className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Nama Lengkap</label>
                <input type="text" placeholder="Fadhil Muhamad" className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm dark:text-white focus:border-rose-500 outline-none transition-all" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">
                  {role === "doctor" ? "Nomor STR" : "Usia"}
                </label>
                <input type="text" placeholder={role === "doctor" ? "1234567..." : "22"} className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm dark:text-white focus:border-rose-500 outline-none transition-all" />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Email</label>
              <input type="email" placeholder="nama@email.com" className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm dark:text-white focus:border-rose-500 outline-none transition-all" />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Kata Sandi</label>
              <input type="password" placeholder="••••••••" className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm dark:text-white focus:border-rose-500 outline-none transition-all" />
            </div>

            <button className="w-full bg-rose-600 hover:bg-rose-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-rose-500/20 transition-all active:scale-95 flex items-center justify-center gap-2">
              DAFTAR SEKARANG
              <ArrowRight size={18} />
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-sm text-slate-500">
              Sudah punya akun? <Link href="/login" className="text-rose-600 font-bold hover:underline">Masuk</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}