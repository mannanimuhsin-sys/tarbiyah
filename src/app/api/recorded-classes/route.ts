import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const subject = searchParams.get('subject');
  const level = searchParams.get('level');

  let list = db.getRecordedClasses();

  if (subject && subject !== 'all') {
    list = list.filter(v => v.subject === subject);
  }

  if (level && level !== 'all') {
    list = list.filter(v => v.level === level);
  }

  return NextResponse.json({ videos: list });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, description, subject, level, teacherName, videoUrl, thumbnailUrl, durationSeconds, tags } = body;

    if (!title || !subject || !teacherName || !videoUrl) {
      return NextResponse.json({ error: "Title, subject, teacher name, and video URL are required" }, { status: 400 });
    }

    const created = db.createRecordedClass({
      title,
      description: description || "Tarbiyah recorded lecture series.",
      subject,
      level: level || 'Beginner',
      teacherName,
      videoUrl,
      thumbnailUrl: thumbnailUrl || "https://images.unsplash.com/photo-1609599006353-e629aaabfeae?w=600&auto=format&fit=crop&q=80",
      durationSeconds: durationSeconds ? parseInt(durationSeconds, 10) : 1200,
      tags: tags || [subject, level]
    });

    return NextResponse.json({ success: true, video: created }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: "Failed to upload/register recorded video" }, { status: 500 });
  }
}
