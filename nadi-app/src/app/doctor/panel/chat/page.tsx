"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Search, User, ArrowLeft, CheckCheck, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

// Interface untuk konsistensi data
interface ChatMessage {
  id?: number;
  sender_id: string;
  receiver_id: string;
  message: string;
  created_at?: string;
}

export default function DoctorChatPage() {
  const router = useRouter();
  const [msg, setMsg] = useState("");
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [patients, setPatients] = useState<any[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<any>(null);
  const [isSending, setIsSending] = useState(false);
  const [isLoadingChat, setIsLoadingChat] = useState(false);
  
  // Ref untuk auto-scroll
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const doctorId = "nama_dokter"; 

  // Fungsi Auto Scroll
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // 1. Ambil daftar pasien untuk sidebar
  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/patients`);
        if (res.ok) {
          const data = await res.json();
          setPatients(data);
          // Set pasien pertama jika belum ada yang dipilih dan data tersedia
          if (data.length > 0 && !selectedPatient) {
            setSelectedPatient(data[0]);
          }
        }
      } catch (err) {
        console.error("Gagal mengambil daftar pasien");
      }
    };
    fetchPatients();
  }, []);

  // 2. Ambil riwayat chat dengan pasien yang dipilih
  const fetchChat = async (showLoading = false) => {
    if (!selectedPatient) return;
    
    if (showLoading) setIsLoadingChat(true);
    
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/chat/${doctorId}`);
      if (res.ok) {
        const data = await res.json();
        // Filter pesan hanya untuk pasien yang sedang dipilih
        const filteredChat = data.filter((c: any) => 
          c.sender_id === selectedPatient.patient_id || c.receiver_id === selectedPatient.patient_id
        );
        setChatHistory(filteredChat);
      }
    } catch (err) {
      console.error("Gagal memuat pesan", err);
    } finally {
      setIsLoadingChat(false);
    }
  };

  // Effect untuk polling & ganti pasien
  useEffect(() => {
    fetchChat(true); // Tampilkan loading saat ganti pasien
    const interval = setInterval(() => fetchChat(false), 4000); 
    return () => clearInterval(interval);
  }, [selectedPatient]);

  // Effect untuk auto-scroll tiap riwayat chat berubah
  useEffect(() => {
    scrollToBottom();
  }, [chatHistory]);

  // 3. Fungsi Kirim Pesan
  const handleSend = async () => {
    if (!msg.trim() || !selectedPatient || isSending) return;
    
    setIsSending(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/chat/send`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sender_id: doctorId,
          receiver_id: selectedPatient.patient_id,
          message: msg.trim()
        }),
      });
      
      if (res.ok) {
        setMsg("");
        await fetchChat(); // Segera perbarui setelah kirim
      }
    } catch (err) {
      alert("Gagal mengirim pesan.");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="flex h-screen bg-white dark:bg-slate-950 overflow-hidden font-sans">
      
      {/* SIDEBAR DAFTAR PASIEN */}
      <aside className="w-80 border-r border-slate-100 dark:border-slate-800 flex-col hidden md:flex bg-slate-50/50 dark:bg-slate-900/50 z-20">
        <div className="p-6 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3 mb-6">
            <button 
              onClick={() => router.back()} 
              className="p-2 -ml-2 rounded-xl text-slate-400 hover:text-blue-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <ArrowLeft size={20}/>
            </button>
            <h1 className="text-xl font-black dark:text-white italic uppercase tracking-tighter">Pesan <span className="text-blue-600">Medis</span></h1>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input 
              type="text" placeholder="Cari pasien..." 
              className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs outline-none dark:text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all shadow-sm"
            />
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          {patients.map((p) => {
            const isSelected = selectedPatient?.patient_id === p.patient_id;
            return (
              <div 
                key={p.patient_id}
                onClick={() => setSelectedPatient(p)}
                className={`p-4 flex items-center gap-3 cursor-pointer transition-all border-l-4 ${
                  isSelected 
                    ? "bg-blue-50/80 dark:bg-blue-900/20 border-blue-600" 
                    : "border-transparent hover:bg-white dark:hover:bg-slate-900"
                }`}
              >
                <div className="relative">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs uppercase transition-colors ${isSelected ? "bg-blue-600 text-white shadow-md shadow-blue-500/20" : "bg-slate-200 dark:bg-slate-800 text-slate-500"}`}>
                    {p.full_name[0]}
                  </div>
                  {p.is_emergency === 1 && (
                    <span className="absolute top-0 right-0 w-3 h-3 bg-rose-500 border-2 border-white dark:border-slate-950 rounded-full animate-pulse"></span>
                  )}
                </div>
                <div className="flex-1 overflow-hidden">
                  <h3 className={`text-sm font-bold truncate ${isSelected ? "text-blue-600" : "dark:text-white"}`}>
                    {p.full_name}
                  </h3>
                  <p className="text-[10px] text-slate-400 uppercase font-black tracking-tighter">ID: {p.patient_id}</p>
                </div>
              </div>
            );
          })}
        </div>
      </aside>

      {/* AREA CHAT UTAMA */}
      <main className="flex-1 flex flex-col relative bg-slate-50 dark:bg-slate-950 h-full">
        {selectedPatient ? (
          <>
            <header className="bg-white dark:bg-slate-900 p-4 md:p-5 border-b border-slate-100 dark:border-slate-800 flex items-center gap-4 z-10 shadow-sm">
              {/* Tombol Back untuk Mobile */}
              <button onClick={() => setSelectedPatient(null)} className="md:hidden text-slate-400 p-2 hover:bg-slate-100 rounded-xl">
                <ArrowLeft size={20} />
              </button>
              
              <div className="w-10 h-10 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
                <User size={20}/>
              </div>
              <div>
                <h2 className="text-sm font-black dark:text-white uppercase italic tracking-tight">{selectedPatient.full_name}</h2>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">Pasien Terhubung</p>
                </div>
              </div>
            </header>

            <div className="flex-1 p-4 md:p-6 space-y-4 overflow-y-auto flex flex-col bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-fixed">
              {isLoadingChat ? (
                <div className="flex-1 flex items-center justify-center">
                  <Loader2 className="animate-spin text-blue-600" size={32} />
                </div>
              ) : (
                <AnimatePresence>
                  {chatHistory.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-slate-400 opacity-60 space-y-2">
                      <User size={48} />
                      <p className="text-xs font-bold uppercase tracking-widest text-center">Belum ada riwayat pesan<br/>dengan pasien ini</p>
                    </div>
                  ) : (
                    chatHistory.map((c, i) => {
                      const isMe = c.sender_id === doctorId;
                      return (
                        <motion.div 
                          initial={{ opacity: 0, y: 10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          key={c.id || i} 
                          className={`flex ${isMe ? "justify-end" : "justify-start"}`}
                        >
                          <div className={`max-w-[85%] md:max-w-[70%] p-4 rounded-3xl text-sm font-medium shadow-sm leading-relaxed ${isMe ? "bg-blue-600 text-white rounded-br-none shadow-blue-500/20" : "bg-white dark:bg-slate-800 dark:text-white rounded-bl-none border border-slate-100 dark:border-slate-700"}`}>
                            {c.message}
                            {isMe && (
                              <div className="flex justify-end mt-1 opacity-60">
                                <CheckCheck size={14}/>
                              </div>
                            )}
                          </div>
                        </motion.div>
                      );
                    })
                  )}
                </AnimatePresence>
              )}
              {/* Target untuk auto scroll */}
              <div ref={messagesEndRef} />
            </div>

            <footer className="p-4 md:p-6 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800">
              <div className="max-w-4xl mx-auto flex gap-2 bg-slate-50 dark:bg-slate-950 p-2 md:p-2.5 rounded-[1.5rem] border border-slate-200 dark:border-slate-800 focus-within:ring-2 focus-within:ring-blue-500 transition-all shadow-inner">
                <input 
                  type="text" 
                  placeholder={`Balas pesan ke ${selectedPatient.full_name.split(' ')[0]}...`} 
                  className="flex-1 bg-transparent px-4 py-2 outline-none dark:text-white text-sm"
                  value={msg}
                  onChange={(e) => setMsg(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                  disabled={isSending}
                />
                <button 
                  onClick={handleSend} 
                  disabled={!msg.trim() || isSending}
                  className="bg-blue-600 text-white p-3 md:px-5 md:py-3 rounded-2xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20 flex items-center justify-center disabled:opacity-50 disabled:active:scale-100 active:scale-95"
                >
                  {isSending ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} />}
                </button>
              </div>
            </footer>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-400 space-y-4">
            <div className="w-20 h-20 bg-slate-100 dark:bg-slate-900 rounded-full flex items-center justify-center shadow-inner">
              <Search size={32} className="text-slate-300" />
            </div>
            <p className="font-bold uppercase tracking-widest text-xs">PILIH PASIEN DARI DAFTAR UNTUK MEMULAI</p>
          </div>
        )}
      </main>
    </div>
  );
}