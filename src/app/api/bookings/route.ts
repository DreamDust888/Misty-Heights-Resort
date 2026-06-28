import { NextResponse } from 'next/server';
import { readDb, writeDb, Booking } from '@/lib/db';

export async function GET() {
  const db = readDb();
  return NextResponse.json(db.bookings);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { roomId, guestName, guestEmail, guestPhone, checkIn, checkOut, guestsCount, totalPrice } = body;
    
    if (!roomId || !guestName || !guestEmail || !checkIn || !checkOut || !guestsCount || !totalPrice) {
      return NextResponse.json({ error: 'Missing required booking fields' }, { status: 400 });
    }
    
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    if (checkOutDate <= checkInDate) {
      return NextResponse.json({ error: 'Check-out date must be after check-in date' }, { status: 400 });
    }
    
    const db = readDb();
    
    const hasOverlap = db.bookings.some(booking => {
      if (booking.roomId !== roomId || booking.status === 'Cancelled') {
        return false;
      }
      return (
        checkInDate < new Date(booking.checkOut) &&
        checkOutDate > new Date(booking.checkIn)
      );
    });
    
    if (hasOverlap) {
      return NextResponse.json({ error: 'Room is already booked for these dates' }, { status: 409 });
    }
    
    const bookingId = `B-${Math.floor(1000 + Math.random() * 9000)}`;
    
    const newBooking: Booking = {
      id: bookingId,
      roomId,
      guestName,
      guestEmail,
      guestPhone: guestPhone || '',
      checkIn,
      checkOut,
      guestsCount,
      totalPrice,
      status: 'Pending',
      createdAt: new Date().toISOString()
    };
    
    db.bookings.push(newBooking);
    writeDb(db);
    
    return NextResponse.json(newBooking, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, status } = body;
    
    if (!id || !status) {
      return NextResponse.json({ error: 'Booking ID and status are required' }, { status: 400 });
    }
    
    const db = readDb();
    const index = db.bookings.findIndex(b => b.id === id);
    
    if (index === -1) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }
    
    db.bookings[index].status = status;
    writeDb(db);
    
    return NextResponse.json(db.bookings[index]);
  } catch (error) {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
  }
}
