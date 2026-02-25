"use client";

import React, { useState, useEffect, useRef } from "react";
import { Send, User, MessageCircle } from "lucide-react";

export default function ChatBox({ currentUserId, targetId }: { currentUserId: string, targetId: string }) {
  const [messages, setMessages] = useState<{ sender: string, text: string }[]>([]);
  const [input, setInput] = useState("");
  const socket = useRef<WebSocket | null>(null);

  useEffect(() => {
    socket.current = new WebSocket(`ws://localhost:8000/ws/chat/${currentUserId}`);

    socket.current.onmessage = (event) => {
      const [sender, text] = event.data.split(":");
      setMessages((prev) => [...prev, { sender, text }]);
    };

    return () => socket.current?.close();
  }, [currentUserId]);

  const sendMessage = () => {
    if (input && socket.current) {
      socket.current.send(`${targetId}:${input}`);
      setMessages((prev) => [...prev, { sender: currentUserId, text: input }]);
      setInput("");
    }
  };

  return (
    <div className="flex flex-col h-[400px] bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden">
      <div className="p-6 bg-teal-600 text-white flex items-center gap-3">
        <MessageCircle size={20} />
        <span className="font-bold text-sm tracking-widest uppercase">Konsultasi Medis</span>
      </div>
      
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.sender === currentUserId ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[80%] px-4 py-2 rounded-2xl text-sm font-medium ${
              msg.sender === currentUserId 
              ? "bg-teal-600 text-white rounded-tr-none" 
              : "bg-slate-100 dark:bg-slate-800 dark:text-white rounded-tl-none"
            }`}>
              {msg.text}
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex gap-2">
        <input 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
          placeholder="Tulis pesan..." 
          className="flex-1 bg-slate-50 dark:bg-slate-950 border dark:border-slate-800 rounded-xl px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-teal-500 dark:text-white"
        />
        <button onClick={sendMessage} className="p-2 bg-teal-600 text-white rounded-xl hover:bg-teal-700 transition-all">
          <Send size={18} />
        </button>
      </div>
    </div>
  );
}