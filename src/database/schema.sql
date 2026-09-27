-- ====================================================================
-- TARBIYAH ISLAMIC EDUCATION PLATFORM - POSTGRESQL / SUPABASE SCHEMA
-- "Learn Quran. Build Character. Grow in Faith."
-- ====================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. USERS & ROLES
CREATE TYPE user_role AS ENUM ('super_admin', 'teacher', 'student', 'parent');
CREATE TYPE registration_status AS ENUM ('pending', 'approved', 'rejected');
CREATE TYPE gender_type AS ENUM ('male', 'female');
CREATE TYPE attendance_status AS ENUM ('present', 'absent', 'late', 'excused');
CREATE TYPE class_type AS ENUM ('qaida', 'quran_reading', 'tajweed', 'hifz', 'islamic_studies', 'arabic_language');
CREATE TYPE live_provider AS ENUM ('zoom', 'google_meet');

-- 3. STUDENTS TABLE
CREATE TABLE IF NOT EXISTS students (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    full_name VARCHAR(150) NOT NULL,
    mobile_number VARCHAR(20) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    gender gender_type NOT NULL,
    age INT NOT NULL CHECK (age >= 4 AND age <= 100),
    address TEXT NOT NULL,
    parent_name VARCHAR(150) NOT NULL,
    parent_mobile VARCHAR(20) NOT NULL,
    registration_status registration_status DEFAULT 'pending',
    avatar_url TEXT,
    enrollment_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    current_level VARCHAR(50) DEFAULT 'Beginner',
    current_surah INT DEFAULT 1,
    current_ayah INT DEFAULT 1,
    hifz_juz_completed INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_students_mobile ON students(mobile_number);
CREATE INDEX IF NOT EXISTS idx_students_status ON students(registration_status);

-- 4. TEACHERS TABLE
CREATE TABLE IF NOT EXISTS teachers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    full_name VARCHAR(150) NOT NULL,
    email VARCHAR(150) UNIQUE,
    mobile_number VARCHAR(20) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    qualification VARCHAR(255) NOT NULL,
    specialization VARCHAR(100) NOT NULL, -- e.g. Hifz, Tajweed, Qira'at
    bio TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. LIVE CLASSES TABLE
CREATE TABLE IF NOT EXISTS live_classes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(200) NOT NULL,
    subject class_type NOT NULL,
    teacher_id UUID REFERENCES teachers(id) ON DELETE SET NULL,
    teacher_name VARCHAR(150) NOT NULL,
    provider live_provider NOT NULL DEFAULT 'google_meet',
    meeting_link TEXT NOT NULL,
    meeting_id VARCHAR(100),
    meeting_passcode VARCHAR(50),
    start_time TIMESTAMP WITH TIME ZONE NOT NULL,
    duration_minutes INT NOT NULL DEFAULT 45,
    level VARCHAR(50) DEFAULT 'All Levels',
    status VARCHAR(20) DEFAULT 'scheduled', -- 'scheduled', 'live', 'completed', 'cancelled'
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. RECORDED CLASSES TABLE (Cloudflare R2 / Video Storage)
CREATE TABLE IF NOT EXISTS recorded_classes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(250) NOT NULL,
    description TEXT,
    subject class_type NOT NULL,
    level VARCHAR(50) NOT NULL, -- 'Beginner', 'Intermediate', 'Advanced'
    teacher_name VARCHAR(150) NOT NULL,
    video_url TEXT NOT NULL, -- Cloudflare R2 or CDN Stream URL
    thumbnail_url TEXT,
    duration_seconds INT NOT NULL DEFAULT 0,
    tags TEXT[],
    views_count INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 7. ATTENDANCE TABLE
CREATE TABLE IF NOT EXISTS attendance (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    status attendance_status NOT NULL DEFAULT 'present',
    class_id UUID REFERENCES live_classes(id) ON DELETE SET NULL,
    remarks TEXT,
    marked_by VARCHAR(100) DEFAULT 'Admin',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(student_id, date)
);

CREATE INDEX IF NOT EXISTS idx_attendance_student_date ON attendance(student_id, date);

-- 8. PROGRAMS & COMPETITIONS TABLE
CREATE TABLE IF NOT EXISTS programs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(200) NOT NULL,
    category VARCHAR(50) NOT NULL, -- 'Musabaqa', 'Islamic Competition', 'Annual Program', 'Workshop'
    description TEXT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    venue_or_link TEXT,
    rules TEXT,
    rewards TEXT,
    banner_url TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- PROGRAM PARTICIPATIONS
CREATE TABLE IF NOT EXISTS program_participations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    program_id UUID NOT NULL REFERENCES programs(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    status VARCHAR(50) DEFAULT 'registered', -- 'registered', 'qualified', 'winner', 'runner_up'
    position VARCHAR(50),
    submission_link TEXT,
    registered_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(program_id, student_id)
);

-- 9. NOTIFICATIONS TABLE
CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50) NOT NULL DEFAULT 'general', -- 'class_reminder', 'announcement', 'attendance', 'exam'
    target_role VARCHAR(50) DEFAULT 'all', -- 'all', 'student', 'teacher'
    student_id UUID REFERENCES students(id) ON DELETE CASCADE, -- NULL if broadcast
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 10. CERTIFICATES TABLE
CREATE TABLE IF NOT EXISTS certificates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    certificate_number VARCHAR(50) NOT NULL UNIQUE,
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    student_name VARCHAR(150) NOT NULL,
    course_or_achievement VARCHAR(200) NOT NULL,
    issue_date DATE NOT NULL,
    grade VARCHAR(20) DEFAULT 'Excellence (Mumtaz)',
    verification_code VARCHAR(100) NOT NULL UNIQUE,
    qr_code_data TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 11. PROGRESS REPORTS & QURAN REVISION
CREATE TABLE IF NOT EXISTS progress_reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    report_month VARCHAR(20) NOT NULL, -- e.g. "September 2026"
    attendance_rate DECIMAL(5,2) NOT NULL,
    qaida_progress INT DEFAULT 100, -- %
    tajweed_score INT DEFAULT 85, -- score / 100
    hifz_surahs_memorized TEXT[],
    revision_quality VARCHAR(50) DEFAULT 'Good (Jayyid Jiddan)',
    teacher_notes TEXT,
    conduct VARCHAR(50) DEFAULT 'Excellent',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 12. ROW LEVEL SECURITY (RLS) FOR SUPABASE
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE live_classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE progress_reports ENABLE ROW LEVEL SECURITY;
