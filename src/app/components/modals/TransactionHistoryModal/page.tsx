"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  TrendingUp,
  TrendingDown,
  Filter,
  Calendar,
  Loader2,
  Trash2,
  CheckSquare,
  Square,
  Check,
  ListChecks,
  Trash,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { createPortal } from "react-dom";
import { pb } from "@/lib/pocketbase";
import { useSweetAlert } from "@/ui/SweetAlertProvider";

interface TransactionHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRefresh?: () => void;
}

interface Transaction {
  id: string;
  title: string;
  amount: number;
  type: "pemasukan" | "pengeluaran";
  date: string;
}

export default function TransactionHistoryModal({
  isOpen,
  onClose,
  onRefresh,
}: TransactionHistoryModalProps) {
  const Swal = useSweetAlert();
  const [mounted, setMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  // State Filter
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [filterType, setFilterType] = useState<
    "all" | "pemasukan" | "pengeluaran"
  >("all");

  // State Selection (Fitur Baru)
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

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

  useEffect(() => {
    setMounted(true);
  }, []);

  // Fetch Data
  const fetchData = async () => {
    if (!isOpen) return;
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

      let filter = `date >= "${startOfMonth.toISOString()}" && date <= "${endOfMonth.toISOString()}" && user = "${userId}"`;
      if (filterType !== "all") filter += ` && type = "${filterType}"`;

      const records = await pb
        .collection("finances")
        .getList<Transaction>(1, 500, { filter, sort: "-date" });
      setTransactions(records.items);

  
      setSelectedIds(new Set());
      setIsSelectionMode(false);
    } catch (error) {
      console.error("Gagal load history:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [isOpen, selectedMonth, selectedYear, filterType]);


  const toggleSelectionMode = () => {
    setIsSelectionMode(!isSelectionMode);
    setSelectedIds(new Set()); // Reset saat mode berubah
  };

  const toggleSelectId = (id: string) => {
    const newSet = new Set(selectedIds);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    setSelectedIds(newSet);
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === transactions.length) {
      setSelectedIds(new Set()); // Unselect All
    } else {
      const allIds = new Set(transactions.map((t) => t.id));
      setSelectedIds(allIds); // Select All
    }
  };

  const handleDeleteSelected = async () => {
    if (selectedIds.size === 0) return;

    Swal.showConfirm(
      "Hapus Data?",
      `Yakin ingin menghapus ${selectedIds.size} transaksi terpilih?`,
      async () => {
        setIsLoading(true);
        try {
          const promises = Array.from(selectedIds).map((id) =>
            pb.collection("finances").delete(id)
          );
          await Promise.all(promises);

          Swal.showSuccessToast(`${selectedIds.size} data dihapus! 🗑️`);
          fetchData();
          if (onRefresh) onRefresh();
          setTimeout(() => {
            window.location.reload();
          }, 700);
        } catch (error) {
          Swal.showErrorToast("Gagal menghapus beberapa data.");
        } finally {
          setIsLoading(false);
        }
      }
    );
  };

  // --- GROUPING DATA ---
  const groupedTransactions = transactions.reduce((acc, curr) => {
    const dateStr = new Date(curr.date).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
    if (!acc[dateStr]) acc[dateStr] = [];
    acc[dateStr].push(curr);
    return acc;
  }, {} as Record<string, Transaction[]>);

  const formatRupiah = (num: number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(num);

  if (!mounted) return null;

  const modalContent = (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-30 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 font-sans">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0"
            onClick={onClose}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 40 }}
            className="w-full max-w-lg bg-white rounded-[35px] shadow-2xl overflow-hidden flex flex-col max-h-[85vh] relative z-10"
          >
            {/* HEADER */}
            <div className="bg-slate-50 px-6 py-5 border-b border-slate-100 flex justify-between items-center shrink-0">
              <div>
                <h2 className="text-xl font-bold text-slate-800">
                  Riwayat Transaksi
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Kelola & Hapus Data
                </p>
              </div>

              <div className="flex gap-2">
                {/* Tombol Toggle Selection Mode */}
                {!isLoading && transactions.length > 0 && (
                  <button
                    onClick={toggleSelectionMode}
                    className={`p-2 rounded-full transition-all ${
                      isSelectionMode
                        ? "bg-purple-100 text-purple-600"
                        : "bg-red-400 text-white "
                    }`}
                  >
                    {isSelectionMode ? (
                      <CheckSquare size={20} />
                    ) : (
                      <Trash2 size={20} />
                    )}
                  </button>
                )}
                <button
                  onClick={onClose}
                  className="bg-white p-2 rounded-full shadow-sm text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            <AnimatePresence>
              {isSelectionMode && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="bg-purple-50 px-6 py-3 border-b border-purple-100 flex justify-between items-center shrink-0 overflow-hidden"
                >
                  <button
                    onClick={toggleSelectAll}
                    className="text-xs font-bold text-purple-600 flex items-center gap-2 hover:underline"
                  >
                    {selectedIds.size === transactions.length ? (
                      <CheckSquare size={16} />
                    ) : (
                      <Square size={16} />
                    )}
                    {selectedIds.size === transactions.length
                      ? "Batal Pilih Semua"
                      : "Pilih Semua"}
                  </button>

                  <button
                    onClick={handleDeleteSelected}
                    disabled={selectedIds.size === 0}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      selectedIds.size > 0
                        ? "bg-rose-500 text-white shadow-md hover:bg-rose-600"
                        : "bg-slate-200 text-slate-400 cursor-not-allowed"
                    }`}
                  >
                    <Trash2 size={14} /> Hapus ({selectedIds.size})
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* FILTERS */}
            {!isSelectionMode && (
              <div className="px-6 py-4 border-b border-slate-100 bg-white z-10 space-y-3 shrink-0">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <select
                      value={selectedMonth}
                      onChange={(e) =>
                        setSelectedMonth(parseInt(e.target.value))
                      }
                      className="w-full appearance-none bg-slate-50 border border-slate-200 text-sm font-bold text-slate-700 py-2.5 px-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-200"
                    >
                      {months.map((m, i) => (
                        <option key={i} value={i}>
                          {m}
                        </option>
                      ))}
                    </select>
                    <Calendar
                      size={16}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                    />
                  </div>
                  <div className="relative w-28">
                    <select
                      value={selectedYear}
                      onChange={(e) =>
                        setSelectedYear(parseInt(e.target.value))
                      }
                      className="w-full appearance-none bg-slate-50 border border-slate-200 text-sm font-bold text-slate-700 py-2.5 px-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-200"
                    >
                      {years.map((y) => (
                        <option key={y} value={y}>
                          {y}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="flex bg-slate-100 p-1 rounded-xl">
                  {(["all", "pemasukan", "pengeluaran"] as const).map(
                    (type) => (
                      <button
                        key={type}
                        onClick={() => setFilterType(type)}
                        className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all capitalize ${
                          filterType === type
                            ? "bg-white text-slate-800 shadow-sm scale-105"
                            : "text-slate-400 hover:text-slate-600"
                        }`}
                      >
                        {type === "all" ? "Semua" : type}
                      </button>
                    )
                  )}
                </div>
              </div>
            )}

            <div className="flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-slate-200">
              {isLoading ? (
                <div className="flex flex-col items-center justify-center h-40 text-slate-400 gap-2">
                  <Loader2 className="animate-spin" size={24} />
                  <span className="text-xs">Memuat data...</span>
                </div>
              ) : transactions.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-40 text-slate-400 text-center">
                  <Filter size={32} className="mb-2 opacity-20" />
                  <p className="text-sm font-medium">Tidak ada transaksi</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {Object.entries(groupedTransactions).map(([date, items]) => (
                    <div key={date}>
                      <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 sticky top-0 bg-white/90 backdrop-blur-sm py-1 z-10">
                        {date}
                      </h3>
                      <div className="space-y-3">
                        {items.map((item) => (
                          <div
                            key={item.id}
                            onClick={() =>
                              isSelectionMode && toggleSelectId(item.id)
                            }
                            className={`flex items-center justify-between p-3 rounded-2xl border transition-all cursor-pointer ${
                              isSelectionMode
                                ? selectedIds.has(item.id)
                                  ? "bg-purple-50 border-purple-300 ring-1 ring-purple-300"
                                  : "bg-white border-slate-200 hover:border-purple-200"
                                : "bg-white border-slate-50 shadow-sm hover:border-purple-100"
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              {isSelectionMode && (
                                <div
                                  className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${
                                    selectedIds.has(item.id)
                                      ? "bg-purple-500 border-purple-500 text-white"
                                      : "border-slate-300 bg-white"
                                  }`}
                                >
                                  {selectedIds.has(item.id) && (
                                    <Check size={14} strokeWidth={3} />
                                  )}
                                </div>
                              )}

                              <div
                                className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                                  item.type === "pemasukan"
                                    ? "bg-emerald-100 text-emerald-600"
                                    : "bg-rose-100 text-rose-600"
                                }`}
                              >
                                {item.type === "pemasukan" ? (
                                  <TrendingUp size={18} />
                                ) : (
                                  <TrendingDown size={18} />
                                )}
                              </div>

                              <div className="min-w-0">
                                <p className="text-sm font-bold text-slate-700 truncate max-w-30 sm:max-w-45">
                                  {item.title}
                                </p>
                                <p className="text-[10px] text-slate-400 capitalize">
                                  {item.type}
                                </p>
                              </div>
                            </div>
                            <span
                              className={`text-sm font-bold whitespace-nowrap ${
                                item.type === "pemasukan"
                                  ? "text-emerald-600"
                                  : "text-rose-500"
                              }`}
                            >
                              {item.type === "pemasukan" ? "+" : "-"}{" "}
                              {formatRupiah(item.amount)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );

  return createPortal(modalContent, document.body);
}
