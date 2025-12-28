import { useState, useEffect, useRef } from "react";
import { pb } from "@/lib/pocketbase";
import { useSweetAlert } from "@/ui/SweetAlertProvider";

export interface FinanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDate: Date | null;
}

export const useFinanceModal = ({ isOpen, onClose, selectedDate }: FinanceModalProps) => {
  const Swal = useSweetAlert();
  const [mounted, setMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const dateInputRef = useRef<HTMLInputElement>(null);
  const endDateInputRef = useRef<HTMLInputElement>(null);
  const [amount, setAmount] = useState<string>("0");
  const [type, setType] = useState<"pengeluaran" | "pemasukan">("pemasukan"); 
  const [title, setTitle] = useState("");
  const [date, setDate] = useState<string>("");
  const [isRangeMode, setIsRangeMode] = useState(false);
  const [endDateStr, setEndDateStr] = useState("");

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
      if (selectedDate) {
        const offset = selectedDate.getTimezoneOffset() * 60000;
        const localDate = new Date(selectedDate.getTime() - offset).toISOString().split('T')[0];
        setDate(localDate);
      } else {
        const today = new Date();
        const offset = today.getTimezoneOffset() * 60000;
        const localDate = new Date(today.getTime() - offset).toISOString().split('T')[0];
        setDate(localDate);
      }
      
      setAmount("0");
      setTitle("");
      setType("pemasukan"); 
      setIsRangeMode(false);
      setEndDateStr("");
    }
  }, [isOpen, selectedDate]);

  const formatCurrency = (value: string) => {
    if (!value) return "0";
    return parseInt(value).toLocaleString("id-ID");
  };

  const handlePress = (val: string) => {
    if (val === "delete") {
      setAmount((prev) => (prev.length > 1 ? prev.slice(0, -1) : "0"));
    } else if (val === "000") {
      setAmount((prev) => (prev === "0" ? "0" : prev + "000"));
    } else {
      setAmount((prev) => (prev === "0" ? val : prev + val));
    }
  };

  const handleDivClick = () => {
    if (dateInputRef.current) {
      try { dateInputRef.current.showPicker(); } 
      catch (e) { dateInputRef.current.focus(); }
    }
  };

  const handleEndDateDivClick = () => {
    if (endDateInputRef.current) {
      try { endDateInputRef.current.showPicker(); } 
      catch (e) { endDateInputRef.current.focus(); }
    }
  };

  const handleSave = async () => {
    const numAmount = parseInt(amount);
    const userId = localStorage.getItem("meow_user_id");

    if (numAmount <= 0) return Swal.showErrorToast("Jumlah uang harus lebih dari 0! 💸");
    if (!title.trim()) return Swal.showErrorToast("Catatan tidak boleh kosong! 📝");
    if (!date) return Swal.showErrorToast("Tanggal belum dipilih! 📅");
    if (!userId) return Swal.showErrorToast("Login dulu ya! 🔒");

    setIsLoading(true);

    try {
      if (isRangeMode && endDateStr) {
        const startDateObj = new Date(date);
        const endDateObj = new Date(endDateStr);

        if (endDateObj < startDateObj) {
          setIsLoading(false);
          return Swal.showErrorToast("Tanggal akhir harus setelah tanggal awal!");
        }

        const diffTime = Math.abs(endDateObj.getTime() - startDateObj.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays > 365) {
          setIsLoading(false);
          return Swal.showErrorToast("Maksimal rentang waktu 1 tahun ya! 🙀");
        }

        const promises = [];
        for (let i = 0; i <= diffDays; i++) {
          const currentDate = new Date(startDateObj);
          currentDate.setDate(startDateObj.getDate() + i);
          const dateISO = new Date(currentDate.getTime() - (currentDate.getTimezoneOffset() * 60000)).toISOString();

          promises.push(
            pb.collection('finances').create({
              user: userId,
              title: title,
              amount: numAmount,
              type: type,
              date: dateISO,
            })
          );
        }

        await Promise.all(promises);
        Swal.showSuccessToast(`Berhasil mencatat untuk ${diffDays + 1} hari! 🗓️`);

      } else {
        const singleDateObj = new Date(date);
        const dateISO = new Date(singleDateObj.getTime() - (singleDateObj.getTimezoneOffset() * 60000)).toISOString();

        await pb.collection('finances').create({
          user: userId,
          title: title,
          type: type,
          amount: numAmount,
          date: dateISO,
        });

        Swal.showSuccessToast("Data Keuangan Tersimpan! 💰");
      }

      onClose();
      setTimeout(() => { window.location.reload(); }, 700);

    } catch (error) {
      console.error("Gagal simpan finance:", error);
      Swal.showErrorToast("Gagal menyimpan data. Coba lagi.");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    mounted,
    isLoading,
    amount,
    setAmount,
    type,
    setType,
    title,
    setTitle,
    date,
    setDate,
    isRangeMode,
    setIsRangeMode,
    endDateStr,
    setEndDateStr,
    dateInputRef,
    endDateInputRef,
    handlePress,
    handleDivClick,
    handleEndDateDivClick,
    handleSave,
    formatCurrency
  };
};