"use client";

import React from "react";
import Header from "../header/header"; 
import Rightbar from "../rightbarrpage/page"; 
import { SweetAlertProvider } from "@/app/ui/SweetAlertProvider"; 

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <SweetAlertProvider>
      
      <div className="flex flex-col min-h-screen bg-[#FFF5F8] text-slate-800 font-sans selection:bg-pink-200 selection:text-pink-900">
        
        {/* HEADER (Sticky) */}
        <div className="sticky top-0 z-20 shadow-sm">
           <Header />
        </div>

        {/* CONTAINER UTAMA */}
        {/* PERUBAHAN DI SINI:
            1. px-3 sm:px-4: Padding kiri-kanan dikecilkan (mepet pinggir).
            2. py-3: Padding atas-bawah dikecilkan (mendekati header).
            3. max-w-[1920px]: Lebar maksimal diperbesar agar di layar besar tetap luas.
        */}
        <div className="flex-1 w-full max-w-480 mx-auto px-3 sm:px-4 py-1  ">
          
          {/* GAP ANTAR KOLOM */}
          {/* gap-4: Jarak antara konten utama dan sidebar dirapatkan (sebelumnya gap-6/8) */}
          <div className="flex flex-col lg:flex-row gap-2">
            
            {/* --- KIRI: KONTEN UTAMA (Children/Calendar) --- */}
            <main className="flex-1 min-w-0">
               {children}
            </main>

            {/* --- KANAN: SIDEBAR (Rightbar) --- */}
            {/* Lebar sidebar disesuaikan agar proporsional */}
            <aside className="w-full lg:w-85  xl:w-95 shrink-0">
              {/* top-24: Memberi jarak sedikit dari header saat scroll */}
            <div className="sticky top-24 ">
                <Rightbar />
            </div>
            </aside>

          </div>

        </div>

        {/* FOOTER */}
        <footer className="w-full py-4 mt-auto text-center text-xs text-slate-400 border-t border-pink-200/40 bg-white/50 backdrop-blur-sm">
          <p>© 2024 <span className="font-bold text-pink-500">Daily Meow</span>. Crafted with 💖 & 🐱.</p>
        </footer>

      </div>
    </SweetAlertProvider>
  );
}