import { useState, useCallback, useEffect } from "react";
import { useSweetAlert } from "@/ui/SweetAlertProvider";
import { 
    getActivitiesByDate, 
    getFinancesByDate, 
    deleteActivity, 
    deleteFinance,
    ActivityItem,
    FinanceItem
} from "@/services/dailyService";

export interface UnifiedItem {
  id: string;
  type: 'activity' | 'finance';
  time: string;
  title: string;
  subtitle: string;
  color: string; 
  amount?: number;
  originalData: ActivityItem | FinanceItem;
}

export interface FinanceSummary {
  income: number;
  expense: number;
}

export const useDetailCalendar = (selectedDate: Date | null, isOpen: boolean) => {
  const Swal = useSweetAlert();
  const [isLoading, setIsLoading] = useState(false);
  const [items, setItems] = useState<UnifiedItem[]>([]);
  const [financeSummary, setFinanceSummary] = useState<FinanceSummary>({ income: 0, expense: 0 });
  const [activeModalType, setActiveModalType] = useState<"activity" | "finance" | null>(null);
  const fetchData = useCallback(async () => {
    const userId = localStorage.getItem("meow_user_id");
    if (!selectedDate || !userId) return;

    setIsLoading(true);
    try {
      const [activities, finances] = await Promise.all([
        getActivitiesByDate(selectedDate, userId),
        getFinancesByDate(selectedDate, userId)
      ]);

      let income = 0;
      let expense = 0;
      finances.forEach(f => {
        if (f.type === 'pemasukan') income += f.amount;
        else expense += f.amount;
      });
      setFinanceSummary({ income, expense });

      const unifiedList: UnifiedItem[] = [];

      activities.forEach(act => {
        unifiedList.push({
          id: act.id,
          type: 'activity',
          time: act.time,
          title: act.title,
          subtitle: act.notes || "No notes",
          color: act.color || 'pink', 
          originalData: act
        });
      });

      finances.forEach(fin => {
        const dateObj = new Date(fin.date);
        const timeStr = dateObj.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
        
        unifiedList.push({
          id: fin.id,
          type: 'finance',
          time: timeStr,
          title: fin.title,
          subtitle: fin.type === 'pemasukan' ? `+ Rp ${fin.amount.toLocaleString()}` : `- Rp ${fin.amount.toLocaleString()}`,
          color: fin.type === 'pemasukan' ? 'emerald' : 'rose', 
          amount: fin.amount,
          originalData: fin
        });
      });

      unifiedList.sort((a, b) => a.time.localeCompare(b.time));
      setItems(unifiedList);

    } catch (error) {
      console.error("Gagal load detail harian:", error);
    } finally {
      setIsLoading(false);
    }
  }, [selectedDate]);

  useEffect(() => {
    if (isOpen && selectedDate) {
      fetchData();
    }
  }, [isOpen, selectedDate, fetchData]);

  const handleEditClick = (item: UnifiedItem) => {
    setActiveModalType(item.type);
  };

  const closeEditModal = () => {
    setActiveModalType(null);
    fetchData(); 
  };

  const handleDelete = (id: string, title: string, type: 'activity' | 'finance') => {
    Swal.showConfirm(
      type === 'activity' ? "Hapus Aktivitas?" : "Hapus Transaksi?",
      `Yakin ingin menghapus "${title}"?`,
      async () => {
        try {
          if (type === 'activity') await deleteActivity(id);
          else await deleteFinance(id);

          Swal.showSuccessToast("Berhasil dihapus!");
          fetchData();
        } catch (error) {
          Swal.showErrorToast("Gagal menghapus.");
        }
      }
    );
  };

  return {
    items,
    isLoading,
    financeSummary,
    activeModalType,
    setActiveModalType,
    handleEditClick,
    closeEditModal,
    handleDelete
  };
};