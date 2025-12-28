"use client";

import { useEffect, useState } from "react";
import { pb } from "@/lib/pocketbase";
import { useSweetAlert } from "@/ui/SweetAlertProvider";
import type { Transaction, FilterType } from "@/types/finance";


export function useTransactionHistory(
  isOpen: boolean,
  onRefresh?: () => void
) {
  const Swal = useSweetAlert();
  const [isLoading, setIsLoading] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [filterType, setFilterType] = useState<FilterType>("all");
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const fetchData = async () => {
    if (!isOpen) return;
    const userId = localStorage.getItem("meow_user_id");
    if (!userId) return;

    setIsLoading(true);
    try {
      const start = new Date(selectedYear, selectedMonth, 1, 0, 0, 0);
      const end = new Date(selectedYear, selectedMonth + 1, 0, 23, 59, 59);

      let filter = `date >= "${start.toISOString()}" && date <= "${end.toISOString()}" && user = "${userId}"`;
      if (filterType !== "all") filter += ` && type = "${filterType}"`;

      const res = await pb
        .collection("finances")
        .getList<Transaction>(1, 500, {
          filter,
          sort: "-date",
        });

      setTransactions(res.items);
      setSelectedIds(new Set());
      setIsSelectionMode(false);
    } catch (err) {
      console.error("Gagal memuat transaksi:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [isOpen, selectedMonth, selectedYear, filterType]);

  const toggleSelectionMode = () => {
    setIsSelectionMode((p) => !p);
    setSelectedIds(new Set());
  };

  const toggleSelectId = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === transactions.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(transactions.map((t) => t.id)));
    }
  };

  const deleteSelected = async () => {
    if (selectedIds.size === 0) return;

    Swal.showConfirm(
      "Hapus Data?",
      `Yakin ingin menghapus ${selectedIds.size} transaksi terpilih?`,
      async () => {
        setIsLoading(true);
        try {
          await Promise.all(
            Array.from(selectedIds).map((id) =>
              pb.collection("finances").delete(id)
            )
          );

          Swal.showSuccessToast("Data berhasil dihapus");
          fetchData();
          onRefresh?.();
        } catch {
          Swal.showErrorToast("Gagal menghapus data");
        } finally {
          setIsLoading(false);
        }
      }
    );
  };

  return {
    transactions,
    isLoading,
    selectedMonth,
    setSelectedMonth,
    selectedYear,
    setSelectedYear,
    filterType,
    setFilterType,
    isSelectionMode,
    selectedIds,
    toggleSelectionMode,
    toggleSelectId,
    toggleSelectAll,
    deleteSelected,
  };
}
