import Link from "next/link";
import Image from "next/image";
import SearchForm from "@/components/SearchForm";
import ContactForm from "@/components/ContactForm";
import {
  Coffee, Flame, Heart, Compass, Trees, Snowflake, ArrowRight,
  MapPin, Phone, Mail, Clock, ChevronDown, Star, Camera,
  Leaf, Mountain, Wind, CheckCircle, HelpCircle, Car, Plane
} from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

async function getHomeData() {
  try {
    const [roomsRes, settingsRes] = await Promise.all([
      fetch(`${API_URL}/api/rooms`, { next: { revalidate: 60 } }),
      fetch(`${API_URL}/api/settings`, { next: { revalidate: 60 } }),
    ]);
    const rooms = await roomsRes.json();
    const settings = await settingsRes.json();
    return { rooms, settings };
  } catch {
    return {
      rooms: [],
      settings: {
        resortName: "Misty Heights Resort",
        tagline: "A Serene Sanctuary Floating Above the Clouds",
        contactNumber: "+91 98765 43210",
        contactEmail: "stay@mistyheightsresort.com",
        address: "Ridge Road, Cloud Valley, Hillside District, HP, India",
        hasPromo: false,
        promoText: "",
        checkInTime: "2:00 PM",
        checkOutTime: "11:00 AM",
        cancellationPolicy: "Free cancellation up to 48 hours before check-in.",
        petPolicy: "Pets are not permitted on resort premises.",
        childPolicy: "Children above 5 years are welcome.",
      }
    };
  }
}

export default async function Home() {
  const { rooms, settings } = await getHomeData();
  const featuredRooms = (rooms || []).filter((r: { available: boolean }) => r.available).slice(0, 3);

  const amenitiesList = [
    { icon: Trees, title: "Scenic Hillside Hikes", desc: "Embark on guided hikes through pristine pine and cedar forests with expert naturalists." },
    { icon: Coffee, title: "Hillside Bistro & Dining", desc: "Savor local cuisine prepared by top chefs overlooking the misty valley." },
    { icon: Snowflake, title: "Infinity Heated Pool", desc: "Take a swim in our heated infinity pool that appears to float above the clouds." },
    { icon: Flame, title: "Bonfire & Star Gazing", desc: "Warm up by outdoor wood firepits under the crystal-clear mountain sky." },
    { icon: Heart, title: "Mountain Wellness Spa", desc: "Rejuvenate with organic herbal massages and hillside wellness rituals." },
    { icon: Compass, title: "Local Adventure Tours", desc: "Explore cultural trails, water streams, and breathtaking sunset viewpoints." },
  ];

  const faqItems = [
    { q: "What are the check-in and check-out times?", a: `Check-in: ${settings.checkInTime || "2:00 PM"}. Check-out: ${settings.checkOutTime || "11:00 AM"}. Early or late arrangements can be made with prior notice.` },
    { q: "What is the cancellation policy?", a: settings.cancellationPolicy || "Free cancellation up to 48 hours before check-in. 50% charge applies within 48 hours." },
    { q: "Are pets allowed at the resort?", a: settings.petPolicy || "Pets are not permitted on resort premises to protect the natural ecosystem." },
    { q: "What is the policy for children?", a: settings.childPolicy || "Children above 5 years are welcome. Please contact us for specific accommodation needs." },
    { q: "Is Wi-Fi available throughout the property?", a: "High-speed Wi-Fi is available in all rooms and common areas including the pool deck and spa lounge." },
    { q: "Do you offer group bookings or corporate retreats?", a: "Yes! We offer tailored corporate retreat packages for groups of 10 or more. Please use our contact form for custom pricing." },
  ];

  return (
    <div className="relative w-full">
      {/* Dynamic Promo Banner */}
      {settings.hasPromo && settings.promoText && (
        <div className="bg-emerald-800 text-stone-100 text-center py-2 px-4 text-xs font-medium tracking-wide animate-pulse sticky top-[68px] z-40 shadow-md">
          {settings.promoText}
        </div>
      )}

      {/* ─── HERO ─── */}
      <section className="relative w-full h-[95vh] flex flex-col justify-center items-center px-6 text-center">
        <div className="absolute inset-0 z-0">
          <Image src="/images/hero_hillside.jpg" alt="Misty Heights Resort Hillside View" fill className="object-cover" priority />
          <div className="absolute inset-0 bg-gradient-to-b from-stone-950/70 via-stone-950/45 to-stone-950" />
        </div>
        <div className="relative z-10 max-w-4xl flex flex-col items-center mt-12 mb-8">
          <span className="text-emerald-400 uppercase tracking-widest text-xs font-semibold mb-3 select-none">Welcome to Paradise</span>
          <h1 className="font-serif text-3xl md:text-5xl lg:text-6xl font-bold tracking-tight text-stone-50 leading-tight mb-4">
            {settings.resortName || "Misty Heights Resort"}
          </h1>
          <p className="text-xs md:text-sm text-stone-300 max-w-xl leading-relaxed tracking-wide font-light mb-8">
            {settings.tagline || "A Serene Sanctuary Floating Above the Clouds."} Experience modern comfort tucked inside dense pine forests.
          </p>
          <div className="flex items-center gap-4">
            <Link href="/rooms" className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold px-6 py-2.5 rounded transition-colors uppercase tracking-widest">
              Browse Rooms
            </Link>
            <Link href="/gallery" className="border border-stone-500 hover:border-emerald-500 text-stone-300 hover:text-emerald-400 text-xs font-semibold px-6 py-2.5 rounded transition-colors uppercase tracking-widest flex items-center gap-2">
              <Camera className="w-3.5 h-3.5" /> View Gallery
            </Link>
          </div>
        </div>
        <div className="relative z-10 w-full flex justify-center px-4">
          <SearchForm />
        </div>
      </section>

      {/* ─── ABOUT / INTRO ─── */}
      <section className="py-20 max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="flex flex-col gap-5">
          <span className="text-emerald-500 uppercase tracking-widest text-[10px] font-semibold">Nature Luxury</span>
          <h2 className="font-serif text-2xl md:text-3xl font-bold text-stone-100 leading-tight">
            Where Clouds Rest & Cedar Pines Whisper
          </h2>
          <p className="text-stone-400 text-xs leading-relaxed font-light">
            Escape the noise of daily life and immerse yourself in the mountain hills. At Misty Heights, we combine five-star luxury with natural wilderness. Wake up to soothing mist rolling over the ridges, hike through hidden cedar trails, and cap off your evening with dinner overlooking a starlit valley.
          </p>
          <p className="text-stone-400 text-xs leading-relaxed font-light">
            Every room and glass cottage has been handcrafted with local materials to blend seamlessly with the environment, providing panoramic views while keeping you warm with custom stone hearths.
          </p>
          <div className="mt-4 flex items-center gap-6">
            <Link href="/rooms" className="inline-flex items-center gap-1.5 text-xs text-emerald-400 hover:text-emerald-300 font-semibold tracking-wider uppercase border-b border-emerald-500/30 pb-0.5 transition-colors">
              Explore Accommodations <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <Link href="/gallery" className="inline-flex items-center gap-1.5 text-xs text-stone-400 hover:text-emerald-400 font-semibold tracking-wider uppercase border-b border-stone-600 pb-0.5 transition-colors">
              View Gallery <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="relative aspect-[4/5] rounded-md overflow-hidden shadow-lg transform translate-y-4">
            <Image src="/images/resort_dining.jpg" alt="Cozy dining area overlooking valleys" fill className="object-cover hover:scale-105 transition-transform duration-700" />
          </div>
          <div className="relative aspect-[4/5] rounded-md overflow-hidden shadow-lg">
            <Image src="/images/resort_pool.jpg" alt="Mountain infinity pool" fill className="object-cover hover:scale-105 transition-transform duration-700" />
          </div>
        </div>
      </section>

      {/* ─── STATS BAND ─── */}
      <section className="border-y border-stone-850/50 bg-stone-950/80">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-10 grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { number: "6,200ft", label: "Elevation Above Sea Level" },
            { number: "3", label: "Signature Room Categories" },
            { number: "12+", label: "On-Resort Experiences" },
            { number: "★ 4.9", label: "Average Guest Rating" },
          ].map((s, i) => (
            <div key={i} className="flex flex-col items-center text-center gap-1">
              <span className="font-serif text-2xl font-bold text-emerald-400">{s.number}</span>
              <span className="text-[10px] uppercase tracking-widest text-stone-500 font-semibold">{s.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ─── FEATURED ROOMS ─── */}
      <section className="bg-stone-920 py-20 border-b border-stone-850/50">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="text-center flex flex-col items-center gap-3 mb-12">
            <span className="text-emerald-500 uppercase tracking-widest text-[10px] font-semibold">Accommodations</span>
            <h2 className="font-serif text-2xl md:text-3xl font-bold text-stone-50">Luxury Hillside Cabins & Suites</h2>
            <p className="text-stone-400 text-xs max-w-lg leading-relaxed font-light">
              Each room includes private heated balconies, custom timber fittings, and high-speed Wi-Fi.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredRooms.map((room: { id: string; images: string[]; name: string; price: number; description: string; size: string; view: string; capacity: number }) => (
              <div key={room.id} className="bg-stone-950 border border-stone-850 rounded-md overflow-hidden shadow-xl hover:shadow-emerald-950/10 hover:border-stone-800 transition-all flex flex-col group">
                <div className="relative h-56 w-full overflow-hidden">
                  <Image src={room.images[0] || "/images/room_luxury_suite.jpg"} alt={room.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute top-3 right-3 bg-stone-950/70 backdrop-blur-sm text-emerald-400 text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-sm">
                    ${room.price} / Night
                  </div>
                </div>
                <div className="p-5 flex-grow flex flex-col gap-3">
                  <h3 className="font-serif text-base font-semibold text-stone-100 group-hover:text-emerald-400 transition-colors">{room.name}</h3>
                  <p className="text-[11px] text-stone-450 line-clamp-2 leading-relaxed">{room.description}</p>
                  <div className="flex justify-between items-center text-[10px] text-stone-400 pt-2 border-t border-stone-900/60 mt-auto">
                    <span>{room.size}</span>
                    <span>{room.view}</span>
                    <span>Max {room.capacity} Guests</span>
                  </div>
                </div>
                <div className="px-5 pb-5 pt-1">
                  <Link href={`/book?roomId=${room.id}`} className="w-full bg-emerald-600 hover:bg-emerald-500 text-stone-50 text-center font-medium text-xs tracking-wider uppercase py-2 rounded shadow transition-colors block">
                    Select Room
                  </Link>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link href="/rooms" className="inline-flex items-center gap-2 border border-stone-700 hover:border-emerald-600 text-stone-300 hover:text-emerald-400 text-xs font-semibold px-8 py-3 rounded uppercase tracking-widest transition-colors">
              View All Accommodations <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* ─── AMENITIES ─── */}
      <section className="py-20 max-w-7xl mx-auto px-6 md:px-12">
        <div className="text-center flex flex-col items-center gap-3 mb-12">
          <span className="text-emerald-500 uppercase tracking-widest text-[10px] font-semibold">Amenities</span>
          <h2 className="font-serif text-2xl md:text-3xl font-bold text-stone-50">A Curated Resort Experience</h2>
          <p className="text-stone-400 text-xs max-w-lg leading-relaxed font-light">
            Indulge in amenities designed to pamper your senses and connect you with the beautiful wild hillside.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {amenitiesList.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={idx} className="glass-panel p-5 rounded-md border border-stone-850 hover:border-emerald-500/20 transition-colors flex gap-4">
                <div className="p-2.5 bg-emerald-950/50 rounded-sm shrink-0 h-fit">
                  <Icon className="w-5 h-5 text-emerald-500" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <h3 className="font-serif text-stone-100 text-xs font-semibold tracking-wide">{item.title}</h3>
                  <p className="text-[11px] text-stone-450 leading-relaxed font-light">{item.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ─── HERITAGE SECTION ─── */}
      <section className="py-20 border-t border-stone-850/50 bg-stone-950/60">
        <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="relative aspect-square rounded-md overflow-hidden shadow-2xl order-last lg:order-first">
            <Image src="/images/resort_spa.jpg" alt="Cedar wellness spa at Misty Heights" fill className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-tr from-stone-950/60 to-transparent" />
            <div className="absolute bottom-5 left-5 flex flex-col gap-1">
              <span className="text-emerald-400 text-[10px] font-semibold uppercase tracking-widest">Since 2018</span>
              <span className="text-stone-200 text-xs font-light">Sustainable Mountain Hospitality</span>
            </div>
          </div>
          <div className="flex flex-col gap-6">
            <span className="text-emerald-500 uppercase tracking-widest text-[10px] font-semibold">Our Heritage</span>
            <h2 className="font-serif text-2xl md:text-3xl font-bold text-stone-100 leading-tight">
              Built from the Mountain, For the Mountain
            </h2>
            <p className="text-stone-400 text-xs leading-relaxed font-light">
              Misty Heights Resort was founded in 2018 with a singular vision: to create a luxury retreat that does not merely sit atop the hills, but truly belongs there. Every beam, every stone wall, and every wooden balcony was sourced from sustainable local forests and crafted by artisans from nearby hillside villages.
            </p>
            <p className="text-stone-400 text-xs leading-relaxed font-light">
              We run on 60% solar energy, harvest rainwater for non-potable use across the property, and our kitchen composts 100% of organic waste. Our eco-luxury philosophy means you can indulge without the guilt.
            </p>
            <div className="grid grid-cols-3 gap-4 mt-2">
              {[
                { icon: Leaf, label: "Solar Powered", sub: "60% renewable energy" },
                { icon: Wind, label: "Low Impact", sub: "Minimal land clearing" },
                { icon: Mountain, label: "Local Sourced", sub: "Community-built lodges" },
              ].map((s, i) => {
                const Icon = s.icon;
                return (
                  <div key={i} className="flex flex-col gap-1.5 items-center text-center bg-stone-950/60 border border-stone-800/40 rounded-md p-3">
                    <Icon className="w-5 h-5 text-emerald-500" />
                    <span className="text-stone-200 text-[10px] font-semibold uppercase tracking-wider">{s.label}</span>
                    <span className="text-stone-500 text-[9px]">{s.sub}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ─── TRAVEL GUIDE ─── */}
      <section className="py-20 border-t border-stone-850/50">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="text-center flex flex-col items-center gap-3 mb-12">
            <span className="text-emerald-500 uppercase tracking-widest text-[10px] font-semibold">Getting Here</span>
            <h2 className="font-serif text-2xl md:text-3xl font-bold text-stone-50">Your Journey to the Hillside</h2>
            <p className="text-stone-400 text-xs max-w-lg leading-relaxed font-light">
              Nestled at 6,200 feet above sea level in the Himachal Pradesh hills. Plan your arrival in advance for the best mountain experience.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: Plane,
                title: "By Air",
                distance: "Nearest Airport",
                desc: "Fly into Shimla Airport (SLV) or Chandigarh International Airport (IXC). From Chandigarh, it is a scenic 3.5-hour mountain drive to the resort.",
                note: "We can arrange private cab transfers from the airport upon request.",
              },
              {
                icon: Car,
                title: "By Road",
                distance: "Drive from Major Cities",
                desc: "Manali: 4hrs · Shimla: 2.5hrs · Delhi: 9hrs · Chandigarh: 3.5hrs. The route passes through pine-covered switchback roads — a journey in itself.",
                note: "A 4x4 or SUV is strongly recommended for the final 12km mountain stretch.",
              },
              {
                icon: MapPin,
                title: "Coordinates",
                distance: "Precise Location",
                desc: settings.address || "Ridge Road, Cloud Valley, Hillside District, HP, India",
                note: "Use Google Maps and search 'Misty Heights Resort Hillside'. Our concierge team is reachable by phone to guide you through the last mile.",
              },
            ].map((card, i) => {
              const Icon = card.icon;
              return (
                <div key={i} className="glass-panel border border-stone-850 rounded-md p-6 flex flex-col gap-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-emerald-950/50 rounded-sm shrink-0">
                      <Icon className="w-5 h-5 text-emerald-500" />
                    </div>
                    <div>
                      <h3 className="font-serif text-stone-100 text-sm font-semibold">{card.title}</h3>
                      <span className="text-[9px] text-emerald-600 uppercase tracking-widest font-semibold">{card.distance}</span>
                    </div>
                  </div>
                  <p className="text-[11px] text-stone-400 leading-relaxed">{card.desc}</p>
                  <p className="text-[10px] text-stone-500 border-t border-stone-800/60 pt-3 italic">{card.note}</p>
                </div>
              );
            })}
          </div>

          {/* Check In / Check Out Policy Notice */}
          <div className="mt-10 bg-emerald-950/20 border border-emerald-900/30 rounded-md px-6 py-5 grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              { icon: Clock, label: "Check-In", value: settings.checkInTime || "2:00 PM" },
              { icon: Clock, label: "Check-Out", value: settings.checkOutTime || "11:00 AM" },
              { icon: Phone, label: "Arrival Concierge", value: settings.contactNumber || "+91 98765 43210" },
            ].map((info, i) => {
              const Icon = info.icon;
              return (
                <div key={i} className="flex items-center gap-3">
                  <Icon className="w-4 h-4 text-emerald-500 shrink-0" />
                  <div>
                    <span className="text-[9px] uppercase tracking-widest text-stone-500 font-semibold">{info.label}</span>
                    <p className="text-stone-300 text-xs font-semibold">{info.value}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── GUEST REVIEWS ─── */}
      <section className="py-20 bg-stone-950/60 border-t border-stone-850/50">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="text-center flex flex-col items-center gap-3 mb-12">
            <span className="text-emerald-500 uppercase tracking-widest text-[10px] font-semibold">Guest Reviews</span>
            <h2 className="font-serif text-2xl md:text-3xl font-bold text-stone-50">Voices from the Hills</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { name: "Priya Sharma", from: "Mumbai, India", rating: 5, text: "Words cannot describe how magical waking up to the mist rolling over the valley felt. The glass suite was absolutely breathtaking. The staff went above and beyond for every request." },
              { name: "James & Anya Cole", from: "London, UK", rating: 5, text: "Our honeymoon at Misty Heights was the most perfect week of our lives. The infinity pool at sunset, the bonfires, the spa — every single detail was thoughtfully crafted. We are coming back!" },
              { name: "Rohan Mehta", from: "Bangalore, India", rating: 5, text: "Took a solo writing retreat here. The pine cabin with the skylight was the most serene creative space I've ever worked in. Zero distractions, 100% inspiration. A hidden paradise." },
            ].map((r, i) => (
              <div key={i} className="glass-panel border border-stone-850 rounded-md p-6 flex flex-col gap-4">
                <div className="flex gap-0.5">
                  {Array.from({ length: r.rating }).map((_, si) => (
                    <Star key={si} className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <p className="text-[11px] text-stone-300 leading-relaxed italic">&ldquo;{r.text}&rdquo;</p>
                <div className="border-t border-stone-800/60 pt-3">
                  <p className="text-stone-200 text-xs font-semibold">{r.name}</p>
                  <p className="text-stone-500 text-[10px]">{r.from}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── GALLERY TEASER ─── */}
      <section className="py-16 border-t border-stone-850/50">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="flex items-center justify-between mb-8">
            <div>
              <span className="text-emerald-500 uppercase tracking-widest text-[10px] font-semibold">Gallery</span>
              <h2 className="font-serif text-2xl font-bold text-stone-50 mt-1">Glimpse Into the Retreat</h2>
            </div>
            <Link href="/gallery" className="flex items-center gap-2 text-xs text-emerald-400 hover:text-emerald-300 font-semibold uppercase tracking-widest border-b border-emerald-600/40 pb-0.5 transition-colors">
              Full Gallery <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { src: "/images/hero_hillside.jpg", label: "The Ridge" },
              { src: "/images/resort_pool.jpg", label: "Infinity Pool" },
              { src: "/images/room_luxury_suite.jpg", label: "Glass Suite" },
              { src: "/images/resort_dining.jpg", label: "Valley Bistro" },
            ].map((img, i) => (
              <Link key={i} href="/gallery" className={`relative overflow-hidden rounded-md shadow-lg group ${i === 0 ? "row-span-2" : ""}`} style={{ aspectRatio: i === 0 ? "3/4" : "4/3" }}>
                <Image src={img.src} alt={img.label} fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                  <span className="text-white text-xs font-semibold">{img.label}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FAQs ─── */}
      <section className="py-20 bg-stone-950/60 border-t border-stone-850/50">
        <div className="max-w-4xl mx-auto px-6 md:px-12">
          <div className="text-center flex flex-col items-center gap-3 mb-12">
            <span className="text-emerald-500 uppercase tracking-widest text-[10px] font-semibold">FAQs</span>
            <h2 className="font-serif text-2xl md:text-3xl font-bold text-stone-50">Frequently Asked Questions</h2>
          </div>
          <div className="flex flex-col gap-3">
            {faqItems.map((faq, i) => (
              <details key={i} className="group glass-panel border border-stone-800/50 rounded-md overflow-hidden">
                <summary className="flex items-center justify-between px-5 py-4 cursor-pointer list-none hover:bg-stone-900/40 transition-colors">
                  <span className="text-stone-200 text-xs font-semibold flex items-center gap-2">
                    <HelpCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    {faq.q}
                  </span>
                  <ChevronDown className="w-4 h-4 text-stone-500 group-open:rotate-180 transition-transform shrink-0" />
                </summary>
                <div className="px-5 pb-4 pt-1 border-t border-stone-800/40">
                  <p className="text-stone-400 text-[11px] leading-relaxed">{faq.a}</p>
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CONTACT ─── */}
      <section id="contact" className="bg-stone-920 py-20 border-t border-stone-850/50">
        <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="flex flex-col gap-5">
            <span className="text-emerald-500 uppercase tracking-widest text-[10px] font-semibold">Contact Us</span>
            <h2 className="font-serif text-2xl md:text-3xl font-bold text-stone-50">Plan Your Mountain Getaway</h2>
            <p className="text-stone-400 text-xs leading-relaxed font-light">
              Have questions about booking availability, group retreats, or corporate packages? Our dedicated hospitality team is always here to assist.
            </p>
            <div className="flex flex-col gap-4 text-xs text-stone-300 mt-2">
              <div className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                <div>
                  <span className="text-[9px] uppercase tracking-wider text-emerald-600/80 font-semibold block">Location</span>
                  <span>{settings.address || "Ridge Road, Cloud Valley, HP, India"}</span>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Phone className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                <div>
                  <span className="text-[9px] uppercase tracking-wider text-emerald-600/80 font-semibold block">Phone</span>
                  <span>{settings.contactNumber || "+91 98765 43210"}</span>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Mail className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                <div>
                  <span className="text-[9px] uppercase tracking-wider text-emerald-600/80 font-semibold block">Email</span>
                  <span>{settings.contactEmail || "stay@mistyheightsresort.com"}</span>
                </div>
              </div>
            </div>
          </div>
          <div>
            <ContactForm />
          </div>
        </div>
      </section>
    </div>
  );
}
