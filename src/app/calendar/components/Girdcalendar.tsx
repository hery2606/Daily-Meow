"use client";

import { MonthlyMarkers } from "@/services/dailyService";

export interface CalendarDayItem {
  date: number;
  isCurrentMonth: boolean;
  fullDate: Date;
}

interface GridCalendarProps {
  calendarData: CalendarDayItem[];
  selectedDate: Date | null;
  onDateClick: (date: Date) => void;
  markers: MonthlyMarkers;
}

export default function GridCalendar({
  calendarData,
  selectedDate,
  onDateClick,
  markers,
}: GridCalendarProps) {
  const daysOfWeek = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];

  const isToday = (date: Date) => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  const isSelected = (date: Date) => {
    if (!selectedDate) return false;
    return (
      date.getDate() === selectedDate.getDate() &&
      date.getMonth() === selectedDate.getMonth() &&
      date.getFullYear() === selectedDate.getFullYear()
    );
  };

  const toDateKey = (date: Date) => {
    const offset = date.getTimezoneOffset() * 60000;
    return new Date(date.getTime() - offset).toISOString().split('T')[0];
  };

  const getBorderStyle = (
    isDateSelected: boolean, 
    isDateToday: boolean, 
    activityColors: string[] = []
  ) => {
    if (isDateSelected) return "bg-sky-100 border-sky-500 ring-2 ring-sky-300 border-2";
    if (isDateToday) return "bg-white border-pink-500 ring-1 sm:ring-2 ring-pink-200 border-2";
    if (activityColors.length > 0) {
      const color = activityColors[0];
      switch (color) {
        case "pink": return "bg-pink-100 border-pink-400 border-2 ring-pink-200 ring-2";
        case "blue": return "bg-sky-100 border-sky-400 ring-2 ring-sky-200 border-2";
        case "yellow": return "bg-amber-50 border-amber-500 border-2 text-amber-600";
        case "green": return "bg-emerald-50 border-emerald-500 border-2 text-emerald-600";
        default: return "bg-slate-50 border-slate-300 border-2";
      }
    }
    return "bg-white/80 border-white/50 hover:bg-white hover:border-pink-200 border";
  };

  return (
    <div className="flex-1 flex flex-col min-h-0">
      <div className="flex-none grid grid-cols-7 mb-1 sm:mb-2 text-center">
        {daysOfWeek.map((day) => (
          <div key={day} className="text-[10px] sm:text-xs font-bold text-slate-600 tracking-widest opacity-80 py-1">
            {day}
          </div>
        ))}
      </div>

  
      <div className="flex-1 grid grid-cols-7 grid-rows-6 gap-1 sm:gap-2 md:gap-3 ">
        {calendarData.map((item, index) => {
          const isDateToday = isToday(item.fullDate);
          const isDateSelected = isSelected(item.fullDate);
          const dateKey = toDateKey(item.fullDate);
          const dayMarker = markers[dateKey];
          const hasActivity = dayMarker?.hasActivity; 
          const hasFinance = dayMarker?.hasFinance;   
          const activityColors = dayMarker?.activityColors || []; 

          return (
            <div
              key={index}
              onClick={() => onDateClick(item.fullDate)}
              className={`
                relative flex flex-col justify-between p-1 sm:p-2 md:p-3 h-full w-full rounded-xl sm:rounded-2xl transition-all shadow-sm cursor-pointer group
                ${
                  !item.isCurrentMonth 
                    ? "bg-pink-50/30 border border-transparent text-slate-400 hover:bg-pink-50/50" 
                    : getBorderStyle(isDateSelected, isDateToday, activityColors)
                }
                ${isDateSelected ? "scale-95" : ""}
              `}
            >
              <span className="text-xs sm:text-sm md:text-base lg:text-lg font-bold leading-none">
                {item.date}
              </span>

              {isDateToday && !isDateSelected && (
                <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 bg-pink-500 rounded-full animate-pulse"></span>
              )}

              <div className="flex flex-wrap gap-0.5 sm:gap-1 items-end justify-start mt-auto pb-0 sm:pb-1">
                
                {item.isCurrentMonth && hasActivity && (
                   <span className="text-[10px] sm:text-xs md:text-sm filter drop-shadow-sm leading-none" title="Ada Aktivitas">
                     🍩
                   </span>
                )}

                {item.isCurrentMonth && hasFinance && (
                   <span className="text-[10px] sm:text-xs md:text-sm filter drop-shadow-sm leading-none grayscale-[0.2]" title="Ada Transaksi">
                     🪙
                   </span>
                )}
              </div>

              {item.isCurrentMonth && (
                <div className="hidden sm:flex absolute inset-0 items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                  <span className="bg-black/5 text-slate-700 text-[10px] sm:text-xs font-bold px-2 py-1 rounded-full backdrop-blur-sm">
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