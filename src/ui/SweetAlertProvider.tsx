"use client";

import React, { createContext, useContext, ReactNode } from "react";
import Swal, { SweetAlertOptions, SweetAlertResult } from "sweetalert2";

// Definisi tipe fungsi yang bisa dipanggil
interface SweetAlertContextType {
  showErrorToast(arg0: string): unknown;
  showSuccessToast: (title: string) => void;
  showCustomModal: () => void;
  showError: (title: string, text: string) => void;
  showAlert: (options: SweetAlertOptions) => Promise<SweetAlertResult>;
  showConfirm: (title: string,text: string,onConfirm: () => void) => void;
}

const SweetAlertContext = createContext<SweetAlertContextType | undefined>(
  undefined
);

// --- KONFIGURASI TEMA PINK ---
// Kita menggunakan Mixin agar semua alert default-nya bertema Pink Muda
const MySwal = Swal.mixin({
  // Background pink muda lembut
  background: "FF0000", 
 // tailwind pink-500: #ec4899
  // Warna font slate-800 agar kontras
  color: "FF0000", 
  // Tombol confirm warna Pink Utama aplikasi
  confirmButtonColor: "#FF8FAB", 
  // Tombol cancel warna abu-abu
  cancelButtonColor: "#cbd5e1",
  // Styling tombol custom (opsional, agar rounded)
  customClass: {
    popup: "rounded-[60px]", // Membuat sudut modal tumpul estetik
    confirmButton: "rounded-xl px-6 py-2 font-bold",
    cancelButton: "rounded-xl px-6 py-2 font-bold",
  },
});

export const SweetAlertProvider = ({ children }: { children: ReactNode }) => {
  
  // 1. Success Toast (Top End)
  const showSuccessToast = (title: string) => {
    MySwal.fire({
      position: "center",
      icon: "success",
      title: title,
      showConfirmButton: false,
      timer: 1500,
      toast: false, // Menambahkan mode toast agar lebih kecil & rapi
    });
  };

  // 1a. Error Toast (Top End)
  const showErrorToast = (title: string) => {
    MySwal.fire({
      position: "center",
      icon: "error",
      title: title,
      showConfirmButton: false,
      timer: 1500,
      toast: false,
    });
  };

  // 2. Custom Width & Backdrop (Nyan Cat Example)
  const showCustomModal = () => {
    // Note: Untuk background image ini bekerja, pastikan kamu punya file gambar
    // di folder public/images/trees.png dan public/images/nyan-cat.gif
    // Atau hapus properti background/backdrop jika tidak ada gambar.
    MySwal.fire({
      title: "Custom width, padding, color, background.",
      width: 600,
      padding: "3em",
      color: "#716add",
      background: "#fff url(/images/trees.png)", 
      backdrop: `
        rgba(0,0,123,0.4)
        url("/images/nyan-cat.gif")
        left top
        no-repeat
      `,
    });
  };

  // 3. Error Modal (Oops...)
  const showError = (title: string, text: string) => {
    MySwal.fire({
      icon: "error",
      title: title,
      text: text,
      footer: '<a href="#" style="color: #FF8FAB">Why do I have this issue?</a>',
    });
  };

  // 4. Generic Alert (Untuk Kondisi Lain yang fleksibel)
  const showAlert = (options: SweetAlertOptions) => {
    return MySwal.fire(options);
  };

  // 5. Confirm Dialog (Sering dipakai untuk Hapus Data)
  const showConfirm = (title: string, text: string, onConfirm: () => void) => {
    MySwal.fire({
      title: title,
      text: text,
      icon: "warning",
      iconColor: "#ef4444", // merah (tailwind red-500)
      showCancelButton: true,
      confirmButtonText: "Ya, Lanjutkan!",
      cancelButtonText: "Batal",
      cancelButtonColor: "#6b7280", // abu-abu (tailwind gray-500)
      reverseButtons: true,
      confirmButtonColor: "#ef4444", // tombol konfirmasi merah
    }).then((result) => {
      if (result.isConfirmed) {
        onConfirm();
      }
    });
  };

  return (
    <SweetAlertContext.Provider
      value={{ 
        showErrorToast,
        showSuccessToast, 
        showCustomModal, 
        showError, 
        showAlert, 
        showConfirm 
    }}
    >
      {children}
    </SweetAlertContext.Provider>
  );
};

// Hook kustom untuk mempermudah penggunaan
export const useSweetAlert = () => {
  const context = useContext(SweetAlertContext);
  if (!context) {
    throw new Error("useSweetAlert must be used within a SweetAlertProvider");
  }
  return context;
};