import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

function formatYouTubeUrl(url: string): string {
  if (!url) return '';
  const clean = url.trim();
  // Handle youtube.com/watch?v=ID
  const matchWatch = clean.match(/[?&]v=([^&#]+)/);
  if (matchWatch && matchWatch[1]) {
    return `https://www.youtube.com/embed/${matchWatch[1]}`;
  }
  // Handle youtu.be/ID
  const matchShort = clean.match(/youtu\.be\/([^?&#]+)/);
  if (matchShort && matchShort[1]) {
    return `https://www.youtube.com/embed/${matchShort[1]}`;
  }
  // Handle youtube.com/embed/ID
  if (clean.includes('/embed/')) {
    return clean;
  }
  return clean;
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const classNumber = searchParams.get('classNumber');

    let list = db.getRecordedClasses();

    if (classNumber && classNumber !== 'all') {
      list = list.filter(v => v.classNumber === classNumber);
    }

    return NextResponse.json({ videos: list });
  } catch (err) {
    return NextResponse.json({ error: "Failed to retrieve recorded classes" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, description, youtubeUrl, videoUrl, classNumber, teacherName, subject, level } = body;

    const finalVideoUrl = formatYouTubeUrl(youtubeUrl || videoUrl);

    if (!title || !finalVideoUrl) {
      return NextResponse.json({ error: "Title and YouTube Video URL are required." }, { status: 400 });
    }

    const created = db.createRecordedClass({
      title,
      description: description || "ക്ലാസ് വിവരണം നൽകിയിട്ടില്ല.",
      classNumber: classNumber || "ക്ലാസ് 1",
      youtubeUrl: youtubeUrl || videoUrl,
      videoUrl: finalVideoUrl,
      subject: subject || 'islamic_studies',
      level: level || 'All Levels',
      teacherName: teacherName || "ഉസ്താദ്",
      durationSeconds: 1200,
      tags: [classNumber || 'General']
    });

    return NextResponse.json({ success: true, video: created }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: "Failed to save recorded class" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: "Class ID is required" }, { status: 400 });
    }

    const success = db.deleteRecordedClass(id);
    if (!success) {
      return NextResponse.json({ error: "Class not found or already deleted" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Recorded class deleted successfully" });
  } catch (err) {
    return NextResponse.json({ error: "Failed to delete recorded class" }, { status: 500 });
  }
}
