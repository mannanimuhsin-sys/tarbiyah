import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { signToken } from '@/lib/auth';
import { UserSession } from '@/lib/types';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { username, mobileNumber, password, role } = body;

    // 1. Super Admin Authentication Check
    if (role === 'super_admin' || username === 'admin') {
      if (username === 'admin' && password === '4321') {
        const session: UserSession = {
          id: 'admin-super-01',
          name: 'Super Admin',
          role: 'super_admin',
          username: 'admin'
        };
        const token = await signToken(session);
        const response = NextResponse.json({
          success: true,
          token,
          user: session
        });
        response.cookies.set('tarbiyah_session', token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          maxAge: 60 * 60 * 24 * 7,
          path: '/'
        });
        return response;
      }
      return NextResponse.json({ error: "Invalid Admin username or password." }, { status: 401 });
    }

    // 2. Student Authentication Check
    if (mobileNumber) {
      const cleanMobile = mobileNumber.toString().replace(/\D/g, '');
      const student = db.getStudentByMobile(cleanMobile);

      if (!student) {
        return NextResponse.json({ error: "No student registered with this mobile number." }, { status: 404 });
      }

      // Verify Password (fallback or match)
      if (student.password && student.password !== password) {
        return NextResponse.json({ error: "Incorrect password. Please verify and try again." }, { status: 401 });
      }

      // Check Registration Approval Status
      if (student.registrationStatus === 'pending') {
        return NextResponse.json({ 
          error: "Your registration is currently Pending Admin Approval. You cannot log in until your application is reviewed and approved by the Principal.",
          status: 'pending'
        }, { status: 403 });
      }

      if (student.registrationStatus === 'rejected') {
        return NextResponse.json({ 
          error: "Your registration application was not approved by administration. Please contact the office.",
          status: 'rejected'
        }, { status: 403 });
      }

      const session: UserSession = {
        id: student.id,
        name: student.fullName,
        role: 'student',
        mobileNumber: student.mobileNumber
      };

      const token = await signToken(session);
      const response = NextResponse.json({
        success: true,
        token,
        user: {
          ...session,
          gender: student.gender,
          age: student.age,
          currentLevel: student.currentLevel,
          hifzJuzCompleted: student.hifzJuzCompleted,
          attendanceRate: student.attendanceRate
        }
      });

      response.cookies.set('tarbiyah_session', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24 * 7,
        path: '/'
      });

      return response;
    }

    return NextResponse.json({ error: "Missing login credentials." }, { status: 400 });
  } catch (err) {
    console.error("Login API error:", err);
    return NextResponse.json({ error: "Authentication server error." }, { status: 500 });
  }
}
