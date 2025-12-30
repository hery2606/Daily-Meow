"use client";

import { createPortal } from "react-dom";
import { X, Check, FileText, Calendar, Clock, AlignLeft, ListTodo, Palette } from "lucide-react";
import { motion} from "framer-motion";
import { useAddActivityModal, AddActivityModalProps } from "../hooks/useAddActivityModal"; 

export default function AddActivityModal(props: AddActivityModalProps) {
  const {
    mounted,
    isLoading,
    title, setTitle,
    inputDate, setInputDate,
    time, setTime,
    notes, setNotes,
    selectedColor, setSelectedColor,
    colorOptions,
    dateInputRef,
    timeInputRef,
    handleDateClick,
    handleTimeClick,
    handleSaveActivity
  } = useAddActivityModal(props);

  if (!mounted || !props.isOpen) return null;

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.9, y: 20 },
    visible: { 
        opacity: 1, 
        scale: 1, 
        y: 0, 
        transition: { duration: 0.3, type: "spring" as const, stiffness: 300, damping: 25 } 
    },
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
                <ListTodo size={100} className="text-pink-300" />
            </div>

            <div className="flex justify-between items-start relative z-10 mb-4">
                <div>
                    <h2 className="text-2xl font-black text-slate-800 tracking-tight">New Activity 🍩</h2>
                </div>
                <button 
                    onClick={props.onClose} 
                    className="bg-white/60 hover:bg-white p-2 rounded-full text-slate-500 transition shadow-sm backdrop-blur-sm"
                >
                    <X size={20} />
                </button>
            </div>
        </div>

        {/* --- CONTENT --- */}
        <div className="px-6 pb-6 pt-4 overflow-y-auto bg-white [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
            
            <div className="space-y-4">
                
                {/* 1. INPUT JUDUL */}
                <div className="relative group">
                    <div className="absolute left-4 top-3.5 text-slate-400 group-focus-within:text-purple-500 transition-colors">
                        <FileText size={18} />
                    </div>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Mau ngapain hari ini?"
                        className="w-full bg-gray-200 border border-slate-100 shadow-inner rounded-2xl py-4 pl-11 pr-4 text-sm font-semibold text-slate-700 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-purple-300 focus:ring-4 focus:ring-purple-100 transition-all"
                        autoFocus
                    />
                </div>

                {/* 2. GRID DATE & TIME */}
                <div className="grid grid-cols-2 gap-3">
                    {/* Date Picker Custom */}
                    <div className="relative group cursor-pointer" onClick={handleDateClick}>
                        <div className="flex flex-col bg-white border border-purple-100 hover:border-purple-300 px-3 py-2 rounded-2xl shadow-sm group-hover:shadow-md transition-all">
                            <div className="flex items-center gap-2 mb-1">
                                <Calendar size={14} className="text-purple-500" />
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Tanggal</span>
                            </div>
                            <span className="text-sm font-bold text-slate-700">
                                {inputDate ? new Date(inputDate).toLocaleDateString("id-ID", { day: 'numeric', month: 'short' }) : "-"}
                            </span>
                        </div>
                        <input 
                            ref={dateInputRef}
                            type="date" 
                            value={inputDate} 
                            onChange={(e) => setInputDate(e.target.value)} 
                            className="absolute top-0 left-0 w-0 h-0 opacity-0 pointer-events-none"
                        />
                    </div>

                    {/* Time Picker Custom */}
                    <div className="relative group cursor-pointer" onClick={handleTimeClick}>
                        <div className="flex flex-col bg-white border border-purple-100 hover:border-purple-300 px-3 py-2 rounded-2xl shadow-sm group-hover:shadow-md transition-all">
                            <div className="flex items-center gap-2 mb-1">
                                <Clock size={14} className="text-purple-500" />
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Jam</span>
                            </div>
                            <span className="text-sm font-bold text-slate-700">
                                {time || "--:--"}
                            </span>
                        </div>
                        <input 
                            ref={timeInputRef}
                            type="time" 
                            value={time} 
                            onChange={(e) => setTime(e.target.value)} 
                            className="absolute top-0 left-0 w-0 h-0 opacity-0 pointer-events-none"
                        />
                    </div>
                </div>

                {/* 3. COLOR PICKER */}
                <div className="bg-gray-50 border border-slate-100 rounded-2xl p-3">
                    <div className="flex items-center gap-2 mb-3 px-1">
                        <Palette size={16} className="text-purple-500" />
                        <span className="text-xs font-bold text-slate-500">Pilih Warna Tag</span>
                    </div>
                    <div className="flex justify-between gap-2">
                        {colorOptions.map((option) => (
                            <button
                                key={option.id}
                                onClick={() => setSelectedColor(option.id)}
                                className={`flex-1 h-10 rounded-xl transition-all duration-300 flex items-center justify-center ${option.bg} ${
                                    selectedColor === option.id 
                                    ? `ring-4 ${option.ring} ring-opacity-60 scale-105 shadow-md` 
                                    : "opacity-60 hover:opacity-100 hover:scale-105"
                                }`}
                            >
                                {selectedColor === option.id && <Check size={16} className="text-black/50" strokeWidth={3} />}
                            </button>
                        ))}
                    </div>
                </div>

                {/* 4. NOTES */}
                <div className="relative group">
                    <div className="absolute left-4 top-3.5 text-slate-400 group-focus-within:text-purple-500 transition-colors">
                        <AlignLeft size={18} />
                    </div>
                    <textarea
                        rows={3}
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Tambahkan catatan detail..."
                        className="w-full bg-gray-200 border border-slate-100 shadow-inner rounded-2xl py-3 pl-11 pr-4 text-sm font-semibold text-slate-700 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-purple-300 focus:ring-4 focus:ring-purple-100 transition-all resize-none"
                    />
                </div>

            </div>

            {/* BUTTON SAVE */}
            <button 
                onClick={handleSaveActivity}
                disabled={isLoading}
                className="w-full mt-6 bg-pink-500 hover:bg-pink-600 text-white font-bold py-3.5 rounded-2xl shadow-lg shadow-pink-200 hover:shadow-xl active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
                {isLoading ? "Menyimpan..." : <><Check size={20} /> Simpan Aktivitas</>}
            </button>

        </div>
      </motion.div>
    </div>
  );

  return createPortal(modalContent, document.body);
}