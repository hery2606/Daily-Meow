"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Check, Bell, Calendar, Wallet, Info, Trash2 } from "lucide-react";

// Tipe Data Notifikasi
interface NotificationItem {
  id: number;
  title: string;
  message: string;
  time: string;
  type: "info" | "success" | "warning" | "finance" | "calendar";
  read: boolean;
}

interface NotificationDropdownProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function NotificationDropdown({ isOpen, onClose }: NotificationDropdownProps) {
  // Dummy Data
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: 1,
      title: "Jadwal Kuliah",
      message: "Kelas 'Intro to Psychology' dimulai dalam 30 menit!",
      time: "2m ago",
      type: "calendar",
      read: false,
    },
    {
      id: 2,
      title: "Pengeluaran Tercatat",
      message: "Berhasil mencatat pengeluaran Rp 25.000 (Makan Siang).",
      time: "1h ago",
      type: "finance",
      read: false,
    },
    {
      id: 3,
      title: "Target Tercapai! 🎉",
      message: "Kamu sudah menyelesaikan 5 tugas minggu ini. Great job!",
      time: "3h ago",
      type: "success",
      read: true,
    },
    {
      id: 4,
      title: "Update Sistem",
      message: "Fitur baru 'Dark Mode' akan segera hadir.",
      time: "1d ago",
      type: "info",
      read: true,
    },
  ]);

  // Handler: Tandai semua sudah dibaca
  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  // Handler: Hapus notifikasi
  const handleDelete = (id: number) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  // Helper: Ikon berdasarkan tipe
  const getIcon = (type: string) => {
    switch (type) {
      case "calendar": return <Calendar size={18} className="text-pink-500" />;
      case "finance": return <Wallet size={18} className="text-orange-500" />;
      case "success": return <Check size={18} className="text-emerald-500" />;
      case "info": return <Info size={18} className="text-blue-500" />;
      default: return <Bell size={18} className="text-slate-500" />;
    }
  };

  // Helper: Warna background ikon
  const getBgColor = (type: string) => {
    switch (type) {
      case "calendar": return "bg-pink-100";
      case "finance": return "bg-orange-100";
      case "success": return "bg-emerald-100";
      case "info": return "bg-blue-100";
      default: return "bg-slate-100";
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Invisible Overlay untuk menutup saat klik luar */}
          <div className="fixed inset-0 z-40" onClick={onClose} />

          {/* DROPDOWN CONTAINER */}
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="absolute right-0 top-16 z-50 w-[360px] bg-white/90 backdrop-blur-xl border border-white/50 rounded-[30px] shadow-2xl overflow-hidden flex flex-col"
          >
            
            {/* --- HEADER --- */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-white/50">
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-slate-800">Notifications</h3>
                <span className="bg-pink-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                  {notifications.filter(n => !n.read).length} New
                </span>
              </div>
              <div className="flex gap-2">
                 {/* Tombol Mark All Read */}
                 <button 
                    onClick={handleMarkAllRead}
                    className="text-[10px] font-bold text-slate-400 hover:text-pink-500 transition-colors uppercase tracking-wider"
                 >
                    Mark all read
                 </button>
              </div>
            </div>

            {/* --- LIST NOTIFIKASI --- */}
            <div className="max-h-[350px] overflow-y-auto p-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
              {notifications.length > 0 ? (
                notifications.map((item) => (
                  <motion.div
                    layout
                    key={item.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className={`group relative p-3 rounded-2xl flex gap-3 transition-all hover:bg-white mb-1 border border-transparent hover:border-pink-100 hover:shadow-sm ${!item.read ? "bg-pink-50/50" : "bg-transparent"}`}
                  >
                    {/* Icon */}
                    <div className={`flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center ${getBgColor(item.type)}`}>
                      {getIcon(item.type)}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0 pr-6">
                      <div className="flex justify-between items-start">
                         <h4 className={`text-sm truncate ${!item.read ? "font-bold text-slate-800" : "font-semibold text-slate-600"}`}>
                           {item.title}
                         </h4>
                         <span className="text-[10px] text-slate-400 font-medium whitespace-nowrap ml-2">
                           {item.time}
                         </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5 leading-snug line-clamp-2">
                        {item.message}
                      </p>
                    </div>

                    {/* Unread Indicator (Dot) */}
                    {!item.read && (
                      <div className="absolute top-1/2 right-3 -translate-y-1/2 w-2 h-2 bg-pink-500 rounded-full group-hover:opacity-0 transition-opacity" />
                    )}

                    {/* Delete Button (Muncul saat Hover) */}
                    <button
                        onClick={() => handleDelete(item.id)}
                        className="absolute top-1/2 right-2 -translate-y-1/2 p-1.5 rounded-full bg-white text-slate-300 hover:text-red-500 hover:bg-red-50 shadow-sm opacity-0 group-hover:opacity-100 transition-all scale-90 group-hover:scale-100"
                        title="Hapus notifikasi"
                    >
                        <Trash2 size={14} />
                    </button>

                  </motion.div>
                ))
              ) : (
                // EMPTY STATE
                <div className="flex flex-col items-center justify-center py-10 text-center">
                   <div className="bg-slate-50 p-4 rounded-full mb-3">
                      <Bell size={24} className="text-slate-300" />
                   </div>
                   <p className="text-sm font-bold text-slate-600">No Notifications</p>
                   <p className="text-xs text-slate-400 mt-1">You're all caught up! 🐱</p>
                </div>
              )}
            </div>
            
            {/* Footer Decor */}
            <div className="bg-slate-50/50 h-2 w-full" />

          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}