"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Room } from "@/lib/db";
import { SlidersHorizontal, Eye, X, Coffee, Square, Eye as ViewIcon, UserRound, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface RoomsClientProps {
  initialRooms: Room[];
}

export default function RoomsClient({ initialRooms }: RoomsClientProps) {
  const [rooms] = useState<Room[]>(initialRooms);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);

  // Filter states
  const [search, setSearch] = useState("");
  const [maxPrice, setMaxPrice] = useState(500);
  const [minCapacity, setMinCapacity] = useState("0");
  const [viewFilter, setViewFilter] = useState("All");

  const views = ["All", ...Array.from(new Set(rooms.map((r) => r.view.split(" & ").flatMap((v) => v.split(" ")).find(v => v === "Forest" || v === "Valley" || v === "Secluded") || "Other")))];

  const filteredRooms = rooms.filter((room) => {
    const matchesSearch =
      room.name.toLowerCase().includes(search.toLowerCase()) ||
      room.description.toLowerCase().includes(search.toLowerCase());
    const matchesPrice = room.price <= maxPrice;
    const matchesCapacity = room.capacity >= parseInt(minCapacity);
    const matchesView =
      viewFilter === "All" ||
      room.view.toLowerCase().includes(viewFilter.toLowerCase());

    return matchesSearch && matchesPrice && matchesCapacity && matchesView && room.available;
  });

  return (
    <div className="pt-28 pb-20 max-w-7xl mx-auto px-6 md:px-12 min-h-screen">
      {/* Header */}
      <div className="flex flex-col gap-3 mb-10 text-center md:text-left">
        <span className="text-emerald-500 uppercase tracking-widest text-[10px] font-semibold">
          Accommodations
        </span>
        <h1 className="font-serif text-3xl font-bold text-stone-100">
          Our Sanctuary Suites & Cottages
        </h1>
        <p className="text-stone-405 text-xs max-w-lg font-light leading-relaxed">
          Select from our hand-tailored range of hillside dwellings. Each unit features glass views, localized timber design, and bespoke comfort.
        </p>
      </div>

      {/* Filter and Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Left Filters Sidebar */}
        <aside className="lg:col-span-1 glass-panel p-5 rounded-md border border-stone-850 h-fit flex flex-col gap-5">
          <div className="flex items-center gap-2 text-stone-200 border-b border-stone-850 pb-3">
            <SlidersHorizontal className="w-4 h-4 text-emerald-500" />
            <h2 className="font-serif text-sm font-semibold tracking-wide">Filter Accommodations</h2>
          </div>

          {/* Search */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] uppercase tracking-wider text-stone-400 font-medium">Search</label>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="e.g. Suite, Cabin..."
              className="w-full bg-stone-900 border border-stone-850 rounded px-2.5 py-2 text-stone-200 text-xs focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Price Filter */}
          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between text-[10px] uppercase tracking-wider text-stone-400 font-medium">
              <span>Max Price</span>
              <span className="text-emerald-400 font-bold">${maxPrice} / night</span>
            </div>
            <input
              type="range"
              min={100}
              max={600}
              step={20}
              value={maxPrice}
              onChange={(e) => setMaxPrice(parseInt(e.target.value))}
              className="w-full accent-emerald-500 bg-stone-900 rounded-lg cursor-pointer h-1.5"
            />
          </div>

          {/* Capacity Filter */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] uppercase tracking-wider text-stone-400 font-medium">Min Guests Capacity</label>
            <select
              value={minCapacity}
              onChange={(e) => setMinCapacity(e.target.value)}
              className="w-full bg-stone-900 border border-stone-850 rounded px-2 py-2 text-stone-200 text-xs focus:outline-none focus:border-emerald-500 appearance-none"
            >
              <option value="0">Any Capacity</option>
              <option value="1">1+ Guest</option>
              <option value="2">2+ Guests</option>
              <option value="3">3+ Guests</option>
            </select>
          </div>

          {/* View Filter */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] uppercase tracking-wider text-stone-400 font-medium">View Type</label>
            <div className="flex flex-wrap gap-2 pt-1">
              {views.map((view) => (
                <button
                  key={view}
                  onClick={() => setViewFilter(view)}
                  className={`text-[10px] px-2.5 py-1 rounded transition-colors ${
                    viewFilter === view
                      ? "bg-emerald-600 text-stone-50"
                      : "bg-stone-900 hover:bg-stone-850 text-stone-400 border border-stone-850"
                  }`}
                >
                  {view}
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Right Rooms Listings */}
        <section className="lg:col-span-3">
          {filteredRooms.length === 0 ? (
            <div className="glass-panel text-center py-20 rounded-md border border-stone-850">
              <p className="text-stone-400 text-sm">No accommodations match your filter choices.</p>
              <button
                onClick={() => {
                  setSearch("");
                  setMaxPrice(500);
                  setMinCapacity("0");
                  setViewFilter("All");
                }}
                className="mt-4 text-xs text-emerald-400 hover:text-emerald-300 font-medium underline underline-offset-4"
              >
                Reset all filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredRooms.map((room) => (
                <div
                  key={room.id}
                  className="bg-stone-920 border border-stone-85 shadow-lg rounded-md overflow-hidden hover:shadow-emerald-950/10 hover:border-stone-800 transition-all flex flex-col group"
                >
                  <div className="relative h-48 w-full overflow-hidden">
                    <Image
                      src={room.images[0]}
                      alt={room.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 right-3 bg-stone-950/80 backdrop-blur-sm text-emerald-450 text-[10px] font-bold tracking-wider px-2 py-1 rounded">
                      ${room.price} / Night
                    </div>
                  </div>

                  <div className="p-4 flex-grow flex flex-col gap-3">
                    <h3 className="font-serif text-sm font-semibold text-stone-100 group-hover:text-emerald-450 transition-colors">
                      {room.name}
                    </h3>
                    <p className="text-[11px] text-stone-450 line-clamp-3 leading-relaxed">
                      {room.description}
                    </p>

                    <div className="flex flex-wrap gap-2 pt-1 mt-auto">
                      <span className="text-[9px] bg-stone-900 border border-stone-850 px-2 py-0.5 rounded text-stone-300 flex items-center gap-1">
                        <Square className="w-2.5 h-2.5 text-emerald-500" /> {room.size}
                      </span>
                      <span className="text-[9px] bg-stone-900 border border-stone-850 px-2 py-0.5 rounded text-stone-300 flex items-center gap-1">
                        <ViewIcon className="w-2.5 h-2.5 text-emerald-500" /> {room.view}
                      </span>
                      <span className="text-[9px] bg-stone-900 border border-stone-850 px-2 py-0.5 rounded text-stone-300 flex items-center gap-1">
                        <UserRound className="w-2.5 h-2.5 text-emerald-500" /> Max {room.capacity}
                      </span>
                    </div>
                  </div>

                  <div className="px-4 pb-4 pt-1 flex gap-2">
                    <button
                      onClick={() => setSelectedRoom(room)}
                      className="flex-1 bg-stone-900 hover:bg-stone-850 text-stone-300 border border-stone-850 text-center font-medium text-[10px] tracking-wider uppercase py-2 rounded transition-colors flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" /> Details
                    </button>
                    <Link
                      href={`/book?roomId=${room.id}`}
                      className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-stone-50 text-center font-medium text-[10px] tracking-wider uppercase py-2 rounded shadow transition-colors flex items-center justify-center gap-1 cursor-pointer"
                    >
                      Book Stay
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      {/* Details Slide-out Drawer Panel */}
      <AnimatePresence>
        {selectedRoom && (
          <>
            {/* Overlay backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.7 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedRoom(null)}
              className="fixed inset-0 bg-stone-950 z-50 cursor-pointer"
            />
            {/* Drawer */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.4 }}
              className="fixed right-0 top-0 bottom-0 w-full max-w-lg bg-stone-950 border-l border-stone-850 z-50 p-6 md:p-8 flex flex-col gap-6 shadow-2xl overflow-y-auto"
            >
              <div className="flex justify-between items-center border-b border-stone-850 pb-4">
                <h2 className="font-serif text-lg font-bold text-stone-50">{selectedRoom.name}</h2>
                <button
                  onClick={() => setSelectedRoom(null)}
                  className="p-1.5 rounded bg-stone-900 text-stone-400 hover:text-stone-100 hover:bg-stone-850 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Room Image */}
              <div className="relative h-60 w-full rounded overflow-hidden">
                <Image
                  src={selectedRoom.images[0]}
                  alt={selectedRoom.name}
                  fill
                  className="object-cover"
                />
              </div>

              {/* Specs */}
              <div className="grid grid-cols-2 gap-4 border-b border-stone-900 pb-5 text-xs text-stone-300">
                <div className="flex flex-col gap-0.5">
                  <span className="text-[9px] uppercase tracking-wider text-stone-500 font-semibold">Dimensions</span>
                  <span className="font-medium">{selectedRoom.size}</span>
                </div>
                <div className="flex flex-col gap-0.5">
                  <span className="text-[9px] uppercase tracking-wider text-stone-500 font-semibold">Dwell View</span>
                  <span className="font-medium">{selectedRoom.view}</span>
                </div>
                <div className="flex flex-col gap-0.5">
                  <span className="text-[9px] uppercase tracking-wider text-stone-500 font-semibold">Sleeping config</span>
                  <span className="font-medium">{selectedRoom.beds}</span>
                </div>
                <div className="flex flex-col gap-0.5">
                  <span className="text-[9px] uppercase tracking-wider text-stone-500 font-semibold">Max Guests</span>
                  <span className="font-medium">{selectedRoom.capacity} People</span>
                </div>
              </div>

              {/* Description */}
              <div className="flex flex-col gap-2 border-b border-stone-900 pb-5">
                <h3 className="font-serif text-xs font-semibold tracking-wider uppercase text-emerald-400">Description</h3>
                <p className="text-[11px] text-stone-400 leading-relaxed font-light">{selectedRoom.description}</p>
              </div>

              {/* Amenities */}
              <div className="flex flex-col gap-3">
                <h3 className="font-serif text-xs font-semibold tracking-wider uppercase text-emerald-400">Amenities & Extras</h3>
                <div className="grid grid-cols-2 gap-3 text-[11px] text-stone-300">
                  {selectedRoom.amenities.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <Coffee className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action */}
              <div className="mt-auto pt-6 border-t border-stone-900 flex justify-between items-center gap-4">
                <div className="flex flex-col">
                  <span className="text-[9px] uppercase tracking-wider text-stone-500">Rate Nightly</span>
                  <span className="font-serif text-lg font-bold text-emerald-400">${selectedRoom.price}</span>
                </div>
                <Link
                  href={`/book?roomId=${selectedRoom.id}`}
                  onClick={() => setSelectedRoom(null)}
                  className="bg-emerald-600 hover:bg-emerald-500 text-stone-50 px-6 py-2.5 rounded font-medium text-xs tracking-wider uppercase shadow transition-all flex items-center gap-1"
                >
                  Book this Room
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
