"use client";

import React from "react";
import { createPortal } from "react-dom";
import { X, Coins, Delete, Check, FileText, Calendar, Edit2, Loader2, Repeat, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { useFinanceModal, FinanceModalProps } from "../hooks/useFinanceModal"; // Import Logic Hook

export default function FinanceModal(props: FinanceModalProps) {
  // Panggil Logic Hook
  const {
    mounted,
    isLoading,
    amount,
    type,
    setType,
    title,
    setTitle,
    date,
    setDate,
    isRangeMode,
    setIsRangeMode,
    endDateStr,
    setEndDateStr,
    dateInputRef,
    endDateInputRef,
    handlePress,
    handleDivClick,
    handleEndDateDivClick,
    handleSave,
    formatCurrency
  } = useFinanceModal(props);

  if (!mounted || !props.isOpen) return null;

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.9, y: 20 },
    visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.3, type: "spring" as const, stiffness: 300, damping: 25 } },
    exit: { opacity: 0, scale: 0.95, y: 20 },
  };

  const modalContent = (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 font-sans"
      onClick={props.onClose}
    >
      <motion.div
        variants={modalVariants}
        initial="hidden" animate="visible" exit="exit"
        onClick={(e) => e.stopPropagation()}
        className="w-[90vw] sm:w-full sm:max-w-md bg-white rounded-[30px] shadow-2xl relative overflow-hidden flex flex-col max-h-[90vh]"
      >
        
        {/* --- HEADER --- */}
        <div className="bg-linear-to-r from-purple-50 to-pink-50 px-6 pt-6 pb-4 relative shrink-0">
            <div className="absolute top-2 right-4 opacity-50 -rotate-12 pointer-events-none">
                <Coins size={100} className="text-orange-400" />
            </div>

            <div className="flex justify-between items-start relative z-10 mb-4">
                <h2 className="text-2xl font-black text-slate-800 tracking-tight">Finance🪙</h2>
                <button onClick={props.onClose} className="bg-white/60 hover:bg-white p-2 rounded-full text-slate-500 transition shadow-sm backdrop-blur-sm">
                    <X size={20} />
                </button>
            </div>

            {/* --- DATE PICKER UTAMA --- */}
            <div className="relative group w-full" onClick={handleDivClick}>
                <div className="flex items-center justify-between bg-white border border-purple-100 hover:border-purple-300 px-4 py-3 rounded-2xl shadow-lg transition-all cursor-pointer group-hover:shadow-md active:scale-[0.98] active:bg-purple-50">
                    <div className="flex items-center gap-3">
                        <div className="bg-purple-100 p-2 rounded-lg text-purple-600">
                            <Calendar size={18} />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider select-none">
                                {isRangeMode ? "TANGGAL MULAI" : "PILIH TANGGAL"}
                            </span>
                            <span className="text-sm font-bold text-slate-700 select-none">
                                {date ? new Date(date).toLocaleDateString("id-ID", { day: 'numeric', month: 'long', year: 'numeric' }) : "Pilih Tanggal"}
                            </span>
                        </div>
                    </div>
                    <Edit2 size={16} className="text-slate-300 group-hover:text-purple-400 transition-colors" />
                </div>
                <input ref={dateInputRef} type="date" value={date} onChange={(e) => setDate(e.target.value)} className="absolute top-0 left-0 w-0 h-0 opacity-0 pointer-events-none" />
            </div>
        </div>

        {/* --- SCROLLABLE CONTENT --- */}
        <div className="px-6 pb-6 pt-2 overflow-y-auto bg-white [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
            
            {/* DISPLAY AMOUNT */}
            <div className={`text-center mt-4 mb-6 py-5 rounded-3xl border-2 transition-colors duration-300 ${type === 'pengeluaran' ? 'bg-rose-100 border-rose-200 shadow-xl' : 'bg-emerald-100 border-emerald-200 shadow-xl'}`}>
                <p className={`text-[10px] font-bold tracking-widest uppercase mb-1 ${type === 'pengeluaran' ? 'text-rose-500' : 'text-emerald-500'}`}>Total Amount</p>
                <h1 className={`text-4xl font-black tracking-tight ${type === 'pengeluaran' ? 'text-rose-500' : 'text-emerald-500'}`}>
                    <span className="text-xl font-bold opacity-60 mr-1 align-top">Rp</span>
                    {formatCurrency(amount)}
                </h1>
            </div>

            {/* RANGE DATE TOGGLE */}
            <div className="bg-purple-50 border border-purple-300 rounded-2xl p-4 mb-6">
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2 text-purple-600">
                        <Repeat size={18} />
                        <span className="text-xs font-bold">Input Berulang (Rentang Waktu)?</span>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" checked={isRangeMode} onChange={(e) => setIsRangeMode(e.target.checked)} className="sr-only peer" />
                        <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-purple-500"></div>
                    </label>
                </div>

                {isRangeMode && (
                   <div className="flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
                       {/* Start Date */}
                       <div className="flex-1 bg-white border border-purple-300 rounded-xl px-2 py-1 shadow-sm text-center">
                          <span className="text-[10px] font-bold text-purple-400 block mb-0.5">Dari</span>
                          <span className="text-xs font-bold text-slate-700">
                              {date ? new Date(date).toLocaleDateString("id-ID", { day: 'numeric', month: 'short' }) : "-"}
                          </span>
                       </div>
                       <ArrowRight size={16} className="text-purple-300" />
                       
                       {/* End Date (Native Picker) */}
                       <div 
                            className="flex-1 bg-white border border-purple-300 hover:border-purple-400 rounded-xl px-2 py-2 shadow-sm cursor-pointer group relative"
                            onClick={handleEndDateDivClick}
                       >
                          <span className="text-[10px] text-purple-400 block mb-0.5 text-center select-none">Sampai</span>
                          <div className="flex items-center justify-center gap-1">
                              <span className="text-xs font-bold text-slate-700 text-center select-none">
                                  {endDateStr ? new Date(endDateStr).toLocaleDateString("id-ID", { day: 'numeric', month: 'short' }) : "Pilih"}
                              </span>
                              <Edit2 size={10} className="text-purple-300 group-hover:text-purple-500 transition-colors" />
                          </div>
                          <input ref={endDateInputRef} type="date" className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer" min={date} value={endDateStr} onChange={(e) => setEndDateStr(e.target.value)} />
                       </div>
                   </div>
                )}
                 {isRangeMode && (
                    <p className="text-[9px] text-purple-400 mt-2 text-center italic">*Nominal akan dicatat otomatis setiap hari dari tanggal awal sampai akhir.</p>
                )}
            </div>

            {/* JENIS TRANSAKSI */}
            <div className="grid grid-cols-2 gap-2 mb-6 p-3 bg-gray-200 shadow-inner rounded-2xl">
                 <button onClick={() => setType("pemasukan")} className={`py-2.5 text-md font-bold rounded-xl transition-all flex items-center justify-center gap-2 ${type === "pemasukan" ? "bg-white text-emerald-600 shadow-md ring-1 ring-slate-100" : "text-green-600 hover:bg-slate-200"}`}>Pemasukan</button>
                <button onClick={() => setType("pengeluaran")} className={`py-2.5 text-md font-bold rounded-xl transition-all flex items-center justify-center gap-2 ${type === "pengeluaran" ? "bg-white text-rose-500 shadow-md ring-1 ring-slate-100" : "text-red-500 hover:bg-slate-200"}`}>Pengeluaran</button>
            </div>

            {/* INPUT CATATAN */}
            <div className="mb-6 ">
                <div className="relative group ">
                    <div className="absolute left-4 top-3.5 text-slate-400 group-focus-within:text-purple-500 transition-colors "><FileText size={18} /></div>
                    <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Catatan (e.g. Uang Saku)" className="w-full bg-gray-200 border border-slate-100 shadow-inner rounded-2xl py-4 pl-11 pr-4 text-sm font-semibold text-slate-700 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-purple-300 focus:ring-4 focus:ring-purple-100 transition-all" />
                </div>
            </div>

            {/* NUMPAD */}
            <div className="grid grid-cols-3 gap-2 mb-6 select-none">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                    <button key={num} onClick={() => handlePress(num.toString())} className="h-12 rounded-2xl bg-white border border-slate-200 text-xl font-bold text-slate-700 shadow-md shadow-gray-700/20 active:scale-95 transition-all hover:bg-slate-50 hover:border-slate-300">{num}</button>
                ))}
                <button onClick={() => handlePress("000")} className="h-12 rounded-2xl bg-slate-100 border border-slate-200 text-sm font-bold text-slate-500 shadow-md shadow-gray-700/20 active:scale-95 transition-all hover:bg-slate-200">000</button>
                <button onClick={() => handlePress("0")} className="h-12 rounded-2xl bg-white border border-slate-200 text-xl font-bold text-slate-700 shadow-md shadow-gray-700/20 active:scale-95 transition-all hover:bg-slate-50 hover:border-slate-300">0</button>
                <button onClick={() => handlePress("delete")} className="h-12 rounded-2xl bg-rose-50 border border-rose-100 text-rose-500 shadow-md shadow-gray-700/20 flex items-center justify-center active:scale-95 transition-all hover:bg-rose-100 hover:border-rose-200"><Delete size={20} /></button>
            </div>

            {/* SIMPAN */}
            <button onClick={handleSave} disabled={isLoading} className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3.5 rounded-2xl shadow-lg shadow-emerald-200 hover:shadow-xl active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed">
                {isLoading ? <><Loader2 className="animate-spin" size={18} /> Menyimpan...</> : <><Check size={20} className="" /> Simpan Transaksi</>}
            </button>

        </div>
      </motion.div>
    </div>
  );

  return createPortal(modalContent, document.body);
}