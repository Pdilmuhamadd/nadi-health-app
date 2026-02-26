"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { User, MapPin, Calendar, Activity, ClipboardList, ArrowRight, CheckCircle2 } from "lucide-react";

export default function RegisterPatientPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    patient_id: "",
    full_name: "",
    age: "",
    domicile: "Serang, Banten",
    rpd: "", // Riwayat Penyakit Dahulu
    rpk: "", // Riwayat Penyakit Keluarga
    rpo: ""  // Riwayat Penggunaan Obat
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/register/patient`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          age: parseInt(formData.age)
        }),
      });

      if (res.ok) {
        // Efek sukses sebelum pindah halaman
        alert("Pendaftaran Pasien Berhasil!");
        router.push("/login");
      } else {
        const errData = await res.json();
        alert(`Gagal: ${errData.detail || "Terjadi kesalahan"}`);
      }
    } catch (err) {
      alert("Terjadi kesalahan koneksi ke server Railway.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12 px-6">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-2xl mx-auto"
      >
        <div className="text-center mb-10">
          <h1 className="text-4xl font-black dark:text-white tracking-tighter italic">
            PENDAFTARAN <span className="text-teal-600">PASIEN</span>
          </h1>
          <p className="text-slate-500 mt-2 font-medium">Lengkapi rekam medis awal Anda untuk sistem NADI.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Section 1: Data Diri */}
          <div className="bg-white dark:bg-slate-900 p-8 rounded-[2rem] shadow-xl border border-slate-100 dark:border-slate-800 space-y-4">
            <div className="flex items-center gap-2 mb-2 text-teal-600 font-bold">
              <User size={20} />
              <span className="text-sm uppercase tracking-widest">Informasi Pribadi</span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">ID Pasien / Username</label>
                <input 
                  type="text" 
                  placeholder="fadhil_01"
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border dark:border-slate-800 rounded-xl outline-none focus:ring-2 focus:ring-teal-500 dark:text-white transition-all"
                  onChange={(e) => setFormData({...formData, patient_id: e.target.value})}
                  required 
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Nama Lengkap</label>
                <input 
                  type="text" 
                  placeholder="Fadhil Muhamad Pratama"
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border dark:border-slate-800 rounded-xl outline-none focus:ring-2 focus:ring-teal-500 dark:text-white transition-all"
                  onChange={(e) => setFormData({...formData, full_name: e.target.value})}
                  required 
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Usia</label>
                <input 
                  type="number" 
                  placeholder="22"
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border dark:border-slate-800 rounded-xl outline-none focus:ring-2 focus:ring-teal-500 dark:text-white transition-all"
                  onChange={(e) => setFormData({...formData, age: e.target.value})}
                  required 
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Domisili</label>
                <input 
                  type="text" 
                  defaultValue="Serang, Banten"
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border dark:border-slate-800 rounded-xl outline-none focus:ring-2 focus:ring-teal-500 dark:text-white transition-all"
                  onChange={(e) => setFormData({...formData, domicile: e.target.value})}
                  required 
                />
              </div>
            </div>
          </div>

          {/* Section 2: Riwayat Medis */}
          <div className="bg-white dark:bg-slate-900 p-8 rounded-[2rem] shadow-xl border border-slate-100 dark:border-slate-800 space-y-4">
            <div className="flex items-center gap-2 mb-2 text-rose-500 font-bold">
              <ClipboardList size={20} />
              <span className="text-sm uppercase tracking-widest">Rekam Medis Awal</span>
            </div>

            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Riwayat Penyakit Dahulu (RPD)</label>
                <textarea 
                  placeholder="Contoh: Diabetes Tipe 1 sejak 2024"
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border dark:border-slate-800 rounded-xl outline-none focus:ring-2 focus:ring-rose-500 dark:text-white min-h-[80px]"
                  onChange={(e) => setFormData({...formData, rpd: e.target.value})}
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Riwayat Penyakit Keluarga (RPK)</label>
                <textarea 
                  placeholder="Contoh: Ayah menderita Hipertensi"
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border dark:border-slate-800 rounded-xl outline-none focus:ring-2 focus:ring-rose-500 dark:text-white min-h-[80px]"
                  onChange={(e) => setFormData({...formData, rpk: e.target.value})}
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Riwayat Penggunaan Obat (RPO)</label>
                <textarea 
                  placeholder="Contoh: Metformin 500mg, Insulin Novorapid"
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border dark:border-slate-800 rounded-xl outline-none focus:ring-2 focus:ring-rose-500 dark:text-white min-h-[80px]"
                  onChange={(e) => setFormData({...formData, rpo: e.target.value})}
                />
              </div>
            </div>
          </div>

          <button 
            disabled={loading}
            className="w-full bg-teal-600 hover:bg-teal-700 text-white font-black py-5 rounded-[1.5rem] flex items-center justify-center gap-3 transition-all active:scale-95 shadow-xl shadow-teal-500/20 text-lg"
          >
            {loading ? "MENDAFTARKAN..." : "KONFIRMASI PENDAFTARAN"} 
            {!loading && <CheckCircle2 size={24} />}
          </button>
        </form>
      </motion.div>
    </div>
  );
}