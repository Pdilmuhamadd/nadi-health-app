"use client";

import React, { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { Sun, Moon, Heart, User, Stethoscope, ArrowRight, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const { theme, setTheme } = useTheme();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [role, setRole] = useState<"patient" | "doctor">("patient");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // FUNGSI SUBMIT
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 1500));

      alert(`Pendaftaran ${role === "patient" ? "Pasien" : "Dokter"} Berhasil! Silakan masuk (Login).`);
      router.push("/login");

    } catch (err) {
      alert("Terjadi kesalahan sistem (Simulasi).");
    } finally {
      setIsLoading(false);
    }
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-4 transition-colors duration-300 font-sans">
      
      {/* Theme Toggle */}
      <button 
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        className="fixed top-5 right-5 p-3 rounded-full bg-white dark:bg-slate-800 shadow-md border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-yellow-400 z-50 transition-all hover:scale-105"
      >
        {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
      </button>

      <div className="w-full max-w-lg">
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 bg-teal-600 rounded-xl flex items-center justify-center shadow-lg shadow-teal-500/20 mb-4">
            <Heart className="text-white w-6 h-6 fill-current" />
          </div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight uppercase italic">
            Gabung di NADI<span className="text-teal-600">.</span>
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1 font-medium">Pilih peran Anda untuk memulai</p>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-8 rounded-[2.5rem] shadow-xl relative overflow-hidden">
          
          {/* Role Selection */}
          <div className="grid grid-cols-2 gap-4 mb-8 mt-2">
            <button 
              type="button"
              onClick={() => setRole("patient")}
              className={`flex flex-col items-center gap-3 p-4 rounded-2xl border-2 transition-all ${
                role === "patient" 
                ? "border-teal-500 bg-teal-50 dark:bg-teal-900/10" 
                : "border-slate-100 dark:border-slate-800 hover:border-slate-200 dark:hover:border-slate-700"
              }`}
            >
              <User className={role === "patient" ? "text-teal-600" : "text-slate-400"} size={24} />
              <span className={`text-xs font-bold uppercase tracking-widest ${role === "patient" ? "text-teal-600" : "text-slate-400"}`}>Pasien</span>
            </button>

            <button 
              type="button"
              onClick={() => setRole("doctor")}
              className={`flex flex-col items-center gap-3 p-4 rounded-2xl border-2 transition-all ${
                role === "doctor" 
                ? "border-blue-500 bg-blue-50 dark:bg-blue-900/10" 
                : "border-slate-100 dark:border-slate-800 hover:border-slate-200 dark:hover:border-slate-700"
              }`}
            >
              <Stethoscope className={role === "doctor" ? "text-blue-600" : "text-slate-400"} size={24} />
              <span className={`text-xs font-bold uppercase tracking-widest ${role === "doctor" ? "text-blue-600" : "text-slate-400"}`}>Tenaga Medis</span>
            </button>
          </div>

          <form onSubmit={handleRegister} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Nama Lengkap</label>
                <input required type="text" placeholder="John Doe" className={`w-full bg-slate-50 dark:bg-slate-950 border border-transparent dark:border-slate-800 rounded-xl px-4 py-3 text-sm dark:text-white outline-none transition-all focus:ring-2 ${role === 'patient' ? 'focus:ring-teal-500' : 'focus:ring-blue-500'}`} />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">
                  {role === "doctor" ? "Nomor STR" : "Usia"}
                </label>
                <input required type={role === "patient" ? "number" : "text"} placeholder={role === "doctor" ? "1234567..." : "22"} className={`w-full bg-slate-50 dark:bg-slate-950 border border-transparent dark:border-slate-800 rounded-xl px-4 py-3 text-sm dark:text-white outline-none transition-all focus:ring-2 ${role === 'patient' ? 'focus:ring-teal-500' : 'focus:ring-blue-500'}`} />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Email / NIK</label>
              <input required type="text" placeholder="Masukkan Email atau NIK KTP" className={`w-full bg-slate-50 dark:bg-slate-950 border border-transparent dark:border-slate-800 rounded-xl px-4 py-3 text-sm dark:text-white outline-none transition-all focus:ring-2 ${role === 'patient' ? 'focus:ring-teal-500' : 'focus:ring-blue-500'}`} />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Kata Sandi</label>
              <input required type="password" placeholder="••••••••" className={`w-full bg-slate-50 dark:bg-slate-950 border border-transparent dark:border-slate-800 rounded-xl px-4 py-3 text-sm dark:text-white outline-none transition-all focus:ring-2 ${role === 'patient' ? 'focus:ring-teal-500' : 'focus:ring-blue-500'}`} />
            </div>

            <button 
              type="submit"
              disabled={isLoading}
              className={`w-full text-white font-black py-4 rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-95 shadow-xl disabled:opacity-70 disabled:active:scale-100 mt-2 ${role === "patient" ? "bg-teal-600 hover:bg-teal-700 shadow-teal-500/20" : "bg-blue-600 hover:bg-blue-700 shadow-blue-500/20"}`}
            >
              {isLoading ? <Loader2 size={20} className="animate-spin" /> : "DAFTAR SEKARANG"}
              {!isLoading && <ArrowRight size={18} />}
            </button>
          </form>

          <div className="mt-8 text-center border-t border-slate-100 dark:border-slate-800 pt-6">
            <p className="text-xs font-medium text-slate-500">
              Sudah punya akun? <Link href="/login" className={`font-bold hover:underline ${role === "patient" ? "text-teal-600" : "text-blue-600"}`}>Masuk di sini</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}