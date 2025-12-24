"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  User,
  Phone,
  Camera,
  Save,
  PawPrint,
  Star,
  Sparkles,
  Heart,
} from "lucide-react";
import { motion } from "framer-motion";

// Tipe data User
export interface UserProfile {
  name: string;
  phone: string;
  avatar: string;
}

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  userData: UserProfile;
  onSave: (newData: UserProfile) => void;
}

export default function EditProfileModal({
  isOpen,
  onClose,
  userData,
  onSave,
}: EditProfileModalProps) {
  // State lokal untuk form
  const [formData, setFormData] = useState<UserProfile>(userData);
  const [previewImage, setPreviewImage] = useState<string>(userData.avatar);

  // Update state lokal saat modal dibuka
  useEffect(() => {
    if (isOpen) {
      setFormData(userData);
      setPreviewImage(userData.avatar);
    }
  }, [isOpen, userData]);

  // Handle Upload Foto
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setPreviewImage(result);
        setFormData({ ...formData, avatar: result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    onSave(formData);
    onClose();
  };

  // Animasi Modal
  const modalVariants = {
    hidden: { opacity: 0, scale: 0.9, y: 20 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { type: "spring" as const, damping: 25, stiffness: 300 },
    },
    exit: { opacity: 0, scale: 0.95, y: 20 },
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4">
      <motion.div
        variants={modalVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="w-full max-w-md bg-white rounded-[35px] p-8 shadow-2xl relative overflow-hidden"
      >
        <div className="absolute -top-10 -left-10 w-40 h-40 bg-pink-100 rounded-full blur-3xl opacity-60 pointer-events-none"></div>

        <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-purple-100 rounded-full blur-3xl opacity-60 pointer-events-none"></div>

        {/* 3. Jejak Kaki Kucing Besar (Kiri) */}
        <div className="absolute top-10 -left-6 text-pink-200/50 rotate-[-15deg] pointer-events-none">
          <PawPrint size={100} />
        </div>

        <div className="absolute top-12 -right-4 text-yellow-200/80 rotate-15 pointer-events-none">
          <Star size={48} fill="currentColor" className="text-yellow-100" />
        </div>
        <div className="absolute bottom-20 right-2 text-rose-200/60 rotate-[-10deg] pointer-events-none">
          <Heart size={32} fill="currentColor" />
        </div>

        <div className="absolute bottom-6 left-6 text-sky-200 pointer-events-none animate-pulse">
          <Sparkles size={24} />
        </div>

        {/* --- KONTEN UTAMA (z-10 agar di atas dekorasi) --- */}
        <div className="relative z-10">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-bold text-slate-800 tracking-tight">
                Edit Profil
              </h2>
              <span className="text-xl">✨</span>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full bg-slate-50 hover:bg-slate-100 text-slate-400 transition hover:text-pink-400"
            >
              <X size={20} />
            </button>
          </div>

          <div className="space-y-6">
            {/* 1. Foto Profil Upload */}
            <div className="flex flex-col items-center">
              <div className="relative group cursor-pointer">
                {/* Frame Foto dengan Shadow Pink Lembut */}
                <div className="h-28 w-28 rounded-full overflow-hidden border-[6px] border-pink-50 shadow-[0_8px_20px_rgba(255,182,193,0.4)] transition-transform group-hover:scale-105">
                  <img
                    src={previewImage}
                    alt="Preview"
                    className="h-full w-full object-cover"
                  />
                </div>
                {/* Tombol Kamera Overlay */}
                <label
                  htmlFor="upload-photo"
                  className="absolute bottom-1 right-1 h-8 w-8 bg-white text-pink-500 rounded-full shadow-md flex items-center justify-center cursor-pointer hover:bg-pink-500 hover:text-white transition-all border border-pink-100"
                >
                  <Camera size={16} />
                </label>
                <input
                  type="file"
                  id="upload-photo"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-3">
                Ganti Foto
              </p>
            </div>

            {/* 2. Input Nama */}
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-2 ml-1">
                Nama Lengkap
              </label>
              <div className="flex items-center gap-3 w-full rounded-2xl bg-slate-50/80 border border-slate-100 px-4 py-3.5 text-sm text-slate-700 focus-within:ring-2 focus-within:ring-pink-200 focus-within:bg-white transition-all shadow-sm">
                <User size={18} className="text-pink-300" />
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="bg-transparent w-full focus:outline-none placeholder:text-slate-400 font-semibold"
                  placeholder="Tulis namamu..."
                />
              </div>
            </div>

            {/* 3. Input No HP */}
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-2 ml-1">
                Nomor HP
              </label>
              <div className="flex items-center gap-3 w-full rounded-2xl bg-slate-50/80 border border-slate-100 px-4 py-3.5 text-sm text-slate-700 focus-within:ring-2 focus-within:ring-pink-200 focus-within:bg-white transition-all shadow-sm">
                <Phone size={18} className="text-pink-300" />
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  className="bg-transparent w-full focus:outline-none placeholder:text-slate-400 font-semibold"
                  placeholder="08xx-xxxx-xxxx"
                />
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="mt-8 pt-2 flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-6 py-3 rounded-xl text-sm font-bold text-slate-500 hover:bg-slate-50 transition"
            >
              Batal
            </button>
            <button
              onClick={handleSave}
              className="px-8 py-3 rounded-xl bg-linear-to-r from-[#FF8FAB] to-[#FFB6C1] hover:from-[#ff7aa0] hover:to-[#ff9eb0] text-white text-sm font-bold shadow-lg shadow-pink-200 transition-transform active:scale-95 flex items-center gap-2"
            >
              <Save size={18} /> Simpan
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
