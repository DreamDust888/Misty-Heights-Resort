"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Calendar, Users, ArrowRight } from "lucide-react";

export default function SearchForm() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  const today = new Date().toISOString().split("T")[0];
  
  // Set tomorrow as default checkout
  const tomorrowDate = new Date();
  tomorrowDate.setDate(tomorrowDate.getDate() + 1);
  const tomorrow = tomorrowDate.toISOString().split("T")[0];

  const [checkIn, setCheckIn] = useState(today);
  const [checkOut, setCheckOut] = useState(tomorrow);
  const [guestsCount, setGuestsCount] = useState("2");

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`/book?checkIn=${checkIn}&checkOut=${checkOut}&guestsCount=${guestsCount}`);
  };

  if (!mounted) {
    return (
      <div className="w-full max-w-4xl glass-panel p-4 md:p-6 rounded-lg grid grid-cols-1 md:grid-cols-4 gap-4 items-end shadow-2xl border border-stone-850 h-[92px] animate-pulse">
        <div className="h-9 bg-stone-900/80 rounded"></div>
        <div className="h-9 bg-stone-900/80 rounded"></div>
        <div className="h-9 bg-stone-900/80 rounded"></div>
        <div className="h-9 bg-emerald-900/40 rounded"></div>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-4xl glass-panel p-4 md:p-6 rounded-lg grid grid-cols-1 md:grid-cols-4 gap-4 items-end shadow-2xl border border-stone-850"
    >
      <div className="flex flex-col gap-2">
        <label className="text-[10px] uppercase tracking-wider text-stone-400 font-semibold flex items-center gap-1.5">
          <Calendar className="w-3.5 h-3.5 text-emerald-500" />
          Check In
        </label>
        <input
          type="date"
          min={today}
          value={checkIn}
          onChange={(e) => {
            setCheckIn(e.target.value);
            if (e.target.value >= checkOut) {
              const nextDay = new Date(e.target.value);
              nextDay.setDate(nextDay.getDate() + 1);
              setCheckOut(nextDay.toISOString().split("T")[0]);
            }
          }}
          className="w-full bg-stone-900 border border-stone-850 rounded px-3 py-2.5 text-stone-200 text-xs focus:outline-none focus:border-emerald-500"
          required
        />
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-[10px] uppercase tracking-wider text-stone-400 font-semibold flex items-center gap-1.5">
          <Calendar className="w-3.5 h-3.5 text-emerald-500" />
          Check Out
        </label>
        <input
          type="date"
          min={checkIn}
          value={checkOut}
          onChange={(e) => setCheckOut(e.target.value)}
          className="w-full bg-stone-900 border border-stone-850 rounded px-3 py-2.5 text-stone-200 text-xs focus:outline-none focus:border-emerald-500"
          required
        />
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-[10px] uppercase tracking-wider text-stone-400 font-semibold flex items-center gap-1.5">
          <Users className="w-3.5 h-3.5 text-emerald-500" />
          Guests
        </label>
        <select
          value={guestsCount}
          onChange={(e) => setGuestsCount(e.target.value)}
          className="w-full bg-stone-900 border border-stone-850 rounded px-3 py-2.5 text-stone-200 text-xs focus:outline-none focus:border-emerald-500 appearance-none animate-none"
        >
          <option value="1">1 Guest</option>
          <option value="2">2 Guests</option>
          <option value="3">3 Guests</option>
          <option value="4">4 Guests</option>
        </select>
      </div>

      <div>
        <button
          type="submit"
          className="w-full bg-emerald-600 hover:bg-emerald-500 text-stone-50 font-medium text-xs tracking-wider uppercase py-3 rounded shadow transition-all flex items-center justify-center gap-1.5 transform hover:-translate-y-0.5 cursor-pointer"
        >
          Search Rooms
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </form>
  );
}
