"use client";

import React, { useState, useEffect } from "react";
import { 
  User, 
  ShieldCheck, 
  Activity, 
  MapPin, 
  Save, 
  Smartphone,
  ChevronRight
} from "lucide-react";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("profile");

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-4 md:p-10 transition-colors duration-300">
      <div className="max-w-4xl mx-auto">
        <header className="mb-10">
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Pengaturan Akun</h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium text-sm">Kelola informasi pribadi dan riwayat medis Anda.</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Sidebar Menu */}
          <aside className="md:col-span-1 space-y-2">
            <TabButton 
              active={activeTab === "profile"} 
              onClick={() => setActiveTab("profile")} 
              icon={<User size={18} />} 
              label="Profil" 
            />
            <TabButton 
              active={activeTab === "medical"} 
              onClick={() => setActiveTab("medical")} 
              icon={<Activity size={18} />} 
              label="Riwayat Medis" 
            />
            <TabButton 
              active={activeTab === "device"} 
              onClick={() => setActiveTab("device")} 
              icon={<Smartphone size={18} />} 
              label="Gawai & App" 
            />
          </aside>

          {/* Content Area */}
          <main className="md:col-span-3 bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 border border-slate-200 dark:border-slate-800 shadow-sm">
            {activeTab === "profile" && <ProfileSection />}
            {activeTab === "medical" && <MedicalSection />}
            {activeTab === "device" && <DeviceSection />}

            <div className="mt-10 pt-6 border-t border-slate-100 dark:border-slate-800 flex justify-end">
              <button className="bg-rose-600 hover:bg-rose-700 text-white px-8 py-3 rounded-2xl font-bold flex items-center gap-2 transition-all active:scale-95 shadow-lg shadow-rose-500/20">
                <Save size={18} /> Simpan Perubahan
              </button>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

// --- Sub-komponen Section ---

function ProfileSection() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Nama Lengkap</label>
          <input type="text" defaultValue="Fadhil Muhamad Pratama" className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm dark:text-white outline-none focus:border-rose-500 transition-all" />
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Domisili</label>
          <div className="relative">
            <MapPin size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input type="text" defaultValue="Serang, Banten" className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl pl-10 pr-4 py-3 text-sm dark:text-white outline-none focus:border-rose-500 transition-all" />
          </div>
        </div>
      </div>
    </div>
  );
}

function MedicalSection() {
  return (
    <div className="space-y-6">
      <div className="p-4 bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/20 rounded-2xl flex gap-3">
        <ShieldCheck className="text-amber-600 shrink-0" size={20} />
        <p className="text-[11px] text-amber-700 dark:text-amber-400 leading-relaxed font-medium">
          Data riwayat medis Anda hanya akan dibagikan kepada Tenaga Medis yang terverifikasi di platform NADI.
        </p>
      </div>
      
      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Riwayat Penyakit Sekarang (RPS)</label>
          <textarea placeholder="Ceritakan kondisi kesehatan Anda saat ini..." className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl px-5 py-4 text-sm dark:text-white outline-none focus:border-rose-500 transition-all h-32 resize-none" />
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Riwayat Penyakit Dahulu (RPD)</label>
          <textarea placeholder="Apakah Anda pernah memiliki riwayat penyakit tertentu sebelumnya?" className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl px-5 py-4 text-sm dark:text-white outline-none focus:border-rose-500 transition-all h-24 resize-none" />
        </div>
      </div>
    </div>
  );
}

function DeviceSection() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between p-5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-[#FC4C02] rounded-xl flex items-center justify-center text-white font-bold">S</div>
          <div>
            <p className="text-sm font-bold dark:text-white">Strava</p>
            <p className="text-[10px] text-slate-400 font-medium italic">Sinkronisasi data lari otomatis</p>
          </div>
        </div>
        <button className="text-[10px] font-bold text-rose-600 bg-rose-50 dark:bg-rose-900/20 px-4 py-2 rounded-lg hover:bg-rose-100 transition-all">HUBUNGKAN</button>
      </div>
    </div>
  );
}

function TabButton({ active, onClick, icon, label }: any) {
  return (
    <button 
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all font-bold text-sm ${
        active 
        ? "bg-rose-600 text-white shadow-lg shadow-rose-500/20" 
        : "text-slate-400 hover:bg-white dark:hover:bg-slate-900 hover:text-slate-600 dark:hover:text-slate-200"
      }`}
    >
      {icon}
      {label}
    </button>
  );
}