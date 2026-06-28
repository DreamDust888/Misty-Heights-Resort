"use client";

import { useState, useEffect } from "react";
import { Room, Booking, Settings, Inquiry } from "@/lib/db";
import {
  Lock, Eye, Trash2, Edit3, Plus, Key, Calendar, Mail, FileText,
  Settings as SettingsIcon, BarChart3, DoorOpen, LogOut, CheckCircle,
  XCircle, ToggleLeft, ToggleRight, Info, AlertCircle, Save, Phone, MapPin
} from "lucide-react";

export default function AdminDashboard() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  // CMS states
  const [activeTab, setActiveTab] = useState("dashboard");
  const [rooms, setRooms] = useState<Room[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [settings, setSettings] = useState<Settings | null>(null);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);

  // Forms / Modals state
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);
  const [isAddRoomOpen, setIsAddRoomOpen] = useState(false);
  const [newRoomData, setNewRoomData] = useState<Partial<Room>>({
    name: "",
    description: "",
    price: 150,
    capacity: 2,
    beds: "1 King Bed",
    size: "350 sq ft",
    view: "Mountain View",
    amenities: ["Free Wi-Fi", "Coffee Station"],
    images: ["/images/room_luxury_suite.jpg"],
    available: true,
  });

  // Settings form state
  const [settingsForm, setSettingsForm] = useState<Settings | null>(null);

  // Check login on load
  useEffect(() => {
    const auth = localStorage.getItem("resort_admin_auth");
    if (auth === "true") {
      setIsLoggedIn(true);
    }
  }, []);

  // Fetch data when logged in
  useEffect(() => {
    if (!isLoggedIn) return;

    async function fetchCmsData() {
      setLoading(true);
      try {
        const [roomsRes, bookingsRes, settingsRes, inquiriesRes] = await Promise.all([
          fetch("/api/rooms"),
          fetch("/api/bookings"),
          fetch("/api/settings"),
          fetch("/api/inquiries"),
        ]);

        if (roomsRes.ok && bookingsRes.ok && settingsRes.ok && inquiriesRes.ok) {
          const roomsData = await roomsRes.json();
          const bookingsData = await bookingsRes.json();
          const settingsData = await settingsRes.json();
          const inquiriesData = await inquiriesRes.json();

          setRooms(roomsData);
          setBookings(bookingsData);
          setSettings(settingsData);
          setSettingsForm(settingsData);
          setInquiries(inquiriesData);
        }
      } catch (err) {
        console.error("Error fetching CMS data:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchCmsData();
  }, [isLoggedIn]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");

    if (username === "admin" && password === "password123") {
      setIsLoggedIn(true);
      localStorage.setItem("resort_admin_auth", "true");
    } else {
      setLoginError("Invalid username or password.");
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem("resort_admin_auth");
  };

  // CMS API Actions: Bookings
  const handleUpdateBookingStatus = async (id: string, status: "Confirmed" | "Cancelled") => {
    try {
      const res = await fetch("/api/bookings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
      if (res.ok) {
        const updated = await res.json();
        setBookings(bookings.map((b) => (b.id === id ? updated : b)));
      }
    } catch (err) {
      console.error(err);
    }
  };

  // CMS API Actions: Rooms
  const handleAddRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/rooms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newRoomData),
      });
      if (res.ok) {
        const added = await res.json();
        setRooms([...rooms, added]);
        setIsAddRoomOpen(false);
        setNewRoomData({
          name: "",
          description: "",
          price: 150,
          capacity: 2,
          beds: "1 King Bed",
          size: "350 sq ft",
          view: "Mountain View",
          amenities: ["Free Wi-Fi", "Coffee Station"],
          images: ["/images/room_luxury_suite.jpg"],
          available: true,
        });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleEditRoomSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingRoom) return;

    try {
      const res = await fetch("/api/rooms", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingRoom),
      });
      if (res.ok) {
        const updated = await res.json();
        setRooms(rooms.map((r) => (r.id === updated.id ? updated : r)));
        setEditingRoom(null);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteRoom = async (id: string) => {
    if (!confirm("Are you sure you want to delete this room listing?")) return;

    try {
      const res = await fetch(`/api/rooms?id=${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setRooms(rooms.filter((r) => r.id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleRoomAvailability = async (room: Room) => {
    const updated = { ...room, available: !room.available };
    try {
      const res = await fetch("/api/rooms", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updated),
      });
      if (res.ok) {
        setRooms(rooms.map((r) => (r.id === room.id ? updated : r)));
      }
    } catch (err) {
      console.error(err);
    }
  };

  // CMS API Actions: Settings
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settingsForm) return;

    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settingsForm),
      });
      if (res.ok) {
        const updated = await res.json();
        setSettings(updated);
        alert("Settings saved successfully!");
      }
    } catch (err) {
      console.error(err);
    }
  };

  // CMS API Actions: Inquiries
  const handleMarkInquiryRead = async (id: string) => {
    try {
      const res = await fetch("/api/inquiries", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: "Read" }),
      });
      if (res.ok) {
        const updated = await res.json();
        setInquiries(inquiries.map((i) => (i.id === id ? updated : i)));
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Calculate Metrics
  const totalSales = bookings
    .filter((b) => b.status === "Confirmed")
    .reduce((sum, b) => sum + b.totalPrice, 0);

  const pendingBookingsCount = bookings.filter((b) => b.status === "Pending").length;
  const unreadInquiriesCount = inquiries.filter((i) => i.status === "Unread").length;
  const activeRoomsCount = rooms.filter((r) => r.available).length;

  // LOGIN SCREEN
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-stone-950 flex flex-col justify-center items-center px-6 pt-16">
        <div className="w-full max-w-md bg-stone-920 border border-stone-850 p-6 md:p-8 rounded-lg shadow-2xl flex flex-col gap-6">
          <div className="text-center flex flex-col items-center gap-2">
            <div className="w-10 h-10 bg-emerald-950/60 rounded-full flex items-center justify-center border border-emerald-800/40">
              <Lock className="w-4 h-4 text-emerald-500" />
            </div>
            <h1 className="font-serif text-lg font-bold text-stone-100">Owner CMS Portal</h1>
            <p className="text-[10px] text-stone-400">Please authenticate to manage resort details.</p>
          </div>

          {loginError && (
            <div className="bg-red-950/40 border border-red-900/50 rounded p-3 flex items-center gap-2.5 text-xs text-red-200">
              <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] uppercase tracking-wider text-stone-400 font-semibold">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-stone-900 border border-stone-850 rounded px-3 py-2 text-stone-200 text-xs focus:outline-none focus:border-emerald-500"
                placeholder="admin"
                required
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] uppercase tracking-wider text-stone-400 font-semibold">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-stone-900 border border-stone-850 rounded px-3 py-2 text-stone-200 text-xs focus:outline-none focus:border-emerald-500"
                placeholder="••••••••"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-emerald-650 hover:bg-emerald-600 text-stone-50 font-medium text-xs tracking-wider uppercase py-2.5 rounded shadow transition-all flex items-center justify-center gap-1.5 mt-2 cursor-pointer"
            >
              Sign In <Key className="w-3.5 h-3.5" />
            </button>
          </form>

          <div className="text-[10px] text-stone-500 text-center border-t border-stone-900 pt-4 flex gap-1.5 justify-center items-center">
            <Info className="w-3.5 h-3.5 text-emerald-650" />
            <span>Sandbox default: <span className="font-mono text-stone-400">admin</span> / <span className="font-mono text-stone-400">password123</span></span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-950 pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Left Navigation Sidebar */}
        <aside className="lg:col-span-1 flex flex-col gap-2">
          {[
            { id: "dashboard", label: "Dashboard", icon: BarChart3 },
            { id: "bookings", label: "Bookings", icon: Calendar, badge: pendingBookingsCount },
            { id: "rooms", label: "Rooms Editor", icon: DoorOpen },
            { id: "settings", label: "Resort Settings", icon: SettingsIcon },
            { id: "inquiries", label: "Inquiries Inbox", icon: Mail, badge: unreadInquiriesCount },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded text-xs font-medium tracking-wide transition-colors ${
                  activeTab === tab.id
                    ? "bg-emerald-650 text-stone-50 font-bold"
                    : "bg-stone-920 text-stone-400 hover:bg-stone-900 hover:text-stone-200 border border-stone-850/40"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </div>
                {tab.badge && tab.badge > 0 ? (
                  <span className="bg-emerald-500 text-stone-950 font-bold text-[9px] px-1.5 py-0.5 rounded-full shrink-0">
                    {tab.badge}
                  </span>
                ) : null}
              </button>
            );
          })}

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded text-xs font-medium text-red-400 hover:bg-red-950/20 hover:text-red-300 bg-stone-920/40 border border-stone-900 mt-6 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </aside>

        {/* Right Dashboard Window */}
        <main className="lg:col-span-4 flex flex-col gap-6">
          {loading ? (
            <div className="glass-panel text-center py-20 rounded-md border border-stone-850 text-stone-400 text-xs">
              Fetching records from database...
            </div>
          ) : (
            <>
              {/* TAB 1: METRICS DASHBOARD */}
              {activeTab === "dashboard" && (
                <div className="flex flex-col gap-6 animate-fade-in">
                  {/* Grid Metrics */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-stone-920 border border-stone-850 p-4 rounded-md shadow flex flex-col gap-1.5">
                      <span className="text-[9px] uppercase tracking-wider text-stone-500 font-semibold">Total Revenue</span>
                      <span className="font-serif text-lg font-bold text-emerald-400">${totalSales.toFixed(2)}</span>
                    </div>
                    <div className="bg-stone-920 border border-stone-850 p-4 rounded-md shadow flex flex-col gap-1.5">
                      <span className="text-[9px] uppercase tracking-wider text-stone-500 font-semibold">Pending Bookings</span>
                      <span className="font-serif text-lg font-bold text-amber-500">{pendingBookingsCount} Stays</span>
                    </div>
                    <div className="bg-stone-920 border border-stone-850 p-4 rounded-md shadow flex flex-col gap-1.5">
                      <span className="text-[9px] uppercase tracking-wider text-stone-500 font-semibold">Active Suites</span>
                      <span className="font-serif text-lg font-bold text-stone-200">{activeRoomsCount} Rooms</span>
                    </div>
                    <div className="bg-stone-920 border border-stone-850 p-4 rounded-md shadow flex flex-col gap-1.5">
                      <span className="text-[9px] uppercase tracking-wider text-stone-500 font-semibold">Unread Inquiries</span>
                      <span className="font-serif text-lg font-bold text-emerald-450">{unreadInquiriesCount} Messages</span>
                    </div>
                  </div>

                  {/* Recent Bookings Feed */}
                  <div className="glass-panel p-5 rounded-md border border-stone-850">
                    <h2 className="font-serif text-sm font-bold text-stone-100 border-b border-stone-850 pb-3 mb-4">
                      Recent Activity
                    </h2>
                    <div className="overflow-x-auto">
                      <table className="w-full text-xs text-stone-300">
                        <thead>
                          <tr className="border-b border-stone-900 text-stone-500 text-left">
                            <th className="pb-2 font-medium">Guest</th>
                            <th className="pb-2 font-medium">Stay Dates</th>
                            <th className="pb-2 font-medium">Room</th>
                            <th className="pb-2 font-medium">Price</th>
                            <th className="pb-2 font-medium">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-stone-900/60">
                          {bookings.slice(0, 5).map((b) => (
                            <tr key={b.id} className="hover:bg-stone-900/30">
                              <td className="py-2.5">
                                <span className="font-semibold text-stone-200">{b.guestName}</span>
                              </td>
                              <td className="py-2.5">
                                <span className="text-stone-400">{b.checkIn} to {b.checkOut}</span>
                              </td>
                              <td className="py-2.5">
                                <span>{rooms.find((r) => r.id === b.roomId)?.name || b.roomId}</span>
                              </td>
                              <td className="py-2.5 font-medium text-stone-200">${b.totalPrice.toFixed(2)}</td>
                              <td className="py-2.5">
                                <span
                                  className={`text-[9px] px-2 py-0.5 rounded font-semibold ${
                                    b.status === "Confirmed"
                                      ? "bg-emerald-950 text-emerald-450 border border-emerald-900/40"
                                      : b.status === "Cancelled"
                                      ? "bg-red-950 text-red-400 border border-red-900/40"
                                      : "bg-amber-950 text-amber-500 border border-amber-900/40"
                                  }`}
                                >
                                  {b.status}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: BOOKINGS MANAGER */}
              {activeTab === "bookings" && (
                <div className="glass-panel p-5 rounded-md border border-stone-850 flex flex-col gap-4">
                  <h2 className="font-serif text-sm font-bold text-stone-100 border-b border-stone-850 pb-3">
                    Guest Reservations
                  </h2>
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs text-stone-300">
                      <thead>
                        <tr className="border-b border-stone-900 text-stone-500 text-left">
                          <th className="pb-2 font-medium">ID</th>
                          <th className="pb-2 font-medium">Guest Details</th>
                          <th className="pb-2 font-medium">Room</th>
                          <th className="pb-2 font-medium">Dates</th>
                          <th className="pb-2 font-medium">Total Bill</th>
                          <th className="pb-2 font-medium">Status</th>
                          <th className="pb-2 font-medium text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-stone-900/60">
                        {bookings.map((b) => (
                          <tr key={b.id} className="hover:bg-stone-900/30">
                            <td className="py-3 font-mono font-bold text-emerald-450">{b.id}</td>
                            <td className="py-3 flex flex-col">
                              <span className="font-semibold text-stone-200">{b.guestName}</span>
                              <span className="text-[10px] text-stone-500">{b.guestEmail}</span>
                            </td>
                            <td className="py-3">
                              <span>{rooms.find((r) => r.id === b.roomId)?.name || b.roomId}</span>
                            </td>
                            <td className="py-3 text-[10px] text-stone-400">
                              <span>{b.checkIn} to {b.checkOut}</span>
                            </td>
                            <td className="py-3 font-medium text-stone-200">${b.totalPrice}</td>
                            <td className="py-3">
                              <span
                                className={`text-[9px] px-2 py-0.5 rounded font-semibold ${
                                  b.status === "Confirmed"
                                    ? "bg-emerald-950 text-emerald-450 border border-emerald-900/40"
                                    : b.status === "Cancelled"
                                    ? "bg-red-950 text-red-400 border border-red-900/40"
                                    : "bg-amber-950 text-amber-500 border border-amber-900/40"
                                }`}
                              >
                                {b.status}
                              </span>
                            </td>
                            <td className="py-3 text-right">
                              {b.status === "Pending" && (
                                <div className="inline-flex gap-1.5">
                                  <button
                                    onClick={() => handleUpdateBookingStatus(b.id, "Confirmed")}
                                    className="p-1 rounded bg-emerald-950 text-emerald-400 border border-emerald-900/45 hover:bg-emerald-900 hover:text-stone-50 transition-all cursor-pointer"
                                    title="Confirm Booking"
                                  >
                                    <CheckCircle className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    onClick={() => handleUpdateBookingStatus(b.id, "Cancelled")}
                                    className="p-1 rounded bg-red-950 text-red-400 border border-red-900/45 hover:bg-red-900 hover:text-stone-50 transition-all cursor-pointer"
                                    title="Cancel Booking"
                                  >
                                    <XCircle className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              )}
                              {b.status === "Confirmed" && (
                                <button
                                  onClick={() => handleUpdateBookingStatus(b.id, "Cancelled")}
                                  className="text-[9px] bg-stone-900 hover:bg-red-950 hover:text-red-400 border border-stone-850 px-2 py-1 rounded text-stone-400 transition-all cursor-pointer"
                                >
                                  Cancel stay
                                </button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* TAB 3: ROOMS EDITOR CRUD */}
              {activeTab === "rooms" && (
                <div className="flex flex-col gap-6">
                  {/* Actions Header */}
                  <div className="flex justify-between items-center">
                    <h2 className="font-serif text-sm font-bold text-stone-100">Resort Accommodations</h2>
                    <button
                      onClick={() => setIsAddRoomOpen(true)}
                      className="bg-emerald-650 hover:bg-emerald-600 text-stone-50 px-3.5 py-1.5 rounded text-xs font-medium tracking-wide flex items-center gap-1 cursor-pointer"
                    >
                      <Plus className="w-4 h-4" /> Add Room Listing
                    </button>
                  </div>

                  {/* Rooms list Table */}
                  <div className="glass-panel p-5 rounded-md border border-stone-850">
                    <div className="overflow-x-auto">
                      <table className="w-full text-xs text-stone-300">
                        <thead>
                          <tr className="border-b border-stone-900 text-stone-500 text-left">
                            <th className="pb-2 font-medium">Room Name</th>
                            <th className="pb-2 font-medium">Nightly Rate</th>
                            <th className="pb-2 font-medium">Capacity</th>
                            <th className="pb-2 font-medium">View Type</th>
                            <th className="pb-2 font-medium">Availability</th>
                            <th className="pb-2 font-medium text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-stone-900/60">
                          {rooms.map((room) => (
                            <tr key={room.id} className="hover:bg-stone-900/30">
                              <td className="py-3 font-semibold text-stone-200">{room.name}</td>
                              <td className="py-3 font-bold text-emerald-450">${room.price}</td>
                              <td className="py-3">Max {room.capacity} Guests</td>
                              <td className="py-3 text-stone-400">{room.view}</td>
                              <td className="py-3">
                                <button
                                  onClick={() => handleToggleRoomAvailability(room)}
                                  className="focus:outline-none"
                                >
                                  {room.available ? (
                                    <ToggleRight className="w-7 h-7 text-emerald-500" />
                                  ) : (
                                    <ToggleLeft className="w-7 h-7 text-stone-600" />
                                  )}
                                </button>
                              </td>
                              <td className="py-3 text-right">
                                <div className="inline-flex gap-2">
                                  <button
                                    onClick={() => setEditingRoom(room)}
                                    className="p-1 rounded bg-stone-900 hover:bg-stone-850 text-stone-300 border border-stone-850 transition-colors cursor-pointer"
                                    title="Edit Room"
                                  >
                                    <Edit3 className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteRoom(room.id)}
                                    className="p-1 rounded bg-red-950/20 hover:bg-red-900 text-red-400 border border-red-950/30 transition-colors cursor-pointer"
                                    title="Delete Room"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 4: RESORT SETTINGS */}
              {activeTab === "settings" && settingsForm && (
                <form onSubmit={handleSaveSettings} className="glass-panel p-6 rounded-md border border-stone-850 flex flex-col gap-5">
                  <h2 className="font-serif text-sm font-bold text-stone-100 border-b border-stone-850 pb-3 flex items-center gap-2">
                    <SettingsIcon className="w-4 h-4 text-emerald-500" /> General Resort Settings
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] uppercase tracking-wider text-stone-400 font-medium">Resort Name</label>
                      <input
                        type="text"
                        value={settingsForm.resortName}
                        onChange={(e) => setSettingsForm({ ...settingsForm, resortName: e.target.value })}
                        className="bg-stone-900 border border-stone-850 rounded px-3 py-2 text-stone-200 text-xs focus:outline-none focus:border-emerald-500"
                        required
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] uppercase tracking-wider text-stone-400 font-medium">Tagline / Headline</label>
                      <input
                        type="text"
                        value={settingsForm.tagline}
                        onChange={(e) => setSettingsForm({ ...settingsForm, tagline: e.target.value })}
                        className="bg-stone-900 border border-stone-850 rounded px-3 py-2 text-stone-200 text-xs focus:outline-none focus:border-emerald-500"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] uppercase tracking-wider text-stone-400 font-medium flex items-center gap-1">
                        <Phone className="w-3.5 h-3.5 text-stone-550" /> Telephone
                      </label>
                      <input
                        type="text"
                        value={settingsForm.contactNumber}
                        onChange={(e) => setSettingsForm({ ...settingsForm, contactNumber: e.target.value })}
                        className="bg-stone-900 border border-stone-850 rounded px-3 py-2 text-stone-200 text-xs focus:outline-none focus:border-emerald-500"
                        required
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] uppercase tracking-wider text-stone-400 font-medium flex items-center gap-1">
                        <Mail className="w-3.5 h-3.5 text-stone-550" /> Contact Email
                      </label>
                      <input
                        type="email"
                        value={settingsForm.contactEmail}
                        onChange={(e) => setSettingsForm({ ...settingsForm, contactEmail: e.target.value })}
                        className="bg-stone-900 border border-stone-850 rounded px-3 py-2 text-stone-200 text-xs focus:outline-none focus:border-emerald-500"
                        required
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] uppercase tracking-wider text-stone-400 font-medium flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-stone-550" /> Address Location
                      </label>
                      <input
                        type="text"
                        value={settingsForm.address}
                        onChange={(e) => setSettingsForm({ ...settingsForm, address: e.target.value })}
                        className="bg-stone-900 border border-stone-850 rounded px-3 py-2 text-stone-200 text-xs focus:outline-none focus:border-emerald-500"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3 border-t border-stone-900/60">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] uppercase tracking-wider text-stone-400 font-medium">Extra Bed Rate ($ per night)</label>
                      <input
                        type="number"
                        value={settingsForm.extraBedPrice}
                        onChange={(e) => setSettingsForm({ ...settingsForm, extraBedPrice: parseInt(e.target.value) })}
                        className="bg-stone-900 border border-stone-850 rounded px-3 py-2 text-stone-200 text-xs focus:outline-none focus:border-emerald-500"
                        required
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] uppercase tracking-wider text-stone-400 font-medium">Luxury Tax Rate (e.g. 0.12 = 12%)</label>
                      <input
                        type="number"
                        step={0.01}
                        value={settingsForm.taxRate}
                        onChange={(e) => setSettingsForm({ ...settingsForm, taxRate: parseFloat(e.target.value) })}
                        className="bg-stone-900 border border-stone-850 rounded px-3 py-2 text-stone-200 text-xs focus:outline-none focus:border-emerald-500"
                        required
                      />
                    </div>
                  </div>

                  {/* Promo Section */}
                  <div className="flex flex-col gap-4 pt-4 border-t border-stone-900 mt-2">
                    <div className="flex justify-between items-center">
                      <div className="flex flex-col gap-0.5">
                        <span className="text-xs font-semibold text-stone-200">Active Banner Promotion</span>
                        <span className="text-[10px] text-stone-450">Displays a floating alert banner on the frontend page.</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setSettingsForm({ ...settingsForm, hasPromo: !settingsForm.hasPromo })}
                        className="focus:outline-none"
                      >
                        {settingsForm.hasPromo ? (
                          <ToggleRight className="w-7 h-7 text-emerald-500" />
                        ) : (
                          <ToggleLeft className="w-7 h-7 text-stone-600" />
                        )}
                      </button>
                    </div>

                    {settingsForm.hasPromo && (
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] uppercase tracking-wider text-stone-400 font-medium">Promotion Banner Text</label>
                        <input
                          type="text"
                          value={settingsForm.promoText}
                          onChange={(e) => setSettingsForm({ ...settingsForm, promoText: e.target.value })}
                          className="bg-stone-900 border border-stone-850 rounded px-3 py-2 text-stone-200 text-xs focus:outline-none focus:border-emerald-500"
                          placeholder="e.g. Opening discount 20% off stays!"
                          required
                        />
                      </div>
                    )}
                  </div>

                  <button
                    type="submit"
                    className="w-fit bg-emerald-650 hover:bg-emerald-600 text-stone-50 font-medium text-xs tracking-wider uppercase px-6 py-2.5 rounded shadow transition-all flex items-center gap-1.5 mt-4 self-end cursor-pointer"
                  >
                    Save Changes <Save className="w-4 h-4" />
                  </button>
                </form>
              )}

              {/* TAB 5: INQUIRIES INBOX */}
              {activeTab === "inquiries" && (
                <div className="glass-panel p-5 rounded-md border border-stone-850 flex flex-col gap-4">
                  <h2 className="font-serif text-sm font-bold text-stone-100 border-b border-stone-850 pb-3">
                    Inquiries & Guest Messages
                  </h2>
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs text-stone-300">
                      <thead>
                        <tr className="border-b border-stone-900 text-stone-500 text-left">
                          <th className="pb-2 font-medium">ID</th>
                          <th className="pb-2 font-medium">Sender</th>
                          <th className="pb-2 font-medium">Message Body</th>
                          <th className="pb-2 font-medium">Received Date</th>
                          <th className="pb-2 font-medium">Status</th>
                          <th className="pb-2 font-medium text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-stone-900/60">
                        {inquiries.map((inq) => (
                          <tr key={inq.id} className="hover:bg-stone-900/30">
                            <td className="py-3 font-mono font-semibold text-stone-400">{inq.id}</td>
                            <td className="py-3 flex flex-col">
                              <span className="font-semibold text-stone-200">{inq.name}</span>
                              <span className="text-[10px] text-stone-500">{inq.email}</span>
                            </td>
                            <td className="py-3 max-w-xs pr-4">
                              <p className="text-stone-350 line-clamp-3 leading-relaxed">{inq.message}</p>
                            </td>
                            <td className="py-3 text-[10px] text-stone-450">
                              <span>{new Date(inq.createdAt).toLocaleDateString()}</span>
                            </td>
                            <td className="py-3">
                              <span
                                className={`text-[9px] px-2 py-0.5 rounded font-semibold ${
                                  inq.status === "Read"
                                    ? "bg-stone-900 text-stone-500 border border-stone-850"
                                    : "bg-emerald-950 text-emerald-450 border border-emerald-900/40"
                                }`}
                              >
                                {inq.status}
                              </span>
                            </td>
                            <td className="py-3 text-right">
                              <div className="inline-flex gap-2">
                                {inq.status === "Unread" && (
                                  <button
                                    onClick={() => handleMarkInquiryRead(inq.id)}
                                    className="text-[9px] bg-emerald-950 text-emerald-400 hover:bg-emerald-900 hover:text-stone-50 border border-emerald-900/40 px-2.5 py-1 rounded transition-colors cursor-pointer"
                                  >
                                    Mark Read
                                  </button>
                                )}
                                <a
                                  href={`mailto:${inq.email}?subject=Inquiry Reply - Misty Heights Resort`}
                                  className="text-[9px] bg-stone-900 hover:bg-stone-850 text-stone-300 border border-stone-850 px-2.5 py-1 rounded transition-colors"
                                >
                                  Reply
                                </a>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </>
          )}
        </main>
      </div>

      {/* MODAL: ADD ROOM LISTING */}
      {isAddRoomOpen && (
        <div className="fixed inset-0 bg-stone-950/80 z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-stone-920 border border-stone-850 rounded-md p-6 shadow-2xl flex flex-col gap-4 overflow-y-auto max-h-[85vh]">
            <div className="flex justify-between items-center border-b border-stone-850 pb-3">
              <h3 className="font-serif text-sm font-bold text-stone-50">Create Accommodations Listing</h3>
              <button
                onClick={() => setIsAddRoomOpen(false)}
                className="p-1 rounded bg-stone-900 text-stone-400 hover:text-stone-100 hover:bg-stone-850"
              >
                <FileText className="w-4 h-4" /> Close
              </button>
            </div>

            <form onSubmit={handleAddRoom} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] uppercase tracking-wider text-stone-400 font-medium">Room Name</label>
                <input
                  type="text"
                  value={newRoomData.name}
                  onChange={(e) => setNewRoomData({ ...newRoomData, name: e.target.value })}
                  placeholder="e.g. Ridge View Cottage"
                  className="bg-stone-900 border border-stone-850 rounded px-3 py-2 text-stone-200 text-xs focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] uppercase tracking-wider text-stone-400 font-medium">Description</label>
                <textarea
                  value={newRoomData.description}
                  onChange={(e) => setNewRoomData({ ...newRoomData, description: e.target.value })}
                  placeholder="Describe details of the suite, views, custom wood style..."
                  rows={3}
                  className="bg-stone-900 border border-stone-850 rounded px-3 py-2 text-stone-200 text-xs focus:outline-none focus:border-emerald-500 resize-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] uppercase tracking-wider text-stone-400 font-medium">Rate ($ Nightly)</label>
                  <input
                    type="number"
                    value={newRoomData.price}
                    onChange={(e) => setNewRoomData({ ...newRoomData, price: parseInt(e.target.value) })}
                    className="bg-stone-900 border border-stone-850 rounded px-3 py-2 text-stone-200 text-xs focus:outline-none focus:border-emerald-500"
                    required
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] uppercase tracking-wider text-stone-400 font-medium">Capacity Limit</label>
                  <input
                    type="number"
                    value={newRoomData.capacity}
                    onChange={(e) => setNewRoomData({ ...newRoomData, capacity: parseInt(e.target.value) })}
                    className="bg-stone-900 border border-stone-850 rounded px-3 py-2 text-stone-200 text-xs focus:outline-none focus:border-emerald-500"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] uppercase tracking-wider text-stone-400 font-medium">Beds Config</label>
                  <input
                    type="text"
                    value={newRoomData.beds}
                    onChange={(e) => setNewRoomData({ ...newRoomData, beds: e.target.value })}
                    className="bg-stone-900 border border-stone-850 rounded px-3 py-2 text-stone-200 text-xs focus:outline-none focus:border-emerald-500"
                    required
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] uppercase tracking-wider text-stone-400 font-medium">Dimensions Size</label>
                  <input
                    type="text"
                    value={newRoomData.size}
                    onChange={(e) => setNewRoomData({ ...newRoomData, size: e.target.value })}
                    className="bg-stone-900 border border-stone-850 rounded px-3 py-2 text-stone-200 text-xs focus:outline-none focus:border-emerald-500"
                    required
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] uppercase tracking-wider text-stone-400 font-medium">View Description</label>
                <input
                  type="text"
                  value={newRoomData.view}
                  onChange={(e) => setNewRoomData({ ...newRoomData, view: e.target.value })}
                  placeholder="e.g. Pine Forest & Sunset View"
                  className="bg-stone-900 border border-stone-850 rounded px-3 py-2 text-stone-200 text-xs focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-stone-50 py-2.5 rounded font-medium text-xs tracking-wider uppercase shadow flex items-center justify-center gap-1 cursor-pointer"
              >
                Create Listing <Plus className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: EDIT ROOM LISTING */}
      {editingRoom && (
        <div className="fixed inset-0 bg-stone-950/80 z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-stone-920 border border-stone-850 rounded-md p-6 shadow-2xl flex flex-col gap-4 overflow-y-auto max-h-[85vh]">
            <div className="flex justify-between items-center border-b border-stone-850 pb-3">
              <h3 className="font-serif text-sm font-bold text-stone-50">Edit Suite Listing</h3>
              <button
                onClick={() => setEditingRoom(null)}
                className="p-1 rounded bg-stone-900 text-stone-400 hover:text-stone-100 hover:bg-stone-850"
              >
                <FileText className="w-4 h-4" /> Cancel
              </button>
            </div>

            <form onSubmit={handleEditRoomSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] uppercase tracking-wider text-stone-400 font-medium">Room Name</label>
                <input
                  type="text"
                  value={editingRoom.name}
                  onChange={(e) => setEditingRoom({ ...editingRoom, name: e.target.value })}
                  className="bg-stone-900 border border-stone-850 rounded px-3 py-2 text-stone-200 text-xs focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] uppercase tracking-wider text-stone-400 font-medium">Description</label>
                <textarea
                  value={editingRoom.description}
                  onChange={(e) => setEditingRoom({ ...editingRoom, description: e.target.value })}
                  rows={3}
                  className="bg-stone-900 border border-stone-850 rounded px-3 py-2 text-stone-200 text-xs focus:outline-none focus:border-emerald-500 resize-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] uppercase tracking-wider text-stone-400 font-medium">Nightly price ($)</label>
                  <input
                    type="number"
                    value={editingRoom.price}
                    onChange={(e) => setEditingRoom({ ...editingRoom, price: parseInt(e.target.value) })}
                    className="bg-stone-900 border border-stone-855 rounded px-3 py-2 text-stone-200 text-xs focus:outline-none focus:border-emerald-500"
                    required
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] uppercase tracking-wider text-stone-400 font-medium">Capacity Limit</label>
                  <input
                    type="number"
                    value={editingRoom.capacity}
                    onChange={(e) => setEditingRoom({ ...editingRoom, capacity: parseInt(e.target.value) })}
                    className="bg-stone-900 border border-stone-850 rounded px-3 py-2 text-stone-200 text-xs focus:outline-none focus:border-emerald-500"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] uppercase tracking-wider text-stone-400 font-medium">Beds configuration</label>
                  <input
                    type="text"
                    value={editingRoom.beds}
                    onChange={(e) => setEditingRoom({ ...editingRoom, beds: e.target.value })}
                    className="bg-stone-900 border border-stone-850 rounded px-3 py-2 text-stone-200 text-xs focus:outline-none focus:border-emerald-500"
                    required
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] uppercase tracking-wider text-stone-400 font-medium">Dimensions Size</label>
                  <input
                    type="text"
                    value={editingRoom.size}
                    onChange={(e) => setEditingRoom({ ...editingRoom, size: e.target.value })}
                    className="bg-stone-900 border border-stone-850 rounded px-3 py-2 text-stone-200 text-xs focus:outline-none focus:border-emerald-500"
                    required
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] uppercase tracking-wider text-stone-400 font-medium">View Description</label>
                <input
                  type="text"
                  value={editingRoom.view}
                  onChange={(e) => setEditingRoom({ ...editingRoom, view: e.target.value })}
                  className="bg-stone-900 border border-stone-855 rounded px-3 py-2 text-stone-200 text-xs focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-stone-50 py-2.5 rounded font-medium text-xs tracking-wider uppercase shadow flex items-center justify-center gap-1 cursor-pointer"
              >
                Save Changes <Save className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
