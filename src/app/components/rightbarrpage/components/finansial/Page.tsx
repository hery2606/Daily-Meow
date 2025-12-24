"use client";

import React, { useState } from "react";
import { Plus, TrendingUp, TrendingDown, DollarSign } from "lucide-react";
import { AnimatePresence } from "framer-motion";

import FinanceModal from "../../modals/addfinance/FinanceModal";

export default function FinanceView() {
  const transactions = [
    {
      id: 1,
      title: "Monthly Allowance",
      amount: "+$500.00",
      type: "income",
      date: "Today",
    },
    {
      id: 2,
      title: "Spotify Premium",
      amount: "-$9.99",
      type: "expense",
      date: "Yesterday",
    },
    {
      id: 3,
      title: "Cat Food Stock",
      amount: "-$24.50",
      type: "expense",
      date: "Yesterday",
    },
  ];

  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="animate-in fade-in slide-in-from-right-4 duration-300">
      {/* Header Actions */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold">Finance Log</h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-1 bg-emerald-300 hover:bg-emerald-400 text-emerald-900 text-xs font-bold px-4 py-2 rounded-full shadow-sm transition-transform active:scale-95"
        >
          <Plus size={14} />
          Catat
        </button>
      </div>

      {/* Balance Card */}
      <div className="bg-linear-to-br from-purple-500 to-pink-500 p-5 rounded-2xl text-white shadow-md mb-6 relative overflow-hidden">
        <div className="relative z-10">
          <p className="text-xs font-medium opacity-90 mb-1">Total Balance</p>
          <h1 className="text-3xl font-bold">$1,250.00</h1>
        </div>
        <DollarSign className="absolute -right-4 -bottom-4 text-white/20 h-32 w-32" />
      </div>

      {/* Recent Transactions */}
      <h3 className="text-sm font-bold text-slate-700 mb-3">
        Recent Transactions
      </h3>
      <div className="space-y-3">
        {transactions.map((t) => (
          <div
            key={t.id}
            className="bg-white p-4 rounded-xl shadow-sm flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div
                className={`h-10 w-10 rounded-full flex items-center justify-center ${
                  t.type === "income"
                    ? "bg-green-100 text-green-600"
                    : "bg-red-100 text-red-500"
                }`}
              >
                {t.type === "income" ? (
                  <TrendingUp size={18} />
                ) : (
                  <TrendingDown size={18} />
                )}
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-800">{t.title}</h4>
                <p className="text-[10px] text-slate-500">{t.date}</p>
              </div>
            </div>
            <span
              className={`text-sm font-bold ${
                t.type === "income" ? "text-green-600" : "text-red-500"
              }`}
            >
              {t.amount}
            </span>
          </div>
        ))}
      </div>
      {/* 5. RENDER MODAL: Bungkus dengan AnimatePresence */}
            <AnimatePresence>
              {isModalOpen && (
                <FinanceModal
                  isOpen={isModalOpen}
                  onClose={() => setIsModalOpen(false)}
                  selectedDate={new Date()} 
                />
              )}
            </AnimatePresence>
    </div>
  );
}
