"use client";

import React from "react";
import { X, CalendarDays, TrendingUp, TrendingDown, Clock, Pencil, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Definisi Props
interface DetailCalendarModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDate: Date | null;
}

export default function DetailCalendarModal({
  isOpen,
  onClose,
  selectedDate,
}: DetailCalendarModalProps) {
  // Format tanggal untuk header
  const formattedDate = selectedDate
    ? selectedDate.toLocaleDateString("en-US", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "";

  // --- DATA DUMMY ---
  const mockFinanceSummary = {
    income: 150000,
    expense: 45200,
  };

  const mockActivities = [
    { id: 1, time: "09:00 AM", title: "Morning Yoga 🧘‍♀️", subtitle: "Home session", color: "pink" },
    { id: 2, time: "10:30 AM", title: "UI Design Course", subtitle: "Chapter 4: Auto Layout", color: "blue" },
    { id: 3, time: "12:15 PM", title: "Lunch: Ayam Geprek 🍗", subtitle: "Finance record: -Rp 25.000", color: "orange", isFinance: true },
    { id: 4, time: "03:00 PM", title: "Group Meeting", subtitle: "Discussing final project", color: "pink" },
    { id: 5, time: "07:00 PM", title: "Grocery Run 🛒", subtitle: "Finance record: -Rp 20.200", color: "orange", isFinance: true },
  ];

  // Helper format rupiah
  const formatRupiah = (num: number) => "Rp " + num.toLocaleString("id-ID");

  // Animasi Framer Motion
  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.95, y: 10 },
    visible: { 
      opacity: 1, 
      scale: 1, 
      y: 0, 
      transition: { type: "spring" as const, damping: 25, stiffness: 300 } 
    },
    exit: { opacity: 0, scale: 0.95, y: -10 },
  };

  // Handler Dummy untuk tombol Edit/Hapus
  const handleEdit = (id: number) => console.log("Edit item:", id);
  const handleDelete = (id: number) => console.log("Delete item:", id);

  return (
    <AnimatePresence>
      {isOpen && selectedDate && (
        <motion.div
          variants={overlayVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
          onClick={onClose}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4"
        >
          <motion.div
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={(e) => e.stopPropagation()}
            // Styling Scrollbar hidden tapi tetap scrollable
            className="w-full max-w-[600px] max-h-[85vh] overflow-y-auto bg-pink-200 rounded-[35px] p-6 shadow-2xl relative flex flex-col [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
          >
            <div  className=" sticky w-full top-0 z-40 bg-pink-200 rounded-[35px] p-4 mt-0 relative flex flex-col ">
            {/* --- HEADER --- */}
            <div className="flex items-start justify-between mb-6 sticky top-0 bg-white z-40  pb-2 border-b border-slate-50">
              <div className="flex items-center gap-3">
                <div className="bg-pink-100 p-3 rounded-2xl text-[#FF8FAB]">
                    <CalendarDays size={24} strokeWidth={2.5} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-800 leading-tight">Daily Recap</h2>
                  <p className="text-sm font-medium text-slate-500 mt-1">{formattedDate}</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="rounded-full p-2 bg-slate-50 hover:bg-slate-100 text-slate-400 transition"
              >
                <X size={20} />
              </button>
            </div>
                
            </div>

            {/* --- SECTION 1: FINANCE SUMMARY --- */}
            <div className="grid grid-cols-2 gap-4 mb-8">
                {/* Income */}
                <div className="bg-emerald-50/80 p-5 rounded-3xl mt-3 border border-emerald-100 flex flex-col items-start relative overflow-hidden group">
                    <div className="bg-white p-2 rounded-full text-emerald-500 mb-3 shadow-sm z-10">
                        <TrendingUp size={20} />
                    </div>
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-600/70 mb-1 z-10">Pemasukan</span>
                    <h3 className="text-xl font-extrabold text-slate-800 z-10">{formatRupiah(mockFinanceSummary.income)}</h3>
                    {/* Dekorasi Background */}
                    <div className="absolute -right-4 -bottom-4 bg-emerald-100 w-20 h-20 rounded-full opacity-50 group-hover:scale-125 transition-transform" />
                </div>
                 {/* Expense */}
                <div className="bg-rose-50/80 p-5 rounded-3xl border border-rose-100 flex flex-col items-start relative overflow-hidden group">
                    <div className="bg-white p-2 rounded-full text-rose-500 mb-3 shadow-sm z-10">
                        <TrendingDown size={20} />
                    </div>
                    <span className="text-xs font-bold uppercase tracking-wider text-rose-600/70 mb-1 z-10">Pengeluaran</span>
                    <h3 className="text-xl font-extrabold text-slate-800 z-10">{formatRupiah(mockFinanceSummary.expense)}</h3>
                    <div className="absolute -right-4 -bottom-4 bg-rose-100 w-20 h-20 rounded-full opacity-50 group-hover:scale-125 transition-transform" />
                </div>
            </div>

            {/* --- SECTION 2: ACTIVITIES TIMELINE --- */}
            <div>
                <div className="flex items-center gap-2 mb-4 px-1">
                    <Clock size={18} className="text-slate-400" />
                    <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wide">Timeline Aktivitas</h3>
                </div>

                <div className="space-y-4">
                    {mockActivities.map((item) => (
                      <div
                        key={item.id}
                        // Hapus hover:scale, ganti dengan transisi border/shadow yang halus
                        className={`group relative p-4 rounded-3xl flex items-start gap-4 border transition-all duration-300 ${
                          item.isFinance
                            ? 'bg-white border-orange-100 hover:shadow-lg hover:shadow-orange-100/50 hover:border-orange-200'
                            : 'bg-white border-slate-100 hover:shadow-lg hover:shadow-slate-100/50 hover:border-pink-200'
                        }`}
                      >
                        {/* --- MARKER & TIME (LEFT) --- */}
                        <div className="flex flex-col items-center min-w-[60px] pt-1">
                          <div
                            className={`w-12 h-12 flex items-center justify-center rounded-2xl shadow-sm text-2xl border ${
                              item.isFinance 
                                ? "bg-orange-50 border-orange-100" 
                                : "bg-pink-50 border-pink-100"
                            }`}
                          >
                            {item.isFinance ? "🪙" : "🍩"}
                          </div>
                          <span className="mt-2 text-[11px] font-bold text-slate-500 bg-slate-50 px-2 py-0.5 rounded-full border border-slate-100">
                            {item.time.split(" ")[0]} {/* Ambil jam saja misal 09:00 */}
                          </span>
                        </div>

                        {/* --- CONTENT (MIDDLE) --- */}
                        <div className="flex-1 pt-1">
                          <h3 className="text-sm font-bold text-slate-800 leading-snug">{item.title}</h3>
                          <p
                            className={`text-xs mt-1 font-medium ${
                              item.isFinance ? "text-orange-500" : "text-slate-400"
                            }`}
                          >
                            {item.subtitle}
                          </p>
                        </div>

                        {/* --- ACTIONS (RIGHT) --- */}
                        {/* Muncul saat hover (opacity-0 -> opacity-100) atau selalu terlihat tapi subtle */}
                        <div className="flex flex-col gap-2 pt-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-200">
                           <button 
                             onClick={() => handleEdit(item.id)}
                             className="p-2 rounded-xl bg-slate-50 text-slate-400 hover:bg-blue-50 hover:text-blue-500 transition-colors"
                             title="Edit"
                           >
                             <Pencil size={16} />
                           </button>
                           <button 
                             onClick={() => handleDelete(item.id)}
                             className="p-2 rounded-xl bg-slate-50 text-slate-400 hover:bg-red-50 hover:text-red-500 transition-colors"
                             title="Hapus"
                           >
                             <Trash2 size={16} />
                           </button>
                        </div>

                      </div>
                    ))}
                </div>
            </div>
            
            {/* Footer */}
            <div className="mt-8 text-center">
                <p className="text-[10px] text-slate-300 font-medium uppercase tracking-widest">
                    Daily Meow Recap • {formattedDate}
                </p>
            </div>

          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}