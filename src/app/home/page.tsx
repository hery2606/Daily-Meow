'use client';
import Image from "next/image";
import  Calendar  from "@/app/calendar/page";

export default function Home() {
  return (
    <div className="flex p-6 min-h-screen items-center justify-center bg-white">
        
        <div className=" max-h-screen w-full ">
          
      <Calendar/>
        </div>
    </div>
  );
}