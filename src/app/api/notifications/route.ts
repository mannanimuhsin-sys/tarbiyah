import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const studentId = searchParams.get('studentId') || undefined;
  const list = await db.getNotifications(studentId);
  return NextResponse.json({ notifications: list });
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { id } = body;
    if (id) {
      await db.markNotificationRead(id);
    }
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: "Failed to update notification" }, { status: 500 });
  }
}
