import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const studentId = searchParams.get('studentId');
  const code = searchParams.get('code');

  if (code) {
    const certs = await db.getCertificates();
    const cert = certs.find(c => c.verificationCode === code);
    if (!cert) return NextResponse.json({ error: "Certificate verification failed. Code not found." }, { status: 404 });
    return NextResponse.json({ verified: true, certificate: cert });
  }

  if (studentId) {
    const list = await db.getCertificatesByStudent(studentId);
    return NextResponse.json({ certificates: list });
  }

  return NextResponse.json({ certificates: await db.getCertificates() });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { studentId, courseOrAchievement, grade } = body;

    if (!studentId || !courseOrAchievement) {
      return NextResponse.json({ error: "studentId and courseOrAchievement are required" }, { status: 400 });
    }

    const student = await db.getStudentById(studentId);
    if (!student) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 });
    }

    const certNum = `TRB-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const newCert = await db.createCertificate({
      certificateNumber: certNum,
      studentId: student.id,
      studentName: student.fullName,
      courseOrAchievement,
      issueDate: new Date().toISOString().split('T')[0],
      grade: grade || 'Mumtaz (Excellence)'
    });

    return NextResponse.json({ success: true, certificate: newCert }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: "Failed to issue certificate" }, { status: 500 });
  }
}
