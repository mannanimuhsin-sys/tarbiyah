import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const student = db.getStudentById(params.id);
  if (!student) {
    return NextResponse.json({ error: "Student not found" }, { status: 404 });
  }
  return NextResponse.json({ student });
}

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();
    const { action, status, ...updates } = body;

    if (action === 'approve') {
      const ok = db.updateStudentStatus(params.id, 'approved');
      if (!ok) return NextResponse.json({ error: "Student not found" }, { status: 404 });
      return NextResponse.json({ success: true, message: "Student approved successfully" });
    }

    if (action === 'reject') {
      const ok = db.updateStudentStatus(params.id, 'rejected');
      if (!ok) return NextResponse.json({ error: "Student not found" }, { status: 404 });
      return NextResponse.json({ success: true, message: "Student rejected" });
    }

    const updated = db.updateStudent(params.id, updates);
    if (!updated) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, student: updated });
  } catch (err) {
    return NextResponse.json({ error: "Failed to update student" }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  const deleted = db.deleteStudent(params.id);
  if (!deleted) {
    return NextResponse.json({ error: "Student not found" }, { status: 404 });
  }
  return NextResponse.json({ success: true, message: "Student deleted successfully" });
}
