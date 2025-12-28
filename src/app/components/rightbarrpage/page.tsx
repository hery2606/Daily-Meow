"use client";

import React, { useState } from "react";
import ActivitiesView from "./components/aktivitas/page";
import FinanceView from "./components/finansial/Page";
import RecapView from "./components/rekap/Page";
import InsightView from "./components/insight/page";
import { PawPrint, Star, Heart, Cloud, Sparkles } from "lucide-react";
export default function RightBarPage() {
  const [activeTab, setActiveTab] = useState<"Activities" | "Finance" | "Recap" | "Insight">("Activities");

  return (
    <div className="bg-[#F8BBD0] p-6 font-sans rounded-[35px] text-slate-800 shadow-xl relative overflow-hidden transition-all hover:shadow-2xl hover:shadow-pink-200/50 w-full">

      <div className="absolute -top-6 -right-6 text-white/20 rotate-20 pointer-events-none">
         <PawPrint size={140} />
      </div>
      <div className="absolute -top-20 -left-20 w-64 h-64 bg-white/20 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-32 -left-4 text-white/30 pointer-events-none animate-bounce duration-3000">
         <Cloud size={60} fill="currentColor" />
      </div>
      <div className="absolute top-20 right-8 text-yellow-200/50 rotate-12 pointer-events-none">
         <Star size={24} fill="currentColor" />
      </div>
      <div className="absolute bottom-10 right-10 text-rose-400/20 -rotate-12 pointer-events-none">
         <Heart size={40} fill="currentColor" />
      </div>
      <div className="absolute top-1/2 left-4 text-sky-200/60 animate-pulse pointer-events-none">
         <Sparkles size={18} />
      </div>

      <div className="relative z-10">      
        <div className="flex gap-4 mb-6 border-b border-pink-300/40 pb-1 overflow-x-auto scrollbar-none">
          {["Activities", "Finance", "Recap", "Insight"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`pb-2 text-sm font-bold transition-all relative shrink-0 ${
                activeTab === tab
                  ? "text-slate-900 scale-105"
                  : "text-slate-600 hover:text-slate-800"
              }`}
            >
              {tab}
              {activeTab === tab && (
                <span className="absolute bottom-0 left-0 w-full h-0.75 bg-pink-600 rounded-t-full shadow-[0_2px_8px_rgba(219,39,119,0.6)]" />
              )}
            </button>
          ))}
        </div>

        <div className="min-h-75">
          {activeTab === "Activities" && <ActivitiesView />}
          {activeTab === "Finance" && <FinanceView />}
          {activeTab === "Recap" && <RecapView />}
          {activeTab === "Insight" && <InsightView />}
        </div> 
      </div>
    </div>
  );
}