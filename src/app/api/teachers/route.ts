import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  const teachers = await db.getTeachers();
  return NextResponse.json({ teachers });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { fullName, email, mobileNumber, qualification, specialization, bio } = body;

    if (!fullName || !mobileNumber || !qualification || !specialization) {
      return NextResponse.json({ error: "Required teacher fields are missing" }, { status: 400 });
    }

    const newTeacher = await db.createTeacher({
      fullName,
      email: email || `${fullName.toLowerCase().replace(/\s+/g, '')}@tarbiyah.edu`,
      mobileNumber,
      qualification,
      specialization,
      bio: bio || "Certified Ustadh dedicated to Islamic character and Quranic excellence.",
      isActive: true,
      assignedClassesCount: 0
    });

    return NextResponse.json({ teacher: newTeacher }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: "Failed to add teacher" }, { status: 500 });
  }
}
