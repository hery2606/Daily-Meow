"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createPortal } from "react-dom"; 
import { motion, AnimatePresence } from "framer-motion";
import { Cat, PawPrint, UserCheck, UserPlus } from "lucide-react";
import { pb } from "@/lib/pocketbase";
import LoginModal from "@/app/auth/LoginModal";
import RegisterModal from "@/app/auth/RegisterModal";

export default function SplashScreen() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [paws, setPaws] = useState<{ id: number; x: number; y: number; delay: number; rotate: number }[]>([]);
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");

  useEffect(() => {
    setMounted(true); 
    const randomPaws = Array.from({ length: 8 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 2,
      rotate: Math.random() * 360,
    }));
    setPaws(randomPaws);

    const checkAuth = () => {
        if (pb.authStore.isValid && pb.authStore.model) {
            setIsLoggedIn(true);
            setUserName(pb.authStore.model.name || "User");
        } else {
            setIsLoggedIn(false);
        }
    };
    checkAuth();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((old) => {
        if (old >= 100) {
          clearInterval(timer);
          setIsLoaded(true);
          return 100;
        }
        return Math.min(old + (Math.random() * 10), 100);
      });
    }, 200);
    return () => clearInterval(timer);
  }, []);

  const handleMainButton = () => {
    if (isLoggedIn) {
        router.push("/home");
    } else {
        setShowRegister(true);
    }
  };

  if (!mounted) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-linear-to-br from-[#FF9A9E] via-[#FECFEF] to-[#F8BBD0] overflow-hidden font-sans">
      {paws.map((paw) => (
        <motion.div
          key={paw.id}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: [0, 0.4, 0], scale: [0.5, 1, 0.5], y: -50 }}
          transition={{ duration: 4, repeat: Infinity, delay: paw.delay, ease: "easeInOut" }}
          style={{ position: "absolute", left: `${paw.x}%`, top: `${paw.y}%`, rotate: paw.rotate }}
          className="text-white pointer-events-none"
        >
          <PawPrint size={60} />
        </motion.div>
      ))}

      <div className="relative z-10 flex flex-col items-center">
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 20, duration: 1.5 }}
          className="relative mb-6"
        >
          <div className="w-40 h-40 bg-white/30 backdrop-blur-md rounded-full flex items-center justify-center shadow-2xl border-4 border-white/50 relative">
             <Cat size={80} className="text-white drop-shadow-md" strokeWidth={2.5} />
             <motion.div animate={{ rotate: [0, 10, -10, 0] }} transition={{ repeat: Infinity, duration: 2 }} className="absolute -top-2 -right-2 text-yellow-300">
                ✨
             </motion.div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-extrabold text-white tracking-wide drop-shadow-sm mb-2">
            Daily Meow
          </h1>
          <p className="text-white/80 text-sm font-medium tracking-widest uppercase">
            {isLoggedIn ? `Welcome back, ${userName}!` : "Organize with Cuteness"}
          </p>
        </motion.div>

        <div className="h-16 flex items-center justify-center min-w-60">
          {!isLoaded ? (
            <div className="w-full flex flex-col items-center">
              <div className="w-60 h-2 bg-white/30 rounded-full overflow-hidden relative">
                <motion.div
                  className="h-full bg-white rounded-full shadow-[0_0_10px_rgba(255,255,255,0.8)]"
                  initial={{ width: "0%" }}
                  animate={{ width: `${progress}%` }}
                  transition={{ ease: "linear" }}
                />
              </div>
              <motion.p className="text-white/90 text-xs font-bold mt-3" animate={{ opacity: [0.5, 1, 0.5] }} transition={{ repeat: Infinity, duration: 1.5 }}>
                Loading {Math.round(progress)}%...
              </motion.p>
            </div>
          ) : (
            <motion.button
              initial={{ opacity: 0, scale: 0.8, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleMainButton}
              className={`
                font-bold py-3 px-8 rounded-full shadow-lg flex items-center gap-2 transition-all
                ${isLoggedIn 
                    ? "bg-white text-purple-600 hover:bg-purple-50" 
                    : "bg-pink-500 text-white hover:bg-pink-600 border-2 border-white/50" 
                }
              `}
            >
              {isLoggedIn ? (
                  <> <UserCheck size={20} /> Lanjut ke Home </>
              ) : (
                  <> <UserPlus size={20} /> Mulai Sekarang </>
              )}
            </motion.button>
          )}
        </div>
        {!isLoggedIn && isLoaded && (
            <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                onClick={() => setShowLogin(true)}
                className="mt-6 text-white/80 text-sm font-medium hover:text-white hover:underline transition-all"
            >
                Sudah punya akun? Login
            </motion.button>
        )}

      </div>

      <AnimatePresence>
        {showLogin && (
            <LoginModal 
                isOpen={showLogin} 
                onClose={() => setShowLogin(false)} 
                onSwitchToRegister={() => { setShowLogin(false); setShowRegister(true); }}
            />
        )}
        {showRegister && (
            <RegisterModal 
                isOpen={showRegister} 
                onClose={() => setShowRegister(false)} 
                onSwitchToLogin={() => { setShowRegister(false); setShowLogin(true); }}
            />
        )}
      </AnimatePresence>

    </div>,
    document.body 
  );
}