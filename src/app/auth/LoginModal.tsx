"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { User, Lock, LogIn, Cat, X } from "lucide-react";
import { useSweetAlert } from "@/ui/SweetAlertProvider";
import { loginUser } from "@/services/profileService";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToRegister: () => void;
  onSuccess?: () => void; 
}

export default function LoginModal({ isOpen, onClose, onSwitchToRegister, onSuccess }: LoginModalProps) {
  const router = useRouter();
  const Swal = useSweetAlert();
  const [mounted, setMounted] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
          window.location.reload();
        }, 700); 

    try {
      const record = await loginUser(username, password);
      
      Swal.showSuccessToast(`Welcome back, ${record.user}! 🐱`);
      
      if (onSuccess) {
        onSuccess();
      } else {
        router.push("/home");
      }
      
      onClose();
      // setTimeout(() => window.location.reload(), 500); // Opsional

    } catch (error) {
      console.error(error);
      Swal.showErrorToast("Username atau Password salah!");
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
              <div className="h-14 w-14 bg-pink-400 rounded-2xl flex items-center justify-center text-white shadow-lg mb-4 rotate-3">
                <Cat size={28} />
              </div>
              <h2 className="text-2xl font-bold text-slate-800">Hello Again!</h2>
              <p className="text-slate-500 text-sm mb-6">Login ke Profile Kamu</p>

              <form onSubmit={handleLogin} className="w-full space-y-4">
                {/* Input Username */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 ml-1">Username</label>
                  <div className="relative group">
                    <User className="absolute left-4 top-3.5 text-slate-400 group-focus-within:text-pink-500 transition-colors" size={18} />
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 pl-12 pr-4 text-sm font-semibold text-slate-700 outline-none focus:border-pink-300 focus:ring-4 focus:ring-pink-100 transition-all"
                      placeholder="Isi field 'user'"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 ml-1">Password</label>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-3.5 text-slate-400 group-focus-within:text-pink-500 transition-colors" size={18} />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 pl-12 pr-4 text-sm font-semibold text-slate-700 outline-none focus:border-pink-300 focus:ring-4 focus:ring-pink-100 transition-all"
                      placeholder="Isi field 'Password'"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3.5 rounded-2xl shadow-lg shadow-slate-300 active:scale-95 transition-all flex items-center justify-center gap-2 mt-4 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isLoading ? "Masuk..." : <>Masuk <LogIn size={18} /></>}
                </button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-xs text-slate-500 font-medium">
                  Belum punya profile?{" "}
                  <button onClick={onSwitchToRegister} className="text-pink-600 font-bold hover:underline">
                    Buat Baru
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