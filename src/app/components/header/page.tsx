"use client";

import React, { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Bell, Cat, ChevronDown, LogOut, User as UserIcon, LogIn } from "lucide-react"; // Tambah Icon LogIn
import { AnimatePresence, motion } from "framer-motion";
import EditProfileModal from "@/app/components/modals/modalEditProfile/page"; 
import LoginModal from "@/app/auth/LoginModal"; // Import Login Modal
import RegisterModal from "@/app/auth/RegisterModal"; // Import Register Modal
import NotificationDropdown from "./dropdownNotification/page"; 
import { getProfile, ProfileData, logoutUser } from "@/services/profileService"; 
import { useSweetAlert } from "@/ui/SweetAlertProvider"; 

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const Swal = useSweetAlert();

  if (pathname === "/splash") return null;

  const defaultUser: ProfileData = {
    id: "",
    name: "Guest", // Ubah default jadi Guest
    phone: "",
    avatar: "",
    avatarUrl: "https://ui-avatars.com/api/?name=Guest&background=e2e8f0&color=64748b&bold=true",
  };

  const [user, setUser] = useState<ProfileData>(defaultUser);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false); // State Modal Login
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false); // State Modal Register
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  // Cek apakah user sudah login (punya ID valid)
  const isLoggedIn = user.id && user.id !== "";

  const fetchUserData = async () => {
    try {
      const data = await getProfile();
      if (data) {
        const displayAvatar = data.avatarUrl 
          ? data.avatarUrl 
          : `https://ui-avatars.com/api/?name=${encodeURIComponent(data.name)}&background=FF8FAB&color=fff&bold=true`;
        setUser({ ...data, avatarUrl: displayAvatar });
      } else {
        setUser(defaultUser);
      }
    } catch (error) {
      setUser(defaultUser);
    }
  };

  useEffect(() => {
    if (pathname !== "/splash") fetchUserData();
  }, [pathname]);

  const handleLogout = () => {
    Swal.showConfirm("Logout?", "Yakin ingin keluar?", () => {
      logoutUser();
      router.refresh();
      router.replace("/splash"); 
      setTimeout(() => {
          window.location.reload();
        }, 700); 
    });
  };

  return (
    <div className="relative z-40">
      <header className="flex h-20 items-center justify-between bg-[#F8BBD0] px-4 sm:px-6 py-4 text-slate-800 border-b border-white/50 shadow-sm font-sans relative">
        
        {/* LOGO */}
        <div className="flex items-center gap-3 ml-1 sm:ml-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FF8FAB] text-white shadow-sm">
            <Cat size={24} strokeWidth={2.5} />
          </div>
          <h1 className="text-lg sm:text-xl font-bold tracking-tight text-slate-700">
            Daily Meow
          </h1>
        </div>

        <div className="flex items-center gap-1 sm:gap-4">
          
          {/* NOTIFIKASI (Hanya jika Login) */}
          {isLoggedIn && (
            <div className="relative">
              <button
                onClick={() => { setIsNotifOpen(!isNotifOpen); setIsProfileMenuOpen(false); }}
                className={`relative rounded-full p-2 transition duration-200 ${
                  isNotifOpen ? "bg-white/40 text-pink-600" : "text-slate-700 hover:bg-white/20"
                }`}
              >
                <Bell size={22} strokeWidth={2} />
                <span className="absolute top-2 right-2 h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-[#F8BBD0] animate-pulse"></span>
              </button>
              <div className={`z-50 fixed top-24 left-1/2 -translate-x-1/2 w-[90vw] max-w-sm sm:absolute sm:top-full sm:right-0 sm:left-auto sm:translate-x-0 sm:w-80 sm:mt-2`}>
                <NotificationDropdown isOpen={isNotifOpen} onClose={() => setIsNotifOpen(false)} />
              </div>
            </div>
          )}

          {/* PROFILE DROPDOWN */}
          <div className="relative">
            <button
              onClick={() => { setIsProfileMenuOpen(!isProfileMenuOpen); setIsNotifOpen(false); }}
              className="flex items-center gap-2 sm:gap-3 p-1 pr-2 sm:pr-3 rounded-full hover:bg-white/30 transition border border-transparent hover:border-white/40 group"
            >
              <div className="h-9 w-9 sm:h-10 sm:w-10 overflow-hidden rounded-full border-2 border-white shadow-sm bg-slate-200">
                <img src={user.avatarUrl} alt="User" className="h-full w-full object-cover" 
                     onError={(e) => { (e.target as HTMLImageElement).src = defaultUser.avatarUrl; }} />
              </div>
              <div className="flex flex-col items-start text-left">
                <span className="text-xs sm:text-sm font-bold text-slate-800 leading-tight max-w-25 truncate">{user.name}</span>
                <span className="text-[9px] sm:text-[10px] font-medium text-slate-600">{isLoggedIn ? "User" : "Guest"}</span>
              </div>
              <ChevronDown size={13} className={`text-slate-500 transition-transform ${isProfileMenuOpen ? "rotate-180" : ""}`} />
            </button>

            {/* MENU DROPDOWN ISI */}
            <AnimatePresence>
              {isProfileMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute top-full right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-pink-100 overflow-hidden z-50 p-2"
                >
                  {isLoggedIn ? (
                    // --- MENU USER LOGIN ---
                    <>
                      <button 
                        onClick={() => { setIsEditModalOpen(true); setIsProfileMenuOpen(false); }}
                        className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-slate-600 hover:bg-pink-50 hover:text-pink-500 rounded-xl transition-colors text-left"
                      >
                        <UserIcon size={18} /> Edit Profil
                      </button>
                      <div className="h-px bg-slate-100 my-1 mx-2"></div>
                      <button 
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-red-500 hover:bg-red-50 rounded-xl transition-colors text-left"
                      >
                        <LogOut size={18} /> Logout
                      </button>
                    </>
                  ) : (
                    // --- MENU GUEST (LOGIN) ---
                    <button 
                        onClick={() => { setIsLoginModalOpen(true); setIsProfileMenuOpen(false); }}
                        className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-emerald-600 hover:bg-emerald-50 rounded-xl transition-colors text-left"
                      >
                        <LogIn size={18} /> Login
                    </button>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>
      </header>

      {/* --- MODALS --- */}
      <AnimatePresence>
        {isEditModalOpen && (
          <EditProfileModal
            isOpen={isEditModalOpen}
            onClose={() => setIsEditModalOpen(false)}
            userData={user} 
            onSuccess={fetchUserData} 
          />
        )}
        {/* Modal Login & Register (Jika User Guest ingin Login) */}
        {isLoginModalOpen && (
            <LoginModal 
                isOpen={isLoginModalOpen} 
                onClose={() => setIsLoginModalOpen(false)} 
                onSwitchToRegister={() => { setIsLoginModalOpen(false); setIsRegisterModalOpen(true); }}
            />
        )}
        {isRegisterModalOpen && (
            <RegisterModal 
                isOpen={isRegisterModalOpen} 
                onClose={() => setIsRegisterModalOpen(false)} 
                onSwitchToLogin={() => { setIsRegisterModalOpen(false); setIsLoginModalOpen(true); }}
            />
        )}
      </AnimatePresence>
    </div>
  );
}