import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search')?.toLowerCase() || '';
    const status = searchParams.get('status');
    const id = searchParams.get('id');

    if (id) {
      const student = db.getStudentById(id);
      if (!student) {
        return NextResponse.json({ error: "Student not found" }, { status: 404 });
      }
      return NextResponse.json({ student });
    }

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

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { id, registrationStatus, fullName, password, parentName, parentMobile, address, age, gender, currentLevel } = body;

    if (!id) {
      return NextResponse.json({ error: "Student ID is required" }, { status: 400 });
    }

    const updates: Record<string, any> = {};

    // 1. Status Approval Update
    if (registrationStatus) {
      if (['approved', 'rejected', 'pending'].includes(registrationStatus)) {
        updates.registrationStatus = registrationStatus;
      }
    }

    // 2. Profile updates (Name & Password editable, Mobile Number NEVER allowed to change)
    if (fullName !== undefined && fullName.trim()) updates.fullName = fullName.trim();
    if (password !== undefined && password.trim()) updates.password = password.trim();
    if (parentName !== undefined) updates.parentName = parentName;
    if (parentMobile !== undefined) updates.parentMobile = parentMobile;
    if (address !== undefined) updates.address = address;
    if (age !== undefined) updates.age = parseInt(age, 10);
    if (gender !== undefined) updates.gender = gender;
    if (currentLevel !== undefined) updates.currentLevel = currentLevel;

    // Mobile number is strictly IMMUTABLE per requirements:
    // "വിദ്യാർത്ഥികൾക്ക് അവരുടെ പാസ്വേഡുകൾ എഡിറ്റ് പേരുകൾ എഡിറ്റ് ചെയ്യാൻ ഉള്ള ഓപ്ഷൻ വേണം നമ്പർ ഒരിക്കലും എഡിറ്റ് ചെയ്യാൻ പാടില്ല അത് ഫിക്സഡ് ആയിരിക്കണം"
    delete (updates as any).mobileNumber;

    const updated = db.updateStudent(id, updates);
    if (!updated) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, student: updated });
  } catch (err) {
    return NextResponse.json({ error: "Failed to update student" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: "Student ID is required" }, { status: 400 });
    }

    const success = db.deleteStudent(id);
    if (!success) {
      return NextResponse.json({ error: "Student not found or already deleted" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Student deleted successfully" });
  } catch (err) {
    return NextResponse.json({ error: "Failed to delete student" }, { status: 500 });
  }
}
