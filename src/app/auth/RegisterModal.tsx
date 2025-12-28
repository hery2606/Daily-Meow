"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom"; // Import createPortal
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Phone, Lock, User, ArrowRight, Cat, X } from "lucide-react";
import { useSweetAlert } from "@/ui/SweetAlertProvider";
import { registerUser } from "@/services/profileService";

interface RegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToLogin: () => void;
}

export default function RegisterModal({ isOpen, onClose, onSwitchToLogin }: RegisterModalProps) {
  const router = useRouter();
  const Swal = useSweetAlert();

  // State untuk Portal
  const [mounted, setMounted] = useState(false);

  const [username, setUsername] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== passwordConfirm) {
      Swal.showErrorToast("Password tidak sama!");
      return;
    }
    
    if (isNaN(Number(phone))) {
       Swal.showErrorToast("Nomor HP harus angka!");
       return;
    }

    setIsLoading(true);

    try {
      await registerUser({
          user: username,
          phone: phone,
          Password: password 
      });

      Swal.showSuccessToast("Profile berhasil dibuat!");
      router.push("/home");
      onClose();
      
       setTimeout(() => {
          window.location.reload();
        }, 700); 

    } catch (error) {
      console.error(error);
      Swal.showErrorToast("Gagal membuat profile. Username mungkin sudah ada?");
    } finally {
      setIsLoading(false);
    }
  };

  if (!mounted) return null;

  const modalContent = (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 font-sans">
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            onClick={onClose}
            className="absolute inset-0"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="w-full max-w-md bg-white/95 backdrop-blur-xl rounded-[30px] shadow-2xl border border-white/50 p-8 relative overflow-hidden z-10"
          >
             <button onClick={onClose} className="absolute top-4 right-4 p-2 rounded-full bg-slate-100 hover:bg-slate-200 transition">
                <X size={20} className="text-slate-500"/>
            </button>

             <div className="relative z-10 flex flex-col items-center">
                <div className="mb-2">
                    <Cat size={40} className="text-purple-500" />
                </div>
                <h2 className="text-2xl font-bold text-slate-800">Buat Profile</h2>
                <p className="text-slate-500 text-sm mb-6">Simpan ke collection 'Profile'</p>

                <form onSubmit={handleRegister} className="w-full space-y-3">
                     <div className="relative group">
                        <User className="absolute left-4 top-3.5 text-slate-400 group-focus-within:text-purple-500 transition-colors" size={18} />
                        <input type="text" value={username} onChange={(e) => setUsername(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 pl-12 pr-4 text-sm font-semibold text-slate-700 outline-none focus:border-purple-300 focus:ring-4 focus:ring-purple-100 transition-all"
                          placeholder="Username (field: user)" required
                        />
                     </div>
                     <div className="relative group">
                        <Phone className="absolute left-4 top-3.5 text-slate-400 group-focus-within:text-purple-500 transition-colors" size={18} />
                        <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 pl-12 pr-4 text-sm font-semibold text-slate-700 outline-none focus:border-purple-300 focus:ring-4 focus:ring-purple-100 transition-all"
                          placeholder="Nomor HP (field: phone)" required
                        />
                     </div>

                     <div className="relative group">
                        <Lock className="absolute left-4 top-3.5 text-slate-400 group-focus-within:text-purple-500 transition-colors" size={18} />
                        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 pl-12 pr-4 text-sm font-semibold text-slate-700 outline-none focus:border-purple-300 focus:ring-4 focus:ring-purple-100 transition-all"
                          placeholder="Password" required
                        />
                     </div>

                     <div className="relative group">
                        <Lock className="absolute left-4 top-3.5 text-slate-400 group-focus-within:text-purple-500 transition-colors" size={18} />
                        <input type="password" value={passwordConfirm} onChange={(e) => setPasswordConfirm(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 pl-12 pr-4 text-sm font-semibold text-slate-700 outline-none focus:border-purple-300 focus:ring-4 focus:ring-purple-100 transition-all"
                          placeholder="Konfirmasi Password" required
                        />
                     </div>

                     <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3.5 rounded-2xl shadow-lg shadow-purple-200 active:scale-95 transition-all flex items-center justify-center gap-2 mt-2 disabled:opacity-70"
                     >
                        {isLoading ? "Membuat..." : <>Simpan <ArrowRight size={18}/></>}
                     </button>
                </form>

                <div className="mt-6 text-center">
                    <p className="text-xs text-slate-500 font-medium">
                    Sudah punya profile?{" "}
                    <button onClick={onSwitchToLogin} className="text-purple-600 font-bold hover:underline">
                        Login disini
                    </button>
                    </p>
                </div>
             </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );

  return createPortal(modalContent, document.body);
}