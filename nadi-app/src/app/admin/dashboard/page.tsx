"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, Users, Clock, AlertTriangle, 
  ShieldCheck, CheckCircle2, UserPlus, FileText, ArrowRight
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

// MOCK DATA ANTREAN (Simulasi Antrean RS)
const INITIAL_QUEUE = [
  { id: "Q-001", nik: "3604021234560001", name: "Budi Santoso", status: "waiting", time: "08:15", type: "Reguler" },
  { id: "Q-002", nik: "3604021234560002", name: "Siti Aminah", status: "waiting", time: "08:30", type: "Reguler" },
  { id: "Q-003", nik: "3604021234560003", name: "Andi Saputra", status: "waiting", time: "08:45", type: "Reguler" },
  { id: "Q-004", nik: "3604021234560004", name: "Ratna Sari", status: "waiting", time: "09:00", type: "Reguler" },
];

export default function AdminDashboard() {
  const [queue, setQueue] = useState(INITIAL_QUEUE);
  const [searchNIK, setSearchNIK] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("nadi_admin_id");
    router.push("/login");
  };

  // FUNGSI ZERO-TECH PATIENT: Daftar via NIK
  const handleSearchNIK = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchNIK.trim()) return;

    setIsSearching(true);
    setTimeout(() => {
      const newPatient = {
        id: `Q-00${queue.length + 1}`,
        nik: searchNIK,
        name: "Pasien Baru (Dari NIK)",
        status: "waiting",
        time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
        type: "Reguler"
      };
      setQueue([...queue, newPatient]);
      setSearchNIK("");
      setIsSearching(false);
      alert(`Berhasil menarik data NIK ${searchNIK}. Pasien otomatis masuk antrean!`);
    }, 1000);
  };

  // FUNGSI DEWA: Set Prioritas / Bypass Antrean
  const handleBypass = (id: string) => {
    const confirmBypass = confirm("Jadikan pasien ini Prioritas (Bypass Antrean)? Sistem akan menyesuaikan ETA pasien lain.");
    if (!confirmBypass) return;

    setQueue(prevQueue => {
      const updatedQueue = prevQueue.map(p => {
        if (p.id === id) {
          return { ...p, type: "Prioritas IGD", status: "processing" };
        }
        return p;
      });
      // Pindahkan yang prioritas ke paling atas (setelah yang sedang diproses jika ada)
      return updatedQueue.sort((a, b) => (b.type === "Prioritas IGD" ? 1 : 0) - (a.type === "Prioritas IGD" ? 1 : 0));
    });
  };

  const handleSelesai = (id: string) => {
    setQueue(prevQueue => prevQueue.map(p => p.id === id ? { ...p, status: "completed" } : p));
  };

  const waitingCount = queue.filter(q => q.status === "waiting").length;

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 font-sans">
      
      {/* TOP BAR - GOD MODE */}
      <header className="bg-slate-900 text-white px-6 py-4 sticky top-0 z-50 shadow-xl">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-rose-600 rounded-lg flex items-center justify-center shadow-lg">
              <ShieldCheck size={24} />
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tight uppercase">ADMIN COMMAND <span className="text-rose-500">CENTER</span></h1>
              <p className="text-[10px] text-slate-400 font-bold tracking-widest uppercase">Akses Tertinggi • Nadi Health System</p>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Users className="text-blue-400" size={18} />
              <div>
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-none">Total Antrean</p>
                <p className="text-lg font-black leading-none">{waitingCount} <span className="text-xs font-normal text-slate-400">Pasien</span></p>
              </div>
            </div>
            <button onClick={handleLogout} className="text-[10px] font-bold bg-slate-800 hover:bg-slate-700 px-4 py-2 rounded-lg transition-colors border border-slate-700">
              Keluar Panel
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        
        {/* ENGINE: ZERO-TECH PATIENT (Cari NIK) */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-slate-900 p-8 rounded-[2rem] shadow-xl border border-slate-200 dark:border-slate-800 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest px-4 py-1 rounded-bl-xl">
            Zero-Tech Engine
          </div>
          <div className="flex items-start gap-4 mb-6">
            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 text-blue-600 rounded-2xl">
              <FileText size={24} />
            </div>
            <div>
              <h2 className="text-xl font-black dark:text-white tracking-tight">Registrasi Pasien Langsung (NIK)</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium max-w-2xl">Masukkan Nomor Induk Kependudukan (NIK) pasien yang datang ke fasilitas kesehatan tanpa membawa HP/Aplikasi. Sistem akan otomatis menarik rekam medis (Dev Mode).</p>
            </div>
          </div>

          <form onSubmit={handleSearchNIK} className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input 
                type="text" 
                placeholder="Ketik 16 Digit NIK KTP Pasien..." 
                maxLength={16}
                value={searchNIK}
                onChange={(e) => setSearchNIK(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 dark:text-white font-bold tracking-widest transition-all"
              />
            </div>
            <button 
              type="submit"
              disabled={isSearching || searchNIK.length < 5}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-2xl font-black flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-500/20 disabled:opacity-50 whitespace-nowrap"
            >
              {isSearching ? "MENARIK DATA..." : "TARIK REKAM MEDIS"}
              {!isSearching && <ArrowRight size={18} />}
            </button>
          </form>
        </motion.section>

        {/* ENGINE: UNIFIED QUEUE BOARD (Antrean Transparan) */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden"
        >
          <div className="p-6 md:p-8 border-b border-slate-100 dark:border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4 bg-slate-50/50 dark:bg-slate-900/50">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-rose-50 dark:bg-rose-900/20 text-rose-600 rounded-2xl flex items-center justify-center">
                <Clock size={24} />
              </div>
              <div>
                <h2 className="text-xl font-black dark:text-white tracking-tight uppercase italic">Unified Queue Board</h2>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-0.5">Sistem Manajemen Antrean RS Transparan</p>
              </div>
            </div>
          </div>

          <div className="p-6 md:p-8 overflow-x-auto">
            <div className="min-w-[800px]">
              <div className="grid grid-cols-12 gap-4 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 px-4">
                <div className="col-span-2">ID & Waktu</div>
                <div className="col-span-4">Identitas Pasien</div>
                <div className="col-span-2">Status / Tipe</div>
                <div className="col-span-4 text-right">Kontrol Operasional (Admin)</div>
              </div>

              <div className="space-y-3">
                <AnimatePresence>
                  {queue.map((patient) => (
                    <motion.div 
                      key={patient.id}
                      initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
                      className={`grid grid-cols-12 gap-4 items-center p-4 rounded-2xl border transition-all ${
                        patient.status === 'completed' ? 'bg-slate-50 dark:bg-slate-950 border-transparent opacity-60' :
                        patient.type === 'Prioritas IGD' ? 'bg-rose-50 border-rose-200 dark:bg-rose-900/20 dark:border-rose-900/50' : 
                        'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm'
                      }`}
                    >
                      {/* Kolom 1: Waktu */}
                      <div className="col-span-2">
                        <p className="font-black text-slate-900 dark:text-white">{patient.id}</p>
                        <p className="text-xs text-slate-500 font-bold">{patient.time} WIB</p>
                      </div>

                      {/* Kolom 2: Identitas */}
                      <div className="col-span-4">
                        <p className={`font-bold text-base ${patient.type === 'Prioritas IGD' ? 'text-rose-700 dark:text-rose-400' : 'text-slate-900 dark:text-white'}`}>
                          {patient.name}
                        </p>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-0.5">NIK: {patient.nik}</p>
                      </div>

                      {/* Kolom 3: Status */}
                      <div className="col-span-2">
                        {patient.status === "completed" ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-200 dark:bg-slate-800 text-slate-500 text-[10px] font-black uppercase tracking-widest rounded-lg">
                            <CheckCircle2 size={12} /> Selesai
                          </span>
                        ) : patient.type === "Prioritas IGD" ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-rose-600 text-white text-[10px] font-black uppercase tracking-widest rounded-lg shadow-md shadow-rose-500/20 animate-pulse">
                            <AlertTriangle size={12} /> Prioritas Tindakan
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-400 text-[10px] font-black uppercase tracking-widest rounded-lg">
                            <Clock size={12} /> Menunggu
                          </span>
                        )}
                      </div>

                      {/* Kolom 4: Action (God Mode) */}
                      <div className="col-span-4 flex justify-end gap-2">
                        {patient.status !== "completed" && (
                          <>
                            {patient.type !== "Prioritas IGD" && (
                              <button 
                                onClick={() => handleBypass(patient.id)}
                                className="px-4 py-2 bg-rose-100 hover:bg-rose-200 dark:bg-rose-900/30 dark:hover:bg-rose-900/50 text-rose-600 dark:text-rose-400 text-[10px] font-black uppercase tracking-widest rounded-xl transition-colors border border-rose-200 dark:border-rose-800"
                              >
                                Set Prioritas (Bypass)
                              </button>
                            )}
                            <button 
                              onClick={() => handleSelesai(patient.id)}
                              className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-all shadow-md shadow-teal-500/20"
                            >
                              Tandai Selesai
                            </button>
                          </>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </motion.section>

      </main>
    </div>
  );
}