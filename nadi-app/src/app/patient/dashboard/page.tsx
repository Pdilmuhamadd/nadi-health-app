"use client";

import React, { useState, useEffect } from "react";
import { 
  Plus, X, Save, Thermometer, Brain, HeartPulse, Syringe, 
  Activity, Droplets, Bell, LogOut, FileText, BrainCircuit 
} from "lucide-react";
import Link from "next/link";

export default function PatientDashboard() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // 1. Siapkan State untuk menampung input
  const [formData, setFormData] = useState({
    patient_id: "pasien-01", 
    blood_sugar: 0,
    sugar_type: "Puasa",
    systolic: 120,
    diastolic: 80,
    insulin_unit: 0,
    mood_journal: ""
  });

  // 2. Fungsi handleSubmit yang baru
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await fetch("http://localhost:8000/api/records", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      
      if (result.status === "success") {
        alert(`Berhasil! Analisis Mood: ${result.ai_insight}`);
        setIsModalOpen(false);
      }
    } catch (error) {
      console.error("Gagal terhubung ke Backend Python:", error);
      alert("Pastikan main.py sudah dijalankan!");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-4 md:p-8 transition-colors duration-300">
      {/* Navbar */}
      <nav className="flex items-center justify-between mb-10 bg-white dark:bg-slate-900 p-4 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-teal-600 rounded-lg flex items-center justify-center text-white font-black shadow-lg shadow-teal-500/20">N</div>
          <span className="font-bold dark:text-white uppercase tracking-wider text-sm">NADI Pasien</span>
        </div>
        <Link href="/login" className="text-slate-400 hover:text-teal-600 p-2"><LogOut size={20} /></Link>
      </nav>

      <div className="max-w-7xl mx-auto space-y-10">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Halo, Fadhil 👋</h1>
            <p className="text-slate-500 dark:text-slate-400 font-medium">Lengkapi rekam medis harian Anda.</p>
          </div>
          <button onClick={() => setIsModalOpen(true)} className="bg-teal-600 text-white px-8 py-4 rounded-2xl font-bold shadow-lg shadow-teal-500/20 flex items-center gap-2 hover:bg-teal-700 transition-all active:scale-95">
            <Plus size={20} /> Input Data Medis
          </button>
        </header>

        {/* Vital Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <StatCard title="Gula Darah" value="110" unit="mg/dL" icon={<Droplets className="text-teal-600" />} />
          <StatCard title="Tekanan Darah" value="120/80" unit="mmHg" icon={<HeartPulse className="text-blue-500" />} />
          <StatCard title="BMI" value="22.5" unit="Ideal" icon={<Activity className="text-emerald-500" />} />
          <StatCard title="Mood" value="Stabil" unit="AI" icon={<BrainCircuit className="text-purple-500" />} />
        </div>

        {/* EMR Summary Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm">
            <h3 className="font-bold mb-6 flex items-center gap-2 dark:text-white uppercase text-xs tracking-widest">
              <FileText size={20} className="text-teal-600" /> Ringkasan EMR
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <EMRBadge label="RPS" content="Gejala lemas sore hari" />
              <EMRBadge label="RPD" content="Diabetes Tipe 1 (2 Thn)" />
              <EMRBadge label="RPK" content="Riwayat Ayah Diabetes" />
              <EMRBadge label="RPO" content="Insulin & Metformin" />
            </div>
          </div>
          <div className="bg-teal-50 dark:bg-teal-900/10 p-8 rounded-[2.5rem] border border-teal-100 dark:border-teal-900/20">
            <h4 className="text-[10px] font-bold uppercase tracking-widest text-teal-600 mb-4 flex items-center gap-2">
              <Bell size={14} /> Pesan Medis Terakhir
            </h4>
            <p className="text-sm text-slate-700 dark:text-slate-300 italic leading-relaxed">
              "Gula darah puasa sudah baik, pertahankan dosis insulin 2 jam setelah makan malam. Jangan lupa hidrasi saat lari di Serang."
            </p>
          </div>
        </div>
      </div>

      {/* Modal Input */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-[3rem] p-8 md:p-12 shadow-2xl relative my-10">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-8 right-8 text-slate-400 hover:text-teal-600 transition-colors">
              <X size={28} />
            </button>
            <h2 className="text-3xl font-black mb-8 dark:text-white tracking-tight">Catat Perkembangan</h2>
            <form className="grid grid-cols-1 md:grid-cols-2 gap-8" onSubmit={(e) => e.preventDefault()}>
              <div className="space-y-6">
                <div className="space-y-3">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Kategori Gula Darah</label>
                  <select className="w-full bg-slate-50 dark:bg-slate-950 border dark:border-slate-800 rounded-xl px-4 py-3 text-sm dark:text-white outline-none">
                    <option>Puasa (Bangun Tidur)</option>
                    <option>2 Jam Setelah Makan</option>
                    <option>Sewaktu (Sebelum Tidur)</option>
                  </select>
                  <input type="number" placeholder="Hasil (mg/dL)" className="w-full bg-slate-50 dark:bg-slate-950 border dark:border-slate-800 rounded-xl px-4 py-3 text-sm dark:text-white" />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Dosis Insulin (Unit)</label>
                  <input type="number" placeholder="Contoh: 4" className="w-full bg-slate-50 dark:bg-slate-950 border dark:border-slate-800 rounded-xl px-4 py-3 text-sm dark:text-white" />
                </div>
              </div>
              <div className="space-y-6">
                <div className="space-y-3">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Jurnal Mood & Keluhan</label>
                  <textarea rows={4} placeholder="Apa yang Anda rasakan hari ini?" className="w-full bg-slate-50 dark:bg-slate-950 border dark:border-slate-800 rounded-xl px-4 py-3 text-sm dark:text-white outline-none resize-none" />
                </div>
                <button className="w-full bg-teal-600 hover:bg-teal-700 text-white font-black py-4 rounded-xl shadow-lg shadow-teal-500/20 transition-all active:scale-95">
                  SIMPAN REKAM MEDIS
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({ title, value, unit, icon }: any) {
  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm transition-all hover:shadow-md">
      <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-950 flex items-center justify-center mb-4">{icon}</div>
      <div className="flex items-baseline gap-1">
        <span className="text-2xl font-black dark:text-white tracking-tight">{value}</span>
        <span className="text-[10px] font-bold text-slate-400 uppercase">{unit}</span>
      </div>
      <p className="text-[10px] font-bold text-slate-400 uppercase mt-1 tracking-widest">{title}</p>
    </div>
  );
}

function EMRBadge({ label, content }: any) {
  return (
    <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-slate-800">
      <p className="text-[9px] font-bold text-teal-600 uppercase tracking-widest mb-1">{label}</p>
      <p className="text-xs font-bold text-slate-700 dark:text-slate-300">{content}</p>
    </div>
  );
}