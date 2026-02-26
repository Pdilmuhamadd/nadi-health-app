"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from "recharts";
import { 
  ArrowLeft, Activity, Droplets, Clipboard, 
  MapPin, Calendar, Heart, MessageSquare, Loader2
} from "lucide-react";

export default function PatientDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [patient, setPatient] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Ambil detail pasien dari Railway Backend
  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/patients/${id}`);
        if (res.ok) {
          const data = await res.json();
          setPatient(data);
        } else {
          console.error("Data pasien tidak ditemukan");
        }
      } catch (err) {
        console.error("Gagal mengambil detail pasien", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [id]);

  // Data statis untuk keperluan demo grafik
  const chartData = [
    { day: "Sen", value: 110 }, { day: "Sel", value: 145 },
    { day: "Rab", value: 130 }, { day: "Kam", value: 170 },
    { day: "Jum", value: 140 }, { day: "Sab", value: 120 },
    { day: "Min", value: 135 },
  ];

  // Variasi animasi
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 space-y-4">
      <Loader2 className="animate-spin text-blue-600" size={48} />
      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Memuat Profil Klinis...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-12 font-sans transition-colors duration-300">
      
      {/* HEADER */}
      <header className="bg-white dark:bg-slate-900 px-6 py-6 border-b border-slate-100 dark:border-slate-800 sticky top-0 z-30 shadow-sm">
        <div className="max-w-5xl mx-auto flex items-center gap-4">
          <button 
            onClick={() => router.back()} 
            className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-all shadow-sm"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-xl font-black dark:text-white uppercase italic tracking-tighter">Profil <span className="text-blue-600">Klinis</span></h1>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">Detail Rekam Medis Pasien</p>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 mt-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="space-y-6"
        >
          {/* KARTU PROFIL UTAMA */}
          <motion.div 
            variants={itemVariants} 
            className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-[2.5rem] shadow-xl border border-slate-100 dark:border-slate-800 flex flex-col md:flex-row gap-6 md:gap-8 items-center"
          >
            <div className="w-24 h-24 bg-blue-100 dark:bg-blue-900/30 rounded-3xl flex items-center justify-center text-blue-600 shadow-inner">
              <Heart size={48} fill="currentColor" />
            </div>
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-3xl font-black dark:text-white mb-2 uppercase tracking-tight">{patient?.full_name || "Nama Tidak Diketahui"}</h2>
              <div className="flex flex-wrap justify-center md:justify-start gap-4 text-slate-500 dark:text-slate-400 font-bold text-xs uppercase tracking-widest">
                <span className="flex items-center gap-1.5"><Calendar size={14} className="text-blue-500"/> {patient?.age ? `${patient.age} TAHUN` : "-"}</span>
                <span className="flex items-center gap-1.5"><MapPin size={14} className="text-rose-500"/> {patient?.domicile || "-"}</span>
                <span className="text-blue-600 italic bg-blue-50 dark:bg-blue-900/30 px-3 py-1 rounded-lg">ID: {patient?.patient_id || id}</span>
              </div>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* RIWAYAT PENYAKIT (KOLOM KIRI) */}
            <motion.div variants={itemVariants} className="lg:col-span-1 space-y-4">
              <div className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-xl h-full">
                <div className="flex items-center gap-2 mb-6 text-rose-500 font-black text-sm uppercase italic tracking-widest border-b border-slate-50 dark:border-slate-800 pb-4">
                  <Clipboard size={18}/> Riwayat Medis
                </div>
                
                <div className="space-y-5">
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">RPD (Penyakit Dahulu)</p>
                    <p className="text-sm font-medium text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-transparent dark:border-slate-800 leading-relaxed">
                      {patient?.rpd || <span className="italic opacity-50">Tidak ada data tercatat</span>}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">RPK (Penyakit Keluarga)</p>
                    <p className="text-sm font-medium text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-transparent dark:border-slate-800 leading-relaxed">
                      {patient?.rpk || <span className="italic opacity-50">Tidak ada data tercatat</span>}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Obat-obatan Rutin</p>
                    <p className="text-sm font-medium text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-transparent dark:border-slate-800 leading-relaxed">
                      {patient?.rpo || <span className="italic opacity-50">Tidak ada obat yang dikonsumsi</span>}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* GRAFIK PEMANTAUAN (KOLOM KANAN) */}
            <motion.div variants={itemVariants} className="lg:col-span-2">
              <div className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-xl h-full flex flex-col">
                
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-lg font-black dark:text-white uppercase italic tracking-tight">Pantauan Gula Darah</h3>
                  <span className="text-[10px] font-bold bg-blue-50 dark:bg-blue-900/30 text-blue-600 px-3 py-1.5 rounded-lg uppercase tracking-widest">mg/dL</span>
                </div>
                
                <div className="h-[280px] w-full flex-1">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData}>
                      <defs>
                        <linearGradient id="colorDoctor" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#2563eb" stopOpacity={0.4}/>
                          <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" className="dark:opacity-10" />
                      <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 800}} dy={10} stroke="#94a3b8" />
                      <Tooltip 
                        contentStyle={{borderRadius: '20px', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.1)'}} 
                        cursor={{ stroke: '#94a3b8', strokeWidth: 1, strokeDasharray: '4 4' }}
                      />
                      <Area type="monotone" dataKey="value" stroke="#2563eb" strokeWidth={4} fillOpacity={1} fill="url(#colorDoctor)" activeDot={{ r: 6, fill: '#2563eb', stroke: '#fff', strokeWidth: 2 }} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
                
                <div className="mt-8 p-5 bg-blue-50 dark:bg-blue-900/20 rounded-2xl flex items-start gap-4 border border-blue-100 dark:border-blue-800/50">
                  <MessageSquare className="text-blue-600 shrink-0 mt-0.5" size={24}/>
                  <div>
                    <p className="text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest mb-1">Catatan Analisis Dokter</p>
                    <p className="text-xs font-bold text-blue-800 dark:text-blue-300 leading-relaxed">
                      Pasien dalam kondisi relatif stabil. Tren gula darah mingguan menunjukkan fluktuasi normal. Disarankan untuk tetap mengontrol pola makan dan melakukan pengecekan rutin minggu depan.
                    </p>
                  </div>
                </div>
                
              </div>
            </motion.div>

          </div>
        </motion.div>
      </main>
    </div>
  );
}