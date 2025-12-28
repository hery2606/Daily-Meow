"use client";
import CalendarPage from "@/app/calendar/page";

export default function Home() {
  return (
    <div className="flex p-1 items-center justify-center">
      <div className="w-full">
        <CalendarPage />
      </div>
    </div>
  );
}
