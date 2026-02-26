"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Users, Search, ChevronRight, Activity, 
  UserCircle, Filter, Stethoscope, AlertCircle, Loader2 
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function DoctorPanelPage() {
  const router = useRouter();
  const [patients, setPatients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // 1. AMBIL DAFTAR SEMUA PASIEN DARI RAILWAY
  const fetchPatients = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/patients`);
      if (res.ok) {
        const data = await res.json();
        setPatients(data);
      }
    } catch (err) {
      console.error("Gagal terhubung ke server Railway");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
    // Polling setiap 10 detik untuk mendeteksi sinyal SOS masuk
    const interval = setInterval(fetchPatients, 10000);
    return () => clearInterval(interval);
  }, []);

  // Filter pencarian pasien
  const filteredPatients = patients.filter(p => 
    p.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.patient_id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Menghitung pasien yang sedang SOS
  const emergencyCount = patients.filter(p => p.is_emergency === 1).length;

  // Variasi Animasi Staggered untuk Daftar
  const listVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0 }
  };

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 space-y-4">
      <Loader2 className="animate-spin text-blue-600" size={48} />
      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Memuat Basis Data Pasien...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-12 font-sans transition-colors duration-300">
      
      {/* DOCTOR HEADER */}
      <header className="bg-white dark:bg-slate-900 px-6 py-6 md:py-8 border-b border-slate-100 dark:border-slate-800 sticky top-0 z-30 shadow-sm">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
              <Stethoscope size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-black dark:text-white tracking-tighter italic uppercase">Panel <span className="text-blue-600">Dokter</span></h1>
              <div className="flex items-center gap-2 mt-1">
                <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
                <p className="text-[10px] text-slate-400 font-bold tracking-widest uppercase">Monitoring Real-time Aktif</p>
              </div>
            </div>
          </div>
          
          <div className="relative w-full md:w-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Cari nama atau ID pasien..."
              className="w-full md:w-80 pl-12 pr-4 py-3.5 bg-slate-50 dark:bg-slate-950 border border-transparent dark:border-slate-800 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 dark:text-white font-medium text-sm transition-all shadow-inner"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 md:gap-8">
          
          {/* STATS OVERVIEW */}
          <div className="lg:col-span-1 flex flex-col sm:flex-row lg:flex-col gap-4">
            <div className="flex-1 bg-white dark:bg-slate-900 p-6 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-xl">
              <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/20 rounded-2xl flex items-center justify-center text-blue-600 mb-4">
                <Users size={24} />
              </div>
              <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">Total Pasien Terdaftar</p>
              <h2 className="text-4xl font-black dark:text-white mt-1">{patients.length}</h2>
            </div>

            <motion.div 
              animate={emergencyCount > 0 ? { backgroundColor: ["#2563eb", "#e11d48", "#2563eb"] } : {}}
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
              className={`flex-1 p-6 rounded-[2rem] text-white shadow-xl ${emergencyCount > 0 ? "bg-rose-600" : "bg-blue-600"}`}
            >
              <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center mb-4">
                <AlertCircle size={24} />
              </div>
              <p className="text-blue-100 text-[10px] font-black uppercase tracking-widest">Kondisi Kritis (SOS)</p>
              <h2 className="text-4xl font-black italic uppercase tracking-tighter mt-1">{emergencyCount}</h2>
            </motion.div>
          </div>

          {/* PATIENT LIST (CRUD READ) */}
          <div className="lg:col-span-3">
            <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-xl overflow-hidden flex flex-col h-full min-h-[400px]">
              
              <div className="p-6 border-b border-slate-50 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/50">
                <h3 className="font-black dark:text-white uppercase tracking-tight text-sm italic">Manajemen Rekam Medis</h3>
                <button className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors text-slate-400">
                  <Filter size={18} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto divide-y divide-slate-50 dark:divide-slate-800">
                <AnimatePresence>
                  {filteredPatients.length > 0 ? (
                    <motion.div 
                      variants={listVariants}
                      initial="hidden"
                      animate="show"
                    >
                      {filteredPatients.map((patient) => (
                        <motion.div 
                          key={patient.id}
                          variants={itemVariants}
                          whileHover={{ backgroundColor: patient.is_emergency === 1 ? "rgba(225, 29, 72, 0.05)" : "rgba(37, 99, 235, 0.03)", x: 4 }}
                          className={`p-5 md:p-6 flex items-center justify-between cursor-pointer transition-all relative group ${patient.is_emergency === 1 ? "bg-rose-50/30 dark:bg-rose-900/10" : ""}`}
                          onClick={() => router.push(`/doctor/panel/${patient.patient_id}`)}
                        >
                          {/* Garis indikator kiri untuk emergency */}
                          {patient.is_emergency === 1 && (
                            <div className="absolute left-0 top-0 bottom-0 w-1 bg-rose-500" />
                          )}

                          <div className="flex items-center gap-4">
                            <div className="relative">
                              <div className="w-14 h-14 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center text-slate-400 overflow-hidden shadow-sm">
                                <UserCircle size={32} />
                              </div>
                              {patient.is_emergency === 1 && (
                                <motion.div 
                                  animate={{ scale: [1, 1.2, 1] }}
                                  transition={{ repeat: Infinity, duration: 1 }}
                                  className="absolute -top-1.5 -right-1.5 w-6 h-6 bg-rose-600 rounded-full border-2 border-white dark:border-slate-900 flex items-center justify-center shadow-lg"
                                >
                                  <AlertCircle size={12} className="text-white" />
                                </motion.div>
                              )}
                            </div>
                            <div>
                              <h4 className="font-bold dark:text-white text-lg tracking-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{patient.full_name}</h4>
                              <div className="flex items-center gap-2 md:gap-3 mt-1 flex-wrap">
                                <span className="text-[10px] font-black text-blue-600 bg-blue-50 dark:bg-blue-900/30 px-2 py-0.5 rounded-md uppercase italic">ID: {patient.patient_id}</span>
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{patient.age} Tahun</span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-4 md:gap-6">
                            {patient.is_emergency === 1 && (
                              <div className="hidden lg:flex items-center gap-2 text-rose-600 font-black text-[10px] uppercase tracking-tighter italic bg-rose-100 dark:bg-rose-900/30 px-3 py-1.5 rounded-xl">
                                <div className="w-2 h-2 bg-rose-600 rounded-full animate-ping" />
                                Bantuan Segera
                              </div>
                            )}
                            <div className="text-right hidden sm:block">
                              <p className="text-[10px] font-black text-slate-300 uppercase">Domisili</p>
                              <p className="text-xs font-bold dark:text-slate-400 italic max-w-[120px] truncate">{patient.domicile}</p>
                            </div>
                            <div className="w-10 h-10 md:w-12 md:h-12 bg-slate-50 dark:bg-slate-800 rounded-2xl flex items-center justify-center text-slate-300 group-hover:text-blue-600 group-hover:bg-blue-50 dark:group-hover:bg-blue-900/30 transition-all border border-transparent group-hover:border-blue-200 dark:group-hover:border-blue-800">
                              <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </motion.div>
                  ) : (
                    <motion.div 
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                      className="p-20 text-center flex flex-col items-center justify-center space-y-3"
                    >
                      <UserCircle size={48} className="text-slate-200 dark:text-slate-800" />
                      <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Pasien tidak ditemukan</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}