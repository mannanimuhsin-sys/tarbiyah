import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  const programs = await db.getPrograms();
  return NextResponse.json({ programs });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { action, programId, studentId, ...progData } = body;

    if (action === 'participate' && programId && studentId) {
      const ok = await db.participateProgram(programId, studentId);
      if (!ok) return NextResponse.json({ error: "Program not found" }, { status: 404 });
      return NextResponse.json({ success: true, message: "Registered for program successfully" });
    }

    if (!progData.title || !progData.category || !progData.startDate || !progData.endDate) {
      return NextResponse.json({ error: "Title, category, startDate, and endDate are required" }, { status: 400 });
    }

    const created = await db.createProgram({
      title: progData.title,
      category: progData.category,
      description: progData.description || "",
      startDate: progData.startDate,
      endDate: progData.endDate,
      venueOrLink: progData.venueOrLink || "Tarbiyah Campus & Online",
      rules: progData.rules,
      rewards: progData.rewards,
      isActive: true
    });

    return NextResponse.json({ success: true, program: created }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: "Failed to process program" }, { status: 500 });
  }
}
