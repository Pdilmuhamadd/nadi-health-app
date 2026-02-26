"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Users, Search, ChevronRight, Activity, 
  UserCircle, Calendar, Filter, Stethoscope, AlertCircle 
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

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
      <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }}>
        <Stethoscope className="text-blue-600" size={40} />
      </motion.div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-12">
      {/* DOCTOR HEADER */}
      <header className="bg-white dark:bg-slate-900 px-6 py-8 border-b border-slate-100 dark:border-slate-800 sticky top-0 z-30">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-blue-500/20">
              <Stethoscope size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-black dark:text-white tracking-tighter italic uppercase">Panel <span className="text-blue-600">Dokter</span></h1>
              <p className="text-xs text-slate-400 font-bold tracking-widest uppercase">Monitoring Kesehatan Pasien Real-time</p>
            </div>
          </div>
          
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Cari nama atau ID pasien..."
              className="w-full md:w-80 pl-12 pr-4 py-3 bg-slate-50 dark:bg-slate-950 border dark:border-slate-800 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 dark:text-white font-medium text-sm transition-all shadow-inner"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 mt-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          
          {/* STATS OVERVIEW */}
          <div className="md:col-span-1 space-y-4">
            <div className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-xl">
              <Users className="text-blue-600 mb-2" size={24} />
              <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">Total Pasien Terdaftar</p>
              <h2 className="text-3xl font-black dark:text-white mt-1">{patients.length}</h2>
            </div>

            <motion.div 
              animate={emergencyCount > 0 ? { backgroundColor: ["#2563eb", "#e11d48", "#2563eb"] } : {}}
              transition={{ repeat: Infinity, duration: 2 }}
              className={`p-6 rounded-[2rem] text-white shadow-xl ${emergencyCount > 0 ? "bg-rose-600" : "bg-blue-600"}`}
            >
              <AlertCircle className="mb-2" size={24} />
              <p className="text-blue-100 text-[10px] font-black uppercase tracking-widest">Kondisi Kritis (SOS)</p>
              <h2 className="text-3xl font-black italic uppercase tracking-tighter mt-1">{emergencyCount} Pasien</h2>
            </motion.div>
          </div>

          {/* PATIENT LIST (CRUD READ) */}
          <div className="md:col-span-3">
            <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-xl overflow-hidden">
              <div className="p-6 border-b border-slate-50 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/50">
                <h3 className="font-black dark:text-white uppercase tracking-tight text-sm italic">Manajemen Rekam Medis</h3>
                <Filter className="text-slate-400" size={18} />
              </div>

              <div className="divide-y divide-slate-50 dark:divide-slate-800">
                <AnimatePresence>
                  {filteredPatients.length > 0 ? filteredPatients.map((patient) => (
                    <motion.div 
                      key={patient.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      whileHover={{ backgroundColor: "rgba(37, 99, 235, 0.03)" }}
                      className="p-6 flex items-center justify-between cursor-pointer transition-colors relative"
                      onClick={() => router.push(`/doctor/panel/${patient.patient_id}`)}
                    >
                      <div className="flex items-center gap-4">
                        <div className="relative">
                          <div className="w-14 h-14 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center text-slate-400 overflow-hidden">
                            <UserCircle size={32} />
                          </div>
                          {patient.is_emergency === 1 && (
                            <motion.div 
                              animate={{ scale: [1, 1.2, 1] }}
                              transition={{ repeat: Infinity, duration: 1 }}
                              className="absolute -top-1 -right-1 w-5 h-5 bg-rose-600 rounded-full border-2 border-white dark:border-slate-900 flex items-center justify-center"
                            >
                              <AlertCircle size={12} className="text-white" />
                            </motion.div>
                          )}
                        </div>
                        <div>
                          <h4 className="font-bold dark:text-white text-lg tracking-tight">{patient.full_name}</h4>
                          <div className="flex items-center gap-3 mt-1">
                            <span className="text-[10px] font-black text-blue-600 bg-blue-50 dark:bg-blue-900/30 px-2 py-0.5 rounded-md uppercase italic">ID: {patient.patient_id}</span>
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{patient.age} Tahun</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-6">
                        {patient.is_emergency === 1 && (
                          <div className="hidden lg:flex items-center gap-2 text-rose-600 font-black text-[10px] uppercase tracking-tighter italic">
                            <div className="w-2 h-2 bg-rose-600 rounded-full animate-ping" />
                            Butuh Bantuan Segera
                          </div>
                        )}
                        <div className="text-right hidden sm:block">
                          <p className="text-[10px] font-black text-slate-300 uppercase">Domisili</p>
                          <p className="text-xs font-bold dark:text-slate-400 italic">{patient.domicile}</p>
                        </div>
                        <div className="w-12 h-12 bg-slate-50 dark:bg-slate-800 rounded-2xl flex items-center justify-center text-slate-300 group-hover:text-blue-600 transition-all border border-transparent hover:border-blue-200">
                          <ChevronRight size={20} />
                        </div>
                      </div>
                    </motion.div>
                  )) : (
                    <div className="p-20 text-center">
                      <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Pasien tidak ditemukan dalam database</p>
                    </div>
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