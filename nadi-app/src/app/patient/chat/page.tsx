"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Send, User, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function PatientChatPage() {
  const router = useRouter();
  const [msg, setMsg] = useState("");
  const [chatHistory, setChatHistory] = useState<any[]>([]);
  const patientId = "fadhil_01";
  const doctorId = "dr_fadhil"; // Simulasi dokter tujuan

  const fetchChat = async () => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/chat/${patientId}`);
    const data = await res.json();
    setChatHistory(data);
  };

  useEffect(() => {
    fetchChat();
    const interval = setInterval(fetchChat, 5000); // Polling setiap 5 detik
    return () => clearInterval(interval);
  }, []);

  const handleSend = async () => {
    if (!msg) return;
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/chat/send`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sender_id: patientId,
        receiver_id: doctorId,
        message: msg
      }),
    });
    setMsg("");
    fetchChat();
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col">
      <header className="bg-white dark:bg-slate-900 p-6 border-b dark:border-slate-800 flex items-center gap-4 sticky top-0">
        <button onClick={() => router.back()}><ArrowLeft className="text-slate-400" /></button>
        <div className="w-10 h-10 bg-teal-600 rounded-full flex items-center justify-center text-white font-bold text-xs shadow-lg shadow-teal-500/20">DR</div>
        <div>
          <h2 className="text-sm font-black dark:text-white uppercase">Konsultasi Dokter</h2>
          <p className="text-[10px] text-teal-600 font-bold uppercase tracking-widest">Online</p>
        </div>
      </header>

      <main className="flex-1 p-6 space-y-4 overflow-y-auto">
        {chatHistory.map((c, i) => (
          <div key={i} className={`flex ${c.sender_id === patientId ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[80%] p-4 rounded-3xl text-sm font-medium ${c.sender_id === patientId ? "bg-teal-600 text-white rounded-tr-none" : "bg-white dark:bg-slate-800 dark:text-white rounded-tl-none shadow-sm"}`}>
              {c.message}
            </div>
          </div>
        ))}
      </main>

      <footer className="p-6 bg-white dark:bg-slate-900 border-t dark:border-slate-800 sticky bottom-0">
        <div className="flex gap-2 bg-slate-50 dark:bg-slate-950 p-2 rounded-2xl border dark:border-slate-800 focus-within:ring-2 focus-within:ring-teal-500 transition-all">
          <input 
            type="text" 
            placeholder="Ketik pesan..." 
            className="flex-1 bg-transparent px-4 py-2 outline-none dark:text-white"
            value={msg}
            onChange={(e) => setMsg(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
          />
          <button onClick={handleSend} className="bg-teal-600 text-white p-3 rounded-xl hover:bg-teal-700 transition-all">
            <Send size={20} />
          </button>
        </div>
      </footer>
    </div>
  );
}