import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const classes = await db.getLiveClasses();
    return NextResponse.json({ classes });
  } catch (err) {
    return NextResponse.json({ error: "Failed to retrieve live classes" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, meetingLink, startTime, durationMinutes, level, description, teacherName } = body;

    if (!title || !meetingLink || !startTime) {
      return NextResponse.json({ error: "Title, Google Meet link, and Date & Time are required" }, { status: 400 });
    }

    const created = await db.createLiveClass({
      title,
      meetingLink: meetingLink.trim(),
      startTime: startTime.trim(),
      durationMinutes: durationMinutes ? parseInt(durationMinutes, 10) : 45,
      subject: 'quran_reading',
      teacherId: 'admin-01',
      teacherName: teacherName || 'ഉസ്താദ്',
      provider: 'google_meet',
      level: level || 'All Levels',
      status: 'scheduled',
      description: description || 'ഗൂഗിൾ മീറ്റ് വഴി ലൈവ് ക്ലാസ്'
    });

    return NextResponse.json({ success: true, liveClass: created }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: "Failed to schedule live class" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: "Live Class ID is required" }, { status: 400 });
    }

    const success = await db.deleteLiveClass(id);
    if (!success) {
      return NextResponse.json({ error: "Live class not found or already deleted" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Live class deleted successfully" });
  } catch (err) {
    return NextResponse.json({ error: "Failed to delete live class" }, { status: 500 });
  }
}
