"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { 
  User, MapPin, Calendar, Activity, 
  ClipboardList, ArrowRight, CheckCircle2, 
  ArrowLeft, Loader2 
} from "lucide-react";

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
          age: parseInt(formData.age) || 0 // Mencegah NaN terkirim ke DB
        }),
      });

      if (res.ok) {
        alert("Pendaftaran Pasien Berhasil! Silakan masuk dengan ID Anda.");
        router.push("/login");
      } else {
        const errData = await res.json();
        alert(`Gagal mendaftar: ${errData.detail || "Terjadi kesalahan di server"}`);
      }
    } catch (err) {
      alert("Koneksi ke server Railway terputus. Pastikan backend aktif.");
    } finally {
      setLoading(false);
    }
  };

  // Variasi Animasi Framer Motion
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

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12 px-4 md:px-6 font-sans">
      
      {/* Tombol Back */}
      <div className="max-w-2xl mx-auto mb-6">
        <button 
          onClick={() => router.back()} 
          className="flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-teal-600 transition-colors"
        >
          <ArrowLeft size={16} /> Kembali
        </button>
      </div>

      <motion.div 
        initial="hidden" animate="show" variants={containerVariants}
        className="max-w-2xl mx-auto"
      >
        <motion.div variants={itemVariants} className="text-center mb-10">
          <h1 className="text-4xl font-black dark:text-white tracking-tighter italic">
            PENDAFTARAN <span className="text-teal-600">PASIEN</span>
          </h1>
          <p className="text-slate-500 mt-2 font-medium text-sm">Lengkapi rekam medis awal Anda untuk terhubung dengan NADI.</p>
        </motion.div>

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Section 1: Data Diri */}
          <motion.div variants={itemVariants} className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-[2rem] shadow-xl border border-slate-100 dark:border-slate-800 space-y-4">
            <div className="flex items-center gap-2 mb-4 text-teal-600 font-bold border-b border-slate-50 dark:border-slate-800 pb-4">
              <User size={20} />
              <span className="text-sm uppercase tracking-widest">Informasi Pribadi</span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">ID Pasien / Username <span className="text-rose-500">*</span></label>
                <input 
                  type="text" 
                  placeholder="fadhil_01"
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-transparent dark:border-slate-800 rounded-2xl outline-none focus:ring-2 focus:ring-teal-500 dark:text-white transition-all"
                  onChange={(e) => setFormData({...formData, patient_id: e.target.value})}
                  required 
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Nama Lengkap <span className="text-rose-500">*</span></label>
                <input 
                  type="text" 
                  placeholder="Nama sesuai KTP"
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-transparent dark:border-slate-800 rounded-2xl outline-none focus:ring-2 focus:ring-teal-500 dark:text-white transition-all"
                  onChange={(e) => setFormData({...formData, full_name: e.target.value})}
                  required 
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Usia <span className="text-rose-500">*</span></label>
                <input 
                  type="number" 
                  placeholder="Angka"
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-transparent dark:border-slate-800 rounded-2xl outline-none focus:ring-2 focus:ring-teal-500 dark:text-white transition-all"
                  onChange={(e) => setFormData({...formData, age: e.target.value})}
                  required 
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Domisili <span className="text-rose-500">*</span></label>
                <input 
                  type="text" 
                  defaultValue="Serang, Banten"
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-transparent dark:border-slate-800 rounded-2xl outline-none focus:ring-2 focus:ring-teal-500 dark:text-white transition-all"
                  onChange={(e) => setFormData({...formData, domicile: e.target.value})}
                  required 
                />
              </div>
            </div>
          </motion.div>

          {/* Section 2: Riwayat Medis */}
          <motion.div variants={itemVariants} className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-[2rem] shadow-xl border border-slate-100 dark:border-slate-800 space-y-4">
            <div className="flex items-center gap-2 mb-4 text-rose-500 font-bold border-b border-slate-50 dark:border-slate-800 pb-4">
              <ClipboardList size={20} />
              <span className="text-sm uppercase tracking-widest">Rekam Medis Awal</span>
            </div>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Riwayat Penyakit Dahulu (RPD)</label>
                <textarea 
                  placeholder="Contoh: Diabetes Tipe 1 sejak 2024 (Kosongkan jika tidak ada)"
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-transparent dark:border-slate-800 rounded-2xl outline-none focus:ring-2 focus:ring-rose-500 dark:text-white min-h-[80px] resize-none transition-all"
                  onChange={(e) => setFormData({...formData, rpd: e.target.value})}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Riwayat Penyakit Keluarga (RPK)</label>
                <textarea 
                  placeholder="Contoh: Ayah menderita Hipertensi (Kosongkan jika tidak ada)"
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-transparent dark:border-slate-800 rounded-2xl outline-none focus:ring-2 focus:ring-rose-500 dark:text-white min-h-[80px] resize-none transition-all"
                  onChange={(e) => setFormData({...formData, rpk: e.target.value})}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Riwayat Penggunaan Obat (RPO)</label>
                <textarea 
                  placeholder="Contoh: Metformin 500mg (Kosongkan jika tidak ada)"
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-transparent dark:border-slate-800 rounded-2xl outline-none focus:ring-2 focus:ring-rose-500 dark:text-white min-h-[80px] resize-none transition-all"
                  onChange={(e) => setFormData({...formData, rpo: e.target.value})}
                />
              </div>
            </div>
          </motion.div>

          {/* Submit Button */}
          <motion.button 
            variants={itemVariants}
            disabled={loading}
            className="w-full bg-teal-600 hover:bg-teal-700 text-white font-black py-5 rounded-[1.5rem] flex items-center justify-center gap-3 transition-all active:scale-95 shadow-xl shadow-teal-500/20 text-lg disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" size={24} />
                MENDAFTARKAN...
              </>
            ) : (
              <>
                KONFIRMASI PENDAFTARAN
                <CheckCircle2 size={24} />
              </>
            )}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
}