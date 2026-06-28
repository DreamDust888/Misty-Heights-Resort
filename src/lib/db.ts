import fs from 'fs';
import path from 'path';

const dbPath = path.join(process.cwd(), 'data', 'db.json');

export interface Room {
  id: string;
  name: string;
  description: string;
  price: number;
  capacity: number;
  beds: string;
  size: string;
  view: string;
  amenities: string[];
  images: string[];
  available: boolean;
}

export interface Booking {
  id: string;
  roomId: string;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  checkIn: string;
  checkOut: string;
  guestsCount: number;
  totalPrice: number;
  status: 'Pending' | 'Confirmed' | 'Cancelled';
  createdAt: string;
}

export interface Settings {
  resortName: string;
  tagline: string;
  contactNumber: string;
  contactEmail: string;
  address: string;
  promoText: string;
  hasPromo: boolean;
  taxRate: number;
  extraBedPrice: number;
}

export interface Inquiry {
  id: string;
  name: string;
  email: string;
  message: string;
  createdAt: string;
  status: 'Unread' | 'Read';
}

export interface Database {
  rooms: Room[];
  bookings: Booking[];
  settings: Settings;
  inquiries: Inquiry[];
}

export function readDb(): Database {
  try {
    if (!fs.existsSync(dbPath)) {
      return { rooms: [], bookings: [], settings: {} as Settings, inquiries: [] };
    }
    const data = fs.readFileSync(dbPath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading database:', error);
    return { rooms: [], bookings: [], settings: {} as Settings, inquiries: [] };
  }
}

export function writeDb(data: Database): boolean {
  try {
    const dir = path.dirname(dbPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2), 'utf8');
    return true;
  } catch (error) {
    console.error('Error writing database:', error);
    return false;
  }
}
