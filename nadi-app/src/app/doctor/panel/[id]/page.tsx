"use client";

import React, { useState, useEffect } from "react";
import { 
  ArrowLeft, FileText, Printer, Activity, 
  HeartPulse, Droplets, Brain 
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { 
  Area, AreaChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip 
} from "recharts";

// Komponen Pembantu untuk Baris Laporan
function ReportField({ label, content }: { label: string; content: string | number }) {
  return (
    <div className="space-y-1">
      <h4 className="text-[9px] font-bold text-teal-600 uppercase tracking-widest">{label}</h4>
      <p className="text-sm font-medium text-slate-700 dark:text-slate-300 leading-relaxed">
        {content || "-"}
      </p>
    </div>
  );
}

export default function PatientReportPage() {
  const params = useParams();
  const [patient, setPatient] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // 1. Fetch data dari Backend Python
  useEffect(() => {
    const fetchPatientData = async () => {
      try {
        const response = await fetch(`http://localhost:8000/api/patients/${params.id}`);
        const data = await response.json();
        setPatient(data);
      } catch (error) {
        console.error("Gagal mengambil data pasien:", error);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) fetchPatientData();
  }, [params.id]);

  const handlePrint = () => {
    window.print();
  };

  if (loading) return <div className="p-10 text-center font-bold dark:text-white">Memuat Rekam Medis...</div>;
  if (!patient) return <div className="p-10 text-center font-bold text-rose-600">Pasien tidak ditemukan.</div>;

  // Data grafik dummy (nantinya bisa diambil dari riwayat medis asli)
  const sugarData = [
    { day: 'Sen', level: 110 }, { day: 'Sel', level: 125 },
    { day: 'Rab', level: 115 }, { day: 'Kam', level: 140 },
    { day: 'Jum', level: 120 }, { day: 'Sab', level: patient.blood_sugar || 110 },
    { day: 'Min', level: 105 },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-4 md:p-10 transition-colors duration-300">
      <div className="max-w-5xl mx-auto">
        
        {/* Navigation - Hidden on Print */}
        <div className="mb-8 print:hidden flex justify-between items-center">
          <Link href="/panel" className="flex items-center gap-2 text-slate-400 hover:text-teal-600 font-bold text-sm transition-colors">
            <ArrowLeft size={18} /> Kembali ke Daftar
          </Link>
          <button 
            onClick={handlePrint}
            className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 shadow-lg shadow-teal-500/20 active:scale-95 transition-all"
          >
            <Printer size={18} /> Cetak Laporan PDF
          </button>
        </div>

        {/* MEDICAL REPORT CONTAINER */}
        <div className="bg-white dark:bg-slate-900 rounded-[3rem] p-8 md:p-16 shadow-xl border border-slate-200 dark:border-slate-800 print:shadow-none print:border-none print:p-0">
          
          {/* Kop Surat */}
          <div className="flex justify-between items-start border-b-2 border-teal-600 pb-8 mb-10">
            <div>
              <h1 className="text-3xl font-black text-teal-600 tracking-tighter uppercase">Nadi Medical.</h1>
              <p className="text-[10px] font-bold text-slate-400 tracking-[0.3em] uppercase mt-1">Digital Health Solution</p>
            </div>
            <div className="text-right text-[10px] text-slate-500 font-bold uppercase leading-relaxed tracking-widest">
              <p>Jl. Jend. Sudirman No. 123</p>
              <p>Serang, Banten, Indonesia</p>
              <p>nadi-health.com</p>
            </div>
          </div>

          {/* Info Pasien Utama */}
          <div className="grid grid-cols-2 gap-8 mb-12">
            <div>
              <h2 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Identitas Pasien</h2>
              <p className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">{patient.name}</p>
              <p className="text-sm text-slate-500 font-medium italic">{patient.age} Tahun • {patient.domicile}</p>
            </div>
            <div className="text-right">
              <h2 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Status Klinis</h2>
              <p className="text-lg font-bold text-teal-600 uppercase italic">Kondisi {patient.ai_status || "Stabil"}</p>
              <p className="text-sm text-slate-500 font-medium uppercase tracking-tighter">Laporan per {new Date().toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}</p>
            </div>
          </div>

          {/* Seksi EMR (Poin C PRD: RPS, RPD, RPK, RPO) */}
          <div className="space-y-8 mb-12">
            <h3 className="font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-2 flex items-center gap-2 uppercase tracking-widest text-[10px]">
              <FileText size={16} className="text-teal-600" /> Resume Medis Elektronik
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <ReportField label="Riwayat Penyakit Sekarang (RPS)" content={patient.rps} />
              <ReportField label="Riwayat Penyakit Dahulu (RPD)" content={patient.rpd} />
              <ReportField label="Riwayat Penyakit Keluarga (RPK)" content={patient.rpk} />
              <ReportField label="Riwayat Penggunaan Obat (RPO)" content={patient.rpo} />
            </div>
          </div>

          {/* Seksi Vital Signs & Grafik */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="md:col-span-2">
              <h3 className="font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-2 flex items-center gap-2 uppercase tracking-widest text-[10px] mb-6">
                <Activity size={16} className="text-teal-600" /> Tren Gula Darah Mingguan (mg/dL)
              </h3>
              <div className="h-[200px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={sugarData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10}} />
                    <YAxis hide domain={['dataMin - 10', 'dataMax + 10']} />
                    <Tooltip />
                    <Area type="monotone" dataKey="level" stroke="#0d9488" strokeWidth={3} fill="#0d9488" fillOpacity={0.1} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="space-y-4">
               <h3 className="font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-2 flex items-center gap-2 uppercase tracking-widest text-[10px] mb-2">
                Pemeriksaan Terakhir
              </h3>
              <VitalBadge icon={<Droplets size={14}/>} label="Gula Darah" value={`${patient.blood_sugar} mg/dL`} sub={patient.sugar_type} />
              <VitalBadge icon={<HeartPulse size={14}/>} label="Tekanan Darah" value={`${patient.systolic}/${patient.diastolic}`} sub="mmHg" />
            </div>
          </div>

          {/* Signature & AI Insight */}
          <div className="mt-20 pt-10 flex flex-col md:flex-row justify-between items-end border-t border-slate-100 dark:border-slate-800 gap-10">
            <div className="max-w-xs">
              <h4 className="text-[10px] font-bold text-purple-600 uppercase tracking-widest flex items-center gap-2 mb-2">
                <Brain size={14} /> AI Health Insight (BiLSTM-GRU)
              </h4>
              <p className="text-xs text-slate-500 italic leading-relaxed font-medium">
                "{patient.mood_journal ? `Berdasarkan jurnal harian: "${patient.mood_journal}". Hasil analisis menunjukkan kondisi mental ${patient.ai_status}.` : 'Belum ada data jurnal harian untuk dianalisis.'}"
              </p>
            </div>
            <div className="text-center md:pr-10 w-full md:w-auto">
              <p className="text-[10px] font-bold text-slate-400 mb-16 uppercase tracking-[0.2em]">Dokter Penanggung Jawab</p>
              <p className="text-sm font-black text-slate-900 dark:text-white uppercase">dr. Siti Aminah</p>
              <div className="h-[1px] w-full bg-slate-200 mt-1" />
              <p className="text-[9px] font-bold text-slate-400 mt-1 uppercase tracking-widest text-slate-500">STR: 12345678901122</p>
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @media print {
          @page { size: A4; margin: 15mm; }
          body { background: white !important; color: black !important; }
          .print\:hidden { display: none !important; }
          .print\:p-0 { padding: 0 !important; }
          .print\:shadow-none { box-shadow: none !important; }
          .print\:border-none { border: none !important; }
          .dark { color-scheme: light !important; }
          .dark body { background: white !important; color: black !important; }
        }
      `}</style>
    </div>
  );
}

function VitalBadge({ icon, label, value, sub }: any) {
  return (
    <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800">
      <div className="flex items-center gap-2 mb-1">
        <span className="text-teal-600">{icon}</span>
        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{label}</p>
      </div>
      <p className="text-lg font-black dark:text-white">{value}</p>
      <p className="text-[9px] font-bold text-slate-500 italic uppercase">{sub}</p>
    </div>
  );
}