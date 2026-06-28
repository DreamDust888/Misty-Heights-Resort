"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Hotel } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Settings } from "@/lib/db";

interface NavbarProps {
  settings: Settings;
}

export default function Navbar({ settings }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Rooms & Suites", href: "/rooms" },
    { name: "Admin CMS Portal", href: "/admin" },
  ];

  const isAdminPage = pathname.startsWith("/admin");

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled || isOpen || isAdminPage
          ? "bg-stone-950/90 backdrop-blur-md border-b border-stone-850 py-4"
          : "bg-transparent py-6"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <Hotel className="w-6 h-6 text-emerald-500 group-hover:rotate-6 transition-transform" />
          <span className="font-serif text-lg md:text-xl font-semibold tracking-wide text-stone-50 group-hover:text-emerald-400 transition-colors">
            {settings.resortName || "Misty Heights Resort"}
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`relative font-medium tracking-wide text-xs transition-colors hover:text-emerald-500 ${
                  isActive ? "text-emerald-500" : "text-stone-300"
                }`}
              >
                {link.name}
                {isActive && (
                  <motion.div
                    layoutId="navbar-underline"
                    className="absolute -bottom-1 left-0 right-0 h-[2px] bg-emerald-500"
                  />
                )}
              </Link>
            );
          })}
          <Link
            href="/book"
            className="bg-emerald-600 hover:bg-emerald-500 text-stone-50 px-5 py-2 rounded-sm font-medium tracking-wide text-xs shadow-md transition-colors"
          >
            Book Now
          </Link>
        </nav>

        {/* Mobile menu trigger */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden text-stone-200 hover:text-emerald-500 focus:outline-none transition-colors"
          aria-label="Toggle menu"
        >
          {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-stone-950 border-b border-stone-850"
          >
            <div className="px-6 py-6 flex flex-col gap-5">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={`font-serif text-base tracking-wide ${
                    pathname === link.href ? "text-emerald-500 font-medium" : "text-stone-300"
                  }`}
                >
                  {link.name}
                </Link>
              ))}
              <Link
                href="/book"
                onClick={() => setIsOpen(false)}
                className="bg-emerald-600 hover:bg-emerald-500 text-stone-50 py-2.5 rounded-sm font-medium text-center tracking-wide text-xs shadow-md transition-colors"
              >
                Book Now
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
