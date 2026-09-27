import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const settings = await db.getSettings();
    return NextResponse.json({ settings });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to load settings' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const updated = await db.updateSettings(body);
    return NextResponse.json({ settings: updated });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to save settings' }, { status: 500 });
  }
}
