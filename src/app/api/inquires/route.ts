import { NextResponse } from 'next/server';
import { readDb, writeDb, Inquiry } from '@/lib/db';

export async function GET() {
  const db = readDb();
  return NextResponse.json(db.inquiries);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, message } = body;
    
    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Missing required contact fields' }, { status: 400 });
    }
    
    const db = readDb();
    const inquiryId = `INQ-${Math.floor(2000 + Math.random() * 8000)}`;
    
    const newInquiry: Inquiry = {
      id: inquiryId,
      name,
      email,
      message,
      createdAt: new Date().toISOString(),
      status: 'Unread'
    };
    
    db.inquiries.push(newInquiry);
    writeDb(db);
    
    return NextResponse.json(newInquiry, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, status } = body;
    
    if (!id || !status) {
      return NextResponse.json({ error: 'Inquiry ID and status are required' }, { status: 400 });
    }
    
    const db = readDb();
    const index = db.inquiries.findIndex(i => i.id === id);
    
    if (index === -1) {
      return NextResponse.json({ error: 'Inquiry not found' }, { status: 404 });
    }
    
    db.inquiries[index].status = status;
    writeDb(db);
    
    return NextResponse.json(db.inquiries[index]);
  } catch (error) {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
  }
}
