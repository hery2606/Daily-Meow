"use client";

import React from "react";
import Header from "../components/header/page";
import Rightbar from "../components/rightbarrpage/page";
import { SweetAlertProvider } from "@/ui/SweetAlertProvider";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SweetAlertProvider>
      <div className="flex flex-col min-h-screen   bg-[#FFF5F8] text-slate-800 font-sans selection:bg-pink-200 selection:text-pink-900   ">
        <div className="sticky top-0 z-10 shadow-sm bg-[#F8BBD0]/95 backdrop-blur-md">
          <Header />
        </div>
        <div className="flex-1 w-full max-w-480 mx-auto px-3 sm:px-6 lg:px-4 py-4 z-0  ">
          <div className="flex flex-col lg:flex-row gap-6 lg:gap-4 ">
            <main className="flex-1 min-w-0 w-full">
              {children}
              </main>
            <aside className="w-full lg:w-85 xl:w-95 shrink-0 mr-5  ">
              <div className="lg:sticky lg:top-24 h-fit">
                <Rightbar />
              </div>
            </aside>
          </div>
        </div>
      </div>
    </SweetAlertProvider>
  );
}
