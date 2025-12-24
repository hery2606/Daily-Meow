"use client";

import React from "react";

// Definisi Tipe Data untuk Props
export interface CalendarDayItem {
  date: number;
  isCurrentMonth: boolean;
  fullDate: Date;
}

interface GridCalendarProps {
  calendarData: CalendarDayItem[];
  selectedDate: Date | null;
  onDateClick: (date: Date) => void;
}

export default function GridCalendar({
  calendarData,
  selectedDate,
  onDateClick,
}: GridCalendarProps) {
  const daysOfWeek = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];

  // Helper Cek Hari Ini
  const isToday = (date: Date) => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  // Helper Cek Tanggal Terpilih
  const isSelected = (date: Date) => {
    if (!selectedDate) return false;
    return (
      date.getDate() === selectedDate.getDate() &&
      date.getMonth() === selectedDate.getMonth() &&
      date.getFullYear() === selectedDate.getFullYear()
    );
  };

  return (
    <div className="flex-1 flex flex-col min-h-0">
      {/* Header Nama Hari */}
      <div className="flex-none grid grid-cols-7 mb-2 text-center">
        {daysOfWeek.map((day) => (
          <div
            key={day}
            className="text-xs font-bold text-slate-600 tracking-widest opacity-80 py-1"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Grid Tanggal */}
      <div className="flex-1 grid grid-cols-7 grid-rows-6 gap-2 sm:gap-3">
        {calendarData.map((item, index) => {
          const isDateToday = isToday(item.fullDate);
          const isDateSelected = isSelected(item.fullDate);

          return (
            <div
              key={index}
              onClick={() => onDateClick(item.fullDate)}
              className={`
                relative flex flex-col justify-between p-2 sm:p-3 h-full w-full rounded-2xl transition-all shadow-sm cursor-pointer group border
                ${
                  isDateSelected
                    ? "bg-sky-100 border-sky-300 ring-2 ring-sky-200 scale-95"
                    : isDateToday
                    ? "bg-white border-pink-400 ring-2 ring-pink-300"
                    : item.isCurrentMonth
                    ? "bg-white/80 border-white/50 hover:bg-white hover:border-pink-200"
                    : "bg-pink-100/30 border-transparent text-slate-400/70 hover:bg-pink-100/50"
                }
              `}
            >
              {/* Angka Tanggal */}
              <span
                className={`text-sm sm:text-base lg:text-lg font-bold ${
                  isDateSelected || isDateToday
                    ? "text-slate-800"
                    : "text-slate-600"
                }`}
              >
                {item.date}
              </span>

              {/* Indikator "Hari Ini" */}
              {isDateToday && !isDateSelected && (
                <span className="absolute top-3 right-3 h-2 w-2 bg-pink-500 rounded-full ring-2 ring-pink-200 animate-pulse"></span>
              )}

              {/* --- BAGIAN ICON (🍩 & 🪙) --- */}
              {/* items-center & justify-center memastikan posisi di tengah */}
              <div className="flex gap-1 items-left justify-left mt-auto  pb-1 text-2xl sm:text-lg">
                
                {/* Dummy Logic: Tampilkan Donut (Aktivitas) pada tanggal ganjil */}
                {item.isCurrentMonth && item.date % 2 !== 0 && (
                   <span className="text-xs sm:text-lg filter drop-shadow-sm" title="Activity">
                     🍩
                   </span>
                )}

                {/* Dummy Logic: Tampilkan Coin (Finance) pada tanggal kelipatan 3 */}
                {item.isCurrentMonth && item.date % 5 === 0 && (
                   <span className="text-xs sm:text-lg filter drop-shadow-sm" title="Finance">
                     🪙
                   </span>
                )}

              </div>

              {/* Hover Effect 'View' */}
              {item.isCurrentMonth && (
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                  <span className="bg-black/5 text-slate-700 text-xs font-bold px-2 py-1 rounded-full backdrop-blur-sm">
                    View
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}