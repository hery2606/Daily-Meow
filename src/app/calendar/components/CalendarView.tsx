"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, PawPrint } from "lucide-react";
import GridCalendar, { CalendarDayItem } from "./Girdcalendar";
import DetailCalendarModal from "../../components/modals/detailcalendarmodal/page";
import { getMonthlyMarkers, MonthlyMarkers } from "@/services/dailyService";
import { getProfile, ProfileData } from "@/services/profileService";
import { useSweetAlert } from "@/ui/SweetAlertProvider";

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [markers, setMarkers] = useState<MonthlyMarkers>({});
  const [userProfile, setUserProfile] = useState<ProfileData | null>(null);
  
  const Swal = useSweetAlert();

  useEffect(() => {
    const loadUser = async () => {
        const profile = await getProfile();
        setUserProfile(profile);
    };
    loadUser();
  }, []);

  useEffect(() => {
    const fetchMarkers = async () => {
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth();
      
      const data = await getMonthlyMarkers(year, month, userProfile?.id);
      setMarkers(data);
    };

    fetchMarkers();
  }, [currentDate, userProfile]);

  const getCalendarDays = (date: Date): CalendarDayItem[] => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDayOfMonth = new Date(year, month, 1);
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const startDayIndex = (firstDayOfMonth.getDay() + 6) % 7;
    const calendarData: CalendarDayItem[] = [];

    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = startDayIndex; i > 0; i--) {
      calendarData.push({
        date: prevMonthLastDay - i + 1,
        isCurrentMonth: false,
        fullDate: new Date(year, month - 1, prevMonthLastDay - i + 1),
      });
    }

    for (let i = 1; i <= daysInMonth; i++) {
      calendarData.push({
        date: i,
        isCurrentMonth: true,
        fullDate: new Date(year, month, i),
      });
    }

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

  const handleDateClick = (date: Date) => {
    if (!userProfile?.id) {
       Swal.showError("Eits!", "Isi profil dulu yuk sebelum mulai mencatat! 🐱");
       return;
    }
    
    setSelectedDate(date);
    setIsDetailModalOpen(true);
  };

  const prevMonth = () =>
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
    );
  const nextMonth = () =>
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
    );

  return (
    <div className="w-full min-h-37.5 md:min-h-screen flex flex-col font-sans relative">
      <div className="w-full flex-1 flex flex-col bg-pink-400/20 backdrop-blur-3xl rounded-3xl shadow-2xl border border-white/20 p-4 sm:p-12 overflow-hidden relative">
        <PawPrint
          size={180}
          className="absolute pointer-events-none select-none text-purple-300"
          style={{ top: "12%", left: "10%", transform: "rotate(-18deg)", opacity: 1.3, zIndex: 0 }}
        />
        <PawPrint
          size={200}
          className="absolute pointer-events-none select-none text-purple-300"
          style={{ top: "55%", left: "22%", transform: "rotate(12deg)", opacity: 1.0, zIndex: 0 }}
        />
        <PawPrint
          size={230}
          className="absolute pointer-events-none select-none text-purple-300"
          style={{ top: "30%", left: "70%", transform: "rotate(24deg)", opacity: 1.3, zIndex: 0 }}
        />
        <PawPrint
          size={230}
          className="absolute pointer-events-none select-none text-purple-300"
          style={{ top: "80%", left: "70%", transform: "rotate(4deg)", opacity: 1.3, zIndex: 0 }}
        />
        <div className="flex-none flex items-center justify-between mb-4 px-1 relative z-10">
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

        <GridCalendar
          calendarData={calendarData}
          selectedDate={selectedDate}
          onDateClick={handleDateClick}
          markers={markers} 
        />
      </div>

      <DetailCalendarModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        selectedDate={selectedDate}
      />
    </div>
  );
}