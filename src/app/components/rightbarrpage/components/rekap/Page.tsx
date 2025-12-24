import React from "react";
import { BarChart3, PieChart, Star } from "lucide-react";

export default function RecapView() {
  return (
    <div className="animate-in fade-in slide-in-from-right-4 duration-300">
       <h2 className="text-lg font-bold mb-6">Weekly Recap</h2>

       {/* Summary Stats */}
       <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="bg-white p-4 rounded-2xl shadow-sm">
             <div className="bg-blue-100 w-8 h-8 rounded-full flex items-center justify-center text-blue-600 mb-2">
                <BarChart3 size={16}/>
             </div>
             <p className="text-xs text-slate-500">Tasks Done</p>
             <h3 className="text-xl font-bold text-slate-800">12</h3>
          </div>
          <div className="bg-white p-4 rounded-2xl shadow-sm">
             <div className="bg-yellow-100 w-8 h-8 rounded-full flex items-center justify-center text-yellow-600 mb-2">
                <Star size={16}/>
             </div>
             <p className="text-xs text-slate-500">Focus Time</p>
             <h3 className="text-xl font-bold text-slate-800">5h 20m</h3>
          </div>
       </div>

       {/* Empty State / Coming Soon */}
       <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl p-8 flex flex-col items-center justify-center text-center">
          <PieChart className="text-slate-300 mb-3" size={48} />
          <h3 className="text-sm font-bold text-slate-600">Analytics Coming Soon</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-50">
            We are preparing detailed charts for your next update!
          </p>
       </div>
    </div>
  );
}