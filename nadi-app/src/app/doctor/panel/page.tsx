"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Search, AlertCircle, CheckCircle2, ChevronRight } from "lucide-react";

export default function DoctorPanel() {
  const [patients, setPatients] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8000/api/patients")
      .then(res => res.json())
      .then(data => setPatients(data));
  }, []);

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 p-8 md:p-12">
      <h1 className="text-4xl font-black mb-10 italic uppercase">Panel Dokter<span className="text-teal-600">.</span></h1>
      
      <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 overflow-hidden shadow-xl">
        <table className="w-full text-left">
          <thead className="bg-slate-50 dark:bg-slate-950 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
            <tr>
              <th className="px-10 py-6">Pasien</th>
              <th className="px-10 py-6">Gula (mg/dL)</th>
              <th className="px-10 py-6">Status AI</th>
              <th className="px-10 py-6">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
            {patients.map((p: any) => (
              <tr key={p.id} className="hover:bg-slate-50/50 transition-all">
                <td className="px-10 py-6">
                  <p className="font-black dark:text-white">{p.name}</p>
                  <p className="text-[10px] text-slate-400 uppercase">{p.domicile}</p>
                </td>
                <td className="px-10 py-6 font-black text-teal-600">{p.blood_sugar}</td>
                <td className="px-10 py-6">
                  <span className="px-4 py-1.5 rounded-full bg-teal-50 text-teal-600 text-[10px] font-black uppercase tracking-widest">
                    {p.ai_status}
                  </span>
                </td>
                <td className="px-10 py-6">
                  <Link href={`/panel/${p.id}`} className="p-3 bg-slate-100 dark:bg-slate-800 rounded-xl hover:bg-teal-600 hover:text-white transition-all inline-block">
                    <ChevronRight size={18} />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}