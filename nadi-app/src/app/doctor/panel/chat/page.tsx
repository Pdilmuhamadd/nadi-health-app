"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Search, User, ArrowLeft, CheckCheck } from "lucide-react";
import { useRouter } from "next/navigation";

export default function DoctorChatPage() {
  const router = useRouter();
  const [msg, setMsg] = useState("");
  const [chatHistory, setChatHistory] = useState<any[]>([]);
  const [patients, setPatients] = useState<any[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<any>(null);
  
  const doctorId = "dr_fadhil"; // ID Dokter (Bisa dari session)

  // 1. Ambil daftar pasien untuk sidebar
  useEffect(() => {
    const fetchPatients = async () => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/patients`);
      const data = await res.json();
      setPatients(data);
      if (data.length > 0) setSelectedPatient(data[0]); // Default pasien pertama
    };
    fetchPatients();
  }, []);

  // 2. Ambil riwayat chat dengan pasien yang dipilih
  const fetchChat = async () => {
    if (!selectedPatient) return;
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/chat/${doctorId}`);
    const data = await res.json();
    // Filter pesan hanya untuk pasien yang sedang dipilih
    const filteredChat = data.filter((c: any) => 
      c.sender_id === selectedPatient.patient_id || c.receiver_id === selectedPatient.patient_id
    );
    setChatHistory(filteredChat);
  };

  useEffect(() => {
    fetchChat();
    const interval = setInterval(fetchChat, 4000); // Polling lebih cepat untuk dokter
    return () => clearInterval(interval);
  }, [selectedPatient]);

  // 3. Fungsi Kirim Pesan
  const handleSend = async () => {
    if (!msg || !selectedPatient) return;
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/chat/send`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sender_id: doctorId,
        receiver_id: selectedPatient.patient_id,
        message: msg
      }),
    });
    setMsg("");
    fetchChat();
  };

  return (
    <div className="flex h-screen bg-white dark:bg-slate-950 overflow-hidden">
      
      {/* SIDEBAR DAFTAR PASIEN */}
      <aside className="w-80 border-r dark:border-slate-800 flex flex-col hidden md:flex">
        <div className="p-6 border-b dark:border-slate-800">
          <div className="flex items-center gap-3 mb-6">
            <button onClick={() => router.back()} className="text-slate-400"><ArrowLeft size={20}/></button>
            <h1 className="text-xl font-black dark:text-white italic uppercase tracking-tighter">Pesan <span className="text-blue-600">Medis</span></h1>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input 
              type="text" placeholder="Cari pasien..." 
              className="w-full pl-10 pr-4 py-2 bg-slate-100 dark:bg-slate-900 rounded-xl text-xs outline-none dark:text-white"
            />
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          {patients.map((p) => (
            <div 
              key={p.patient_id}
              onClick={() => setSelectedPatient(p)}
              className={`p-4 flex items-center gap-3 cursor-pointer transition-all ${selectedPatient?.patient_id === p.patient_id ? "bg-blue-50 dark:bg-blue-900/20 border-r-4 border-blue-600" : "hover:bg-slate-50 dark:hover:bg-slate-900"}`}
            >
              <div className="w-10 h-10 bg-slate-200 dark:bg-slate-800 rounded-full flex items-center justify-center text-slate-500 font-bold text-xs uppercase">{p.full_name[0]}</div>
              <div className="flex-1">
                <h3 className={`text-sm font-bold ${selectedPatient?.patient_id === p.patient_id ? "text-blue-600" : "dark:text-white"}`}>{p.full_name}</h3>
                <p className="text-[10px] text-slate-400 uppercase font-black tracking-tighter">ID: {p.patient_id}</p>
              </div>
            </div>
          ))}
        </div>
      </aside>

      {/* AREA CHAT UTAMA */}
      <main className="flex-1 flex flex-col relative bg-slate-50 dark:bg-slate-950">
        {selectedPatient ? (
          <>
            <header className="bg-white dark:bg-slate-900 p-5 border-b dark:border-slate-800 flex items-center gap-4 z-10 shadow-sm">
              <div className="w-10 h-10 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-500/20"><User size={20}/></div>
              <div>
                <h2 className="text-sm font-black dark:text-white uppercase italic tracking-tight">{selectedPatient.full_name}</h2>
                <p className="text-[9px] text-blue-600 font-bold uppercase tracking-widest italic">Sedang Konsultasi</p>
              </div>
            </header>

            <div className="flex-1 p-6 space-y-4 overflow-y-auto flex flex-col bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]">
              {chatHistory.map((c, i) => (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  key={i} 
                  className={`flex ${c.sender_id === doctorId ? "justify-end" : "justify-start"}`}
                >
                  <div className={`max-w-[70%] p-4 rounded-[1.5rem] text-sm font-medium shadow-sm ${c.sender_id === doctorId ? "bg-blue-600 text-white rounded-tr-none" : "bg-white dark:bg-slate-800 dark:text-white rounded-tl-none"}`}>
                    {c.message}
                    <div className="flex justify-end mt-1 opacity-50">
                      <CheckCheck size={14}/>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <footer className="p-6 bg-white dark:bg-slate-900 border-t dark:border-slate-800">
              <div className="max-w-4xl mx-auto flex gap-3 bg-slate-50 dark:bg-slate-950 p-2 rounded-2xl border dark:border-slate-800 focus-within:ring-2 focus-within:ring-blue-500 transition-all">
                <input 
                  type="text" 
                  placeholder={`Balas pesan ke ${selectedPatient.full_name}...`} 
                  className="flex-1 bg-transparent px-4 py-2 outline-none dark:text-white text-sm"
                  value={msg}
                  onChange={(e) => setMsg(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                />
                <button onClick={handleSend} className="bg-blue-600 text-white p-3 rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20">
                  <Send size={20} />
                </button>
              </div>
            </footer>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-slate-400 font-bold italic">PILIH PASIEN UNTUK MEMULAI KONSULTASI</div>
        )}
      </main>
    </div>
  );
}