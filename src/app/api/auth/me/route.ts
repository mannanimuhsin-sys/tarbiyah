import { NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { db } from '@/lib/db';

export async function GET(req: Request) {
  try {
    const authHeader = req.headers.get('authorization');
    let token = '';

    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7);
    } else {
      const cookieHeader = req.headers.get('cookie') || '';
      const match = cookieHeader.match(/tarbiyah_session=([^;]+)/);
      if (match) {
        token = match[1];
      }
    }

    if (!token) {
      return NextResponse.json({ authenticated: false, user: null }, { status: 401 });
    }

    const payload = await verifyToken(token);
    if (!payload) {
      return NextResponse.json({ authenticated: false, user: null }, { status: 401 });
    }

    let extraData = {};
    if (payload.role === 'student') {
      const student = db.getStudentById(payload.id);
      if (student) {
        extraData = {
          gender: student.gender,
          age: student.age,
          currentLevel: student.currentLevel,
          currentSurah: student.currentSurah,
          currentAyah: student.currentAyah,
          hifzJuzCompleted: student.hifzJuzCompleted,
          attendanceRate: student.attendanceRate,
          registrationStatus: student.registrationStatus,
          address: student.address,
          parentName: student.parentName,
          parentMobile: student.parentMobile,
        };
      }
    }

    return NextResponse.json({
      authenticated: true,
      user: {
        ...payload,
        ...extraData
      }
    });
  } catch (err) {
    return NextResponse.json({ authenticated: false, user: null }, { status: 500 });
  }
}

export async function POST() {
  const response = NextResponse.json({ success: true, message: "Logged out successfully" });
  response.cookies.delete('tarbiyah_session');
  return response;
}
