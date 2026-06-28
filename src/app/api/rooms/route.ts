import { NextResponse } from 'next/server';
import { readDb, writeDb, Room } from '@/lib/db';

export async function GET() {
  const db = readDb();
  return NextResponse.json(db.rooms);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const db = readDb();
    
    const newRoom: Room = {
      ...body,
      id: body.id || body.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    };
    
    if (db.rooms.some(r => r.id === newRoom.id)) {
      return NextResponse.json({ error: 'Room ID already exists' }, { status: 400 });
    }
    
    db.rooms.push(newRoom);
    writeDb(db);
    
    return NextResponse.json(newRoom, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    if (!body.id) {
      return NextResponse.json({ error: 'Room ID is required' }, { status: 400 });
    }
    
    const db = readDb();
    const index = db.rooms.findIndex(r => r.id === body.id);
    
    if (index === -1) {
      return NextResponse.json({ error: 'Room not found' }, { status: 404 });
    }
    
    db.rooms[index] = { ...db.rooms[index], ...body };
    writeDb(db);
    
    return NextResponse.json(db.rooms[index]);
  } catch (error) {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ error: 'Room ID is required' }, { status: 400 });
    }
    
    const db = readDb();
    const index = db.rooms.findIndex(r => r.id === id);
    
    if (index === -1) {
      return NextResponse.json({ error: 'Room not found' }, { status: 404 });
    }
    
    db.rooms.splice(index, 1);
    writeDb(db);
    
    return NextResponse.json({ message: 'Room deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}
