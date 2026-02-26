"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from "recharts";
import { 
  ArrowLeft, Activity, Droplets, Clipboard, 
  MapPin, Calendar, Heart, MessageSquare
} from "lucide-react";

export default function PatientDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [patient, setPatient] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/patients/${id}`);
        if (res.ok) {
          const data = await res.json();
          setPatient(data);
        }
      } catch (err) {
        console.error("Gagal mengambil detail pasien");
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [id]);

  const chartData = [
    { day: "Sen", value: 110 }, { day: "Sel", value: 145 },
    { day: "Rab", value: 130 }, { day: "Kam", value: 170 },
    { day: "Jum", value: 140 }, { day: "Sab", value: 120 },
    { day: "Min", value: 135 },
  ];

  if (loading) return <div className="min-h-screen flex items-center justify-center dark:bg-slate-950 text-blue-600 font-bold">MEMUAT REKAM MEDIS...</div>;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-12">
      <header className="bg-white dark:bg-slate-900 px-6 py-6 border-b border-slate-100 dark:border-slate-800">
        <div className="max-w-5xl mx-auto flex items-center gap-4">
          <button onClick={() => router.back()} className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl text-slate-400 hover:text-blue-600 transition-all">
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-xl font-black dark:text-white uppercase italic tracking-tighter">Profil <span className="text-blue-600">Klinis</span></h1>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 mt-8 space-y-6">
        {/* KARTU PROFIL UTAMA */}
        <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] shadow-xl border border-slate-100 dark:border-slate-800 flex flex-col md:flex-row gap-8 items-center">
          <div className="w-24 h-24 bg-blue-100 dark:bg-blue-900/30 rounded-3xl flex items-center justify-center text-blue-600 shadow-inner">
            <Heart size={48} fill="currentColor" />
          </div>
          <div className="flex-1 text-center md:text-left">
            <h2 className="text-3xl font-black dark:text-white mb-1 uppercase tracking-tight">{patient?.full_name}</h2>
            <div className="flex flex-wrap justify-center md:justify-start gap-4 text-slate-400 font-bold text-[10px] uppercase tracking-widest">
              <span className="flex items-center gap-1"><Calendar size={14}/> {patient?.age} TAHUN</span>
              <span className="flex items-center gap-1"><MapPin size={14}/> {patient?.domicile}</span>
              <span className="text-blue-600 italic">ID: {patient?.patient_id}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* RIWAYAT PENYAKIT (READ FROM DATABASE) */}
          <div className="md:col-span-1 space-y-4">
            <div className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-xl">
              <div className="flex items-center gap-2 mb-4 text-rose-500 font-black text-xs uppercase italic tracking-widest">
                <Clipboard size={16}/> Riwayat Medis
              </div>
              <div className="space-y-3">
                <div>
                  <p className="text-[9px] font-black text-slate-300 uppercase">RPD (Dahulu)</p>
                  <p className="text-xs font-bold dark:text-slate-400">{patient?.rpd || "Tidak ada data"}</p>
                </div>
                <div>
                  <p className="text-[9px] font-black text-slate-300 uppercase">RPK (Keluarga)</p>
                  <p className="text-xs font-bold dark:text-slate-400">{patient?.rpk || "Tidak ada data"}</p>
                </div>
                <div>
                  <p className="text-[9px] font-black text-slate-300 uppercase">Obat-obatan</p>
                  <p className="text-xs font-bold dark:text-slate-400">{patient?.rpo || "Tidak ada data"}</p>
                </div>
              </div>
            </div>
          </div>

          {/* GRAFIK PEMANTAUAN (SYNC WITH PATIENT) */}
          <div className="md:col-span-2">
            <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-xl">
              <h3 className="text-sm font-black dark:text-white uppercase mb-6 italic tracking-tight">Pantauan Gula Darah (mg/dL)</h3>
              <div className="h-[250px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="colorDoctor" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 800}} dy={10} />
                    <Tooltip contentStyle={{borderRadius: '20px', border: 'none'}} />
                    <Area type="monotone" dataKey="value" stroke="#2563eb" strokeWidth={4} fillOpacity={1} fill="url(#colorDoctor)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-2xl flex items-center gap-4">
                <MessageSquare className="text-blue-600" size={24}/>
                <p className="text-[10px] font-bold text-blue-800 dark:text-blue-300">Catatan Dokter: Pasien dalam kondisi stabil, namun disarankan kontrol rutin minggu depan.</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}