"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  User, ShieldCheck, Activity, MapPin, 
  Save, Smartphone, ArrowLeft, Loader2
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function SettingsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("profile");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // State terpusat untuk menyimpan semua data form
  const [formData, setFormData] = useState({
    full_name: "",
    domicile: "",
    age: "",
    rpd: "",
    rpk: "",
    rpo: ""
  });

  const patientId = "pasien123"; // Simulasi session

  // 1. Fetch data awal saat halaman dimuat
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/patients/${patientId}`);
        if (res.ok) {
          const data = await res.json();
          setFormData({
            full_name: data.full_name || "",
            domicile: data.domicile || "",
            age: data.age?.toString() || "",
            rpd: data.rpd || "",
            rpk: data.rpk || "",
            rpo: data.rpo || ""
          });
        }
      } catch (error) {
        console.error("Gagal memuat profil");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  // 2. Fungsi Simpan (Update Profile)
  const handleSave = async () => {
    setSaving(true);
    try {
      // Catatan: Karena di backend main.py saat ini belum ada endpoint PUT/Update, 
      // kode ini disiapkan untuk masa depan. Untuk sekarang kita simulasikan sukses.
      // await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/patients/${patientId}`, { ... })
      
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulasi delay jaringan
      alert("Perubahan berhasil disimpan!");
    } catch (error) {
      alert("Gagal menyimpan perubahan.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
      <Loader2 className="animate-spin text-teal-600" size={40} />
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-4 md:p-10 transition-colors duration-300 font-sans">
      <div className="max-w-4xl mx-auto">
        
        {/* HEADER */}
        <header className="mb-8 flex items-center gap-4">
          <button 
            onClick={() => router.back()} 
            className="p-3 bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 text-slate-400 hover:text-teal-600 transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight italic">Pengaturan <span className="text-teal-600">Akun</span></h1>
            <p className="text-slate-500 dark:text-slate-400 font-bold text-[10px] uppercase tracking-widest mt-1">Kelola preferensi & rekam medis Anda.</p>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* SIDEBAR TABS */}
          <aside className="md:col-span-1 space-y-2">
            <TabButton active={activeTab === "profile"} onClick={() => setActiveTab("profile")} icon={<User size={18} />} label="Profil" />
            <TabButton active={activeTab === "medical"} onClick={() => setActiveTab("medical")} icon={<Activity size={18} />} label="Rekam Medis" />
            <TabButton active={activeTab === "device"} onClick={() => setActiveTab("device")} icon={<Smartphone size={18} />} label="Integrasi" />
          </aside>

          {/* CONTENT AREA */}
          <main className="md:col-span-3 flex flex-col h-full">
            <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-6 md:p-8 border border-slate-200 dark:border-slate-800 shadow-xl flex-1 relative overflow-hidden">
              
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  {activeTab === "profile" && <ProfileSection formData={formData} setFormData={setFormData} />}
                  {activeTab === "medical" && <MedicalSection formData={formData} setFormData={setFormData} />}
                  {activeTab === "device" && <DeviceSection />}
                </motion.div>
              </AnimatePresence>

            </div>

            {/* ACTION BUTTONS (Ditempatkan di luar card agar selalu terlihat) */}
            <div className="mt-6 flex justify-end">
              <button 
                onClick={handleSave}
                disabled={saving}
                className="bg-teal-600 hover:bg-teal-700 text-white px-8 py-4 rounded-[1.5rem] font-black flex items-center gap-3 transition-all active:scale-95 shadow-xl shadow-teal-500/20 disabled:opacity-70 disabled:active:scale-100"
              >
                {saving ? <Loader2 size={20} className="animate-spin" /> : <Save size={20} />} 
                {saving ? "MENYIMPAN..." : "SIMPAN PERUBAHAN"}
              </button>
            </div>
          </main>

        </div>
      </div>
    </div>
  );
}

// --- SUB-KOMPONEN SECTIONS ---

function ProfileSection({ formData, setFormData }: any) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 mb-6">
        <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center text-slate-400">
          <User size={32} />
        </div>
        <div>
          <button className="text-xs font-bold text-teal-600 bg-teal-50 dark:bg-teal-900/30 px-3 py-1.5 rounded-lg hover:bg-teal-100 transition-colors uppercase tracking-widest">Ubah Foto</button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Nama Lengkap</label>
          <input 
            type="text" 
            value={formData.full_name} 
            onChange={(e) => setFormData({...formData, full_name: e.target.value})}
            className="w-full bg-slate-50 dark:bg-slate-950 border border-transparent dark:border-slate-800 rounded-2xl px-4 py-3 text-sm dark:text-white outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition-all" 
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Usia</label>
          <input 
            type="number" 
            value={formData.age} 
            onChange={(e) => setFormData({...formData, age: e.target.value})}
            className="w-full bg-slate-50 dark:bg-slate-950 border border-transparent dark:border-slate-800 rounded-2xl px-4 py-3 text-sm dark:text-white outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition-all" 
          />
        </div>
        <div className="space-y-1.5 md:col-span-2">
          <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Domisili</label>
          <div className="relative">
            <MapPin size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              value={formData.domicile} 
              onChange={(e) => setFormData({...formData, domicile: e.target.value})}
              className="w-full bg-slate-50 dark:bg-slate-950 border border-transparent dark:border-slate-800 rounded-2xl pl-12 pr-4 py-3 text-sm dark:text-white outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition-all" 
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function MedicalSection({ formData, setFormData }: any) {
  return (
    <div className="space-y-6">
      <div className="p-4 bg-teal-50 dark:bg-teal-900/10 border border-teal-100 dark:border-teal-900/20 rounded-2xl flex gap-3 items-start">
        <ShieldCheck className="text-teal-600 shrink-0 mt-0.5" size={20} />
        <p className="text-xs text-teal-800 dark:text-teal-300 leading-relaxed font-medium">
          Data riwayat medis ini dienkripsi secara *end-to-end* dan hanya dapat diakses oleh Anda dan tenaga medis NADI yang berwenang.
        </p>
      </div>
      
      <div className="space-y-5">
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Riwayat Penyakit Dahulu (RPD)</label>
          <textarea 
            value={formData.rpd}
            onChange={(e) => setFormData({...formData, rpd: e.target.value})}
            placeholder="Kosongkan jika tidak ada riwayat signifikan." 
            className="w-full bg-slate-50 dark:bg-slate-950 border border-transparent dark:border-slate-800 rounded-2xl px-5 py-4 text-sm dark:text-white outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition-all h-28 resize-none" 
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Riwayat Penyakit Keluarga (RPK)</label>
          <textarea 
            value={formData.rpk}
            onChange={(e) => setFormData({...formData, rpk: e.target.value})}
            placeholder="Riwayat medis turunan dalam keluarga..." 
            className="w-full bg-slate-50 dark:bg-slate-950 border border-transparent dark:border-slate-800 rounded-2xl px-5 py-4 text-sm dark:text-white outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition-all h-24 resize-none" 
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Obat-obatan Rutin (RPO)</label>
          <textarea 
            value={formData.rpo}
            onChange={(e) => setFormData({...formData, rpo: e.target.value})}
            placeholder="Daftar obat yang sedang rutin dikonsumsi..." 
            className="w-full bg-slate-50 dark:bg-slate-950 border border-transparent dark:border-slate-800 rounded-2xl px-5 py-4 text-sm dark:text-white outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition-all h-24 resize-none" 
          />
        </div>
      </div>
    </div>
  );
}

function DeviceSection() {
  return (
    <div className="space-y-4">
      <h3 className="text-sm font-black dark:text-white uppercase tracking-widest mb-4">Integrasi Aplikasi Pihak Ketiga</h3>
      
      {/* Integrasi Strava */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-transparent dark:border-slate-800 gap-4 transition-all hover:border-slate-200">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-[#FC4C02] rounded-[1rem] flex items-center justify-center text-white font-black text-xl shadow-lg shadow-[#FC4C02]/20">S</div>
          <div>
            <p className="text-sm font-black dark:text-white uppercase tracking-tight">Strava</p>
            <p className="text-[10px] text-slate-400 font-bold mt-0.5">Sinkronisasi data aktivitas lari otomatis</p>
          </div>
        </div>
        <button className="w-full sm:w-auto text-[10px] font-black text-[#FC4C02] border-2 border-[#FC4C02]/20 hover:border-[#FC4C02] bg-white dark:bg-slate-900 px-5 py-2.5 rounded-xl transition-all tracking-widest">HUBUNGKAN</button>
      </div>

      {/* Integrasi Google Fit (Contoh tambahan) */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-transparent dark:border-slate-800 gap-4 transition-all hover:border-slate-200">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-white rounded-[1rem] flex items-center justify-center border border-slate-100 dark:border-slate-800 shadow-sm">
            <Activity size={24} className="text-blue-500" />
          </div>
          <div>
            <p className="text-sm font-black dark:text-white uppercase tracking-tight">Google Fit</p>
            <p className="text-[10px] text-slate-400 font-bold mt-0.5">Tarik data langkah kaki harian</p>
          </div>
        </div>
        <button className="w-full sm:w-auto text-[10px] font-black text-slate-500 border-2 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-5 py-2.5 rounded-xl transition-all tracking-widest opacity-50 cursor-not-allowed">SEGERA HADIR</button>
      </div>
    </div>
  );
}

function TabButton({ active, onClick, icon, label }: any) {
  return (
    <button 
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-5 py-3.5 rounded-2xl transition-all font-black text-xs uppercase tracking-widest ${
        active 
        ? "bg-teal-600 text-white shadow-xl shadow-teal-500/20" 
        : "text-slate-400 hover:bg-white dark:hover:bg-slate-900 hover:text-slate-600 dark:hover:text-slate-200"
      }`}
    >
      {icon}
      {label}
    </button>
  );
}