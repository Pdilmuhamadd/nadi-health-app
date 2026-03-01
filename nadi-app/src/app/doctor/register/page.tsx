"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Stethoscope, User, Building2, CheckCircle2, ArrowLeft, Loader2 } from "lucide-react";

export default function RegisterDoctorPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    doctor_id: "",
    full_name: "",
    specialization: "Penyakit Dalam (Internis)"
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/register/doctor`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        alert("Pendaftaran Tenaga Medis Berhasil! Silakan masuk ke Portal Dokter.");
        router.push("/login");
      } else {
        const errData = await res.json();
        alert(`Gagal mendaftar: ${errData.detail || "Terjadi kesalahan server"}`);
      }
    } catch (err) {
      alert("Koneksi ke server Railway terputus. Pastikan backend aktif.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12 px-4 md:px-6 font-sans">
      <div className="max-w-2xl mx-auto mb-6">
        <button onClick={() => router.back()} className="flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-blue-600 transition-colors">
          <ArrowLeft size={16} /> Kembali
        </button>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-black dark:text-white tracking-tighter italic">
            REGISTRASI <span className="text-blue-600">TENAGA MEDIS</span>
          </h1>
          <p className="text-slate-500 mt-2 font-medium text-sm">Bergabung dengan jaringan NADI untuk memantau pasien Anda.</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-[2rem] shadow-xl border border-slate-100 dark:border-slate-800 space-y-6">
          <div className="flex items-center gap-2 mb-4 text-blue-600 font-bold border-b border-slate-50 dark:border-slate-800 pb-4">
            <Stethoscope size={20} />
            <span className="text-sm uppercase tracking-widest">Kredensial Medis</span>
          </div>
          
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">ID Dokter / SIP <span className="text-rose-500">*</span></label>
              <input 
                type="text" placeholder="Contoh: dr_ahmad" required
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-transparent dark:border-slate-800 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 dark:text-white transition-all"
                onChange={(e) => setFormData({...formData, doctor_id: e.target.value})}
              />
            </div>
            
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Nama Lengkap & Gelar <span className="text-rose-500">*</span></label>
              <input 
                type="text" placeholder="dr. Ahmad Santoso, Sp.PD" required
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-transparent dark:border-slate-800 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 dark:text-white transition-all"
                onChange={(e) => setFormData({...formData, full_name: e.target.value})}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Spesialisasi</label>
              <select 
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-transparent dark:border-slate-800 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 dark:text-white transition-all"
                onChange={(e) => setFormData({...formData, specialization: e.target.value})}
              >
                <option>Penyakit Dalam (Internis)</option>
                <option>Endokrinologi</option>
                <option>Dokter Umum</option>
                <option>Psikiatri</option>
              </select>
            </div>
          </div>

          <button 
            disabled={loading}
            className="w-full mt-8 bg-blue-600 hover:bg-blue-700 text-white font-black py-5 rounded-[1.5rem] flex items-center justify-center gap-3 transition-all active:scale-95 shadow-xl shadow-blue-500/20 text-lg disabled:opacity-70"
          >
            {loading ? <Loader2 className="animate-spin" size={24} /> : "DAFTAR SEBAGAI DOKTER"}
            {!loading && <CheckCircle2 size={24} />}
          </button>
        </form>
      </motion.div>
    </div>
  );
}