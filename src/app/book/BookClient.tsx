"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import { Room, Settings } from "@/lib/db";
import { Calendar, Users, ShieldAlert, CheckCircle2, CreditCard, User, Landmark, ChevronRight, ChevronLeft } from "lucide-react";

export default function BookClient() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Query params
  const initialRoomId = searchParams.get("roomId") || "";
  const initialCheckIn = searchParams.get("checkIn") || new Date().toISOString().split("T")[0];
  
  const tomorrowDate = new Date();
  tomorrowDate.setDate(tomorrowDate.getDate() + 1);
  const initialCheckOut = searchParams.get("checkOut") || tomorrowDate.toISOString().split("T")[0];
  const initialGuests = searchParams.get("guestsCount") || "2";

  // Data states
  const [rooms, setRooms] = useState<Room[]>([]);
  const [settings, setSettings] = useState<Settings | null>(null);
  const [loadingData, setLoadingData] = useState(true);

  // Booking states
  const [step, setStep] = useState(1);
  const [checkIn, setCheckIn] = useState(initialCheckIn);
  const [checkOut, setCheckOut] = useState(initialCheckOut);
  const [guestsCount, setGuestsCount] = useState(parseInt(initialGuests));
  const [selectedRoomId, setSelectedRoomId] = useState(initialRoomId);

  // Guest details state
  const [guestName, setGuestName] = useState("");
  const [guestEmail, setGuestEmail] = useState("");
  const [guestPhone, setGuestPhone] = useState("");

  // Payment mock state
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");

  // UI state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [confirmedBooking, setConfirmedBooking] = useState<any>(null);

  // Fetch Rooms & Settings
  useEffect(() => {
    async function fetchData() {
      try {
        const [roomsRes, settingsRes] = await Promise.all([
          fetch("/api/rooms"),
          fetch("/api/settings"),
        ]);
        if (roomsRes.ok && settingsRes.ok) {
          const roomsData = await roomsRes.json();
          const settingsData = await settingsRes.json();
          setRooms(roomsData.filter((r: Room) => r.available));
          setSettings(settingsData);
          
          // If no initial room ID, default to first room
          if (!initialRoomId && roomsData.length > 0) {
            setSelectedRoomId(roomsData[0].id);
          }
        }
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoadingData(false);
      }
    }
    fetchData();
  }, [initialRoomId]);

  const selectedRoom = rooms.find((r) => r.id === selectedRoomId);

  // Calculated pricing values
  const date1 = new Date(checkIn);
  const date2 = new Date(checkOut);
  const diffTime = Math.abs(date2.getTime() - date1.getTime());
  const nights = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));

  const basePrice = selectedRoom ? selectedRoom.price * nights : 0;
  
  // Calculate extra guest fee (e.g. if guest count > 2, add extra bed price per night)
  const extraGuests = guestsCount > 2 ? guestsCount - 2 : 0;
  const extraBedCharge = settings ? extraGuests * settings.extraBedPrice * nights : 0;

  const subtotal = basePrice + extraBedCharge;
  const taxRate = settings ? settings.taxRate : 0.12;
  const tax = subtotal * taxRate;
  const total = subtotal + tax;

  const handleNextStep = () => {
    setErrorMsg("");
    if (step === 1) {
      if (!selectedRoomId) {
        setErrorMsg("Please select a room.");
        return;
      }
      if (selectedRoom && guestsCount > selectedRoom.capacity) {
        setErrorMsg(`Selected room capacity limit is ${selectedRoom.capacity} guests.`);
        return;
      }
      const checkInDate = new Date(checkIn);
      const checkOutDate = new Date(checkOut);
      if (checkOutDate <= checkInDate) {
        setErrorMsg("Check-out date must be after check-in date.");
        return;
      }
      setStep(2);
    } else if (step === 2) {
      if (!guestName || !guestEmail) {
        setErrorMsg("Please fill out your name and email.");
        return;
      }
      setStep(3);
    }
  };

  const handlePrevStep = () => {
    setErrorMsg("");
    setStep(Math.max(1, step - 1));
  };

  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          roomId: selectedRoomId,
          guestName,
          guestEmail,
          guestPhone,
          checkIn,
          checkOut,
          guestsCount,
          totalPrice: parseFloat(total.toFixed(2)),
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to make reservation.");
      }

      setConfirmedBooking(result);
      setStep(4);
    } catch (err: any) {
      setErrorMsg(err.message || "An unexpected error occurred during reservation.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loadingData) {
    return (
      <div className="pt-32 pb-20 max-w-7xl mx-auto px-6 text-center text-stone-400">
        <p className="text-xs">Preparing reservation system...</p>
      </div>
    );
  }

  return (
    <div className="pt-28 pb-20 max-w-5xl mx-auto px-6 md:px-12 min-h-screen">
      {/* Progress Indicator */}
      {step < 4 && (
        <div className="flex justify-between items-center mb-10 max-w-lg mx-auto">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center gap-2">
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${
                  step >= s ? "bg-emerald-600 text-stone-50" : "bg-stone-900 text-stone-500 border border-stone-850"
                }`}
              >
                {s}
              </div>
              <span className={`text-[10px] uppercase tracking-wider font-medium hidden md:inline ${step === s ? "text-stone-100" : "text-stone-500"}`}>
                {s === 1 ? "Choose Dates" : s === 2 ? "Guest Info" : "Checkout"}
              </span>
              {s < 3 && <ChevronRight className="w-3.5 h-3.5 text-stone-700 hidden md:block" />}
            </div>
          ))}
        </div>
      )}

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Side: Dynamic Forms */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {errorMsg && (
            <div className="bg-red-950/40 border border-red-900/50 text-red-200 rounded p-4 flex items-center gap-3 text-xs">
              <ShieldAlert className="w-4 h-4 text-red-500 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* STEP 1: SELECT DATES & ROOM */}
          {step === 1 && (
            <div className="glass-panel p-6 rounded-md border border-stone-850 flex flex-col gap-5">
              <h2 className="font-serif text-base font-bold text-stone-100 flex items-center gap-2 border-b border-stone-850 pb-3">
                <Calendar className="w-4 h-4 text-emerald-500" /> 1. Select Dates & Accommodations
              </h2>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] uppercase tracking-wider text-stone-400 font-medium">Check-In</label>
                  <input
                    type="date"
                    min={new Date().toISOString().split("T")[0]}
                    value={checkIn}
                    onChange={(e) => {
                      setCheckIn(e.target.value);
                      if (e.target.value >= checkOut) {
                        const nextDay = new Date(e.target.value);
                        nextDay.setDate(nextDay.getDate() + 1);
                        setCheckOut(nextDay.toISOString().split("T")[0]);
                      }
                    }}
                    className="bg-stone-900 border border-stone-850 rounded px-3 py-2 text-stone-200 text-xs focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] uppercase tracking-wider text-stone-400 font-medium">Check-Out</label>
                  <input
                    type="date"
                    min={checkIn}
                    value={checkOut}
                    onChange={(e) => setCheckOut(e.target.value)}
                    className="bg-stone-900 border border-stone-850 rounded px-3 py-2 text-stone-200 text-xs focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] uppercase tracking-wider text-stone-400 font-medium">Number of Guests</label>
                <select
                  value={guestsCount}
                  onChange={(e) => setGuestsCount(parseInt(e.target.value))}
                  className="w-full bg-stone-900 border border-stone-850 rounded px-3 py-2 text-stone-200 text-xs focus:outline-none focus:border-emerald-500 appearance-none"
                >
                  <option value="1">1 Guest</option>
                  <option value="2">2 Guests</option>
                  <option value="3">3 Guests (Requires Extra Bed)</option>
                  <option value="4">4 Guests (Requires Extra Bed)</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] uppercase tracking-wider text-stone-400 font-medium">Select Room & Cottage</label>
                <div className="flex flex-col gap-3">
                  {rooms.map((room) => (
                    <div
                      key={room.id}
                      onClick={() => setSelectedRoomId(room.id)}
                      className={`border rounded-md p-3.5 flex gap-4 cursor-pointer transition-all ${
                        selectedRoomId === room.id
                          ? "border-emerald-600 bg-emerald-950/10 shadow-md shadow-emerald-950/5"
                          : "border-stone-850 bg-stone-900/40 hover:bg-stone-900"
                      }`}
                    >
                      <input
                        type="radio"
                        checked={selectedRoomId === room.id}
                        onChange={() => setSelectedRoomId(room.id)}
                        className="accent-emerald-500 h-4 w-4 mt-0.5"
                      />
                      <div className="flex-grow flex flex-col gap-1">
                        <div className="flex justify-between items-start">
                          <span className="font-serif text-stone-100 text-xs font-semibold">{room.name}</span>
                          <span className="text-emerald-450 text-[11px] font-bold">${room.price}/night</span>
                        </div>
                        <p className="text-[10px] text-stone-450 line-clamp-2">{room.description}</p>
                        <div className="flex gap-3 text-[9px] text-stone-400 pt-1">
                          <span>{room.size}</span>
                          <span>Max {room.capacity} guests</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={handleNextStep}
                className="w-full bg-emerald-650 hover:bg-emerald-600 text-stone-50 py-2.5 rounded font-medium text-xs tracking-wider uppercase shadow flex items-center justify-center gap-1 mt-2 cursor-pointer"
              >
                Continue to Guest Details <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* STEP 2: GUEST DETAILS */}
          {step === 2 && (
            <div className="glass-panel p-6 rounded-md border border-stone-850 flex flex-col gap-5">
              <h2 className="font-serif text-base font-bold text-stone-100 flex items-center gap-2 border-b border-stone-850 pb-3">
                <User className="w-4 h-4 text-emerald-500" /> 2. Guest Information
              </h2>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] uppercase tracking-wider text-stone-400 font-medium">Full Name</label>
                <input
                  type="text"
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  placeholder="e.g. John Doe"
                  className="bg-stone-900 border border-stone-850 rounded px-3 py-2 text-stone-200 text-xs focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] uppercase tracking-wider text-stone-400 font-medium">Email Address</label>
                  <input
                    type="email"
                    value={guestEmail}
                    onChange={(e) => setGuestEmail(e.target.value)}
                    placeholder="john@example.com"
                    className="bg-stone-900 border border-stone-850 rounded px-3 py-2 text-stone-200 text-xs focus:outline-none focus:border-emerald-500"
                    required
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] uppercase tracking-wider text-stone-400 font-medium">Phone Number</label>
                  <input
                    type="tel"
                    value={guestPhone}
                    onChange={(e) => setGuestPhone(e.target.value)}
                    placeholder="+1 (555) 123-4567"
                    className="bg-stone-900 border border-stone-850 rounded px-3 py-2 text-stone-200 text-xs focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-3 border-t border-stone-900">
                <button
                  onClick={handlePrevStep}
                  className="flex-1 bg-stone-900 hover:bg-stone-850 text-stone-300 border border-stone-850 py-2.5 rounded font-medium text-xs tracking-wider uppercase flex items-center justify-center gap-1 cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" /> Back
                </button>
                <button
                  onClick={handleNextStep}
                  className="flex-grow bg-emerald-650 hover:bg-emerald-600 text-stone-50 py-2.5 rounded font-medium text-xs tracking-wider uppercase shadow flex items-center justify-center gap-1 cursor-pointer"
                >
                  Confirm Details <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: SUMMARY & CHECKOUT */}
          {step === 3 && (
            <form onSubmit={handleCheckoutSubmit} className="glass-panel p-6 rounded-md border border-stone-850 flex flex-col gap-5">
              <h2 className="font-serif text-base font-bold text-stone-100 flex items-center gap-2 border-b border-stone-850 pb-3">
                <CreditCard className="w-4 h-4 text-emerald-500" /> 3. Secure Checkout (Mock Payment)
              </h2>

              <p className="text-[10px] text-stone-400 leading-relaxed bg-stone-900/60 p-3 border border-stone-850 rounded flex gap-2">
                <Landmark className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                This is a secure mock sandbox. You can enter any dummy credit card digits to finish the reservation process.
              </p>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] uppercase tracking-wider text-stone-400 font-medium">Cardholder Name</label>
                <input
                  type="text"
                  defaultValue={guestName}
                  className="bg-stone-900 border border-stone-850 rounded px-3 py-2 text-stone-200 text-xs focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] uppercase tracking-wider text-stone-400 font-medium">Credit Card Number</label>
                <input
                  type="text"
                  maxLength={19}
                  value={cardNumber}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
                    const matches = val.match(/\d{4,16}/g);
                    const match = (matches && matches[0]) || "";
                    const parts = [];
                    for (let i = 0, len = match.length; i < len; i += 4) {
                      parts.push(match.substring(i, i + 4));
                    }
                    if (parts.length > 0) {
                      setCardNumber(parts.join(" "));
                    } else {
                      setCardNumber(val);
                    }
                  }}
                  placeholder="4111 2222 3333 4444"
                  className="bg-stone-900 border border-stone-850 rounded px-3 py-2 text-stone-200 text-xs focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] uppercase tracking-wider text-stone-400 font-medium">Expiration Date</label>
                  <input
                    type="text"
                    maxLength={5}
                    placeholder="MM/YY"
                    value={cardExpiry}
                    onChange={(e) => {
                      let val = e.target.value.replace(/[^0-9]/g, "");
                      if (val.length > 2) {
                        val = val.substring(0, 2) + "/" + val.substring(2, 4);
                      }
                      setCardExpiry(val);
                    }}
                    className="bg-stone-900 border border-stone-850 rounded px-3 py-2 text-stone-200 text-xs focus:outline-none focus:border-emerald-500 text-center"
                    required
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] uppercase tracking-wider text-stone-400 font-medium">Security CVV</label>
                  <input
                    type="password"
                    maxLength={3}
                    placeholder="123"
                    value={cardCvv}
                    onChange={(e) => setCardCvv(e.target.value.replace(/[^0-9]/g, ""))}
                    className="bg-stone-900 border border-stone-850 rounded px-3 py-2 text-stone-200 text-xs focus:outline-none focus:border-emerald-500 text-center"
                    required
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-3 border-t border-stone-900 mt-2">
                <button
                  type="button"
                  onClick={handlePrevStep}
                  className="flex-1 bg-stone-900 hover:bg-stone-850 text-stone-300 border border-stone-850 py-2.5 rounded font-medium text-xs tracking-wider uppercase flex items-center justify-center gap-1 cursor-pointer"
                  disabled={isSubmitting}
                >
                  <ChevronLeft className="w-4 h-4" /> Back
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-grow bg-emerald-600 hover:bg-emerald-500 disabled:bg-emerald-800 text-stone-50 py-2.5 rounded font-medium text-xs tracking-wider uppercase shadow flex items-center justify-center gap-1 cursor-pointer"
                >
                  {isSubmitting ? "Processing..." : `Pay $${total.toFixed(2)} & Reserve`}
                </button>
              </div>
            </form>
          )}

          {/* STEP 4: CONFIRMATION SCREEN */}
          {step === 4 && confirmedBooking && (
            <div className="glass-panel p-8 rounded-md border border-stone-850 text-center flex flex-col items-center gap-4 shadow-xl">
              <CheckCircle2 className="w-16 h-16 text-emerald-500 animate-bounce" />
              <h2 className="font-serif text-xl font-bold text-stone-100">Booking Confirmed!</h2>
              <p className="text-xs text-stone-400 max-w-md leading-relaxed">
                Thank you, <span className="text-stone-200 font-medium">{confirmedBooking.guestName}</span>. Your stay at Misty Heights Resort is officially reserved. A confirmation email has been dispatched to <span className="text-stone-200">{confirmedBooking.guestEmail}</span>.
              </p>

              <div className="bg-stone-900 border border-stone-850 rounded-md p-4 w-full max-w-sm flex flex-col gap-2.5 text-xs text-stone-300 mt-2 text-left">
                <div className="flex justify-between pb-1.5 border-b border-stone-800">
                  <span className="text-stone-500 font-semibold uppercase text-[9px] tracking-wider">Booking ID</span>
                  <span className="font-mono text-emerald-400 font-bold">{confirmedBooking.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500 uppercase text-[9px] tracking-wider">Suite Category</span>
                  <span>{selectedRoom ? selectedRoom.name : ""}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500 uppercase text-[9px] tracking-wider">Check In</span>
                  <span>{confirmedBooking.checkIn}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500 uppercase text-[9px] tracking-wider">Check Out</span>
                  <span>{confirmedBooking.checkOut}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500 uppercase text-[9px] tracking-wider">Total Charge</span>
                  <span className="font-bold text-stone-100">${confirmedBooking.totalPrice.toFixed(2)}</span>
                </div>
              </div>

              <div className="flex flex-col md:flex-row gap-3 mt-4 w-full max-w-xs">
                <button
                  onClick={() => router.push("/")}
                  className="flex-1 bg-stone-900 hover:bg-stone-850 text-stone-300 border border-stone-850 text-xs py-2 rounded transition-colors uppercase tracking-wider font-medium cursor-pointer"
                >
                  Back to Home
                </button>
                <button
                  onClick={() => router.push("/rooms")}
                  className="flex-grow bg-emerald-600 hover:bg-emerald-500 text-stone-50 text-xs py-2 rounded transition-colors uppercase tracking-wider font-medium cursor-pointer"
                >
                  Explore Rooms
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right Side: Stay Summary Sidebar */}
        {step < 4 && selectedRoom && (
          <aside className="lg:col-span-1 flex flex-col gap-4">
            <div className="glass-panel rounded-md border border-stone-850 overflow-hidden shadow-lg">
              <div className="relative h-36 w-full">
                <Image
                  src={selectedRoom.images[0]}
                  alt={selectedRoom.name}
                  fill
                  className="object-cover"
                />
              </div>
              
              <div className="p-4 flex flex-col gap-4">
                <div className="flex flex-col gap-1 border-b border-stone-900 pb-3">
                  <h3 className="font-serif text-sm font-semibold text-stone-100">{selectedRoom.name}</h3>
                  <span className="text-[10px] text-stone-400">{selectedRoom.view} | {selectedRoom.size}</span>
                </div>

                {/* Details list */}
                <div className="flex flex-col gap-2 text-[11px] text-stone-300 border-b border-stone-900 pb-3">
                  <div className="flex justify-between">
                    <span className="text-stone-500">Dates</span>
                    <span className="font-medium text-stone-200">{checkIn} to {checkOut}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-500">Length</span>
                    <span className="font-medium text-stone-200">{nights} {nights > 1 ? "Nights" : "Night"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-500">Occupancy</span>
                    <span className="font-medium text-stone-200">{guestsCount} {guestsCount > 1 ? "Guests" : "Guest"}</span>
                  </div>
                </div>

                {/* Pricing Summary */}
                <div className="flex flex-col gap-2 text-[11px] text-stone-300">
                  <div className="flex justify-between">
                    <span>Room Rate (${selectedRoom.price} x {nights})</span>
                    <span>${basePrice.toFixed(2)}</span>
                  </div>
                  {extraBedCharge > 0 && (
                    <div className="flex justify-between text-amber-500">
                      <span>Extra bed charge (${settings?.extraBedPrice} x {extraGuests} x {nights})</span>
                      <span>+${extraBedCharge.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-medium text-stone-300 border-t border-stone-900/60 pt-2">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-stone-450">
                    <span>Tax & Resort Fee ({(taxRate * 100).toFixed(0)}%)</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-stone-50 font-serif text-sm font-bold border-t border-stone-850 pt-2.5">
                    <span>Grand Total</span>
                    <span className="text-emerald-400">${total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </aside>
        )}
      </div>
    </div>
  );
}
