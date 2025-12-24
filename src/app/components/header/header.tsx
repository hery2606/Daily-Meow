"use client";

import React, { useState } from "react";
import { Bell, Cat, ChevronDown } from "lucide-react";
import { AnimatePresence } from "framer-motion";

// Import Modal Edit Profile
import EditProfileModal, { UserProfile } from "@/app/components/header/modals/EditProfileModal";

export default function Header() {
  // 1. STATE USER: Default data (karena tidak ada login)
  const [user, setUser] = useState<UserProfile>({
    name: "Meow Master", // Default Name
    phone: "0812-3456-7890",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80",
  });

  // 2. STATE MODAL
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Fungsi untuk menyimpan perubahan dari modal
  const handleUpdateProfile = (newData: UserProfile) => {
    setUser(newData);
  };

  return (
    <>
      <header className="flex h-20  items-center justify-between bg-[#F8BBD0] px-6 py-4 text-slate-800 border-b border-white/50 shadow-sm font-sans ">
        
        {/* --- KIRI: Logo & Nama App --- */}
        <div className="flex items-center gap-3 ml-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FF8FAB] text-white shadow-sm">
            <Cat size={24} strokeWidth={2.5} />
          </div>
          <h1 className="text-xl font-bold tracking-tight text-slate-700 hidden sm:block">
            Daily Meow
          </h1>
        </div>

        {/* --- KANAN: Notifikasi & Profil --- */}
        <div className="flex items-center gap-2 sm:gap-4">
          
          {/* Tombol Notifikasi */}
          <button className="relative rounded-full p-2 text-slate-700 hover:bg-white/20 transition">
            <Bell size={22} strokeWidth={2} />
            <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-red-500 ring-2 ring-[#F8BBD0]"></span>
          </button>

          {/* Divider Kecil */}
          <div className="h-6 w-px bg-slate-400/30 mx-1"></div>

          {/* Area Profil (Klik untuk Edit) */}
          <button 
            onClick={() => setIsEditModalOpen(true)}
            className="flex items-center gap-3 p-1 pr-3 rounded-full hover:bg-white/30 transition border border-transparent hover:border-white/40 group"
          >
            {/* Foto Profil */}
            <div className="h-10 w-10 overflow-hidden rounded-full border-2 border-white shadow-sm group-hover:scale-105 transition-transform">
              <img 
                src={user.avatar} 
                alt="User Profile" 
                className="h-full w-full object-cover"
              />
            </div>
            
            {/* Nama User (Teks) - Ditambahkan */}
            <div className="flex flex-col items-start text-left">
                <span className="text-sm font-bold text-slate-800 leading-tight group-hover:text-pink-700 transition-colors">
                    {user.name}
                </span>
                <span className="text-[10px] font-medium text-slate-600">
                    User
                </span>
            </div>

            {/* Ikon Panah Kecil (Indikator Menu) */}
            <ChevronDown size={14} className="text-slate-500 group-hover:text-slate-700 transition" />
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
    </>
  );
}