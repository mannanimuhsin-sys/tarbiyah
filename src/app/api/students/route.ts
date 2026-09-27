import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search')?.toLowerCase() || '';
    const status = searchParams.get('status');

    let students = db.getStudents();

    if (status && status !== 'all') {
      students = students.filter(s => s.registrationStatus === status);
    }

    if (search) {
      students = students.filter(s => 
        s.fullName.toLowerCase().includes(search) ||
        s.mobileNumber.includes(search) ||
        s.parentName.toLowerCase().includes(search)
      );
    }

    return NextResponse.json({
      students,
      stats: {
        total: db.getStudents().length,
        approved: db.getStudents().filter(s => s.registrationStatus === 'approved').length,
        pending: db.getStudents().filter(s => s.registrationStatus === 'pending').length,
        rejected: db.getStudents().filter(s => s.registrationStatus === 'rejected').length,
      }
    });
  } catch (err) {
    return NextResponse.json({ error: "Failed to retrieve students" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const result = db.createStudent(body);
    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }
    return NextResponse.json({ student: result.student }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: "Failed to create student" }, { status: 500 });
  }
}
