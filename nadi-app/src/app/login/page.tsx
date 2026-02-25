"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { MessageCircle, ArrowRight, ShieldCheck, Heart } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/send-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
      });
      if (res.ok) setStep(2);
    } catch (err) {
      alert("Gagal terhubung ke server");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, code: otp }),
      });
      const result = await res.json();
      if (result.status === "success") {
        router.push("/dashboard");
      } else {
        alert("Kode OTP salah!");
      }
    } catch (err) {
      alert("Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 flex items-center justify-center p-6">
      <div className="w-full max-w-sm">
        <div className="text-center mb-10">
          <div className="inline-flex w-16 h-16 bg-teal-600 rounded-[2rem] items-center justify-center text-white mb-4 shadow-xl shadow-teal-500/20">
            <Heart size={32} fill="currentColor" />
          </div>
          <h1 className="text-3xl font-black dark:text-white uppercase tracking-tighter italic">
            NADI<span className="text-teal-600">.</span>
          </h1>
        </div>

        <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-2xl">
          {step === 1 ? (
            <form onSubmit={handleSendOtp} className="space-y-6">
              <div className="space-y-2 text-center">
                <h2 className="text-xl font-black dark:text-white">Masuk via WhatsApp</h2>
                <p className="text-xs text-slate-400 font-medium">Gunakan nomor HP Anda untuk menerima kode OTP.</p>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Nomor WhatsApp</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">+62</span>
                  <input 
                    type="tel" 
                    placeholder="812xxxxxx"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full pl-14 pr-4 py-4 bg-slate-50 dark:bg-slate-950 border dark:border-slate-800 rounded-2xl outline-none focus:ring-2 focus:ring-teal-500 dark:text-white transition-all"
                    required 
                  />
                </div>
              </div>
              <button disabled={loading} className="w-full bg-teal-600 hover:bg-teal-700 text-white font-black py-4 rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-95 shadow-lg shadow-teal-500/20">
                {loading ? "MENGIRIM..." : "KIRIM KODE OTP"} <MessageCircle size={18} />
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-6">
              <div className="space-y-2 text-center">
                <h2 className="text-xl font-black dark:text-white">Verifikasi Kode</h2>
                <p className="text-xs text-slate-400 font-medium">Masukkan 6 digit kode yang dikirim ke +62 {phone}</p>
              </div>
              <div className="space-y-2">
                <input 
                  type="text" 
                  maxLength={6}
                  placeholder="000000"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full text-center tracking-[1em] text-2xl font-black py-4 bg-slate-50 dark:bg-slate-950 border dark:border-slate-800 rounded-2xl outline-none focus:ring-2 focus:ring-teal-500 dark:text-white transition-all"
                  required 
                />
              </div>
              <button disabled={loading} className="w-full bg-teal-600 hover:bg-teal-700 text-white font-black py-4 rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-95 shadow-lg shadow-teal-500/20">
                {loading ? "VERIFIKASI..." : "MASUK KE DASHBOARD"} <ShieldCheck size={18} />
              </button>
              <button type="button" onClick={() => setStep(1)} className="w-full text-[10px] font-bold text-slate-400 uppercase tracking-widest hover:text-teal-600 transition-colors">Ganti Nomor HP</button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}