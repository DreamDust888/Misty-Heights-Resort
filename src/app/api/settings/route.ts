import { NextResponse } from 'next/server';
import { readDb, writeDb } from '@/lib/db';

export async function GET() {
  const db = readDb();
  return NextResponse.json(db.settings);
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const db = readDb();
    
    db.settings = { ...db.settings, ...body };
    writeDb(db);
    
    return NextResponse.json(db.settings);
  } catch (error) {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
  }
}
