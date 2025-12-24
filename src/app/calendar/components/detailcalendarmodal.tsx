"use client";

import { X, CalendarDays, TrendingUp, TrendingDown, Clock, Pencil, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import React, { useState } from "react";

// 1. IMPORT HOOK SWEETALERT (Pastikan path-nya sesuai lokasi file Provider kamu)
// Jika error, cek path folder providers kamu. Biasanya @/providers/... atau ../../../providers/...
import { useSweetAlert } from "@/app/ui/SweetAlertProvider"; 

import AddActivityModal from "../../components/rightbarrpage/modals/addactivities/AddActivityModal";
import FinanceModal from "../../components/rightbarrpage/modals/addfinance/FinanceModal";

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
  
  // 2. INISIALISASI SWEETALERT
  const Swal = useSweetAlert();

  // Format tanggal
  const formattedDate = selectedDate
    ? selectedDate.toLocaleDateString("en-US", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "";

  // State Management
  const [editingItem, setEditingItem] = useState<any | null>(null);
  const [activeModalType, setActiveModalType] = useState<"activity" | "finance" | null>(null);

  // DATA DUMMY
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

  const formatRupiah = (num: number) => "Rp " + num.toLocaleString("id-ID");

  // --- HANDLERS ---
  const handleEditClick = (item: any) => {
    setEditingItem(item);
    setActiveModalType(item.isFinance ? "finance" : "activity");
  };

  const closeEditModal = () => {
    setEditingItem(null);
    setActiveModalType(null);
  };

  // 3. LOGIKA DELETE DENGAN SWEETALERT
  const handleDelete = (id: number, title: string) => {
    Swal.showConfirm(
      "Hapus Aktivitas?",
      `Yakin ingin menghapus "${title}"?`,
      () => {
        // --- TEMPATKAN LOGIKA HAPUS KE DATABASE DI SINI ---
        console.log("Menghapus item id:", id);
        
        // Tampilkan notifikasi sukses
        Swal.showSuccessToast("Berhasil dihapus!");
      }
    );
  };

  // Varian Animasi
  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

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

  return (
    <>
      <AnimatePresence>
        {isOpen && selectedDate && (
          <motion.div
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            onClick={onClose}
            className="fixed inset-0 z-40 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4"
          >
            <motion.div
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-137.5 max-h-[85vh] bg-[#FFF5F8] rounded-[40px] shadow-2xl relative flex flex-col overflow-hidden"
            >
              
              {/* --- HEADER --- */}
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
                <button
                  onClick={onClose}
                  className="rounded-full p-2 bg-slate-50 text-slate-400 hover:bg-rose-100 hover:text-rose-500 transition-colors"
                >
                  <X size={22} />
                </button>
              </div>

              {/* --- SCROLLABLE CONTENT --- */}
              <div className="flex-1 overflow-y-auto p-6 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                
                {/* FINANCE SUMMARY */}
                <div className="grid grid-cols-2 gap-4 mb-8">
                  {/* Pemasukan */}
                  <div className="bg-green-200/50 p-5 rounded-[30px] border border-emerald-100/50 relative overflow-hidden group shadow-md transition-all duration-300 cursor-default">
                    <div className="relative z-10">
                        <div className="bg-white w-fit p-2 rounded-full text-emerald-500 mb-2 shadow-sm">
                            <TrendingUp size={20} />
                        </div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600/60">Pemasukan</span>
                        <h3 className="text-lg font-extrabold text-slate-800 mt-0.5">{formatRupiah(mockFinanceSummary.income)}</h3>
                    </div>
                    <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-emerald-200 rounded-full group-hover:scale-110 transition-transform"/>
                  </div>
                  
                  {/* Pengeluaran */}
                  <div className="bg-rose-200/50 p-5 rounded-[30px] border border-rose-100/50 relative overflow-hidden group shadow-md transition-all duration-300 cursor-default">
                     <div className="relative z-10">
                        <div className="bg-white w-fit p-2 rounded-full text-rose-500 mb-2 shadow-sm">
                            <TrendingDown size={20} />
                        </div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-rose-600/60">Pengeluaran</span>
                        <h3 className="text-lg font-extrabold text-slate-800 mt-0.5">{formatRupiah(mockFinanceSummary.expense)}</h3>
                    </div>
                    <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-rose-200 rounded-full group-hover:scale-110 transition-transform"/>
                  </div>
                </div>

                {/* ACTIVITIES TIMELINE */}
                <div className="mb-4 flex items-center gap-2 px-2 border-b border-gray-200 pb-2">
                  <Clock size={18} className="text-slate-400" />
                  <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Timeline Aktivitas</h3>
                  <div className="flex-1" />
                  {/* Tombol Pemasukan */}
                  <button
                  onClick={() => setActiveModalType("finance")}
                  className="h-9 w-9 flex items-center justify-center rounded-xl bg-emerald-200 text-emerald-600 shadow-sm active:scale-95"
                  title="Tambah Pemasukan"
                  type="button"
                  >
                  <TrendingUp size={16} strokeWidth={2.5} />
                  </button>
                  {/* Tombol Pengeluaran */}
                  <button
                  onClick={() => setActiveModalType("finance")}
                  className="h-9 w-9 flex items-center justify-center rounded-xl bg-rose-200 text-rose-500 shadow-sm active:scale-95"
                  title="Tambah Pengeluaran"
                  type="button"
                  >
                  <TrendingDown size={16} strokeWidth={2.5} />
                  </button>
                </div>

                <div className="space-y-4 pb-4">
                  {mockActivities.map((item) => (
                    <motion.div
                      layout
                      key={item.id}
                      className={`group relative p-4 rounded-[28px] flex items-center gap-4 border-2  ${
                        item.isFinance
                          ? "bg-pink-100 border-orange-200  shadow-sm hover:shadow-orange-100"
                          : "bg-pink-100 border-pink-200  shadow-sm hover:shadow-pink-100"
                      }`}
                    >
                      {/* Left: Icon & Time */}
                      <div className="flex flex-col items-center gap-1 min-w-16">
                         <div className={`text-3xl filter drop-shadow-sm transition-transform group-hover:scale-110 duration-300`}>
                            {item.isFinance ? "🪙" : "🍩"}
                         </div>
                         <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                            {item.time.split(" ")[0]}
                         </span>
                      </div>

                      {/* Middle: Content */}
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-bold text-slate-800 truncate">{item.title}</h4>
                        <p className={`text-xs font-medium truncate mt-0.5 ${item.isFinance ? 'text-orange-500' : 'text-slate-500'}`}>
                           {item.subtitle}
                        </p>
                      </div>

                      {/* Right: Actions Buttons (Menonjol) */}
                      <div className="flex items-center gap-2">
                         {/* Tombol Edit */}
                         <button
                           onClick={() => handleEditClick(item)}
                           className="h-9 w-9 flex items-center justify-center rounded-xl bg-blue-100 text-blue-600 hover:bg-blue-400 hover:text-white transition-all shadow-sm active:scale-95"
                           title="Edit"
                         >
                           <Pencil size={16} strokeWidth={2.5} />
                         </button>
                         
                         {/* 4. TOMBOL HAPUS DENGAN SWEETALERT */}
                         <button
                           onClick={() => handleDelete(item.id, item.title)}
                           className="h-9 w-9 flex items-center justify-center rounded-xl bg-rose-200 text-rose-500 hover:bg-rose-500 hover:text-white transition-all shadow-sm active:scale-95"
                           title="Hapus"
                         >
                           <Trash2 size={16} strokeWidth={2.5} />
                         </button>
                      </div>

                    </motion.div>
                  ))}
                </div>

                <div className="text-center mt-6 mb-2">
                   <p className="text-[10px] text-slate-400 font-medium tracking-widest uppercase">~ End of Day ~</p>
                </div>

              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MODAL EDIT (Render di Luar Loop) */}
      <AnimatePresence>
        {activeModalType === "finance" && (
            <FinanceModal
                key="edit-finance"
                isOpen={true}
                onClose={closeEditModal}
                selectedDate={selectedDate}
            />
        )}
        {activeModalType === "activity" && (
            <AddActivityModal
                key="edit-activity"
                isOpen={true}
                onClose={closeEditModal}
                selectedDate={selectedDate}
            />
        )}
      </AnimatePresence>
    </>
  );
}