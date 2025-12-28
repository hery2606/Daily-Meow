"use client";

import React, { useEffect, useState } from "react";
import { Bell, Check, Clock } from "lucide-react";
import { pb } from "@/lib/pocketbase";

interface NotificationDropdownProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function NotificationDropdown({ isOpen, onClose }: NotificationDropdownProps) {
  const [reminders, setReminders] = useState<any[]>([]);
  const [permission, setPermission] = useState("default");

  // 1. Minta Izin Browser saat pertama load
  useEffect(() => {
    if ("Notification" in window) {
      setPermission(Notification.permission);
    }
  }, []);

  const requestPermission = async () => {
    const result = await Notification.requestPermission();
    setPermission(result);
  };

  // 2. Cek Jadwal Hari Ini (Polling setiap 5 menit)
  useEffect(() => {
    const checkSchedule = async () => {
      const userId = localStorage.getItem("meow_user_id");
      if (!userId) return;

      const now = new Date();
      // Cari aktivitas dari jam sekarang sampai besok pagi
      const tomorrow = new Date(now);
      tomorrow.setDate(tomorrow.getDate() + 1);

      const records = await pb.collection("activities").getList(1, 10, {
        filter: `date >= "${now.toISOString()}" && date <= "${tomorrow.toISOString()}" && user = "${userId}" && is_completed = false`,
        sort: "date",
      });

      setReminders(records.items);

      // LOGIC NOTIFIKASI BROWSER
      if (Notification.permission === "granted") {
        records.items.forEach((item) => {
          const activityTime = new Date(item.date).getTime(); // Asumsi date di DB sudah gabungan tanggal+jam
          // Jika aktivitas dalam 30 menit ke depan
          if (activityTime > now.getTime() && activityTime < now.getTime() + 30 * 60000) {
             new Notification("Ingat Jadwalmu! 🐱", {
               body: `Sebentar lagi: ${item.title}`,
               icon: "/favicon.ico" // Ganti icon kucingmu
             });
          }
        });
      }
    };

    checkSchedule();
    const interval = setInterval(checkSchedule, 5 * 60 * 1000); // Cek tiap 5 menit
    return () => clearInterval(interval);
  }, []);

  if (!isOpen) return null;

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden w-full max-h-100 flex flex-col">
      <div className="p-4 border-b border-slate-50 flex justify-between items-center bg-pink-50/50">
        <h3 className="font-bold text-slate-700 text-sm">Pengingat Jadwal</h3>
        {permission !== "granted" && (
          <button onClick={requestPermission} className="text-[10px] bg-pink-200 text-pink-700 px-2 py-1 rounded-lg hover:bg-pink-300 transition">
            Aktifkan Notif
          </button>
        )}
      </div>
      
      <div className="overflow-y-auto p-2 space-y-2">
        {reminders.length === 0 ? (
          <div className="text-center py-8 text-slate-400">
            <Bell size={24} className="mx-auto mb-2 opacity-20"/>
            <p className="text-xs">Tidak ada jadwal mendesak</p>
          </div>
        ) : (
          reminders.map((item) => (
            <div key={item.id} className="flex gap-3 p-3 hover:bg-slate-50 rounded-xl transition-colors group">
               <div className={`w-2 h-full rounded-full ${item.color === 'pink' ? 'bg-pink-400' : 'bg-blue-400'}`}></div>
               <div className="flex-1">
                  <h4 className="text-sm font-bold text-slate-800">{item.title}</h4>
                  <div className="flex items-center gap-1 text-[10px] text-slate-500 mt-1">
                     <Clock size={10} />
                     {new Date(item.date).toLocaleTimeString("id-ID", { hour: '2-digit', minute:'2-digit' })}
                  </div>
               </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}