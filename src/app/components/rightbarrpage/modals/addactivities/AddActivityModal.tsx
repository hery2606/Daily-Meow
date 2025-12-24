"use client";

import React, { useState } from "react";
import { X, Disc, Coins } from "lucide-react";
import { motion, easeIn, easeOut } from "framer-motion";
import { useSweetAlert } from "@/app/ui/SweetAlertProvider"; 


interface AddActivityModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDate: Date | null;
  onSwitchToFinance?: () => void; 
}

export default function AddActivityModal({
  isOpen,
  onClose,
  selectedDate,
  onSwitchToFinance,
}: AddActivityModalProps) {
  const [selectedColor, setSelectedColor] = useState<string>("pink");

  const colorOptions = [
    { id: "pink", bg: "bg-pink-300", ring: "ring-pink-500" },
    { id: "blue", bg: "bg-blue-300", ring: "ring-blue-500" },
    { id: "yellow", bg: "bg-yellow-200", ring: "ring-yellow-500" },
    { id: "green", bg: "bg-green-300", ring: "ring-green-500" },
  ];

   const Swal = useSweetAlert();


  const handleSaveActivity = () => {
    Swal.showSuccessToast("Aktivitas berhasil ditambahkan!");
    onClose();
  };

  // Definisi animasi agar konsisten
  const modalVariants = {
    hidden: { opacity: 0, scale: 0.95, y: 10 }, 
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { duration: 0.2, ease: easeOut }, 
    },
    exit: {
      opacity: 0,
      scale: 0.95,
      y: -10,
      transition: { duration: 0.30, ease: easeIn }, 
    },
  };

  const displayDate = selectedDate
    ? selectedDate.toLocaleDateString("en-US", {
        weekday: "short",
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "Select a date";

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
        <div className="flex items-start justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-slate-800">Add Entry</h2>
            <p className="text-xs text-slate-500 mt-1">{displayDate}</p>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-1 hover:bg-slate-100 text-slate-400 transition"
          >
            <X size={20} />
          </button>
        </div>

        {/* --- TABS NAVIGASI --- */}
        <div className="flex gap-4 mb-6">
          {/* Tab Activity (SELALU AKTIF) */}
          <div className="flex-1 flex flex-col items-center justify-center py-4 rounded-xl border border-pink-300 bg-pink-50 text-slate-800 cursor-default">
            <div className="mb-2 p-2 rounded-full bg-white">
              <Disc size={20} className="text-slate-800" />
            </div>
            <span className="text-sm font-semibold">Activity</span>
          </div>

          {/* Tab Finance (HANYA TOMBOL PINDAH) */}
          <button
            onClick={onSwitchToFinance} // Pindah ke Modal Finance saat diklik
            className="flex-1 flex flex-col items-center justify-center py-4 rounded-xl border border-slate-200 bg-white text-slate-400 hover:bg-slate-50 transition-all"
          >
            <div className="mb-2 p-2 rounded-full bg-slate-100">
              <Coins size={20} className="text-slate-400" />
            </div>
            <span className="text-sm font-semibold">Finance</span>
          </button>
        </div>

        {/* --- FORM ACTIVITY (Wrapper Layout) --- */}
        <div className="space-y-4 mb-8">
          {/* Activity Name */}
          <div>
            <label className="block text-xs font-bold text-slate-600 mb-2">
              Activity Name
            </label>
            <input
              type="text"
              placeholder="Studying UI Design"
              className="w-full rounded-lg bg-slate-50 border border-slate-100 px-4 py-3 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-pink-200"
            />
          </div>

          {/* Grid: Time & Mark Color */}
          <div className="grid grid-cols-2 gap-4">
            {/* Time */}
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-2">
                Time
              </label>
              <input
                type="text"
                placeholder="09:00 AM"
                className="w-full rounded-lg bg-slate-50 border border-slate-100 px-4 py-3 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-pink-200"
              />
            </div>

            {/* Mark Color Selector */}
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-2">
                Mark Color
              </label>
              <div className="flex items-center gap-2 mt-2">
                {colorOptions.map((color) => (
                  <button
                    key={color.id}
                    onClick={() => setSelectedColor(color.id)}
                    className={`h-6 w-6 rounded-full transition-all ${
                      color.bg
                    } ${
                      selectedColor === color.id
                        ? `ring-2 ring-offset-2 ${color.ring} scale-110`
                        : "hover:scale-110"
                    }`}
                    aria-label={`Select ${color.id}`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-bold text-slate-600 mb-2">
              Notes (Optional)
            </label>
            <textarea
              rows={3}
              placeholder="Prepare for the presentation..."
              className="w-full rounded-lg bg-slate-50 border border-slate-100 px-4 py-3 text-sm text-slate-700 placeholder:text-slate-400 resize-none focus:outline-none focus:ring-2 focus:ring-pink-200"
            ></textarea>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-50">
          <button
            onClick={onClose}
            className="text-sm font-bold text-slate-600 hover:text-slate-900 transition"
          >
            Add Another
          </button>
          <button 
          onClick={handleSaveActivity}
          className="bg-[#FF8FAB] hover:bg-[#ff7aa0] text-slate-900 font-bold text-sm px-6 py-3 rounded-xl shadow-sm transition-transform active:scale-95">
            Save Activity
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
