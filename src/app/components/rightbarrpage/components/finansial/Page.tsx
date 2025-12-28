"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus, TrendingUp, TrendingDown, DollarSign, Loader2, Wallet, ListFilter } from "lucide-react"; 
import { AnimatePresence } from "framer-motion";
import { getFinancesByDate, FinanceItem } from "@/services/dailyService";
import FinanceModal from "@/app/components/modals/financemodal/page"; 
import TransactionHistoryModal from "@/app/components/modals/TransactionHistoryModal/page"; 

export default function FinanceView() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false); 
  const [selectedDateString, setSelectedDateString] = useState<string>("");

  const [finances, setFinances] = useState<FinanceItem[]>([]);
  const [summary, setSummary] = useState({ income: 0, expense: 0, balance: 0 });
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
      const fetchedFinances = await getFinancesByDate(dateObj, userId);
      setFinances(fetchedFinances);

      let inc = 0, exp = 0;
      fetchedFinances.forEach((f) => {
        if (f.type === "pemasukan") inc += f.amount;
        else if (f.type === "pengeluaran") exp += f.amount;
      });
      setSummary({ income: inc, expense: exp, balance: inc - exp });
    } catch (error) {
      console.error("Gagal load finance:", error);
    } finally {
      setIsLoading(false);
    }
  }, [selectedDateString]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

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
          className="flex items-center gap-1 bg-emerald-400 hover:bg-emerald-500 text-white text-xs font-bold px-4 py-2 rounded-full shadow-sm transition-transform active:scale-95"
        >
          <Plus size={14} strokeWidth={3} />
          Catat
        </button>
      </div>

      <div className="bg-linear-to-br from-purple-500 to-pink-500 p-5 rounded-2xl text-white shadow-lg mb-6 relative overflow-hidden">
        {/* ... */}
         <div className="relative z-10">
          <p className="text-xs font-medium opacity-90 mb-1">Daily Balance</p>
          <h1 className="text-3xl font-bold tracking-tight">
            {formatRupiah(summary.balance)}
          </h1>
          <div className="flex gap-4 mt-4 opacity-90">
             <div className="flex items-center gap-1 text-xs">
                <div className="bg-white/20 p-1 rounded-full"><TrendingUp size={12}/></div>
                <span>+{formatRupiah(summary.income)}</span>
             </div>
             <div className="flex items-center gap-1 text-xs">
                <div className="bg-white/20 p-1 rounded-full"><TrendingDown size={12}/></div>
                <span>-{formatRupiah(summary.expense)}</span>
             </div>
          </div>
        </div>
        <DollarSign className="absolute -right-4 -bottom-4 text-white/10 h-32 w-32 rotate-12" />
      </div>

      <div className="flex items-center justify-between mb-3">
         <h3 className="text-sm font-bold text-slate-700 flex items-center gap-2">
            <Wallet size={16} className="text-slate-400"/>
            Transactions (Hari Ini)
         </h3>
         
         <button 
            onClick={() => setIsHistoryOpen(true)}
            className="text-[10px] font-bold text-purple-500 hover:text-purple-600 flex items-center gap-1 bg-purple-50 px-2 py-1 rounded-lg"
         >
            <ListFilter size={12} /> Lihat Semua & Hapus
         </button>
      </div>

       <div className="space-y-3 min-h-25">
        {isLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="animate-spin text-emerald-400" />
          </div>
        ) : finances.length === 0 ? (
          <div className="text-center py-8 text-slate-400 text-sm italic bg-white/50 rounded-2xl border border-dashed border-slate-200">
            Belum ada transaksi hari ini 💸
          </div>
        ) : (
          finances.map((t) => (
            <div
              key={t.id}
              className="bg-white p-4 rounded-xl shadow-sm flex items-center justify-between border border-slate-50 transition-all hover:shadow-md"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`h-10 w-10 rounded-full flex items-center justify-center shrink-0 ${
                    t.type === "pemasukan"
                      ? "bg-emerald-100 text-emerald-600"
                      : "bg-rose-100 text-rose-500"
                  }`}
                >
                  {t.type === "pemasukan" ? (
                    <TrendingUp size={18} />
                  ) : (
                    <TrendingDown size={18} />
                  )}
                </div>
                <div className="min-w-0">
                  <h4 className="text-sm font-bold text-slate-800 truncate">{t.title}</h4>
                  <p className="text-[10px] text-slate-500">
                    {new Date(t.date).toLocaleTimeString("id-ID", { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
              <span
                className={`text-sm font-bold whitespace-nowrap ${
                  t.type === "pemasukan" ? "text-emerald-600" : "text-rose-500"
                }`}
              >
                {t.type === "pemasukan" ? "+" : "-"} {formatRupiah(t.amount)}
              </span>
            </div>
          ))
        )}
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <FinanceModal
            isOpen={isModalOpen}
            onClose={() => {
              setIsModalOpen(false);
              fetchData(); 
            }}
            selectedDate={selectedDateString ? new Date(selectedDateString) : new Date()} 
          />
        )}
      </AnimatePresence>

      <TransactionHistoryModal 
         isOpen={isHistoryOpen} 
         onClose={() => setIsHistoryOpen(false)}
         onRefresh={fetchData} 
      />  
    </div>
  );
}