"use client";

import React, { useState, useEffect } from "react";
import { 
  Calculator, 
  Coins,
  Cat,
  AlertTriangle,
  CalendarDays,
  History, 
  ArrowRight
} from "lucide-react";
import { pb } from "@/lib/pocketbase";
import TransactionHistoryModal from "../../../modals/TransactionHistoryModal/page"; 

export default function InsightView() {
  const [isLoading, setIsLoading] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false); 
  const [dailyAmount, setDailyAmount] = useState<string>("");
  const [financialMood, setFinancialMood] = useState<"happy" | "warning" | "sad">("happy");
  const [mostExpensiveDay, setMostExpensiveDay] = useState<{day: string, amount: number} | null>(null);
  const formatRupiah = (num: number) => {
    return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(num);
  };

  useEffect(() => {
    const fetchInsightData = async () => {
      const userId = localStorage.getItem("meow_user_id");
      if (!userId) return;

      setIsLoading(true);
      try {
        const records = await pb.collection("finances").getFullList({
          filter: `user = "${userId}"`,
          sort: "-date",
        });

        let totalInc = 0;
        let totalExp = 0;
        const daysSpending = { "Minggu": 0, "Senin": 0, "Selasa": 0, "Rabu": 0, "Kamis": 0, "Jumat": 0, "Sabtu": 0 };

        records.forEach((rec) => {
          const dayName = new Date(rec.date).toLocaleDateString("id-ID", { weekday: "long" });

          if (rec.type === "pemasukan") {
            totalInc += rec.amount;
          } else if (rec.type === "pengeluaran") {
            totalExp += rec.amount;
            if (daysSpending[dayName as keyof typeof daysSpending] !== undefined) {
                daysSpending[dayName as keyof typeof daysSpending] += rec.amount;
            }
          }
        });

        if (totalInc > totalExp * 1.2) setFinancialMood("happy");
        else if (totalInc >= totalExp) setFinancialMood("warning");
        else setFinancialMood("sad");

        let maxDay = "";
        let maxAmount = 0;
        Object.entries(daysSpending).forEach(([day, amount]) => {
            if (amount > maxAmount) {
                maxAmount = amount;
                maxDay = day;
            }
        });
        if (maxAmount > 0) {
            setMostExpensiveDay({ day: maxDay, amount: maxAmount });
        }

      } catch (error) {
        console.error("Gagal load insight:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInsightData();
  }, []);

  const calculatePrediction = (days: number) => {
    const amount = parseInt(dailyAmount) || 0;
    return formatRupiah(amount * days);
  };

  return (
    <div className="animate-in fade-in slide-in-from-right-4 duration-300 pb-8">
      
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold flex items-center gap-2">
            <Coins size={20} className="text-yellow-500"/> Financial Insight
        </h2>
      </div>

      <div className={`p-5 rounded-3xl shadow-sm mb-5 relative overflow-hidden transition-colors border-2 ${
          financialMood === "happy" ? "bg-emerald-100 border-emerald-200" :
          financialMood === "warning" ? "bg-amber-100 border-amber-200" : "bg-rose-100 border-rose-200"
      }`}>
          <div className="flex items-center gap-4 relative z-10">
              <div className="bg-white p-3 rounded-full shadow-sm text-4xl">
                  {financialMood === "happy" ? "😺" : financialMood === "warning" ? "🙀" : "😿"}
              </div>
              <div>
                  <h3 className={`text-sm font-bold uppercase tracking-wider ${
                      financialMood === "happy" ? "text-emerald-600" : 
                      financialMood === "warning" ? "text-amber-600" : "text-rose-600"
                  }`}>
                      Kondisi Keuangan
                  </h3>
                  <p className="text-sm font-bold text-slate-700 mt-1">
                      {financialMood === "happy" ? "Aman terkendali! 💰" :
                       financialMood === "warning" ? "Mulai hati-hati ya! 🚧" :
                       "Pengeluaran bengkak! 📉"}
                  </p>
              </div>
          </div>
      </div>

      <div 
        onClick={() => setIsHistoryOpen(true)}
        className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100 mb-6 flex items-center justify-between cursor-pointer hover:bg-slate-50 transition-colors group"
      >
         <div className="flex items-center gap-3">
            <div className="bg-blue-100 p-3 rounded-xl text-blue-600">
               <History size={20} />
            </div>
            <div>
               <h3 className="text-sm font-bold text-slate-800">Riwayat Transaksi</h3>
               <p className="text-xs text-slate-400">Lihat semua data pemasukan & pengeluaran</p>
            </div>
         </div>
         <div className="bg-slate-100 p-2 rounded-full text-slate-400 group-hover:bg-blue-100 group-hover:text-blue-600 transition-colors">
            <ArrowRight size={18} />
         </div>
      </div>

      {mostExpensiveDay && (
        <div className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100 mb-6 flex items-center justify-between">
           <div>
              <div className="flex items-center gap-2 text-rose-500 mb-1">
                 <AlertTriangle size={16} />
                 <span className="text-xs font-bold uppercase tracking-wide">Hari Paling Boros</span>
              </div>
              <h3 className="text-lg font-black text-slate-800">
                 Setiap hari <span className="text-rose-500 underline decoration-wavy">{mostExpensiveDay.day}</span>
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                 Total keluar: {formatRupiah(mostExpensiveDay.amount)}
              </p>
           </div>
           <div className="bg-rose-50 p-3 rounded-2xl text-rose-400">
              <CalendarDays size={24} />
           </div>
        </div>
      )}

      <div className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100 mb-6 relative overflow-hidden">
         <div className="flex items-center gap-2 mb-4 text-purple-600">
            <Calculator size={18} />
            <h3 className="text-sm font-bold">Income Predictor</h3>
         </div>
         <div className="mb-4">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Input Pemasukan Harian</label>
            <div className="flex items-center gap-2 mt-1.5">
               <span className="font-bold text-slate-400">Rp</span>
               <input 
                  type="number" 
                  value={dailyAmount}
                  onChange={(e) => setDailyAmount(e.target.value)}
                  placeholder="Contoh: 50000"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-purple-200 transition-all"
               />
            </div>
         </div>
         {dailyAmount && parseInt(dailyAmount) > 0 ? (
            <div className="grid grid-cols-3 gap-2 mt-2">
                <div className="bg-purple-50 p-3 rounded-xl text-center border border-purple-100">
                    <p className="text-[10px] text-purple-400 font-bold uppercase">1 Minggu</p>
                    <p className="text-xs font-black text-purple-700 mt-1">{calculatePrediction(7)}</p>
                </div>
                <div className="bg-purple-50 p-3 rounded-xl text-center border border-purple-100">
                    <p className="text-[10px] text-purple-400 font-bold uppercase">1 Bulan</p>
                    <p className="text-xs font-black text-purple-700 mt-1">{calculatePrediction(30)}</p>
                </div>
                <div className="bg-purple-50 p-3 rounded-xl text-center border border-purple-100">
                    <p className="text-[10px] text-purple-400 font-bold uppercase">1 Tahun</p>
                    <p className="text-xs font-black text-purple-700 mt-1">{calculatePrediction(365)}</p>
                </div>
            </div>
         ) : (
             <p className="text-xs text-slate-400 text-center italic py-2">Masukkan nominal untuk melihat prediksi ✨</p>
         )}
      </div>

      <TransactionHistoryModal 
        isOpen={isHistoryOpen} 
        onClose={() => setIsHistoryOpen(false)} 
      />
    </div>
  );
}