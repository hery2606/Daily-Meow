"use client";

import React, { useState } from "react";
import { Bell, Cat, ChevronDown } from "lucide-react";
import { AnimatePresence } from "framer-motion";

// Import Modal Edit Profile
import EditProfileModal, { UserProfile } from "@/app/components/header/modals/EditProfileModal";
import NotificationDropdown from "./dropdown/NotificationDropdown";

export default function Header() {
  // 1. STATE USER: Default data (karena tidak ada login)
  const [user, setUser] = useState<UserProfile>({
    name: "Sakuyy", // Default Name
    phone: "08xxxxx",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80",
  });

  // 2. STATE MODAL
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);

  // Fungsi untuk menyimpan perubahan dari modal
  const handleUpdateProfile = (newData: UserProfile) => {
    setUser(newData);
  };

  return (
    <div>
      <header className="flex h-20 items-center justify-between bg-[#F8BBD0] px-4 sm:px-6 py-4 text-slate-800 border-b border-white/50 shadow-sm font-sans">
      {/* --- KIRI: Logo & Nama App --- */}
      <div className="flex items-center gap-3 ml-1 sm:ml-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FF8FAB] text-white shadow-sm">
        <Cat size={24} strokeWidth={2.5} />
        </div>
        <h1 className="text-lg sm:text-xl font-bold tracking-tight text-slate-700">
        Daily Meow
        </h1>
      </div>

      {/* --- KANAN: Notifikasi & Profil --- */}
      <div className="flex items-center gap-1 sm:gap-4">
        {/* 1. TOMBOL NOTIFIKASI */}
        <div className="relative">
          <button
            onClick={() => setIsNotifOpen(!isNotifOpen)}
            className={`relative rounded-full p-2 transition duration-200 ${isNotifOpen ? "bg-white/40 text-pink-600" : "text-slate-700 hover:bg-white/20"}`}
            aria-label="Notifikasi"
          >
            <Bell size={22} strokeWidth={2} />
            {/* Indikator Merah */}
            <span className="absolute top-2 right-2 h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-[#F8BBD0] animate-pulse"></span>
          </button>
          {/* Komponen Dropdown Notifikasi */}
          <div className="absolute right-0  mt-2 z-30 w-72 max-w-[90vw] sm:w-80">
            <NotificationDropdown
              isOpen={isNotifOpen}
              onClose={() => setIsNotifOpen(false)}
            />
          </div>
        </div>

        {/* Divider Kecil */}
        <div className="h-6 w-px bg-slate-400/30 mx-1 hidden xs:block"></div>

        {/* Area Profil (Klik untuk Edit) */}
        <button
        onClick={() => setIsEditModalOpen(true)}
        className="flex items-center gap-2 sm:gap-3 p-1 pr-2 sm:pr-3 rounded-full hover:bg-white/30 transition border border-transparent hover:border-white/40 group"
        >
        {/* Foto Profil */}
        <div className="h-9 w-9 sm:h-10 sm:w-10 overflow-hidden rounded-full border-2 border-white shadow-sm group-hover:scale-105 transition-transform">
          <img
          src={user.avatar}
          alt="User Profile"
          className="h-full w-full object-cover"
          />
        </div>

        {/* Nama User (Teks) */}
        <div className="flex flex-col items-start text-left">
          <span className="text-xs sm:text-sm font-bold text-slate-800 leading-tight group-hover:text-pink-700 transition-colors">
          {user.name}
          </span>
          <span className="text-[9px] sm:text-[10px] font-medium text-slate-600">
          User
          </span>
        </div>

        {/* Ikon Panah Kecil */}
        <ChevronDown size={13} className="text-slate-500 group-hover:text-slate-700 transition" />
        </button>
      </div>
      </header>

      {/* --- RENDER MODAL EDIT --- */}
      <AnimatePresence>
      {isEditModalOpen && (
        <EditProfileModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        userData={user}
        onSave={handleUpdateProfile}
        />
      )}
      </AnimatePresence>
    </div>
  );
}