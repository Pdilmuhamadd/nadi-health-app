"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, ArrowLeft, Loader2, User } from "lucide-react";
import { useRouter } from "next/navigation";

// Tipe data untuk pesan agar lebih rapi
interface ChatMessage {
  id?: number;
  sender_id: string;
  receiver_id: string;
  message: string;
  created_at?: string;
}

export default function PatientChatPage() {
  const router = useRouter();
  const [msg, setMsg] = useState("");
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  
  // Ref untuk fitur auto-scroll
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const patientId = "patient_123"; // Simulasi ID pasien
  const doctorId = "nama_dokter"; // Simulasi dokter tujuan

  // Fungsi auto-scroll
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const fetchChat = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/chat/${patientId}`);
      if (res.ok) {
        const data = await res.json();
        setChatHistory(data);
      }
    } catch (err) {
      console.error("Gagal mengambil riwayat pesan", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Polling data
  useEffect(() => {
    fetchChat();
    const interval = setInterval(fetchChat, 5000); // Polling setiap 5 detik
    return () => clearInterval(interval);
  }, []);

  // Trigger auto-scroll setiap kali riwayat chat berubah
  useEffect(() => {
    scrollToBottom();
  }, [chatHistory]);

  const handleSend = async () => {
    // Mencegah kirim pesan kosong atau saat sedang mengirim
    if (!msg.trim() || isSending) return; 
    
    setIsSending(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/chat/send`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sender_id: patientId,
          receiver_id: doctorId,
          message: msg.trim()
        }),
      });
      
      if (res.ok) {
        setMsg("");
        await fetchChat(); // Tarik data terbaru setelah berhasil kirim
      }
    } catch (err) {
      alert("Pesan gagal terkirim. Periksa koneksi Anda.");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950 font-sans">
      
      {/* HEADER */}
      <header className="bg-white dark:bg-slate-900 p-4 md:p-6 border-b border-slate-100 dark:border-slate-800 flex items-center gap-4 sticky top-0 z-20 shadow-sm">
        <button 
          onClick={() => router.back()} 
          className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors text-slate-400 hover:text-teal-600"
        >
          <ArrowLeft size={20} />
        </button>
        <div className="w-10 h-10 bg-teal-600 rounded-2xl flex items-center justify-center text-white font-bold text-xs shadow-lg shadow-teal-500/20">
          DR
        </div>
        <div>
          <h2 className="text-sm font-black dark:text-white uppercase tracking-tight">Konsultasi Dokter</h2>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse"></span>
            <p className="text-[10px] text-teal-600 font-bold uppercase tracking-widest">Online</p>
          </div>
        </div>
      </header>

      {/* CHAT AREA */}
      <main className="flex-1 p-4 md:p-6 space-y-4 overflow-y-auto bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-fixed">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <Loader2 className="animate-spin text-teal-600" size={32} />
          </div>
        ) : (
          <AnimatePresence>
            {chatHistory.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-slate-400 opacity-60 space-y-2 mt-20">
                <User size={48} />
                <p className="text-xs font-bold uppercase tracking-widest">Mulai percakapan dengan dokter</p>
              </div>
            ) : (
              chatHistory.map((c, i) => {
                const isMe = c.sender_id === patientId;
                return (
                  <motion.div 
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    key={c.id || i} 
                    className={`flex ${isMe ? "justify-end" : "justify-start"}`}
                  >
                    <div 
                      className={`max-w-[85%] md:max-w-[70%] p-4 rounded-3xl text-sm font-medium shadow-sm leading-relaxed ${
                        isMe 
                          ? "bg-teal-600 text-white rounded-br-none shadow-teal-500/20" 
                          : "bg-white dark:bg-slate-800 dark:text-white rounded-bl-none border border-slate-100 dark:border-slate-700"
                      }`}
                    >
                      {c.message}
                    </div>
                  </motion.div>
                );
              })
            )}
          </AnimatePresence>
        )}
        {/* Elemen kosong untuk scroll target */}
        <div ref={messagesEndRef} />
      </main>

      {/* INPUT AREA */}
      <footer className="p-4 md:p-6 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 sticky bottom-0 z-20">
        <div className="max-w-4xl mx-auto flex gap-2 md:gap-3 bg-slate-50 dark:bg-slate-950 p-2 md:p-2.5 rounded-[1.5rem] border border-slate-200 dark:border-slate-800 focus-within:ring-2 focus-within:ring-teal-500 transition-all shadow-inner">
          <input 
            type="text" 
            placeholder="Ketik keluhan atau pertanyaan Anda..." 
            className="flex-1 bg-transparent px-4 py-2 outline-none dark:text-white text-sm"
            value={msg}
            onChange={(e) => setMsg(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            disabled={isSending}
          />
          <button 
            onClick={handleSend} 
            disabled={!msg.trim() || isSending}
            className="bg-teal-600 text-white p-3 md:px-5 md:py-3 rounded-2xl hover:bg-teal-700 transition-all disabled:opacity-50 disabled:active:scale-100 active:scale-95 shadow-lg shadow-teal-500/20 flex items-center justify-center"
          >
            {isSending ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} />}
          </button>
        </div>
      </footer>
      
    </div>
  );
}