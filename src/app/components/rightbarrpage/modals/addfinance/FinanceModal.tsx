"use client";

import React, { useState } from "react";
import { X, Disc, Coins, Delete, Check, FileText } from "lucide-react";
import { motion, easeIn, easeOut } from "framer-motion";

interface FinanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDate: Date | null;
  onSwitchToActivity?: () => void;
}

export default function FinanceModal({
  isOpen,
  onClose,
  selectedDate,
  onSwitchToActivity,
}: FinanceModalProps) {
  const [activeTab, setActiveTab] = useState<"activity" | "finance">("finance");
  
  // State Logic Finansial
  const [amount, setAmount] = useState<string>("0");
  const [type, setType] = useState<"pengeluaran" | "pemasukan">("pengeluaran");

  const displayDate = selectedDate
    ? selectedDate.toLocaleDateString("en-US", {
        weekday: "short",
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "Select a date";

  // Helper Format Rupiah
  const formatCurrency = (value: string) => {
    if (!value) return "0";
    return parseInt(value).toLocaleString("id-ID");
  };

  // Logic Numpad
  const handlePress = (val: string) => {
    if (val === "delete") {
      setAmount((prev) => (prev.length > 1 ? prev.slice(0, -1) : "0"));
    } else if (val === "00") {
      setAmount((prev) => (prev === "0" ? "0" : prev + "00"));
    } else {
      setAmount((prev) => (prev === "0" ? val : prev + val));
    }
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.95, y: 10 },
    visible: { 
      opacity: 1, 
      scale: 1, 
      y: 0,
      transition: { duration: 0.2, ease: easeOut } 
    },
    exit: { 
      opacity: 0, 
      scale: 0.95, 
      y: -10, 
      transition: { duration: 0.15, ease: easeIn } 
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
    >
      
      <motion.div
        variants={modalVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-105 rounded-[30px] bg-white p-6 shadow-2xl relative"
      >
        
        {/* --- HEADER --- */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-slate-800">Input Finance</h2>
            <p className="text-xs text-slate-500 mt-1">{displayDate}</p>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-1 hover:bg-slate-100 text-slate-400 transition"
          >
            <X size={20} />
          </button>
        </div>

        {/* --- TOP TABS (Activity vs Finance) --- */}
        <div className="flex gap-4 mb-6">
          
          {/* Tab Activity (Inactive -> Switch) */}
          <button
            onClick={() => {
              setActiveTab("activity");
              onSwitchToActivity?.(); // Pindah ke Modal Activity
            }}
            className="flex-1 flex flex-col items-center justify-center py-4 rounded-xl border border-slate-200 bg-white text-slate-400 hover:bg-slate-50 transition-all"
          >
            <div className="mb-2 p-2 rounded-full bg-slate-100">
              <Disc size={20} className="text-slate-400" />
            </div>
            <span className="text-sm font-semibold">Activity</span>
          </button>

          {/* Tab Finance (Active Style) */}
          <div className="flex-1 flex flex-col items-center justify-center py-4 rounded-xl border border-pink-300 bg-pink-50 text-slate-800 cursor-default">
            <div className="mb-2 p-2 rounded-full bg-white">
              <Coins size={20} className="text-slate-800" />
            </div>
            <span className="text-sm font-semibold">Finance</span>
          </div>
        </div>

        {/* --- KONTEN FINANSIAL --- */}
        
        {/* 1. Sub-Tabs: Pengeluaran / Pemasukan */}
        <div className="flex bg-slate-50 p-1 rounded-xl mb-6 border border-slate-100">
           <button 
             onClick={() => setType("pengeluaran")}
             className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${type === 'pengeluaran' ? 'bg-white text-rose-500 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
           >
             Pengeluaran
           </button>
           <button 
             onClick={() => setType("pemasukan")}
             className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${type === 'pemasukan' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
           >
             Pemasukan
           </button>
        </div>

        {/* 2. Display Amount */}
        <div className="text-center mb-6 py-4 bg-pink-50/50 rounded-2xl border border-pink-100">
           <p className="text-[10px] font-bold tracking-wider text-slate-400 uppercase mb-1">TOTAL AMOUNT</p>
           <h1 className="text-4xl font-extrabold text-slate-800">
             <span className="text-2xl font-bold text-slate-400 mr-1">Rp</span>
             {formatCurrency(amount)}
           </h1>
        </div>

        {/* 3. Input Catatan */}
        <div className="mb-4">
             <div className="flex items-center gap-3 w-full rounded-lg bg-slate-50 border border-slate-100 px-4 py-3 text-sm text-slate-700">
                <FileText size={18} className="text-slate-400"/>
                <input 
                  type="text" 
                  placeholder="Catatan (e.g. Makan siang)"
                  className="bg-transparent w-full focus:outline-none placeholder:text-slate-400"
                />
             </div>
        </div>

        {/* 4. Numpad Grid */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
            <button
              key={num}
              onClick={() => handlePress(num.toString())}
              className="h-12 rounded-xl bg-white border border-slate-100 text-xl font-semibold text-slate-700 shadow-sm active:translate-y-0.5 active:shadow-none transition-all hover:bg-slate-50"
            >
              {num}
            </button>
          ))}
          
          <button
             onClick={() => handlePress("00")}
             className="h-12 rounded-xl bg-white border border-slate-100 text-xl font-semibold text-slate-700 shadow-sm active:translate-y-0.5 active:shadow-none transition-all hover:bg-slate-50"
          >
             00
          </button>
          <button
             onClick={() => handlePress("0")}
             className="h-12 rounded-xl bg-white border border-slate-100 text-xl font-semibold text-slate-700 shadow-sm active:translate-y-0.5 active:shadow-none transition-all hover:bg-slate-50"
          >
             0
          </button>
          <button
             onClick={() => handlePress("delete")}
             className="h-12 rounded-xl bg-slate-100 border border-slate-200 text-slate-600 flex items-center justify-center shadow-sm active:translate-y-0.5 active:shadow-none transition-all hover:bg-slate-200"
          >
             <Delete size={20} />
          </button>
        </div>

        {/* 5. Simpan Button */}
        <button className="w-full h-12 bg-[#FF8FAB] hover:bg-[#ff7aa0] text-slate-900 font-bold text-sm rounded-xl shadow-sm flex items-center justify-center gap-2 transition-transform active:scale-[0.98]">
           <Check size={18} />
           Simpan
        </button>

      </motion.div>
    </motion.div>
  );
}