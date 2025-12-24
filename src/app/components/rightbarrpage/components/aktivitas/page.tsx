"use client";

import React, { useState, useEffect } from "react"; // 1. Tambah useEffect
import { Plus, Wallet, GraduationCap, CheckCircle2, Circle } from "lucide-react";
import { AnimatePresence } from "framer-motion"; 

import AddActivityModal from "../../modals/addactivities/AddActivityModal";

export default function ActivitiesView() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 2. PERBAIKAN: Jangan isi new Date() langsung. Mulai dengan string kosong.
  // Ini mencegah server dan client memiliki data yang berbeda saat render pertama.
  const [selectedDateString, setSelectedDateString] = useState<string>("");

  // 3. PERBAIKAN: Set tanggal hanya setelah komponen 'mount' di browser
  useEffect(() => {
    const today = new Date();
    // Mengubah ke format YYYY-MM-DD
    setSelectedDateString(today.toISOString().slice(0, 10));
  }, []);

  const activities = [
    {
      id: 1,
      time: "10:00",
      title: "Group Project Meeting",
      subtitle: "University Library, Room 302",
      color: "pink",
    },
    {
      id: 2,
      time: "14:30",
      title: "Cat Cafe Visit 🐱",
      subtitle: "Meet Sarah at Paws & Coffee",
      color: "blue",
    },
    {
      id: 3,
      time: "19:00",
      title: "Grocery Run",
      subtitle: "Buy milk, eggs, and cat food",
      color: "light-pink",
    },
  ];

  return (
    <div className="animate-in fade-in slide-in-from-right-4 duration-300 relative">
      {/* Header Actions */}
      <div className="flex items-center justify-between mb-6">
        
        {/* 4. PERBAIKAN: Input sekarang menggunakan state string yang aman */}
        <input
          type="date"
          className="text-lg font-bold bg-transparent outline-none cursor-pointer placeholder:text-slate-800"
          value={selectedDateString}
          onChange={(e) => setSelectedDateString(e.target.value)}
        />
        
        <button 
          onClick={() => setIsModalOpen(true)}
          // Opsional: suppressHydrationWarning jika ada ekstensi browser yang menyuntikkan atribut ID
          suppressHydrationWarning
          className="flex items-center gap-1 bg-[#FF8FAB] hover:bg-[#ff7aa0] text-black text-xs font-bold px-4 py-2 rounded-full shadow-sm transition-transform active:scale-95"
        >
          <Plus size={14} />
          Add
        </button>
      </div>

      {/* Activity Cards */}
      <div className="space-y-4 mb-4">
        {activities.map((item) => (
          <div key={item.id} className="bg-white p-4 rounded-2xl shadow-sm flex gap-4 items-center">
            <div
              className={`h-8 px-2 flex items-center justify-center rounded-md text-xs font-bold text-slate-800 min-w-15 ${
                item.color === "pink"
                  ? "bg-[#FF8FAB]"
                  : item.color === "blue"
                  ? "bg-sky-200"
                  : "bg-pink-100"
              }`}
            >
              {item.time}
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-bold text-slate-800">{item.title}</h3>
              <p className="text-xs text-slate-500 mt-0.5">{item.subtitle}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Daily Spend Card */}
      <div className="bg-slate-100 p-4 rounded-2xl shadow-sm flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-white flex items-center justify-center text-green-600 shadow-sm">
            <Wallet size={20} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-700">Daily Spend</h3>
            <p className="text-xs text-slate-500">3 items</p>
          </div>
        </div>
        <span className="text-sm font-bold text-red-500">-$45.20</span>
      </div>

      {/* Widget Pengingat Kuliah */}
      <div className="bg-[#FFF9E5] p-5 rounded-[20px] shadow-sm">
        <div className="flex items-center gap-2 mb-4 text-[#8B7E58]">
          <GraduationCap size={18} />
          <h3 className="text-sm font-bold">Pengingat Kuliah</h3>
        </div>
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <button className="text-[#D4C48C] hover:text-[#8B7E58] mt-0.5">
              <Circle size={20} strokeWidth={2} />
            </button>
            <div>
              <h4 className="text-sm font-bold text-slate-700">Intro to Psychology</h4>
              <p className="text-xs text-slate-500">Tomorrow, 08:00 AM</p>
            </div>
          </div>
          <div className="flex items-start gap-3 opacity-60">
            <button className="text-[#D4C48C] mt-0.5">
              <CheckCircle2 size={20} className="fill-[#D4C48C] text-white" />
            </button>
            <div>
              <h4 className="text-sm font-bold text-slate-700 line-through decoration-slate-400">
                Web Design Lab
              </h4>
              <p className="text-xs text-slate-500">Today, 01:00 PM</p>
            </div>
          </div>
        </div>
      </div>

      {/* Render Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <AddActivityModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            // Pastikan mengirim Date object jika modal membutuhkannya
            selectedDate={selectedDateString ? new Date(selectedDateString) : new Date()} 
          />
        )}
      </AnimatePresence>

    </div>
  );
}