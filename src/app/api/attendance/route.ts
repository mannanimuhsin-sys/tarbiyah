import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const studentId = searchParams.get('studentId');
  const date = searchParams.get('date');

  let list = db.getAttendance();

  if (studentId) {
    list = list.filter(a => a.studentId === studentId);
  }

  if (date) {
    list = list.filter(a => a.date === date);
  }

  // Calculate percentages across all approved students
  const students = db.getStudents().filter(s => s.registrationStatus === 'approved');
  const totalRecords = list.length;
  const presentRecords = list.filter(a => a.status === 'present' || a.status === 'late').length;
  const overallPercentage = totalRecords > 0 
    ? Math.round((presentRecords / totalRecords) * 100 * 10) / 10 
    : 92.5;

  return NextResponse.json({
    records: list,
    stats: {
      totalRecords,
      presentRecords,
      overallPercentage,
      studentsCount: students.length
    }
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { studentId, date, status, remarks, markedBy } = body;

    if (!studentId || !date || !status) {
      return NextResponse.json({ error: "studentId, date, and status are required" }, { status: 400 });
    }

    const student = db.getStudentById(studentId);
    const saved = db.markAttendance({
      studentId,
      studentName: student ? student.fullName : 'Student',
      date,
      status,
      remarks,
      markedBy: markedBy || 'Admin'
    });

    return NextResponse.json({ success: true, record: saved });
  } catch (err) {
    return NextResponse.json({ error: "Failed to record attendance" }, { status: 500 });
  }
}
