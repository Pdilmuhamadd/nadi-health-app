"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from "recharts";
import { 
  Heart, Activity, Droplets, Bell, User, Plus, X, 
  CheckCircle2, Download, AlertTriangle, MessageCircle, Loader2
} from "lucide-react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export default function PatientDashboard() {
  const router = useRouter();
  
  // STATE DINAMIS
  const [patientId, setPatientId] = useState("");
  const [patientData, setPatientData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  // STATE UI
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const [newRecord, setNewRecord] = useState({
    blood_sugar: "",
    sugar_type: "Sewaktu",
    systolic: "",
    diastolic: "",
    mood_journal: ""
  });

  // 1. AMBIL ID DARI MEMORI BROWSER (LOCALSTORAGE)
  useEffect(() => {
    const storedId = localStorage.getItem("nadi_user_id");
    if (storedId) {
      setPatientId(storedId);
    } else {
      router.push("/login"); // Tendang ke login kalau gak ada ID
    }
  }, [router]);

  // 2. FETCH DATA DARI POSTGRESQL (VIA RAILWAY)
  useEffect(() => {
    if (!patientId) return; // Jangan fetch kalau ID belum dapat

    const fetchData = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/patients/${patientId}`);
        if (res.ok) {
          const data = await res.json();
          setPatientData(data);
        }
      } catch (err) {
        console.error("Gagal mengambil data dari server.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [patientId]);

  // 3. FUNGSI SOS (EMERGENCY)
  const handleSOS = async () => {
    const confirmSOS = confirm("PERINGATAN: Sinyal darurat akan dikirimkan ke tenaga medis. Lanjutkan?");
    if (!confirmSOS) return;

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/emergency`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ patient_id: patientId }),
      });
      if (res.ok) {
        alert("Sinyal SOS terkirim! Tetap tenang, bantuan medis segera merespon.");
      }
    } catch (err) {
      alert("Gagal terhubung ke server. Segera telepon nomor layanan darurat!");
    }
  };

  // 4. FUNGSI DOWNLOAD PDF
  const downloadPDF = async () => {
    setIsDownloading(true);
    try {
      const element = document.getElementById("report-area");
      if (!element) return;

      const canvas = await html2canvas(element, { scale: 2, useCORS: true, backgroundColor: "#f8fafc" });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      
      pdf.setFontSize(18);
      pdf.setTextColor(13, 148, 136);
      pdf.text("LAPORAN KESEHATAN NADI", 10, 20);
      
      pdf.setFontSize(10);
      pdf.setTextColor(100);
      pdf.text(`Pasien: ${patientData?.full_name || "Data Tidak Tersedia"} | ID: ${patientId}`, 10, 28);
      pdf.text(`Dicetak pada: ${new Date().toLocaleString('id-ID')}`, 10, 34);
      
      const imgWidth = 190;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      pdf.addImage(imgData, "PNG", 10, 42, imgWidth, imgHeight);
      pdf.save(`NADI_Report_${patientId}.pdf`);
    } catch (error) {
      console.error("Gagal men-generate PDF", error);
      alert("Terjadi kesalahan saat membuat dokumen PDF.");
    } finally {
      setIsDownloading(false);
    }
  };

  // 5. FUNGSI SIMPAN REKAM MEDIS BARU
  const handleSaveRecord = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/records`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          patient_id: patientId,
          blood_sugar: parseInt(newRecord.blood_sugar),
          sugar_type: newRecord.sugar_type,
          systolic: parseInt(newRecord.systolic) || 0,
          diastolic: parseInt(newRecord.diastolic) || 0,
          mood_journal: newRecord.mood_journal
        }),
      });
      
      const result = await res.json();
      if (res.ok) {
        alert(`Analisis AI: ${result.ai_analysis || 'Berhasil disimpan'}`);
        setIsModalOpen(false);
        window.location.reload(); // Reload untuk tarik data baru
      } else {
        alert(`Gagal menyimpan: ${result.detail || 'Error dari server'}`);
      }
    } catch (err) {
      alert("Koneksi server terputus. Coba lagi.");
    } finally {
      setSubmitting(false);
    }
  };

  // ==========================================
  // LOGIKA DATA DINAMIS (PENGGANTI HARDCODE)
  // ==========================================
  
  // Ambil record paling terakhir dari array records (jika ada)
  const records = patientData?.records || [];
  const latestRecord = records.length > 0 ? records[records.length - 1] : null;

  // Format data chart untuk Recharts (Ambil 7 data terakhir)
  const formatChartData = () => {
    if (records.length === 0) return [];
    const days = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];
    
    // Potong maksimal 7 data terakhir
    const recentRecords = records.slice(-7);
    
    return recentRecords.map((r: any) => {
      const dateObj = new Date(r.created_at);
      return {
        day: days[dateObj.getDay()],
        value: r.blood_sugar
      };
    });
  };
  const dynamicChartData = formatChartData();

  // ANIMATION VARIANTS
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
      <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}>
        <Loader2 className="text-teal-600" size={48} />
      </motion.div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-20 font-sans">
      
      {/* HEADER */}
      <header className="bg-white dark:bg-slate-900 px-6 py-6 border-b border-slate-100 dark:border-slate-800 sticky top-0 z-30">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-teal-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-teal-500/20">
              <User size={24} />
            </div>
            <div>
              <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Pasien Terverifikasi</p>
              <h1 className="text-xl font-black dark:text-white tracking-tight">{patientData?.full_name || "Nama Tidak Ditemukan"}</h1>
            </div>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={downloadPDF} 
              disabled={isDownloading}
              className="hidden md:flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-xl text-[10px] font-black uppercase hover:bg-teal-600 hover:text-white transition-all disabled:opacity-50"
            >
              {isDownloading ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />} 
              {isDownloading ? "Mencetak..." : "Export PDF"}
            </button>
            <button onClick={() => router.push('/patient/chat')} className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl text-slate-400 hover:text-teal-600 transition-colors">
              <MessageCircle size={20} />
            </button>
          </div>
        </div>
      </header>

      <main id="report-area" className="max-w-5xl mx-auto px-6 pt-8 space-y-6">
        
        {/* STATS CARDS DINAMIS */}
        <motion.div 
          initial="hidden" animate="show" transition={{ staggerChildren: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          <motion.div variants={cardVariants} whileHover={{ y: -5 }} className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-xl">
            <div className="p-3 w-fit bg-rose-50 dark:bg-rose-900/20 text-rose-500 rounded-2xl mb-4"><Droplets size={24} /></div>
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">Gula Darah Terakhir</p>
            <h2 className="text-3xl font-black dark:text-white mt-1">
              {latestRecord ? latestRecord.blood_sugar : "--"} <span className="text-sm font-medium text-slate-400">mg/dL</span>
            </h2>
          </motion.div>

          <motion.div variants={cardVariants} whileHover={{ y: -5 }} className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-xl">
            <div className="p-3 w-fit bg-blue-50 dark:bg-blue-900/20 text-blue-500 rounded-2xl mb-4"><Activity size={24} /></div>
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">Tekanan Darah</p>
            <h2 className="text-3xl font-black dark:text-white mt-1">
              {latestRecord && latestRecord.systolic ? `${latestRecord.systolic}/${latestRecord.diastolic}` : "--/--"} <span className="text-sm font-medium text-slate-400">mmHg</span>
            </h2>
          </motion.div>

          <motion.div variants={cardVariants} whileHover={{ y: -5 }} className={`${latestRecord && latestRecord.ai_analysis && latestRecord.ai_analysis.toLowerCase().includes("bahaya") ? "bg-rose-600 shadow-rose-500/20" : "bg-teal-600 shadow-teal-500/20"} p-6 rounded-[2rem] text-white shadow-xl`}>
            <div className="p-3 w-fit bg-white/20 rounded-2xl mb-4">
              {latestRecord && latestRecord.ai_analysis && latestRecord.ai_analysis.toLowerCase().includes("bahaya") ? <AlertTriangle size={24} /> : <CheckCircle2 size={24} />}
            </div>
            <p className="text-white/70 text-[10px] font-black uppercase tracking-widest">Analisis Status AI</p>
            <h2 className="text-xl md:text-2xl font-black mt-1 italic uppercase tracking-tighter line-clamp-2 leading-tight">
              {latestRecord && latestRecord.ai_analysis ? latestRecord.ai_analysis : "Belum Ada Data"}
            </h2>
          </motion.div>
        </motion.div>

        {/* CHART SECTION DINAMIS */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-xl"
        >
          <h3 className="text-lg font-black dark:text-white uppercase tracking-tight italic mb-8">Tren Kesehatan (7 Entri Terakhir)</h3>
          
          {dynamicChartData.length > 0 ? (
            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={dynamicChartData}>
                  <defs>
                    <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0d9488" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#0d9488" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 800}} dy={10} />
                  <Tooltip contentStyle={{borderRadius: '20px', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.1)'}} />
                  <Area type="monotone" dataKey="value" stroke="#0d9488" strokeWidth={4} fillOpacity={1} fill="url(#colorVal)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-[250px] w-full flex flex-col items-center justify-center text-slate-400 space-y-3">
              <Activity size={48} className="opacity-20" />
              <p className="text-sm font-bold uppercase tracking-widest">Belum ada riwayat terekam</p>
            </div>
          )}
        </motion.section>
      </main>

      {/* EMERGENCY SOS BUTTON */}
      <motion.button 
        animate={{ scale: [1, 1.1, 1], boxShadow: ["0 0 0px rgba(225,29,72,0)", "0 0 20px rgba(225,29,72,0.5)", "0 0 0px rgba(225,29,72,0)"] }}
        transition={{ repeat: Infinity, duration: 1.5 }}
        onClick={handleSOS}
        className="fixed bottom-28 right-6 md:right-8 w-14 h-14 md:w-16 md:h-16 bg-rose-600 text-white rounded-[2rem] shadow-2xl flex items-center justify-center z-40 border-4 border-slate-50 dark:border-slate-950"
      >
        <AlertTriangle size={28} />
      </motion.button>

      {/* ADD DATA BUTTON */}
      <motion.button 
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsModalOpen(true)}
        className="fixed bottom-8 right-6 md:right-8 w-14 h-14 md:w-16 md:h-16 bg-teal-600 text-white rounded-[2rem] shadow-2xl shadow-teal-500/30 flex items-center justify-center z-40 border-4 border-slate-50 dark:border-slate-950"
      >
        <Plus size={28} />
      </motion.button>

      {/* INPUT MODAL */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-[2.5rem] p-6 md:p-8 shadow-2xl border border-slate-100 dark:border-slate-800 relative max-h-[90vh] overflow-y-auto"
            >
              <button onClick={() => setIsModalOpen(false)} className="absolute top-6 right-6 text-slate-400 hover:text-rose-500 bg-slate-50 dark:bg-slate-800 p-2 rounded-full transition-colors">
                <X size={20} />
              </button>
              
              <h2 className="text-2xl font-black dark:text-white uppercase italic tracking-tighter mb-6 mt-2">Update <span className="text-teal-600">Vitalitas</span></h2>
              
              <form onSubmit={handleSaveRecord} className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Gula Darah</label>
                    <input type="number" required placeholder="mg/dL" className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-transparent dark:border-slate-800 rounded-2xl outline-none focus:ring-2 focus:ring-teal-500 dark:text-white transition-all" onChange={(e) => setNewRecord({...newRecord, blood_sugar: e.target.value})} />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Kondisi</label>
                    <select className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-transparent dark:border-slate-800 rounded-2xl outline-none focus:ring-2 focus:ring-teal-500 dark:text-white transition-all" onChange={(e) => setNewRecord({...newRecord, sugar_type: e.target.value})}>
                      <option>Sewaktu</option><option>Puasa</option><option>Setelah Makan</option>
                    </select>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Sistolik</label>
                    <input type="number" placeholder="mmHg" className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-transparent dark:border-slate-800 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 dark:text-white transition-all" onChange={(e) => setNewRecord({...newRecord, systolic: e.target.value})} />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Diastolik</label>
                    <input type="number" placeholder="mmHg" className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-transparent dark:border-slate-800 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 dark:text-white transition-all" onChange={(e) => setNewRecord({...newRecord, diastolic: e.target.value})} />
                  </div>
                </div>
                
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Jurnal Harian & Keluhan</label>
                  <textarea placeholder="Ceritakan perasaanmu atau keluhan hari ini..." className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-transparent dark:border-slate-800 rounded-2xl outline-none focus:ring-2 focus:ring-teal-500 dark:text-white min-h-[100px] resize-none transition-all" onChange={(e) => setNewRecord({...newRecord, mood_journal: e.target.value})} />
                </div>
                
                <button disabled={submitting} className="w-full mt-2 bg-teal-600 text-white font-black py-4 rounded-[1.5rem] shadow-xl shadow-teal-500/20 disabled:opacity-70 transition-all active:scale-95 flex items-center justify-center gap-2">
                  {submitting ? <Loader2 size={20} className="animate-spin" /> : <CheckCircle2 size={20} />}
                  {submitting ? "MENGANALISIS..." : "SIMPAN & ANALISIS AI"}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}