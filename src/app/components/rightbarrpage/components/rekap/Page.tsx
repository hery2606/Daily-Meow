"use client";

import { useState, useEffect, useCallback } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import {
  BarChart3,
  Wallet,
  TrendingUp,
  TrendingDown,
  ListTodo,
  CalendarDays,
  Loader2,
  ChevronDown,
  Download,
} from "lucide-react";
import { pb } from "@/lib/pocketbase";

export default function RecapView() {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [stats, setStats] = useState({
    totalActivities: 0,
    completedActivities: 0, 
    totalIncome: 0,
    totalExpense: 0,
    balance: 0,
  });

  const handleExportPDF = async () => {
    const userId = localStorage.getItem("meow_user_id");
    if (!userId) return;

    setIsLoading(true); 

    try {
      const startOfMonth = new Date(selectedYear, selectedMonth, 1, 0, 0, 0);
      const endOfMonth = new Date(
        selectedYear,
        selectedMonth + 1,
        0,
        23,
        59,
        59
      );
      const filter = `date >= "${startOfMonth.toISOString()}" && date <= "${endOfMonth.toISOString()}" && user = "${userId}"`;

      const records = await pb.collection("finances").getFullList({
        filter,
        sort: "-date",
      });

      const doc = new jsPDF();

      doc.setFontSize(18);
      doc.text("Daily Meow - Laporan Keuangan", 14, 22);
      doc.setFontSize(11);
      doc.text(`Periode: ${months[selectedMonth]} ${selectedYear}`, 14, 30);
      doc.text(`User ID: ${userId.slice(0, 8)}...`, 14, 36);

      doc.setFillColor(248, 187, 208); 
      doc.rect(14, 42, 182, 24, "F");
      doc.setTextColor(50);
      doc.text(`Total Pemasukan: ${formatRupiah(stats.totalIncome)}`, 20, 52);
      doc.text(
        `Total Pengeluaran: ${formatRupiah(stats.totalExpense)}`,
        20,
        60
      );
      doc.setFont("helvetica", "bold");
      doc.text(`Sisa Saldo: ${formatRupiah(stats.balance)}`, 120, 56);

      const tableData = records.map((row) => [
        new Date(row.date).toLocaleDateString("id-ID"),
        row.title,
        row.type.toUpperCase(),
        formatRupiah(row.amount),
      ]);

      autoTable(doc, {
        head: [["Tanggal", "Keterangan", "Tipe", "Jumlah"]],
        body: tableData,
        startY: 75,
        theme: "grid",
        styles: { fontSize: 10 },
      });

      doc.setFontSize(8);
      doc.text(
        "Dicetak otomatis oleh Daily Meow App 🐱",
        14,
        doc.internal.pageSize.height - 10
      );

      doc.save(`Laporan_Meow_${months[selectedMonth]}_${selectedYear}.pdf`);
    } catch (error) {
      console.error("Gagal export:", error);
      alert("Gagal mencetak PDF");
    } finally {
      setIsLoading(false);
    }
  };

  const months = [
    "Januari",
    "Februari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Agustus",
    "September",
    "Oktober",
    "November",
    "Desember",
  ];

  const currentYear = new Date().getFullYear();
  const startYear = 2024; 
  const endYear = currentYear + 5; 

  const years = Array.from(
    { length: endYear - startYear + 1 },
    (_, i) => endYear - i
  );
  const fetchData = useCallback(async () => {
    const userId = localStorage.getItem("meow_user_id");
    if (!userId) return;

    setIsLoading(true);

    try {
      const startOfMonth = new Date(selectedYear, selectedMonth, 1, 0, 0, 0);
      const endOfMonth = new Date(
        selectedYear,
        selectedMonth + 1,
        0,
        23,
        59,
        59
      );

      const filter = `date >= "${startOfMonth.toISOString()}" && date <= "${endOfMonth.toISOString()}" && user = "${userId}"`;
      const [activitiesReq, financesReq] = await Promise.all([
        pb
          .collection("activities")
          .getList(1, 500, { filter, $autoCancel: false }),
        pb
          .collection("finances")
          .getList(1, 500, { filter, $autoCancel: false }),
      ]);
      const totalAct = activitiesReq.items.length;
      let income = 0;
      let expense = 0;

      financesReq.items.forEach((item: any) => {
        if (item.type === "pemasukan") income += item.amount;
        else if (item.type === "pengeluaran") expense += item.amount;
      });

      setStats({
        totalActivities: totalAct,
        completedActivities: 0,
        totalIncome: income,
        totalExpense: expense,
        balance: income - expense,
      });
    } catch (error) {
      console.error("Gagal load recap:", error);
    } finally {
      setIsLoading(false);
    }
  }, [selectedMonth, selectedYear]);
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const formatRupiah = (num: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(num);
  };

  const getPercentage = (val: number, total: number) => {
    if (total === 0) return 0;
    return Math.min((val / total) * 100, 100);
  };

  const maxFinance = Math.max(stats.totalIncome, stats.totalExpense) || 1; 

  return (
    <div className="animate-in fade-in slide-in-from-right-4 duration-300 pb-10">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
          <BarChart3 size={20} className="text-purple-500" />
          Monthly Recap
        </h2>

        <div className="flex gap-2">
          <div className="relative">
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
              className="appearance-none bg-white border border-slate-200 text-xs font-bold pl-3 pr-8 py-2 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-200 cursor-pointer"
            >
              {months.map((m, i) => (
                <option key={i} value={i}>
                  {m}
                </option>
              ))}
            </select>
            <ChevronDown
              size={14}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
            />
          </div>

          <div className="relative">
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(parseInt(e.target.value))}
              className="appearance-none bg-white border border-slate-200 text-xs font-bold pl-3 pr-8 py-2 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-200 cursor-pointer"
            >
              {years.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
            <ChevronDown
              size={14}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
            />
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 text-slate-400 gap-2">
          <Loader2 size={30} className="animate-spin text-purple-400" />
          <p className="text-xs">Menganalisis data...</p>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white p-4 rounded-3xl shadow-sm border border-slate-50 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-3 opacity-10">
                <ListTodo size={60} className="text-blue-500" />
              </div>
              <div className="bg-blue-100 w-8 h-8 rounded-full flex items-center justify-center text-blue-600 mb-2">
                <CalendarDays size={16} />
              </div>
              <p className="text-xs text-slate-500 font-medium">
                Total Activity
              </p>
              <h3 className="text-2xl font-black text-slate-800 mt-1">
                {stats.totalActivities}
                <span className="text-xs font-normal text-slate-400 ml-1">
                  items
                </span>
              </h3>
            </div>
            <div
              className={`bg-white p-4 rounded-3xl shadow-sm border border-slate-50 relative overflow-hidden`}
            >
              <div className="absolute top-0 right-0 p-3 opacity-10">
                <Wallet
                  size={60}
                  className={
                    stats.balance >= 0 ? "text-emerald-500" : "text-rose-500"
                  }
                />
              </div>
              <div
                className={`${
                  stats.balance >= 0
                    ? "bg-emerald-100 text-emerald-600"
                    : "bg-rose-100 text-rose-600"
                } w-8 h-8 rounded-full flex items-center justify-center mb-2`}
              >
                <Wallet size={16} />
              </div>
              <p className="text-xs text-slate-500 font-medium">Net Balance</p>
              <h3
                className={`text-xl font-black mt-1 truncate ${
                  stats.balance >= 0 ? "text-emerald-600" : "text-rose-500"
                }`}
              >
                {formatRupiah(stats.balance)}
              </h3>
            </div>
          </div>

          <div className="bg-white p-5 rounded-3xl shadow-sm border border-slate-50">
            <h3 className="text-sm font-bold text-slate-700 mb-4 flex items-center gap-2">
              <Wallet size={16} className="text-slate-400" /> Finance Overview
            </h3>

            <div className="space-y-5">
              <div>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="font-bold text-slate-600 flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-emerald-400"></div>{" "}
                    Pemasukan
                  </span>
                  <span className="font-bold text-emerald-600">
                    {formatRupiah(stats.totalIncome)}
                  </span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                  <div
                    className="bg-emerald-400 h-full rounded-full transition-all duration-1000 ease-out"
                    style={{
                      width: `${getPercentage(stats.totalIncome, maxFinance)}%`,
                    }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="font-bold text-slate-600 flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-rose-400"></div>{" "}
                    Pengeluaran
                  </span>
                  <span className="font-bold text-rose-500">
                    {formatRupiah(stats.totalExpense)}
                  </span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                  <div
                    className="bg-rose-400 h-full rounded-full transition-all duration-1000 ease-out"
                    style={{
                      width: `${getPercentage(
                        stats.totalExpense,
                        maxFinance
                      )}%`,
                    }}
                  ></div>
                </div>
              </div>
            </div>

            <div className="mt-5 p-3 bg-slate-50 rounded-xl flex items-start gap-3 border border-slate-100">
              <div className="p-1.5 bg-purple-100 text-purple-600 rounded-lg shrink-0">
                {stats.totalIncome >= stats.totalExpense ? (
                  <TrendingUp size={16} />
                ) : (
                  <TrendingDown size={16} />
                )}
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-700">
                  Financial Insight
                </h4>
                <p className="text-[10px] text-slate-500 leading-relaxed mt-0.5">
                  {stats.totalIncome >= stats.totalExpense
                    ? "Bagus! Pemasukanmu lebih besar dari pengeluaran bulan ini. Tabungan aman! 💰"
                    : "Waduh! Pengeluaranmu lebih besar. Coba kurangi jajan ya! 💸"}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between mb-1 py-4 mt-6">
              <h2 className="text-lg font-bold ...">...</h2>
              <button
                onClick={handleExportPDF}
                className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold px-4 py-2 rounded-xl shadow-lg transition-all active:scale-95"
              >
                <Download size={14} /> Export PDF
              </button>
            </div>
          </div>

          <div className="bg-linear-to-br from-pink-400 to-rose-400 p-6 rounded-3xl text-white shadow-lg shadow-pink-200 relative overflow-hidden">
            <div className="absolute -right-5 -bottom-5 opacity-20 rotate-12">
              <ListTodo size={120} />
            </div>

            <div className="relative z-10">
              <h3 className="font-bold text-pink-50 text-sm mb-1">
                Productivity
              </h3>
              <h2 className="text-3xl font-black mb-4">
                {stats.totalActivities}{" "}
                <span className="text-lg font-medium opacity-80">
                  Activities
                </span>
              </h2>

              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-3 py-1.5 rounded-lg text-xs font-medium">
                <CalendarDays size={14} />
                <span>
                  {months[selectedMonth]} {selectedYear}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
