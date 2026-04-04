"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, Clock, Repeat, Plus } from "lucide-react";

interface ScheduledTask {
  id: string;
  title: string;
  time: string;
  type: "cron" | "one-time";
  recurrence?: string;
}

const scheduledTasks: ScheduledTask[] = [];

const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date());

  const monthName = currentDate.toLocaleString("default", { month: "long", year: "numeric" });

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const daysInMonth = getDaysInMonth(currentDate);
  const firstDay = getFirstDayOfMonth(currentDate);
  const today = new Date().getDate();
  const isCurrentMonth = currentDate.getMonth() === new Date().getMonth();

  return (
    <div className="p-8">
      <header className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Calendar</h1>
          <p className="text-gray-400">View all scheduled tasks and cron jobs.</p>
        </div>
        <button className="flex items-center gap-2 bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium transition-colors">
          <Plus size={18} />
          New Schedule
        </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <div className="lg:col-span-2 bg-[#1a1a1a] border border-gray-800 rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-white">{monthName}</h2>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))}
                className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
              >
                <ChevronLeft size={20} className="text-gray-400" />
              </button>
              <button
                onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))}
                className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
              >
                <ChevronRight size={20} className="text-gray-400" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-1">
            {weekDays.map((day) => (
              <div key={day} className="text-center text-xs text-gray-500 font-medium py-2">
                {day}
              </div>
            ))}
            
            {Array.from({ length: firstDay }).map((_, i) => (
              <div key={`empty-${i}`} />
            ))}
            
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const isToday = isCurrentMonth && day === today;
              return (
                <div
                  key={day}
                  className={`aspect-square flex items-center justify-center rounded-lg text-sm cursor-pointer transition-colors ${
                    isToday
                      ? "bg-indigo-500 text-white font-semibold"
                      : "hover:bg-gray-800 text-gray-300"
                  }`}
                >
                  {day}
                </div>
              );
            })}
          </div>
        </div>

        {/* Scheduled Tasks */}
        <div className="bg-[#1a1a1a] border border-gray-800 rounded-xl p-6">
          <div className="flex items-center gap-2 mb-6">
            <Clock size={20} className="text-indigo-400" />
            <h2 className="text-lg font-semibold text-white">Scheduled Tasks</h2>
          </div>

          {scheduledTasks.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No scheduled tasks</p>
              <p className="text-sm text-gray-600 mt-1">Ask Rex to schedule tasks for you.</p>
              <button className="mt-4 inline-flex items-center gap-2 bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium transition-colors">
                <Plus size={16} />
                Schedule Task
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {scheduledTasks.map((task) => (
                <div
                  key={task.id}
                  className="flex items-start gap-3 p-3 bg-[#252525] rounded-lg border border-gray-700 hover:border-gray-600 transition-colors"
                >
                  <div className={`w-2 h-2 rounded-full mt-2 ${task.type === "cron" ? "bg-green-500" : "bg-blue-500"}`} />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-white">{task.title}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-gray-500">{task.time}</span>
                      {task.recurrence && (
                        <span className="flex items-center gap-1 text-xs text-green-400">
                          <Repeat size={10} />
                          {task.recurrence}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
