import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  const classes = db.getLiveClasses();
  return NextResponse.json({ classes });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, subject, teacherId, teacherName, provider, meetingLink, meetingId, meetingPasscode, startTime, durationMinutes, level, description } = body;

    if (!title || !subject || !teacherName || !provider || !meetingLink || !startTime) {
      return NextResponse.json({ error: "Missing required class fields" }, { status: 400 });
    }

    const created = db.createLiveClass({
      title,
      subject,
      teacherId: teacherId || 'tch-001',
      teacherName,
      provider,
      meetingLink,
      meetingId,
      meetingPasscode,
      startTime,
      durationMinutes: durationMinutes ? parseInt(durationMinutes, 10) : 45,
      level: level || 'All Levels',
      status: 'scheduled',
      description
    });

    return NextResponse.json({ success: true, liveClass: created }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: "Failed to schedule live class" }, { status: 500 });
  }
}
