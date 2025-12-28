"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Plus, Wallet, GraduationCap, CheckCircle2, Circle, Loader2 } from "lucide-react";
import { AnimatePresence } from "framer-motion"; 
import { getActivitiesByDate, getFinancesByDate, ActivityItem } from "@/services/dailyService";
import AddActivityModal from "@/app/components/modals/activitymodal/page"; 

export default function ActivitiesView() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDateString, setSelectedDateString] = useState<string>("");
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [dailySpend, setDailySpend] = useState({ count: 0, total: 0 });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const today = new Date();
    const offset = today.getTimezoneOffset() * 60000;
    const localDate = new Date(today.getTime() - offset).toISOString().slice(0, 10);
    setSelectedDateString(localDate);
  }, []);

  const fetchData = useCallback(async () => {
    const userId = localStorage.getItem("meow_user_id");  
    if (!selectedDateString || !userId) return;
    setIsLoading(true);
    try {
      const dateObj = new Date(selectedDateString);
      const [fetchedActivities, fetchedFinances] = await Promise.all([
        getActivitiesByDate(dateObj, userId),
        getFinancesByDate(dateObj, userId)
      ]);
      setActivities(fetchedActivities);

      let spendCount = 0;
      let spendTotal = 0;
      fetchedFinances.forEach((f) => {
        if (f.type === "pengeluaran") {
          spendCount++;
          spendTotal += f.amount;
        }
      });
      setDailySpend({ count: spendCount, total: spendTotal });

    } catch (error) {
      console.error("Gagal load data:", error);
    } finally {
      setIsLoading(false);
    }
  }, [selectedDateString]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const getColorClass = (color: string) => {
    switch (color) {
      case "pink": return "bg-[#FF8FAB]";
      case "blue": return "bg-sky-200";
      case "yellow": return "bg-amber-200";
      case "green": return "bg-emerald-200";
      default: return "bg-pink-100";
    }
  };

  const formatRupiah = (num: number) => {
    return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(num);
  };

  return (
    <div className="animate-in fade-in slide-in-from-right-4 duration-300 relative">
      
      <div className="flex items-center justify-between mb-6">
        <input
          type="date"
          className="text-lg font-bold bg-transparent outline-none cursor-pointer placeholder:text-slate-800 text-slate-800"
          value={selectedDateString}
          onChange={(e) => setSelectedDateString(e.target.value)}
        />
        
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-1 bg-[#FF8FAB] hover:bg-[#ff7aa0] text-white text-xs font-bold px-4 py-2 rounded-full shadow-sm transition-transform active:scale-95"
        >
          <Plus size={14} strokeWidth={3} />
          Add
        </button>
      </div>

      <div className="space-y-4 mb-4 min-h-25">
        {isLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="animate-spin text-pink-400" />
          </div>
        ) : activities.length === 0 ? (
          <div className="text-center py-8 text-slate-400 text-sm italic bg-white/50 rounded-2xl border border-dashed border-slate-200">
            Tidak ada aktivitas hari ini 💤
          </div>
        ) : (
          activities.map((item) => (
            <div key={item.id} className="bg-white p-4 rounded-2xl shadow-sm flex gap-4 items-center border border-slate-50 transition-all hover:shadow-md">
              <div
                className={`h-8 px-2 flex items-center justify-center rounded-md text-xs font-bold text-slate-800 min-w-14 ${getColorClass(item.color)}`}
              >
                {item.time}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-bold text-slate-800 truncate">{item.title}</h3>
                <p className="text-xs text-slate-500 mt-0.5 truncate">{item.notes || "No details"}</p>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="bg-slate-800 p-4 rounded-2xl shadow-lg flex items-center justify-between mb-8 text-white relative overflow-hidden">
        {/* Dekorasi background */}
        <div className="absolute -right-4 -top-4 w-20 h-20 bg-white/5 rounded-full blur-xl pointer-events-none"></div>
        
        <div className="flex items-center gap-3 relative z-10">
          <div className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center text-emerald-400 shadow-sm backdrop-blur-sm">
            <Wallet size={20} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-100">Daily Spend</h3>
            <p className="text-xs text-slate-400">{dailySpend.count} items</p>
          </div>
        </div>
        <span className="text-sm font-bold text-rose-400 relative z-10">
          {dailySpend.total > 0 ? `-${formatRupiah(dailySpend.total)}` : "Rp 0"}
        </span>
      </div>

      <div className="bg-[#FFF9E5] p-5 rounded-[20px] shadow-sm border border-[#F5E6C8]">
        <div className="flex items-center gap-2 mb-4 text-[#8B7E58]">
          <GraduationCap size={18} />
          <h3 className="text-sm font-bold">Pengingat Kuliah</h3>
        </div>
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <button className="text-[#D4C48C] hover:text-[#8B7E58] mt-0.5 transition-colors">
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

      <AnimatePresence>
        {isModalOpen && (
          <AddActivityModal
            isOpen={isModalOpen}
            onClose={() => {
              setIsModalOpen(false);
              fetchData(); 
            }}
            selectedDate={selectedDateString ? new Date(selectedDateString) : new Date()} 
          />
        )}
      </AnimatePresence>
    </div>
  );
}