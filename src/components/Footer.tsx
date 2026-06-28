import Link from "next/link";
import { Mail, Phone, MapPin, Hotel, Compass, ShieldCheck } from "lucide-react";
import { Settings } from "@/lib/db";

interface FooterProps {
  settings: Settings;
}

export default function Footer({ settings }: FooterProps) {
  return (
    <footer className="bg-stone-950 border-t border-stone-850 text-stone-400 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
        {/* Info Column */}
        <div className="md:col-span-2 flex flex-col gap-4">
          <div className="flex items-center gap-2 text-stone-50">
            <Hotel className="w-5 h-5 text-emerald-500" />
            <span className="font-serif text-lg font-semibold tracking-wide">
              {settings.resortName || "Misty Heights Resort"}
            </span>
          </div>
          <p className="text-xs leading-relaxed max-w-md text-stone-450">
            {settings.tagline || "A luxury hillside sanctuary floating above the clouds."} Nestled in the pristine mountain cliffs, our resort offers tranquility, wilderness trails, and high-end hillside hospitality.
          </p>
        </div>

        {/* Quick Links Column */}
        <div className="flex flex-col gap-3">
          <h3 className="font-serif text-stone-100 text-xs font-semibold tracking-wider uppercase">
            Discover
          </h3>
          <ul className="flex flex-col gap-2 text-xs">
            <li>
              <Link href="/" className="hover:text-emerald-500 transition-colors">
                Home
              </Link>
            </li>
            <li>
              <Link href="/rooms" className="hover:text-emerald-500 transition-colors">
                Rooms & Suites
              </Link>
            </li>
            <li>
              <Link href="/book" className="hover:text-emerald-500 transition-colors">
                Book a Stay
              </Link>
            </li>
            <li>
              <Link href="/admin" className="hover:text-emerald-500 transition-colors flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                CMS Owner Portal
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact Column */}
        <div className="flex flex-col gap-3">
          <h3 className="font-serif text-stone-100 text-xs font-semibold tracking-wider uppercase">
            Contact
          </h3>
          <ul className="flex flex-col gap-2.5 text-xs">
            <li className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <span>{settings.address || "Ridge Road, Cloud Valley"}</span>
            </li>
            <li className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>{settings.contactNumber || "+1 (555) 019-2834"}</span>
            </li>
            <li className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>{settings.contactEmail || "stay@mistyheights.com"}</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Copyright Bar */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 border-t border-stone-850 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-[11px] text-stone-500">
        <p>© {new Date().getFullYear()} {settings.resortName || "Misty Heights Resort"}. All rights reserved.</p>
        <p className="flex items-center gap-1">
          Designed for luxury mountain hospitality <Compass className="w-3 h-3 text-emerald-500" />
        </p>
      </div>
    </footer>
  );
}
