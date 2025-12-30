"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { X, CalendarDays, TrendingUp, TrendingDown, Clock, Trash2, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import AddActivityModal from "../activitymodal/page";
import FinanceModal from "../financemodal/page";
import { useDetailCalendar } from "../hooks/useDetailCalendar"; 

interface DetailCalendarModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDate: Date | null;
}

export default function DetailCalendarModal({ isOpen, onClose, selectedDate }: DetailCalendarModalProps) {
  // Panggil Logic Hook
  const {
    items,
    isLoading,
    financeSummary,
    activeModalType,
    setActiveModalType,
    closeEditModal,
    handleDelete
  } = useDetailCalendar(selectedDate, isOpen);

  const [mounted, setMounted] = useState(false);
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setMounted(true), []);

  const formattedDate = selectedDate
    ? selectedDate.toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" })
    : "";
    
  const formatRupiah = (num: number) => "Rp " + num.toLocaleString("id-ID");

  // --- LOGIKA WARNA TAMPILAN ---
  const getColorStyle = (color: string) => {
    switch (color) {
      // Warna Aktivitas (Sesuai Tag)
      case 'pink': return "bg-pink-100 border-pink-200 text-pink-600";
      case 'blue': return "bg-blue-100 border-blue-200 text-blue-600";
      case 'yellow': return "bg-amber-100 border-amber-200 text-amber-600";
      case 'green': return "bg-emerald-100 border-emerald-200 text-emerald-600";
      
      // Warna Finance (Khusus)
      case 'emerald': return "bg-emerald-50 border-emerald-200 text-emerald-600"; // Pemasukan (Hijau)
      case 'rose': return "bg-rose-100 border-rose-200 text-rose-600"; // Pengeluaran (Merah)
      
      // Default fallback
      default: return "bg-slate-100 border-slate-200 text-slate-600";
    }
  };

  const overlayVariants = { hidden: { opacity: 0 }, visible: { opacity: 1 } };
  const modalVariants = {
    hidden: { opacity: 0, scale: 0.9, y: 20 },
    visible: { 
      opacity: 1, 
      scale: 1, 
      y: 0, 
      transition: { type: "spring" as const, damping: 25, stiffness: 300 } 
    },
    exit: { opacity: 0, scale: 0.95, y: -20 },
  };

  if (!mounted) return null;

  const modalContent = (
    <>
      <AnimatePresence>
        {isOpen && selectedDate && (
          <motion.div
            variants={overlayVariants}
            initial="hidden" animate="visible" exit="hidden"
            onClick={onClose}
            className="fixed inset-0 z-40 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4"
          >
            <motion.div
              variants={modalVariants}
              initial="hidden" animate="visible" exit="exit"
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-lg max-h-[85vh] bg-[#FFF5F8] rounded-[40px] shadow-2xl relative flex flex-col overflow-hidden"
            >
              {/* HEADER */}
              <div className="flex-none bg-white px-6 py-5 border-b border-pink-100 flex items-start justify-between z-20 shadow-sm">
                <div className="flex items-center gap-4">
                  <div className="bg-pink-100 p-3.5 rounded-2xl text-pink-500 shadow-inner">
                    <CalendarDays size={26} strokeWidth={2.5} />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-slate-800 leading-none">Daily Recap</h2>
                    <p className="text-sm font-medium text-slate-500 mt-1.5">{formattedDate}</p>
                  </div>
                </div>
                <button onClick={onClose} className="rounded-full p-2 bg-slate-50 text-slate-400 hover:bg-rose-100 hover:text-rose-500 transition-colors">
                  <X size={22} />
                </button>
              </div>

              {/* SCROLLABLE CONTENT */}
              <div className="flex-1 overflow-y-auto p-6 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                
                {/* Finance Cards (Pemasukan & Pengeluaran) */}
                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="bg-green-200/50 p-5 rounded-[30px] border border-emerald-100/50 relative overflow-hidden group shadow-md">
                    <div className="relative z-10">
                      <div className="bg-white w-fit p-2 rounded-full text-emerald-500 mb-2 shadow-sm"><TrendingUp size={20} /></div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600/60">Pemasukan</span>
                      <h3 className="text-lg font-extrabold text-slate-800 mt-0.5">{formatRupiah(financeSummary.income)}</h3>
                    </div>
                  </div>
                  <div className="bg-rose-200/50 p-5 rounded-[30px] border border-rose-100/50 relative overflow-hidden group shadow-md">
                    <div className="relative z-10">
                      <div className="bg-white w-fit p-2 rounded-full text-rose-500 mb-2 shadow-sm"><TrendingDown size={20} /></div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-rose-600/60">Pengeluaran</span>
                      <h3 className="text-lg font-extrabold text-slate-800 mt-0.5">{formatRupiah(financeSummary.expense)}</h3>
                    </div>
                  </div>
                </div>

                {/* Timeline Header */}
                <div className="mb-4 flex items-center gap-4 px-2 border-b border-gray-200 pb-2">
                  <Clock size={18} className="text-slate-400" />
                  <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Timeline</h3>
                  <div className="flex-1" />
                  <button onClick={() => setActiveModalType("activity")} className="h-8 px-3 text-xs font-bold rounded-lg bg-blue-100 text-blue-600 hover:bg-blue-200 transition">+ Activity</button>
                  <button onClick={() => setActiveModalType("finance")} className="h-8 px-3 text-xs font-bold rounded-lg bg-amber-100 text-amber-600 hover:bg-amber-200 transition ">+ Finance</button>
                </div>

                {/* Timeline List */}
                <div className="space-y-4 pb-4">
                  {isLoading ? (
                    <div className="flex justify-center py-10"><Loader2 className="animate-spin text-pink-400" /></div>
                  ) : items.length === 0 ? (
                    <div className="text-center py-10 text-slate-400 text-sm">Belum ada aktivitas hari ini.</div>
                  ) : (
                    items.map((item) => (
                      <motion.div layout key={item.id} className={`group relative p-4 rounded-3xl flex items-center gap-4 border-2 ${getColorStyle(item.color)} bg-opacity-30 border-opacity-50`}>
                        <div className="flex flex-col items-center gap-1 min-w-14">
                          {/* Icon berdasarkan Tipe */}
                          <div className="text-2xl">{item.type === 'finance' ? "🪙" : "🍩"}</div>
                          <span className="text-[10px] font-bold bg-white/50 px-2 py-0.5 rounded-full">{item.time}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-bold text-slate-800 truncate">{item.title}</h4>
                          <p className="text-xs font-medium opacity-80 truncate mt-0.5">{item.subtitle}</p>
                        </div>
                        <div className="flex items-center gap-2 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => handleDelete(item.id, item.title, item.type)} className="p-2 rounded-xl bg-rose-100 text-rose-600 hover:bg-rose-500 hover:text-white transition">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </motion.div>
                    ))
                  )}
                </div>
                <div className="text-center mt-6 mb-2">
                  <p className="text-[10px] text-slate-400 font-medium tracking-widest uppercase">~ End of Day ~</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* SUB MODALS */}
      <AnimatePresence>
        {activeModalType === "finance" && (
          <FinanceModal isOpen={true} onClose={closeEditModal} selectedDate={selectedDate} />
        )}
        {activeModalType === "activity" && (
          <AddActivityModal isOpen={true} onClose={closeEditModal} selectedDate={selectedDate} />
        )}
      </AnimatePresence>
    </>
  );

  return createPortal(modalContent, document.body);
}