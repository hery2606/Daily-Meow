"use client";

import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import GridCalendar from "./components/Girdcalendar";
import DetailCalendarModal from "./components/detailcalendarmodal";
import {
  X,
  User,
  Phone,
  Camera,
  Save,
  PawPrint,
  Star,
  Sparkles,
  Heart,
} from "lucide-react";
import { motion } from "framer-motion";

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  // --- LOGIC GENERATE DATA KALENDER ---
  const getCalendarDays = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDayOfMonth = new Date(year, month, 1);
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const startDayIndex = (firstDayOfMonth.getDay() + 6) % 7;
    const calendarData = [];

    // Hari bulan sebelumnya
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = startDayIndex; i > 0; i--) {
      calendarData.push({
        date: prevMonthLastDay - i + 1,
        isCurrentMonth: false,
        fullDate: new Date(year, month - 1, prevMonthLastDay - i + 1),
      });
    }

    // Hari bulan ini
    for (let i = 1; i <= daysInMonth; i++) {
      calendarData.push({
        date: i,
        isCurrentMonth: true,
        fullDate: new Date(year, month, i),
      });
    }

    // Hari bulan berikutnya (Isi sisa grid agar genap 42 kotak)
    const remainingSlots = 42 - calendarData.length;
    for (let i = 1; i <= remainingSlots; i++) {
      calendarData.push({
        date: i,
        isCurrentMonth: false,
        fullDate: new Date(year, month + 1, i),
      });
    }
    return calendarData;
  };

  const calendarData = getCalendarDays(currentDate);

  // --- HANDLERS ---
  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    setIsDetailModalOpen(true);
  };

  const prevMonth = () =>
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  const nextMonth = () =>
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));

  return (
    // CONTAINER UTAMA: Full Screen, Padding standar (p-4)
    <div className="w-full h-screen max-h-screen  p-4 flex flex-col font-sans ">
      
      {/* GLASS CARD CONTAINER */}
      <div className="w-full h-full flex flex-col bg-pink-400/20 backdrop-blur-3xl rounded-3xl shadow-2xl border border-white/20 p-5 sm:p-6 overflow-hidden relative">

        {/* PawPrint background decoration */}
        <PawPrint
          size={180}
          className="absolute pointer-events-none select-none text-purple-300"
          style={{
            top: "12%",
            left: "10%",
            transform: "rotate(-18deg)",
            opacity: 1.30,
            zIndex: 0,
          }}
        />
        <PawPrint
          size={200}
          className="absolute pointer-events-none select-none text-purple-300"
          style={{
            top: "55%",
            left: "22%",
            transform: "rotate(12deg)",
            opacity: 1.0,
            zIndex: 0,
          }}
        />
        <PawPrint
          size={230}
          className="absolute pointer-events-none select-none text-purple-300"
          style={{
            top: "30%",
            left: "70%",
            transform: "rotate(24deg)",
            opacity: 1.30,
            zIndex: 0,
          }}
        />
        <PawPrint
          size={230}
          className="absolute pointer-events-none select-none text-purple-300"
          style={{
            top: "80%",
            left: "70%",
            transform: "rotate(4deg)",
            opacity: 1.30,
            zIndex: 0,
          }}
        />
        {/* Header Navigasi Bulan & Tahun */}
        <div className="flex-none flex items-center justify-between mb-4 px-1">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 tracking-tight">
              {currentDate.toLocaleDateString("id-ID", { month: "long" })}
            </h2>
            <p className="text-slate-600 text-sm font-medium">
              {currentDate.getFullYear()}
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={prevMonth}
              className="p-2 bg-white/60 rounded-full hover:bg-white text-slate-700 shadow-sm transition active:scale-95"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={nextMonth}
              className="p-2 bg-white/60 rounded-full hover:bg-white text-slate-700 shadow-sm transition active:scale-95"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        {/* Panggil Komponen Grid Calendar */}
        <GridCalendar
          calendarData={calendarData}
          selectedDate={selectedDate}
          onDateClick={handleDateClick}
        />
        
      </div>

      {/* Modal Detail */}
      <DetailCalendarModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        selectedDate={selectedDate}
      />

      
    </div>
  );
}