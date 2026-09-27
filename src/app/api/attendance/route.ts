import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const studentId = searchParams.get('studentId');
    const date = searchParams.get('date');

    let list = await db.getAttendance();

    if (studentId) {
      list = list.filter(a => a.studentId === studentId);
    }

    if (date) {
      list = list.filter(a => a.date === date);
    }

    // Sort by date descending (most recent first)
    list.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    const totalRecords = list.length;
    const presentRecords = list.filter(a => a.status === 'present' || a.status === 'late').length;
    const absentRecords = list.filter(a => a.status === 'absent').length;
    const overallPercentage = totalRecords > 0 
      ? Math.round((presentRecords / totalRecords) * 100 * 10) / 10 
      : 0;

    return NextResponse.json({
      records: list,
      stats: {
        totalRecords,
        presentRecords,
        absentRecords,
        overallPercentage,
      }
    });
  } catch (err) {
    return NextResponse.json({ error: "Failed to retrieve attendance" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { studentId, date, status, remarks, markedBy } = body;

    if (!studentId || !date || !status) {
      return NextResponse.json({ error: "studentId, date, and status are required" }, { status: 400 });
    }

    const student = await db.getStudentById(studentId);
    const saved = await db.markAttendance({
      studentId,
      studentName: student ? student.fullName : 'Student',
      date,
      status,
      remarks: remarks || '',
      markedBy: markedBy || 'Admin'
    });

    return NextResponse.json({ success: true, record: saved });
  } catch (err) {
    return NextResponse.json({ error: "Failed to record attendance" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: "Attendance Record ID is required" }, { status: 400 });
    }

    const success = await db.deleteAttendance(id);
    if (!success) {
      return NextResponse.json({ error: "Record not found or already deleted" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Attendance record deleted successfully" });
  } catch (err) {
    return NextResponse.json({ error: "Failed to delete attendance record" }, { status: 500 });
  }
}
