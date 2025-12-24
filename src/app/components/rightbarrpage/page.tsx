"use client";

import React, { useState } from "react";
import ActivitiesView from "./components/aktivitas/page";
import FinanceView from "./components/finansial/Page";
import RecapView from "./components/rekap/Page";
// Import Ikon Dekorasi
import { PawPrint, Star, Heart, Cloud, Sparkles } from "lucide-react";

export default function RightBarPage() {
  const [activeTab, setActiveTab] = useState<"Activities" | "Finance" | "Recap">("Activities");

  return (
    // Tambahkan 'relative overflow-hidden' agar dekorasi tidak keluar kotak
    <div className="min-h-screen w-90 mt-10 bg-[#F8BBD0] p-6 px-8 mr-5 font-sans rounded-[35px] text-slate-800 shadow-xl relative overflow-hidden transition-all hover:shadow-2xl hover:shadow-pink-200/50">
      
      {/* --- DEKORASI ESTETIK (Background) --- */}
      
      {/* 1. Jejak Kaki Besar (Transparan di Kanan Atas) */}
      <div className="absolute -top-6 -right-6 text-white/20 rotate-[20deg] pointer-events-none">
         <PawPrint size={140} />
      </div>

      {/* 2. Blob Cahaya Putih (Kiri Atas) */}
      <div className="absolute -top-20 -left-20 w-64 h-64 bg-white/20 rounded-full blur-3xl pointer-events-none"></div>

      {/* 3. Awan Lucu (Kiri Bawah - Naik Turun Sedikit) */}
      <div className="absolute bottom-32 -left-4 text-white/30 pointer-events-none animate-bounce duration-[3000ms]">
         <Cloud size={60} fill="currentColor" />
      </div>

      {/* 4. Bintang & Hati (Penyebar Estetik) */}
      <div className="absolute top-20 right-8 text-yellow-200/50 rotate-12 pointer-events-none">
         <Star size={24} fill="currentColor" />
      </div>
      <div className="absolute bottom-10 right-10 text-rose-400/20 -rotate-12 pointer-events-none">
         <Heart size={40} fill="currentColor" />
      </div>
      
      {/* 5. Kilauan (Sparkles) */}
      <div className="absolute top-1/2 left-4 text-sky-200/60 animate-pulse pointer-events-none">
         <Sparkles size={18} />
      </div>


      {/* --- KONTEN UTAMA (z-10 agar di atas dekorasi) --- */}
      <div className="relative z-10">
        
        {/* --- HEADER TABS NAVIGATION --- */}
        <div className="flex gap-6 mb-6 border-b border-pink-300/40 pb-1">
          {["Activities", "Finance", "Recap"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`pb-2 text-sm font-bold transition-all relative ${
                activeTab === tab
                  ? "text-slate-900 scale-105"
                  : "text-slate-600 hover:text-slate-800"
              }`}
            >
              {tab}
              {/* Garis bawah animasi & Shadow Pink */}
              {activeTab === tab && (
                <span className="absolute bottom-0 left-0 w-full h-[3px] bg-pink-600 rounded-t-full shadow-[0_2px_8px_rgba(219,39,119,0.6)]" />
              )}
            </button>
          ))}
        </div>

        {/* --- KONTEN DINAMIS --- */}
        <div className="min-h-[300px]">
          {activeTab === "Activities" && <ActivitiesView />}
          {activeTab === "Finance" && <FinanceView />}
          {activeTab === "Recap" && <RecapView />}
        </div>
        
      </div>

    </div>
  );
}