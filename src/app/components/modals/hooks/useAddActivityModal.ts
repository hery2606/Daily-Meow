import { useState, useEffect, useRef } from "react";
import { createActivity } from "@/services/dailyService";
import { useSweetAlert } from "@/ui/SweetAlertProvider";

export interface AddActivityModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDate: Date | null;
}

export const useAddActivityModal = ({ isOpen, onClose, selectedDate }: AddActivityModalProps) => {
  const Swal = useSweetAlert();
  const [mounted, setMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const dateInputRef = useRef<HTMLInputElement>(null);
  const timeInputRef = useRef<HTMLInputElement>(null);

  const [title, setTitle] = useState("");
  const [inputDate, setInputDate] = useState("");
  const [time, setTime] = useState("");
  const [notes, setNotes] = useState("");
  const [selectedColor, setSelectedColor] = useState<string>("pink");

  const colorOptions = [
    { id: "pink", bg: "bg-pink-300", ring: "ring-pink-400", label: "Pink" },
    { id: "blue", bg: "bg-blue-300", ring: "ring-blue-400", label: "Blue" },
    { id: "yellow", bg: "bg-amber-200", ring: "ring-amber-400", label: "Yellow" },
    { id: "green", bg: "bg-emerald-300", ring: "ring-emerald-400", label: "Green" },
  ];

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
      if (selectedDate) {
        const offset = selectedDate.getTimezoneOffset() * 60000;
        const localDate = new Date(selectedDate.getTime() - offset).toISOString().split('T')[0];
        setInputDate(localDate);
      } else {
        setInputDate("");
      }
      
      setTitle("");
      setTime("09:00"); 
      setNotes("");
      setSelectedColor("pink");
    }
  }, [isOpen, selectedDate]);

  const handleDateClick = () => {
    if (dateInputRef.current) {
      try { dateInputRef.current.showPicker(); } 
      catch (e) { dateInputRef.current.focus(); }
    }
  };

  const handleTimeClick = () => {
    if (timeInputRef.current) {
      try { timeInputRef.current.showPicker(); } 
      catch (e) { timeInputRef.current.focus(); }
    }
  };

  const handleSaveActivity = async () => {
    if (!title.trim()) return Swal.showErrorToast("Isi nama aktivitas dulu! 📝");
    if (!inputDate) return Swal.showErrorToast("Tanggal belum dipilih 📅");

    const userId = localStorage.getItem("meow_user_id");
    if (!userId) return Swal.showErrorToast("Login dulu ya! 🔒");

    setIsLoading(true);

    try {
      await createActivity({
        user: userId,
        title: title,
        date: new Date(inputDate).toISOString(),
        time: time || "00:00",
        color: selectedColor,
        notes: notes,
        is_completed: false
      });

      Swal.showSuccessToast("Aktivitas tersimpan! 🍩");
      onClose();
      
      setTimeout(() => {
          window.location.reload();
      }, 700);

    } catch (error) {
      console.error(error);
      Swal.showErrorToast("Gagal menyimpan. Coba lagi!");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    mounted,
    isLoading,
    title, setTitle,
    inputDate, setInputDate,
    time, setTime,
    notes, setNotes,
    selectedColor, setSelectedColor,
    colorOptions,
    dateInputRef,
    timeInputRef,
    handleDateClick,
    handleTimeClick,
    handleSaveActivity
  };
};