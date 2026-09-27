import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { fullName, mobileNumber, password, gender, age, address, parentName, parentMobile } = body;

    if (!fullName || !mobileNumber || !password || !gender || !age || !address || !parentName || !parentMobile) {
      return NextResponse.json({ error: "All registration fields are required." }, { status: 400 });
    }

    const cleanMobile = mobileNumber.toString().replace(/\D/g, '');
    const cleanParentMobile = parentMobile.toString().replace(/\D/g, '');

    if (cleanMobile.length < 10) {
      return NextResponse.json({ error: "Please enter a valid 10-digit mobile number." }, { status: 400 });
    }

    // Call DB creation which validates uniqueness
    const result = db.createStudent({
      fullName: fullName.trim(),
      mobileNumber: cleanMobile,
      password: password,
      gender,
      age: parseInt(age, 10),
      address: address.trim(),
      parentName: parentName.trim(),
      parentMobile: cleanParentMobile,
      enrollmentDate: new Date().toISOString()
    });

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 409 });
    }

    return NextResponse.json({
      success: true,
      message: "Student registration submitted successfully. Your account is pending Admin approval.",
      student: {
        id: result.student?.id,
        fullName: result.student?.fullName,
        mobileNumber: result.student?.mobileNumber,
        status: result.student?.registrationStatus
      }
    }, { status: 201 });
  } catch (err) {
    console.error("Registration error:", err);
    return NextResponse.json({ error: "Internal server error occurred during registration." }, { status: 500 });
  }
}
